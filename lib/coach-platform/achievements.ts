export interface CoachAchievementDefinition {
  id: string;
  icon: string;
  xpReward: number;
}

export const COACH_ACHIEVEMENTS: CoachAchievementDefinition[] = [
  { id: 'coach_first_challenge', icon: 'Target', xpReward: 40 },
  { id: 'coach_challenges_10', icon: 'Layers', xpReward: 100 },
  { id: 'coach_first_plan', icon: 'ClipboardList', xpReward: 40 },
  { id: 'coach_plans_10', icon: 'BookOpen', xpReward: 100 },
  { id: 'coach_first_analysis', icon: 'BarChart3', xpReward: 40 },
  { id: 'coach_analyses_10', icon: 'Eye', xpReward: 100 },
  { id: 'coach_streak_7', icon: 'Flame', xpReward: 120 },
  { id: 'coach_tactical_specialist', icon: 'Brain', xpReward: 150 },
  { id: 'coach_player_dev_specialist', icon: 'Users', xpReward: 150 },
  { id: 'coach_planner_specialist', icon: 'Calendar', xpReward: 150 },
  { id: 'coach_match_reader', icon: 'Search', xpReward: 150 },
  { id: 'coach_leadership_dev', icon: 'Crown', xpReward: 150 },
];

export function getCoachAchievement(id: string): CoachAchievementDefinition | undefined {
  return COACH_ACHIEVEMENTS.find((a) => a.id === id);
}
