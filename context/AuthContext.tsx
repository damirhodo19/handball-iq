import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { fetchProfile } from '@/services/profileService';
import { flushOfflineQueue, hasUnsyncedData, hasMigrationBeenPrompted } from '@/services/syncService';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  shouldPromptMigration: boolean;
  dismissMigrationPrompt: () => void;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INIT_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Initialization timed out')), ms)
    ),
  ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldPromptMigration, setShouldPromptMigration] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProfileData = useCallback(async (userId: string) => {
    try {
      const data = await fetchProfile(userId);
      setProfile(data);
      if (!data) {
        setError('Could not load your profile. Using local mode.');
      } else {
        setError(null);
      }
    } catch {
      setProfile(null);
      setError('Could not load your profile. Using local mode.');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfileData(session.user.id);
    }
  }, [session, fetchProfileData]);

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: sessionError } = await withTimeout(
        supabase.auth.getSession(),
        INIT_TIMEOUT_MS
      );

      if (sessionError) {
        setError('Could not connect to the server. Using local mode.');
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await withTimeout(
          fetchProfileData(data.session.user.id),
          INIT_TIMEOUT_MS
        ).catch(() => {
          setError('Could not load your profile. Using local mode.');
        });

        if (!hasMigrationBeenPrompted() && hasUnsyncedData()) {
          setShouldPromptMigration(true);
        }

        try {
          await flushOfflineQueue();
        } catch {
          // sync failure should not block startup
        }
      }
    } catch {
      setError('Could not connect to the server. Using local mode.');
    } finally {
      setLoading(false);
    }
  }, [fetchProfileData]);

  useEffect(() => {
    init();
  }, [init, retryCount]);

  useEffect(() => {
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        (async () => {
          try {
            await fetchProfileData(newSession.user.id);
          } catch {
            // profile fetch failure should not block the user
          }
          setLoading(false);

          if (!hasMigrationBeenPrompted() && hasUnsyncedData()) {
            setShouldPromptMigration(true);
          }

          try {
            await flushOfflineQueue();
          } catch {
            // sync failure should not block startup
          }
        })();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [fetchProfileData]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const dismissMigrationPrompt = useCallback(() => {
    setShouldPromptMigration(false);
  }, []);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        error,
        refreshProfile,
        signOut,
        shouldPromptMigration,
        dismissMigrationPrompt,
        retry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
