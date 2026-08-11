import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import type {
  CoachActivityEvent,
  CoachChallengeAttempt,
  CoachDevState,
  MatchAnalysisRecord,
  TrainingPlan,
} from './types';
const KEY = 'hbiq_coach_dev_state';
const XP_PER_LEVEL = 100;

function calculateCoachLevel(totalXp: number): number {
  return Math.min(50, Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1);
}

const DEFAULT_STATE: CoachDevState = {
  totalXp: 0,
  coachLevel: 1,
  xpEvents: [],
  achievements: [],
  streak: { currentStreak: 0, longestStreak: 0, lastQualifyingDate: null },
  weeklyGoals: null,
  challengeAttempts: [],
  trainingPlans: [],
  matchAnalyses: [],
  activityEvents: [],
  dailyChallengeId: null,
  dailyChallengeDate: null,
  dailyChallengeCompleted: false,
  activeTrack: null,
};

function migrate(raw: CoachDevState): CoachDevState {
  const state: CoachDevState = {
    ...DEFAULT_STATE,
    ...raw,
    xpEvents: Array.isArray(raw.xpEvents) ? raw.xpEvents : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    streak: raw.streak ?? DEFAULT_STATE.streak,
    weeklyGoals: raw.weeklyGoals ?? null,
    challengeAttempts: Array.isArray(raw.challengeAttempts) ? raw.challengeAttempts : [],
    trainingPlans: Array.isArray(raw.trainingPlans) ? raw.trainingPlans : [],
    matchAnalyses: Array.isArray(raw.matchAnalyses) ? raw.matchAnalyses : [],
    activityEvents: Array.isArray(raw.activityEvents) ? raw.activityEvents : [],
  };
  // Migrate legacy track XP into canonical totalXp once
  if ((!state.totalXp || state.totalXp === 0) && state.activeTrack?.xp) {
    state.totalXp = state.activeTrack.xp;
  }
  state.coachLevel = calculateCoachLevel(state.totalXp ?? 0);
  if (state.activeTrack) {
    state.activeTrack.xp = state.totalXp;
    state.activeTrack.level = state.coachLevel;
  }
  return state;
}

export function loadCoachDevState(): CoachDevState {
  return migrate(readStorageJson<CoachDevState>(KEY, DEFAULT_STATE));
}

export function saveCoachDevState(state: CoachDevState): void {
  state.coachLevel = calculateCoachLevel(state.totalXp ?? 0);
  writeStorageJson(KEY, state);
}

export function recordChallengeAttempt(attempt: CoachChallengeAttempt): void {
  const state = loadCoachDevState();
  // Idempotent: stable attempt id → one challenge attempt / XP / streak evaluation
  if ((state.challengeAttempts ?? []).some((a) => a.id === attempt.id)) {
    return;
  }
  state.challengeAttempts = [attempt, ...state.challengeAttempts].slice(0, 200);
  const event: CoachActivityEvent = {
    id: `evt_${attempt.id}`,
    date: attempt.date,
    source: 'challenge',
    category: attempt.category,
    isCorrect: attempt.isCorrect,
    score: attempt.isCorrect ? 100 : attempt.quality === 'good' ? 70 : attempt.quality === 'risky' ? 40 : 10,
  };
  state.activityEvents = [event, ...state.activityEvents].slice(0, 300);
  if (state.dailyChallengeId === attempt.challengeId) {
    state.dailyChallengeCompleted = true;
  }
  saveCoachDevState(state);

  void (async () => {
    const { recordCoachTrackActivity } = await import('./tracks');
    recordCoachTrackActivity(attempt.category);
    const { processCoachActivity } = await import('./progression');
    processCoachActivity({ source: 'challenge', sourceId: attempt.id, category: attempt.category });
    const mod = await import('@/services/coachDevelopmentService');
    mod.queueCoachSync();
  })();
}

export function saveTrainingPlan(plan: TrainingPlan): void {
  const state = loadCoachDevState();
  if ((state.trainingPlans ?? []).some((p) => p.id === plan.id)) {
    return;
  }
  state.trainingPlans = [plan, ...state.trainingPlans].slice(0, 50);
  const planEvent: CoachActivityEvent = {
    id: `evt_${plan.id}`,
    date: plan.createdAt,
    source: 'planner',
    category: plan.input.focus,
    score: 80,
  };
  state.activityEvents = [planEvent, ...state.activityEvents].slice(0, 300);
  saveCoachDevState(state);
  void (async () => {
    const { recordCoachTrackActivity } = await import('./tracks');
    recordCoachTrackActivity('training_plan');
    const { processCoachActivity } = await import('./progression');
    processCoachActivity({ source: 'planner', sourceId: plan.id, category: 'training_plan' });
    const mod = await import('@/services/coachDevelopmentService');
    mod.queueCoachSync();
  })();
}

export function saveMatchAnalysis(record: MatchAnalysisRecord): void {
  const state = loadCoachDevState();
  if ((state.matchAnalyses ?? []).some((r) => r.id === record.id)) {
    return;
  }
  state.matchAnalyses = [record, ...state.matchAnalyses].slice(0, 50);
  const avg =
    Object.values(record.ratings).reduce((a, b) => a + b, 0) /
    Math.max(1, Object.keys(record.ratings).length);
  const analysisEvent: CoachActivityEvent = {
    id: `evt_${record.id}`,
    date: record.createdAt,
    source: 'match_analysis',
    category: 'match_analysis',
    score: Math.round(avg * 20),
  };
  state.activityEvents = [analysisEvent, ...state.activityEvents].slice(0, 300);
  saveCoachDevState(state);
  void (async () => {
    const { recordCoachTrackActivity } = await import('./tracks');
    recordCoachTrackActivity('opponent_analysis');
    const { processCoachActivity } = await import('./progression');
    processCoachActivity({ source: 'match_analysis', sourceId: record.id, category: 'opponent_analysis' });
    const mod = await import('@/services/coachDevelopmentService');
    mod.queueCoachSync();
  })();
}

export function setDailyCoachChallenge(challengeId: string, date: string, force = false): void {
  const state = loadCoachDevState();
  if (!force && state.dailyChallengeDate === date && state.dailyChallengeId) return;
  state.dailyChallengeId = challengeId;
  state.dailyChallengeDate = date;
  state.dailyChallengeCompleted = false;
  saveCoachDevState(state);
}
