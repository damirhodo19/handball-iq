import { readStorageRaw, writeStorageRaw, removeStorageKey } from '@/lib/platform-storage';
import type { HandballPosition } from '@/lib/positions';

const KEY = 'hbiq_session_intent';

export interface SessionIntent {
  /** Position explicitly selected before opening the session. */
  position?: HandballPosition;
  /** Prefer these bank scenario ids when starting a standard session */
  scenarioIds?: string[];
  /** Optional category name filter (scenario-bank category) */
  category?: string;
  /** Optional difficulty filter */
  difficulty?: string;
}

export function setSessionIntent(intent: SessionIntent | null): void {
  if (!intent) {
    removeStorageKey(KEY);
    return;
  }
  writeStorageRaw(KEY, JSON.stringify(intent));
}

export function getSessionIntent(): SessionIntent | null {
  const raw = readStorageRaw(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionIntent;
  } catch {
    return null;
  }
}

export function clearSessionIntent(): void {
  removeStorageKey(KEY);
}
