import { loadStreak } from '@/lib/storage';
import type {
  ActivityPayload,
  ActivitySource,
  DevelopmentState,
  PendingNotification,
  XpEvent,
  XpReason,
} from './types';
import { ACHIEVEMENTS, getAchievement } from './achievements';
import { XP_REWARDS, calculateLevel, calculatePlayerLevel, scoreBonus } from './levels';
import {
  loadDevelopmentState,
  saveDevelopmentState,
  hasXpEvent,
  hasAchievement,
  hasProcessedActivity,
  todayStr,
} from './storage';
import { getTodayDayIndex } from './weekly-program';
import { refreshStatistics } from './statistics';
import { generateCoachReport } from './coach-report';
import { getOrCreateWeeklyProgram } from './weekly-program';
import { applyActivityToGoals } from './goals';
import { applyProgramProgress, ensureActiveProgram } from './program-progress';
import { getProgramDef } from './programs';

export interface ProcessResult {
  state: DevelopmentState;
  xpEarned: number;
  newAchievements: string[];
  levelUp: boolean;
  previousLevel: string;
  previousPlayerLevel: number;
}

function awardXp(
  state: DevelopmentState,
  eventKey: string,
  reason: XpReason,
  amount: number,
  source: ActivitySource,
  metadata?: Record<string, string | number | boolean>,
): number {
  if (amount <= 0 || hasXpEvent(state, eventKey)) return 0;
  const event: XpEvent = {
    id: `xp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    eventKey,
    reason,
    amount,
    date: new Date().toISOString(),
    source,
    metadata,
  };
  state.xpEvents.unshift(event);
  state.totalXp += amount;
  if (state.weeklyGoals) {
    state.weeklyGoals.weeklyXp += amount;
  }
  return amount;
}

function unlockAchievement(state: DevelopmentState, id: string): boolean {
  if (hasAchievement(state, id)) return false;
  state.achievements.push({ id, unlockedAt: new Date().toISOString() });
  const def = getAchievement(id);
  if (def) {
    awardXp(state, `achievement_${id}`, 'achievement', def.xpReward, 'achievement', { achievementId: id });
    if (state.notificationPrefs.achievementUnlocked) {
      queueNotification(state, 'achievement', `Achievement unlocked: ${id.replace(/_/g, ' ')}`, `You earned ${def.xpReward} XP.`);
    }
  }
  return true;
}

function queueNotification(
  state: DevelopmentState,
  type: PendingNotification['type'],
  title: string,
  body: string,
): void {
  state.pendingNotifications.unshift({
    id: `notif_${Date.now()}`,
    type,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

function checkAchievements(state: DevelopmentState, payload: ActivityPayload): string[] {
  const unlocked: string[] = [];
  const trainingDays = new Set(
    state.decisionEvents
      .filter((e) => e.source === 'training' || e.source === 'daily_challenge')
      .map((e) => e.date.slice(0, 10)),
  ).size;
  const totalDecisions = state.statistics.totalDecisions;
  const streak = loadStreak();
  const posCat = state.statistics.byCategory[payload.position];
  const defence = state.statistics.byCategory['Defence'];
  const pressure = state.statistics.byCategory['Match Ending'];

  const checks: { id: string; condition: boolean }[] = [
    { id: 'first_training', condition: payload.source === 'training' || payload.source === 'daily_challenge' },
    { id: 'first_session', condition: payload.source === 'training' || payload.source === 'daily_challenge' },
    { id: 'match_first', condition: payload.source === 'match' },
    { id: 'daily_first', condition: payload.isDailyChallenge === true || payload.source === 'daily_challenge' },
    { id: 'perfect_session', condition: payload.isPerfect === true },
    { id: 'sessions_10', condition: trainingDays >= 10 },
    { id: 'sessions_50', condition: trainingDays >= 50 },
    { id: 'sessions_100', condition: trainingDays >= 100 },
    { id: 'decisions_100', condition: totalDecisions >= 100 },
    { id: 'decisions_500', condition: totalDecisions >= 500 },
    { id: 'streak_7', condition: streak.currentStreak >= 7 },
    { id: 'streak_30', condition: streak.currentStreak >= 30 },
    { id: 'goalkeeper_specialist', condition: payload.position === 'Goalkeeper' && (state.statistics.byCategory['Goalkeeper']?.accuracy ?? 0) >= 80 && (state.statistics.byCategory['Goalkeeper']?.total ?? 0) >= 10 },
    { id: 'position_specialist', condition: (posCat?.accuracy ?? 0) >= 80 && (posCat?.total ?? 0) >= 15 },
    { id: 'fast_break_expert', condition: (state.statistics.byCategory['Fast Break']?.accuracy ?? 0) >= 80 && (state.statistics.byCategory['Fast Break']?.total ?? 0) >= 10 },
    { id: 'defensive_reader', condition: (defence?.accuracy ?? 0) >= 80 && (defence?.total ?? 0) >= 10 },
    { id: 'pressure_master', condition: (pressure?.accuracy ?? 0) >= 80 && (pressure?.total ?? 0) >= 10 },
    { id: 'decision_master', condition: state.statistics.decisionAccuracy >= 85 && totalDecisions >= 50 },
    { id: 'elite_thinker', condition: state.playerLevel >= 61 || state.level === 'Elite' || state.level === 'Master' },
    { id: 'weekly_complete', condition: (state.weeklyProgram?.daysCompleted ?? 0) >= 7 },
    { id: 'program_first_week', condition: (state.activeProgram?.weeksCompleted.length ?? 0) >= 1 },
    { id: 'program_complete', condition: state.activeProgram?.completed === true },
  ];

  for (const { id, condition } of checks) {
    if (condition && unlockAchievement(state, id)) unlocked.push(id);
  }
  return unlocked;
}

export function processActivity(payload: ActivityPayload): ProcessResult {
  const state = loadDevelopmentState();
  const previousLevel = state.level;
  const previousPlayerLevel = state.playerLevel;
  let xpEarned = 0;
  const now = new Date().toISOString();
  const sourceKey = `${payload.source}_${payload.sourceId}`;

  // One logical activity → one progression transaction (decisions, programs, goals, XP)
  if (hasProcessedActivity(state, sourceKey)) {
    return {
      state,
      xpEarned: 0,
      newAchievements: [],
      levelUp: false,
      previousLevel,
      previousPlayerLevel,
    };
  }
  if (!state.processedActivityIds) state.processedActivityIds = [];
  state.processedActivityIds.unshift(sourceKey);
  if (state.processedActivityIds.length > 400) {
    state.processedActivityIds = state.processedActivityIds.slice(0, 400);
  }

  ensureActiveProgram(state, payload.position);

  for (const d of payload.decisions) {
    state.decisionEvents.unshift({
      id: `dec_${payload.sourceId}_${state.decisionEvents.length}`,
      date: now,
      source: payload.source,
      category: d.category,
      formation: d.formation,
      position: payload.position,
      difficulty: d.difficulty,
      isCorrect: d.isCorrect,
      reactionMs: d.reactionMs,
      scenarioType: d.scenarioType,
    });
  }
  if (state.decisionEvents.length > 500) {
    state.decisionEvents = state.decisionEvents.slice(0, 500);
  }

  const avgReaction = payload.decisions.length > 0
    ? payload.decisions.reduce((s, d) => s + d.reactionMs, 0) / payload.decisions.length
    : payload.durationSeconds * 1000;

  if (payload.source === 'training') {
    xpEarned += awardXp(state, sourceKey, 'training_complete', XP_REWARDS.training_base, 'training');
    xpEarned += awardXp(state, `${sourceKey}_bonus`, 'training_complete', scoreBonus(payload.decisionScore), 'training');
  } else if (payload.source === 'match') {
    xpEarned += awardXp(state, sourceKey, 'match_complete', XP_REWARDS.match_base, 'match');
    xpEarned += awardXp(state, `${sourceKey}_bonus`, 'match_complete', scoreBonus(payload.decisionScore), 'match');
  } else if (payload.source === 'daily_challenge') {
    xpEarned += awardXp(state, `daily_${todayStr()}`, 'daily_challenge', XP_REWARDS.daily_challenge, 'daily_challenge');
    xpEarned += awardXp(state, `${sourceKey}_bonus`, 'daily_challenge', scoreBonus(payload.decisionScore), 'daily_challenge');
    // Persist completion on the same in-memory state (avoid clobber via separate load/save)
    if (state.dailyChallenge) {
      state.dailyChallenge.completed = true;
      state.dailyChallenge.completedScore = payload.decisionScore;
      state.dailyChallenge.xpAwarded = true;
      state.dailyChallengesByPosition = {
        ...(state.dailyChallengesByPosition ?? {}),
        [payload.position]: state.dailyChallenge,
      };
    }
  }

  if (payload.isPerfect) {
    xpEarned += awardXp(state, `perfect_${sourceKey}`, 'perfect_session', XP_REWARDS.perfect_session, payload.source as ActivitySource);
  }

  if (avgReaction < 5000 && payload.decisions.length >= 3) {
    xpEarned += awardXp(state, `fast_${sourceKey}`, 'fast_decisions', XP_REWARDS.fast_decisions, payload.source as ActivitySource);
  }

  const dayIndex = getTodayDayIndex();
  state.weeklyProgram = getOrCreateWeeklyProgram(payload.position, state);
  if (state.weeklyProgram) {
    const dayKey = `weekly_${state.weeklyProgram.weekStart}_day_${dayIndex}`;
    const day = state.weeklyProgram.days[dayIndex];
    if (day && !day.completed) {
      day.completed = true;
      day.completedDate = todayStr();
      day.score = payload.decisionScore;
      state.weeklyProgram.daysCompleted = state.weeklyProgram.days.filter((d) => d.completed).length;
      const scores = state.weeklyProgram.days.filter((d) => d.completed && d.score != null).map((d) => d.score!);
      state.weeklyProgram.weeklyScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      state.weeklyProgramsByPosition = {
        ...(state.weeklyProgramsByPosition ?? {}),
        [payload.position]: state.weeklyProgram,
      };
    }
    if (!hasXpEvent(state, dayKey)) {
      xpEarned += awardXp(state, dayKey, 'weekly_day', XP_REWARDS.weekly_day, 'weekly_program');
    }
    if (state.weeklyProgram.daysCompleted >= 7 && !state.weeklyProgram.xpAwarded) {
      xpEarned += awardXp(state, `weekly_complete_${state.weeklyProgram.weekStart}`, 'weekly_complete', XP_REWARDS.weekly_complete, 'weekly_program');
      state.weeklyProgram.xpAwarded = true;
    }
  }

  const programResult = applyProgramProgress(state, payload.position, payload.decisionScore);
  if (programResult.weekCompleted && state.activeProgram) {
    const weekKey = `program_${state.activeProgram.programId}_week_${state.activeProgram.weeksCompleted[state.activeProgram.weeksCompleted.length - 1]}`;
    xpEarned += awardXp(state, weekKey, 'program_week', XP_REWARDS.program_week, 'program');
  }
  if (programResult.milestone && state.activeProgram) {
    const mileKey = `program_${state.activeProgram.programId}_milestone_${state.activeProgram.currentWeek}`;
    xpEarned += awardXp(state, mileKey, 'program_milestone', XP_REWARDS.program_milestone, 'program');
  }
  if (programResult.programCompleted && state.activeProgram) {
    const doneKey = `program_${state.activeProgram.programId}_complete`;
    xpEarned += awardXp(state, doneKey, 'program_complete', XP_REWARDS.program_complete, 'program');
  }

  state.statistics = refreshStatistics(state);

  const streak = loadStreak();
  const streakKey = `streak_${todayStr()}`;
  if (streak.currentStreak >= 1 && !hasXpEvent(state, streakKey)) {
    xpEarned += awardXp(state, streakKey, 'streak_day', XP_REWARDS.streak_day, 'streak_bonus');
  }

  const { dailyXpKeys, weeklyXpKeys } = applyActivityToGoals(state, payload, streak.currentStreak);
  for (const key of dailyXpKeys) {
    xpEarned += awardXp(state, key, 'daily_goal', XP_REWARDS.daily_goal, 'daily_goal');
  }
  for (const key of weeklyXpKeys) {
    xpEarned += awardXp(state, key, 'weekly_goal', XP_REWARDS.weekly_goal, 'weekly_goal');
  }

  state.playerLevel = calculatePlayerLevel(state.totalXp);
  state.level = calculateLevel(state.totalXp);
  const newAchievements = checkAchievements(state, payload);
  state.lastProcessedDate = todayStr();
  saveDevelopmentState(state);

  return {
    state,
    xpEarned,
    newAchievements,
    levelUp: state.playerLevel !== previousPlayerLevel || state.level !== previousLevel,
    previousLevel,
    previousPlayerLevel,
  };
}

export function getDevelopmentSnapshot(position: import('@/lib/positions').HandballPosition) {
  const state = loadDevelopmentState();
  ensureActiveProgram(state, position);
  saveDevelopmentState(state);
  return {
    state,
    coachReport: generateCoachReport(state, position),
    achievements: ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: hasAchievement(state, a.id),
      unlockedAt: state.achievements.find((u) => u.id === a.id)?.unlockedAt,
    })),
    program: state.activeProgram
      ? {
          ...state.activeProgram,
          def: getProgramDef(state.activeProgram.programId),
        }
      : null,
  };
}

export function updateNotificationPrefs(prefs: Partial<import('./types').NotificationPreferences>): void {
  const state = loadDevelopmentState();
  state.notificationPrefs = { ...state.notificationPrefs, ...prefs };
  saveDevelopmentState(state);
}

export function getPendingNotifications(): PendingNotification[] {
  return loadDevelopmentState().pendingNotifications.filter((n) => !n.read);
}

export function markNotificationRead(id: string): void {
  const state = loadDevelopmentState();
  const n = state.pendingNotifications.find((x) => x.id === id);
  if (n) n.read = true;
  saveDevelopmentState(state);
}

export function prepareDailyReminder(): PendingNotification | null {
  const state = loadDevelopmentState();
  if (!state.notificationPrefs.dailyTraining) return null;
  if (state.dailyChallenge?.completed) return null;
  return {
    id: `reminder_daily_${todayStr()}`,
    type: 'daily_training',
    title: 'Daily Challenge Ready',
    body: 'Your position-specific daily challenge is waiting. Keep your streak alive.',
    createdAt: new Date().toISOString(),
    read: false,
  };
}
