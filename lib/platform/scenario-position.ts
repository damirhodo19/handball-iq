import type { BankScenario } from '@/content/scenario-bank/types';
import type { HandballPosition } from '@/lib/positions';
import { ALL_POSITIONS } from '@/lib/positions';

const SPECIFIC_POSITIONS = new Set<string>(ALL_POSITIONS);

export function isUniversalPrimary(primary: string | null | undefined): boolean {
  return primary === 'All' || primary === 'Universal';
}

/**
 * Whether a bank scenario may appear in a position's training/match pool.
 *
 * Rules:
 * - Same primary position → yes
 * - All / Universal → yes when secondary is empty or lists this position
 * - Another specific primary (e.g. Goalkeeper) → never, even if secondary lists this position
 */
export function isScenarioForPosition(
  scenario: Pick<BankScenario, 'primaryPosition' | 'secondaryPositions'>,
  position: HandballPosition,
): boolean {
  const primary = String(scenario.primaryPosition);
  if (primary === position) return true;

  if (isUniversalPrimary(primary)) {
    const secondary = scenario.secondaryPositions ?? [];
    if (secondary.length === 0) return true;
    return secondary.includes(position);
  }

  // Never leak Goalkeeper (or any other specific position) via secondary tags
  if (SPECIFIC_POSITIONS.has(primary) && primary !== position) {
    return false;
  }

  return (scenario.secondaryPositions ?? []).includes(position);
}

/** Admin/cloud scenario rows use `position` instead of `primaryPosition`. */
export function isAdminScenarioForPosition(
  scenario: { position: string; secondaryPositions?: string[] },
  playerPosition: HandballPosition,
): boolean {
  return isScenarioForPosition(
    {
      primaryPosition: scenario.position as BankScenario['primaryPosition'],
      secondaryPositions: (scenario.secondaryPositions ?? []) as HandballPosition[],
    },
    playerPosition,
  );
}
