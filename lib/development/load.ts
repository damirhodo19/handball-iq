import { loadSessions, loadMatchHistory, loadStreak } from '@/lib/storage';
import { getWeekStart, todayStr, daysBetweenLocal } from './calendar';

export type LoadLevel = 'low' | 'normal' | 'high';
export type RecommendedSessionLength = 'short_review' | 'standard';

export interface DevelopmentLoad {
  loadLevel: LoadLevel;
  recommendedSessionLength: RecommendedSessionLength;
  sessionsThisWeek: number;
  matchSimulationsThisWeek: number;
  estimatedMinutesThisWeek: number;
  streak: number;
  recentActivityDays: number;
  /** Suggested scenario count for the next session */
  scenarioCount: number;
  labelKey: string;
}

const EST_MIN_PER_SESSION = 12;
const EST_MIN_PER_MATCH = 18;

/**
 * Soft development-load signal for recommendation length only.
 * UI copy must stay about session length — never health advice.
 */
export function computeDevelopmentLoad(streakOverride?: number): DevelopmentLoad {
  const weekStart = getWeekStart();
  const today = todayStr();
  const sessions = loadSessions();
  const matches = loadMatchHistory();
  const sessionsThisWeek = sessions.filter((s) => {
    const d = (s.date || '').slice(0, 10);
    return d >= weekStart && d <= today;
  }).length;

  const matchSimulationsThisWeek = matches.filter((m) => {
    const d = (m.date || '').slice(0, 10);
    return d >= weekStart && d <= today;
  }).length;

  const estimatedMinutesThisWeek =
    sessionsThisWeek * EST_MIN_PER_SESSION + matchSimulationsThisWeek * EST_MIN_PER_MATCH;

  // Activity density: distinct days with activity in last 3 calendar days
  const recentDates = new Set<string>();
  for (const s of sessions) {
    const d = (s.date || '').slice(0, 10);
    if (d && daysBetweenLocal(d, today) <= 2 && daysBetweenLocal(d, today) >= 0) recentDates.add(d);
  }
  for (const m of matches) {
    const d = (m.date || '').slice(0, 10);
    if (d && daysBetweenLocal(d, today) <= 2 && daysBetweenLocal(d, today) >= 0) recentDates.add(d);
  }
  const recentActivityDays = recentDates.size;

  const streak = streakOverride ?? loadStreak().currentStreak;

  let loadLevel: LoadLevel = 'normal';
  if (sessionsThisWeek + matchSimulationsThisWeek >= 6 || estimatedMinutesThisWeek >= 70 || recentActivityDays >= 3) {
    loadLevel = 'high';
  } else if (sessionsThisWeek + matchSimulationsThisWeek <= 1 && recentActivityDays === 0) {
    loadLevel = 'low';
  }

  const recommendedSessionLength: RecommendedSessionLength =
    loadLevel === 'high' ? 'short_review' : 'standard';
  const scenarioCount = recommendedSessionLength === 'short_review' ? 4 : 8;

  return {
    loadLevel,
    recommendedSessionLength,
    sessionsThisWeek,
    matchSimulationsThisWeek,
    estimatedMinutesThisWeek,
    streak,
    recentActivityDays,
    scenarioCount,
    labelKey:
      recommendedSessionLength === 'short_review'
        ? 'sprint5.load.shortReview'
        : 'sprint5.load.standardSession',
  };
}

/** Stable focus signature used to avoid repetitive daily recommendation loops. */
export function buildFocusSignature(parts: {
  position: string;
  programWeek?: number | null;
  weakSkill?: string | null;
  loadLevel?: LoadLevel;
  difficulty?: string | null;
}): string {
  return [
    parts.position || 'none',
    `w${parts.programWeek ?? 0}`,
    parts.weakSkill || 'none',
    parts.loadLevel || 'normal',
    parts.difficulty || 'any',
  ].join('|');
}

export function shouldAvoidSignature(history: string[] | undefined, signature: string): boolean {
  if (!history?.length) return false;
  // Avoid if the exact signature appeared in the last 3 days of history
  return history.slice(0, 3).includes(signature);
}
