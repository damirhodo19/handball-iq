import type { HandballPosition } from '@/lib/positions';
import type { ProgramId } from './programs';

/** Display tier for long-term development progression (not Handball IQ). */
export type PlayerLevelTier =
  | 'Foundation'
  | 'Developing'
  | 'Advanced'
  | 'Competitive'
  | 'Elite'
  | 'Master';

/** @deprecated Use PlayerLevelTier — kept as alias for existing call sites */
export type PlayerLevel = PlayerLevelTier;

export type ActivitySource =
  | 'training'
  | 'match'
  | 'daily_challenge'
  | 'weekly_program'
  | 'streak_bonus'
  | 'achievement'
  | 'program'
  | 'daily_goal'
  | 'weekly_goal';

export type XpReason =
  | 'training_complete'
  | 'match_complete'
  | 'daily_challenge'
  | 'weekly_day'
  | 'weekly_complete'
  | 'weekly_goal'
  | 'daily_goal'
  | 'perfect_session'
  | 'fast_decisions'
  | 'streak_day'
  | 'achievement'
  | 'program_week'
  | 'program_milestone'
  | 'program_complete';

export interface XpEvent {
  id: string;
  eventKey: string;
  reason: XpReason;
  amount: number;
  date: string;
  source: ActivitySource;
  metadata?: Record<string, string | number | boolean>;
}

export type AchievementRarity = 'common' | 'advanced' | 'rare';

export interface AchievementDefinition {
  id: string;
  icon: string;
  xpReward: number;
  /** Display-only; does not change unlock logic */
  rarity?: AchievementRarity;
  descriptionKey?: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface DecisionEvent {
  id: string;
  date: string;
  source: 'training' | 'match' | 'daily_challenge';
  category: string;
  formation: string;
  position: string;
  difficulty: string;
  isCorrect: boolean;
  reactionMs: number;
  scenarioType: string;
}

export interface DailyChallenge {
  date: string;
  scenarioIds: string[];
  title: string;
  focusCategory: string;
  difficulty: string;
  targetScore: number;
  completed: boolean;
  completedScore?: number;
  xpAwarded: boolean;
}

export interface WeeklyDayPlan {
  dayIndex: number;
  label: string;
  focus: string;
  category: string;
  scenarioCount: number;
  completed: boolean;
  completedDate?: string;
  score?: number;
}

export interface WeeklyProgram {
  weekStart: string;
  days: WeeklyDayPlan[];
  weeklyScore: number;
  daysCompleted: number;
  xpAwarded: boolean;
}

export type GoalStatus = 'pending' | 'completed';

export interface DailyGoalItem {
  id: string;
  type: 'session' | 'challenge' | 'accuracy' | 'program';
  target: number;
  progress: number;
  status: GoalStatus;
  xpReward: number;
  labelKey: string;
}

export interface DailyGoalsState {
  date: string;
  goals: DailyGoalItem[];
  xpAvailable: number;
  estimatedMinutes: number;
}

export interface WeeklyGoalItem {
  id: string;
  type: 'sessions' | 'accuracy' | 'matches' | 'weakest' | 'streak';
  target: number;
  progress: number;
  status: GoalStatus;
  xpReward: number;
  labelKey: string;
  meta?: string;
}

export interface WeeklyGoalsState {
  weekStart: string;
  goals: WeeklyGoalItem[];
  weeklyXp: number;
  iqDelta: number;
}

/** Explicit program lifecycle — paused ≠ completed */
export type ProgramLifecycleStatus = 'active' | 'paused' | 'completed';

export interface ProgramEnrollment {
  programId: ProgramId;
  position: HandballPosition;
  startedAt: string;
  currentWeek: number;
  weeksCompleted: number[];
  sessionsThisWeek: number;
  totalSessions: number;
  completionPercent: number;
  completed: boolean;
  assessmentPassed: boolean;
  lastActivityDate: string | null;
  /** Handball IQ snapshot at enroll — real metric only */
  startingOverallIq?: number | null;
  startingPositionIq?: number | null;
  startingSkillScores?: Record<string, number | null>;
  /** Mid-program checkpoint (week 3) recorded */
  checkpointCompleted?: boolean;
  completedAt?: string | null;
  /** Lifecycle status; completed only when completion criteria met */
  status?: ProgramLifecycleStatus;
  pausedAt?: string | null;
}

export interface CategoryStats {
  total: number;
  correct: number;
  accuracy: number;
}

export interface DevelopmentStatistics {
  totalDecisions: number;
  correctDecisions: number;
  decisionAccuracy: number;
  avgReactionMs: number;
  byCategory: Record<string, CategoryStats>;
  byPosition: Record<string, CategoryStats>;
  byDifficulty: Record<string, CategoryStats>;
  byFormation: Record<string, CategoryStats>;
  /** Sprint 5 — skill accuracy from real decision events */
  bySkill: Record<string, CategoryStats>;
  dailyScores: { date: string; accuracy: number; count: number }[];
  bestDay: { date: string; accuracy: number } | null;
  worstDay: { date: string; accuracy: number } | null;
  improvementTrend: number;
}

export interface WeaknessReport {
  weakCategories: { name: string; accuracy: number; count: number }[];
  weakFormations: { name: string; accuracy: number; count: number }[];
  weakSkills: { name: string; accuracy: number; count: number }[];
  slowDecisions: boolean;
  avgSlowReactionMs: number;
  frequentMistakes: { scenarioType: string; count: number }[];
  recommendations: string[];
}

export interface CoachReport {
  generatedAt: string;
  improved: string[];
  declined: string[];
  trainNext: string[];
  dailyFocus: string;
  summary: string;
}

export interface NotificationPreferences {
  dailyTraining: boolean;
  weeklyReview: boolean;
  brokenStreak: boolean;
  achievementUnlocked: boolean;
  preferredHour: number;
}

export interface PendingNotification {
  id: string;
  type: 'daily_training' | 'weekly_review' | 'broken_streak' | 'achievement';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface DevelopmentState {
  totalXp: number;
  /** Numeric level 1–100 */
  playerLevel: number;
  /** Tier label derived from playerLevel */
  level: PlayerLevel;
  xpEvents: XpEvent[];
  achievements: UnlockedAchievement[];
  decisionEvents: DecisionEvent[];
  dailyChallenge: DailyChallenge | null;
  weeklyProgram: WeeklyProgram | null;
  dailyGoals: DailyGoalsState | null;
  weeklyGoals: WeeklyGoalsState | null;
  activeProgram: ProgramEnrollment | null;
  /** Completed programs preserved across position changes */
  completedPrograms: ProgramEnrollment[];
  /** Programs paused after position change (not completed) */
  pausedPrograms?: ProgramEnrollment[];
  statistics: DevelopmentStatistics;
  notificationPrefs: NotificationPreferences;
  pendingNotifications: PendingNotification[];
  lastProcessedDate: string | null;
  /** Recent daily focus signatures to avoid recommendation loops */
  recommendationHistory?: string[];
  /**
   * Stable activity keys (`${source}_${sourceId}`) already fully processed.
   * Gates decisions, programs, goals, and XP side effects together.
   */
  processedActivityIds?: string[];
}

export interface ActivityPayload {
  source: 'training' | 'match' | 'daily_challenge';
  sourceId: string;
  sessionName: string;
  position: HandballPosition;
  decisionScore: number;
  correctCount: number;
  totalCount: number;
  durationSeconds: number;
  decisions: {
    category: string;
    formation: string;
    difficulty: string;
    scenarioType: string;
    isCorrect: boolean;
    reactionMs: number;
  }[];
  isDailyChallenge?: boolean;
  isPerfect?: boolean;
}
