import type { SkillCategory, SkillScore, PlayerProfile } from '@/lib/coach-engine';
import type { LocalizedMessage } from '@/lib/i18n-message';
import { msg } from '@/lib/i18n-message';

import type { TranslateFn } from '@/lib/i18n-message';
import { translateSessionType } from '@/lib/translations';

type ScoreTier = 'excellent' | 'good' | 'developing' | 'needsWork';

function scoreTier(score: number): ScoreTier {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'developing';
  return 'needsWork';
}

export function buildSkillFeedback(skill: SkillScore): LocalizedMessage[] {
  if (skill.sample <= 0) {
    return [msg('coach.feedback.noData', { skill: skill.category })];
  }

  const parts: LocalizedMessage[] = [
    msg(`coach.feedback.${skill.category}.${scoreTier(skill.score)}`),
  ];

  if (skill.trend === 'up' && skill.trendValue >= 5) {
    parts.push(msg('coach.feedback.trendUp', { n: skill.trendValue }));
  } else if (skill.trend === 'down' && skill.trendValue <= -5) {
    parts.push(msg('coach.feedback.trendDown', { n: Math.abs(skill.trendValue) }));
  }

  return parts;
}

export interface StructuredWeeklyReport {
  biggestImprovement: LocalizedMessage;
  biggestWeakness: LocalizedMessage;
  mostImprovedSkill: SkillCategory | 'stable';
  skillNeedingAttention: SkillCategory;
  overallTrend: 'up' | 'down' | 'stable';
  overallTrendValue: number;
  recommendation: LocalizedMessage;
}

export function buildWeeklyReport(profile: PlayerProfile): StructuredWeeklyReport {
  const skills = profile.skills;
  const sortedByTrendUp = [...skills].sort((a, b) => b.trendValue - a.trendValue);
  const mostImproved = sortedByTrendUp[0];
  const sortedByScore = [...skills].sort((a, b) => a.score - b.score);
  const weakest = sortedByScore[0];

  const mostImprovedSkill: SkillCategory | 'stable' =
    mostImproved.trendValue > 0 ? mostImproved.category : 'stable';

  const biggestImprovement: LocalizedMessage =
    mostImproved.trendValue > 3
      ? msg('coach.weekly.improvementUp', { skill: mostImproved.category, n: mostImproved.trendValue })
      : msg('coach.weekly.improvementStable');

  const biggestWeakness: LocalizedMessage =
    weakest.score < 50
      ? msg('coach.weekly.weaknessLow', { skill: weakest.category, score: weakest.score })
      : msg('coach.weekly.weaknessModerate', { skill: weakest.category, score: weakest.score });

  const overallTrendValue = Math.round(
    skills.reduce((s, sk) => s + sk.trendValue, 0) / Math.max(skills.length, 1),
  );
  const overallTrend: 'up' | 'down' | 'stable' =
    overallTrendValue > 3 ? 'up' : overallTrendValue < -3 ? 'down' : 'stable';

  let recommendation: LocalizedMessage;
  if (weakest.score < 50) {
    recommendation = msg('coach.weekly.recFocusWeak', { skill: weakest.category });
  } else if (overallTrend === 'up') {
    recommendation = msg('coach.weekly.recTrendUp', { skill: weakest.category });
  } else if (overallTrend === 'down') {
    recommendation = msg('coach.weekly.recTrendDown');
  } else {
    recommendation = msg('coach.weekly.recStable', { skill: weakest.category });
  }

  return {
    biggestImprovement,
    biggestWeakness,
    mostImprovedSkill,
    skillNeedingAttention: weakest.category,
    overallTrend,
    overallTrendValue,
    recommendation,
  };
}

export interface StructuredTrainingDay {
  day: string;
  focus: LocalizedMessage;
  description: LocalizedMessage;
}

const SKILL_PLAN_KEYS: Record<SkillCategory, { focus: string; description: string }> = {
  decisionMaking: { focus: 'coach.plan.focus.decisionMaking', description: 'coach.plan.desc.decisionMaking' },
  patience: { focus: 'coach.plan.focus.patience', description: 'coach.plan.desc.patience' },
  readingShooter: { focus: 'coach.plan.focus.readingShooter', description: 'coach.plan.desc.readingShooter' },
  fastBreak: { focus: 'coach.plan.focus.fastBreak', description: 'coach.plan.desc.fastBreak' },
  wingSituations: { focus: 'coach.plan.focus.wingSituations', description: 'coach.plan.desc.wingSituations' },
  sevenMetre: { focus: 'coach.plan.focus.sevenMetre', description: 'coach.plan.desc.sevenMetre' },
  pressureHandling: { focus: 'coach.plan.focus.pressureHandling', description: 'coach.plan.desc.pressureHandling' },
  consistency: { focus: 'coach.plan.focus.consistency', description: 'coach.plan.desc.consistency' },
  mentalPreparation: { focus: 'coach.plan.focus.mentalPreparation', description: 'coach.plan.desc.mentalPreparation' },
};

export function buildTrainingPlan(profile: PlayerProfile): StructuredTrainingDay[] {
  const sortedWeakest = [...profile.skills].sort((a, b) => a.score - b.score);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const topFour = sortedWeakest.slice(0, 4);

  return days.map((day, i) => {
    if (i < 4 && topFour[i]) {
      const keys = SKILL_PLAN_KEYS[topFour[i].category];
      return { day, focus: msg(keys.focus), description: msg(keys.description) };
    }
    if (i === 4) {
      return {
        day,
        focus: msg('coach.plan.focus.pressureHandling'),
        description: msg('coach.plan.desc.pressureFriday'),
      };
    }
    if (i === 5) {
      return {
        day,
        focus: msg('coach.plan.focus.matchPrep'),
        description: msg('coach.plan.desc.matchPrep'),
      };
    }
    return {
      day,
      focus: msg('coach.plan.focus.recovery'),
      description: msg('coach.plan.desc.recovery'),
    };
  });
}

export type StructuredPlayerType =
  | 'calmReader'
  | 'aggressiveGoalkeeper'
  | 'reactiveGoalkeeper'
  | 'pressureSpecialist'
  | 'balancedGoalkeeper'
  | 'developingGoalkeeper';

export interface StructuredPlayerTypeInfo {
  type: StructuredPlayerType;
  strengths: LocalizedMessage[];
  risks: LocalizedMessage[];
  suggestedFocus: LocalizedMessage;
  description: LocalizedMessage;
}

export function buildPlayerTypeInfo(profile: PlayerProfile): StructuredPlayerTypeInfo {
  const by = (cat: SkillCategory) => profile.skills.find((s) => s.category === cat)?.score ?? 50;
  const decision = by('decisionMaking');
  const patience = by('patience');
  const reading = by('readingShooter');
  const fastBreak = by('fastBreak');
  const pressure = by('pressureHandling');
  const consistency = by('consistency');
  const mental = by('mentalPreparation');
  const overall = profile.overallScore;

  if (patience >= 70 && reading >= 70 && pressure >= 60) {
    return {
      type: 'calmReader',
      strengths: [
        msg('coach.playerType.calmReader.strength.0'),
        msg('coach.playerType.calmReader.strength.1'),
        msg('coach.playerType.calmReader.strength.2'),
      ],
      risks: [
        msg('coach.playerType.calmReader.risk.0'),
        msg('coach.playerType.calmReader.risk.1'),
      ],
      suggestedFocus: msg('coach.playerType.calmReader.focus'),
      description: msg('coach.playerType.calmReader.description'),
    };
  }

  if (fastBreak >= 65 && pressure >= 65 && patience < 65) {
    return {
      type: 'aggressiveGoalkeeper',
      strengths: [
        msg('coach.playerType.aggressive.strength.0'),
        msg('coach.playerType.aggressive.strength.1'),
        msg('coach.playerType.aggressive.strength.2'),
      ],
      risks: [
        msg('coach.playerType.aggressive.risk.0'),
        msg('coach.playerType.aggressive.risk.1'),
      ],
      suggestedFocus: msg('coach.playerType.aggressive.focus'),
      description: msg('coach.playerType.aggressive.description'),
    };
  }

  if (consistency >= 70 && decision >= 65 && reading < 65) {
    return {
      type: 'reactiveGoalkeeper',
      strengths: [
        msg('coach.playerType.reactive.strength.0'),
        msg('coach.playerType.reactive.strength.1'),
        msg('coach.playerType.reactive.strength.2'),
      ],
      risks: [
        msg('coach.playerType.reactive.risk.0'),
        msg('coach.playerType.reactive.risk.1'),
      ],
      suggestedFocus: msg('coach.playerType.reactive.focus'),
      description: msg('coach.playerType.reactive.description'),
    };
  }

  if (pressure >= 75 && mental >= 70) {
    return {
      type: 'pressureSpecialist',
      strengths: [
        msg('coach.playerType.pressure.strength.0'),
        msg('coach.playerType.pressure.strength.1'),
        msg('coach.playerType.pressure.strength.2'),
      ],
      risks: [
        msg('coach.playerType.pressure.risk.0'),
        msg('coach.playerType.pressure.risk.1'),
      ],
      suggestedFocus: msg('coach.playerType.pressure.focus'),
      description: msg('coach.playerType.pressure.description'),
    };
  }

  if (overall >= 65) {
    const spread = Math.max(...profile.skills.map((s) => s.score)) - Math.min(...profile.skills.map((s) => s.score));
    if (spread <= 25) {
      return {
        type: 'balancedGoalkeeper',
        strengths: [
          msg('coach.playerType.balanced.strength.0'),
          msg('coach.playerType.balanced.strength.1'),
          msg('coach.playerType.balanced.strength.2'),
        ],
        risks: [
          msg('coach.playerType.balanced.risk.0'),
          msg('coach.playerType.balanced.risk.1'),
        ],
        suggestedFocus: msg('coach.playerType.balanced.focus'),
        description: msg('coach.playerType.balanced.description'),
      };
    }
  }

  return {
    type: 'developingGoalkeeper',
    strengths: [
      msg('coach.playerType.developing.strength.0'),
      msg('coach.playerType.developing.strength.1'),
      msg('coach.playerType.developing.strength.2'),
    ],
    risks: [
      msg('coach.playerType.developing.risk.0'),
      msg('coach.playerType.developing.risk.1'),
    ],
    suggestedFocus: msg('coach.playerType.developing.focus'),
    description: msg('coach.playerType.developing.description'),
  };
}

export const STRUCTURED_PLAYER_TYPE_KEYS: Record<StructuredPlayerType, string> = {
  calmReader: 'coach.playerType.calmReader.name',
  aggressiveGoalkeeper: 'coach.playerType.aggressive.name',
  reactiveGoalkeeper: 'coach.playerType.reactive.name',
  pressureSpecialist: 'coach.playerType.pressure.name',
  balancedGoalkeeper: 'coach.playerType.balanced.name',
  developingGoalkeeper: 'coach.playerType.developing.name',
};

export const SKILL_CATEGORY_I18N: Record<SkillCategory, string> = {
  decisionMaking: 'coach.skill.decisionMaking',
  patience: 'coach.skill.patience',
  readingShooter: 'coach.skill.readingShooter',
  fastBreak: 'coach.skill.fastBreak',
  wingSituations: 'coach.skill.wingSituations',
  sevenMetre: 'coach.skill.sevenMetre',
  pressureHandling: 'coach.skill.pressureHandling',
  consistency: 'coach.skill.consistency',
  mentalPreparation: 'coach.skill.mentalPreparation',
};

export function translateSkillCategory(category: SkillCategory | 'stable', t: TranslateFn): string {
  if (category === 'stable') return t('coach.weekly.allSkillsStable');
  const key = SKILL_CATEGORY_I18N[category];
  return key ? t(key) : category;
}

export function renderCoachMessage(t: TranslateFn, message: LocalizedMessage): string {
  const params = message.params ? { ...message.params } : undefined;
  if (params?.skill !== undefined) {
    params.skill = translateSkillCategory(String(params.skill) as SkillCategory | 'stable', t);
  }
  if (params?.sessionType !== undefined) {
    params.sessionType = translateSessionType(String(params.sessionType), t);
  }
  return params ? t(message.key, params) : t(message.key);
}

export function renderCoachMessages(t: TranslateFn, messages: LocalizedMessage[]): string {
  return messages.map((m) => renderCoachMessage(t, m)).join(' ');
}

export function translateStructuredPlayerType(type: StructuredPlayerType, t: TranslateFn): string {
  return t(STRUCTURED_PLAYER_TYPE_KEYS[type]);
}
