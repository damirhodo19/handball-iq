import type { AchievementDefinition } from './types';

/** Unlock logic unchanged — rarity/descriptionKey are display-only. */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first_training', icon: 'Target', xpReward: 25, rarity: 'common', descriptionKey: 'sprint5.ach.desc.first_training' },
  { id: 'first_session', icon: 'Play', xpReward: 25, rarity: 'common', descriptionKey: 'sprint5.ach.desc.first_session' },
  { id: 'match_first', icon: 'Play', xpReward: 50, rarity: 'common', descriptionKey: 'sprint5.ach.desc.match_first' },
  { id: 'daily_first', icon: 'Sun', xpReward: 40, rarity: 'common', descriptionKey: 'sprint5.ach.desc.daily_first' },
  { id: 'sessions_10', icon: 'Layers', xpReward: 75, rarity: 'common', descriptionKey: 'sprint5.ach.desc.sessions_10' },
  { id: 'sessions_50', icon: 'Award', xpReward: 150, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.sessions_50' },
  { id: 'sessions_100', icon: 'Trophy', xpReward: 250, rarity: 'rare', descriptionKey: 'sprint5.ach.desc.sessions_100' },
  { id: 'decisions_100', icon: 'CheckCircle', xpReward: 100, rarity: 'common', descriptionKey: 'sprint5.ach.desc.decisions_100' },
  { id: 'decisions_500', icon: 'Star', xpReward: 250, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.decisions_500' },
  { id: 'perfect_session', icon: 'Sparkles', xpReward: 75, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.perfect_session' },
  { id: 'streak_7', icon: 'Flame', xpReward: 100, rarity: 'common', descriptionKey: 'sprint5.ach.desc.streak_7' },
  { id: 'streak_30', icon: 'Zap', xpReward: 300, rarity: 'rare', descriptionKey: 'sprint5.ach.desc.streak_30' },
  { id: 'weekly_complete', icon: 'Calendar', xpReward: 100, rarity: 'common', descriptionKey: 'sprint5.ach.desc.weekly_complete' },
  { id: 'program_first_week', icon: 'BookOpen', xpReward: 80, rarity: 'common', descriptionKey: 'sprint5.ach.desc.program_first_week' },
  { id: 'program_complete', icon: 'GraduationCap', xpReward: 200, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.program_complete' },
  { id: 'goalkeeper_specialist', icon: 'Shield', xpReward: 125, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.goalkeeper_specialist' },
  { id: 'position_specialist', icon: 'UserCheck', xpReward: 125, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.position_specialist' },
  { id: 'fast_break_expert', icon: 'ArrowRight', xpReward: 125, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.fast_break_expert' },
  { id: 'defensive_reader', icon: 'Eye', xpReward: 125, rarity: 'advanced', descriptionKey: 'sprint5.ach.desc.defensive_reader' },
  { id: 'pressure_master', icon: 'Flame', xpReward: 150, rarity: 'rare', descriptionKey: 'sprint5.ach.desc.pressure_master' },
  { id: 'decision_master', icon: 'Brain', xpReward: 200, rarity: 'rare', descriptionKey: 'sprint5.ach.desc.decision_master' },
  { id: 'elite_thinker', icon: 'Crown', xpReward: 350, rarity: 'rare', descriptionKey: 'sprint5.ach.desc.elite_thinker' },
];

export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/** Progress toward locked achievements from real activity counts (display only). */
export function getAchievementProgress(
  id: string,
  ctx: {
    sessionCount: number;
    decisionCount: number;
    streak: number;
    matchCount: number;
    programWeeks: number;
    programsCompleted: number;
  },
): { current: number; target: number } | null {
  switch (id) {
    case 'sessions_10':
      return { current: Math.min(ctx.sessionCount, 10), target: 10 };
    case 'sessions_50':
      return { current: Math.min(ctx.sessionCount, 50), target: 50 };
    case 'sessions_100':
      return { current: Math.min(ctx.sessionCount, 100), target: 100 };
    case 'decisions_100':
      return { current: Math.min(ctx.decisionCount, 100), target: 100 };
    case 'decisions_500':
      return { current: Math.min(ctx.decisionCount, 500), target: 500 };
    case 'streak_7':
      return { current: Math.min(ctx.streak, 7), target: 7 };
    case 'streak_30':
      return { current: Math.min(ctx.streak, 30), target: 30 };
    case 'match_first':
      return { current: Math.min(ctx.matchCount, 1), target: 1 };
    case 'program_first_week':
      return { current: Math.min(ctx.programWeeks, 1), target: 1 };
    case 'program_complete':
      return { current: Math.min(ctx.programsCompleted, 1), target: 1 };
    default:
      return null;
  }
}
