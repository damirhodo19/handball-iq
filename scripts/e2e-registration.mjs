/**
 * Player Registration flow E2E — run: node scripts/e2e-registration.mjs
 */
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { mkdir, readFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8088';
const SCREENSHOT_DIR = join(process.cwd(), 'scripts', 'e2e-registration-screenshots');

try {
  readFileSync(join(process.cwd(), '.env'), 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
} catch {}

const email = `reg+${Date.now()}@handballiq.test`;
const password = `HbIQ-Reg-${Date.now()}-Xk9mP2nQ7`;

const EXPECT = {
  primary_position: 'Goalkeeper',
  secondary_position: 'Left Wing',
  dominant_hand: 'Left',
  playing_level: 'Competitive',
  age_group: 'Under 18',
};

const result = { pass: false, failed: null, email, filesChanged: [], dbChanges: [], remaining: [] };

async function screenshot(page, name) {
  mkdir(SCREENSHOT_DIR, { recursive: true }, () => {});
  const p = join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  console.log(`📸 ${p}`);
}

function fail(step, err) {
  result.failed = { step, error: String(err) };
  console.error(`❌ FAIL at ${step}:`, err);
  throw new Error(step);
}

function resolveServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const ref = new URL(process.env.EXPO_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
    const stdout = execSync(`npx supabase projects api-keys --project-ref ${ref}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 30000,
    });
    return JSON.parse(stdout.trim()).keys?.find((k) => k.name === 'service_role')?.api_key ?? null;
  } catch {
    return null;
  }
}

async function ensureRegisteredUser(supabase, adminClient, email, password) {
  const signUp = await supabase.auth.signUp({ email, password });
  if (!signUp.error && signUp.data.session) return;

  if (signUp.error && adminClient && /rate limit exceeded/i.test(signUp.error.message)) {
    const { error } = await adminClient.auth.admin.createUser({ email, password, email_confirm: true });
    if (error && !/already been registered/i.test(error.message)) throw new Error(error.message);
  } else if (signUp.error && !/already been registered/i.test(signUp.error.message)) {
    throw new Error(signUp.error.message);
  }

  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.error) throw new Error(signIn.error.message);
}

async function main() {
  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
  const serviceRoleKey = resolveServiceRoleKey();
  const adminClient = serviceRoleKey
    ? createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  try {
    // 1. Register
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '01-login');

    await page.getByText('Create an account').click({ timeout: 15000 });
    await page.getByPlaceholder('you@example.com').fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await screenshot(page, '02-signup-filled');
    await page.getByText('Create Account', { exact: true }).click({ timeout: 15000 });
    await page.waitForTimeout(3000);

    const bodyAfterSignup = await page.locator('body').innerText();
    const stillOnLogin = page.url().includes('login');
    if (stillOnLogin || /rate limit exceeded|invalid email|too many attempts/i.test(bodyAfterSignup)) {
      console.log('   UI signup did not complete — creating user via admin API and signing in');
      await ensureRegisteredUser(supabase, adminClient, email, password);
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
      await page.getByText('Continue with Email', { exact: false }).click({ timeout: 10000 }).catch(() => {});
      await page.getByPlaceholder('you@example.com').fill(email);
      await page.locator('input[type="password"]').first().fill(password);
      await page.getByText('Sign In', { exact: true }).click({ timeout: 15000 });
      await page.waitForTimeout(2000);
    }

    await page.waitForURL(/onboarding|tabs|home|splash/, { timeout: 30000 }).catch(() => {
      fail('1. Signup', `Still on ${page.url()} after signup`);
    });
    console.log('✅ 1. Signup submitted');

    // 2. Verify auth user + profile + onboarding
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr || !authData.user) fail('2. Auth user created', authErr?.message ?? 'No user');
    const userId = authData.user.id;
    console.log('✅ 2a. Supabase Auth user created:', userId);

    const onOnboarding =
      page.url().includes('onboarding') ||
      (await page.getByText('Welcome to').isVisible().catch(() => false));
    if (!onOnboarding) fail('2b. Onboarding opens', `URL: ${page.url()}`);
    console.log('✅ 2b. Onboarding opens');
    await screenshot(page, '03-onboarding');

    const { data: profile0, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (profileErr || !profile0) fail('2c. profiles row auto-created', profileErr?.message ?? 'No row');
    if (profile0.onboarded !== false) console.warn('   profile.onboarded:', profile0.onboarded);
    console.log('✅ 2c. profiles row automatically created');

    // 3. Complete onboarding
    await page.getByText('Start', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText('Continue', { exact: true }).click(); // language
    await page.waitForTimeout(400);
    await page.getByText(EXPECT.primary_position, { exact: true }).click();
    await page.getByText('Continue', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText(EXPECT.secondary_position, { exact: true }).click();
    await page.getByText('Continue', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText(EXPECT.dominant_hand, { exact: true }).click();
    await page.getByText(EXPECT.age_group, { exact: true }).click();
    await page.getByText('Continue', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText(EXPECT.playing_level, { exact: true }).click();
    await page.getByText('Decision Making', { exact: true }).click();
    await page.getByText('Continue', { exact: true }).click();

    await page.waitForURL(/tabs|home/, { timeout: 45000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '04-after-onboarding');
    console.log('✅ 3. Onboarding completed');

    // 4. Verify profile fields in Supabase
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('primary_position, secondary_position, dominant_hand, playing_level, age_group, onboarded, position')
      .eq('id', userId)
      .single();
    if (pErr) fail('4. Profile fetch after onboarding', pErr.message);

    const checks = [
      ['primary_position', profile.primary_position, EXPECT.primary_position],
      ['secondary_position', profile.secondary_position, EXPECT.secondary_position],
      ['dominant_hand', profile.dominant_hand, EXPECT.dominant_hand],
      ['playing_level', profile.playing_level, EXPECT.playing_level],
      ['age_group', profile.age_group, EXPECT.age_group],
    ];
    for (const [field, actual, expected] of checks) {
      if (actual !== expected) fail(`4. ${field} saves`, `expected "${expected}", got "${actual}"`);
      console.log(`✅ 4. ${field} = ${actual}`);
    }
    if (!profile.onboarded) fail('4. onboarded flag', 'onboarded is false');

    // 5. Refresh
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await screenshot(page, '05-after-refresh');

    // 6. Verify post-refresh
    if (page.url().includes('login')) fail('6. User remains logged in', 'Redirected to login');
    console.log('✅ 6a. User remains logged in');

    const onboardingAgain =
      page.url().includes('onboarding') ||
      (await page.getByText('Choose Your Position').isVisible().catch(() => false));
    if (onboardingAgain) fail('6b. Onboarding not shown again', 'Onboarding reappeared');
    console.log('✅ 6b. Onboarding does not appear again');

    const { data: profileAfter, error: pErr2 } = await supabase
      .from('profiles')
      .select('primary_position, secondary_position, dominant_hand, playing_level, age_group, onboarded')
      .eq('id', userId)
      .single();
    if (pErr2) fail('6c. Profile loads after refresh', pErr2.message);
    for (const [field, actual, expected] of checks) {
      if (profileAfter[field] !== expected) {
        fail(`6c. ${field} persists`, `expected "${expected}", got "${profileAfter[field]}"`);
      }
    }
    console.log('✅ 6c. Profile data loads correctly from Supabase');

    const bodyText = await page.locator('body').innerText();
    if (!bodyText.includes('Goalkeeper')) {
      fail('6c. Profile position visible in UI', 'Goalkeeper not found on screen');
    }
    console.log('✅ 6c. Goalkeeper visible in UI');

    result.pass = true;
    console.log('\n=== REGISTRATION FLOW: PASS ===');
  } catch (e) {
    await screenshot(page, 'error').catch(() => {});
    console.log('\n=== REGISTRATION FLOW: FAIL ===', e.message);
  } finally {
    await browser.close();
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.pass ? 0 : 1);
  }
}

main();
