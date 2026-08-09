import type { CoachChallengeCategory, CoachDevState } from './types';
import { loadCoachDevState, saveCoachDevState } from './storage';
import { todayStr } from '@/lib/development/calendar';
import { awardCoachXp } from './progression';

export type CoachTrackId =
  | 'youth_coach'
  | 'match_management'
  | 'tactical_development'
  | 'player_development'
  | 'leadership'
  | 'training_planning';

export interface CoachTrackWeek {
  week: number;
  objectiveKey: string;
  categories: CoachChallengeCategory[];
  activitiesTarget: number;
}

export interface CoachTrackDef {
  id: CoachTrackId;
  titleKey: string;
  summaryKey: string;
  durationWeeks: number;
  goalTags: string[];
  weeks: CoachTrackWeek[];
  finalAssessment: {
    activitiesRequired: number;
    categories: CoachChallengeCategory[];
    minAccuracy: number;
  };
}

export type CoachTrackEnrollment = import('./types').CoachTrackEnrollmentState & {
  trackId: CoachTrackId;
};

export const COACH_TRACKS: CoachTrackDef[] = [
  {
    id: 'youth_coach',
    titleKey: 'sprint4.coachTrack.youth.title',
    summaryKey: 'sprint4.coachTrack.youth.summary',
    durationWeeks: 6,
    goalTags: ['Youth Development', 'Player Development'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.youth.w1', categories: ['player_development', 'training_plan'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.youth.w2', categories: ['training_plan', 'leadership'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.youth.w3', categories: ['player_development'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.youth.w4', categories: ['timeout', 'substitution'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.youth.w5', categories: ['player_development', 'leadership'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.youth.w6', categories: ['player_development', 'training_plan'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['player_development', 'training_plan'], minAccuracy: 70 },
  },
  {
    id: 'match_management',
    titleKey: 'sprint4.coachTrack.match.title',
    summaryKey: 'sprint4.coachTrack.match.summary',
    durationWeeks: 6,
    goalTags: ['Match Management', 'Game Management'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.match.w1', categories: ['timeout'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.match.w2', categories: ['substitution'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.match.w3', categories: ['defensive_adjustment'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.match.w4', categories: ['timeout', 'substitution'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.match.w5', categories: ['opponent_analysis'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.match.w6', categories: ['timeout', 'leadership'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['timeout', 'opponent_analysis'], minAccuracy: 70 },
  },
  {
    id: 'tactical_development',
    titleKey: 'sprint4.coachTrack.tactical.title',
    summaryKey: 'sprint4.coachTrack.tactical.summary',
    durationWeeks: 6,
    goalTags: ['Tactical Development', 'Game Intelligence'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.tactical.w1', categories: ['defensive_adjustment'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.tactical.w2', categories: ['opponent_analysis'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.tactical.w3', categories: ['defensive_adjustment', 'timeout'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.tactical.w4', categories: ['opponent_analysis', 'training_plan'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.tactical.w5', categories: ['defensive_adjustment'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.tactical.w6', categories: ['opponent_analysis', 'leadership'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['defensive_adjustment', 'opponent_analysis'], minAccuracy: 70 },
  },
  {
    id: 'player_development',
    titleKey: 'sprint4.coachTrack.player.title',
    summaryKey: 'sprint4.coachTrack.player.summary',
    durationWeeks: 6,
    goalTags: ['Player Development'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.player.w1', categories: ['player_development'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.player.w2', categories: ['training_plan'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.player.w3', categories: ['player_development', 'leadership'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.player.w4', categories: ['player_development'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.player.w5', categories: ['training_plan', 'player_development'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.player.w6', categories: ['player_development', 'leadership'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['player_development'], minAccuracy: 70 },
  },
  {
    id: 'leadership',
    titleKey: 'sprint4.coachTrack.leadership.title',
    summaryKey: 'sprint4.coachTrack.leadership.summary',
    durationWeeks: 6,
    goalTags: ['Leadership', 'Communication'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.leadership.w1', categories: ['leadership'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.leadership.w2', categories: ['timeout', 'leadership'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.leadership.w3', categories: ['leadership', 'player_development'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.leadership.w4', categories: ['leadership'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.leadership.w5', categories: ['timeout', 'substitution'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.leadership.w6', categories: ['leadership'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['leadership', 'timeout'], minAccuracy: 70 },
  },
  {
    id: 'training_planning',
    titleKey: 'sprint4.coachTrack.planning.title',
    summaryKey: 'sprint4.coachTrack.planning.summary',
    durationWeeks: 6,
    goalTags: ['Training Design', 'Training Planning'],
    weeks: [
      { week: 1, objectiveKey: 'sprint4.coachTrack.planning.w1', categories: ['training_plan'], activitiesTarget: 3 },
      { week: 2, objectiveKey: 'sprint4.coachTrack.planning.w2', categories: ['training_plan', 'player_development'], activitiesTarget: 3 },
      { week: 3, objectiveKey: 'sprint4.coachTrack.planning.w3', categories: ['training_plan'], activitiesTarget: 4 },
      { week: 4, objectiveKey: 'sprint4.coachTrack.planning.w4', categories: ['training_plan', 'opponent_analysis'], activitiesTarget: 4 },
      { week: 5, objectiveKey: 'sprint4.coachTrack.planning.w5', categories: ['training_plan'], activitiesTarget: 4 },
      { week: 6, objectiveKey: 'sprint4.coachTrack.planning.w6', categories: ['training_plan', 'leadership'], activitiesTarget: 5 },
    ],
    finalAssessment: { activitiesRequired: 3, categories: ['training_plan'], minAccuracy: 70 },
  },
];

export function getCoachTrack(id: CoachTrackId | string): CoachTrackDef | undefined {
  return COACH_TRACKS.find((t) => t.id === id);
}

function computeTrackCompletion(enrollment: CoachTrackEnrollment): number {
  const def = getCoachTrack(enrollment.trackId);
  if (!def) return 0;
  const weekWeight = 100 / (def.durationWeeks + 1);
  const done = enrollment.weeksCompleted.length * weekWeight;
  const current = def.weeks.find((w) => w.week === enrollment.currentWeek);
  const partial = current
    ? (Math.min(1, enrollment.activitiesThisWeek / current.activitiesTarget) * weekWeight)
    : 0;
  const assessmentBonus = enrollment.completed ? weekWeight : 0;
  return Math.min(
    100,
    Math.round(done + (enrollment.weeksCompleted.includes(enrollment.currentWeek) ? 0 : partial) + assessmentBonus),
  );
}

export function recommendCoachTrack(coachDevelopmentGoal?: string | null): CoachTrackDef {
  if (coachDevelopmentGoal) {
    const match = COACH_TRACKS.find((t) =>
      t.goalTags.some((g) => g.toLowerCase().includes(coachDevelopmentGoal.toLowerCase()) || coachDevelopmentGoal.toLowerCase().includes(g.toLowerCase())),
    );
    if (match) return match;
  }
  return COACH_TRACKS[0];
}

export function ensureCoachTrack(
  state: CoachDevState,
  coachDevelopmentGoal?: string | null,
): CoachTrackEnrollment {
  const existing = state.activeTrack as CoachTrackEnrollment | null | undefined;
  if (existing && !existing.completed) {
    existing.completionPercent = computeTrackCompletion(existing);
    return existing;
  }
  const track = recommendCoachTrack(coachDevelopmentGoal);
  const enrollment: CoachTrackEnrollment = {
    trackId: track.id,
    startedAt: todayStr(),
    currentWeek: 1,
    weeksCompleted: [],
    activitiesThisWeek: 0,
    totalActivities: 0,
    completionPercent: 0,
    completed: false,
    lastActivityDate: null,
    xp: 0,
    level: 1,
  };
  state.activeTrack = enrollment;
  saveCoachDevState(state);
  return enrollment;
}

/**
 * Advances coach program/track counters only.
 * XP / achievements are awarded exclusively by processCoachActivity (idempotent).
 */
export function recordCoachTrackActivity(
  category: CoachChallengeCategory,
  coachDevelopmentGoal?: string | null,
): CoachTrackEnrollment {
  const state = loadCoachDevState();
  const enrollment = ensureCoachTrack(state, coachDevelopmentGoal);
  const def = getCoachTrack(enrollment.trackId);
  if (!def || enrollment.completed) {
    saveCoachDevState(state);
    return enrollment;
  }

  const week = def.weeks.find((w) => w.week === enrollment.currentWeek);
  enrollment.activitiesThisWeek += 1;
  enrollment.totalActivities += 1;
  enrollment.lastActivityDate = todayStr();
  void category;

  if (week && enrollment.activitiesThisWeek >= week.activitiesTarget) {
    if (!enrollment.weeksCompleted.includes(enrollment.currentWeek)) {
      enrollment.weeksCompleted.push(enrollment.currentWeek);
      awardCoachXp(
        state,
        `coach_track_week_${enrollment.trackId}_${enrollment.currentWeek}`,
        'track_week',
        120,
        'track',
      );
    }
    if (enrollment.currentWeek < def.durationWeeks) {
      enrollment.currentWeek += 1;
      enrollment.activitiesThisWeek = 0;
    } else {
      enrollment.completed = true;
      awardCoachXp(state, `coach_track_complete_${enrollment.trackId}`, 'track_complete', 350, 'track');
    }
  }

  enrollment.xp = state.totalXp ?? enrollment.xp ?? 0;
  enrollment.level = state.coachLevel ?? enrollment.level ?? 1;
  enrollment.completionPercent = computeTrackCompletion(enrollment);
  state.activeTrack = enrollment;
  saveCoachDevState(state);
  return enrollment;
}
