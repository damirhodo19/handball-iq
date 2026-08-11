import { supabase } from '@/lib/supabase';

export type AdminManagedRole = 'player' | 'coach' | 'player_coach';

export interface AdminUserRecord {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  role: string;
  primary_position: string | null;
  secondary_position: string | null;
  development_goals: string[];
  coach_development_goals: string[];
  onboarded: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  last_active_date: string | null;
  blocked: boolean;
  is_admin: boolean;
}

type AdminUserResult = {
  users: AdminUserRecord[];
  error: string | null;
};

export async function listAdminUsers(): Promise<AdminUserResult> {
  if (!supabase) return { users: [], error: 'Supabase is not configured.' };

  try {
    const { data, error } = await supabase.rpc('admin_list_users');
    if (error) return { users: [], error: error.message };
    return { users: (data as AdminUserRecord[] | null) ?? [], error: null };
  } catch (error: unknown) {
    return {
      users: [],
      error: error instanceof Error ? error.message : 'Could not load users.',
    };
  }
}

export async function setAdminUserRole(
  userId: string,
  role: AdminManagedRole,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };

  try {
    const { error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: userId,
      next_role: role,
    });
    return { error: error?.message ?? null };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Could not update the role.' };
  }
}

export async function setAdminUserBlocked(
  userId: string,
  blocked: boolean,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };

  try {
    const { error } = await supabase.rpc('admin_set_user_blocked', {
      target_user_id: userId,
      should_block: blocked,
    });
    return { error: error?.message ?? null };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Could not update account access.' };
  }
}
