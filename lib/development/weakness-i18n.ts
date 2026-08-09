import type { WeaknessReport } from './types';
import { translateSkill } from '@/lib/translations';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export type WeaknessRecommendation =
  | { type: 'category'; category: string; accuracy: number }
  | { type: 'formation'; formation: string }
  | { type: 'slowReads' }
  | { type: 'mistake'; scenarioType: string };

export function buildWeaknessRecommendations(report: WeaknessReport): WeaknessRecommendation[] {
  const items: WeaknessRecommendation[] = [];
  const weakCategory = report.weakCategories[0];
  const weakFormation = report.weakFormations[0];
  const topMistake = report.frequentMistakes[0];

  if (weakCategory) {
    items.push({ type: 'category', category: weakCategory.name, accuracy: weakCategory.accuracy });
  }
  if (weakFormation) {
    items.push({ type: 'formation', formation: weakFormation.name });
  }
  if (report.avgSlowReactionMs > 0) {
    items.push({ type: 'slowReads' });
  }
  if (topMistake) {
    items.push({ type: 'mistake', scenarioType: topMistake.scenarioType });
  }
  return items;
}

export function formatWeaknessRecommendation(item: WeaknessRecommendation, t: TranslateFn): string {
  switch (item.type) {
    case 'category':
      return t('dev.rec.focusCategory', {
        category: translateSkill(item.category, t),
        accuracy: item.accuracy,
      });
    case 'formation':
      return t('dev.rec.formation', { formation: item.formation });
    case 'slowReads':
      return t('dev.rec.slowReads');
    case 'mistake':
      return t('dev.rec.repeatedMistake', { scenario: translateSkill(item.scenarioType, t) });
    default:
      return '';
  }
}
