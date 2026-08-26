/**
 * Clear user-scoped local caches on sign-out / account switch.
 * Preserves device-global language + theme only.
 */
import { removeStorageKey, readStorageJson, writeStorageJson, writeStorageRaw, readStorageRaw } from '@/lib/platform-storage';
import type { AppSettings } from '@/lib/storage';

const DATA_OWNER_KEY = 'hbiq_data_owner';

/** Keys that belong to an authenticated user — never leave these for the next account. */
const USER_SCOPED_KEYS = [
  'hbiq_profile',
  'hbiq_sessions',
  'hbiq_streak',
  'hbiq_metrics',
  'hbiq_matches',
  'hbiq_development',
  'hbiq_coach_dev_state',
  'hbiq_coach_workspace_v1',
  'hbiq_coach_player_goals_v1',
  'hbiq_offline_queue',
  'hbiq_synced_records',
  'hbiq_sync_status',
  'hbiq_migration_prompted',
  'handball_iq_dev_auth',
  'hbiq_match_day',
  'hbiq_session_mode',
  'hbiq_session_intent',
  'hbiq_active_training_session',
];

export function getDataOwnerUserId(): string | null {
  return readStorageRaw(DATA_OWNER_KEY);
}

/** Bind local caches to a user; wipe if a different user was bound. */
export function bindDataOwner(userId: string): void {
  const prev = getDataOwnerUserId();
  if (prev && prev !== userId) {
    clearUserScopedLocalData({ preserveDeviceSettings: true });
  }
  writeStorageRaw(DATA_OWNER_KEY, userId);
}

export function clearDataOwner(): void {
  removeStorageKey(DATA_OWNER_KEY);
}

export function clearUserScopedLocalData(opts?: { preserveDeviceSettings?: boolean }): void {
  const preserve = opts?.preserveDeviceSettings !== false;
  let language: AppSettings['language'] | undefined;
  let theme: AppSettings['theme'] | undefined;
  if (preserve) {
    const settings = readStorageJson<Partial<AppSettings>>('hbiq_settings', {});
    language = settings.language;
    theme = settings.theme;
  }

  for (const key of USER_SCOPED_KEYS) {
    removeStorageKey(key);
  }
  clearDataOwner();

  // Reset settings to device-global prefs only (drop activeMode / user prefs)
  if (preserve) {
    writeStorageJson('hbiq_settings', {
      language: language ?? 'English',
      theme: theme ?? 'dark',
      themeMigrated: true,
      activeMode: 'player',
    });
  } else {
    removeStorageKey('hbiq_settings');
  }
}
