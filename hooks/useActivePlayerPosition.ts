import { useCallback, useEffect, useMemo, useState } from 'react';
import type { HandballPosition } from '@/lib/positions';
import type { UserProfile } from '@/lib/storage';
import {
  getAvailablePlayerPositions,
  resolveActivePlayerPosition,
  setActivePlayerPosition,
} from '@/lib/platform/active-player-position';
import { useAuth } from '@/context/AuthContext';
import { syncPreferencesToCloud } from '@/services/preferencesService';

type PositionProfile = Pick<UserProfile, 'position' | 'secondaryPosition'>;

export function useActivePlayerPosition(profile: PositionProfile | null | undefined) {
  const { user } = useAuth();
  const profileKey = `${profile?.position ?? ''}|${profile?.secondaryPosition ?? ''}`;
  const positions = useMemo(
    () => getAvailablePlayerPositions(profile),
    [profileKey],
  );
  const [position, setPositionState] = useState<HandballPosition | null>(() =>
    resolveActivePlayerPosition(profile),
  );

  useEffect(() => {
    setPositionState(resolveActivePlayerPosition(profile));
  }, [profileKey, profile]);

  const selectPosition = useCallback((next: HandballPosition) => {
    const resolved = setActivePlayerPosition(profile, next);
    setPositionState(resolved);
    if (resolved && user?.id) void syncPreferencesToCloud(user.id);
    return resolved;
  }, [profileKey, user?.id]);

  return { position, positions, selectPosition };
}
