import {
  ATTACK_STYLES_V2,
  DEFENSE_SYSTEMS_V2,
  attackEngineHint,
  defenseEngineHint,
  attackLabelKey,
  defenseLabelKey,
} from '@/lib/platform/tactical-systems';
import { translateAgeGroup, type TFunc } from '@/lib/translations';

export function translatePlannerLevel(value: string, t: TFunc): string {
  return value === 'Professional' ? t('playingLevel.professional') : translateAgeGroup(value, t);
}

export function localizePlannerParams(
  params: Record<string, string | number> | undefined,
  t: TFunc,
): Record<string, string | number> {
  const result = { ...params };
  const attack = ATTACK_STYLES_V2.find(id => id !== 'none' && attackEngineHint(id) === result.attack);
  const defence = DEFENSE_SYSTEMS_V2.find(id => id !== 'none' && defenseEngineHint(id) === result.defence);
  if (attack) result.attack = t(attackLabelKey(attack));
  if (defence) result.defence = t(defenseLabelKey(defence));
  if (typeof result.level === 'string') result.level = translatePlannerLevel(result.level, t);
  return result;
}
