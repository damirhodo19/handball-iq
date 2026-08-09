import type { DevelopmentStatistics, WeaknessReport, DecisionEvent } from './types';

const MIN_SAMPLES = 3;
const WEAK_THRESHOLD = 65;
const SLOW_MS = 8000;

function weakestBuckets(
  buckets: Record<string, { total: number; correct: number; accuracy: number }> | undefined,
  limit = 3,
) {
  return Object.entries(buckets ?? {})
    .filter(([, s]) => s.total >= MIN_SAMPLES)
    .map(([name, s]) => ({ name, accuracy: s.accuracy, count: s.total }))
    .filter((x) => x.accuracy < WEAK_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function detectWeaknesses(stats: DevelopmentStatistics, events: DecisionEvent[]): WeaknessReport {
  const weakCategories = weakestBuckets(stats.byCategory);
  const weakFormations = weakestBuckets(stats.byFormation);
  const weakSkills = weakestBuckets(stats.bySkill ?? {});

  const incorrect = events.filter((e) => !e.isCorrect);
  const mistakeMap: Record<string, number> = {};
  for (const e of incorrect) {
    mistakeMap[e.scenarioType] = (mistakeMap[e.scenarioType] ?? 0) + 1;
  }
  const frequentMistakes = Object.entries(mistakeMap)
    .map(([scenarioType, count]) => ({ scenarioType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const slowEvents = events.filter((e) => e.reactionMs > SLOW_MS);
  const avgSlowReactionMs =
    slowEvents.length > 0
      ? Math.round(slowEvents.reduce((s, e) => s + e.reactionMs, 0) / slowEvents.length)
      : 0;

  const recommendations: string[] = [];
  if (weakSkills[0]) {
    recommendations.push(`Strengthen ${weakSkills[0].name} (${weakSkills[0].accuracy}% accuracy).`);
  }
  if (weakCategories[0]) {
    recommendations.push(`Focus on ${weakCategories[0].name} scenarios (${weakCategories[0].accuracy}% accuracy).`);
  }
  if (weakFormations[0]) {
    recommendations.push(`Practice reading ${weakFormations[0].name} formations.`);
  }
  if (slowEvents.length >= MIN_SAMPLES) {
    recommendations.push('Work on faster first reads — commit after one scan, not two.');
  }
  if (frequentMistakes[0]) {
    recommendations.push(`Review "${frequentMistakes[0].scenarioType}" situations — repeated mistakes detected.`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Maintain consistency — rotate through advanced categories this week.');
  }

  return {
    weakCategories,
    weakFormations,
    weakSkills,
    slowDecisions: slowEvents.length >= MIN_SAMPLES,
    avgSlowReactionMs,
    frequentMistakes,
    recommendations,
  };
}

export function getWeakestSkillId(stats: DevelopmentStatistics): string | null {
  const weak = weakestBuckets(stats.bySkill ?? {}, 1);
  return weak[0]?.name ?? null;
}
