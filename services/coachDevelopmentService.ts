import { supabase } from '@/lib/supabase';
import {
  loadCoachDevState,
  saveCoachDevState,
} from '@/lib/coach-platform/storage';
import { calculateCoachLevel } from '@/lib/coach-platform/progression';
import type { CoachDevState } from '@/lib/coach-platform/types';

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let pendingUserId: string | null = null;

/** Debounced sync — safe after offline bursts / retries */
export function queueCoachSync(userId?: string | null): void {
  if (userId) pendingUserId = userId;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const id = pendingUserId;
    if (id) void syncCoachDevelopmentFull(id);
  }, 800);
}

export function setCoachSyncUser(userId: string | null): void {
  pendingUserId = userId;
}

export async function syncCoachDevelopmentFull(userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const state = loadCoachDevState();

  const { error } = await supabase.from('coach_development').upsert(
    {
      user_id: userId,
      total_xp: state.totalXp ?? 0,
      coach_level: state.coachLevel ?? calculateCoachLevel(state.totalXp ?? 0),
      active_track: state.activeTrack ?? null,
      weekly_goals: state.weeklyGoals ?? null,
      streak_snapshot: state.streak ?? null,
      challenge_attempts: (state.challengeAttempts ?? []).slice(0, 100),
      activity_events: (state.activityEvents ?? []).slice(0, 150),
      training_plans: (state.trainingPlans ?? []).slice(0, 30),
      match_analyses: (state.matchAnalyses ?? []).slice(0, 30),
      daily_challenge_id: state.dailyChallengeId,
      daily_challenge_date: state.dailyChallengeDate,
      daily_challenge_completed: state.dailyChallengeCompleted,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  await syncCoachXpEvents(userId, state);
  await syncCoachAchievements(userId, state);
  return { error: error?.message ?? null };
}

async function syncCoachXpEvents(userId: string, state: CoachDevState): Promise<void> {
  if (!supabase) return;
  for (const e of (state.xpEvents ?? []).slice(0, 100)) {
    await supabase.from('coach_xp_events').upsert(
      {
        user_id: userId,
        event_key: e.eventKey,
        reason: e.reason,
        amount: e.amount,
        source: e.source,
        metadata: e.metadata ?? {},
        created_at: e.date,
      },
      { onConflict: 'user_id,event_key', ignoreDuplicates: true },
    );
  }
}

async function syncCoachAchievements(userId: string, state: CoachDevState): Promise<void> {
  if (!supabase) return;
  for (const a of state.achievements ?? []) {
    await supabase.from('coach_achievements').upsert(
      {
        user_id: userId,
        achievement_id: a.id,
        unlocked_at: a.unlockedAt,
      },
      { onConflict: 'user_id,achievement_id', ignoreDuplicates: true },
    );
  }
}

/** Hydrate local coach cache from cloud (merge, never lose local newer eventKeys). */
export async function hydrateCoachDevelopmentFromCloud(
  userId: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };

  const { data, error } = await supabase
    .from('coach_development')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: null };

  const local = loadCoachDevState();

  const { data: xpRows } = await supabase
    .from('coach_xp_events')
    .select('event_key, reason, amount, source, metadata, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  const { data: achRows } = await supabase
    .from('coach_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  const eventMap = new Map((local.xpEvents ?? []).map((e) => [e.eventKey, e]));
  for (const row of xpRows ?? []) {
    if (!eventMap.has(row.event_key)) {
      eventMap.set(row.event_key, {
        id: `cloud_${row.event_key}`,
        eventKey: row.event_key,
        reason: row.reason,
        amount: row.amount,
        source: row.source,
        date: row.created_at,
        metadata: row.metadata ?? undefined,
      });
    }
  }

  const achMap = new Map((local.achievements ?? []).map((a) => [a.id, a]));
  for (const row of achRows ?? []) {
    if (!achMap.has(row.achievement_id)) {
      achMap.set(row.achievement_id, {
        id: row.achievement_id,
        unlockedAt: row.unlocked_at,
      });
    }
  }

  const mergedEvents = [...eventMap.values()];
  const recomputed = mergedEvents.reduce((s, e) => s + (e.amount || 0), 0);
  const totalXp = Math.max(local.totalXp ?? 0, Number(data.total_xp) || 0, recomputed);

  const next: CoachDevState = {
    ...local,
    totalXp,
    coachLevel: calculateCoachLevel(totalXp),
    xpEvents: mergedEvents.slice(0, 300),
    achievements: [...achMap.values()],
    streak: data.streak_snapshot ?? local.streak,
    weeklyGoals: data.weekly_goals ?? local.weeklyGoals,
    activeTrack: data.active_track ?? local.activeTrack,
    challengeAttempts:
      Array.isArray(data.challenge_attempts) && data.challenge_attempts.length >= (local.challengeAttempts?.length ?? 0)
        ? data.challenge_attempts
        : local.challengeAttempts,
    activityEvents:
      Array.isArray(data.activity_events) && data.activity_events.length >= (local.activityEvents?.length ?? 0)
        ? data.activity_events
        : local.activityEvents,
    trainingPlans:
      Array.isArray(data.training_plans) && data.training_plans.length >= (local.trainingPlans?.length ?? 0)
        ? data.training_plans
        : local.trainingPlans,
    matchAnalyses:
      Array.isArray(data.match_analyses) && data.match_analyses.length >= (local.matchAnalyses?.length ?? 0)
        ? data.match_analyses
        : local.matchAnalyses,
    dailyChallengeId: data.daily_challenge_id ?? local.dailyChallengeId,
    dailyChallengeDate: data.daily_challenge_date ?? local.dailyChallengeDate,
    dailyChallengeCompleted: data.daily_challenge_completed ?? local.dailyChallengeCompleted,
  };

  if (next.activeTrack) {
    next.activeTrack.xp = next.totalXp;
    next.activeTrack.level = next.coachLevel;
  }

  saveCoachDevState(next);
  return { error: null };
}
