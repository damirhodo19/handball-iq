import { readStorageRaw, writeStorageRaw, removeStorageKey } from '@/lib/platform-storage';
import type { HandballPosition } from '@/lib/positions';

const KEY = 'hbiq_active_training_session';

export interface ActiveTrainingSession {
  position: HandballPosition;
  /** Canonical bank scenario ids — order is the session order */
  bankIds: string[];
  startedAt: string;
}

export function loadActiveTrainingSession(): ActiveTrainingSession | null {
  const raw = readStorageRaw(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActiveTrainingSession;
    if (!parsed?.position || !Array.isArray(parsed.bankIds) || parsed.bankIds.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveActiveTrainingSession(session: ActiveTrainingSession): void {
  writeStorageRaw(KEY, JSON.stringify(session));
}

export function clearActiveTrainingSession(): void {
  removeStorageKey(KEY);
}
