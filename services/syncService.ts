// Local-to-Supabase sync service
// Handles migrating local storage data to Supabase and tracking sync status

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  loadSessions, loadMatchHistory, loadProfile, saveSession, saveMatchRecord,
  SessionRecord, MatchHistoryRecord, UserProfile,
} from '@/lib/storage';
import { saveSessionResult } from '@/services/sessionService';
import { saveMatchSimulation } from '@/services/matchService';
import { upsertProfile } from '@/services/profileService';

const SYNC_KEY = 'hbiq_synced_records';
const MIGRATION_PROMPT_KEY = 'hbiq_migration_prompted';

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
  return data.sessions.length > 0 || data.matches.length > 0;
}

export function hasMigrationBeenPrompted(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(MIGRATION_PROMPT_KEY) === 'true';
    }
  } catch {}
  return false;
}

export function markMigrationPrompted(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(MIGRATION_PROMPT_KEY, 'true');
    }
  } catch {}
}

function getSyncedIds(): Set<string> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(SYNC_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    }
  } catch {}
  return new Set();
}

function markSynced(ids: string[]): void {
  const existing = getSyncedIds();
  ids.forEach((id) => existing.add(id));
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SYNC_KEY, JSON.stringify([...existing]));
    }
  } catch {}
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

  // Sync profile
  if (data.profile) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      const { error } = await upsertProfile({
        id: user.id,
        primary_position: data.profile.position,
        secondary_position: data.profile.secondaryPosition,
        dominant_hand: data.profile.dominantHand,
        age_group: data.profile.ageGroup,
        playing_level: data.profile.playingLevel,
        club: data.profile.club,
        country: data.profile.country,
        development_goal: data.profile.developmentGoal,
        onboarded: true,
      });
      if (error) errors.push(`Profile: ${error}`);
    }
  }

  // Sync sessions
  for (const session of data.sessions) {
    const { error, id } = await saveSessionResult({
      session_type: 'training',
      session_name: session.sessionName,
      position: null,
      score: session.decisionScore,
      decision_score: session.decisionScore,
      mental_readiness: 0,
      pressure_control: 0,
      duration_seconds: session.timeSpent,
      answers: session.metrics.map((m) => ({ metric: m.metric, correct: m.correct })),
    });
    if (error) {
      failed++;
      errors.push(`Session ${session.id}: ${error}`);
    } else {
      synced++;
      syncedIds.push(session.id);
    }
  }

  // Sync matches
  for (const match of data.matches) {
    const { error, id } = await saveMatchSimulation({
      position: 'Goalkeeper',
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
    });
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

// Offline queue: save records locally with pending sync status
const OFFLINE_QUEUE_KEY = 'hbiq_offline_queue';

interface OfflineQueueItem {
  id: string;
  type: 'session' | 'match' | 'match_day' | 'reflection';
  data: any;
  timestamp: string;
}

export function addToOfflineQueue(type: OfflineQueueItem['type'], data: any): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const queue = getOfflineQueue();
    queue.push({
      id: `oq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
    });
    window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {}
}

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (raw) return JSON.parse(raw) as OfflineQueueItem[];
    }
  } catch {}
  return [];
}

export async function flushOfflineQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining: OfflineQueueItem[] = [];

  for (const item of queue) {
    let success = false;
    if (item.type === 'session') {
      const { error } = await saveSessionResult(item.data);
      success = !error;
    } else if (item.type === 'match') {
      const { error } = await saveMatchSimulation(item.data);
      success = !error;
    }
    if (success) {
      synced++;
    } else {
      failed++;
      remaining.push(item);
    }
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    }
  } catch {}

  return { synced, failed };
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
