import { supabase } from '@/lib/supabase';
import type { DevelopmentState } from '@/lib/development/types';
import {
  loadDevelopmentState,
  saveDevelopmentState,
  createDefaultState,
} from '@/lib/development/storage';
import { calculateLevel, calculatePlayerLevel } from '@/lib/development/levels';
import { loadStreak } from '@/lib/storage';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';

const STREAK_KEY = 'hbiq_streak';

/** Push aggregate + XP events + achievements + Sprint 4 program/goals + streak snapshot. */
export async function syncDevelopmentFull(userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const state = loadDevelopmentState();
  const streak = loadStreak();

  const payload = {
      user_id: userId,
      total_xp: state.totalXp,
      player_level: state.level,
      player_level_number: state.playerLevel,
      decision_events: state.decisionEvents.slice(0, 200),
      daily_challenge: state.dailyChallenge,
      daily_challenges_by_position: state.dailyChallengesByPosition ?? {},
      weekly_program: state.weeklyProgram,
      weekly_programs_by_position: state.weeklyProgramsByPosition ?? {},
      daily_goals: state.dailyGoals,
      weekly_goals: state.weeklyGoals,
      active_program: state.activeProgram,
      // Paused enrollments travel in the same JSON column with status:'paused' (no schema change)
      completed_programs: [
        ...(state.completedPrograms ?? []),
        ...(state.pausedPrograms ?? []).map((p) => ({ ...p, status: 'paused' as const, completed: false })),
      ],
      statistics: state.statistics,
      notification_prefs: state.notificationPrefs,
      streak_snapshot: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastQualifyingDate: streak.lastQualifyingDate ?? streak.lastSessionDate,
        sessionsThisWeek: streak.sessionsThisWeek,
        weekStart: streak.weekStart,
      },
      updated_at: new Date().toISOString(),
  };
  let { error } = await supabase.from('player_development').upsert(
    payload,
    { onConflict: 'user_id' },
  );
  if (error) {
    const {
      daily_challenges_by_position: _dailyByPosition,
      weekly_programs_by_position: _weeklyByPosition,
      ...legacyPayload
    } = payload;
    ({ error } = await supabase.from('player_development').upsert(
      legacyPayload,
      { onConflict: 'user_id' },
    ));
  }

  await syncXpEventsToCloud(userId, state);
  await syncAchievementsToCloud(userId, state);

  return { error: error?.message ?? null };
}

/** @deprecated Prefer syncDevelopmentFull */
export async function syncDevelopmentToCloud(userId: string): Promise<{ error: string | null }> {
  return syncDevelopmentFull(userId);
}

export async function syncXpEventsToCloud(userId: string, state: DevelopmentState): Promise<void> {
  if (!supabase) return;
  const recent = state.xpEvents.slice(0, 100);
  for (const e of recent) {
    await supabase.from('xp_events').upsert(
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

export async function syncAchievementsToCloud(userId: string, state: DevelopmentState): Promise<void> {
  if (!supabase) return;
  for (const a of state.achievements) {
    await supabase.from('player_achievements').upsert(
      {
        user_id: userId,
        achievement_id: a.id,
        unlocked_at: a.unlockedAt,
      },
      { onConflict: 'user_id,achievement_id', ignoreDuplicates: true },
    );
  }
}

/**
 * Hydrate local Sprint 4 state from cloud after login.
 * Merges by max XP / union of eventKeys and achievements — never lowers totals from a stale cloud row.
 */
export async function hydrateDevelopmentFromCloud(userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };

  const { data, error } = await supabase
    .from('player_development')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: null };

  const local = loadDevelopmentState();
  const cloudXp = Number(data.total_xp) || 0;

  const { data: xpRows } = await supabase
    .from('xp_events')
    .select('event_key, reason, amount, source, metadata, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  const { data: achRows } = await supabase
    .from('player_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  const eventMap = new Map(local.xpEvents.map((e) => [e.eventKey, e]));
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

  const achMap = new Map(local.achievements.map((a) => [a.id, a]));
  for (const row of achRows ?? []) {
    if (!achMap.has(row.achievement_id)) {
      achMap.set(row.achievement_id, {
        id: row.achievement_id,
        unlockedAt: row.unlocked_at,
      });
    }
  }

  const mergedXpEvents = [...eventMap.values()];
  const recomputedXp = mergedXpEvents.reduce((s, e) => s + (e.amount || 0), 0);
  const totalXp = Math.max(local.totalXp, cloudXp, recomputedXp);

  const mergeDaily = (
    cloud: DevelopmentState['dailyChallenge'],
    loc: DevelopmentState['dailyChallenge'],
  ): DevelopmentState['dailyChallenge'] => {
    if (!cloud) return loc;
    if (!loc) return cloud;
    if (cloud.date === loc.date) {
      return {
        ...cloud,
        ...loc,
        completed: !!(cloud.completed || loc.completed),
        xpAwarded: !!(cloud.xpAwarded || loc.xpAwarded),
        completedScore: loc.completedScore ?? cloud.completedScore,
      };
    }
    return loc.date >= cloud.date ? loc : cloud;
  };

  const processed = new Set([
    ...(local.processedActivityIds ?? []),
    ...mergedXpEvents
      .map((e) => e.eventKey)
      .filter((k) => /^(training|match|daily_challenge)_/.test(k) && !k.includes('_bonus')),
  ]);

  const next: DevelopmentState = {
    ...createDefaultState(),
    ...local,
    totalXp,
    playerLevel: calculatePlayerLevel(totalXp),
    level: calculateLevel(totalXp),
    xpEvents: mergedXpEvents.slice(0, 300),
    achievements: [...achMap.values()],
    decisionEvents: Array.isArray(data.decision_events)
      ? (data.decision_events.length >= local.decisionEvents.length
          ? data.decision_events
          : local.decisionEvents)
      : local.decisionEvents,
    dailyChallenge: mergeDaily(data.daily_challenge ?? null, local.dailyChallenge),
    dailyChallengesByPosition: {
      ...((data.daily_challenges_by_position as DevelopmentState['dailyChallengesByPosition']) ?? {}),
      ...(local.dailyChallengesByPosition ?? {}),
    },
    weeklyProgram: data.weekly_program ?? local.weeklyProgram,
    weeklyProgramsByPosition: {
      ...((data.weekly_programs_by_position as DevelopmentState['weeklyProgramsByPosition']) ?? {}),
      ...(local.weeklyProgramsByPosition ?? {}),
    },
    dailyGoals: data.daily_goals ?? local.dailyGoals,
    weeklyGoals: data.weekly_goals ?? local.weeklyGoals,
    activeProgram: data.active_program ?? local.activeProgram,
    completedPrograms: Array.isArray(data.completed_programs)
      ? data.completed_programs.filter((p: any) => p?.completed || p?.status === 'completed')
      : local.completedPrograms ?? [],
    pausedPrograms: [
      ...(local.pausedPrograms ?? []),
      ...(Array.isArray(data.completed_programs)
        ? data.completed_programs.filter((p: any) => p && !p.completed && p.status === 'paused')
        : []),
    ],
    processedActivityIds: [...processed].slice(0, 400),
    statistics: data.statistics ?? local.statistics,
    notificationPrefs: data.notification_prefs ?? local.notificationPrefs,
  };

  saveDevelopmentState(next);

  if (data.streak_snapshot && typeof data.streak_snapshot === 'object') {
    const snap = data.streak_snapshot as {
      currentStreak?: number;
      longestStreak?: number;
      lastQualifyingDate?: string | null;
      lastSessionDate?: string | null;
      sessionsThisWeek?: number;
      weekStart?: string;
    };
    const localStreak = readStorageJson(STREAK_KEY, {
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null as string | null,
      lastQualifyingDate: null as string | null,
      sessionsThisWeek: 0,
      weekStart: '',
    });
    writeStorageJson(STREAK_KEY, {
      currentStreak: Math.max(localStreak.currentStreak || 0, snap.currentStreak || 0),
      longestStreak: Math.max(localStreak.longestStreak || 0, snap.longestStreak || 0),
      lastSessionDate: snap.lastQualifyingDate ?? snap.lastSessionDate ?? localStreak.lastSessionDate,
      lastQualifyingDate:
        snap.lastQualifyingDate ?? snap.lastSessionDate ?? localStreak.lastQualifyingDate,
      sessionsThisWeek: Math.max(localStreak.sessionsThisWeek || 0, snap.sessionsThisWeek || 0),
      weekStart: snap.weekStart || localStreak.weekStart,
    });
  }

  return { error: null };
}
