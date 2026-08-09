import { todayStr, getWeekStart, daysBetweenLocal } from '@/lib/development/calendar';
import type {
  CoachDevState,
  CoachXpEvent,
  CoachWeeklyGoalsState,
} from './types';
import { COACH_ACHIEVEMENTS, getCoachAchievement } from './achievements';
import { loadCoachDevState, saveCoachDevState } from './storage';

const XP_PER_LEVEL = 100;

export function calculateCoachLevel(totalXp: number): number {
  return Math.min(50, Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1);
}

export function hasCoachXpEvent(state: CoachDevState, eventKey: string): boolean {
  return (state.xpEvents ?? []).some((e) => e.eventKey === eventKey);
}

export function awardCoachXp(
  state: CoachDevState,
  eventKey: string,
  reason: string,
  amount: number,
  source: string,
  metadata?: Record<string, string | number | boolean>,
): number {
  if (amount <= 0 || hasCoachXpEvent(state, eventKey)) return 0;
  const event: CoachXpEvent = {
    id: `cxp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    eventKey,
    reason,
    amount,
    source,
    date: new Date().toISOString(),
    metadata,
  };
  state.xpEvents = [event, ...(state.xpEvents ?? [])].slice(0, 300);
  state.totalXp = (state.totalXp ?? 0) + amount;
  state.coachLevel = calculateCoachLevel(state.totalXp);
  if (state.weeklyGoals) state.weeklyGoals.weeklyXp += amount;
  if (state.activeTrack) {
    state.activeTrack.xp = state.totalXp;
    state.activeTrack.level = state.coachLevel;
  }
  return amount;
}

export function unlockCoachAchievement(state: CoachDevState, id: string): boolean {
  if ((state.achievements ?? []).some((a) => a.id === id)) return false;
  state.achievements = [...(state.achievements ?? []), { id, unlockedAt: new Date().toISOString() }];
  const def = getCoachAchievement(id);
  if (def) {
    awardCoachXp(state, `coach_achievement_${id}`, 'achievement', def.xpReward, 'achievement', {
      achievementId: id,
    });
  }
  return true;
}

export function updateCoachStreak(state: CoachDevState): void {
  if (!state.streak) {
    state.streak = { currentStreak: 0, longestStreak: 0, lastQualifyingDate: null };
  }
  const today = todayStr();
  const last = state.streak.lastQualifyingDate;
  if (last === today) return;
  if (last) {
    const gap = daysBetweenLocal(last, today);
    if (gap === 1) state.streak.currentStreak += 1;
    else if (gap > 1) state.streak.currentStreak = 1;
    else state.streak.currentStreak = Math.max(1, state.streak.currentStreak);
  } else {
    state.streak.currentStreak = 1;
  }
  state.streak.longestStreak = Math.max(state.streak.longestStreak, state.streak.currentStreak);
  state.streak.lastQualifyingDate = today;
}

export function ensureCoachWeeklyGoals(state: CoachDevState): CoachWeeklyGoalsState {
  const weekStart = getWeekStart();
  if (state.weeklyGoals?.weekStart === weekStart) return state.weeklyGoals;
  state.weeklyGoals = {
    weekStart,
    weeklyXp: 0,
    goals: [
      {
        id: 'coach_weekly_challenges',
        type: 'challenges',
        target: 3,
        progress: 0,
        status: 'pending',
        xpReward: 50,
        labelKey: 'sprint4.coachWeekly.challenges',
      },
      {
        id: 'coach_weekly_plans',
        type: 'plans',
        target: 2,
        progress: 0,
        status: 'pending',
        xpReward: 50,
        labelKey: 'sprint4.coachWeekly.plans',
      },
      {
        id: 'coach_weekly_analyses',
        type: 'analyses',
        target: 1,
        progress: 0,
        status: 'pending',
        xpReward: 50,
        labelKey: 'sprint4.coachWeekly.analyses',
      },
      {
        id: 'coach_weekly_streak',
        type: 'streak',
        target: 5,
        progress: 0,
        status: 'pending',
        xpReward: 60,
        labelKey: 'sprint4.coachWeekly.streak',
      },
    ],
  };
  return state.weeklyGoals;
}

function bumpWeekly(
  state: CoachDevState,
  id: string,
  amount = 1,
): string | null {
  ensureCoachWeeklyGoals(state);
  const g = state.weeklyGoals!.goals.find((x) => x.id === id);
  if (!g || g.status === 'completed') return null;
  if (g.type === 'streak') g.progress = state.streak?.currentStreak ?? 0;
  else g.progress = Math.min(g.target, g.progress + amount);
  if (g.progress >= g.target) {
    g.status = 'completed';
    return `coach_weekly_${state.weeklyGoals!.weekStart}_${id}`;
  }
  return null;
}

export function checkCoachAchievements(state: CoachDevState): string[] {
  const unlocked: string[] = [];
  const challenges = state.challengeAttempts?.length ?? 0;
  const plans = state.trainingPlans?.length ?? 0;
  const analyses = state.matchAnalyses?.length ?? 0;
  const tactical = (state.challengeAttempts ?? []).filter((a) =>
    ['defensive_adjustment', 'opponent_analysis', 'timeout'].includes(a.category),
  ).length;
  const playerDev = (state.challengeAttempts ?? []).filter((a) =>
    ['player_development', 'substitution'].includes(a.category),
  ).length;
  const leadership = (state.challengeAttempts ?? []).filter((a) => a.category === 'leadership').length;
  const plannerActs = plans + (state.challengeAttempts ?? []).filter((a) => a.category === 'training_plan').length;

  const checks: { id: string; ok: boolean }[] = [
    { id: 'coach_first_challenge', ok: challenges >= 1 },
    { id: 'coach_challenges_10', ok: challenges >= 10 },
    { id: 'coach_first_plan', ok: plans >= 1 },
    { id: 'coach_plans_10', ok: plans >= 10 },
    { id: 'coach_first_analysis', ok: analyses >= 1 },
    { id: 'coach_analyses_10', ok: analyses >= 10 },
    { id: 'coach_streak_7', ok: (state.streak?.currentStreak ?? 0) >= 7 },
    { id: 'coach_tactical_specialist', ok: tactical >= 8 },
    { id: 'coach_player_dev_specialist', ok: playerDev >= 8 },
    { id: 'coach_planner_specialist', ok: plannerActs >= 8 },
    { id: 'coach_match_reader', ok: analyses >= 5 },
    { id: 'coach_leadership_dev', ok: leadership >= 5 },
  ];

  for (const { id, ok } of checks) {
    if (ok && unlockCoachAchievement(state, id)) unlocked.push(id);
  }
  return unlocked;
}

export type CoachActivitySource = 'challenge' | 'planner' | 'match_analysis' | 'track';

/** Process a coach activity with idempotent XP, streak, weekly goals, achievements. */
export function processCoachActivity(input: {
  source: CoachActivitySource;
  sourceId: string;
  category?: string;
}): { state: CoachDevState; xpEarned: number; newAchievements: string[] } {
  const state = loadCoachDevState();
  ensureCoachWeeklyGoals(state);
  updateCoachStreak(state);

  let xpEarned = 0;
  const baseKey = `coach_${input.source}_${input.sourceId}`;
  const baseXp =
    input.source === 'challenge' ? 40 : input.source === 'planner' ? 50 : input.source === 'match_analysis' ? 60 : 40;
  xpEarned += awardCoachXp(state, baseKey, `${input.source}_complete`, baseXp, input.source);

  if (input.source === 'challenge') {
    const wk = bumpWeekly(state, 'coach_weekly_challenges');
    if (wk) xpEarned += awardCoachXp(state, wk, 'weekly_goal', 50, 'weekly_goal');
  } else if (input.source === 'planner') {
    const wk = bumpWeekly(state, 'coach_weekly_plans');
    if (wk) xpEarned += awardCoachXp(state, wk, 'weekly_goal', 50, 'weekly_goal');
  } else if (input.source === 'match_analysis') {
    const wk = bumpWeekly(state, 'coach_weekly_analyses');
    if (wk) xpEarned += awardCoachXp(state, wk, 'weekly_goal', 50, 'weekly_goal');
  }

  const streakWk = bumpWeekly(state, 'coach_weekly_streak', 0);
  if (streakWk) xpEarned += awardCoachXp(state, streakWk, 'weekly_goal', 60, 'weekly_goal');

  const newAchievements = checkCoachAchievements(state);
  state.coachLevel = calculateCoachLevel(state.totalXp);
  saveCoachDevState(state);
  return { state, xpEarned, newAchievements };
}

export function listCoachAchievements(state: CoachDevState = loadCoachDevState()) {
  return COACH_ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: (state.achievements ?? []).some((u) => u.id === a.id),
    unlockedAt: (state.achievements ?? []).find((u) => u.id === a.id)?.unlockedAt,
  }));
}
