import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const positions = [
  'Goalkeeper',
  'Left Wing',
  'Right Wing',
  'Left Back',
  'Centre Back',
  'Right Back',
  'Pivot',
];

const rawBank = JSON.parse(readFileSync(resolve(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const scenarios = Array.isArray(rawBank) ? rawBank : rawBank.scenarios ?? [];
const failures = [];

function compatible(scenario, position) {
  return scenario.primaryPosition === position ||
    scenario.primaryPosition === 'All' ||
    (scenario.secondaryPositions ?? []).includes(position);
}

console.log('\n=== Position Engine 2.0 — every two-position combination ===');
for (const primary of positions) {
  for (const secondary of positions) {
    if (secondary === primary) continue;
    for (const active of [primary, secondary]) {
      const pool = scenarios.filter((scenario) => compatible(scenario, active));
      const goalkeeperLeak = active !== 'Goalkeeper' &&
        pool.some((scenario) => scenario.primaryPosition === 'Goalkeeper');
      if (pool.length < 5) {
        failures.push(`${primary} + ${secondary}: ${active} has only ${pool.length} compatible scenarios`);
      }
      if (goalkeeperLeak) {
        failures.push(`${primary} + ${secondary}: ${active} contains a Goalkeeper primary`);
      }
    }
  }
}
console.log(`  checked ${positions.length * (positions.length - 1)} ordered profile combinations`);

const sourceChecks = [
  ['training forwards active position', 'app/(tabs)/training.tsx', 'position: position ?? undefined'],
  ['session snapshots selected position', 'context/SessionContext.tsx', 'intent?.position'],
  ['training result stores position', 'app/session/results.tsx', 'position: position ?? undefined'],
  ['match simulator resolves active position', 'context/MatchContext.tsx', 'resolveActivePlayerPosition'],
  ['match result stores position', 'app/match/report.tsx', 'position: position ?? undefined'],
  ['daily challenges are split by position', 'lib/development/daily-challenge.ts', 'dailyChallengesByPosition'],
  ['weekly plans are split by position', 'lib/development/weekly-program.ts', 'weeklyProgramsByPosition'],
  ['recommendation statistics are position scoped', 'lib/platform/content-resolver.ts', 'positionEvents'],
  ['cloud preference stores active position', 'services/preferencesService.ts', 'active_player_position'],
];

console.log('\n=== Cross-module active-position flow ===');
for (const [label, file, needle] of sourceChecks) {
  const source = readFileSync(resolve(root, file), 'utf8');
  const ok = source.includes(needle);
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(`${label}: missing ${needle} in ${file}`);
}

if (failures.length > 0) {
  console.error('\nFAIL');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('\nPASS');

