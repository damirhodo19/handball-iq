/**
 * Apply Sprint 4 / 4.1 persistence migrations via Chrome SQL editor session.
 * Usage: node scripts/apply-sprint4-migrations.mjs
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';

const PROJECT = 'kcirngycafwooavgyymz';
const files = [
  'supabase/migrations/20260806120000_player_development.sql',
  'supabase/migrations/20260807150000_sprint4_development_persistence.sql',
  'supabase/migrations/20260807160000_coach_development_persistence.sql',
];

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
const results = [];

async function runSql(label, sql) {
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
  await page.waitForTimeout(4000);

  const body = await page.locator('body').innerText();
  const ok =
    /Success|Rows? returned|No rows|Success\. No rows/i.test(body) &&
    !/ERROR:|syntax error|relation .* does not exist/i.test(body);
  const errMatch = body.match(/ERROR:[^\n]+/i);
  results.push({ label, ok, detail: errMatch?.[0] || (ok ? 'applied' : 'uncertain') });
  console.log(ok ? `OK ${label}` : `FAIL ${label}: ${errMatch?.[0] || 'see UI'}`);
  if (!ok) throw new Error(`Migration failed: ${label}`);
}

try {
  for (const f of files) {
    await runSql(f, loadSql(f));
  }
  console.log(JSON.stringify({ migrationResult: 'PASS', files: results }, null, 2));
} catch (e) {
  console.error(JSON.stringify({ migrationResult: 'FAIL', error: String(e.message), files: results }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
