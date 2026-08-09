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
      const { data, error } = await supabase.auth.getUser();
      if (!cancelled) {
        setIsAdmin(!error && isAdminUser(data.user));
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
