import { test, expect, Page } from '@playwright/test';

type Position = 'Left Back' | 'Left Wing' | 'Right Wing' | 'Pivot' | 'Centre Back' | 'Right Back';

const GK_ONLY_MARKERS = [
  'Goalkeeper IQ',
  'Vratarski IQ',
  'Torwart-IQ',
  'best goalkeeper response',
  'najbolji vratarski odgovor',
  'beste Torwart-Reaktion',
  'Reading the Shooter',
  'Goalkeeper Outlet',
  'Decisive Save',
];

function profileFor(position: Position, secondaryPosition: Position | null = null) {
  return {
    name: 'E2E Field',
    firstName: 'E2E',
    lastName: 'Field',
    role: 'player',
    position,
    secondaryPosition,
    age: '',
    ageGroup: null,
    club: '',
    country: 'Croatia',
    dominantHand: 'Right',
    experienceLevel: '',
    playingLevel: 'Senior',
    developmentGoal: 'Decision Making',
    onboardingVersion: 2,
    notificationsEnabled: true,
  };
}

async function seed(page: Page, position: Position, secondaryPosition: Position | null = null) {
  const profile = profileFor(position, secondaryPosition);
  await page.addInitScript((p) => {
    window.localStorage.setItem('hbiq_profile', JSON.stringify(p));
    window.localStorage.setItem('handball_iq_language', 'en');
    window.localStorage.setItem(
      'hbiq_settings',
      JSON.stringify({
        darkMode: false,
        theme: 'light',
        themeMigrated: true,
        language: 'English',
        dailyReminder: false,
        activeMode: 'player',
      }),
    );
    // Clear any sticky session mode / daily challenge that could inject foreign content
    window.localStorage.removeItem('hbiq_development');
  }, profile);
}

async function openAsPlayer(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1000);
  }
}

test.describe('Position personalization — no Goalkeeper leak', () => {
  test('secondary position selector switches the complete training view', async ({ page }) => {
    await seed(page, 'Right Wing', 'Right Back');
    await openAsPlayer(page);

    await page.goto('/(tabs)/training');
    await page.waitForTimeout(2000);

    await expect(page.getByText('Right Back', { exact: true }).first()).toBeVisible();
    await page.getByText('Right Back', { exact: true }).first().click();
    await expect(page.getByText('Right Back · Position-specific decision training', { exact: true })).toBeVisible();
  });

  for (const position of ['Left Back', 'Left Wing', 'Pivot', 'Centre Back'] as Position[]) {
    test(`${position}: training intro + first scenarios are not GK-only`, async ({ page }) => {
      await seed(page, position);
      await openAsPlayer(page);

      await page.goto('/(tabs)/training');
      await page.waitForTimeout(2000);

      const trainingText = await page.locator('body').innerText();
      for (const marker of ['Goalkeeper IQ', 'Reading the Shooter', 'Wing Shots', 'Seven Metre']) {
        // Category chips from GK config must not appear for field positions
        if (marker === 'Wing Shots' || marker === 'Seven Metre') {
          expect(trainingText, `${position} training leaked ${marker}`).not.toContain(marker);
        }
      }

      await page.goto('/session');
      await page.waitForTimeout(2000);
      const intro = await page.locator('body').innerText();
      for (const marker of GK_ONLY_MARKERS) {
        expect(intro, `${position} session intro leaked: ${marker}`).not.toContain(marker);
      }
      expect(intro).toMatch(new RegExp(`${position}|Decision Training|Handball IQ`, 'i'));
    });
  }

  test('Left Back match intro does not open as Goalkeeper Visualization', async ({ page }) => {
    await seed(page, 'Left Back');
    await openAsPlayer(page);
    await page.goto('/match/intro');
    await page.waitForTimeout(2000);
    const text = await page.locator('body').innerText();
    expect(text).not.toContain('Goalkeeper Visualization');
    expect(text).not.toContain('Goalkeeper IQ');
  });
});
