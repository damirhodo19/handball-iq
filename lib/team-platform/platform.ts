/**
 * Unified Team Platform API — Supabase when configured, local storage fallback.
 */

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type {
  Club,
  TeamRecord,
  TeamMemberRecord,
  TeamInvitation,
  CoachNote,
  TeamCalendarEvent,
  TrainingAssignment,
  TeamDashboardStats,
  TeamLeaderboards,
  ReportPeriod,
  PlatformRole,
  TeamJoinRequest,
  MyTeamJoinRequest,
} from './types';
import {
  localCreateClub,
  localFetchClubs,
  localCreateTeam,
  localFetchTeams,
  localGetActiveTeam,
  localSetActiveTeam,
  localJoinTeamByCode,
  localJoinTeamByToken,
  localFetchMembers,
  localRemoveMember,
  localCreateInvitation,
  localFetchInvitations,
  localGetInviteLink,
  localCreateAssignment,
  localFetchAssignments,
  localCompleteAssignment,
  localCreateNote,
  localFetchNotes,
  localFetchCalendar,
  localAddCalendarEvent,
  ensureDemoTeam,
  localCacheTeams,
  localCacheTeam,
  localCacheMembers,
} from './storage';
import { computeTeamDashboard, computeLeaderboards, generateTeamReport, exportReportCsv, exportReportPdf } from './reports';
import type { TeamReport } from './reports';

const USE_LOCAL = !isSupabaseConfigured;

// ─── Clubs ───────────────────────────────────────────────────────────────────

export async function createClub(input: {
  name: string;
  country?: string;
  league?: string;
  season?: string;
  logo_url?: string;
  description?: string;
  owner_id: string;
}): Promise<{ error: string | null; club: Club | null }> {
  if (USE_LOCAL) return { error: null, club: localCreateClub(input) };
  if (!supabase) return { error: 'Supabase not configured.', club: null };
  const { data, error } = await supabase.from('clubs').insert(input).select('*').single();
  if (error) return { error: error.message, club: null };
  await supabase.from('club_members').insert({
    club_id: data.id,
    user_id: input.owner_id,
    role: 'club_owner',
  });
  return { error: null, club: data as Club };
}

export async function fetchClubs(ownerId?: string): Promise<Club[]> {
  if (USE_LOCAL) return localFetchClubs(ownerId);
  if (!supabase) return [];
  const { data } = await supabase.from('clubs').select('*').order('created_at', { ascending: false });
  return (data ?? []) as Club[];
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function createTeam(input: {
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
}): Promise<{ error: string | null; team: TeamRecord | null }> {
  if (USE_LOCAL) return { error: null, team: localCreateTeam(input) };
  if (!supabase) return { error: 'Supabase not configured.', team: null };
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data, error } = await supabase
    .from('teams')
    .insert({ ...input, invitation_code: code })
    .select('*')
    .single();
  if (error) return { error: error.message, team: null };
  await supabase.from('team_members').insert({
    team_id: data.id,
    user_id: input.created_by,
    member_role: 'head_coach',
  });
  const createdTeam = data as TeamRecord;
  localCacheTeam(createdTeam, true);
  return { error: null, team: createdTeam };
}

export async function fetchTeams(clubId?: string): Promise<TeamRecord[]> {
  if (USE_LOCAL) return localFetchTeams(clubId);
  if (!supabase) return [];
  let q = supabase.from('teams').select('*').order('created_at', { ascending: false });
  if (clubId) q = q.eq('club_id', clubId);
  const { data, error } = await q;
  if (error) return [];
  const teams = (data ?? []) as TeamRecord[];
  localCacheTeams(teams);
  return teams;
}

export function getActiveTeam(): TeamRecord | null {
  return localGetActiveTeam();
}

export function setActiveTeam(teamId: string): void {
  localSetActiveTeam(teamId);
}

export async function initCoachPlatform(coachId: string, coachName: string): Promise<TeamRecord | null> {
  if (USE_LOCAL) return ensureDemoTeam(coachId, coachName);
  const teams = await fetchTeams();
  const active = getActiveTeam() ?? teams[0] ?? null;
  if (active) setActiveTeam(active.id);
  return active;
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function joinTeamByCode(
  code: string,
  userId: string,
  displayName?: string,
): Promise<{ error: string | null; team: TeamRecord | null; requestStatus?: 'pending' | 'approved' }> {
  if (USE_LOCAL) {
    const result = localJoinTeamByCode(code, userId, displayName);
    return { ...result, requestStatus: result.team ? 'approved' : undefined };
  }
  if (!supabase) return { error: 'Supabase not configured.', team: null };
  const { data, error } = await supabase.rpc('request_team_join', {
    p_code: code.trim(),
    p_token: null,
  });
  if (error) return { error: error.message, team: null };
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return { error: 'Invalid invitation code.', team: null };
  return {
    error: result.already_member ? 'Already a member.' : null,
    requestStatus: result.request_status,
    team: {
      id: result.team_id,
      name: result.team_name,
      club_id: null,
      club_name: null,
      country: null,
      age_group: null,
      team_category: null,
      playing_level: null,
      season: null,
      logo_url: null,
      description: null,
      invitation_code: null,
      created_by: '',
      created_at: new Date().toISOString(),
    },
  };
}

export async function joinTeamByInviteToken(
  token: string,
  userId: string,
  displayName?: string,
): Promise<{ error: string | null; team: TeamRecord | null; requestStatus?: 'pending' | 'approved' }> {
  if (USE_LOCAL) {
    const result = localJoinTeamByToken(token, userId, displayName);
    return { ...result, requestStatus: result.team ? 'approved' : undefined };
  }
  if (!supabase) return { error: 'Supabase not configured.', team: null };
  const { data, error } = await supabase.rpc('request_team_join', {
    p_code: null,
    p_token: token.trim(),
  });
  if (error) return { error: error.message, team: null };
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return { error: 'Invalid or expired invite.', team: null };
  return {
    error: result.already_member ? 'Already a member.' : null,
    requestStatus: result.request_status,
    team: {
      id: result.team_id,
      name: result.team_name,
      club_id: null,
      club_name: null,
      country: null,
      age_group: null,
      team_category: null,
      playing_level: null,
      season: null,
      logo_url: null,
      description: null,
      invitation_code: null,
      created_by: '',
      created_at: new Date().toISOString(),
    },
  };
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMemberRecord[]> {
  if (USE_LOCAL) return localFetchMembers(teamId);
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('team_list_members', { p_team_id: teamId });
  if (error) return [];
  const members = ((data ?? []) as any[]).map((member) => ({
    ...member,
    id: member.member_id,
    position: member.primary_position,
  })) as TeamMemberRecord[];
  localCacheMembers(teamId, members);
  return members;
}

export async function fetchTeamJoinRequests(teamId: string): Promise<{ error: string | null; requests: TeamJoinRequest[] }> {
  if (USE_LOCAL) return { error: null, requests: [] };
  if (!supabase) return { error: 'Supabase not configured.', requests: [] };
  const { data, error } = await supabase.rpc('list_team_join_requests', {
    p_team_id: teamId,
    p_status: 'pending',
  });
  return { error: error?.message ?? null, requests: (data ?? []) as TeamJoinRequest[] };
}

export async function fetchMyTeamJoinRequests(): Promise<{ error: string | null; requests: MyTeamJoinRequest[] }> {
  if (USE_LOCAL) return { error: null, requests: [] };
  if (!supabase) return { error: 'Supabase not configured.', requests: [] };
  const { data, error } = await supabase.rpc('list_my_team_join_requests');
  return { error: error?.message ?? null, requests: (data ?? []) as MyTeamJoinRequest[] };
}

export async function decideTeamJoinRequest(input: {
  requestId: string;
  approve: boolean;
  rosterPlayerId?: string | null;
}): Promise<{ error: string | null; rosterPlayer: import('@/lib/coach-workspace').CoachRosterPlayer | null }> {
  if (USE_LOCAL) return { error: null, rosterPlayer: null };
  if (!supabase) return { error: 'Supabase not configured.', rosterPlayer: null };
  const { data, error } = await supabase.rpc('decide_team_join_request', {
    p_request_id: input.requestId,
    p_approve: input.approve,
    p_roster_player_id: input.rosterPlayerId ?? null,
  });
  if (error) return { error: error.message, rosterPlayer: null };
  const result = Array.isArray(data) ? data[0] : data;
  if (!input.approve || !result?.roster_player_id) return { error: null, rosterPlayer: null };
  const { data: roster, error: rosterError } = await supabase
    .from('coach_roster_players')
    .select('*')
    .eq('id', result.roster_player_id)
    .maybeSingle();
  return {
    error: rosterError?.message ?? null,
    rosterPlayer: (roster ?? null) as import('@/lib/coach-workspace').CoachRosterPlayer | null,
  };
}

export async function removeTeamMember(teamId: string, userId: string): Promise<{ error: string | null }> {
  if (USE_LOCAL) {
    localRemoveMember(teamId, userId);
    return { error: null };
  }
  if (!supabase) return { error: 'Supabase not configured.' };
  const { error } = await supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', userId);
  return { error: error?.message ?? null };
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export async function createInvitation(input: {
  team_id: string;
  invited_by: string;
  email?: string;
}): Promise<{ error: string | null; invitation: TeamInvitation | null }> {
  if (USE_LOCAL) return { error: null, invitation: localCreateInvitation(input) };
  if (!supabase) return { error: 'Supabase not configured.', invitation: null };
  const { data, error } = await supabase.from('team_invitations').insert(input).select('*').single();
  return { error: error?.message ?? null, invitation: data as TeamInvitation };
}

export async function fetchInvitations(teamId: string): Promise<TeamInvitation[]> {
  if (USE_LOCAL) return localFetchInvitations(teamId);
  if (!supabase) return [];
  const { data } = await supabase.from('team_invitations').select('*').eq('team_id', teamId);
  return (data ?? []) as TeamInvitation[];
}

export function getInviteLink(token: string): string {
  return localGetInviteLink(token);
}

export function getTeamQrPayload(team: TeamRecord): string {
  return JSON.stringify({
    type: 'handball_iq_team',
    code: team.invitation_code,
    teamId: team.id,
    teamName: team.name,
  });
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export async function assignTraining(input: {
  coach_id: string;
  team_id: string;
  player_ids: string[];
  position: string;
  difficulty: string;
  category: string;
  scenario_count: number;
  due_date: string;
  message?: string;
}): Promise<{ error: string | null; assignments: TrainingAssignment[] }> {
  if (USE_LOCAL) {
    return { error: null, assignments: localCreateAssignment(input) };
  }
  if (!supabase) return { error: 'Supabase not configured.', assignments: [] };
  const rows = input.player_ids.map((player_id) => ({
    coach_id: input.coach_id,
    player_id,
    team_id: input.team_id,
    session_type: input.category,
    position: input.position,
    difficulty: input.difficulty,
    category: input.category,
    scenario_count: input.scenario_count,
    message: input.message,
    due_date: input.due_date,
    status: 'pending',
  }));
  const { data, error } = await supabase.from('assigned_sessions').insert(rows).select('*');
  return { error: error?.message ?? null, assignments: (data ?? []) as TrainingAssignment[] };
}

export async function fetchAssignments(teamId: string): Promise<TrainingAssignment[]> {
  if (USE_LOCAL) return localFetchAssignments(teamId);
  if (!supabase) return [];
  const { data } = await supabase.from('assigned_sessions').select('*').eq('team_id', teamId);
  return (data ?? []) as TrainingAssignment[];
}

export async function completeAssignment(teamId: string, assignmentId: string): Promise<void> {
  if (USE_LOCAL) {
    localCompleteAssignment(teamId, assignmentId);
    return;
  }
  if (!supabase) return;
  await supabase.from('assigned_sessions').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
  }).eq('id', assignmentId);
}

// ─── Coach Notes ─────────────────────────────────────────────────────────────

export async function createCoachNote(input: {
  team_id: string;
  player_id: string;
  coach_id: string;
  note_type: CoachNote['note_type'];
  content: string;
}): Promise<{ error: string | null; note: CoachNote | null }> {
  if (USE_LOCAL) return { error: null, note: localCreateNote(input) };
  if (!supabase) return { error: 'Supabase not configured.', note: null };
  const { data, error } = await supabase.from('coach_notes').insert(input).select('*').single();
  return { error: error?.message ?? null, note: data as CoachNote };
}

export async function fetchCoachNotes(teamId: string, playerId?: string): Promise<CoachNote[]> {
  if (USE_LOCAL) return localFetchNotes(teamId, playerId);
  if (!supabase) return [];
  let q = supabase.from('coach_notes').select('*').eq('team_id', teamId);
  if (playerId) q = q.eq('player_id', playerId);
  const { data } = await q.order('created_at', { ascending: false });
  return (data ?? []) as CoachNote[];
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export async function fetchTeamCalendar(teamId: string): Promise<TeamCalendarEvent[]> {
  if (USE_LOCAL) return localFetchCalendar(teamId);
  if (!supabase) return [];
  const { data } = await supabase.from('team_calendar_events').select('*').eq('team_id', teamId);
  return (data ?? []) as TeamCalendarEvent[];
}

export async function addTeamCalendarEvent(
  input: Omit<TeamCalendarEvent, 'id' | 'created_at'>,
): Promise<TeamCalendarEvent> {
  if (USE_LOCAL) return localAddCalendarEvent(input);
  if (!supabase) throw new Error('Supabase not configured');
  const { data } = await supabase.from('team_calendar_events').insert(input).select('*').single();
  return data as TeamCalendarEvent;
}

// ─── Dashboard & Reports ─────────────────────────────────────────────────────

export async function getTeamDashboardStats(teamId: string): Promise<TeamDashboardStats> {
  if (USE_LOCAL) return computeTeamDashboard(teamId);
  const members = await fetchTeamMembers(teamId);
  if (members.length === 0) {
    return computeTeamDashboard(teamId);
  }
  // Enrich local cache for compute functions
  const state = await import('./storage');
  const s = state.loadPlatformState();
  s.members[teamId] = members;
  state.savePlatformState(s);
  return computeTeamDashboard(teamId);
}

export async function getTeamLeaderboards(teamId: string): Promise<TeamLeaderboards> {
  if (USE_LOCAL) return computeLeaderboards(teamId);
  const members = await fetchTeamMembers(teamId);
  const state = await import('./storage');
  const s = state.loadPlatformState();
  s.members[teamId] = members;
  state.savePlatformState(s);
  return computeLeaderboards(teamId);
}

export async function generateReport(teamId: string, period: ReportPeriod): Promise<TeamReport | null> {
  const team = USE_LOCAL
    ? localGetActiveTeam()
    : (await fetchTeams()).find((t) => t.id === teamId) ?? null;
  if (!team) return null;
  if (!USE_LOCAL) {
    const members = await fetchTeamMembers(teamId);
    const st = await import('./storage');
    const s = st.loadPlatformState();
    s.members[teamId] = members;
    st.savePlatformState(s);
  }
  return generateTeamReport(team, period);
}

export { exportReportCsv, exportReportPdf, computeTeamDashboard, computeLeaderboards };
