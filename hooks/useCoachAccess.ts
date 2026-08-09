import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { isCoachUser, isPlayerOnly } from '@/lib/coach-auth';
import { fetchProfile } from '@/services/profileService';

export function useCoachAccess() {
  const { session, profile, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (authLoading) return;

      if (!session || !supabase) {
        if (!cancelled) {
          setIsCoach(false);
          setIsPlayer(false);
          setChecking(false);
        }
        return;
      }

      setChecking(true);
      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;

      if (error || !data.user) {
        setIsCoach(false);
        setIsPlayer(false);
        setChecking(false);
        return;
      }

      let role = profile?.role ?? null;
      if (!role) {
        const remote = await fetchProfile(data.user.id);
        role = remote?.role ?? null;
      }

      setIsCoach(isCoachUser(data.user, role));
      setIsPlayer(isPlayerOnly(data.user, role));
      setChecking(false);
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [authLoading, session, profile?.role]);

  return {
    session,
    isCoach,
    isPlayer,
    loading: authLoading || checking,
  };
}
