/**
 * Match Simulator full E2E validation — run: node scripts/e2e-match.mjs
 */
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { mkdir, readFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8088';
const SCREENSHOT_DIR = join(process.cwd(), 'scripts', 'e2e-match-screenshots');

try {
  readFileSync(join(process.cwd(), '.env'), 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
} catch {}

const result = {
  pass: false,
  failed: null,
  player: null,
  matchRating: null,
  decisionScore: null,
  supabaseInserts: [],
  filesChanged: [],
  dbChanges: [],
  screenshots: [],
  remaining: [],
};

async function screenshot(page, name) {
  mkdir(SCREENSHOT_DIR, { recursive: true }, () => {});
  const p = join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  result.screenshots.push(p);
  console.log(`📸 ${p}`);
}

function fail(step, err) {
  result.failed = { step, error: String(err) };
  console.error(`❌ FAIL at ${step}:`, err);
  throw new Error(step);
}

function createFreshPlayer() {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    email: `match.e2e.${stamp}@example.com`,
    password: `HbIQ-Match-${Date.now()}-Xk9mP2nQ7`,
  };
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
    const json = JSON.parse(stdout.trim());
    return json.keys?.find((k) => k.name === 'service_role')?.api_key ?? null;
  } catch {
    return null;
  }
}

function createAdminClient() {
  const serviceRoleKey = resolveServiceRoleKey();
  if (!serviceRoleKey || !process.env.EXPO_PUBLIC_SUPABASE_URL) return null;
  return createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function printAuthSession(session, label) {
  console.log(`   ${label}:`, JSON.stringify({
    userId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    hasAccessToken: Boolean(session?.access_token),
    expiresAt: session?.expires_at ?? null,
  }, null, 2));
}

async function createFreshAuthSession(supabase, adminClient, creds) {
  console.log(`   signUp: ${creds.email}`);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: creds.email,
    password: creds.password,
  });

  if (signUpErr) {
    console.error('Supabase signUp error:', signUpErr.message);
    if (adminClient && /rate limit exceeded/i.test(signUpErr.message)) {
      console.log('   signUp rate-limited — creating confirmed user via admin API');
      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email: creds.email,
        password: creds.password,
        email_confirm: true,
      });
      if (createErr) {
        console.error('Supabase admin createUser error:', createErr.message);
        fail('registration', createErr.message);
      }
      if (!created.user?.id) fail('registration', 'admin createUser returned no user');
    } else {
      fail('registration', signUpErr.message);
    }
  } else {
    printAuthSession(signUpData.session, 'signUp session');
    if (signUpData.session) return signUpData.session;
    console.log('   No active session after signUp — signing in with same credentials');
  }

  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  });
  if (signInErr) {
    console.error('Supabase signIn error:', signInErr.message);
    fail('registration', signInErr.message);
  }
  printAuthSession(signInData.session, 'signIn session');
  if (!signInData.session?.user) {
    fail('registration', 'No session after signUp/signIn');
  }
  return signInData.session;
}

async function isAuthenticatedUI(page) {
  if (await page.getByText('Welcome to').isVisible().catch(() => false)) return true;
  if (await page.getByText('Play Match').first().isVisible().catch(() => false)) return true;
  if (await page.getByText(/Good (morning|afternoon|evening)/i).isVisible().catch(() => false)) return true;
  return false;
}

async function waitForAuthenticatedUI(page, actionLabel) {
  await page.waitForTimeout(1500);
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (await page.getByText('Welcome to').isVisible().catch(() => false)) return 'onboarding';
    if (await page.getByText('Play Match').first().isVisible().catch(() => false)) return 'home';
    if (await page.getByText(/Good (morning|afternoon|evening)/i).isVisible().catch(() => false)) return 'home';

    const authError = await readVisibleAuthError(page);
    if (authError) {
      console.error(`UI auth error after ${actionLabel}: ${authError}`);
      fail(actionLabel, authError);
    }
    await page.waitForTimeout(500);
  }

  const authError = await readVisibleAuthError(page);
  if (authError) {
    console.error(`UI auth error after ${actionLabel}: ${authError}`);
    fail(actionLabel, authError);
  }
  fail(actionLabel, `Timed out waiting for authenticated UI. URL=${page.url()}`);
}

async function loginViaUI(page, creds) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForURL(/login|onboarding|tabs|home|splash/, { timeout: 60000 });
  if (page.url().includes('splash')) {
    await page.waitForURL(/login|onboarding|tabs|home/, { timeout: 30000 });
  }
  await page.waitForTimeout(1500);

  if (await isAuthenticatedUI(page)) {
    console.log('   Browser already shows authenticated UI');
    return waitForAuthenticatedUI(page, 'login');
  }

  if (await page.getByText('Continue with Email').isVisible().catch(() => false)) {
    await page.getByText('Continue with Email').click({ timeout: 10000 });
  }

  await page.getByPlaceholder('you@example.com').waitFor({ timeout: 15000 });
  await page.getByPlaceholder('you@example.com').fill(creds.email);
  await page.locator('input[type="password"]').first().fill(creds.password);
  await page.getByText('Sign In', { exact: true }).click({ timeout: 15000 });

  return waitForAuthenticatedUI(page, 'login');
}

async function readVisibleAuthError(page) {
  const body = await page.locator('body').innerText();
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.find((line) =>
    /^Email address/i.test(line)
    || /^Password should/i.test(line)
    || / is invalid$/i.test(line)
    || /already registered/i.test(line)
    || /confirm your email/i.test(line)
    || /Unable to validate/i.test(line)
    || /Signups not allowed/i.test(line)
    || /rate limit exceeded/i.test(line)
    || /Invalid login credentials/i.test(line)
    || /Email not confirmed/i.test(line)
  ) ?? null;
}

async function registerFreshPlayer(page, supabase, creds, adminClient) {
  console.log(`   Creating fresh player: ${creds.email}`);

  const session = await createFreshAuthSession(supabase, adminClient, creds);
  printAuthSession(session, 'active auth session');

  const landed = await loginViaUI(page, creds);
  if (landed === 'onboarding') {
    await completeOnboarding(page);
  }
  await page.getByText('Play Match').first().waitFor({ timeout: 45000 });
  console.log(`✅ 1. Registered fresh player: ${creds.email}`);
  return session.user.id;
}

async function completeOnboarding(page) {
  await page.getByText('Start', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Goalkeeper', { exact: true }).click();
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Left Wing', { exact: true }).click();
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Left', { exact: true }).click();
  await page.getByText('Under 18', { exact: true }).click();
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText('Competitive', { exact: true }).click();
  await page.getByText('Decision Making', { exact: true }).click();
  await page.getByText('Continue', { exact: true }).click();
  await page.getByText('Play Match').first().waitFor({ timeout: 45000 });
  await page.waitForTimeout(1500);
}

async function clickFirstAnswer(page) {
  const clicked = await page.evaluate(() => {
    const letters = [...document.querySelectorAll('*')].filter(
      (el) => el.childElementCount === 0 && el.textContent?.trim() === 'A'
    );
    for (const letter of letters) {
      let node = letter.parentElement;
      for (let i = 0; i < 6 && node; i++) {
        const style = window.getComputedStyle(node);
        if (style.cursor === 'pointer' || node.getAttribute('tabindex') === '0') {
          node.click();
          return true;
        }
        node = node.parentElement;
      }
    }
    return false;
  });
  if (!clicked) {
    await page.locator('div').filter({ hasText: /^A$/ }).first().click({ force: true });
  }
}

async function readScoreboard(page) {
  const label = await page.locator('[aria-label*="Score"]').first().getAttribute('aria-label').catch(() => null);
  if (label) {
    const aria = label.match(/Score (\d+) to (\d+)/i);
    if (aria) return { team: Number(aria[1]), opp: Number(aria[2]) };
  }
  const text = await page.locator('body').innerText();
  const combined = text.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (combined) return { team: Number(combined[1]), opp: Number(combined[2]) };
  return null;
}

async function readTimer(page) {
  const text = await page.locator('body').innerText();
  const m = text.match(/(\d{2}):(\d{2})/);
  if (!m) return null;
  return { minute: Number(m[1]), second: Number(m[2]), raw: m[0] };
}

async function playSituation(page, situationNum, continueLabel) {
  await page.getByText(`Situation ${situationNum} of 15`, { exact: false }).waitFor({ timeout: 20000 });
  const timer = await readTimer(page);
  const score = await readScoreboard(page);
  if (!timer || timer.minute < 0 || timer.minute > 59) {
    fail(`timer situation ${situationNum}`, `Invalid timer: ${JSON.stringify(timer)}`);
  }
  if (!score || score.team < 0 || score.opp < 0) {
    fail(`score situation ${situationNum}`, `Invalid score: ${JSON.stringify(score)}`);
  }
  await clickFirstAnswer(page);
  await page.waitForTimeout(600);
  await page.getByText(/Correct!|Incorrect/).waitFor({ timeout: 15000 });
  await page.getByText(continueLabel, { exact: false }).click({ timeout: 15000 });
  await page.waitForTimeout(700);
  return { timer, score };
}

function trackSupabaseInserts(page) {
  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('/rest/v1/match_simulations')) return;
    if (response.request().method() !== 'POST') return;
    let body = null;
    try {
      body = response.request().postDataJSON();
    } catch {}
    result.supabaseInserts.push({
      status: response.status(),
      ok: response.ok(),
      body,
      at: Date.now(),
    });
  });
}

async function loginAsTestUser(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  if (await isAuthenticatedUI(page)) return;
  const testBtn = page.getByText(/Continue as Test User|Testnutzer|testni korisnik/i);
  await testBtn.waitFor({ timeout: 15000 });
  await testBtn.click({ timeout: 10000 });
  await waitForAuthenticatedUI(page, 'test-user login');
}

async function main() {
  const useTestUser = process.env.E2E_TEST_USER === '1';
  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
  const adminClient = createAdminClient();
  const creds = process.env.E2E_PLAYER_EMAIL && process.env.E2E_PLAYER_PASSWORD
    ? { email: process.env.E2E_PLAYER_EMAIL, password: process.env.E2E_PLAYER_PASSWORD }
    : createFreshPlayer();
  result.player = creds.email;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  trackSupabaseInserts(page);

  try {
    let userId;
    if (useTestUser) {
      await loginAsTestUser(page);
      result.player = 'test-user';
      console.log('✅ 1. Logged in as test user');
    } else {
      userId = await registerFreshPlayer(page, supabase, creds, adminClient);
      await screenshot(page, '01-logged-in-home');
    }

    // 2. Open Match Simulator
    await page.goto(`${BASE_URL}/match/intro`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await screenshot(page, '02-match-intro');
    console.log('✅ 2. Match Simulator opened');

    const insertCountBefore = result.supabaseInserts.length;

    if (!useTestUser) {
      await screenshot(page, '01-logged-in-home');
    }

    // 3. Start new match
    await page.getByText('Start Match', { exact: false }).click({ timeout: 15000 });
    await page.waitForURL(/match\/play/, { timeout: 15000 });
    await page.getByText('Situation 1 of 15').waitFor({ timeout: 20000 });
    console.log('✅ 3. New match started');
    await screenshot(page, '03-situation-1');

    const timer1 = await readTimer(page);
    const score1 = await readScoreboard(page);
    if (!timer1?.raw?.match(/^\d{2}:\d{2}$/)) fail('timer at start', `Bad timer: ${timer1?.raw}`);

    // 4–5. First half
    let prevScore = score1;
    const firstHalfMinutes = [timer1.minute];

    for (let n = 1; n <= 7; n++) {
      const data = await playSituation(page, n, 'Next Situation');
      firstHalfMinutes.push(data.timer.minute);
      if (data.score.team < prevScore.team || data.score.opp < prevScore.opp) {
        fail('score updates correctly', `Score decreased at situation ${n}`);
      }
      prevScore = data.score;
    }
    await playSituation(page, 8, 'Halftime');
    console.log('✅ 4. First half completed');
    console.log('✅ 5a. Score updates correctly (monotonic)');

    const maxFirstHalfMinute = Math.max(...firstHalfMinutes);
    if (maxFirstHalfMinute > 35) {
      fail('timer behaves correctly', `First-half minute too high: ${maxFirstHalfMinute}`);
    }
    console.log('✅ 5b. Timer behaves correctly');

    await page.getByText('Halftime', { exact: true }).waitFor({ timeout: 15000 });
    const htBody = await page.locator('body').innerText();
    if (!htBody.includes('Halftime')) fail('halftime screen appears', 'Halftime screen not visible');
    await screenshot(page, '04-halftime');
    console.log('✅ 5c. Halftime screen appears');

    // 6. Second half
    await page.getByText('Continue to Second Half', { exact: false }).click({ timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.getByText('Situation 9 of 15').waitFor({ timeout: 20000 });
    if (!(await page.locator('body').innerText()).includes('Second Half')) {
      fail('second half starts', 'Second Half label missing');
    }
    await screenshot(page, '05-second-half-start');
    console.log('✅ 6. Second half started');

    // 7. Complete match
    for (let n = 9; n <= 14; n++) {
      await playSituation(page, n, 'Next Situation');
    }
    await playSituation(page, 15, 'Full Time');
    console.log('✅ 7. Match completed');

    // 8. Final report
    await page.waitForURL(/match\/report/, { timeout: 20000 });
    await page.waitForTimeout(3000);
    const reportBody = await page.locator('body').innerText();

    if (reportBody.includes('Save Failed')) {
      fail('match_simulations write', 'Save Failed banner on report');
    }
    if (!reportBody.includes('Overall Rating')) fail('final report opens', 'Overall Rating missing');
    if (!reportBody.includes('Decision Score')) fail('decision score calculated', 'Decision Score missing');
    for (const label of ['Pressure Control', 'Reading', 'Consistency']) {
      if (!reportBody.includes(label)) fail('performance statistics shown', `Missing: ${label}`);
    }
    await screenshot(page, '06-final-report');

    const ratingMatch = reportBody.match(/(\d{1,3})\s*\n?\s*Overall Rating|Overall Rating[\s\S]{0,120}?(\d{1,3})/i);
    const rating = ratingMatch ? Number(ratingMatch[1] || ratingMatch[2]) : null;
    if (rating == null || Number.isNaN(rating)) fail('score calculated', 'Could not parse overall rating');
    result.matchRating = rating;

    const decisionMatch = reportBody.match(/Decision Score[\s\S]{0,40}?(\d{1,3})%/i);
    const decisionScore = decisionMatch ? Number(decisionMatch[1]) : null;
    if (decisionScore == null) fail('decision score calculated', 'Could not parse decision score');
    result.decisionScore = decisionScore;
    console.log(`✅ 8a. Report: rating=${rating}, decision=${decisionScore}%`);

    const newInserts = result.supabaseInserts.slice(insertCountBefore);
    const successfulInsert = newInserts.find((i) => i.ok && i.status >= 200 && i.status < 300);
    if (!useTestUser) {
      if (!successfulInsert) {
        const detail = newInserts.map((i) => `status=${i.status}`).join(', ') || 'no POST seen';
        fail('match_simulations row written to Supabase', detail);
      }
      if (successfulInsert.body?.overall_rating !== rating) {
        fail('Supabase payload overall_rating', `UI=${rating}, POST=${successfulInsert.body?.overall_rating}`);
      }
      if (successfulInsert.body?.decision_score !== decisionScore) {
        fail('Supabase payload decision_score', `UI=${decisionScore}, POST=${successfulInsert.body?.decision_score}`);
      }
      console.log(`✅ 8b. match_simulations POST ${successfulInsert.status} confirmed`);
    } else {
      console.log('✅ 8b. Skipped Supabase check (test user mode)');
    }

    const localMatches = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('hbiq_matches') || '[]');
      } catch {
        return [];
      }
    });
    if (!localMatches.length) fail('local match history', 'hbiq_matches empty');
    if (localMatches[0].matchRating !== rating) {
      fail('local match history rating', `expected ${rating}, got ${localMatches[0].matchRating}`);
    }

    const insertCountAfterMatch = result.supabaseInserts.length;

    // 9. Refresh
    await page.goto(`${BASE_URL}/(tabs)/home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await screenshot(page, '07-after-refresh');
    console.log('✅ 9. Application refreshed');

    // 10. Post-refresh verification
    const localAfter = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('hbiq_matches') || '[]');
      } catch {
        return [];
      }
    });
    const stillLocal = localAfter.find(
      (m) => m.matchRating === rating && m.decisionScore === decisionScore
    );
    if (!stillLocal) fail('refresh: local match history', 'Local match record missing after refresh');
    console.log('✅ 10a. Match history still exists (localStorage)');

    if (result.supabaseInserts.length !== insertCountAfterMatch) {
      fail('no duplicate record after refresh', `Inserts grew ${insertCountAfterMatch} → ${result.supabaseInserts.length}`);
    }
    console.log('✅ 10b. No duplicate Supabase insert on refresh');

    // Try SELECT if RLS fixed; otherwise note remaining issue
    if (!useTestUser) {
      const { data: rows, error: selErr } = await supabase
        .from('match_simulations')
        .select('id, overall_rating, decision_score')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (selErr) {
        fail('refresh: Supabase data matches', selErr.message);
      } else if (!rows?.length) {
        fail('refresh: Supabase row exists', 'No row returned after refresh');
      } else {
        if (rows[0].overall_rating !== rating || rows[0].decision_score !== decisionScore) {
          fail('refresh: Supabase data matches', `DB mismatch: rating=${rows[0].overall_rating}, decision=${rows[0].decision_score}`);
        }
        console.log('✅ 10c. Supabase row persists and matches after refresh');
      }
    } else {
      console.log('✅ 10c. Skipped Supabase refresh check (test user mode)');
    }

    result.pass = true;
    console.log('\n=== MATCH SIMULATOR E2E: PASS ===');
  } catch (e) {
    await screenshot(page, 'error').catch(() => {});
    console.log('\n=== MATCH SIMULATOR E2E: FAIL ===', e.message);
  } finally {
    await browser.close();
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.pass ? 0 : 1);
  }
}

main();
