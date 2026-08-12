// Team & Coach Platform types

export type PlatformRole = 'admin' | 'club_owner' | 'head_coach' | 'assistant_coach' | 'player';

export type TeamCategory =
  | 'U13' | 'U15' | 'U17' | 'U19' | 'Senior' | 'Women' | 'Reserve' | 'Custom';

export type TeamMemberRole = 'player' | 'head_coach' | 'assistant_coach';

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export type NoteType = 'training' | 'injury' | 'mental' | 'general';

export type CalendarEventType =
  | 'training' | 'match' | 'assigned_session' | 'completed_session' | 'recovery';

export type TeamEventStatus = 'scheduled' | 'completed' | 'cancelled';

export type TeamEventResponseStatus = 'attending' | 'not_attending' | 'maybe';

export type TeamNotificationKind =
  | 'coach_message'
  | 'join_request'
  | 'join_approved'
  | 'join_rejected'
  | 'team_event_created'
  | 'event_response'
  | 'event_reminder';

export type ReportPeriod = 'weekly' | 'monthly' | 'season' | 'individual' | 'team';

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

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: PlatformRole;
  created_at: string;
}

export interface TeamRecord {
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

export interface TeamMemberRecord {
  id: string;
  team_id: string;
  user_id: string;
  member_role: TeamMemberRole | string;
  created_at: string;
  // Enriched fields (local/mock)
  display_name?: string;
  email?: string;
  position?: string;
  secondary_position?: string;
  decision_score?: number;
  total_xp?: number;
  streak?: number;
  weekly_activity?: number;
  improvement?: number;
}

export type TeamJoinRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TeamJoinRequest {
  request_id: string;
  team_id: string;
  player_id: string;
  display_name: string;
  email: string | null;
  primary_position: string | null;
  secondary_position: string | null;
  request_status: TeamJoinRequestStatus;
  requested_at: string;
}

export interface MyTeamJoinRequest {
  request_id: string;
  team_id: string;
  team_name: string;
  request_status: TeamJoinRequestStatus;
  requested_at: string;
  decided_at: string | null;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  invited_by: string;
  email: string | null;
  invite_token: string;
  status: InviteStatus;
  expires_at: string;
  accepted_by: string | null;
  created_at: string;
}

export interface CoachNote {
  id: string;
  team_id: string;
  player_id: string;
  coach_id: string;
  note_type: NoteType;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TeamCalendarEvent {
  id: string;
  team_id: string;
  event_type: CalendarEventType;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  title: string;
  description: string | null;
  location: string | null;
  response_required: boolean;
  event_status: TeamEventStatus;
  player_id: string | null;
  assignment_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  attending_count: number;
  not_attending_count: number;
  maybe_count: number;
  my_response: TeamEventResponseStatus | null;
}

export interface TeamEventResponse {
  event_id: string;
  player_id: string;
  display_name: string;
  email: string | null;
  response_status: TeamEventResponseStatus;
  note: string | null;
  responded_at: string;
}

export interface TeamNotification {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  team_id: string | null;
  event_id: string | null;
  notification_kind: TeamNotificationKind | string;
  title: string;
  message: string;
  metadata: Record<string, string | number | boolean | null>;
  action_path: string | null;
  read_at: string | null;
  created_at: string;
}

export interface TeamNotificationCounts {
  unreadNotifications: number;
  pendingJoinRequests: number;
}

export interface TrainingAssignment {
  id: string;
  coach_id: string;
  player_id: string;
  team_id: string | null;
  session_type: string;
  position: string | null;
  difficulty: string | null;
  category: string | null;
  scenario_count: number;
  message: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface TeamDashboardStats {
  rosterCount: number;
  attendanceRate: number;
  avgDecisionScore: number;
  weeklyProgress: number;
  dailyActivity: number;
  mostImproved: TeamMemberRecord | null;
  needsAttention: TeamMemberRecord | null;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  value: number;
  rank: number;
}

export interface TeamLeaderboards {
  decisionScore: LeaderboardEntry[];
  xp: LeaderboardEntry[];
  streak: LeaderboardEntry[];
  weeklyActivity: LeaderboardEntry[];
  improvement: LeaderboardEntry[];
}

export interface TeamPlatformState {
  clubs: Club[];
  teams: TeamRecord[];
  activeClubId: string | null;
  activeTeamId: string | null;
  members: Record<string, TeamMemberRecord[]>;
  invitations: Record<string, TeamInvitation[]>;
  notes: Record<string, CoachNote[]>;
  calendar: Record<string, TeamCalendarEvent[]>;
  eventResponses: Record<string, TeamEventResponse[]>;
  assignments: Record<string, TrainingAssignment[]>;
  attendance: Record<string, { player_id: string; event_date: string; status: string }[]>;
}

export const TEAM_CATEGORIES: TeamCategory[] = [
  'U13', 'U15', 'U17', 'U19', 'Senior', 'Women', 'Reserve', 'Custom',
];

export const PERMISSION_MATRIX: Record<PlatformRole, string[]> = {
  admin: ['*'],
  club_owner: [
    'club.manage', 'team.create', 'team.delete', 'team.invite', 'team.remove',
    'assignment.create', 'stats.view', 'reports.export', 'notes.write', 'calendar.manage',
  ],
  head_coach: [
    'team.invite', 'team.remove', 'assignment.create', 'stats.view',
    'reports.export', 'notes.write', 'calendar.manage',
  ],
  assistant_coach: [
    'assignment.create', 'stats.view', 'notes.write', 'calendar.view',
  ],
  player: ['stats.view_own', 'assignment.view_own', 'calendar.view'],
};
