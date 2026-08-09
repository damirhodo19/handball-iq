import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export interface TestUser {
  name: string;
  role: string;
  membership: string;
  memberNumber: string;
  handball_iq_score: number;
  streak: number;
  total_points: number;
}

const TEST_USER: TestUser = {
  name: 'Player',
  role: 'player',
  membership: 'Developer',
  memberNumber: '',
  handball_iq_score: 0,
  streak: 0,
  total_points: 0,
};

const DEV_AUTH_KEY = 'handball_iq_dev_auth';

interface DevAuthContextValue {
  isDevAuthenticated: boolean;
  testUser: TestUser | null;
  signInAsTestUser: () => void;
  signOut: () => void;
  clearDevAuth: () => void;
}

const DevAuthContext = createContext<DevAuthContextValue | undefined>(undefined);

function clearLegacyDevAuthStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(DEV_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
  const [testUser, setTestUser] = useState<TestUser | null>(null);

  const clearDevAuth = useCallback(() => {
    clearLegacyDevAuthStorage();
    setIsDevAuthenticated(false);
    setTestUser(null);
  }, []);

  useEffect(() => {
    // Never keep legacy web QA auth in release / preview builds
    clearLegacyDevAuthStorage();
    if (!__DEV__) {
      setIsDevAuthenticated(false);
      setTestUser(null);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (session) {
      clearDevAuth();
    }
  }, [session, authLoading, clearDevAuth]);

  const signInAsTestUser = useCallback(() => {
    if (!__DEV__) return;
    setIsDevAuthenticated(true);
    setTestUser(TEST_USER);
    router.replace('/(tabs)/home');
  }, []);

  const signOut = useCallback(() => {
    clearDevAuth();
    router.replace('/(auth)/login');
  }, [clearDevAuth]);

  return (
    <DevAuthContext.Provider value={{ isDevAuthenticated, testUser, signInAsTestUser, signOut, clearDevAuth }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuth() {
  const ctx = useContext(DevAuthContext);
  if (!ctx) throw new Error('useDevAuth must be used within DevAuthProvider');
  return ctx;
}
