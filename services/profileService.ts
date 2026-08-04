import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types/database';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('[profileService] fetchProfile error:', error.message);
      return null;
    }
    return data as Profile | null;
  } catch (e) {
    console.warn('[profileService] fetchProfile exception:', e);
    return null;
  }
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('profiles').upsert(profile);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to save profile.' };
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to update profile.' };
  }
}

export async function approveFoundingMember(userId: string): Promise<{ error: string | null; number: number | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', number: null };
  try {
    const { data: nextNum, error: rpcError } = await supabase.rpc('get_next_founding_member_number');
    if (rpcError) return { error: rpcError.message, number: null };
    const num = nextNum as number;
    if (num > 50) return { error: 'All 50 founding member spots are taken.', number: null };

    const { error } = await supabase
      .from('profiles')
      .update({ founding_member: true, founding_member_number: num })
      .eq('id', userId);
    if (error) return { error: error.message, number: null };
    return { error: null, number: num };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to approve founding member.', number: null };
  }
}

export async function listAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return (data as Profile[]) ?? [];
  } catch {
    return [];
  }
}
