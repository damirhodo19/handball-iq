import { loadSettings, saveSettings, loadProfile, type AppSettings } from '@/lib/storage';
import type { AppRole } from '@/lib/platform/types';
import { resolveAppRole } from '@/lib/platform/personalization';

export type ActiveMode = 'player' | 'coach';

export function getActiveMode(): ActiveMode {
  const settings = loadSettings();
  const role = resolveAppRole(loadProfile());
  if (role === 'coach') return 'coach';
  if (role === 'player' || role === 'admin') return 'player';
  // player_coach
  return settings.activeMode === 'coach' ? 'coach' : 'player';
}

export function setActiveMode(mode: ActiveMode): void {
  const current = loadSettings();
  const next: AppSettings = { ...current, activeMode: mode };
  saveSettings(next);
}

export function canSwitchMode(role: AppRole | null | undefined): boolean {
  return role === 'player_coach';
}
