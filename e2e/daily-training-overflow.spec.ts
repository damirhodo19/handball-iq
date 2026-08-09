import { test, expect, Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

type Lang = 'en' | 'hr' | 'de';

async function seedPlayer(page: Page, lang: Lang, theme: 'light' | 'dark' = 'light') {
  const language = lang === 'hr' ? 'Croatian' : lang === 'de' ? 'German' : 'English';
  await page.addInitScript(
    ({ language, themePref, langCode }) => {
      const profile = {
        name: 'Overflow QA',
        firstName: 'Overflow',
        lastName: 'QA',
        role: 'player',
        position: 'Left Back',
        secondaryPosition: null,
        age: '',
        ageGroup: null,
        club: '',
        country: 'Croatia',
        dominantHand: 'Left',
        experienceLevel: '',
        playingLevel: 'Senior',
        developmentGoal: 'Decision Making',
        onboardingVersion: 2,
        notificationsEnabled: true,
      };
      window.localStorage.setItem('hbiq_profile', JSON.stringify(profile));
      window.localStorage.setItem('handball_iq_language', langCode);
      window.localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({
          language,
          theme: themePref,
          themeMigrated: true,
          activeMode: 'player',
          darkMode: themePref === 'dark',
          dailyReminder: true,
        }),
      );
      window.localStorage.setItem(
        'hbiq_development',
        JSON.stringify({
          totalXp: 0,
          playerLevel: 1,
          level: 'Foundation',
          xpEvents: [],
          achievements: [],
          decisionEvents: [],
          dailyChallenge: {
            date: new Date().toISOString().slice(0, 10),
            scenarioIds: [],
            title: 'Decision Making Against 6:0',
            focusCategory: 'Reading 6:0 Defence',
            difficulty: 'Intermediate',
            targetScore: 70,
            completed: false,
            completedScore: null,
            xpAwarded: false,
          },
          weeklyProgram: null,
          dailyGoals: null,
          weeklyGoals: null,
          activeProgram: null,
          completedPrograms: [],
          pausedPrograms: [],
          processedActivityIds: [],
          statistics: null,
          notificationPrefs: {
            dailyTraining: true,
            weeklyReview: true,
            brokenStreak: true,
            achievementUnlocked: true,
            preferredHour: 18,
          },
          pendingNotifications: [],
          lastProcessedDate: null,
          recommendationHistory: [],
        }),
      );
    },
    { language, themePref: theme, langCode: lang },
  );
}

async function openApp(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1200);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1000);
  }
}

async function assertNoHorizontalPageOverflow(page: Page) {
  const dims = await page.evaluate(() => ({
    sw: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    vw: window.innerWidth,
  }));
  expect(dims.sw, `scrollWidth ${dims.sw} > viewport ${dims.vw}`).toBeLessThanOrEqual(dims.vw + 1);
}

async function assertBoxInsideViewportAndParent(
  page: Page,
  childTestId: string,
  parentTestId?: string,
) {
  const result = await page.evaluate(
    ({ childTestId, parentTestId }) => {
      const child = document.querySelector(`[data-testid="${childTestId}"]`) as HTMLElement | null;
      if (!child) return { ok: false, reason: 'missing-child' };
      const c = child.getBoundingClientRect();
      const vw = window.innerWidth;
      if (c.left < -1 || c.right > vw + 1) {
        return { ok: false, reason: 'viewport', c: { left: c.left, right: c.right }, vw };
      }
      if (parentTestId) {
        const parent = document.querySelector(`[data-testid="${parentTestId}"]`) as HTMLElement | null;
        if (!parent) return { ok: false, reason: 'missing-parent' };
        const p = parent.getBoundingClientRect();
        if (c.left < p.left - 1.5 || c.right > p.right + 1.5) {
          return {
            ok: false,
            reason: 'parent',
            c: { left: c.left, right: c.right },
            p: { left: p.left, right: p.right },
          };
        }
      }
      // every visible descendant must stay in card/row
      const bad: string[] = [];
      child.querySelectorAll('*').forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        if (r.right > vw + 1.5 || r.left < -1.5) {
          bad.push(((el.textContent || '').trim().slice(0, 40) || el.tagName) + `@${Math.round(r.right)}`);
        }
        if (r.right > c.right + 1.5 || r.left < c.left - 1.5) {
          bad.push('in-card:' + ((el.textContent || '').trim().slice(0, 40) || el.tagName));
        }
      });
      return { ok: bad.length === 0, bad: bad.slice(0, 8), vw, box: { left: c.left, right: c.right, width: c.width } };
    },
    { childTestId, parentTestId },
  );
  expect(result, JSON.stringify(result)).toMatchObject({ ok: true });
}

test.describe('Daily Training / notification overflow', () => {
  for (const viewport of VIEWPORTS) {
    for (const lang of ['en', 'hr', 'de'] as Lang[]) {
      test(`settings Daily training ${lang} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await seedPlayer(page, lang, 'light');
        await openApp(page);
        await page.goto('/(tabs)/settings');
        const row = page.getByTestId('settings-daily-training-row');
        await expect(row).toBeVisible({ timeout: 30_000 });
        await row.scrollIntoViewIfNeeded();
        await assertBoxInsideViewportAndParent(page, 'settings-daily-training-row');
        await assertNoHorizontalPageOverflow(page);
      });
    }
  }

  test('settings Daily training dark DE 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page, 'de', 'dark');
    await openApp(page);
    await page.goto('/(tabs)/settings');
    await expect(page.getByTestId('settings-daily-training-row')).toBeVisible({ timeout: 30_000 });
    await page.getByTestId('settings-daily-training-row').scrollIntoViewIfNeeded();
    await assertBoxInsideViewportAndParent(page, 'settings-daily-training-row');
    await assertNoHorizontalPageOverflow(page);
  });

  test('home Daily Challenge long focus HR 320x568', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await seedPlayer(page, 'hr', 'light');
    await openApp(page);
    await page.goto('/(tabs)/home');
    const card = page.getByTestId('home-daily-challenge-card');
    await expect(card).toBeVisible({ timeout: 30_000 });
    await card.scrollIntoViewIfNeeded();
    await assertBoxInsideViewportAndParent(page, 'home-daily-challenge-card');
    await assertNoHorizontalPageOverflow(page);
  });

  test('home Daily Challenge DE 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page, 'de', 'light');
    await openApp(page);
    await page.goto('/(tabs)/home');
    const card = page.getByTestId('home-daily-challenge-card');
    await expect(card).toBeVisible({ timeout: 30_000 });
    await card.scrollIntoViewIfNeeded();
    await assertBoxInsideViewportAndParent(page, 'home-daily-challenge-card');
    await assertNoHorizontalPageOverflow(page);
  });

  test('desktop settings Daily training EN 1280x800', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedPlayer(page, 'en', 'light');
    await openApp(page);
    await page.goto('/(tabs)/settings');
    await expect(page.getByTestId('settings-daily-training-row')).toBeVisible({ timeout: 30_000 });
    await assertBoxInsideViewportAndParent(page, 'settings-daily-training-row');
    await assertNoHorizontalPageOverflow(page);
  });
});
