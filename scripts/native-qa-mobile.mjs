/**
 * Native QA proxy — mobile viewports (Android/iOS) via Playwright.
 * Run: node scripts/native-qa-mobile.mjs
 */
import { chromium, devices } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';

try {
  readFileSync(join(process.cwd(), '.env'), 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
} catch {}

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8088';

const VIEWPORTS = [
  { name: 'Android', device: devices['Pixel 7'] },
  { name: 'iOS', device: devices['iPhone 14'] },
];

const ROUTES = [
  { path: '/splash', label: 'Splash' },
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' },
  { path: '/forgot-password', label: 'Forgot password' },
];

const METRICS = [];

async function measure(page, name, fn) {
  const start = Date.now();
  await fn();
  const ms = Date.now() - start;
  METRICS.push({ name, ms });
  return ms;
}

async function runPlatform({ name, device }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();
  const bugs = [];
  const passed = [];

  try {
    const startupMs = await measure(page, `${name}:startup`, async () => {
      await page.goto(BASE_URL + '/splash', { waitUntil: 'networkidle', timeout: 30000 });
    });
    if (startupMs > 8000) bugs.push(`${name}: startup ${startupMs}ms exceeds 8s budget`);

    for (const route of ROUTES) {
      const navStart = Date.now();
      await page.goto(BASE_URL + route.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const navMs = Date.now() - navStart;
      METRICS.push({ name: `${name}:nav:${route.label}`, ms: navMs });
      if (navMs > 4000) bugs.push(`${name}: ${route.label} navigation ${navMs}ms > 4s`);

      const body = await page.locator('body').innerText();
      if (/undefined|null is not|Error:/i.test(body)) {
        bugs.push(`${name}: visible error on ${route.label}`);
      } else {
        passed.push(`${name}:${route.label}`);
      }
    }

    // Language switch on splash
    await page.goto(BASE_URL + '/splash');
    const langBtn = page.getByRole('button').filter({ hasText: /HR|DE|EN/i }).first();
    if (await langBtn.count()) {
      await langBtn.click();
      passed.push(`${name}:language-switch`);
    }

    // Safe area / scroll smoke on login
    await page.goto(BASE_URL + '/login');
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
    if (scrollHeight > clientHeight * 3) {
      bugs.push(`${name}: excessive scroll height on login (${scrollHeight}px)`);
    } else {
      passed.push(`${name}:login-layout`);
    }

    // Offline reload smoke (web SPA may show browser error — not a native crash)
    try {
      await context.setOffline(true);
      await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
      await context.setOffline(false);
      await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
      passed.push(`${name}:offline-recovery`);
    } catch {
      bugs.push(`${name}: offline recovery failed`);
    }

    const perf = METRICS.filter((m) => m.name.startsWith(name));
    return { platform: name, pass: bugs.length === 0, bugs, passed, perf, startupMs };
  } catch (err) {
    bugs.push(`${name}: fatal — ${err.message}`);
    return { platform: name, pass: false, bugs, passed, perf: [], startupMs: null };
  } finally {
    await browser.close();
  }
}

const results = [];
for (const vp of VIEWPORTS) {
  results.push(await runPlatform(vp));
}

const allBugs = results.flatMap((r) => r.bugs);
const summary = {
  pass: allBugs.length === 0,
  platforms: results,
  metrics: METRICS,
  bugCount: allBugs.length,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(allBugs.length ? 1 : 0);
