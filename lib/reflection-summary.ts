import type { MatchDayReflection } from '@/lib/match-day-storage';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function generateLocalizedReflectionSummary(
  r: Omit<MatchDayReflection, 'id' | 'date' | 'summary'>,
  t: TranslateFn,
): string {
  const parts: string[] = [];

  if (r.preparedFeel >= 8) {
    parts.push(t('matchDay.reflectPrepStrong'));
  } else if (r.preparedFeel <= 4) {
    parts.push(t('matchDay.reflectPrepWeak'));
  }

  if (r.resetAfterConceding >= 8) {
    parts.push(t('matchDay.reflectResetStrong'));
  } else if (r.resetAfterConceding <= 4) {
    parts.push(t('matchDay.reflectResetWeak'));
  }

  if (r.patience >= 8) {
    parts.push(t('matchDay.reflectPatienceStrong'));
  } else if (r.patience <= 4) {
    parts.push(t('matchDay.reflectPatienceWeak', { situation: r.difficultSituation }));
  }

  if (parts.length === 0) {
    const avg = Math.round((r.preparedFeel + r.resetAfterConceding + r.patience) / 3);
    const quality =
      avg >= 8 ? t('matchDay.reflectQualityExcellent')
      : avg >= 6 ? t('matchDay.reflectQualitySolid')
      : avg >= 4 ? t('matchDay.reflectQualityMixed')
      : t('matchDay.reflectQualityChallenging');
    parts.push(t('matchDay.reflectOverall', { quality }));
  }

  return parts.join(' ');
}
