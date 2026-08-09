import { useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { clearUserScopedLocalData } from '@/lib/clear-user-local';

export function useSignOut() {
  const { signOut: authSignOut } = useAuth();
  const { clearDevAuth } = useDevAuth();

  return useCallback(async () => {
    clearDevAuth();
    // Critical: wipe user-scoped progression before next login can merge it
    clearUserScopedLocalData({ preserveDeviceSettings: true });
    await authSignOut();
    router.replace('/(auth)/login');
  }, [authSignOut, clearDevAuth]);
}
