import type { MatchAnswer, MatchSituation, MatchReport } from '@/lib/match-engine';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export interface MatchReportCounts {
  optimalCount: number;
  riskyCount: number;
  poorCount: number;
}

export function countAnswerQualities(answers: MatchAnswer[]): MatchReportCounts {
  return {
    optimalCount: answers.filter((a) => a.quality === 'optimal').length,
    riskyCount: answers.filter((a) => a.quality === 'risky').length,
    poorCount: answers.filter((a) => a.quality === 'poor').length,
  };
}

export function generateLocalizedMatchSummary(
  report: Pick<MatchReport, 'decisionScore' | 'pressureControl' | 'readingAbility'> & MatchReportCounts,
  t: TranslateFn,
): string {
  const { decisionScore, pressureControl, readingAbility, optimalCount, riskyCount, poorCount } = report;
  const parts: string[] = [];

  if (decisionScore >= 80) {
    parts.push(t('matchReport.summary.decisionExcellent'));
  } else if (decisionScore >= 65) {
    parts.push(t('matchReport.summary.decisionSolid'));
  } else if (decisionScore >= 50) {
    parts.push(t('matchReport.summary.decisionMixed'));
  } else {
    parts.push(t('matchReport.summary.decisionChallenging'));
  }

  if (pressureControl >= 75) {
    parts.push(t('matchReport.summary.pressureStrong'));
  } else if (pressureControl < 55) {
    parts.push(t('matchReport.summary.pressureWeak'));
  }

  if (readingAbility >= 75) {
    parts.push(t('matchReport.summary.readingStrong'));
  } else if (readingAbility < 55) {
    parts.push(t('matchReport.summary.readingWeak'));
  }

  if (riskyCount >= 3) {
    parts.push(t('matchReport.summary.riskyCount', { n: riskyCount }));
  }

  if (poorCount >= 2) {
    parts.push(t('matchReport.summary.poorCount', { n: poorCount }));
  }

  if (optimalCount >= 6) {
    parts.push(t('matchReport.summary.optimalCount', { n: optimalCount }));
  }

  return parts.join(' ');
}

export function generateLocalizedFinalMessage(
  report: Pick<MatchReport, 'decisionScore' | 'pressureControl' | 'readingAbility'> & MatchReportCounts,
  t: TranslateFn,
): string {
  const { decisionScore, pressureControl } = report;

  if (decisionScore >= 85) {
    return t('matchReport.final.excellent');
  }
  if (decisionScore >= 70) {
    if (pressureControl < 65) {
      return t('matchReport.final.strongPressureGap');
    }
    return t('matchReport.final.strong');
  }
  if (decisionScore >= 50) {
    return t('matchReport.final.mixed');
  }
  return t('matchReport.final.challenging');
}

export function generateLocalizedStrengths(
  report: Pick<MatchReport, 'pressureControl' | 'readingAbility' | 'consistency'> & MatchReportCounts & { goodCount: number },
  t: TranslateFn,
): string[] {
  const { optimalCount, goodCount, pressureControl, readingAbility, consistency } = report;
  const strengths: string[] = [];

  if (optimalCount >= 5) strengths.push(t('matchReport.strength.optimalDecisions'));
  if (pressureControl >= 75) strengths.push(t('matchReport.strength.pressure'));
  if (readingAbility >= 75) strengths.push(t('matchReport.strength.reading'));
  if (consistency >= 75) strengths.push(t('matchReport.strength.consistency'));
  if (optimalCount + goodCount >= 10) strengths.push(t('matchReport.strength.fewPoor'));

  if (strengths.length === 0) strengths.push(t('matchReport.strength.default'));
  return strengths;
}

export function generateLocalizedAreasToImprove(
  report: Pick<MatchReport, 'pressureControl' | 'readingAbility' | 'consistency'> & MatchReportCounts,
  t: TranslateFn,
): string[] {
  const { poorCount, riskyCount, pressureControl, readingAbility, consistency } = report;
  const areas: string[] = [];

  if (poorCount >= 2) areas.push(t('matchReport.improve.earlyCommit'));
  if (riskyCount >= 3) areas.push(t('matchReport.improve.patience'));
  if (pressureControl < 60) areas.push(t('matchReport.improve.pressure'));
  if (readingAbility < 60) areas.push(t('matchReport.improve.reading'));
  if (consistency < 60) areas.push(t('matchReport.improve.consistency'));

  if (areas.length === 0) areas.push(t('matchReport.improve.default'));
  return areas;
}

export function generateLocalizedHalftimeMessage(
  answers: MatchAnswer[],
  situations: MatchSituation[],
  t: TranslateFn,
): string {
  if (answers.length === 0) {
    return t('matchReport.halftime.default');
  }

  const firstHalf = answers.slice(0, 8);
  const correctCount = firstHalf.filter((a) => a.quality === 'optimal' || a.quality === 'good').length;
  const accuracy = correctCount / firstHalf.length;
  const poorCount = firstHalf.filter((a) => a.quality === 'poor').length;
  const riskyCount = firstHalf.filter((a) => a.quality === 'risky').length;

  const pressureAnswers = firstHalf.filter((a) => {
    const s = situations[a.situationIndex];
    return s && (s.pressure === 'High' || s.pressure === 'Critical');
  });
  const pressurePoor = pressureAnswers.filter((a) => a.quality === 'poor' || a.quality === 'risky').length;

  const pick = (prefix: string, count: number) =>
    t(`${prefix}.${Math.floor(Math.random() * count)}`);

  if (accuracy >= 0.8 && poorCount === 0) {
    return pick('matchReport.halftime.excellent', 3);
  }

  if (poorCount >= 2 || riskyCount >= 3) {
    return pick('matchReport.halftime.earlyCommit', 3);
  }

  if (pressureAnswers.length > 0 && pressurePoor / pressureAnswers.length >= 0.5) {
    return pick('matchReport.halftime.pressure', 2);
  }

  const pivotAnswers = firstHalf.filter((a) => a.scenarioType === 'Pivot Shot');
  const pivotPoor = pivotAnswers.filter((a) => a.quality === 'poor' || a.quality === 'risky').length;
  if (pivotAnswers.length > 0 && pivotPoor / pivotAnswers.length >= 0.5) {
    return t('matchReport.halftime.pivot');
  }

  if (accuracy >= 0.6) {
    return pick('matchReport.halftime.solid', 3);
  }

  return pick('matchReport.halftime.fundamentals', 3);
}

export function buildLocalizedReportView(
  report: MatchReport,
  _answers: MatchAnswer[],
  t: TranslateFn,
) {
  const { optimalCount, goodCount, riskyCount, poorCount } = report;
  const base = { ...report, optimalCount, goodCount, riskyCount, poorCount };

  return {
    summary: generateLocalizedMatchSummary(base, t),
    finalMessage: generateLocalizedFinalMessage(base, t),
    strengths: generateLocalizedStrengths(base, t),
    areasToImprove: generateLocalizedAreasToImprove(base, t),
  };
}
