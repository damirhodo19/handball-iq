import type { PlayerLevel, PlayerLevelTier } from './types';

/** XP required to reach each level (1–100). Level 1 starts at 0 XP. */
export const XP_PER_LEVEL = 80;

export const LEVEL_TIERS: { tier: PlayerLevelTier; minLevel: number; maxLevel: number }[] = [
  { tier: 'Foundation', minLevel: 1, maxLevel: 10 },
  { tier: 'Developing', minLevel: 11, maxLevel: 25 },
  { tier: 'Advanced', minLevel: 26, maxLevel: 40 },
  { tier: 'Competitive', minLevel: 41, maxLevel: 60 },
  { tier: 'Elite', minLevel: 61, maxLevel: 80 },
  { tier: 'Master', minLevel: 81, maxLevel: 100 },
];

/** Numeric development level from total XP (1–100). Independent of Handball IQ. */
export function calculatePlayerLevel(totalXp: number): number {
  const xp = Math.max(0, totalXp);
  return Math.min(100, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function tierForLevel(level: number): PlayerLevelTier {
  const n = Math.max(1, Math.min(100, level));
  for (const entry of LEVEL_TIERS) {
    if (n >= entry.minLevel && n <= entry.maxLevel) return entry.tier;
  }
  return 'Foundation';
}

/** Display tier used across UI (replaces legacy Beginner/Professional labels). */
export function calculateLevel(totalXp: number): PlayerLevel {
  return tierForLevel(calculatePlayerLevel(totalXp));
}

export function xpToNextLevel(totalXp: number): {
  current: PlayerLevel;
  next: PlayerLevel | null;
  progress: number;
  xpNeeded: number;
  playerLevel: number;
  nextPlayerLevel: number | null;
} {
  const playerLevel = calculatePlayerLevel(totalXp);
  const current = tierForLevel(playerLevel);
  if (playerLevel >= 100) {
    return {
      current,
      next: null,
      progress: 1,
      xpNeeded: 0,
      playerLevel,
      nextPlayerLevel: null,
    };
  }
  const currentFloor = (playerLevel - 1) * XP_PER_LEVEL;
  const nextFloor = playerLevel * XP_PER_LEVEL;
  const range = nextFloor - currentFloor;
  const progress = range > 0 ? Math.min(1, (totalXp - currentFloor) / range) : 1;
  const nextPlayerLevel = playerLevel + 1;
  return {
    current,
    next: tierForLevel(nextPlayerLevel),
    progress,
    xpNeeded: Math.max(0, nextFloor - totalXp),
    playerLevel,
    nextPlayerLevel,
  };
}

export const XP_REWARDS = {
  training_base: 50,
  match_base: 100,
  daily_challenge: 75,
  weekly_day: 40,
  weekly_complete: 200,
  weekly_goal: 60,
  daily_goal: 30,
  perfect_session: 50,
  fast_decisions: 25,
  streak_day: 15,
  program_week: 100,
  program_complete: 400,
  program_milestone: 150,
  score_multiplier: 0.5,
} as const;

export function scoreBonus(decisionScore: number): number {
  return Math.round(decisionScore * XP_REWARDS.score_multiplier);
}
