import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { fetchProfile } from '@/services/profileService';
import { pullPreferencesFromCloud, syncPreferencesToCloud } from '@/services/preferencesService';
import { ensureProfileForUser } from '@/services/authService';
import { flushOfflineQueue, hasUnsyncedData, hasMigrationBeenPrompted } from '@/services/syncService';
import { hydrateDevelopmentFromCloud } from '@/services/developmentService';
import {
  hydrateCoachDevelopmentFromCloud,
  setCoachSyncUser,
  syncCoachDevelopmentFull,
} from '@/services/coachDevelopmentService';

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
      setTimeout(() => reject(new Error('error.initTimeout')), ms)
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
      const { bindDataOwner } = await import('@/lib/clear-user-local');
      bindDataOwner(userId);
      const data = await fetchProfile(userId);
      setProfile(data);
      if (!data) {
        setError('error.profileLoadFailed');
      } else {
        setError(null);
        await pullPreferencesFromCloud(userId);
        await hydrateDevelopmentFromCloud(userId);
        await hydrateCoachDevelopmentFromCloud(userId);
        setCoachSyncUser(userId);
        // Reconcile after hydrate: push merged local→cloud once (same integrity rule as coach)
        const { syncDevelopmentFull } = await import('@/services/developmentService');
        await syncDevelopmentFull(userId);
        await syncCoachDevelopmentFull(userId);
        await flushOfflineQueue();
      }
    } catch {
      setProfile(null);
      setError('error.profileLoadFailed');
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
        setError('error.serverConnectFailed');
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await withTimeout(
          fetchProfileData(data.session.user.id),
          INIT_TIMEOUT_MS
        ).catch(() => {
          setError('error.profileLoadFailed');
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
    } catch (err) {
      setError(err instanceof Error && err.message.startsWith('error.') ? err.message : 'error.serverConnectFailed');
    } finally {
      setLoading(false);
    }
  }, [fetchProfileData]);

  useEffect(() => {
    init();
  }, [init, retryCount]);

  useEffect(() => {
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        (async () => {
          try {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (event === 'SIGNED_IN') {
                await ensureProfileForUser(newSession.user);
              }
              const { data: refreshed } = await supabase!.auth.getUser();
              if (refreshed.user) {
                setSession((current) =>
                  current
                    ? { ...current, user: refreshed.user }
                    : current
                );
              }
            }
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

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!supabase) return;

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        try {
          const client = supabase;
          if (!client) return;
          const { data, error: refreshError } = await client.auth.refreshSession();
          if (!refreshError && data.session) {
            setSession(data.session);
            if (data.session.user) {
              await fetchProfileData(data.session.user.id);
            }
          }
          await flushOfflineQueue();
        } catch {
          // resume refresh should not block the user
        }
      }
      appState.current = nextState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [fetchProfileData]);

  const signOut = useCallback(async () => {
    const { clearUserScopedLocalData } = await import('@/lib/clear-user-local');
    clearUserScopedLocalData({ preserveDeviceSettings: true });
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
