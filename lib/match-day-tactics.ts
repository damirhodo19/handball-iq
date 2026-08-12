/**
 * Match Day tactics + plan generation (position-aware).
 * Never falls back to Goalkeeper content for field players.
 */
import type { BankScenario } from '@/content/scenario-bank/types';
import type { HandballPosition } from '@/lib/positions';
import {
  getMatchDayReminders,
  getPositionConfig,
} from '@/lib/positions';
import {
  getAllScenarios,
  getPositionTacticalFallback,
  getTacticalScenariosForGoal,
  toTacticalScenario,
} from '@/lib/scenario-bank';
import { isScenarioForPosition, isUniversalPrimary } from '@/lib/platform/scenario-position';
import type { PersonalGoal, PrepSetup } from '@/lib/match-day-storage';
import {
  attackEngineHint,
  defenseEngineHint,
  normalizeAttackStyleId,
  normalizeDefenseSystemId,
  scoreTextForTacticalPrefs,
} from '@/lib/platform/tactical-systems';

/** Shared tactical scenario shape for Match Day (kept here to avoid circular imports). */
export interface TacticalScenario {
  id: string;
  description: string;
  description_hr?: string;
  description_de?: string;
  decisions: { id: string; text: string; text_hr?: string; text_de?: string }[];
  correctId: string;
  explanation: string;
  explanation_hr?: string;
  explanation_de?: string;
  type: string;
  type_hr?: string;
  type_de?: string;
}

export interface MatchDayTacticsInput {
  position: HandballPosition;
  goals: PersonalGoal[];
  count: number;
  developmentGoal?: string | string[] | null;
  playingLevel?: string | null;
  dominantHand?: string | null;
  opponent?: string | null;
  /** Optional weakness / skill focus labels */
  weakSkills?: string[];
  /** Optional coach/player tactical prefs — soft bias only */
  favoriteDefense?: string | null;
  favoriteAttack?: string | null;
}

export interface MatchPlan {
  opponent: string;
  matchType: string;
  location: string;
  playingTime: string;
  goals: string[];
  position: HandballPosition;
  reminders: string[];
  focusPoints: string[];
  preMatchChecklist: string[];
  personalStatementDefault: string;
}

function logStage(
  stage: string,
  payload: Record<string, unknown>,
): void {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log(`[match-day] ${stage}`, payload);
  }
}

function positionPool(position: HandballPosition): BankScenario[] {
  return getAllScenarios().filter((s) => {
    if (!isScenarioForPosition(s, position)) return false;
    if (position !== 'Goalkeeper' && s.primaryPosition === 'Goalkeeper') return false;
    return true;
  });
}

/**
 * Build tactical scenarios for Match Day.
 * Guarantees a non-empty result when position is valid and the bank has position content.
 */
export function buildMatchDayTactics(input: MatchDayTacticsInput): TacticalScenario[] {
  const { position, goals, count } = input;
  logStage('tactics.input', {
    position,
    goals,
    count,
    developmentGoal: input.developmentGoal ?? null,
    playingLevel: input.playingLevel ?? null,
    dominantHand: input.dominantHand ?? null,
    opponent: input.opponent ?? null,
    weakSkills: input.weakSkills ?? [],
  });

  if (!position || count <= 0) {
    logStage('tactics.output', { n: 0, reason: 'missing-position-or-count' });
    return [];
  }

  const selectedGoals = goals.length > 0 ? goals : ['Decision Making'];
  const pool: TacticalScenario[] = [];
  const seen = new Set<string>();

  const pushUnique = (rows: TacticalScenario[]) => {
    for (const s of rows) {
      if (!s?.id || seen.has(s.id)) continue;
      // Hard guard: never leak GK primaries into field sessions
      if (position !== 'Goalkeeper' && /goalkeeper/i.test(s.type ?? '')) {
        // type title may mention GK reading for wings — allow; bank id check below
      }
      seen.add(s.id);
      pool.push(s);
      if (pool.length >= count) return true;
    }
    return pool.length >= count;
  };

  // Tactical preference soft boost first (bias — still fill with other systems after)
  if (
    (input.favoriteDefense && input.favoriteDefense !== 'none') ||
    (input.favoriteAttack && input.favoriteAttack !== 'none')
  ) {
    const boosted = positionPool(position)
      .map((s) => ({
        s,
        score:
          scoreTextForTacticalPrefs(
            `${s.title.en} ${s.situation.en} ${s.question.en} ${(s.skillTags ?? []).join(' ')}`,
            input.favoriteDefense,
            input.favoriteAttack,
          ) + s.qualityScore / 100,
      }))
      .filter((x) => x.score >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.ceil(count / 2)))
      .map((x) => toTacticalScenario(x.s));
    pushUnique(boosted);
  }

  for (const goal of selectedGoals) {
    if (pushUnique(getTacticalScenariosForGoal(goal, count, position))) break;
  }

  // Development goal soft boost — keyword pass over position pool
  if (pool.length < count && input.developmentGoal) {
    const keywords = String(input.developmentGoal)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3);
    const boosted = positionPool(position)
      .filter((s) =>
        keywords.some((k) =>
          `${s.title.en} ${s.situation.en} ${s.question.en}`.toLowerCase().includes(k),
        ),
      )
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, count)
      .map(toTacticalScenario);
    pushUnique(boosted);
  }

  // Weak skills soft boost
  if (pool.length < count && input.weakSkills?.length) {
    const weak = input.weakSkills.map((w) => w.toLowerCase());
    const boosted = positionPool(position)
      .filter((s) =>
        (s.skillTags ?? []).some((tag) => weak.some((w) => tag.toLowerCase().includes(w))) ||
        weak.some((w) => `${s.title.en}`.toLowerCase().includes(w)),
      )
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, count)
      .map(toTacticalScenario);
    pushUnique(boosted);
  }

  if (pool.length < count) {
    pushUnique(getPositionTacticalFallback(position, count * 2));
  }

  // Absolute last resort: any position-compatible non-GK rows
  if (pool.length < count) {
    const raw = positionPool(position)
      .filter((s) => s.primaryPosition === position || isUniversalPrimary(s.primaryPosition))
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .map(toTacticalScenario);
    pushUnique(raw);
  }

  // Rotate for variety
  const offset = selectedGoals.join('|').length % Math.max(1, pool.length);
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, count);

  const gkLeak =
    position !== 'Goalkeeper' &&
    rotated.some((s) => {
      const bank = getAllScenarios().find((b) => b.id === s.id);
      return bank?.primaryPosition === 'Goalkeeper';
    });

  if (gkLeak) {
    logStage('tactics.gk-leak-blocked', { ids: rotated.map((s) => s.id) });
    const safe = rotated.filter((s) => {
      const bank = getAllScenarios().find((b) => b.id === s.id);
      return bank?.primaryPosition !== 'Goalkeeper';
    });
    const filled = [
      ...safe,
      ...getPositionTacticalFallback(position, count).filter((s) => !safe.some((x) => x.id === s.id)),
    ].slice(0, count);
    logStage('tactics.output', {
      n: filled.length,
      ids: filled.map((s) => s.id),
      types: filled.map((s) => s.type),
    });
    return filled;
  }

  logStage('tactics.output', {
    n: rotated.length,
    ids: rotated.map((s) => s.id),
    types: rotated.map((s) => s.type),
  });
  return rotated;
}

/** Build a concrete Match Plan from setup + position (always non-empty for valid position). */
export function buildMatchPlan(
  setup: PrepSetup,
  position: HandballPosition,
  tacticalPrefs?: { favoriteDefense?: string | null; favoriteAttack?: string | null },
): MatchPlan {
  const cfg = getPositionConfig(position);
  const reminders = [...getMatchDayReminders(position)];
  const focusPoints =
    setup.goals.length > 0
      ? setup.goals.map((g) => `Focus: ${g}`)
      : (cfg?.trainingPlanFocus ?? []).slice(0, 3);

  const defenseId = normalizeDefenseSystemId(tacticalPrefs?.favoriteDefense);
  const attackId = normalizeAttackStyleId(tacticalPrefs?.favoriteAttack);
  if (defenseId && defenseId !== 'none') {
    reminders.unshift(`Read opponent shape vs ${defenseEngineHint(defenseId)}.`);
  }
  if (attackId && attackId !== 'none') {
    focusPoints.unshift(`Attack theme: ${attackEngineHint(attackId)}`);
  }

  const preMatchChecklist = [
    `Confirm role: ${setup.playingTime}`,
    `Opponent: ${setup.opponent || 'TBD'} (${setup.matchType}, ${setup.location})`,
    ...reminders.slice(0, 3),
  ];

  const plan: MatchPlan = {
    opponent: setup.opponent,
    matchType: setup.matchType,
    location: setup.location,
    playingTime: setup.playingTime,
    goals: [...setup.goals],
    position,
    reminders: reminders.length > 0 ? reminders : [
      'Scan before you receive.',
      'Commit to the highest-percentage action.',
      'Reset immediately after every possession.',
    ],
    focusPoints: focusPoints.length > 0 ? focusPoints : ['Stay present on the next action'],
    preMatchChecklist,
    personalStatementDefault:
      'Today I will focus on the next action, not the previous result.',
  };

  logStage('plan.output', {
    position: plan.position,
    goals: plan.goals,
    reminders: plan.reminders.length,
    focusPoints: plan.focusPoints.length,
  });

  return plan;
}
