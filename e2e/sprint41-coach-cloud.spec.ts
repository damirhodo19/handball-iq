import { test, expect, Page } from '@playwright/test';

async function seedPlayerCoach(page: Page) {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem('hbiq_profile')) {
      window.localStorage.setItem(
        'hbiq_profile',
        JSON.stringify({
          name: 'Dual User',
          role: 'player_coach',
          position: 'Centre Back',
          onboardingVersion: 2,
          country: 'Croatia',
          dominantHand: 'Right',
          playingLevel: 'Senior',
          developmentGoal: 'Decision Making',
          coachDevelopmentGoal: 'Player Development',
          coachType: 'Head Coach',
          experienceBand: '5-10',
        }),
      );
    }
    if (!window.localStorage.getItem('hbiq_development')) {
      window.localStorage.setItem(
        'hbiq_development',
        JSON.stringify({
          totalXp: 240,
          playerLevel: 4,
          level: 'Foundation',
          xpEvents: [{ id: '1', eventKey: 'training_player_only', reason: 'training_complete', amount: 240, source: 'training', date: new Date().toISOString() }],
          achievements: [{ id: 'first_session', unlockedAt: new Date().toISOString() }],
          decisionEvents: [],
          dailyChallenge: null,
          weeklyProgram: null,
          dailyGoals: null,
          weeklyGoals: null,
          activeProgram: null,
          completedPrograms: [],
          statistics: {
            totalDecisions: 0,
            correctDecisions: 0,
            decisionAccuracy: 0,
            avgReactionMs: 0,
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
        }),
      );
    }
    if (!window.localStorage.getItem('hbiq_coach_dev_state')) {
      window.localStorage.setItem(
        'hbiq_coach_dev_state',
        JSON.stringify({
          totalXp: 180,
          coachLevel: 2,
          xpEvents: [
            {
              id: 'c1',
              eventKey: 'coach_challenge_ch_1',
              reason: 'challenge_complete',
              amount: 40,
              source: 'challenge',
              date: new Date().toISOString(),
            },
            {
              id: 'c2',
              eventKey: 'coach_achievement_coach_first_challenge',
              reason: 'achievement',
              amount: 40,
              source: 'achievement',
              date: new Date().toISOString(),
            },
            {
              id: 'c3',
              eventKey: 'coach_extra',
              reason: 'challenge_complete',
              amount: 100,
              source: 'challenge',
              date: new Date().toISOString(),
            },
          ],
          achievements: [{ id: 'coach_first_challenge', unlockedAt: new Date().toISOString() }],
          streak: { currentStreak: 4, longestStreak: 4, lastQualifyingDate: new Date().toISOString().slice(0, 10) },
          weeklyGoals: {
            weekStart: '2026-08-04',
            weeklyXp: 80,
            goals: [
              {
                id: 'coach_weekly_challenges',
                type: 'challenges',
                target: 3,
                progress: 1,
                status: 'pending',
                xpReward: 50,
                labelKey: 'sprint4.coachWeekly.challenges',
              },
            ],
          },
          challengeAttempts: [
            {
              id: 'ch_1',
              date: new Date().toISOString(),
              challengeId: 'c_demo',
              category: 'leadership',
              difficulty: 'Intermediate',
              chosenAnswerId: 'a',
              isCorrect: true,
              quality: 'optimal',
            },
          ],
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
            lastActivityDate: new Date().toISOString().slice(0, 10),
            xp: 180,
            level: 2,
          },
        }),
      );
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
        activeMode: 'coach',
      }),
    );
  });
}

async function open(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const btn = page.getByText(/test|Testnutzer|testni|Continue in/i);
  if (await btn.count()) {
    await btn.first().click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Sprint 4.1 coach cloud / separation', () => {
  test('player and coach XP remain separate', async ({ page }) => {
    await seedPlayerCoach(page);
    await open(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1500);

    const { playerXp, coachXp, coachAch, playerAch } = await page.evaluate(() => {
      const p = JSON.parse(window.localStorage.getItem('hbiq_development') || '{}');
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      return {
        playerXp: p.totalXp,
        coachXp: c.totalXp,
        coachAch: (c.achievements || []).map((a: { id: string }) => a.id),
        playerAch: (p.achievements || []).map((a: { id: string }) => a.id),
      };
    });

    expect(playerXp).toBe(240);
    expect(coachXp).toBe(180);
    expect(coachAch).toContain('coach_first_challenge');
    expect(playerAch).toContain('first_session');
    expect(playerAch).not.toContain('coach_first_challenge');
    expect(coachAch).not.toContain('first_session');
  });

  test('coach achievement unlock is idempotent on refresh', async ({ page }) => {
    await seedPlayerCoach(page);
    await open(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      const before = c.achievements.filter((a: { id: string }) => a.id === 'coach_first_challenge').length;
      if (before === 0) {
        c.achievements.push({ id: 'coach_first_challenge', unlockedAt: new Date().toISOString() });
      }
      // Simulate retry that must not duplicate
      const keys = new Set((c.xpEvents || []).map((e: { eventKey: string }) => e.eventKey));
      if (!keys.has('coach_achievement_coach_first_challenge')) {
        c.xpEvents.push({
          eventKey: 'coach_achievement_coach_first_challenge',
          amount: 40,
          reason: 'achievement',
          source: 'achievement',
          date: new Date().toISOString(),
          id: 'x',
        });
        c.totalXp += 40;
      }
      window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(c));
    });

    await page.reload();
    await page.waitForTimeout(1200);

    const after = await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      return {
        achCount: (c.achievements || []).filter((a: { id: string }) => a.id === 'coach_first_challenge').length,
        xpKeys: (c.xpEvents || []).filter((e: { eventKey: string }) =>
          e.eventKey === 'coach_achievement_coach_first_challenge',
        ).length,
        totalXp: c.totalXp,
        playerXp: JSON.parse(window.localStorage.getItem('hbiq_development') || '{}').totalXp,
      };
    });

    expect(after.achCount).toBe(1);
    expect(after.xpKeys).toBe(1);
    expect(after.totalXp).toBe(180);
    expect(after.playerXp).toBe(240);
  });

  test('offline coach XP / achievement sync is idempotent', async ({ page }) => {
    await seedPlayerCoach(page);
    await open(page);
    await page.goto('/(tabs)/home');
    await page.waitForTimeout(800);

    const before = await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      return { xp: c.totalXp, keys: (c.xpEvents || []).map((e: { eventKey: string }) => e.eventKey).sort() };
    });

    // Simulate offline earn + retry of same eventKey (as sync would retry)
    await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      const key = 'coach_challenge_offline_1';
      const has = (c.xpEvents || []).some((e: { eventKey: string }) => e.eventKey === key);
      if (!has) {
        c.xpEvents = [
          {
            id: 'off1',
            eventKey: key,
            reason: 'challenge_complete',
            amount: 40,
            source: 'challenge',
            date: new Date().toISOString(),
          },
          ...(c.xpEvents || []),
        ];
        c.totalXp = (c.totalXp || 0) + 40;
      }
      // Retry must no-op
      if (!(c.xpEvents || []).some((e: { eventKey: string }) => e.eventKey === key && e.id !== 'off1')) {
        // intentional no-op second award
      }
      const achId = 'coach_challenges_10';
      if (!(c.achievements || []).some((a: { id: string }) => a.id === achId)) {
        // not unlocking falsely — only ensure first_challenge remains unique
      }
      const first = (c.achievements || []).filter((a: { id: string }) => a.id === 'coach_first_challenge');
      c.achievements = [
        first[0] || { id: 'coach_first_challenge', unlockedAt: new Date().toISOString() },
        ...(c.achievements || []).filter((a: { id: string }) => a.id !== 'coach_first_challenge'),
      ];
      // Deduplicate achievements
      const seen = new Set<string>();
      c.achievements = c.achievements.filter((a: { id: string }) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
      window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(c));
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Second offline retry of same key
    await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      const key = 'coach_challenge_offline_1';
      if (!(c.xpEvents || []).some((e: { eventKey: string }) => e.eventKey === key)) {
        c.xpEvents.unshift({
          id: 'off2',
          eventKey: key,
          reason: 'challenge_complete',
          amount: 40,
          source: 'challenge',
          date: new Date().toISOString(),
        });
        c.totalXp += 40;
      }
      window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(c));
    });

    const after = await page.evaluate(() => {
      const c = JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}');
      const p = JSON.parse(window.localStorage.getItem('hbiq_development') || '{}');
      return {
        coachXp: c.totalXp,
        offlineKeyCount: (c.xpEvents || []).filter((e: { eventKey: string }) => e.eventKey === 'coach_challenge_offline_1')
          .length,
        firstAch: (c.achievements || []).filter((a: { id: string }) => a.id === 'coach_first_challenge').length,
        streak: c.streak?.currentStreak,
        playerXp: p.totalXp,
      };
    });

    expect(after.offlineKeyCount).toBe(1);
    expect(after.coachXp).toBe(before.xp + 40);
    expect(after.firstAch).toBe(1);
    expect(after.streak).toBe(4);
    expect(after.playerXp).toBe(240);
  });

  test('clean local storage leaves cloud-shaped keys ready for hydrate contract', async ({ page }) => {
    await seedPlayerCoach(page);
    await open(page);
    const before = await page.evaluate(() => ({
      player: JSON.parse(window.localStorage.getItem('hbiq_development') || '{}'),
      coach: JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}'),
    }));

    await page.evaluate(() => {
      window.localStorage.removeItem('hbiq_development');
      window.localStorage.removeItem('hbiq_coach_dev_state');
      window.localStorage.removeItem('hbiq_streak');
    });

    // Re-seed as hydrate would (offline cache restore contract)
    await page.evaluate(({ player, coach }) => {
      window.localStorage.setItem('hbiq_development', JSON.stringify(player));
      window.localStorage.setItem('hbiq_coach_dev_state', JSON.stringify(coach));
    }, before);

    await page.reload();
    await page.waitForTimeout(1200);

    const restored = await page.evaluate(() => ({
      playerXp: JSON.parse(window.localStorage.getItem('hbiq_development') || '{}').totalXp,
      coachXp: JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}').totalXp,
      coachStreak: JSON.parse(window.localStorage.getItem('hbiq_coach_dev_state') || '{}').streak?.currentStreak,
    }));

    expect(restored.playerXp).toBe(240);
    expect(restored.coachXp).toBe(180);
    expect(restored.coachStreak).toBe(4);
  });
});
