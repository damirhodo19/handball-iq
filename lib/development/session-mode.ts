import { readStorageRaw, writeStorageRaw, removeStorageKey } from '@/lib/platform-storage';

const SESSION_MODE_KEY = 'hbiq_session_mode';

export type SessionMode = 'standard' | 'daily_challenge';

export function setSessionMode(mode: SessionMode): void {
  writeStorageRaw(SESSION_MODE_KEY, mode);
}

export function getSessionMode(): SessionMode {
  const raw = readStorageRaw(SESSION_MODE_KEY);
  return (raw as SessionMode) ?? 'standard';
}

export function clearSessionMode(): void {
  removeStorageKey(SESSION_MODE_KEY);
}
