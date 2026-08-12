import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import {
  todayStr as localTodayStr,
  getWeekStart as localWeekStart,
  daysBetweenLocal,
} from '@/lib/development/calendar';
import {
  normalizeAttackStyleId,
  normalizeDefenseSystemId,
} from '@/lib/platform/tactical-systems';
import { reconcileActivePlayerPosition } from '@/lib/platform/active-player-position';

export interface UserProfile {
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'player' | 'coach' | 'player_coach' | 'admin' | null;
  position: string;
  secondaryPosition: string | null;
  age: string;
  ageGroup: string | null;
  club: string;
  country: string;
  dominantHand: string;
  experienceLevel: string;
  playingLevel: string | null;
  developmentGoal: string | null;
  /** Up to three player development goals. developmentGoal remains the primary legacy value. */
  developmentGoals: string[];
  coachType?: string | null;
  experienceBand?: string | null;
  favoriteDefense?: string | null;
  favoriteAttack?: string | null;
  coachDevelopmentGoal?: string | null;
  /** Up to three coach development goals. coachDevelopmentGoal remains the primary legacy value. */
  coachDevelopmentGoals: string[];
  onboardingVersion: number;
  notificationsEnabled?: boolean;
}

export interface SessionRecord {
  id: string;
  date: string;
  sessionName: string;
  /** Added in Position Engine 2.0; absent on legacy sessions. */
  position?: string;
  decisionScore: number;
  timeSpent: number;
  correctCount: number;
  totalCount: number;
  metrics: { metric: string; correct: boolean }[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  /** @deprecated Prefer lastQualifyingDate — kept for persisted data compatibility */
  lastSessionDate: string | null;
  /** Local calendar date of last qualifying development activity */
  lastQualifyingDate: string | null;
  sessionsThisWeek: number;
  weekStart: string;
}

export interface MetricHistory {
  date: string;
  /** Added in Position Engine 2.0; absent on legacy metrics. */
  position?: string;
  decisionScore: number;
  pressureControl: number;
  shooterReading: number;
  consistency: number;
}

const KEYS = {
  PROFILE: 'hbiq_profile',
  SESSIONS: 'hbiq_sessions',
  STREAK: 'hbiq_streak',
  METRICS: 'hbiq_metrics',
  SETTINGS: 'hbiq_settings',
  MATCHES: 'hbiq_matches',
};

function getItem<T>(key: string, fallback: T): T {
  return readStorageJson(key, fallback);
}

function setItem<T>(key: string, value: T): void {
  writeStorageJson(key, value);
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  firstName: '',
  lastName: '',
  role: null,
  position: '',
  secondaryPosition: null,
  age: '',
  ageGroup: null,
  club: '',
  country: '',
  dominantHand: '',
  experienceLevel: '',
  playingLevel: null,
  developmentGoal: null,
  developmentGoals: [],
  coachType: null,
  experienceBand: null,
  favoriteDefense: null,
  favoriteAttack: null,
  coachDevelopmentGoal: null,
  coachDevelopmentGoals: [],
  onboardingVersion: 0,
  notificationsEnabled: true,
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  lastQualifyingDate: null,
  sessionsThisWeek: 0,
  weekStart: localWeekStart(),
};

function getWeekStart(): string {
  return localWeekStart();
}

function todayStr(): string {
  return localTodayStr();
}

function daysBetween(a: string, b: string): number {
  return daysBetweenLocal(a, b);
}

// ---- Profile ----

export function loadProfile(): UserProfile {
  const stored = getItem<Partial<UserProfile>>(KEYS.PROFILE, {});
  const profile = { ...DEFAULT_PROFILE, ...stored };
  const goals = Array.from(new Set([
    ...(Array.isArray(stored.developmentGoals) ? stored.developmentGoals : []),
    ...(stored.developmentGoal ? [stored.developmentGoal] : []),
  ].filter((goal): goal is string => typeof goal === 'string' && goal.length > 0))).slice(0, 3);
  const coachGoals = Array.from(new Set([
    ...(Array.isArray(stored.coachDevelopmentGoals) ? stored.coachDevelopmentGoals : []),
    ...(stored.coachDevelopmentGoal ? [stored.coachDevelopmentGoal] : []),
  ].filter((goal): goal is string => typeof goal === 'string' && goal.length > 0))).slice(0, 3);
  return {
    ...profile,
    developmentGoal: goals[0] ?? null,
    developmentGoals: goals,
    coachDevelopmentGoal: coachGoals[0] ?? null,
    coachDevelopmentGoals: coachGoals,
  };
}

export function saveProfile(profile: UserProfile): void {
  const goals = Array.from(new Set([
    ...(Array.isArray(profile.developmentGoals) ? profile.developmentGoals : []),
    ...(profile.developmentGoal ? [profile.developmentGoal] : []),
  ].filter((goal): goal is string => typeof goal === 'string' && goal.length > 0))).slice(0, 3);
  const coachGoals = Array.from(new Set([
    ...(Array.isArray(profile.coachDevelopmentGoals) ? profile.coachDevelopmentGoals : []),
    ...(profile.coachDevelopmentGoal ? [profile.coachDevelopmentGoal] : []),
  ].filter((goal): goal is string => typeof goal === 'string' && goal.length > 0))).slice(0, 3);
  const next: UserProfile = {
    ...profile,
    developmentGoal: goals[0] ?? null,
    developmentGoals: goals,
    coachDevelopmentGoal: coachGoals[0] ?? null,
    coachDevelopmentGoals: coachGoals,
  };
  const defense = normalizeDefenseSystemId(next.favoriteDefense);
  if (defense) next.favoriteDefense = defense;
  const attack = normalizeAttackStyleId(next.favoriteAttack);
  if (attack) next.favoriteAttack = attack;
  setItem(KEYS.PROFILE, next);
  reconcileActivePlayerPosition(next);
}

// ---- Sessions ----

export function loadSessions(): SessionRecord[] {
  return getItem<SessionRecord[]>(KEYS.SESSIONS, []);
}

export function saveSession(record: Omit<SessionRecord, 'id'> & { id?: string }): SessionRecord {
  const sessions = loadSessions();
  const id = record.id ?? `s_${Date.now()}`;
  const existing = sessions.find((s) => s.id === id);
  if (existing) return existing;
  const { id: _ignore, ...rest } = record as SessionRecord;
  const full: SessionRecord = { ...rest, id };
  sessions.unshift(full);
  setItem(KEYS.SESSIONS, sessions);
  updateStreak();
  updateMetrics(full);
  return full;
}

// ---- Streak ----

export function loadStreak(): StreakData {
  const data = getItem<StreakData>(KEYS.STREAK, DEFAULT_STREAK);
  if (!data.lastQualifyingDate && data.lastSessionDate) {
    data.lastQualifyingDate = data.lastSessionDate;
  }
  // Break streak if a full local calendar day was missed since last load
  const today = todayStr();
  const last = data.lastQualifyingDate ?? data.lastSessionDate;
  if (last) {
    const gap = daysBetween(last, today);
    if (gap > 1 && data.currentStreak > 0) {
      data.currentStreak = 0;
      setItem(KEYS.STREAK, data);
    }
  }
  if (data.weekStart !== getWeekStart()) {
    data.sessionsThisWeek = 0;
    data.weekStart = getWeekStart();
    setItem(KEYS.STREAK, data);
  }
  return data;
}

/**
 * One qualifying development activity per local calendar day continues the streak.
 * Extra activities the same day do not increase streak again.
 */
function updateStreak(): void {
  const data = loadStreak();
  const today = todayStr();
  const last = data.lastQualifyingDate ?? data.lastSessionDate;

  if (last === today) {
    data.sessionsThisWeek += 1;
    setItem(KEYS.STREAK, data);
    return;
  }

  if (last) {
    const gap = daysBetween(last, today);
    if (gap === 1) {
      data.currentStreak += 1;
    } else if (gap > 1) {
      data.currentStreak = 1;
    } else {
      // gap <= 0 (clock skew) — keep streak, still mark today
      data.currentStreak = Math.max(1, data.currentStreak);
    }
  } else {
    data.currentStreak = 1;
  }

  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.lastQualifyingDate = today;
  data.lastSessionDate = today;
  data.sessionsThisWeek += 1;
  setItem(KEYS.STREAK, data);
}

// ---- Metrics ----

export function loadMetrics(): MetricHistory[] {
  return getItem<MetricHistory[]>(KEYS.METRICS, []);
}

function updateMetrics(session: Omit<SessionRecord, 'id'>): void {
  const metrics = loadMetrics();
  const total = session.totalCount || 1;
  const correct = session.correctCount;
  const decisionScore = session.decisionScore;

  // Count metric-specific accuracy
  let pressureCorrect = 0, pressureTotal = 0;
  let shooterCorrect = 0, shooterTotal = 0;
  for (const m of session.metrics) {
    if (m.metric === 'Pressure Control') { pressureTotal++; if (m.correct) pressureCorrect++; }
    if (m.metric === 'Reading the Shooter') { shooterTotal++; if (m.correct) shooterCorrect++; }
  }

  const pressureControl = pressureTotal > 0 ? Math.round((pressureCorrect / pressureTotal) * 100) : decisionScore;
  const shooterReading = shooterTotal > 0 ? Math.round((shooterCorrect / shooterTotal) * 100) : decisionScore;
  const consistency = Math.round((correct / total) * 100);

  metrics.unshift({
    date: session.date,
    position: session.position,
    decisionScore,
    pressureControl,
    shooterReading,
    consistency,
  });

  // Keep last 30 entries
  const trimmed = metrics.slice(0, 30);
  setItem(KEYS.METRICS, trimmed);
}

// ---- Settings ----

export interface AppSettings {
  darkMode: boolean;
  theme: 'light' | 'dark' | 'system';
  themeMigrated: boolean;
  language: 'English' | 'German' | 'Croatian';
  dailyReminder: boolean;
  /** Last selected shell for player_coach users */
  activeMode: 'player' | 'coach';
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  theme: 'light',
  themeMigrated: true,
  language: 'English',
  dailyReminder: false,
  activeMode: 'player',
};

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...getItem(KEYS.SETTINGS, DEFAULT_SETTINGS) };
}

export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// ---- Match History ----

export interface MatchReportSnapshot {
  decisionScore: number;
  pressureControl: number;
  readingAbility: number;
  consistency: number;
  matchRating: number;
  optimalCount: number;
  goodCount: number;
  riskyCount: number;
  poorCount: number;
}

export interface MatchHistoryRecord {
  id: string;
  date: string;
  /** Added in Position Engine 2.0; absent on legacy matches. */
  position?: string;
  opponent: string;
  competition: string;
  matchRating: number;
  decisionScore: number;
  pressureControl: number;
  readingAbility: number;
  consistency: number;
  /** @deprecated Legacy localized text — prefer reportSnapshot */
  summary?: string;
  /** @deprecated Legacy localized text — prefer reportSnapshot */
  finalMessage?: string;
  reportSnapshot?: MatchReportSnapshot;
  answers: any[];
}

export function loadMatchHistory(): MatchHistoryRecord[] {
  return getItem<MatchHistoryRecord[]>(KEYS.MATCHES, []);
}

export function saveMatchRecord(record: Omit<MatchHistoryRecord, 'id'> & { id?: string }): MatchHistoryRecord {
  const matches = loadMatchHistory();
  const id = record.id ?? `m_${Date.now()}`;
  const existing = matches.find((m) => m.id === id);
  if (existing) return existing;
  const { id: _ignore, ...rest } = record as MatchHistoryRecord;
  const full: MatchHistoryRecord = { ...rest, id };
  matches.unshift(full);
  setItem(KEYS.MATCHES, matches);
  // Match Simulator qualifies as a development activity for the local calendar day
  updateStreak();
  return full;
}
