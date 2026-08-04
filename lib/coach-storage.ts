// ── AI Coach Storage: Goals + Seen Messages ──────────────────────────────────

export interface CoachGoal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  startValue: number;
  createdAt: string;
  completed: boolean;
}

const KEYS = {
  GOALS: 'hbiq_coach_goals',
  SEEN_MESSAGES: 'hbiq_coach_seen_messages',
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

// ── Goals ────────────────────────────────────────────────────────────────────

export function loadGoals(): CoachGoal[] {
  return get<CoachGoal[]>(KEYS.GOALS, []);
}

export function saveGoal(goal: CoachGoal): void {
  const goals = loadGoals();
  const idx = goals.findIndex((g) => g.id === goal.id);
  if (idx >= 0) {
    goals[idx] = goal;
  } else {
    goals.unshift(goal);
  }
  set(KEYS.GOALS, goals);
}

export function deleteGoal(id: string): void {
  const goals = loadGoals().filter((g) => g.id !== id);
  set(KEYS.GOALS, goals);
}

export function createGoal(title: string, category: string, targetValue: number, startValue: number): CoachGoal {
  const goal: CoachGoal = {
    id: `goal_${Date.now()}`,
    title,
    category,
    targetValue,
    startValue,
    createdAt: new Date().toISOString(),
    completed: false,
  };
  saveGoal(goal);
  return goal;
}

// ── Goal Templates ─────────────────────────────────────────────────────────────

export interface GoalTemplate {
  title: string;
  category: string;
  description: string;
  targetValue: number;
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  { title: 'Increase Decision Score to 85%', category: 'decisionMaking', description: 'Raise your overall decision making score to 85 or above.', targetValue: 85 },
  { title: 'Improve Fast Break Performance', category: 'fastBreak', description: 'Boost your fast break save performance by 15 points.', targetValue: 75 },
  { title: 'Reduce Early Movement', category: 'patience', description: 'Improve your patience score to reduce committing before the release.', targetValue: 80 },
  { title: 'Improve Mental Readiness', category: 'mentalPreparation', description: 'Complete pre-match preparation consistently to raise mental readiness.', targetValue: 80 },
  { title: 'Strengthen Pressure Handling', category: 'pressureHandling', description: 'Improve performance under pressure in critical situations.', targetValue: 78 },
  { title: 'Improve Shooter Reading', category: 'readingShooter', description: 'Better recognize body position and release cues.', targetValue: 82 },
  { title: 'Improve 7m Performance', category: 'sevenMetre', description: 'Stay central and react on seven-metre throws.', targetValue: 75 },
  { title: 'Improve Consistency', category: 'consistency', description: 'Reduce performance swings between sessions.', targetValue: 80 },
];
