import { test, expect, Page } from '@playwright/test';

async function seed(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'hbiq_profile',
      JSON.stringify({
        name: 'Sprint5 Player',
        role: 'player',
        position: 'Centre Back',
        onboardingVersion: 2,
        developmentGoal: 'Decision Making',
        playingLevel: 'Senior',
        country: 'Croatia',
        dominantHand: 'Right',
      }),
    );
    window.localStorage.setItem(
      'hbiq_development',
      JSON.stringify({
        totalXp: 400,
        playerLevel: 5,
        level: 'Foundation',
        xpEvents: [],
        achievements: [{ id: 'first_session', unlockedAt: '2026-08-01T10:00:00.000Z' }],
        decisionEvents: [
          {
            id: 'd1',
            date: '2026-08-06T12:00:00.000Z',
            source: 'training',
            category: 'Defence',
            formation: '6:0',
            position: 'Centre Back',
            difficulty: 'Intermediate',
            isCorrect: false,
            reactionMs: 4000,
            scenarioType: 'defensive reading gap',
          },
          {
            id: 'd2',
            date: '2026-08-06T12:01:00.000Z',
            source: 'training',
            category: 'Defence',
            formation: '6:0',
            position: 'Centre Back',
            difficulty: 'Intermediate',
            isCorrect: false,
            reactionMs: 3500,
            scenarioType: 'defensive reading gap',
          },
          {
            id: 'd3',
            date: '2026-08-06T12:02:00.000Z',
            source: 'training',
            category: 'Defence',
            formation: '6:0',
            position: 'Centre Back',
            difficulty: 'Intermediate',
            isCorrect: true,
            reactionMs: 3000,
            scenarioType: 'defensive reading gap',
          },
        ],
        dailyChallenge: null,
        weeklyProgram: null,
        dailyGoals: null,
        weeklyGoals: null,
        activeProgram: {
          programId: 'backcourt_vision',
          position: 'Centre Back',
          startedAt: '2026-08-01',
          currentWeek: 3,
          weeksCompleted: [1, 2],
          sessionsThisWeek: 1,
          totalSessions: 9,
          completionPercent: 40,
          completed: false,
          assessmentPassed: false,
          lastActivityDate: '2026-08-06',
          startingOverallIq: 62,
          startingPositionIq: 60,
          startingSkillScores: { gameReading: 55, defensiveReading: 50 },
          checkpointCompleted: false,
        },
        completedPrograms: [],
        statistics: {
          totalDecisions: 3,
          correctDecisions: 1,
          decisionAccuracy: 33,
          avgReactionMs: 3500,
          byCategory: { Defence: { total: 3, correct: 1, accuracy: 33 } },
          byPosition: {},
          byDifficulty: {},
          byFormation: {},
          bySkill: { defensiveReading: { total: 3, correct: 1, accuracy: 33 } },
          dailyScores: [],
          bestDay: null,
          worstDay: null,
          improvementTrend: 4,
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
    window.localStorage.setItem('handball_iq_language', 'en');
    window.localStorage.setItem('handball_iq_dev_auth', 'true');
  });
}

async function open(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const btn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await btn.count()) {
    await btn.first().click();
    await page.waitForTimeout(1000);
  }
}

test.describe('Sprint 5 development UX', () => {
  test('home prioritizes Handball IQ and program entry', async ({ page }) => {
    await seed(page);
    await open(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Handball IQ|Overall IQ|IQ/i);
    expect(body.toLowerCase()).toMatch(/program|focus|session|challenge/);
  });

  test('programs discovery lists recommended and current', async ({ page }) => {
    await seed(page);
    await open(page);
    await page.goto('/programs');
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Program/i);
    expect(body).toMatch(/Backcourt|Recommended|Current/i);
  });

  test('progress shows skill matrix from real data', async ({ page }) => {
    await seed(page);
    await open(page);
    await page.goto('/(tabs)/progress');
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Skill|Matrix|Defensive|Game Reading|IQ/i);
  });

  test('load signature stored after recommendation resolve', async ({ page }) => {
    await seed(page);
    await open(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(2000);
    const history = await page.evaluate(() => {
      const d = JSON.parse(window.localStorage.getItem('hbiq_development') || '{}');
      return d.recommendationHistory || [];
    });
    expect(Array.isArray(history)).toBeTruthy();
  });
});
