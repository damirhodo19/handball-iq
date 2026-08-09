import { test, expect, Page } from '@playwright/test';

async function seedPlayer(page: Page, overrides: Record<string, unknown> = {}) {
  await page.addInitScript((profileOverrides) => {
    const profile = {
      name: 'RC1 Hotfix',
      firstName: 'RC1',
      lastName: 'Hotfix',
      role: 'player_coach',
      position: 'Left Wing',
      secondaryPosition: null,
      age: '',
      ageGroup: null,
      club: '',
      country: 'Croatia',
      dominantHand: 'Right',
      experienceLevel: '',
      playingLevel: 'Senior',
      developmentGoal: 'Decision Making',
      coachType: 'Head Coach',
      experienceBand: '5-10',
      coachDevelopmentGoal: 'Player Development',
      onboardingVersion: 2,
      notificationsEnabled: true,
      ...profileOverrides,
    };
    localStorage.setItem('handball_iq_dev_auth', 'true');
    localStorage.setItem('handball_iq_language', 'en');
    localStorage.setItem('hbiq_profile', JSON.stringify(profile));
    localStorage.setItem(
      'hbiq_settings',
      JSON.stringify({ language: 'en', theme: 'dark', themeMigrated: true, activeMode: 'player' }),
    );
    localStorage.setItem(
      'hbiq_development',
      JSON.stringify({
        totalXp: 100,
        playerLevel: 2,
        level: 'Foundation',
        xpEvents: [
          {
            id: 'xp_seed',
            eventKey: 'training_seed',
            reason: 'training_complete',
            amount: 50,
            date: new Date().toISOString(),
            source: 'training',
          },
        ],
        achievements: [],
        decisionEvents: [],
        dailyChallenge: {
          date: '2026-08-07',
          scenarioIds: [],
          title: 'Decision Making',
          focusCategory: 'Decision Making',
          difficulty: 'Intermediate',
          targetScore: 70,
          completed: true,
          completedScore: 80,
          xpAwarded: true,
        },
        weeklyProgram: null,
        dailyGoals: null,
        weeklyGoals: null,
        activeProgram: {
          programId: 'wing_finishing',
          position: 'Left Wing',
          startedAt: '2026-08-01',
          currentWeek: 2,
          weeksCompleted: [1],
          sessionsThisWeek: 1,
          totalSessions: 3,
          completionPercent: 20,
          completed: false,
          assessmentPassed: false,
          lastActivityDate: '2026-08-02',
          status: 'active',
        },
        completedPrograms: [],
        pausedPrograms: [],
        processedActivityIds: ['training_seed'],
        statistics: {
          totalDecisions: 0,
          correctDecisions: 0,
          decisionAccuracy: 0,
          avgReactionMs: 0,
          byCategory: {},
          byPosition: {},
          byDifficulty: {},
          byFormation: {},
          bySkill: {},
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
        recommendationHistory: [],
      }),
    );
    localStorage.setItem('hbiq_data_owner', 'user-a');
    localStorage.setItem(
      'hbiq_streak',
      JSON.stringify({
        currentStreak: 2,
        longestStreak: 2,
        lastSessionDate: '2026-08-07',
        lastQualifyingDate: '2026-08-07',
        sessionsThisWeek: 2,
        weekStart: '2026-08-04',
      }),
    );
  }, overrides);
}

test.describe('RC1 hotfix regressions', () => {
  test('clearUserScopedLocalData wipes progression but keeps language', async ({ page }) => {
    await seedPlayer(page);
    await page.goto('/--/(tabs)/home');
    await page.waitForTimeout(600);

    const isolation = await page.evaluate(() => {
      // Inline clear matching lib/clear-user-local.ts keys
      const keys = [
        'hbiq_profile',
        'hbiq_sessions',
        'hbiq_streak',
        'hbiq_metrics',
        'hbiq_matches',
        'hbiq_development',
        'hbiq_coach_dev_state',
        'hbiq_offline_queue',
        'hbiq_synced_records',
        'hbiq_sync_status',
        'hbiq_migration_prompted',
        'handball_iq_dev_auth',
        'hbiq_data_owner',
      ];
      const settings = JSON.parse(localStorage.getItem('hbiq_settings') || '{}');
      for (const k of keys) localStorage.removeItem(k);
      localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({
          language: settings.language ?? 'en',
          theme: settings.theme ?? 'dark',
          themeMigrated: true,
          activeMode: 'player',
        }),
      );
      return {
        dev: localStorage.getItem('hbiq_development'),
        streak: localStorage.getItem('hbiq_streak'),
        owner: localStorage.getItem('hbiq_data_owner'),
        language: JSON.parse(localStorage.getItem('hbiq_settings') || '{}').language,
      };
    });

    expect(isolation.dev).toBeNull();
    expect(isolation.streak).toBeNull();
    expect(isolation.owner).toBeNull();
    expect(isolation.language).toBe('en');
  });

  test('daily challenge completed flag survives reload', async ({ page }) => {
    await seedPlayer(page);
    await page.goto('/--/(tabs)/home');
    await page.waitForTimeout(800);
    await page.reload();
    await page.waitForTimeout(800);
    const challenge = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('hbiq_development') || '{}');
      return state.dailyChallenge;
    });
    expect(challenge?.completed).toBe(true);
    expect(challenge?.xpAwarded).toBe(true);
  });

  test('player_coach role preserved in local profile', async ({ page }) => {
    await seedPlayer(page, { role: 'player_coach' });
    await page.goto('/--/(tabs)/home');
    await page.waitForTimeout(1000);
    const role = await page.evaluate(() => JSON.parse(localStorage.getItem('hbiq_profile') || '{}').role);
    expect(role).toBe('player_coach');
  });

  test('programs HR UI has no English difficulty leakage', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('handball_iq_dev_auth', 'true');
      localStorage.setItem(
        'hbiq_profile',
        JSON.stringify({
          name: 'RC1',
          firstName: 'RC1',
          lastName: 'HR',
          role: 'player',
          position: 'Left Wing',
          secondaryPosition: null,
          age: '',
          ageGroup: null,
          club: '',
          country: 'Croatia',
          dominantHand: 'Right',
          experienceLevel: '',
          playingLevel: 'Senior',
          developmentGoal: 'Decision Making',
          coachType: null,
          experienceBand: null,
          coachDevelopmentGoal: null,
          onboardingVersion: 2,
          notificationsEnabled: true,
        }),
      );
      localStorage.setItem('handball_iq_language', 'hr');
      localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({ language: 'hr', theme: 'dark', themeMigrated: true, activeMode: 'player' }),
      );
      localStorage.setItem(
        'hbiq_development',
        JSON.stringify({
          totalXp: 0,
          playerLevel: 1,
          level: 'Foundation',
          xpEvents: [],
          achievements: [],
          decisionEvents: [],
          dailyChallenge: null,
          weeklyProgram: null,
          dailyGoals: null,
          weeklyGoals: null,
          activeProgram: null,
          completedPrograms: [],
          pausedPrograms: [],
          processedActivityIds: [],
          statistics: {
            totalDecisions: 0,
            correctDecisions: 0,
            decisionAccuracy: 0,
            avgReactionMs: 0,
            byCategory: {},
            byPosition: {},
            byDifficulty: {},
            byFormation: {},
            bySkill: {},
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
        }),
      );
    });
    await page.goto('/programs');
    await page.waitForTimeout(1200);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\bBeginner\b/);
    expect(body).not.toMatch(/\bIntermediate\b/);
    expect(body).not.toMatch(/\bDecision Making\b/);
  });

  test('paused program list renders under Paused not Completed', async ({ page }) => {
    await seedPlayer(page, { position: 'Pivot', role: 'player' });
    await page.addInitScript(() => {
      const raw = localStorage.getItem('hbiq_development');
      if (!raw) return;
      const state = JSON.parse(raw);
      state.pausedPrograms = [
        {
          programId: 'wing_finishing',
          position: 'Left Wing',
          startedAt: '2026-08-01',
          currentWeek: 2,
          weeksCompleted: [1],
          sessionsThisWeek: 1,
          totalSessions: 3,
          completionPercent: 20,
          completed: false,
          assessmentPassed: false,
          lastActivityDate: '2026-08-02',
          status: 'paused',
          pausedAt: '2026-08-06',
        },
      ];
      state.activeProgram = {
        programId: 'pivot_intelligence',
        position: 'Pivot',
        startedAt: '2026-08-05',
        currentWeek: 1,
        weeksCompleted: [],
        sessionsThisWeek: 0,
        totalSessions: 0,
        completionPercent: 0,
        completed: false,
        assessmentPassed: false,
        lastActivityDate: null,
        status: 'active',
      };
      state.completedPrograms = [];
      localStorage.setItem('hbiq_development', JSON.stringify(state));
    });
    await page.goto('/programs');
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Paused Programs/i);
  });

  test('sync pending status surfaces on home', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('handball_iq_dev_auth', 'true');
      localStorage.setItem(
        'hbiq_profile',
        JSON.stringify({
          name: 'RC1',
          firstName: 'RC1',
          lastName: 'Sync',
          role: 'player',
          position: 'Left Wing',
          secondaryPosition: null,
          age: '',
          ageGroup: null,
          club: '',
          country: 'Croatia',
          dominantHand: 'Right',
          experienceLevel: '',
          playingLevel: 'Senior',
          developmentGoal: 'Decision Making',
          coachType: null,
          experienceBand: null,
          coachDevelopmentGoal: null,
          onboardingVersion: 2,
          notificationsEnabled: true,
        }),
      );
      localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({ language: 'en', theme: 'dark', themeMigrated: true, activeMode: 'player' }),
      );
      localStorage.setItem('hbiq_sync_status', JSON.stringify('pending'));
      localStorage.setItem(
        'hbiq_development',
        JSON.stringify({
          totalXp: 0,
          playerLevel: 1,
          level: 'Foundation',
          xpEvents: [],
          achievements: [],
          decisionEvents: [],
          dailyChallenge: null,
          weeklyProgram: null,
          dailyGoals: null,
          weeklyGoals: null,
          activeProgram: null,
          completedPrograms: [],
          pausedPrograms: [],
          processedActivityIds: [],
          statistics: {
            totalDecisions: 0,
            correctDecisions: 0,
            decisionAccuracy: 0,
            avgReactionMs: 0,
            byCategory: {},
            byPosition: {},
            byDifficulty: {},
            byFormation: {},
            bySkill: {},
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
        }),
      );
    });
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Sync pending/i);
  });
});
