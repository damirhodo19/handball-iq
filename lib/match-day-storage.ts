// ── Types ─────────────────────────────────────────────────────────────────────

export type MatchType = 'League' | 'Cup' | 'Friendly' | 'Tournament';
export type MatchLocation = 'Home' | 'Away' | 'Neutral';
export type PlayingTime = 'Starter' | 'Shared minutes' | 'Substitute';
export type PersonalGoal =
  | 'Stay patient'
  | 'Read the shooter'
  | 'Control emotions'
  | 'Improve communication'
  | 'Fast break saves'
  | 'Seven metre saves';

export interface PrepSetup {
  opponent: string;
  matchType: MatchType;
  location: MatchLocation;
  playingTime: PlayingTime;
  goals: PersonalGoal[];
}

export type PrepMode = 'complete' | 'quick';

export interface TacticalAnswer {
  scenarioIndex: number;
  chosenId: string;
  isCorrect: boolean;
}

export interface MatchDayPrep {
  id: string;
  date: string;
  mode: PrepMode;
  setup: PrepSetup;
  leaveBehinds: string | null;
  visualStep: number;
  tacticalAnswers: TacticalAnswer[];
  personalStatement: string;
  mentalReadiness: number;
  tacticalReadiness: number;
  completed: boolean;
  reflectionCompleted: boolean;
}

export interface MatchDayReflection {
  id: string;
  prepId: string;
  date: string;
  opponent: string;
  preparedFeel: number;
  resetAfterConceding: number;
  patience: number;
  difficultSituation: string;
  didWell: string;
  willImprove: string;
  summary: string;
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const KEYS = {
  PREPS: 'hbiq_match_day_preps',
  REFLECTIONS: 'hbiq_match_day_reflections',
  IN_PROGRESS: 'hbiq_match_day_in_progress',
};

function get<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
  } catch {}
  return fallback;
}

function set<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

// ── Preps ─────────────────────────────────────────────────────────────────────

export function loadPreps(): MatchDayPrep[] {
  return get<MatchDayPrep[]>(KEYS.PREPS, []);
}

export function savePrep(prep: MatchDayPrep): void {
  const all = loadPreps();
  const idx = all.findIndex((p) => p.id === prep.id);
  if (idx >= 0) {
    all[idx] = prep;
  } else {
    all.unshift(prep);
  }
  set(KEYS.PREPS, all);
}

export function createPrep(mode: PrepMode, setup: PrepSetup): MatchDayPrep {
  const prep: MatchDayPrep = {
    id: `md_${Date.now()}`,
    date: new Date().toISOString(),
    mode,
    setup,
    leaveBehinds: null,
    visualStep: 0,
    tacticalAnswers: [],
    personalStatement: "Today I will focus on the next action, not the previous result.",
    mentalReadiness: 0,
    tacticalReadiness: 0,
    completed: false,
    reflectionCompleted: false,
  };
  savePrep(prep);
  return prep;
}

export function completePrep(id: string, updates: Partial<MatchDayPrep>): void {
  const all = loadPreps();
  const idx = all.findIndex((p) => p.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates, completed: true };
    set(KEYS.PREPS, all);
  }
}

export function loadPrepById(id: string): MatchDayPrep | null {
  return loadPreps().find((p) => p.id === id) ?? null;
}

// ── In-progress state (resume support) ───────────────────────────────────────

export interface InProgressState {
  prepId: string;
  step: number;
  breathingCyclesDone: number;
}

export function saveInProgress(state: InProgressState): void {
  set(KEYS.IN_PROGRESS, state);
}

export function loadInProgress(): InProgressState | null {
  return get<InProgressState | null>(KEYS.IN_PROGRESS, null);
}

export function clearInProgress(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(KEYS.IN_PROGRESS);
    }
  } catch {}
}

// ── Reflections ───────────────────────────────────────────────────────────────

export function loadReflections(): MatchDayReflection[] {
  return get<MatchDayReflection[]>(KEYS.REFLECTIONS, []);
}

export function saveReflection(r: MatchDayReflection): void {
  const all = loadReflections();
  const idx = all.findIndex((x) => x.id === r.id);
  if (idx >= 0) {
    all[idx] = r;
  } else {
    all.unshift(r);
  }
  set(KEYS.REFLECTIONS, all);
  // Mark prep as having reflection
  const preps = loadPreps();
  const pi = preps.findIndex((p) => p.id === r.prepId);
  if (pi >= 0) {
    preps[pi].reflectionCompleted = true;
    set(KEYS.PREPS, preps);
  }
}

export function generateReflectionSummary(r: Omit<MatchDayReflection, 'id' | 'date' | 'summary'>): string {
  const avg = Math.round((r.preparedFeel + r.resetAfterConceding + r.patience) / 3);
  let quality = avg >= 8 ? 'excellent' : avg >= 6 ? 'solid' : avg >= 4 ? 'mixed' : 'challenging';
  const parts: string[] = [];

  if (r.preparedFeel >= 8) {
    parts.push('Your pre-match preparation translated into a strong feeling of readiness.');
  } else if (r.preparedFeel <= 4) {
    parts.push('Your preparation routine may need more time or focus before the next match.');
  }

  if (r.resetAfterConceding >= 8) {
    parts.push('You showed excellent resilience after conceding — staying focused is a key goalkeeper strength.');
  } else if (r.resetAfterConceding <= 4) {
    parts.push('Work on your reset routine: take one breath, communicate with your defence, and reset your attention.');
  }

  if (r.patience >= 8) {
    parts.push('Your patience before committing was a clear strength today.');
  } else if (r.patience <= 4) {
    parts.push(`Difficult situations like ${r.difficultSituation.toLowerCase()} exposed some early commitment — keep reading before moving.`);
  }

  if (parts.length === 0) {
    parts.push(`Overall a ${quality} performance. Every match is information for the next one.`);
  }

  return parts.join(' ');
}

// ── Readiness calculation ─────────────────────────────────────────────────────

export function calculateReadiness(prep: Partial<MatchDayPrep>): { mental: number; tactical: number } {
  const isQuick = prep.mode === 'quick';

  // Mental: breathing done + leave-behind selected + visualization done
  let mentalScore = 0;
  if (prep.leaveBehinds) mentalScore += 40;
  if (!isQuick && (prep.visualStep ?? 0) >= 2) mentalScore += 35;
  if (isQuick && (prep.visualStep ?? 0) >= 0) mentalScore += 25;
  if (prep.personalStatement && prep.personalStatement.trim().length > 10) mentalScore += 25;

  // Tactical: correct answers / total scenarios
  const answers = prep.tacticalAnswers ?? [];
  const total = isQuick ? 3 : 5;
  const correct = answers.filter((a) => a.isCorrect).length;
  const tacticalScore = answers.length > 0
    ? Math.round(50 + (correct / total) * 50)
    : 50;

  return {
    mental: Math.min(98, Math.max(40, mentalScore)),
    tactical: Math.min(98, tacticalScore),
  };
}
