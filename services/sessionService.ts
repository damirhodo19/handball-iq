import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SessionResult } from '@/types/database';

export async function saveSessionResult(
  record: Omit<SessionResult, 'id' | 'user_id' | 'completed_at'>
): Promise<{ error: string | null; id: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', id: null };
  try {
    const { data, error } = await supabase
      .from('session_results')
      .insert(record)
      .select('id')
      .single();
    if (error) return { error: error.message, id: null };
    return { error: null, id: data.id };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to save session result.', id: null };
  }
}

export async function fetchSessionResults(limit = 50): Promise<SessionResult[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('session_results')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as SessionResult[];
  } catch {
    return [];
  }
}

export async function fetchSessionResultsForPlayer(playerId: string, limit = 50): Promise<SessionResult[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('session_results')
      .select('*')
      .eq('user_id', playerId)
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as SessionResult[];
  } catch {
    return [];
  }
}
