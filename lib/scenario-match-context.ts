import type { GKScenario } from '@/lib/scenarios';

// These reviewed situations describe the first attack after regulation ends.
const EXTRA_TIME_START_IDS = new Set([
  'scn_bank_553', 'scn_bank_563', 'scn_bank_573',
  'scn_bank_583', 'scn_bank_593', 'scn_bank_603',
]);

export function resolveScenarioMatchContext(
  scenario: Pick<GKScenario, 'bankId' | 'half' | 'time'>,
): Pick<GKScenario, 'half' | 'time'> {
  if (scenario.bankId === 'scn_bank_1108') {
    return { half: 'Shootout', time: 'No match clock' };
  }
  return scenario.bankId && EXTRA_TIME_START_IDS.has(scenario.bankId)
    ? { half: 'Extra Time', time: 'Start of extra time' }
    : { half: scenario.half, time: scenario.time };
}
