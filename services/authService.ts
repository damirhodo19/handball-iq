import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile, UserRole } from '@/types/database';

export interface AuthResult {
  user: any | null;
  error: string | null;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Cloud authentication is not configured. Using local mode.' };
  }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (e: any) {
    return { user: null, error: e.message ?? 'Sign up failed.' };
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
  } catch (e: any) {
    return { user: null, error: e.message ?? 'Sign in failed.' };
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Cloud authentication is not configured.' };
  }
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) return { user: null, error: error.message };
    return { user: null, error: null };
  } catch (e: any) {
    return { user: null, error: e.message ?? 'Google sign in failed.' };
  }
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Cloud authentication is not configured.' };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Password reset failed.' };
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
  } catch (e: any) {
    return { error: e.message ?? 'Failed to set user role.' };
  }
}
