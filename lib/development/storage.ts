import type {
  DevelopmentState,
  NotificationPreferences,
  DevelopmentStatistics,
  PlayerLevel,
} from './types';
import { calculateLevel, calculatePlayerLevel } from './levels';
import { computeStatistics } from './statistics';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import { todayStr as calendarToday, getWeekStart as calendarWeekStart } from './calendar';

const STORAGE_KEY = 'hbiq_development';

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  dailyTraining: true,
  weeklyReview: true,
  brokenStreak: true,
  achievementUnlocked: true,
  preferredHour: 18,
};

const DEFAULT_STATISTICS: DevelopmentStatistics = {
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
};

const LEGACY_LEVEL_MAP: Record<string, PlayerLevel> = {
  Beginner: 'Foundation',
  Developing: 'Developing',
  Advanced: 'Advanced',
  Elite: 'Elite',
  Professional: 'Master',
  Foundation: 'Foundation',
  Competitive: 'Competitive',
  Master: 'Master',
};

export function createDefaultState(): DevelopmentState {
  return {
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
    statistics: { ...DEFAULT_STATISTICS },
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    pendingNotifications: [],
    lastProcessedDate: null,
    recommendationHistory: [],
    processedActivityIds: [],
  };
}

function getItem<T>(key: string, fallback: T): T {
  return readStorageJson(key, fallback);
}

function setItem<T>(key: string, value: T): void {
  writeStorageJson(key, value);
}

function migrateState(raw: DevelopmentState): DevelopmentState {
  const state = { ...createDefaultState(), ...raw };
  state.totalXp = Math.max(0, Number(state.totalXp) || 0);
  state.playerLevel = calculatePlayerLevel(state.totalXp);
  const legacy = String(raw.level ?? '');
  state.level = LEGACY_LEVEL_MAP[legacy] ?? calculateLevel(state.totalXp);
  state.xpEvents = Array.isArray(state.xpEvents) ? state.xpEvents : [];
  state.achievements = Array.isArray(state.achievements) ? state.achievements : [];
  state.decisionEvents = Array.isArray(state.decisionEvents) ? state.decisionEvents : [];
  state.dailyGoals = state.dailyGoals ?? null;
  state.weeklyGoals = state.weeklyGoals ?? null;
  state.activeProgram = state.activeProgram ?? null;
  state.completedPrograms = Array.isArray(state.completedPrograms) ? state.completedPrograms : [];
  state.pausedPrograms = Array.isArray(state.pausedPrograms) ? state.pausedPrograms : [];
  state.recommendationHistory = Array.isArray(state.recommendationHistory) ? state.recommendationHistory : [];
  state.processedActivityIds = Array.isArray(state.processedActivityIds) ? state.processedActivityIds : [];
  // Migrate mis-archived paused programs out of completedPrograms
  const stillCompleted: typeof state.completedPrograms = [];
  for (const p of state.completedPrograms) {
    if (p.completed || p.status === 'completed') {
      stillCompleted.push({ ...p, status: 'completed' });
    } else if (p.status === 'paused' || (!p.completed && p.pausedAt)) {
      state.pausedPrograms.push({ ...p, status: 'paused' });
    } else if (!p.completed && (p.completionPercent ?? 0) < 100) {
      // Legacy: in-progress archived into completedPrograms on position change
      state.pausedPrograms.push({ ...p, status: 'paused', pausedAt: p.pausedAt ?? p.lastActivityDate ?? null });
    } else {
      stillCompleted.push({ ...p, status: p.completed ? 'completed' : p.status });
    }
  }
  state.completedPrograms = stillCompleted;
  state.statistics = computeStatistics(state.decisionEvents);
  if (!state.statistics.bySkill) state.statistics.bySkill = {};
  return state;
}

export function clearDevelopmentState(): void {
  setItem(STORAGE_KEY, createDefaultState());
}

export function hasProcessedActivity(state: DevelopmentState, activityKey: string): boolean {
  if (state.processedActivityIds?.includes(activityKey)) return true;
  // Legacy: XP already recorded for this activity
  return hasXpEvent(state, activityKey);
}

export function loadDevelopmentState(): DevelopmentState {
  const stored = getItem<DevelopmentState>(STORAGE_KEY, createDefaultState());
  return migrateState(stored);
}

export function saveDevelopmentState(state: DevelopmentState): void {
  state.playerLevel = calculatePlayerLevel(state.totalXp);
  state.level = calculateLevel(state.totalXp);
  state.statistics = computeStatistics(state.decisionEvents);
  setItem(STORAGE_KEY, state);
}

export function hasXpEvent(state: DevelopmentState, eventKey: string): boolean {
  return state.xpEvents.some((e) => e.eventKey === eventKey);
}

export function hasAchievement(state: DevelopmentState, id: string): boolean {
  return state.achievements.some((a) => a.id === id);
}

export function todayStr(): string {
  return calendarToday();
}

export function getWeekStart(): string {
  return calendarWeekStart();
}
