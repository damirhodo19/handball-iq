import type { User } from '@supabase/supabase-js';
import type { UserRole } from '@/types/database';
import { loadCoachAccount } from '@/lib/coach-dashboard-data';

export function isCoachUser(
  user: User | null | undefined,
  profileRole?: UserRole | string | null,
): boolean {
  if (!user) return false;

  const metaRole = user.app_metadata?.role as string | undefined;
  if (metaRole === 'admin' || metaRole === 'coach' || metaRole === 'player_coach') return true;
  if (profileRole === 'coach' || profileRole === 'player_coach' || profileRole === 'admin') return true;

  return Boolean(loadCoachAccount());
}

export function isPlayerOnly(
  user: User | null | undefined,
  profileRole?: UserRole | string | null,
): boolean {
  if (!user) return false;
  const metaRole = user.app_metadata?.role as string | undefined;
  const role = profileRole ?? metaRole;
  return role === 'player' && !loadCoachAccount();
}
