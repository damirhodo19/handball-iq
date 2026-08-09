import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { fetchProfile, upsertProfile } from '@/services/profileService';
import { Profile, UserRole } from '@/types/database';

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function ensureProfileForUser(user: User): Promise<void> {
  const existing = await fetchProfile(user.id);
  if (existing) return;

  const fullName =
    (user.user_metadata?.full_name as string | undefined)
    ?? (user.user_metadata?.name as string | undefined)
    ?? '';
  const [firstName, ...rest] = fullName.trim().split(/\s+/).filter(Boolean);

  const patch: Partial<Profile> & { id: string; role: UserRole; onboarded: boolean } = {
    id: user.id,
    role: 'player',
    onboarded: false,
  };
  if (firstName) patch.first_name = firstName;
  if (rest.length) patch.last_name = rest.join(' ');
  if (user.user_metadata?.avatar_url) {
    patch.avatar_url = String(user.user_metadata.avatar_url);
  }

  await upsertProfile(patch);
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Cloud authentication is not configured. Using local mode.' };
  }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Sign up failed.';
    return { user: null, error: message };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Cloud authentication is not configured. Using local mode.' };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Sign in failed.';
    return { user: null, error: message };
  }
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Cloud authentication is not configured.' };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Password reset failed.' };
  }
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function setUserRole(userId: string, role: UserRole): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.functions.invoke('set-user-role', {
      body: { userId, role },
    });
    return { error: error?.message ?? null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to set user role.' };
  }
}
