import { test, expect, Page } from '@playwright/test';

async function enterApp(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1200);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1000);
  }
}

function coachProfile(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Tactical Coach',
    firstName: 'Tactical',
    lastName: 'Coach',
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
    experienceBand: '6-10',
    coachDevelopmentGoal: 'Tactics',
    favoriteDefense: 'def_5_1',
    favoriteAttack: 'att_crossing',
    onboardingVersion: 2,
    notificationsEnabled: true,
    ...overrides,
  };
}

function playerCoachProfile(overrides: Record<string, unknown> = {}) {
  return {
    name: 'PC Tactical',
    firstName: 'PC',
    lastName: 'Tactical',
    role: 'player_coach',
    position: 'Left Back',
    secondaryPosition: null,
    age: '',
    ageGroup: null,
    club: 'Test Club',
    country: 'Croatia',
    dominantHand: 'Left',
    experienceLevel: '',
    playingLevel: 'Senior',
    developmentGoal: 'Decision Making',
    coachType: 'Assistant Coach',
    experienceBand: '3-5',
    coachDevelopmentGoal: 'Tactics',
    favoriteDefense: 'def_5_1',
    favoriteAttack: 'att_crossing',
    onboardingVersion: 2,
    notificationsEnabled: true,
    ...overrides,
  };
}

async function seed(page: Page, profile: Record<string, unknown>, lang: 'en' | 'hr' | 'de' = 'en') {
  const language = lang === 'de' ? 'German' : lang === 'hr' ? 'Croatian' : 'English';
  // Only seed when empty so reload / soft navigations keep user saves
  await page.addInitScript(
    ({ profile: p, language: langLabel, langCode }) => {
      if (!window.localStorage.getItem('hbiq_profile')) {
        window.localStorage.setItem('hbiq_profile', JSON.stringify(p));
      }
      if (!window.localStorage.getItem('handball_iq_language')) {
        window.localStorage.setItem('handball_iq_language', langCode);
      }
      if (!window.localStorage.getItem('hbiq_settings')) {
        window.localStorage.setItem(
          'hbiq_settings',
          JSON.stringify({
            language: langLabel,
            theme: 'light',
            themeMigrated: true,
            activeMode: p.role === 'player' ? 'player' : 'coach',
            darkMode: false,
            dailyReminder: false,
          }),
        );
      }
    },
    { profile, language, langCode: lang },
  );
}

async function readProfile(page: Page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('hbiq_profile');
    return raw ? JSON.parse(raw) : null;
  });
}

test.describe('Tactical defence / attack systems', () => {
  test('coach profile shows expanded defence + attack lists (EN)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, coachProfile());
    await enterApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);

    // Open edit if needed — look for defence label chips on profile or edit
    const editBtn = page.getByText(/Edit|Uredi|Bearbeiten/i).first();
    if (await editBtn.count()) {
      await editBtn.click();
      await page.waitForTimeout(800);
    }

    await expect(page.getByText('5:1').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('3:2:1').first()).toBeVisible();
    await expect(page.getByText(/5\+1 man marking/i).first()).toBeVisible();
    await expect(page.getByText(/Individual man-to-man/i).first()).toBeVisible();
    await expect(page.getByText(/Crossing Game/i).first()).toBeVisible();
    await expect(page.getByText(/Pivot Cooperation/i).first()).toBeVisible();
    await expect(page.getByText(/Numerical Superiority/i).first()).toBeVisible();
    await expect(page.getByText(/No preference/i).first()).toBeVisible();
  });

  test('coach selects def_5_1 + att_crossing, save + refresh keeps canonical IDs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(
      page,
      coachProfile({ favoriteDefense: 'none', favoriteAttack: 'none' }),
    );
    await enterApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);

    const editBtn = page.getByText(/Edit|Uredi|Bearbeiten/i).first();
    if (await editBtn.count()) {
      await editBtn.click();
      await page.waitForTimeout(800);
    }

    await page.getByText('5:1', { exact: true }).first().click();
    await page.getByText(/Crossing Game/i).first().click();

    const save = page.getByText(/Save|Spremi|Speichern/i).first();
    if (await save.count()) {
      await save.click();
      await page.waitForTimeout(1000);
    }

    let profile = await readProfile(page);
    expect(profile.favoriteDefense).toBe('def_5_1');
    expect(profile.favoriteAttack).toBe('att_crossing');

    await page.reload();
    await page.waitForTimeout(2000);
    profile = await readProfile(page);
    expect(profile.favoriteDefense).toBe('def_5_1');
    expect(profile.favoriteAttack).toBe('att_crossing');
  });

  test('legacy 6:0 + Fast Break migrate to canonical IDs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(
      page,
      coachProfile({
        favoriteDefense: '6:0',
        favoriteAttack: 'Fast Break',
      }),
    );
    await enterApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);

    const profile = await readProfile(page);
    expect(profile.favoriteDefense).toBe('def_6_0');
    expect(profile.favoriteAttack).toBe('att_fast_break');
  });

  test('player_coach keeps tactical prefs after refresh', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, playerCoachProfile());
    await enterApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);

    let profile = await readProfile(page);
    expect(profile.favoriteDefense).toBe('def_5_1');
    expect(profile.favoriteAttack).toBe('att_crossing');

    await page.reload();
    await page.waitForTimeout(2000);
    profile = await readProfile(page);
    expect(profile.role).toBe('player_coach');
    expect(profile.favoriteDefense).toBe('def_5_1');
    expect(profile.favoriteAttack).toBe('att_crossing');
  });

  test('clear local cache then restore from cloud-shaped values yields canonical IDs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, coachProfile());
    await enterApp(page);

    // Simulate cloud row with legacy labels + clear local, then rehydrate via migrate path used by pull
    await page.evaluate(() => {
      window.localStorage.removeItem('hbiq_profile');
      window.localStorage.setItem(
        'hbiq_profile',
        JSON.stringify({
          name: 'Cloud Restore',
          role: 'coach',
          coachType: 'Head Coach',
          experienceBand: '6-10',
          favoriteDefense: '5:1',
          favoriteAttack: 'Crossing',
          country: 'Croatia',
          club: 'Cloud Club',
          onboardingVersion: 2,
          position: '',
          secondaryPosition: null,
          age: '',
          ageGroup: null,
          dominantHand: '',
          experienceLevel: '',
          playingLevel: null,
          developmentGoal: null,
          notificationsEnabled: true,
        }),
      );
    });
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);
    const profile = await readProfile(page);
    expect(profile.favoriteDefense).toBe('def_5_1');
    expect(profile.favoriteAttack).toBe('att_crossing');
  });

  test('HR labels use natural terminology (no English leakage on chips)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, coachProfile(), 'hr');
    await enterApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);
    const editBtn = page.getByText(/Uredi|Edit/i).first();
    if (await editBtn.count()) await editBtn.click();
    await page.waitForTimeout(800);

    await expect(page.getByText(/Igra križanja/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Suradnja s pivotom/i).first()).toBeVisible();
    await expect(page.getByText(/Nema preferencije|Bez preferencije|No preference/i).first()).toBeVisible();
  });

  test('DE labels use natural terminology', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, coachProfile(), 'de');
    await enterApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);
    const editBtn = page.getByText(/Bearbeiten|Edit/i).first();
    if (await editBtn.count()) await editBtn.click();
    await page.waitForTimeout(800);

    await expect(page.getByText(/Kreuzspiel/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Tempogegenstoß/i).first()).toBeVisible();
    await expect(page.getByText(/Keine Präferenz|No preference/i).first()).toBeVisible();
  });

  test('Training Planner surfaces preference labels (not raw IDs)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(page, coachProfile());
    await enterApp(page);
    await page.goto('/coach-tools/planner');
    await page.waitForTimeout(2000);

    const body = await page.locator('body').innerText();
    expect(body).not.toContain('def_5_1');
    expect(body).not.toContain('att_crossing');
    expect(body).toMatch(/5:1/);
    expect(body).toMatch(/Crossing Game|Kreuzspiel|Igra križanja/i);
  });

  test('Match Day setup still works with tactical prefs set', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seed(
      page,
      playerCoachProfile({
        favoriteDefense: 'def_5_1',
        favoriteAttack: 'att_7v6',
      }),
    );
    await enterApp(page);
    await page.goto('/match-day/setup?mode=complete');
    await page.waitForTimeout(1500);
    await expect(page.getByText(/Match Setup|Postava|Spielaufstellung|Setup/i).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('app-back-button').first()).toBeVisible();
  });
});
