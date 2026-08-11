import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { isAdminUser } from '@/lib/admin-auth';

export function useAdminAccess() {
  const { session, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (authLoading) return;

      if (!session || !supabase) {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      setChecking(true);
      const { data: access, error: accessError } = await supabase.rpc('current_user_is_admin');

      // Keep existing app_metadata admins working while the database migration
      // is being rolled out. The RPC is the authoritative check once available.
      let allowed = !accessError && access === true;
      if (accessError) {
        const { data, error } = await supabase.auth.getUser();
        allowed = !error && isAdminUser(data.user);
      }

      if (!cancelled) {
        setIsAdmin(allowed);
        setChecking(false);
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [authLoading, session]);

  return {
    session,
    isAdmin,
    loading: authLoading || checking,
  };
}
