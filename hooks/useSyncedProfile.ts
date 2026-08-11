import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { loadProfile, type UserProfile } from '@/lib/storage';
import { pullPreferencesFromCloud } from '@/services/preferencesService';

/** Reload profile-backed screens after the latest cloud preferences have reached local storage. */
export function useSyncedProfile(): UserProfile {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      if (user?.id) await pullPreferencesFromCloud(user.id);
      if (active) setProfile(loadProfile());
    })();
    return () => { active = false; };
  }, [user?.id]));

  return profile;
}
