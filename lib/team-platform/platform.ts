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
  return { error: null, team: data as TeamRecord };
}

export async function fetchTeams(clubId?: string): Promise<TeamRecord[]> {
  if (USE_LOCAL) return localFetchTeams(clubId);
  if (!supabase) return [];
  let q = supabase.from('teams').select('*').order('created_at', { ascending: false });
  if (clubId) q = q.eq('club_id', clubId);
  const { data } = await q;
  return (data ?? []) as TeamRecord[];
}

export function getActiveTeam(): TeamRecord | null {
  return localGetActiveTeam();
}

export function setActiveTeam(teamId: string): void {
  localSetActiveTeam(teamId);
}

export async function initCoachPlatform(coachId: string, coachName: string): Promise<TeamRecord> {
  return ensureDemoTeam(coachId, coachName);
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function joinTeamByCode(
  code: string,
  userId: string,
  displayName?: string,
): Promise<{ error: string | null; team: TeamRecord | null }> {
  if (USE_LOCAL) return localJoinTeamByCode(code, userId, displayName);
  if (!supabase) return { error: 'Supabase not configured.', team: null };
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('invitation_code', code.toUpperCase())
    .maybeSingle();
  if (teamError || !team) return { error: 'Invalid invitation code.', team: null };
  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: userId,
    member_role: 'player',
  });
  if (memberError?.code === '23505') return { error: 'Already a member.', team: null };
  if (memberError) return { error: memberError.message, team: null };
  await supabase.from('profiles').update({ team_id: team.id }).eq('id', userId);
  return { error: null, team: team as TeamRecord };
}

export async function joinTeamByInviteToken(
  token: string,
  userId: string,
  displayName?: string,
): Promise<{ error: string | null; team: TeamRecord | null }> {
  if (USE_LOCAL) return localJoinTeamByToken(token, userId, displayName);
  if (!supabase) return { error: 'Supabase not configured.', team: null };
  const { data: invite } = await supabase
    .from('team_invitations')
    .select('*')
    .eq('invite_token', token)
    .eq('status', 'pending')
    .maybeSingle();
  if (!invite) return { error: 'Invalid or expired invite.', team: null };
  const { data: team } = await supabase.from('teams').select('*').eq('id', invite.team_id).single();
  if (!team) return { error: 'Team not found.', team: null };
  await supabase.from('team_invitations').update({ status: 'accepted', accepted_by: userId }).eq('id', invite.id);
  return joinTeamByCode(team.invitation_code!, userId, displayName);
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMemberRecord[]> {
  if (USE_LOCAL) return localFetchMembers(teamId);
  if (!supabase) return [];
  const { data: members } = await supabase.from('team_members').select('*').eq('team_id', teamId);
  if (!members?.length) return [];
  const userIds = members.map((m: any) => m.user_id);
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
  const { data: devData } = await supabase.from('player_development').select('total_xp, statistics').in('user_id', userIds);
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  const devMap = new Map((devData ?? []).map((d: any) => [d.user_id, d]));
  return members.map((m: any) => {
    const p = profileMap.get(m.user_id);
    const d = devMap.get(m.user_id);
    return {
      ...m,
      display_name: p?.display_name ?? (`${p?.first_name ?? ''} ${p?.last_name ?? ''}`.trim() || 'Player'),
      position: p?.primary_position ?? p?.position,
      decision_score: d?.statistics?.decisionAccuracy ?? p?.handball_iq_score ?? 0,
      total_xp: d?.total_xp ?? 0,
      streak: p?.streak ?? 0,
      weekly_activity: 0,
      improvement: d?.statistics?.improvementTrend ?? 0,
    };
  });
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
