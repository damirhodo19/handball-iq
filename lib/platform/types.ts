export type AppRole = 'player' | 'coach' | 'player_coach' | 'admin';

export type ThemePreference = 'light' | 'dark' | 'system';

export type PlayingLevelId =
  | 'Beginner'
  | 'Youth'
  | 'Junior'
  | 'Senior'
  | 'Professional';

export type PlayerGoalId =
  | 'Decision Making'
  | 'Game Intelligence'
  | 'Defence'
  | 'Attack'
  | 'Mental Preparation'
  | 'Match Preparation'
  | 'Leadership'
  | 'Complete Development';

export type CoachTypeId =
  | 'Youth Coach'
  | 'Senior Coach'
  | 'Professional Coach'
  | 'Goalkeeper Coach'
  | 'Assistant Coach'
  | 'Head Coach';

export type ExperienceBand = '0-2' | '3-5' | '6-10' | '10+';

export type {
  DefenseSystemId,
  AttackStyleId,
} from '@/lib/platform/tactical-systems';

export {
  DEFENSE_SYSTEMS_V2,
  ATTACK_STYLES_V2,
  DEFENSE_LABEL_KEYS,
  ATTACK_LABEL_KEYS,
  normalizeDefenseSystemId,
  normalizeAttackStyleId,
  defenseLabelKey,
  attackLabelKey,
} from '@/lib/platform/tactical-systems';

export type CoachGoalId =
  | 'Tactics'
  | 'Leadership'
  | 'Player Development'
  | 'Training Planning'
  | 'Match Analysis'
  | 'Complete Development';

export const PLAYING_LEVELS_V2: PlayingLevelId[] = [
  'Beginner', 'Youth', 'Junior', 'Senior', 'Professional',
];

export const PLAYER_GOALS_V2: PlayerGoalId[] = [
  'Decision Making',
  'Game Intelligence',
  'Defence',
  'Attack',
  'Mental Preparation',
  'Match Preparation',
  'Leadership',
  'Complete Development',
];

export const COACH_TYPES_V2: CoachTypeId[] = [
  'Youth Coach',
  'Senior Coach',
  'Professional Coach',
  'Goalkeeper Coach',
  'Assistant Coach',
  'Head Coach',
];

export const EXPERIENCE_BANDS: ExperienceBand[] = ['0-2', '3-5', '6-10', '10+'];

export const COACH_GOALS_V2: CoachGoalId[] = [
  'Tactics',
  'Leadership',
  'Player Development',
  'Training Planning',
  'Match Analysis',
  'Complete Development',
];

export const COUNTRIES = [
  'Croatia', 'Germany', 'Austria', 'Switzerland', 'France', 'Spain',
  'Denmark', 'Norway', 'Sweden', 'Poland', 'Hungary', 'Slovenia',
  'Serbia', 'Bosnia and Herzegovina', 'Netherlands', 'Portugal',
  'Romania', 'Czech Republic', 'Other',
] as const;
