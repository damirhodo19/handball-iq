import type { CoachReport, DevelopmentState } from './types';
import { detectWeaknesses } from './weakness';
import type { HandballPosition } from '@/lib/positions';

export function generateCoachReport(
  state: DevelopmentState,
  _position: HandballPosition,
): CoachReport {
  const weaknesses = detectWeaknesses(state.statistics, state.decisionEvents);
  const daily = state.dailyChallenge;

  const improved: string[] = [];
  const declined: string[] = [];

  if (state.statistics.improvementTrend > 3) {
    improved.push(`Decision accuracy up ${state.statistics.improvementTrend}% over the last week.`);
  } else if (state.statistics.improvementTrend < -3) {
    declined.push(`Decision accuracy down ${Math.abs(state.statistics.improvementTrend)}% — refocus on basics.`);
  }

  const catEntries = Object.entries(state.statistics.byCategory)
    .filter(([, s]) => s.total >= 5)
    .sort((a, b) => b[1].accuracy - a[1].accuracy);

  if (catEntries[0]) {
    improved.push(`Strongest area: ${catEntries[0][0]} (${catEntries[0][1].accuracy}%).`);
  }
  if (catEntries.length > 1 && catEntries[catEntries.length - 1][1].accuracy < 70) {
    declined.push(`Weakest area: ${catEntries[catEntries.length - 1][0]} (${catEntries[catEntries.length - 1][1].accuracy}%).`);
  }

  if (state.statistics.avgReactionMs > 0 && state.statistics.avgReactionMs < 6000) {
    improved.push('Reaction speed is competitive — keep trusting your first read.');
  } else if (weaknesses.slowDecisions) {
    declined.push('Decisions are taking too long under pressure.');
  }

  const trainNext = [...weaknesses.recommendations];
  if (state.weeklyProgram && state.weeklyProgram.daysCompleted < 7) {
    const nextDay = state.weeklyProgram.days.find((d) => !d.completed);
    if (nextDay) trainNext.push(`Complete weekly day: ${nextDay.focus}.`);
  }

  const dailyFocus = daily?.focusCategory ?? '';

  const summary = improved.length > 0
    ? `You are progressing at ${state.level} level with ${state.totalXp} XP. ${improved[0]}`
    : `You are at ${state.level} level.${dailyFocus ? ` Today's focus: ${dailyFocus}.` : ''} Complete sessions to build momentum.`;

  return {
    generatedAt: new Date().toISOString(),
    improved,
    declined,
    trainNext,
    dailyFocus,
    summary,
  };
}
