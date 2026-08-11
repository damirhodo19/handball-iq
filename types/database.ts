// Database types matching the Supabase schema

export type UserRole = 'player' | 'coach' | 'player_coach' | 'admin';

export interface UserPreferences {
  user_id: string;
  notifications_enabled: boolean | null;
  daily_reminder_time: string | null;
  active_mode: 'player' | 'coach' | null;
  onboarding_version: number | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  primary_position: string | null;
  secondary_position: string | null;
  dominant_hand: string | null;
  birth_year: number | null;
  age_group: string | null;
  playing_level: string | null;
  country: string | null;
  club: string | null;
  team_id: string | null;
  development_goal: string | null;
  development_goals: string[] | null;
  coach_type: string | null;
  experience_band: string | null;
  favorite_defense: string | null;
  favorite_attack: string | null;
  coach_development_goal: string | null;
  coach_development_goals: string[] | null;
  preferred_language: string | null;
  theme: string | null;
  onboarding_version: number | null;
  founding_member: boolean;
  founding_member_number: number | null;
  // Legacy fields from original schema
  age: number | null;
  position: string | null;
  biggest_goal: string | null;
  handball_iq_score: number;
  streak: number;
  last_active_date: string | null;
  total_points: number;
  onboarded: boolean;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  club_id: string | null;
  club_name: string | null;
  country: string | null;
  age_group: string | null;
  team_category: string | null;
  playing_level: string | null;
  season: string | null;
  logo_url: string | null;
  description: string | null;
  invitation_code: string | null;
  created_by: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  member_role: string;
  created_at: string;
}

export interface Scenario {
  id: string;
  title: string;
  position: string;
  secondary_positions: string[];
  category: string;
  difficulty: string;
  age_group: string;
  playing_level: string;
  status: string;
  match_phase: string;
  minute: number;
  home_score: number | null;
  away_score: number | null;
  attack_or_defence: string;
  players_on_court: string;
  defensive_system: string;
  situation: string;
  question: string;
  answer_options: string[];
  recommended_answer: number;
  explanation: string;
  learning_objective: string;
  mental_skill: string | null;
  tactical_skill: string | null;
  common_mistake: string | null;
  coach_note: string | null;
  pressure_level: string;
  // Bilingual fields (Croatian, nullable — fall back to English)
  title_hr: string | null;
  situation_hr: string | null;
  question_hr: string | null;
  answer_options_hr: string[] | null;
  explanation_hr: string | null;
  learning_objective_hr: string | null;
  common_mistake_hr: string | null;
  coach_note_hr: string | null;
  created_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionResult {
  id: string;
  user_id: string;
  session_type: string;
  session_name: string;
  position: string | null;
  score: number;
  decision_score: number;
  mental_readiness: number;
  pressure_control: number;
  duration_seconds: number;
  answers: Record<string, any>[];
  completed_at: string;
}

export interface MatchSimulation {
  id: string;
  user_id: string;
  position: string;
  opponent: string | null;
  difficulty: string | null;
  final_home_score: number;
  final_away_score: number;
  overall_rating: number;
  decision_score: number;
  pressure_control: number;
  reading_score: number;
  consistency_score: number;
  answers: Record<string, any>[];
  report: Record<string, any>;
  completed_at: string;
}

export interface MatchDayPreparation {
  id: string;
  user_id: string;
  opponent: string;
  match_type: string | null;
  match_location: string | null;
  expected_playing_time: string | null;
  personal_goals: string[];
  personal_statement: string | null;
  mental_readiness: number;
  tactical_readiness: number;
  completed_at: string;
}

export interface PostMatchReflection {
  id: string;
  user_id: string;
  preparation_id: string | null;
  prepared_rating: number;
  reset_rating: number;
  patience_rating: number;
  difficult_situation: string | null;
  did_well: string | null;
  improvement: string | null;
  summary: string | null;
  created_at: string;
}

export interface AssignedSession {
  id: string;
  coach_id: string;
  player_id: string;
  team_id: string | null;
  session_type: string;
  session_id: string | null;
  message: string | null;
  status: string;
  due_date: string | null;
  position: string | null;
  difficulty: string | null;
  category: string | null;
  scenario_count: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  country: string | null;
  league: string | null;
  season: string | null;
  logo_url: string | null;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at?: string;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  invited_by: string;
  email: string | null;
  invite_token: string;
  status: string;
  expires_at: string;
  accepted_by: string | null;
  created_at: string;
}

export interface CoachNote {
  id: string;
  team_id: string;
  player_id: string;
  coach_id: string;
  note_type: string;
  content: string;
  is_private: boolean;
  created_at: string;
}

export interface TeamCalendarEvent {
  id: string;
  team_id: string;
  event_type: string;
  event_date: string;
  title: string;
  description: string | null;
  player_id: string | null;
  assignment_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  category: string;
  status: string;
  created_at: string;
}

// Sync status for local records
export type SyncStatus = 'pending' | 'synced' | 'failed';

export interface SyncableRecord {
  _syncStatus?: SyncStatus;
  _syncedId?: string;
}

// Re-export legacy types for backward compatibility
export interface TrainingScenario {
  id: string;
  scenario: string;
  difficulty: string;
  defense_formation: string | null;
  category: string;
  options: string[];
  correct_index: number;
  explanation: string;
  points: number;
  created_at: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  date: string;
  scenarios_completed: number;
  points_earned: number;
  accuracy: number;
  avg_reaction_ms: number;
}
