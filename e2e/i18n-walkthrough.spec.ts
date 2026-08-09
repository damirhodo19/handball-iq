import { test, expect, Page } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join } from 'path';

type Lang = 'en' | 'hr' | 'de';

const ROUTES = [
  '/login',
  '/(tabs)/home',
  '/(tabs)/training',
  '/(tabs)/match-day',
  '/(tabs)/progress',
  '/(tabs)/profile',
  '/(tabs)/settings',
  '/session',
  '/match/intro',
  '/coach',
  '/post-match-review',
];

const ENGLISH_MARKERS = [
  'Play Match',
  'Settings',
  'Training',
  'Continue',
  'Decision Score',
  'Your goalkeeper',
  'Begin Session',
  'Back to Home',
];

const KEY_PATTERN = /^[a-z]+\.[a-zA-Z0-9.]+$/;

async function setLanguage(page: Page, lang: Lang) {
  await page.addInitScript((l) => {
    window.localStorage.setItem('handball_iq_language', l);
    window.localStorage.setItem('handball_iq_dev_auth', 'true');
  }, lang);
}

async function screenshot(page: Page, lang: Lang, name: string) {
  const dir = join(process.cwd(), 'e2e-screenshots', lang);
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true });
}

async function assertNoFallbackKeys(page: Page) {
  const body = await page.locator('body').innerText();
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (KEY_PATTERN.test(line)) {
      throw new Error(`Fallback translation key visible: ${line}`);
    }
  }
}

async function assertNoEnglishOnLocalized(page: Page, lang: Lang) {
  if (lang === 'en') return;
  const body = await page.locator('body').innerText();
  for (const marker of ENGLISH_MARKERS) {
    // Word-boundary match: German compounds like "Trainingsplan" are not English UI leaks.
    const re = new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-zÄÖÜäöüß]|$)`);
    if (re.test(body)) {
      throw new Error(`English marker "${marker}" found on ${lang} screen`);
    }
  }
}

for (const lang of ['en', 'hr', 'de'] as Lang[]) {
  test.describe(`${lang.toUpperCase()} walkthrough`, () => {
    test(`complete app walkthrough (${lang})`, async ({ page }) => {
      await setLanguage(page, lang);

      // Login / dev auth entry
      await page.goto('/');
      await page.waitForTimeout(2500);

      const testUserBtn = page.getByText(/test|Testnutzer|testni/i);
      if (await testUserBtn.count()) {
        await testUserBtn.first().click();
        await page.waitForTimeout(1500);
      }

      await screenshot(page, lang, '00-entry');

      for (const route of ROUTES) {
        try {
          await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
          await page.waitForTimeout(1200);
          const safeName = route.replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'root';
          await screenshot(page, lang, safeName);
          await assertNoFallbackKeys(page);
          await assertNoEnglishOnLocalized(page, lang);
        } catch (e) {
          await screenshot(page, lang, `${route.replace(/[^\w-]+/g, '_')}_error`);
          console.warn(`Route ${route} (${lang}):`, e);
        }
      }

      // Language switch smoke on settings
      await page.goto('/(tabs)/settings');
      await page.waitForTimeout(1000);
      const langRow = page.getByText(/Language|Jezik|Sprache/i).first();
      if (await langRow.count()) {
        await langRow.click();
        await page.waitForTimeout(500);
        await screenshot(page, lang, 'settings-language-modal');
      }

      expect(await page.locator('body').innerText()).not.toMatch(/home\.[a-z]+/);
    });
  });
}
