import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Team, TeamMember, Profile } from '@/types/database';

function generateInvitationCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createTeam(team: {
  name: string;
  club_name?: string;
  country?: string;
  age_group?: string;
  playing_level?: string;
}): Promise<{ error: string | null; team: Team | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', team: null };
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...team,
        invitation_code: generateInvitationCode(),
      })
      .select('*')
      .single();
    if (error) return { error: error.message, team: null };
    return { error: null, team: data as Team };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to create team.', team: null };
  }
}

export async function fetchTeamsForCoach(): Promise<Team[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as Team[];
  } catch {
    return [];
  }
}

export async function joinTeamByCode(code: string): Promise<{ error: string | null; team: Team | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', team: null };
  try {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('invitation_code', code.toUpperCase())
      .maybeSingle();
    if (teamError) return { error: teamError.message, team: null };
    if (!team) return { error: 'Invalid invitation code.', team: null };

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, member_role: 'player' });
    if (memberError) {
      if (memberError.code === '23505') return { error: 'You are already a member of this team.', team: null };
      return { error: memberError.message, team: null };
    }
    return { error: null, team: team as Team };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to join team.', team: null };
  }
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as TeamMember[];
  } catch {
    return [];
  }
}

export async function fetchTeamMemberProfiles(teamId: string): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);
    if (membersError || !members) return [];
    const userIds = members.map((m: any) => m.user_id);
    if (userIds.length === 0) return [];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)
      .order('created_at', { ascending: false });
    if (profilesError || !profiles) return [];
    return profiles as Profile[];
  } catch {
    return [];
  }
}

export async function removeTeamMember(teamId: string, userId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to remove team member.' };
  }
}
