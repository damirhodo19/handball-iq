import type { BankScenario } from '@/content/scenario-bank/types';
import type { HandballPosition } from '@/lib/positions';
import {
  getScenarioFamilyId,
  pickDiverseSessionScenarios,
} from '@/lib/platform/scenario-family';

/**
 * Semantic content fingerprint — same scenario family collapses
 * (title archetype variants with different minutes/IDs).
 */
export function scenarioContentKey(scenario: BankScenario): string {
  return getScenarioFamilyId(scenario);
}

/** Deduplicate by canonical bank id (position + universal overlap → one entry). */
export function dedupeBankScenariosById(scenarios: BankScenario[]): BankScenario[] {
  const byId = new Map<string, BankScenario>();
  for (const s of scenarios) {
    if (!s?.id || byId.has(s.id)) continue;
    byId.set(s.id, s);
  }
  return [...byId.values()];
}

/**
 * Walk a ranked pool and pick unique scenarios without semantic replacement.
 * Uniqueness: bank id AND scenarioFamilyId (+ diversity rules when position given).
 * Returns fewer than `count` when the unique family pool is smaller — callers shorten the session.
 */
export function pickUniqueScenariosWithoutReplacement(
  ranked: BankScenario[],
  count: number,
  position?: HandballPosition,
): BankScenario[] {
  if (position) {
    return pickDiverseSessionScenarios(ranked, count, position);
  }

  // No position context: still enforce family uniqueness (no consecutive formation+decision)
  const seenIds = new Set<string>();
  const seenFamilies = new Set<string>();
  const picked: BankScenario[] = [];

  for (const s of dedupeBankScenariosById(ranked)) {
    if (seenIds.has(s.id)) continue;
    const family = getScenarioFamilyId(s);
    if (seenFamilies.has(family)) continue;
    seenIds.add(s.id);
    seenFamilies.add(family);
    picked.push(s);
    if (picked.length >= count) break;
  }

  return picked;
}

/** Deduplicate an ordered id list (intent / daily challenge) preserving order. */
export function dedupeIdsPreserveOrder(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export { getScenarioFamilyId, pickDiverseSessionScenarios };
