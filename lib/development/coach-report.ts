import type { CoachReport, DevelopmentState } from './types';
import { detectWeaknesses } from './weakness';
import type { HandballPosition } from '@/lib/positions';
import { computeStatistics } from './statistics';

export function generateCoachReport(
  state: DevelopmentState,
  position: HandballPosition,
): CoachReport {
  const events = state.decisionEvents.filter((event) => event.position === position);
  const statistics = computeStatistics(events);
  const weaknesses = detectWeaknesses(statistics, events);
  const daily = state.dailyChallengesByPosition?.[position] ??
    (state.dailyChallenge?.position === position ? state.dailyChallenge : null);

  const improved: string[] = [];
  const declined: string[] = [];

  if (statistics.improvementTrend > 3) {
    improved.push(`Decision accuracy up ${statistics.improvementTrend}% over the last week.`);
  } else if (statistics.improvementTrend < -3) {
    declined.push(`Decision accuracy down ${Math.abs(statistics.improvementTrend)}% — refocus on basics.`);
  }

  const catEntries = Object.entries(statistics.byCategory)
    .filter(([, s]) => s.total >= 5)
    .sort((a, b) => b[1].accuracy - a[1].accuracy);

  if (catEntries[0]) {
    improved.push(`Strongest area: ${catEntries[0][0]} (${catEntries[0][1].accuracy}%).`);
  }
  if (catEntries.length > 1 && catEntries[catEntries.length - 1][1].accuracy < 70) {
    declined.push(`Weakest area: ${catEntries[catEntries.length - 1][0]} (${catEntries[catEntries.length - 1][1].accuracy}%).`);
  }

  if (statistics.avgReactionMs > 0 && statistics.avgReactionMs < 6000) {
    improved.push('Reaction speed is competitive — keep trusting your first read.');
  } else if (weaknesses.slowDecisions) {
    declined.push('Decisions are taking too long under pressure.');
  }

  const trainNext = [...weaknesses.recommendations];
  const weekly = state.weeklyProgramsByPosition?.[position] ??
    (state.weeklyProgram?.position === position ? state.weeklyProgram : null);
  if (weekly && weekly.daysCompleted < 7) {
    const nextDay = weekly.days.find((d) => !d.completed);
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
