import type {
  Club,
  TeamRecord,
  TeamMemberRecord,
  TeamInvitation,
  CoachNote,
  TeamCalendarEvent,
  TrainingAssignment,
  TeamPlatformState,
} from './types';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';

const STORAGE_KEY = 'hbiq_team_platform';

function getItem<T>(key: string, fallback: T): T {
  return readStorageJson(key, fallback);
}

function setItem<T>(key: string, value: T): void {
  writeStorageJson(key, value);
}

export function createDefaultState(): TeamPlatformState {
  return {
    clubs: [],
    teams: [],
    activeClubId: null,
    activeTeamId: null,
    members: {},
    invitations: {},
    notes: {},
    calendar: {},
    assignments: {},
    attendance: {},
  };
}

export function loadPlatformState(): TeamPlatformState {
  return getItem(STORAGE_KEY, createDefaultState());
}

export function savePlatformState(state: TeamPlatformState): void {
  setItem(STORAGE_KEY, state);
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function genToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

// ─── Clubs ───────────────────────────────────────────────────────────────────

export function localCreateClub(input: {
  name: string;
  country?: string;
  league?: string;
  season?: string;
  logo_url?: string;
  description?: string;
  owner_id: string;
}): Club {
  const state = loadPlatformState();
  const club: Club = {
    id: uid('club'),
    name: input.name,
    country: input.country ?? null,
    league: input.league ?? null,
    season: input.season ?? null,
    logo_url: input.logo_url ?? null,
    description: input.description ?? null,
    owner_id: input.owner_id,
    created_at: new Date().toISOString(),
  };
  state.clubs.unshift(club);
  state.activeClubId = club.id;
  savePlatformState(state);
  return club;
}

export function localFetchClubs(ownerId?: string): Club[] {
  const state = loadPlatformState();
  if (ownerId) return state.clubs.filter((c) => c.owner_id === ownerId);
  return state.clubs;
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export function localCreateTeam(input: {
  name: string;
  club_id?: string;
  club_name?: string;
  country?: string;
  team_category?: string;
  age_group?: string;
  playing_level?: string;
  season?: string;
  description?: string;
  created_by: string;
}): TeamRecord {
  const state = loadPlatformState();
  const team: TeamRecord = {
    id: uid('team'),
    name: input.name,
    club_id: input.club_id ?? state.activeClubId,
    club_name: input.club_name ?? null,
    country: input.country ?? null,
    age_group: input.age_group ?? input.team_category ?? null,
    team_category: input.team_category ?? null,
    playing_level: input.playing_level ?? null,
    season: input.season ?? null,
    logo_url: null,
    description: input.description ?? null,
    invitation_code: genCode(),
    created_by: input.created_by,
    created_at: new Date().toISOString(),
  };
  state.teams.unshift(team);
  state.activeTeamId = team.id;
  state.members[team.id] = [];
  state.invitations[team.id] = [];
  state.notes[team.id] = [];
  state.calendar[team.id] = [];
  state.assignments[team.id] = [];
  state.attendance[team.id] = [];
  savePlatformState(state);
  return team;
}

export function localFetchTeams(clubId?: string): TeamRecord[] {
  const state = loadPlatformState();
  if (clubId) return state.teams.filter((t) => t.club_id === clubId);
  return state.teams;
}

export function localCacheTeams(teams: TeamRecord[]): void {
  const state = loadPlatformState();
  state.teams = teams;
  if (!state.activeTeamId || !teams.some((team) => team.id === state.activeTeamId)) {
    state.activeTeamId = teams[0]?.id ?? null;
  }
  savePlatformState(state);
}

export function localCacheTeam(team: TeamRecord, makeActive = false): void {
  const state = loadPlatformState();
  state.teams = [team, ...state.teams.filter((item) => item.id !== team.id)];
  if (makeActive || !state.activeTeamId) state.activeTeamId = team.id;
  savePlatformState(state);
}

export function localSetActiveTeam(teamId: string): void {
  const state = loadPlatformState();
  state.activeTeamId = teamId;
  const team = state.teams.find((t) => t.id === teamId);
  if (team?.club_id) state.activeClubId = team.club_id;
  savePlatformState(state);
}

export function localGetActiveTeam(): TeamRecord | null {
  const state = loadPlatformState();
  if (!state.activeTeamId) return state.teams[0] ?? null;
  return state.teams.find((t) => t.id === state.activeTeamId) ?? null;
}

// ─── Members ─────────────────────────────────────────────────────────────────

export function localJoinTeamByCode(
  code: string,
  userId: string,
  displayName?: string,
): { error: string | null; team: TeamRecord | null } {
  const state = loadPlatformState();
  const team = state.teams.find(
    (t) => t.invitation_code?.toUpperCase() === code.toUpperCase(),
  );
  if (!team) return { error: 'Invalid invitation code.', team: null };

  const members = state.members[team.id] ?? [];
  if (members.some((m) => m.user_id === userId)) {
    return { error: 'Already a member.', team: null };
  }

  members.push({
    id: uid('member'),
    team_id: team.id,
    user_id: userId,
    member_role: 'player',
    created_at: new Date().toISOString(),
    display_name: displayName ?? 'Player',
    decision_score: 0,
    total_xp: 0,
    streak: 0,
    weekly_activity: 0,
    improvement: 0,
  });
  state.members[team.id] = members;
  savePlatformState(state);
  return { error: null, team };
}

export function localJoinTeamByToken(
  token: string,
  userId: string,
  displayName?: string,
): { error: string | null; team: TeamRecord | null } {
  const state = loadPlatformState();
  for (const teamId of Object.keys(state.invitations)) {
    const invite = state.invitations[teamId]?.find(
      (i) => i.invite_token === token && i.status === 'pending',
    );
    if (invite) {
      invite.status = 'accepted';
      invite.accepted_by = userId;
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return { error: 'Team not found.', team: null };
      return localJoinTeamByCode(team.invitation_code!, userId, displayName);
    }
  }
  return { error: 'Invalid or expired invite link.', team: null };
}

export function localFetchMembers(teamId: string): TeamMemberRecord[] {
  const state = loadPlatformState();
  return state.members[teamId] ?? [];
}

export function localCacheMembers(teamId: string, members: TeamMemberRecord[]): void {
  const state = loadPlatformState();
  state.members[teamId] = members;
  savePlatformState(state);
}

export function localRemoveMember(teamId: string, userId: string): void {
  const state = loadPlatformState();
  state.members[teamId] = (state.members[teamId] ?? []).filter((m) => m.user_id !== userId);
  savePlatformState(state);
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export function localCreateInvitation(input: {
  team_id: string;
  invited_by: string;
  email?: string;
}): TeamInvitation {
  const state = loadPlatformState();
  const invite: TeamInvitation = {
    id: uid('invite'),
    team_id: input.team_id,
    invited_by: input.invited_by,
    email: input.email ?? null,
    invite_token: genToken(),
    status: 'pending',
    expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    accepted_by: null,
    created_at: new Date().toISOString(),
  };
  const list = state.invitations[input.team_id] ?? [];
  list.unshift(invite);
  state.invitations[input.team_id] = list;
  savePlatformState(state);
  return invite;
}

export function localFetchInvitations(teamId: string): TeamInvitation[] {
  return loadPlatformState().invitations[teamId] ?? [];
}

export function localGetInviteLink(token: string): string {
  return `handballiq://join/${token}`;
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export function localCreateAssignment(input: {
  coach_id: string;
  team_id: string;
  player_ids: string[];
  position: string;
  difficulty: string;
  category: string;
  scenario_count: number;
  due_date: string;
  message?: string;
}): TrainingAssignment[] {
  const state = loadPlatformState();
  const created: TrainingAssignment[] = [];
  for (const playerId of input.player_ids) {
    const assignment: TrainingAssignment = {
      id: uid('assign'),
      coach_id: input.coach_id,
      player_id: playerId,
      team_id: input.team_id,
      session_type: input.category,
      position: input.position,
      difficulty: input.difficulty,
      category: input.category,
      scenario_count: input.scenario_count,
      message: input.message ?? null,
      status: 'pending',
      due_date: input.due_date,
      completed_at: null,
      created_at: new Date().toISOString(),
    };
    created.push(assignment);
    const list = state.assignments[input.team_id] ?? [];
    list.unshift(assignment);
    state.assignments[input.team_id] = list;

    // Calendar event
    const cal = state.calendar[input.team_id] ?? [];
    cal.push({
      id: uid('evt'),
      team_id: input.team_id,
      event_type: 'assigned_session',
      event_date: input.due_date,
      title: `${input.category} — ${input.position}`,
      description: input.message ?? `Due ${input.due_date}`,
      player_id: playerId,
      assignment_id: assignment.id,
      created_by: input.coach_id,
      created_at: new Date().toISOString(),
    });
    state.calendar[input.team_id] = cal;
  }
  savePlatformState(state);
  return created;
}

export function localFetchAssignments(teamId: string): TrainingAssignment[] {
  return loadPlatformState().assignments[teamId] ?? [];
}

export function localCompleteAssignment(teamId: string, assignmentId: string): void {
  const state = loadPlatformState();
  const list = state.assignments[teamId] ?? [];
  const a = list.find((x) => x.id === assignmentId);
  if (a) {
    a.status = 'completed';
    a.completed_at = new Date().toISOString();
    state.assignments[teamId] = list;
    savePlatformState(state);
  }
}

// ─── Coach Notes ─────────────────────────────────────────────────────────────

export function localCreateNote(input: {
  team_id: string;
  player_id: string;
  coach_id: string;
  note_type: CoachNote['note_type'];
  content: string;
}): CoachNote {
  const state = loadPlatformState();
  const note: CoachNote = {
    id: uid('note'),
    team_id: input.team_id,
    player_id: input.player_id,
    coach_id: input.coach_id,
    note_type: input.note_type,
    content: input.content,
    is_private: true,
    created_at: new Date().toISOString(),
  };
  const list = state.notes[input.team_id] ?? [];
  list.unshift(note);
  state.notes[input.team_id] = list;
  savePlatformState(state);
  return note;
}

export function localFetchNotes(teamId: string, playerId?: string): CoachNote[] {
  const notes = loadPlatformState().notes[teamId] ?? [];
  if (playerId) return notes.filter((n) => n.player_id === playerId);
  return notes;
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export function localFetchCalendar(teamId: string): TeamCalendarEvent[] {
  return loadPlatformState().calendar[teamId] ?? [];
}

export function localAddCalendarEvent(input: Omit<TeamCalendarEvent, 'id' | 'created_at'>): TeamCalendarEvent {
  const state = loadPlatformState();
  const event: TeamCalendarEvent = {
    ...input,
    id: uid('evt'),
    created_at: new Date().toISOString(),
  };
  const list = state.calendar[input.team_id] ?? [];
  list.push(event);
  list.sort((a, b) => a.event_date.localeCompare(b.event_date));
  state.calendar[input.team_id] = list;
  savePlatformState(state);
  return event;
}

// ─── Seed demo data if empty ─────────────────────────────────────────────────

export function ensureDemoTeam(coachId: string, coachName: string): TeamRecord {
  const state = loadPlatformState();
  if (state.teams.length > 0) return state.teams[0];

  const club = localCreateClub({
    name: coachName ? `${coachName}` : 'My Club',
    country: '',
    league: '',
    season: '2025/26',
    description: '',
    owner_id: coachId,
  });

  const team = localCreateTeam({
    name: 'My Team',
    club_id: club.id,
    club_name: club.name,
    country: '',
    team_category: '',
    playing_level: 'Competitive',
    season: '2025/26',
    created_by: coachId,
  });

  const s = loadPlatformState();
  s.members[team.id] = [];
  savePlatformState(s);
  return team;
}
