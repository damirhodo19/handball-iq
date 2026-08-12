// Local-to-Supabase sync service
// Handles migrating local storage data to Supabase and tracking sync status

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  loadSessions, loadMatchHistory, loadProfile,
  SessionRecord, MatchHistoryRecord, UserProfile,
} from '@/lib/storage';
import { saveSessionResult } from '@/services/sessionService';
import { saveMatchSimulation } from '@/services/matchService';
import { upsertProfile } from '@/services/profileService';
import { syncPreferencesToCloud } from '@/services/preferencesService';
import { readStorageJson, writeStorageJson, readStorageRaw, writeStorageRaw } from '@/lib/platform-storage';

const SYNC_KEY = 'hbiq_synced_records';
const MIGRATION_PROMPT_KEY = 'hbiq_migration_prompted';
const OFFLINE_QUEUE_KEY = 'hbiq_offline_queue';
const SYNC_STATUS_KEY = 'hbiq_sync_status';

export type SyncUiStatus = 'idle' | 'pending' | 'failed' | 'synced';

export interface MigrationData {
  sessions: SessionRecord[];
  matches: MatchHistoryRecord[];
  profile: UserProfile | null;
}

export function getUnsyncedLocalData(): MigrationData {
  const sessions = loadSessions();
  const matches = loadMatchHistory();
  const profile = loadProfile();

  const syncedIds = getSyncedIds();
  const unsyncedSessions = sessions.filter((s) => !syncedIds.has(s.id));
  const unsyncedMatches = matches.filter((m) => !syncedIds.has(m.id));

  return {
    sessions: unsyncedSessions,
    matches: unsyncedMatches,
    profile: profile.position ? profile : null,
  };
}

export function hasUnsyncedData(): boolean {
  const data = getUnsyncedLocalData();
  return data.sessions.length > 0 || data.matches.length > 0 || getOfflineQueue().length > 0;
}

export function hasMigrationBeenPrompted(): boolean {
  return readStorageRaw(MIGRATION_PROMPT_KEY) === 'true';
}

export function markMigrationPrompted(): void {
  writeStorageRaw(MIGRATION_PROMPT_KEY, 'true');
}

function getSyncedIds(): Set<string> {
  return new Set(readStorageJson<string[]>(SYNC_KEY, []));
}

function markSynced(ids: string[]): void {
  const existing = getSyncedIds();
  ids.forEach((id) => existing.add(id));
  writeStorageJson(SYNC_KEY, [...existing]);
}

export function getSyncUiStatus(): SyncUiStatus {
  return readStorageJson<SyncUiStatus>(SYNC_STATUS_KEY, 'idle');
}

export function setSyncUiStatus(status: SyncUiStatus): void {
  writeStorageJson(SYNC_STATUS_KEY, status);
}

export async function syncLocalDataToCloud(): Promise<{ synced: number; failed: number; errors: string[] }> {
  if (!isSupabaseConfigured || !supabase) {
    return { synced: 0, failed: 0, errors: ['Supabase not configured.'] };
  }

  const data = getUnsyncedLocalData();
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];
  const syncedIds: string[] = [];

  {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      const { error } = await syncPreferencesToCloud(user.id);
      if (error) errors.push(`Profile/preferences: ${error}`);
      else if (data.profile) {
        await upsertProfile({ id: user.id, onboarded: true });
      }
    }
  }

  for (const session of data.sessions) {
    const { error } = await saveSessionResult({
      session_type: 'training',
      session_name: session.sessionName,
      position: session.position ?? data.profile?.position ?? null,
      score: session.decisionScore,
      decision_score: session.decisionScore,
      mental_readiness: 0,
      pressure_control: 0,
      duration_seconds: session.timeSpent,
      answers: session.metrics.map((m) => ({ metric: m.metric, correct: m.correct })),
      client_record_id: session.id,
    } as any);
    if (error) {
      failed++;
      errors.push(`Session ${session.id}: ${error}`);
    } else {
      synced++;
      syncedIds.push(session.id);
    }
  }

  for (const match of data.matches) {
    const { error } = await saveMatchSimulation({
      position: match.position ?? data.profile?.position ?? '',
      opponent: match.opponent,
      difficulty: match.competition,
      final_home_score: 0,
      final_away_score: 0,
      overall_rating: match.matchRating,
      decision_score: match.decisionScore,
      pressure_control: match.pressureControl,
      reading_score: match.readingAbility,
      consistency_score: match.consistency,
      answers: match.answers ?? [],
      report: { summary: match.summary, finalMessage: match.finalMessage },
      client_record_id: match.id,
    } as any);
    if (error) {
      failed++;
      errors.push(`Match ${match.id}: ${error}`);
    } else {
      synced++;
      syncedIds.push(match.id);
    }
  }

  markSynced(syncedIds);

  return { synced, failed, errors };
}

interface OfflineQueueItem {
  id: string;
  type: 'session' | 'match' | 'match_day' | 'reflection' | 'development';
  /** Stable dedupe key (e.g. local session/match id) */
  dedupeKey?: string;
  data: any;
  timestamp: string;
  userId?: string;
}

export function addToOfflineQueue(
  type: OfflineQueueItem['type'],
  data: any,
  opts?: { dedupeKey?: string; userId?: string },
): void {
  const queue = getOfflineQueue();
  const dedupeKey = opts?.dedupeKey;
  if (dedupeKey && queue.some((q) => q.dedupeKey === dedupeKey && q.type === type)) {
    setSyncUiStatus('pending');
    return;
  }
  queue.push({
    id: `oq_${dedupeKey ?? Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    dedupeKey,
    data,
    timestamp: new Date().toISOString(),
    userId: opts?.userId,
  });
  writeStorageJson(OFFLINE_QUEUE_KEY, queue);
  setSyncUiStatus('pending');
}

export function getOfflineQueue(): OfflineQueueItem[] {
  return readStorageJson<OfflineQueueItem[]>(OFFLINE_QUEUE_KEY, []);
}

export function clearOfflineQueue(): void {
  writeStorageJson(OFFLINE_QUEUE_KEY, []);
}

export async function flushOfflineQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    if (getSyncUiStatus() === 'pending') setSyncUiStatus('synced');
    return { synced: 0, failed: 0 };
  }

  setSyncUiStatus('pending');
  let synced = 0;
  let failed = 0;
  const remaining: OfflineQueueItem[] = [];

  for (const item of queue) {
    let success = false;
    try {
      if (item.type === 'session') {
        const { error } = await saveSessionResult(item.data);
        success = !error;
        if (success && item.dedupeKey) markSynced([item.dedupeKey]);
      } else if (item.type === 'match') {
        const { error } = await saveMatchSimulation(item.data);
        success = !error;
        if (success && item.dedupeKey) markSynced([item.dedupeKey]);
      } else if (item.type === 'development' && item.userId) {
        const mod = await import('@/services/developmentService');
        const { error } = await mod.syncDevelopmentFull(item.userId);
        success = !error;
      } else {
        success = true;
      }
    } catch {
      success = false;
    }
    if (success) synced++;
    else {
      failed++;
      remaining.push(item);
    }
  }

  writeStorageJson(OFFLINE_QUEUE_KEY, remaining);
  setSyncUiStatus(failed > 0 ? 'failed' : 'synced');
  return { synced, failed };
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/** Persist locally-supported cloud op: try now, else queue. */
export async function persistOrQueue(
  type: 'session' | 'match',
  data: any,
  opts: { dedupeKey: string; userId?: string },
): Promise<{ queued: boolean; error: string | null }> {
  if (!isOnline() || !isSupabaseConfigured || !opts.userId) {
    addToOfflineQueue(type, data, opts);
    return { queued: true, error: null };
  }
  try {
    if (type === 'session') {
      const { error } = await saveSessionResult(data);
      if (error) {
        addToOfflineQueue(type, data, opts);
        setSyncUiStatus('failed');
        return { queued: true, error };
      }
    } else {
      const { error } = await saveMatchSimulation(data);
      if (error) {
        addToOfflineQueue(type, data, opts);
        setSyncUiStatus('failed');
        return { queued: true, error };
      }
    }
    markSynced([opts.dedupeKey]);
    setSyncUiStatus('synced');
    return { queued: false, error: null };
  } catch (e: any) {
    addToOfflineQueue(type, data, opts);
    setSyncUiStatus('failed');
    return { queued: true, error: e?.message ?? 'sync failed' };
  }
}
