import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MatchSimulation } from '@/types/database';

export async function saveMatchSimulation(
  record: Omit<MatchSimulation, 'id' | 'user_id' | 'completed_at'>
): Promise<{ error: string | null; id: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', id: null };
  try {
    const { error } = await supabase.from('match_simulations').insert(record);
    if (error) return { error: error.message, id: null };
    return { error: null, id: null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to save match simulation.', id: null };
  }
}

export async function fetchMatchSimulations(limit = 50): Promise<MatchSimulation[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('match_simulations')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as MatchSimulation[];
  } catch {
    return [];
  }
}
