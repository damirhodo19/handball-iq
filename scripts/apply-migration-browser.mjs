/**
 * Apply migration via Supabase SQL Editor using system Chrome profile (GitHub session).
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';

const sql = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260804163000_fix_rls_recursion.sql.sql'),
  'utf8'
).replace(/^\/\*[\s\S]*?\*\//, '').trim();

const chromeUserData = join(os.homedir(), 'Library/Application Support/Google/Chrome');

const browser = await chromium.launchPersistentContext(chromeUserData, {
  channel: 'chrome',
  headless: false,
  args: ['--profile-directory=Default'],
});
const page = browser.pages()[0] || await browser.newPage();
await page.goto('https://supabase.com/dashboard/project/wsoffppwsrnwboptreby/sql/new', {
  waitUntil: 'networkidle',
  timeout: 120000,
});

if (page.url().includes('sign-in')) {
  await page.getByRole('button', { name: 'Continue with GitHub' }).click({ timeout: 15000 }).catch(() => {});
  await page.waitForURL(/dashboard\/project/, { timeout: 60000 }).catch(() => {});
}

if (!page.url().includes('/sql/')) {
  await page.goto('https://supabase.com/dashboard/project/wsoffppwsrnwboptreby/sql/new', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
}

await page.waitForTimeout(3000);
const editor = page.locator('.monaco-editor').first();
if (!(await editor.isVisible().catch(() => false))) {
  console.error('SQL editor not visible. URL:', page.url());
  await browser.close();
  process.exit(1);
}

await editor.click();
await page.keyboard.press('Control+A');
await page.keyboard.type(sql, { delay: 0 });
await page.getByRole('button', { name: 'Run' }).click({ timeout: 15000 });
await page.waitForTimeout(5000);

const body = await page.locator('body').innerText();
if (/error|failed/i.test(body) && !/success/i.test(body)) {
  console.error('Possible SQL error:', body.slice(0, 500));
  await browser.close();
  process.exit(1);
}

console.log('Migration applied via SQL editor');
await browser.close();
