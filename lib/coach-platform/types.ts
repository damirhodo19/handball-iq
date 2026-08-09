export type CoachChallengeCategory =
  | 'timeout'
  | 'defensive_adjustment'
  | 'substitution'
  | 'training_plan'
  | 'player_development'
  | 'opponent_analysis'
  | 'leadership';

export type CoachDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type LocalizedText = { en: string; hr: string; de: string };

export interface CoachChallengeAnswer {
  id: string;
  text: LocalizedText;
  quality: 'optimal' | 'good' | 'risky' | 'poor';
  feedback: LocalizedText;
}

export interface CoachChallenge {
  id: string;
  category: CoachChallengeCategory;
  difficulty: CoachDifficulty;
  coachTypeTags: string[];
  experienceTags: string[];
  situation: LocalizedText;
  question: LocalizedText;
  answers: CoachChallengeAnswer[];
  explanation: LocalizedText;
}

export interface CoachChallengeAttempt {
  id: string;
  date: string;
  challengeId: string;
  category: CoachChallengeCategory;
  difficulty: CoachDifficulty;
  chosenAnswerId: string;
  isCorrect: boolean;
  quality: CoachChallengeAnswer['quality'];
}

export type TrainingFocus =
  | 'Attack'
  | 'Defence'
  | 'Transition'
  | 'Technical'
  | 'Decision Making'
  | 'Physical'
  | 'Mental'
  | 'Goalkeeper';

export interface TrainingPlanInput {
  ageLevel: string;
  durationMin: number;
  objective: string;
  playerCount: number;
  focus: TrainingFocus;
  favoriteDefense?: string | null;
  favoriteAttack?: string | null;
}

export interface TrainingBlock {
  id: string;
  titleKey: string;
  durationMin: number;
  objectiveKey: string;
  instructionsKey: string;
  coachingPointsKey: string;
  params?: Record<string, string | number>;
}

export interface TrainingPlan {
  id: string;
  createdAt: string;
  input: TrainingPlanInput;
  blocks: TrainingBlock[];
}

export interface MatchAnalysisInput {
  opponent: string;
  date: string;
  competition: string;
  ownTeam: string;
  result?: string | null;
  /** Canonical defence system ID the opponent used (or none). */
  opponentDefense?: string | null;
  /** Canonical attack style ID your team preferred (or none). */
  ownAttack?: string | null;
  ratings: {
    attack: number;
    defence: number;
    transition: number;
    goalkeeper: number;
    discipline: number;
    decisionMaking: number;
  };
  keyTacticalProblem: string;
  bestTacticalElement: string;
}

/** Language-neutral stored analysis */
export interface MatchAnalysisRecord {
  id: string;
  createdAt: string;
  opponent: string;
  date: string;
  competition: string;
  ownTeam: string;
  result: string | null;
  opponentDefense?: string | null;
  ownAttack?: string | null;
  ratings: MatchAnalysisInput['ratings'];
  keyTacticalProblem: string;
  bestTacticalElement: string;
  recommendationKeys: string[];
  recommendationParams?: Record<string, string | number>[];
  summaryKey: string;
  summaryParams?: Record<string, string | number>;
}

export interface CoachActivityEvent {
  id: string;
  date: string;
  source: 'challenge' | 'planner' | 'match_analysis';
  category: string;
  isCorrect?: boolean;
  score?: number;
}

export interface CoachTrackEnrollmentState {
  trackId: string;
  startedAt: string;
  currentWeek: number;
  weeksCompleted: number[];
  activitiesThisWeek: number;
  totalActivities: number;
  completionPercent: number;
  completed: boolean;
  lastActivityDate: string | null;
  xp: number;
  level: number;
}

export interface CoachXpEvent {
  id: string;
  eventKey: string;
  reason: string;
  amount: number;
  source: string;
  date: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface CoachUnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface CoachStreakState {
  currentStreak: number;
  longestStreak: number;
  lastQualifyingDate: string | null;
}

export interface CoachWeeklyGoalItem {
  id: string;
  type: 'challenges' | 'plans' | 'analyses' | 'streak';
  target: number;
  progress: number;
  status: 'pending' | 'completed';
  xpReward: number;
  labelKey: string;
}

export interface CoachWeeklyGoalsState {
  weekStart: string;
  goals: CoachWeeklyGoalItem[];
  weeklyXp: number;
}

export interface CoachDevState {
  /** Canonical coach XP (separate from player totalXp) */
  totalXp: number;
  coachLevel: number;
  xpEvents: CoachXpEvent[];
  achievements: CoachUnlockedAchievement[];
  streak: CoachStreakState;
  weeklyGoals: CoachWeeklyGoalsState | null;
  challengeAttempts: CoachChallengeAttempt[];
  trainingPlans: TrainingPlan[];
  matchAnalyses: MatchAnalysisRecord[];
  activityEvents: CoachActivityEvent[];
  dailyChallengeId: string | null;
  dailyChallengeDate: string | null;
  dailyChallengeCompleted: boolean;
  /** Sprint 4 coach development track enrollment */
  activeTrack?: CoachTrackEnrollmentState | null;
}
