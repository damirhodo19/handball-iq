import { test, expect, Page } from '@playwright/test';

type Position =
  | ''
  | 'Goalkeeper'
  | 'Left Wing'
  | 'Centre Back'
  | 'Pivot';

const GK_MARKERS = [
  'Goalkeeper decision',
  'Goalkeeper Decision',
  'Reading the Shooter',
  'Wing Shots',
  'Seven Metre',
  '7m Throw',
  'Goalkeeper IQ',
  'Stay patient and read the shooter',
];

function profileFor(position: Position) {
  return {
    name: 'E2E Player',
    firstName: 'E2E',
    lastName: 'Player',
    role: position ? 'player' : null,
    position,
    secondaryPosition: null,
    age: '',
    ageGroup: null,
    club: '',
    country: position ? 'Croatia' : '',
    dominantHand: position ? 'Right' : '',
    experienceLevel: '',
    playingLevel: position ? 'Senior' : null,
    developmentGoal: position ? 'Decision Making' : null,
    onboardingVersion: position ? 2 : 0,
    notificationsEnabled: true,
  };
}

async function seedProfile(page: Page, position: Position) {
  const profile = profileFor(position);
  await page.addInitScript((p) => {
    // Seed only when absent so later profile mutations survive reload/navigation.
    if (!window.localStorage.getItem('hbiq_profile')) {
      window.localStorage.setItem('hbiq_profile', JSON.stringify(p));
    }
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
  }, profile);
}

async function openHome(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(2000);

  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1500);
  }

  await page.goto('/(tabs)/home');
  await page.waitForTimeout(2000);
}

async function bodyText(page: Page): Promise<string> {
  return page.locator('body').innerText();
}

test.describe('No default position content', () => {
  test('new user with no profile position sees completion UI and zero GK content', async ({ page }) => {
    await seedProfile(page, '');
    await openHome(page);

    const text = await bodyText(page);
    await expect(page.getByTestId('home-complete-profile-title')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId('home-setup-profile-cta')).toBeVisible();

    for (const marker of GK_MARKERS) {
      expect(text, `Unexpected GK marker: ${marker}`).not.toContain(marker);
    }
    expect(text).not.toMatch(/Goalkeeper decision session/i);
    expect(text.toLowerCase()).not.toContain('reading the shooter');
  });

  test('goalkeeper profile shows goalkeeper personalization', async ({ page }) => {
    await seedProfile(page, 'Goalkeeper');
    await openHome(page);

    const text = await bodyText(page);
    await expect(page.getByTestId('home-complete-profile-title')).toHaveCount(0);
    expect(text).toMatch(/Goalkeeper|goalkeeper|vratar|Torhüter/i);
  });

  test('left wing profile does not show goalkeeper-default training copy', async ({ page }) => {
    await seedProfile(page, 'Left Wing');
    await openHome(page);

    const text = await bodyText(page);
    await expect(page.getByTestId('home-complete-profile-title')).toHaveCount(0);
    expect(text).toMatch(/Wing|kril|Flügel/i);
    expect(text).not.toContain('Reading the Shooter');
    expect(text).not.toContain('Goalkeeper decision session');
  });

  test('centre back profile is not goalkeeper content', async ({ page }) => {
    await seedProfile(page, 'Centre Back');
    await openHome(page);

    const text = await bodyText(page);
    await expect(page.getByTestId('home-complete-profile-title')).toHaveCount(0);
    expect(text).toMatch(/Back|vanjsk|Rückraum|Centre/i);
    expect(text).not.toContain('Reading the Shooter');
    expect(text).not.toContain('Seven Metre');
  });

  test('pivot profile is not goalkeeper content', async ({ page }) => {
    await seedProfile(page, 'Pivot');
    await openHome(page);

    const text = await bodyText(page);
    await expect(page.getByTestId('home-complete-profile-title')).toHaveCount(0);
    expect(text).toMatch(/Pivot|pivot|Kreis/i);
    expect(text).not.toContain('Reading the Shooter');
    expect(text).not.toContain('Goalkeeper Decision Scenarios');
  });

  test('position change after onboarding updates home personalization', async ({ page }) => {
    await seedProfile(page, 'Left Wing');
    await openHome(page);
    let text = await bodyText(page);
    expect(text).toMatch(/Wing|kril|Flügel/i);

    // Simulate position change in profile cache
    await page.evaluate(() => {
      const raw = window.localStorage.getItem('hbiq_profile');
      const profile = raw ? JSON.parse(raw) : {};
      profile.position = 'Pivot';
      window.localStorage.setItem('hbiq_profile', JSON.stringify(profile));
    });
    await page.reload();
    await page.waitForTimeout(2000);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);

    text = await bodyText(page);
    expect(text).toMatch(/Pivot|pivot|Kreis/i);
    expect(text).not.toContain('Reading the Shooter');
  });
});
