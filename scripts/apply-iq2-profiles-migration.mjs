/**
 * Apply Handball IQ 2.0 profiles migration via Chrome SQL editor session.
 * Usage: node scripts/apply-iq2-profiles-migration.mjs
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';

const PROJECT = 'kcirngycafwooavgyymz';
const FILE = 'supabase/migrations/20260807120000_handball_iq_2_profiles.sql';

function loadSql(rel) {
  return readFileSync(join(process.cwd(), rel), 'utf8').replace(/^\/\*[\s\S]*?\*\//, '').trim();
}

const chromeUserData = join(os.homedir(), 'Library/Application Support/Google/Chrome');
const browser = await chromium.launchPersistentContext(chromeUserData, {
  channel: 'chrome',
  headless: false,
  args: ['--profile-directory=Default'],
});

const page = browser.pages()[0] || (await browser.newPage());

try {
  const sql = loadSql(FILE);
  await page.goto(`https://supabase.com/dashboard/project/${PROJECT}/sql/new`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });
  await page.waitForTimeout(2500);

  if (page.url().includes('sign-in')) {
    throw new Error('Not signed in to Supabase dashboard. Sign in in the opened Chrome window, then re-run.');
  }

  const editor = page.locator('.monaco-editor').first();
  await editor.waitFor({ state: 'visible', timeout: 60000 });
  await editor.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await page.keyboard.insertText(sql);
  await page.getByRole('button', { name: 'Run' }).click({ timeout: 15000 });
  await page.waitForTimeout(5000);

  const body = await page.locator('body').innerText();
  const errMatch = body.match(/ERROR:[^\n]+/i);
  const ok =
    /Success|Rows? returned|No rows|Success\. No rows/i.test(body) &&
    !/ERROR:|syntax error/i.test(body);

  if (!ok) {
    console.error(JSON.stringify({ migrationResult: 'FAIL', error: errMatch?.[0] || body.slice(0, 400) }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ migrationResult: 'PASS', file: FILE }, null, 2));
  }
} catch (e) {
  console.error(JSON.stringify({ migrationResult: 'FAIL', error: String(e.message) }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
