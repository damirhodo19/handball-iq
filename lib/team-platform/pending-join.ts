import {
  readStorageJson,
  removeStorageKey,
  writeStorageJson,
} from '@/lib/platform-storage';

const PENDING_JOIN_KEY = 'hbiq_pending_team_join';
const PENDING_JOIN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface PendingTeamJoin {
  token: string | null;
  code: string | null;
  savedAt: number;
}

function clean(value?: string | null): string | null {
  const normalized = value?.trim() ?? '';
  return normalized ? normalized.slice(0, 256) : null;
}

export function rememberPendingTeamJoin(input: {
  token?: string | null;
  code?: string | null;
}): void {
  const token = clean(input.token);
  const code = clean(input.code)?.toUpperCase() ?? null;
  if (!token && !code) return;
  writeStorageJson<PendingTeamJoin>(PENDING_JOIN_KEY, {
    token,
    code,
    savedAt: Date.now(),
  });
}

export function getPendingTeamJoin(): PendingTeamJoin | null {
  const pending = readStorageJson<PendingTeamJoin | null>(PENDING_JOIN_KEY, null);
  if (!pending || Date.now() - pending.savedAt > PENDING_JOIN_MAX_AGE_MS) {
    clearPendingTeamJoin();
    return null;
  }
  if (!clean(pending.token) && !clean(pending.code)) {
    clearPendingTeamJoin();
    return null;
  }
  return pending;
}

export function getPendingTeamJoinPath(): string | null {
  const pending = getPendingTeamJoin();
  if (!pending) return null;
  if (pending.token) {
    return `/coach-dashboard/join?token=${encodeURIComponent(pending.token)}`;
  }
  return `/coach-dashboard/join?code=${encodeURIComponent(pending.code ?? '')}`;
}

export function clearPendingTeamJoin(): void {
  removeStorageKey(PENDING_JOIN_KEY);
}
