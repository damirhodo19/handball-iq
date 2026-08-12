import type { HandballPosition } from '@/lib/positions';
import { getAllScenarios, getScenariosByPosition, toGKScenario } from '@/lib/scenario-bank';
import { isScenarioForPosition, isUniversalPrimary } from '@/lib/platform/scenario-position';
import { pickUniqueScenariosWithoutReplacement } from '@/lib/platform/unique-scenarios';
import type { GKScenario } from '@/lib/scenarios';
import type { DailyChallenge, DevelopmentState } from './types';
import { detectWeaknesses } from './weakness';
import { loadDevelopmentState, saveDevelopmentState, todayStr } from './storage';

function hashDate(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) >>> 0;
  return h;
}

function pickDifficulty(state: DevelopmentState): string {
  const acc = state.statistics.decisionAccuracy;
  if (acc >= 85) return 'Expert';
  if (acc >= 75) return 'Advanced';
  if (acc >= 60) return 'Intermediate';
  return 'Beginner';
}

function getWeakFocus(state: DevelopmentState, position: HandballPosition): string {
  const weaknesses = detectWeaknesses(state.statistics, state.decisionEvents);
  // Prefer skill label for UI focus; fall back to category
  if (weaknesses.weakSkills[0]) return weaknesses.weakSkills[0].name;
  if (weaknesses.weakCategories[0]) return weaknesses.weakCategories[0].name;
  const positionScenarios = getScenariosByPosition(position);
  const categories = [...new Set(positionScenarios.map((s) => s.category))];
  const dayIdx = new Date().getDay();
  const history = state.recommendationHistory ?? [];
  // Rotate category when recent history is sticky
  const idx = (dayIdx + history.length) % Math.max(1, categories.length);
  return categories[idx] ?? 'Decision Making';
}

export function generateDailyChallenge(
  position: HandballPosition,
  state: DevelopmentState = loadDevelopmentState(),
): DailyChallenge {
  const date = todayStr();
  const seed = hashDate(date + position);
  const focusCategory = getWeakFocus(state, position);
  const difficulty = pickDifficulty(state);

  let pool = getAllScenarios().filter((s) => {
    if (!isScenarioForPosition(s, position)) return false;
    const matchesFocus =
      s.category === focusCategory ||
      s.primaryPosition === position ||
      isUniversalPrimary(s.primaryPosition);
    const matchesDiff = s.difficulty === difficulty || s.difficulty === 'Intermediate';
    return matchesFocus && matchesDiff;
  });

  if (pool.length < 5) pool = getScenariosByPosition(position);
  // Universal player content only — never the full bank / Goalkeeper pool
  if (pool.length < 5) {
    const universalOnly = getAllScenarios().filter(
      (s) => isUniversalPrimary(s.primaryPosition) && isScenarioForPosition(s, position),
    );
    pool = universalOnly;
  }

  const shuffled = [...pool].sort((a, b) => {
    const ha = hashDate(a.id + String(seed));
    const hb = hashDate(b.id + String(seed));
    return ha - hb;
  });

  // Without replacement — unique scenarioFamilyId + diversity rules
  const selected = pickUniqueScenariosWithoutReplacement(shuffled, 5, position);
  const targetScore = difficulty === 'Expert' ? 90 : difficulty === 'Advanced' ? 80 : difficulty === 'Intermediate' ? 70 : 60;

  return {
    position,
    date,
    scenarioIds: selected.map((s) => s.id),
    // Language-neutral focus label; UI translates via home.dailyChallengeTitle
    title: focusCategory,
    focusCategory,
    difficulty,
    targetScore,
    completed: false,
    xpAwarded: false,
  };
}

export function getOrCreateDailyChallenge(
  position: HandballPosition,
  inputState?: DevelopmentState,
): DailyChallenge {
  const state = inputState ?? loadDevelopmentState();
  const today = todayStr();
  const byPosition = state.dailyChallengesByPosition ?? {};
  const savedForPosition = byPosition[position];
  if (savedForPosition?.date === today) {
    state.dailyChallenge = savedForPosition;
    state.dailyChallengesByPosition = byPosition;
    if (!inputState) saveDevelopmentState(state);
    return savedForPosition;
  }
  if (
    state.dailyChallenge?.date === today &&
    (!state.dailyChallenge.position || state.dailyChallenge.position === position)
  ) {
    // Stale IDs (e.g. removed legacy LW) must not lock the day to an empty pool.
    const resolved = getDailyChallengeScenarios(state.dailyChallenge, position);
    if (resolved.length >= 3) {
      const migrated = { ...state.dailyChallenge, position };
      state.dailyChallenge = migrated;
      state.dailyChallengesByPosition = { ...byPosition, [position]: migrated };
      if (!inputState) saveDevelopmentState(state);
      return migrated;
    }
  }
  const challenge = generateDailyChallenge(position, state);
  state.dailyChallenge = challenge;
  state.dailyChallengesByPosition = { ...byPosition, [position]: challenge };
  if (!inputState) saveDevelopmentState(state);
  return challenge;
}

export function getDailyChallengeScenarios(
  challenge: DailyChallenge,
  position?: import('@/lib/positions').HandballPosition | null,
): GKScenario[] {
  const all = getAllScenarios();
  const map = new Map(all.map((s) => [s.id, s]));
  return challenge.scenarioIds
    .map((id, i) => {
      const s = map.get(id);
      return s ? toGKScenario(s, i + 1, position) : null;
    })
    .filter((s): s is GKScenario => s !== null);
}

export function markDailyChallengeComplete(score: number): void {
  const state = loadDevelopmentState();
  if (!state.dailyChallenge) return;
  state.dailyChallenge.completed = true;
  state.dailyChallenge.completedScore = score;
  if (state.dailyChallenge.position) {
    state.dailyChallengesByPosition = {
      ...(state.dailyChallengesByPosition ?? {}),
      [state.dailyChallenge.position]: state.dailyChallenge,
    };
  }
  saveDevelopmentState(state);
}
