import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AssignedSession, SessionResult, MatchSimulation, Profile } from '@/types/database';

export async function assignSession(assignment: {
  player_id: string;
  team_id?: string;
  session_type: string;
  session_id?: string;
  message?: string;
  due_date?: string;
}): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('assigned_sessions').insert(assignment);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to assign session.' };
  }
}

export async function fetchAssignedSessionsForPlayer(): Promise<AssignedSession[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('assigned_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as AssignedSession[];
  } catch {
    return [];
  }
}

export async function fetchAssignedSessionsByCoach(): Promise<AssignedSession[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('assigned_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as AssignedSession[];
  } catch {
    return [];
  }
}

export async function updateAssignedSessionStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('assigned_sessions').update({ status }).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to update assignment.' };
  }
}

export async function fetchPlayerResults(playerId: string): Promise<SessionResult[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('session_results')
      .select('*')
      .eq('user_id', playerId)
      .order('completed_at', { ascending: false })
      .limit(20);
    if (error || !data) return [];
    return data as SessionResult[];
  } catch {
    return [];
  }
}

export async function fetchPlayerMatchSimulations(playerId: string): Promise<MatchSimulation[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('match_simulations')
      .select('*')
      .eq('user_id', playerId)
      .order('completed_at', { ascending: false })
      .limit(20);
    if (error || !data) return [];
    return data as MatchSimulation[];
  } catch {
    return [];
  }
}

export async function fetchCoachPlayers(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data: teams, error: teamsError } = await supabase.from('teams').select('id');
    if (teamsError || !teams) return [];
    const teamIds = teams.map((t: any) => t.id);
    if (teamIds.length === 0) return [];

    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('user_id')
      .in('team_id', teamIds);
    if (membersError || !members) return [];
    const userIds = [...new Set(members.map((m: any) => m.user_id))];
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
