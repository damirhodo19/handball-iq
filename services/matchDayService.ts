import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MatchDayPreparation, PostMatchReflection } from '@/types/database';

export async function saveMatchDayPreparation(
  record: Omit<MatchDayPreparation, 'id' | 'user_id' | 'completed_at'>
): Promise<{ error: string | null; id: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', id: null };
  try {
    const { data, error } = await supabase
      .from('match_day_preparations')
      .insert(record)
      .select('id')
      .single();
    if (error) return { error: error.message, id: null };
    return { error: null, id: data.id };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to save match day preparation.', id: null };
  }
}

export async function fetchMatchDayPreparations(limit = 20): Promise<MatchDayPreparation[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('match_day_preparations')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as MatchDayPreparation[];
  } catch {
    return [];
  }
}

export async function savePostMatchReflection(
  record: Omit<PostMatchReflection, 'id' | 'user_id' | 'created_at'>
): Promise<{ error: string | null; id: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', id: null };
  try {
    const { data, error } = await supabase
      .from('post_match_reflections')
      .insert(record)
      .select('id')
      .single();
    if (error) return { error: error.message, id: null };
    return { error: null, id: data.id };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to save reflection.', id: null };
  }
}

export async function fetchPostMatchReflections(limit = 20): Promise<PostMatchReflection[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('post_match_reflections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as PostMatchReflection[];
  } catch {
    return [];
  }
}
