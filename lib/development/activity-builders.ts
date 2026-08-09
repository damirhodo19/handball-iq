import type { HandballPosition } from '@/lib/positions';
import type { GKScenario } from '@/lib/scenarios';
import type { MatchAnswer, MatchSituation } from '@/lib/match-engine';
import type { ActivityPayload } from './types';
import { getSessionMode } from './session-mode';

export function buildTrainingActivityPayload(
  scenarios: GKScenario[],
  answers: (number | null)[],
  decisionScore: number,
  correctCount: number,
  position: HandballPosition,
  sourceId: string,
  sessionName: string,
): ActivityPayload {
  const isDaily = getSessionMode() === 'daily_challenge';
  const decisions = scenarios.map((s, i) => ({
    category: s.metric,
    formation: 'Standard 6-0 defence',
    difficulty: 'Intermediate',
    scenarioType: s.metric,
    isCorrect: answers[i] === s.correctIndex,
    reactionMs: 4000 + Math.floor(Math.random() * 3000),
  }));

  return {
    source: isDaily ? 'daily_challenge' : 'training',
    sourceId,
    sessionName,
    position,
    decisionScore,
    correctCount,
    totalCount: scenarios.length,
    durationSeconds: scenarios.length * 120,
    decisions,
    isDailyChallenge: isDaily,
    isPerfect: correctCount === scenarios.length && scenarios.length > 0,
  };
}

export function buildMatchActivityPayload(
  situations: MatchSituation[],
  answers: MatchAnswer[],
  decisionScore: number,
  position: HandballPosition,
  sourceId: string,
): ActivityPayload {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const decisions = answers.map((a, i) => {
    const sit = situations[a.situationIndex] ?? situations[i];
    return {
      category: sit?.scenarioType ?? 'Match',
      formation: sit?.formation ?? 'Standard 6-0 defence',
      difficulty: sit?.pressure ?? 'Moderate',
      scenarioType: sit?.scenarioType ?? 'Match Situation',
      isCorrect: a.isCorrect,
      reactionMs: 5000 + Math.floor(Math.random() * 4000),
    };
  });

  return {
    source: 'match',
    sourceId,
    sessionName: 'Match Simulation',
    position,
    decisionScore,
    correctCount,
    totalCount: answers.length,
    durationSeconds: answers.length * 45,
    decisions,
    isPerfect: correctCount === answers.length && answers.length > 0,
  };
}
