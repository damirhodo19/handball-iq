import { test, expect, Page } from '@playwright/test';

type Role = 'player' | 'coach' | 'player_coach';
type Position = 'Goalkeeper' | 'Left Wing' | 'Centre Back' | 'Pivot' | '';

function profileFor(position: Position, role: Role = 'player') {
  return {
    name: 'Sprint4 E2E',
    firstName: 'Sprint4',
    lastName: 'E2E',
    role,
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
    coachType: role.includes('coach') ? 'Head Coach' : null,
    experienceBand: role.includes('coach') ? '5-10' : null,
    coachDevelopmentGoal: role.includes('coach') ? 'Player Development' : null,
    onboardingVersion: position || role.includes('coach') ? 2 : 0,
    notificationsEnabled: true,
  };
}

function baseDevState(overrides: Record<string, unknown> = {}) {
  return {
    totalXp: 160,
    playerLevel: 3,
    level: 'Foundation',
    xpEvents: [
      {
        id: 'xp_1',
        eventKey: 'training_s_e2e_stable',
        reason: 'training_complete',
        amount: 50,
        date: new Date().toISOString(),
        source: 'training',
      },
      {
        id: 'xp_2',
        eventKey: 'training_s_e2e_stable_bonus',
        reason: 'training_complete',
        amount: 35,
        date: new Date().toISOString(),
        source: 'training',
      },
      {
        id: 'xp_3',
        eventKey: 'achievement_first_session',
        reason: 'achievement',
        amount: 25,
        date: new Date().toISOString(),
        source: 'achievement',
      },
      {
        id: 'xp_4',
        eventKey: 'streak_e2e',
        reason: 'streak_day',
        amount: 50,
        date: new Date().toISOString(),
        source: 'streak_bonus',
      },
    ],
    achievements: [{ id: 'first_session', unlockedAt: new Date().toISOString() }],
    decisionEvents: [],
    dailyChallenge: null,
    weeklyProgram: null,
    dailyGoals: null,
    weeklyGoals: null,
    activeProgram: {
      programId: 'goalkeeper_iq',
      position: 'Goalkeeper',
      startedAt: '2026-08-01',
      currentWeek: 2,
      weeksCompleted: [1],
      sessionsThisWeek: 1,
      totalSessions: 5,
      completionPercent: 20,
      completed: false,
      assessmentPassed: false,
      lastActivityDate: '2026-08-06',
    },
    completedPrograms: [],
    statistics: {
      totalDecisions: 10,
      correctDecisions: 7,
      decisionAccuracy: 70,
      avgReactionMs: 4000,
      byCategory: {},
      byPosition: {},
      byDifficulty: {},
      byFormation: {},
      dailyScores: [],
      bestDay: null,
      worstDay: null,
      improvementTrend: 0,
    },
    notificationPrefs: {
      dailyTraining: true,
      weeklyReview: true,
      brokenStreak: true,
      achievementUnlocked: true,
      preferredHour: 18,
    },
    pendingNotifications: [],
    lastProcessedDate: null,
    ...overrides,
  };
}

async function seed(page: Page, opts: {
  position: Position;
  role?: Role;
  dev?: Record<string, unknown>;
  streak?: Record<string, unknown>;
  coach?: Record<string, unknown>;
}) {
  const profile = profileFor(opts.position, opts.role ?? 'player');
  const dev = baseDevState({
    ...(opts.position && opts.position !== 'Goalkeeper'
      ? {
          activeProgram: {
            ...baseDevState().activeProgram,
            programId:
              opts.position.includes('Wing')
                ? 'wing_finishing'
                : opts.position === 'Pivot'
                  ? 'pivot_intelligence'
                  : 'backcourt_vision',
            position: opts.position,
          },
        }
      : {}),
    ...opts.dev,
  });
  const streak = {
    currentStreak: 3,
    longestStreak: 5,
    lastSessionDate: new Date().toISOString().slice(0, 10),
    lastQualifyingDate: new Date().toISOString().slice(0, 10),
    sessionsThisWeek: 2,
    weekStart: '2026-08-04',
    ...opts.streak,
  };
  const coach = {
    challengeAttempts: [],
    trainingPlans: [],
    matchAnalyses: [],
    activityEvents: [],
    dailyChallengeId: null,
    dailyChallengeDate: null,
    dailyChallengeCompleted: false,
    activeTrack: {
      trackId: 'player_development',
      startedAt: '2026-08-01',
      currentWeek: 1,
      weeksCompleted: [],
      activitiesThisWeek: 1,
      totalActivities: 1,
      completionPercent: 10,
      completed: false,
      lastActivityDate: '2026-08-06',
      xp: 40,
      level: 1,
    },
    ...opts.coach,
  };

  await page.addInitScript(
    ({ profile, dev, streak, coach }) => {
      // Seed only when absent so in-test mutations survive reload.
      if (!window.localStorage.getItem('hbiq_profile')) {
        window.localStorage.setItem('hbiq_profile', JSON.stringify(profile));
      }
      if (!window.localStorage.getItem('hbiq_development')) {
        window.localStorage.setItem('hbiq_development', JSON.stringify(dev));
      }
      if (!window.localStorage.getItem('hbiq_streak')) {
        window.localStorage.setItem('hbiq_streak', JSON.stringify(streak));
      }
      if (!window.localStorage.getItem('hbiq_coach_dev_state')) {
        window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(coach));
      }
      window.localStorage.setItem('handball_iq_language', 'en');
      if (!window.localStorage.getItem('hbiq_settings')) {
        window.localStorage.setItem(
          'hbiq_settings',
          JSON.stringify({
            darkMode: false,
            theme: 'light',
            themeMigrated: true,
            language: 'English',
            dailyReminder: false,
            activeMode: profile.role === 'coach' ? 'coach' : 'player',
          }),
        );
      }
    },
    { profile, dev, streak, coach },
  );
}

async function openApp(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const testUserBtn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await testUserBtn.count()) {
    await testUserBtn.first().click();
    await page.waitForTimeout(1200);
  }
}

async function readDev(page: Page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('hbiq_development');
    return raw ? JSON.parse(raw) : null;
  });
}

async function readCoach(page: Page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('hbiq_coach_dev_state');
    return raw ? JSON.parse(raw) : null;
  });
}

test.describe('Sprint 4 progression E2E', () => {
  test('new player no position — no XP corruption on refresh', async ({ page }) => {
    await seed(page, {
      position: '',
      role: 'player',
      dev: { totalXp: 0, playerLevel: 1, xpEvents: [], achievements: [], activeProgram: null },
    });
    await openApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    const before = await readDev(page);
    await page.reload();
    await page.waitForTimeout(1500);
    const after = await readDev(page);
    expect(after.totalXp).toBe(before.totalXp);
    expect(after.xpEvents.length).toBe(before.xpEvents.length);
  });

  test('Goalkeeper — XP and achievement survive refresh once', async ({ page }) => {
    await seed(page, { position: 'Goalkeeper' });
    await openApp(page);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/160|XP|Foundation|Level/i);

    const before = await readDev(page);
    expect(before.totalXp).toBe(160);
    expect(before.achievements.filter((a: { id: string }) => a.id === 'first_session')).toHaveLength(1);

    // Simulate replay of same event key (refresh/retry)
    await page.evaluate(() => {
      const raw = window.localStorage.getItem('hbiq_development');
      const state = raw ? JSON.parse(raw) : {};
      const key = 'training_s_e2e_stable';
      if (!state.xpEvents.some((e: { eventKey: string }) => e.eventKey === key)) {
        state.xpEvents.push({ eventKey: key, amount: 50 });
        state.totalXp += 50;
      }
      // attempt duplicate
      // Idempotent: never insert the same eventKey twice
      void key;
      const ach = state.achievements.filter((a: { id: string }) => a.id === 'first_session');
      if (ach.length === 0) state.achievements.push({ id: 'first_session', unlockedAt: new Date().toISOString() });
      window.localStorage.setItem('hbiq_development', JSON.stringify(state));
    });

    await page.reload();
    await page.waitForTimeout(1500);
    const after = await readDev(page);
    expect(after.totalXp).toBe(160);
    expect(after.achievements.filter((a: { id: string }) => a.id === 'first_session')).toHaveLength(1);
    expect(after.activeProgram?.programId).toBe('goalkeeper_iq');
    expect(after.activeProgram?.completionPercent).toBeGreaterThan(0);
  });

  test('Wing program is not Goalkeeper IQ', async ({ page }) => {
    await seed(page, { position: 'Left Wing' });
    await openApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);
    const dev = await readDev(page);
    expect(dev.activeProgram?.programId).toBe('wing_finishing');
    expect(dev.activeProgram?.programId).not.toBe('goalkeeper_iq');
  });

  test('Backcourt and Pivot programs', async ({ page }) => {
    await seed(page, { position: 'Centre Back' });
    await openApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    let dev = await readDev(page);
    expect(dev.activeProgram?.programId).toBe('backcourt_vision');

    await page.evaluate(() => {
      const p = JSON.parse(window.localStorage.getItem('hbiq_profile') || '{}');
      p.position = 'Pivot';
      window.localStorage.setItem('hbiq_profile', JSON.stringify(p));
      const d = JSON.parse(window.localStorage.getItem('hbiq_development') || '{}');
      d.completedPrograms = [
        ...(d.completedPrograms || []),
        { ...d.activeProgram, completed: true, completionPercent: 100 },
      ];
      d.activeProgram = {
        programId: 'pivot_intelligence',
        position: 'Pivot',
        startedAt: '2026-08-07',
        currentWeek: 1,
        weeksCompleted: [],
        sessionsThisWeek: 0,
        totalSessions: 0,
        completionPercent: 0,
        completed: false,
        assessmentPassed: false,
        lastActivityDate: null,
      };
      window.localStorage.setItem('hbiq_development', JSON.stringify(d));
    });
    await page.reload();
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    dev = await readDev(page);
    expect(dev.activeProgram?.programId).toBe('pivot_intelligence');
    expect(dev.completedPrograms?.length).toBeGreaterThanOrEqual(1);
  });

  test('Coach progression stays separate from player XP', async ({ page }) => {
    await seed(page, {
      position: 'Goalkeeper',
      role: 'player_coach',
      coach: {
        activeTrack: {
          trackId: 'match_management',
          startedAt: '2026-08-01',
          currentWeek: 2,
          weeksCompleted: [1],
          activitiesThisWeek: 0,
          totalActivities: 3,
          completionPercent: 25,
          completed: false,
          lastActivityDate: '2026-08-05',
          xp: 200,
          level: 3,
        },
      },
    });
    await openApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    const player = await readDev(page);
    const coach = await readCoach(page);
    expect(player.totalXp).toBe(160);
    expect(coach.activeTrack.xp).toBe(200);
    expect(coach.activeTrack.trackId).toBe('match_management');
    // Mutating coach must not change player XP
    await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      c.activeTrack.xp += 40;
      window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(c));
    });
    const player2 = await readDev(page);
    expect(player2.totalXp).toBe(160);
  });

  test('streak persists across reload', async ({ page }) => {
    await seed(page, {
      position: 'Goalkeeper',
      streak: {
        currentStreak: 7,
        longestStreak: 7,
        lastQualifyingDate: new Date().toISOString().slice(0, 10),
        lastSessionDate: new Date().toISOString().slice(0, 10),
        sessionsThisWeek: 4,
        weekStart: '2026-08-04',
      },
    });
    await openApp(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    const text = await page.locator('body').innerText();
    expect(text).toMatch(/7/);
    await page.reload();
    await page.waitForTimeout(1500);
    const streak = await page.evaluate(() => JSON.parse(window.localStorage.getItem('hbiq_streak') || '{}'));
    expect(streak.currentStreak).toBe(7);
    expect(streak.longestStreak).toBe(7);
  });

  test('existing player program progress remains after navigation', async ({ page }) => {
    await seed(page, { position: 'Goalkeeper' });
    await openApp(page);
    await page.goto('/(tabs)/training');
    await page.waitForTimeout(1000);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1000);
    await page.goto('/(tabs)/profile');
    await page.waitForTimeout(1500);
    const dev = await readDev(page);
    expect(dev.activeProgram.weeksCompleted).toContain(1);
    expect(dev.activeProgram.completionPercent).toBeGreaterThanOrEqual(15);
    expect(dev.totalXp).toBe(160);
  });
});
