import type { UserProfile } from '@/lib/storage';
import type { HandballPosition } from '@/lib/positions';
import { isHandballPosition } from '@/lib/platform/position-modules';
import type { ActiveMode } from '@/lib/platform/active-mode';

/**
 * Canonical internal IDs are English Title Case (e.g. "Left Back").
 * Snake_case / locale display labels are normalized here — never stored as display text.
 */
const POSITION_ALIASES: Record<string, HandballPosition> = {
  left_back: 'Left Back',
  right_back: 'Right Back',
  centre_back: 'Centre Back',
  center_back: 'Centre Back',
  left_wing: 'Left Wing',
  right_wing: 'Right Wing',
  goalkeeper: 'Goalkeeper',
  gk: 'Goalkeeper',
  pivot: 'Pivot',
  // Locale display labels → canonical
  'lijevi vanjski': 'Left Back',
  'desni vanjski': 'Right Back',
  'srednji vanjski': 'Centre Back',
  'lijevo krilo': 'Left Wing',
  'desno krilo': 'Right Wing',
  vratar: 'Goalkeeper',
  'linker rückraum': 'Left Back',
  'rechter rückraum': 'Right Back',
  'rückraum mitte': 'Centre Back',
  linksaußen: 'Left Wing',
  rechtsaußen: 'Right Wing',
  torwart: 'Goalkeeper',
  kreisläufer: 'Pivot',
};

/** Normalize any stored/UI position value to canonical HandballPosition or null. */
export function normalizeHandballPosition(value: string | null | undefined): HandballPosition | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (isHandballPosition(trimmed)) return trimmed;
  const aliased = POSITION_ALIASES[trimmed.toLowerCase()];
  return aliased ?? null;
}

/**
 * Resolve the player's handball position from a validated profile only.
 * Never invents a default (no Goalkeeper / Centre Back fallback).
 */
export function resolvePlayerPosition(
  profile: Pick<UserProfile, 'position'> | null | undefined,
): HandballPosition | null {
  if (!profile?.position) return null;
  return normalizeHandballPosition(profile.position);
}

/** Player-facing personalized content may render only with a real position (unless Coach Mode). */
export function canShowPlayerPersonalizedContent(
  profile: UserProfile | null | undefined,
  isCoachMode: boolean,
): boolean {
  if (isCoachMode) return true;
  if (profile?.role === 'coach') return true;
  return resolvePlayerPosition(profile) != null;
}

/** True when active Player Mode is missing a position. */
export function activeModeNeedsPlayerPosition(
  profile: UserProfile | null | undefined,
  activeMode: ActiveMode,
): boolean {
  if (profile?.role === 'coach') return false;
  if (profile?.role === 'player_coach' && activeMode === 'coach') return false;
  return resolvePlayerPosition(profile) == null;
}
