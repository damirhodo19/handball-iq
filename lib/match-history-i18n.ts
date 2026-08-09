import type { MatchHistoryRecord } from '@/lib/storage';
import type { MatchReport } from '@/lib/match-engine';
import { buildLocalizedReportView } from '@/lib/match-report-i18n';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function snapshotFromMatchReport(report: MatchReport): NonNullable<MatchHistoryRecord['reportSnapshot']> {
  return {
    decisionScore: report.decisionScore,
    pressureControl: report.pressureControl,
    readingAbility: report.readingAbility,
    consistency: report.consistency,
    matchRating: report.matchRating,
    optimalCount: report.optimalCount,
    goodCount: report.goodCount,
    riskyCount: report.riskyCount,
    poorCount: report.poorCount,
  };
}

export function renderMatchHistoryReport(record: MatchHistoryRecord, t: TranslateFn) {
  if (record.reportSnapshot) {
    const snap = record.reportSnapshot;
    const report: MatchReport = {
      matchRating: snap.matchRating,
      decisionScore: snap.decisionScore,
      pressureControl: snap.pressureControl,
      readingAbility: snap.readingAbility,
      consistency: snap.consistency,
      mentalFocus: 0,
      momentum: 'Balanced',
      confidence: 'Medium',
      decisionAccuracy: 0,
      optimalCount: snap.optimalCount,
      goodCount: snap.goodCount,
      riskyCount: snap.riskyCount,
      poorCount: snap.poorCount,
    };
    return buildLocalizedReportView(report, [], t);
  }

  return {
    summary: record.summary ?? '',
    finalMessage: record.finalMessage ?? '',
    strengths: [] as string[],
    areasToImprove: [] as string[],
  };
}
