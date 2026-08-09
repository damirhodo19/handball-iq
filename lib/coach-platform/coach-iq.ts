import { loadCoachDevState } from './storage';
import type { CoachActivityEvent, CoachChallengeAttempt } from './types';

export interface CoachSkillScore {
  id: string;
  score: number | null;
  sampleCount: number;
}

export interface CoachIqReport {
  overall: number | null;
  overallSampleCount: number;
  tacticalKnowledge: CoachSkillScore;
  matchReading: CoachSkillScore;
  trainingPlanning: CoachSkillScore;
  playerDevelopment: CoachSkillScore;
  leadership: CoachSkillScore;
  communication: CoachSkillScore;
  strongest: CoachSkillScore | null;
  weakest: CoachSkillScore | null;
  missingActivityKeys: string[];
}

const WEIGHTS = {
  tacticalKnowledge: 0.2,
  matchReading: 0.18,
  trainingPlanning: 0.18,
  playerDevelopment: 0.16,
  leadership: 0.14,
  communication: 0.14,
} as const;

const MIN_SAMPLES_FOR_SCORE = 3;

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return clamp(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function skill(id: string, values: number[]): CoachSkillScore {
  return { id, score: avg(values), sampleCount: values.length };
}

function attemptScores(
  attempts: CoachChallengeAttempt[],
  categories: string[],
): number[] {
  return attempts
    .filter((a) => categories.includes(a.category))
    .map((a) => {
      if (a.isCorrect) return 100;
      if (a.quality === 'good') return 70;
      if (a.quality === 'risky') return 40;
      return 15;
    });
}

function eventScores(events: CoachActivityEvent[], sources: string[]): number[] {
  return events
    .filter((e) => sources.includes(e.source))
    .map((e) => (typeof e.score === 'number' ? e.score : e.isCorrect ? 100 : 40));
}

export function calculateCoachIq(
  attempts: CoachChallengeAttempt[] = loadCoachDevState().challengeAttempts,
  events: CoachActivityEvent[] = loadCoachDevState().activityEvents,
): CoachIqReport {
  const tacticalKnowledge = skill(
    'tacticalKnowledge',
    attemptScores(attempts, ['timeout', 'defensive_adjustment', 'opponent_analysis']),
  );
  const matchReading = skill('matchReading', [
    ...attemptScores(attempts, ['opponent_analysis', 'defensive_adjustment', 'substitution']),
    ...eventScores(events, ['match_analysis']),
  ]);
  const trainingPlanning = skill('trainingPlanning', [
    ...attemptScores(attempts, ['training_plan']),
    ...eventScores(events, ['planner']),
  ]);
  const playerDevelopment = skill(
    'playerDevelopment',
    attemptScores(attempts, ['player_development', 'substitution']),
  );
  const leadership = skill(
    'leadership',
    attemptScores(attempts, ['leadership', 'timeout']),
  );
  const communication = skill('communication', [
    ...attemptScores(attempts, ['leadership', 'timeout', 'player_development']),
    ...eventScores(events, ['match_analysis']),
  ]);

  const parts = [
    { score: tacticalKnowledge, weight: WEIGHTS.tacticalKnowledge },
    { score: matchReading, weight: WEIGHTS.matchReading },
    { score: trainingPlanning, weight: WEIGHTS.trainingPlanning },
    { score: playerDevelopment, weight: WEIGHTS.playerDevelopment },
    { score: leadership, weight: WEIGHTS.leadership },
    { score: communication, weight: WEIGHTS.communication },
  ];

  let weightSum = 0;
  let acc = 0;
  let samples = 0;
  for (const p of parts) {
    if (p.score.score == null || p.score.sampleCount < MIN_SAMPLES_FOR_SCORE) continue;
    weightSum += p.weight;
    acc += p.score.score * p.weight;
    samples += p.score.sampleCount;
  }

  const overall = weightSum > 0 ? clamp(acc / weightSum) : null;

  const ranked = parts
    .map((p) => p.score)
    .filter((s) => s.score != null && s.sampleCount >= MIN_SAMPLES_FOR_SCORE)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const missingActivityKeys: string[] = [];
  if (tacticalKnowledge.sampleCount < MIN_SAMPLES_FOR_SCORE) {
    missingActivityKeys.push('coachIq.need.challenges');
  }
  if (trainingPlanning.sampleCount < MIN_SAMPLES_FOR_SCORE) {
    missingActivityKeys.push('coachIq.need.planner');
  }
  if (matchReading.sampleCount < MIN_SAMPLES_FOR_SCORE) {
    missingActivityKeys.push('coachIq.need.analysis');
  }
  if (attempts.length + events.length < MIN_SAMPLES_FOR_SCORE) {
    missingActivityKeys.unshift('coachIq.need.enough');
  }

  return {
    overall,
    overallSampleCount: samples,
    tacticalKnowledge,
    matchReading,
    trainingPlanning,
    playerDevelopment,
    leadership,
    communication,
    strongest: ranked[0] ?? null,
    weakest: ranked.length ? ranked[ranked.length - 1] : null,
    missingActivityKeys: [...new Set(missingActivityKeys)],
  };
}
