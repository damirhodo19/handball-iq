import type {
  DevelopmentState,
  DevelopmentStatistics,
  DecisionEvent,
  CategoryStats,
} from './types';
import { getPositionModule, inferScenarioSkills } from '@/lib/platform/position-modules';
import type { HandballPosition } from '@/lib/positions';

function bucketStats(events: DecisionEvent[], key: (e: DecisionEvent) => string): Record<string, CategoryStats> {
  const map: Record<string, { total: number; correct: number }> = {};
  for (const e of events) {
    const k = key(e);
    if (!k) continue;
    if (!map[k]) map[k] = { total: 0, correct: 0 };
    map[k].total++;
    if (e.isCorrect) map[k].correct++;
  }
  const result: Record<string, CategoryStats> = {};
  for (const [name, { total, correct }] of Object.entries(map)) {
    result[name] = {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
  return result;
}

function skillBuckets(events: DecisionEvent[]): Record<string, CategoryStats> {
  const map: Record<string, { total: number; correct: number }> = {};
  for (const e of events) {
    const mod = getPositionModule(e.position as HandballPosition);
    const skills = inferScenarioSkills(
      e.position,
      `${e.scenarioType} ${e.category}`,
      null,
    );
    const ids = skills.length ? skills : mod?.positionSkills.slice(0, 1) ?? [];
    for (const id of ids) {
      if (!map[id]) map[id] = { total: 0, correct: 0 };
      map[id].total++;
      if (e.isCorrect) map[id].correct++;
    }
  }
  const result: Record<string, CategoryStats> = {};
  for (const [name, { total, correct }] of Object.entries(map)) {
    result[name] = {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
  return result;
}

export function computeStatistics(events: DecisionEvent[]): DevelopmentStatistics {
  const totalDecisions = events.length;
  const correctDecisions = events.filter((e) => e.isCorrect).length;
  const decisionAccuracy = totalDecisions > 0 ? Math.round((correctDecisions / totalDecisions) * 100) : 0;
  const avgReactionMs =
    totalDecisions > 0 ? Math.round(events.reduce((s, e) => s + e.reactionMs, 0) / totalDecisions) : 0;

  const dailyMap: Record<string, { correct: number; total: number }> = {};
  for (const e of events) {
    const d = e.date.slice(0, 10);
    if (!dailyMap[d]) dailyMap[d] = { correct: 0, total: 0 };
    dailyMap[d].total++;
    if (e.isCorrect) dailyMap[d].correct++;
  }

  const dailyScores = Object.entries(dailyMap)
    .map(([date, { correct, total }]) => ({
      date,
      accuracy: Math.round((correct / total) * 100),
      count: total,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  let bestDay: DevelopmentStatistics['bestDay'] = null;
  let worstDay: DevelopmentStatistics['worstDay'] = null;
  for (const d of dailyScores.filter((x) => x.count >= 3)) {
    if (!bestDay || d.accuracy > bestDay.accuracy) bestDay = { date: d.date, accuracy: d.accuracy };
    if (!worstDay || d.accuracy < worstDay.accuracy) worstDay = { date: d.date, accuracy: d.accuracy };
  }

  const recent = dailyScores.slice(-7);
  const prior = dailyScores.slice(-14, -7);
  const recentAvg = recent.length ? recent.reduce((s, d) => s + d.accuracy, 0) / recent.length : 0;
  const priorAvg = prior.length ? prior.reduce((s, d) => s + d.accuracy, 0) / prior.length : recentAvg;
  const improvementTrend = Math.round(recentAvg - priorAvg);

  return {
    totalDecisions,
    correctDecisions,
    decisionAccuracy,
    avgReactionMs,
    byCategory: bucketStats(events, (e) => e.category),
    byPosition: bucketStats(events, (e) => e.position),
    byDifficulty: bucketStats(events, (e) => e.difficulty),
    byFormation: bucketStats(events, (e) => e.formation),
    bySkill: skillBuckets(events),
    dailyScores,
    bestDay,
    worstDay,
    improvementTrend,
  };
}

export function refreshStatistics(state: DevelopmentState): DevelopmentStatistics {
  return computeStatistics(state.decisionEvents);
}
