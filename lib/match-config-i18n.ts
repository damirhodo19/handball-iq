import type { SupportedLanguage } from '@/locales';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function getLocalizedMatchConfig(t: TranslateFn) {
  return {
    opponent: t('match.configOpponent'),
    competition: t('match.configCompetition'),
    difficulty: t('match.configDifficulty'),
    duration: t('match.configDuration'),
    description: t('match.configDescription'),
    situationCount: 15,
  };
}

export function getLocalizedMatchMetadata(t: TranslateFn, positionLabel: string) {
  return {
    opponent: t('match.configOpponentShort'),
    competition: t('match.configCompetitionShort'),
    difficulty: t('match.configCompetitionShort'),
    position: positionLabel,
  };
}
