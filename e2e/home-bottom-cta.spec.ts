import { test, expect, Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

async function seedHomePlayer(page: Page, theme: 'light' | 'dark' | 'system' = 'light') {
  await page.addInitScript((themePref) => {
    const profile = {
      name: 'Home CTA',
      firstName: 'Home',
      lastName: 'CTA',
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
      coachType: null,
      experienceBand: null,
      coachDevelopmentGoal: null,
      onboardingVersion: 2,
      notificationsEnabled: true,
    };
    window.localStorage.setItem('hbiq_profile', JSON.stringify(profile));
    window.localStorage.setItem('handball_iq_language', 'en');
    window.localStorage.setItem(
      'hbiq_settings',
      JSON.stringify({
        language: 'English',
        theme: themePref,
        themeMigrated: true,
        activeMode: 'player',
        darkMode: themePref === 'dark',
        dailyReminder: false,
      }),
    );
  }, theme);
}

async function openHome(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1200);
  }
  await page.goto('/(tabs)/home');
  await expect(page.getByTestId('home-final-cta')).toBeVisible({ timeout: 30_000 });
}

async function assertFinalCtaClearsTabBar(page: Page) {
  const cta = page.getByTestId('home-final-cta');
  const spacer = page.getByTestId('home-bottom-spacer');
  await expect(spacer).toBeVisible();

  await cta.scrollIntoViewIfNeeded();
  await spacer.scrollIntoViewIfNeeded();

  await page.evaluate(() => {
    const spacerEl = document.querySelector('[data-testid="home-bottom-spacer"]') as HTMLElement | null;
    let node: HTMLElement | null = spacerEl;
    while (node) {
      const style = window.getComputedStyle(node);
      const oy = style.overflowY;
      if (
        (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
        node.scrollHeight > node.clientHeight + 4
      ) {
        node.scrollTop = node.scrollHeight;
      }
      node = node.parentElement;
    }
  });

  await page.waitForTimeout(250);

  const ctaBox = await cta.boundingBox();
  const tablist = page.locator('[role="tablist"]');
  await expect(tablist).toBeVisible();
  const tabBox = await tablist.boundingBox();

  expect(ctaBox, 'home-final-cta box').toBeTruthy();
  expect(tabBox, 'tablist box').toBeTruthy();

  const ctaBottom = ctaBox!.y + ctaBox!.height;
  const tabTop = tabBox!.y;

  expect(
    ctaBottom,
    `CTA bottom (${ctaBottom}) must not intersect tab bar top (${tabTop})`,
  ).toBeLessThanOrEqual(tabTop - 1);

  const spacerBox = await spacer.boundingBox();
  expect(spacerBox, 'spacer box').toBeTruthy();
  expect(spacerBox!.height).toBeGreaterThanOrEqual(16);
}

test.describe('Home bottom CTA clears tab bar', () => {
  for (const viewport of VIEWPORTS) {
    test(`player home ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await seedHomePlayer(page, 'light');
      await openHome(page);
      await assertFinalCtaClearsTabBar(page);
    });
  }

  test('player home dark theme 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedHomePlayer(page, 'dark');
    await openHome(page);
    await assertFinalCtaClearsTabBar(page);
  });

  test('player home system theme 375x812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await seedHomePlayer(page, 'system');
    await openHome(page);
    await assertFinalCtaClearsTabBar(page);
  });

  test('coach home 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      const profile = {
        name: 'Coach CTA',
        firstName: 'Coach',
        lastName: 'CTA',
        role: 'coach',
        position: null,
        secondaryPosition: null,
        age: '',
        ageGroup: 'U16',
        club: 'Test',
        country: 'Croatia',
        dominantHand: null,
        experienceLevel: '',
        playingLevel: null,
        developmentGoal: null,
        coachType: 'Head Coach',
        experienceBand: '6-10',
        favoriteDefense: 'def_6_0',
        favoriteAttack: 'att_fast_break',
        coachDevelopmentGoal: 'Tactics',
        onboardingVersion: 2,
        notificationsEnabled: true,
      };
      window.localStorage.setItem('hbiq_profile', JSON.stringify(profile));
      window.localStorage.setItem('handball_iq_language', 'en');
      window.localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({
          language: 'English',
          theme: 'light',
          themeMigrated: true,
          activeMode: 'coach',
          darkMode: false,
          dailyReminder: false,
        }),
      );
    });
    await openHome(page);
    await assertFinalCtaClearsTabBar(page);
  });
});
