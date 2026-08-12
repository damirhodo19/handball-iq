import type { HandballPosition } from '@/lib/positions';
import type { UserProfile } from '@/lib/storage';
import { readStorageRaw, removeStorageKey, writeStorageRaw } from '@/lib/platform-storage';
import { normalizeHandballPosition } from './resolve-position';

const ACTIVE_POSITION_KEY = 'hbiq_active_player_position';

type PositionProfile = Pick<UserProfile, 'position' | 'secondaryPosition'>;

export function getAvailablePlayerPositions(
  profile: PositionProfile | null | undefined,
): HandballPosition[] {
  if (!profile) return [];
  const positions = [
    normalizeHandballPosition(profile.position),
    normalizeHandballPosition(profile.secondaryPosition),
  ].filter((position): position is HandballPosition => position !== null);
  return positions.filter((position, index) => positions.indexOf(position) === index);
}

/**
 * Resolve the position currently used by every player-facing module.
 * Old profiles remain compatible: the primary position is used until a choice is saved.
 */
export function resolveActivePlayerPosition(
  profile: PositionProfile | null | undefined,
  preferred?: string | null,
): HandballPosition | null {
  const available = getAvailablePlayerPositions(profile);
  if (available.length === 0) return null;

  const requested = normalizeHandballPosition(preferred);
  if (requested && available.includes(requested)) return requested;

  const stored = normalizeHandballPosition(readStorageRaw(ACTIVE_POSITION_KEY));
  if (stored && available.includes(stored)) return stored;

  return available[0];
}

export function setActivePlayerPosition(
  profile: PositionProfile | null | undefined,
  position: string | null | undefined,
): HandballPosition | null {
  const resolved = resolveActivePlayerPosition(profile, position);
  if (!resolved) {
    removeStorageKey(ACTIVE_POSITION_KEY);
    return null;
  }
  writeStorageRaw(ACTIVE_POSITION_KEY, resolved);
  return resolved;
}

export function reconcileActivePlayerPosition(
  profile: PositionProfile | null | undefined,
): HandballPosition | null {
  const resolved = resolveActivePlayerPosition(profile);
  if (resolved) writeStorageRaw(ACTIVE_POSITION_KEY, resolved);
  else removeStorageKey(ACTIVE_POSITION_KEY);
  return resolved;
}

