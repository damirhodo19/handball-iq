import { test, expect, Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 320, height: 568, name: '320' },
  { width: 390, height: 844, name: '390' },
  { width: 430, height: 932, name: '430' },
  { width: 1280, height: 800, name: 'desktop' },
] as const;

async function seedPlayer(page: Page) {
  await page.addInitScript(() => {
    const profile = {
      name: 'Back Nav',
      firstName: 'Back',
      lastName: 'Nav',
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
        theme: 'light',
        themeMigrated: true,
        activeMode: 'player',
        darkMode: false,
        dailyReminder: false,
      }),
    );
  });
}

async function seedCoach(page: Page) {
  await page.addInitScript(() => {
    const profile = {
      name: 'Coach Back',
      firstName: 'Coach',
      lastName: 'Back',
      role: 'coach',
      position: null,
      secondaryPosition: null,
      age: '',
      ageGroup: null,
      club: 'Test Club',
      country: 'Croatia',
      dominantHand: null,
      experienceLevel: '',
      playingLevel: null,
      developmentGoal: null,
      coachType: 'Head Coach',
      experienceBand: '5-10',
      coachDevelopmentGoal: 'Tactical Communication',
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
}

async function enterApp(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1200);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1000);
  }
}

async function expectVisibleBack(page: Page) {
  const back = page.getByTestId('app-back-button');
  await expect(back.first()).toBeVisible({ timeout: 20_000 });
  const box = await back.first().boundingBox();
  expect(box).toBeTruthy();
  expect(box!.width).toBeGreaterThanOrEqual(40);
  expect(box!.height).toBeGreaterThanOrEqual(40);
}

async function expectNoRootBack(page: Page) {
  await expect(page.getByTestId('app-back-button')).toHaveCount(0);
}

async function clickContinueCentred(page: Page) {
  const btn = page.getByText(/Breathing complete|You are centred|centrirani|zentriert/i).first();
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

test.describe('Back navigation regression', () => {
  for (const vp of VIEWPORTS) {
    test(`player secondary has Back @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await seedPlayer(page);
      await enterApp(page);
      await page.goto('/match/intro');
      await expectVisibleBack(page);
    });
  }

  test('coach secondary has Back and falls back to Coach Home', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedCoach(page);
    await enterApp(page);
    await page.goto('/coach-tools/challenge');
    await expectVisibleBack(page);
    await page.getByTestId('app-back-button').first().click();
    await page.waitForTimeout(1500);
    await expectNoRootBack(page);
  });

  test('direct URL fallback works (no history dead-end)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await enterApp(page);
    await page.goto('/programs');
    await expectVisibleBack(page);
    await page.getByTestId('app-back-button').first().click();
    await page.waitForTimeout(1500);
    await expectNoRootBack(page);
  });

  test('root tab pages do not show Back', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await enterApp(page);
    for (const path of [
      '/(tabs)/home',
      '/(tabs)/training',
      '/(tabs)/match-day',
      '/(tabs)/progress',
      '/(tabs)/profile',
      '/(tabs)/settings',
    ]) {
      await page.goto(path);
      await page.waitForTimeout(800);
      await expectNoRootBack(page);
    }
  });

  test('Match Day setup Back works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await enterApp(page);
    await page.goto('/match-day/setup?mode=complete');
    await expectVisibleBack(page);
    await page.getByTestId('app-back-button').first().click();
    await page.waitForTimeout(1200);
    await expect(page.getByTestId('app-back-button')).toHaveCount(0);
  });

  test('Match Day tactics and plan Back preserve prep', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await enterApp(page);
    await page.goto('/match-day/setup?mode=complete');
    await page.waitForTimeout(1000);

    await page.getByPlaceholder(/opponent|protivnik|gegner/i).fill('BackNav FC');
    await page.getByText('Shot selection', { exact: true }).first().click();
    const begin = page.getByText('Begin Preparation', { exact: true }).first();
    await begin.scrollIntoViewIfNeeded();
    await begin.click();
    await page.waitForURL(/match-day\/prepare/, { timeout: 20_000 });
    await expectVisibleBack(page);

    // Skip breathing → Mental Reset
    await page.getByText(/^Skip$/i).first().click();
    await page.waitForTimeout(600);

    await page.getByText('Previous mistakes').first().click();
    await page.waitForTimeout(400);
    await clickContinueCentred(page);

    // Visualization: advance through situations then continue
    for (let i = 0; i < 3; i++) {
      const nextSit = page.getByText(/Next Scenario/i).first();
      if (await nextSit.count()) {
        await nextSit.click();
        await page.waitForTimeout(400);
      }
    }
    await clickContinueCentred(page);

    // Tactical step
    await expect(page.getByText(/Tactical/i).first()).toBeVisible({ timeout: 15_000 });
    const prepBefore = await page.evaluate(() => window.localStorage.getItem('hbiq_match_day_preps'));
    expect(prepBefore).toContain('BackNav FC');

    await page.getByTestId('app-back-button').first().click();
    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/match-day\/prepare/);
    expect(await page.evaluate(() => window.localStorage.getItem('hbiq_match_day_preps'))).toContain(
      'BackNav FC',
    );

    // Return to tactical, answer through to Match Plan when possible
    await clickContinueCentred(page);
    await page.waitForTimeout(600);

    for (let i = 0; i < 12; i++) {
      if (await page.getByText(/Match Plan/i).count()) break;

      const continuePlan = page.getByText(/Continue to Plan/i).first();
      if (await continuePlan.count()) {
        await continuePlan.click();
        await page.waitForTimeout(500);
        continue;
      }

      const nextScn = page.getByText(/Next Scenario/i).first();
      if (await nextScn.count()) {
        await nextScn.click();
        await page.waitForTimeout(400);
        continue;
      }

      // Select first answer option if present
      const option = page.locator('[data-testid="app-back-button"]').locator('..').locator('..');
      void option;
      const answerLike = page.getByText(/^[A-D]\b|Shoot|Pass|Drive|Wait|Cross|Pivot/i).first();
      if (await answerLike.count()) {
        await answerLike.click({ force: true }).catch(() => {});
        await page.waitForTimeout(400);
      } else {
        break;
      }
    }

    if (await page.getByText(/Match Plan/i).count()) {
      await page.getByTestId('app-back-button').first().click();
      await page.waitForTimeout(800);
      await expect(page).toHaveURL(/match-day\/prepare/);
      expect(await page.evaluate(() => window.localStorage.getItem('hbiq_match_day_preps'))).toContain(
        'BackNav FC',
      );
    }
  });

  test('Session results Back works without duplicating completion', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'hbiq_active_training_session',
        JSON.stringify({
          position: 'Left Back',
          bankIds: ['scn_bank_169', 'scn_bank_174', 'scn_bank_409'],
          startedAt: new Date().toISOString(),
        }),
      );
    });
    await enterApp(page);
    await page.goto('/session/results');
    await page.waitForTimeout(1500);
    await expectVisibleBack(page);

    const xpBefore = await page.evaluate(() => window.localStorage.getItem('hbiq_development_state'));
    await page.getByTestId('app-back-button').first().click();
    await page.waitForTimeout(1200);
    const xpAfter = await page.evaluate(() => window.localStorage.getItem('hbiq_development_state'));
    expect(xpAfter).toBe(xpBefore);
  });

  test('Session intro Back visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedPlayer(page);
    await enterApp(page);
    await page.goto('/session');
    await expectVisibleBack(page);
  });
});
