import type { MatchAnalysisInput, MatchAnalysisRecord } from './types';
import {
  defenseEngineHint,
  attackEngineHint,
  normalizeDefenseSystemId,
  normalizeAttackStyleId,
} from '@/lib/platform/tactical-systems';

function stableAnalysisId(input: MatchAnalysisInput): string {
  const raw = [
    input.opponent.trim(),
    input.date,
    input.competition.trim(),
    input.ownTeam.trim(),
    input.result?.trim() || '',
    input.opponentDefense || '',
    input.ownAttack || '',
    JSON.stringify(input.ratings),
    input.keyTacticalProblem.trim(),
    input.bestTacticalElement.trim(),
  ].join('|');
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `ma_${(h >>> 0).toString(16)}`;
}

type RatingKey = keyof MatchAnalysisInput['ratings'];

const RATING_ORDER: RatingKey[] = [
  'attack',
  'defence',
  'transition',
  'goalkeeper',
  'discipline',
  'decisionMaking',
];

export function buildMatchAnalysis(input: MatchAnalysisInput): MatchAnalysisRecord {
  const ratings = input.ratings;
  const sorted = [...RATING_ORDER].sort((a, b) => ratings[a] - ratings[b]);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  const avg =
    RATING_ORDER.reduce((sum, k) => sum + ratings[k], 0) / RATING_ORDER.length;

  const recommendationKeys: string[] = [
    `analysis.rec.focus.${weakest}`,
    `analysis.rec.protect.${strongest}`,
  ];

  if (ratings.transition <= 2) {
    recommendationKeys.push('analysis.rec.transition.drill');
  }
  if (ratings.discipline <= 2) {
    recommendationKeys.push('analysis.rec.discipline');
  }
  if (ratings.decisionMaking <= 2) {
    recommendationKeys.push('analysis.rec.decisions');
  }
  if (avg >= 4) {
    recommendationKeys.push('analysis.rec.maintain');
  } else if (avg <= 2.5) {
    recommendationKeys.push('analysis.rec.basics');
  }

  recommendationKeys.push('analysis.rec.problem');
  recommendationKeys.push('analysis.rec.strength');

  const opponentDefense = normalizeDefenseSystemId(input.opponentDefense) ?? 'none';
  const ownAttack = normalizeAttackStyleId(input.ownAttack) ?? 'none';
  if (opponentDefense !== 'none') {
    recommendationKeys.push('analysis.rec.opponentDefence');
  }
  if (ownAttack !== 'none') {
    recommendationKeys.push('analysis.rec.ownAttack');
  }

  return {
    id: stableAnalysisId(input),
    createdAt: new Date().toISOString(),
    opponent: input.opponent.trim(),
    date: input.date,
    competition: input.competition.trim(),
    ownTeam: input.ownTeam.trim(),
    result: input.result?.trim() || null,
    opponentDefense,
    ownAttack,
    ratings: { ...ratings },
    keyTacticalProblem: input.keyTacticalProblem.trim(),
    bestTacticalElement: input.bestTacticalElement.trim(),
    recommendationKeys: [...new Set(recommendationKeys)].slice(0, 8),
    recommendationParams: [
      {},
      {},
      {},
      {},
      {},
      { problem: input.keyTacticalProblem.trim(), strength: input.bestTacticalElement.trim() },
      { defence: defenseEngineHint(opponentDefense) },
      { attack: attackEngineHint(ownAttack) },
    ],
    summaryKey: 'analysis.summary',
    summaryParams: {
      opponent: input.opponent.trim(),
      weakest,
      strongest,
      avg: Math.round(avg * 10) / 10,
    },
  };
}
