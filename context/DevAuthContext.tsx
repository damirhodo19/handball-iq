import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { router } from 'expo-router';

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
  name: 'Damir',
  role: 'Goalkeeper',
  membership: 'Founding Member',
  memberNumber: '#001',
  handball_iq_score: 82,
  streak: 0,
  total_points: 0,
};

const DEV_AUTH_KEY = 'handball_iq_dev_auth';

interface DevAuthContextValue {
  isDevAuthenticated: boolean;
  testUser: TestUser | null;
  signInAsTestUser: () => void;
  signOut: () => void;
}

const DevAuthContext = createContext<DevAuthContextValue | undefined>(undefined);

function readStored(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(DEV_AUTH_KEY) === 'true';
    }
  } catch {
    // ignore
  }
  return false;
}

function writeStored(value: boolean): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (value) window.localStorage.setItem(DEV_AUTH_KEY, 'true');
      else window.localStorage.removeItem(DEV_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
  const [testUser, setTestUser] = useState<TestUser | null>(null);

  useEffect(() => {
    if (readStored()) {
      setIsDevAuthenticated(true);
      setTestUser(TEST_USER);
    }
  }, []);

  const signInAsTestUser = useCallback(() => {
    writeStored(true);
    setIsDevAuthenticated(true);
    setTestUser(TEST_USER);
    router.replace('/(tabs)/home');
  }, []);

  const signOut = useCallback(() => {
    writeStored(false);
    setIsDevAuthenticated(false);
    setTestUser(null);
    router.replace('/(auth)/login');
  }, []);

  return (
    <DevAuthContext.Provider value={{ isDevAuthenticated, testUser, signInAsTestUser, signOut }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuth() {
  const ctx = useContext(DevAuthContext);
  if (!ctx) throw new Error('useDevAuth must be used within DevAuthProvider');
  return ctx;
}
