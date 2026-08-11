import { supabase } from '@/lib/supabase';
import type { TeamJoinRequest, TeamMemberRecord } from '@/lib/team-platform/types';

export interface AdminTeamRecord {
  team_id: string;
  team_name: string;
  club_name: string | null;
  team_category: string | null;
  invitation_code: string | null;
  creator_email: string | null;
  created_at: string;
  member_count: number;
  player_count: number;
  coach_count: number;
  pending_request_count: number;
}

export interface AdminTeamDetails {
  members: TeamMemberRecord[];
  requests: TeamJoinRequest[];
}

export async function listAdminTeams(): Promise<{ teams: AdminTeamRecord[]; error: string | null }> {
  if (!supabase) return { teams: [], error: 'Supabase not configured.' };
  const { data, error } = await supabase.rpc('admin_list_teams');
  return { teams: (data ?? []) as AdminTeamRecord[], error: error?.message ?? null };
}

export async function getAdminTeamDetails(
  teamId: string,
): Promise<{ details: AdminTeamDetails; error: string | null }> {
  if (!supabase) return { details: { members: [], requests: [] }, error: 'Supabase not configured.' };
  const [membersResult, requestsResult] = await Promise.all([
    supabase.rpc('team_list_members', { p_team_id: teamId }),
    supabase.rpc('list_team_join_requests', { p_team_id: teamId, p_status: null }),
  ]);
  const error = membersResult.error ?? requestsResult.error;
  const members = ((membersResult.data ?? []) as any[]).map((member) => ({
    ...member,
    id: member.member_id,
    position: member.primary_position,
  })) as TeamMemberRecord[];
  return {
    details: { members, requests: (requestsResult.data ?? []) as TeamJoinRequest[] },
    error: error?.message ?? null,
  };
}
