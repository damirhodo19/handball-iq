export interface UserProfile {
  name: string;
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
}

export interface SessionRecord {
  id: string;
  date: string;
  sessionName: string;
  decisionScore: number;
  timeSpent: number;
  correctCount: number;
  totalCount: number;
  metrics: { metric: string; correct: boolean }[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  sessionsThisWeek: number;
  weekStart: string;
}

export interface MetricHistory {
  date: string;
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
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
  } catch {}
  return fallback;
}

function setItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Damir',
  position: 'Goalkeeper',
  secondaryPosition: null,
  age: '',
  ageGroup: null,
  club: '',
  country: '',
  dominantHand: 'Right',
  experienceLevel: 'Amateur',
  playingLevel: null,
  developmentGoal: null,
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  sessionsThisWeek: 0,
  weekStart: getWeekStart(),
};

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

// ---- Profile ----

export function loadProfile(): UserProfile {
  return getItem(KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile: UserProfile): void {
  setItem(KEYS.PROFILE, profile);
}

// ---- Sessions ----

export function loadSessions(): SessionRecord[] {
  return getItem<SessionRecord[]>(KEYS.SESSIONS, []);
}

export function saveSession(record: Omit<SessionRecord, 'id'>): SessionRecord {
  const sessions = loadSessions();
  const full: SessionRecord = { ...record, id: `s_${Date.now()}` };
  sessions.unshift(full);
  setItem(KEYS.SESSIONS, sessions);
  updateStreak();
  updateMetrics(record);
  return full;
}

// ---- Streak ----

export function loadStreak(): StreakData {
  const data = getItem<StreakData>(KEYS.STREAK, DEFAULT_STREAK);
  // Reset week if needed
  if (data.weekStart !== getWeekStart()) {
    data.sessionsThisWeek = 0;
    data.weekStart = getWeekStart();
    setItem(KEYS.STREAK, data);
  }
  return data;
}

function updateStreak(): void {
  const data = loadStreak();
  const today = todayStr();
  if (data.lastSessionDate === today) {
    data.sessionsThisWeek += 1;
    setItem(KEYS.STREAK, data);
    return;
  }
  if (data.lastSessionDate) {
    const gap = daysBetween(data.lastSessionDate, today);
    if (gap === 1) {
      data.currentStreak += 1;
    } else if (gap > 1) {
      data.currentStreak = 1;
    }
  } else {
    data.currentStreak = 1;
  }
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
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
  language: 'English' | 'German' | 'Croatian';
  dailyReminder: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  language: 'English',
  dailyReminder: false,
};

export function loadSettings(): AppSettings {
  return getItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// ---- Match History ----

export interface MatchHistoryRecord {
  id: string;
  date: string;
  opponent: string;
  competition: string;
  matchRating: number;
  decisionScore: number;
  pressureControl: number;
  readingAbility: number;
  consistency: number;
  summary: string;
  finalMessage: string;
  answers: any[];
}

export function loadMatchHistory(): MatchHistoryRecord[] {
  return getItem<MatchHistoryRecord[]>(KEYS.MATCHES, []);
}

export function saveMatchRecord(record: Omit<MatchHistoryRecord, 'id'>): MatchHistoryRecord {
  const matches = loadMatchHistory();
  const full: MatchHistoryRecord = { ...record, id: `m_${Date.now()}` };
  matches.unshift(full);
  setItem(KEYS.MATCHES, matches);
  return full;
}
