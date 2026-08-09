#!/usr/bin/env node
/**
 * Validates canonical defence/attack IDs, legacy migration, and EN/HR/DE labels.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tactical = readFileSync(join(root, 'lib/platform/tactical-systems.ts'), 'utf8');
const sprint1 = readFileSync(join(root, 'locales/sprint1-messages.ts'), 'utf8');

const DEFENSE = [
  'def_6_0', 'def_5_1', 'def_3_2_1', 'def_3_3', 'def_4_2',
  'def_5_plus_1', 'def_4_plus_2', 'def_man_to_man', 'def_1_5',
  'def_open', 'def_double_mark', 'none',
];
const ATTACK = [
  'att_structured', 'att_fast_break', 'att_second_wave', 'att_quick_centre',
  'att_crossing', 'att_parallel', 'att_second_pivot', 'att_7v6',
  'att_empty_goal', 'att_two_pivot', 'att_wing_overload', 'att_backcourt_shooting',
  'att_isolation', 'att_pivot_cooperation', 'att_numerical_superiority', 'none',
];

const LEGACY = [
  ['6:0', 'def_6_0'],
  ['5:1', 'def_5_1'],
  ['3:2:1', 'def_3_2_1'],
  ['Mixed', 'def_4_plus_2'],
  ['Fast Break', 'att_fast_break'],
  ['Structured Attack', 'att_structured'],
  ['Second Pivot', 'att_second_pivot'],
  ['Crossing', 'att_crossing'],
];

let failed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    failed++;
  } else {
    console.log('OK  ', msg);
  }
}

for (const id of DEFENSE) {
  ok(tactical.includes(`'${id}'`), `defense id listed: ${id}`);
  if (id !== 'none') {
    ok(sprint1.includes(`'defense.${id}'`), `EN/HR/DE key present for defense.${id}`);
  } else {
    ok(sprint1.includes("'defense.none'"), 'defense.none key present');
  }
}
for (const id of ATTACK) {
  ok(tactical.includes(`'${id}'`), `attack id listed: ${id}`);
  if (id !== 'none') {
    ok(sprint1.includes(`'attack.${id}'`), `EN/HR/DE key present for attack.${id}`);
  } else {
    ok(sprint1.includes("'attack.none'"), 'attack.none key present');
  }
}

// Count label occurrences (en/hr/de blocks) — each key should appear 3 times
for (const id of DEFENSE) {
  const key = id === 'none' ? 'defense.none' : `defense.${id}`;
  const n = (sprint1.match(new RegExp(`'${key.replace('.', '\\.')}'`, 'g')) || []).length;
  ok(n >= 3, `${key} localized in ≥3 locale blocks (found ${n})`);
}
for (const id of ATTACK) {
  const key = id === 'none' ? 'attack.none' : `attack.${id}`;
  const n = (sprint1.match(new RegExp(`'${key.replace('.', '\\.')}'`, 'g')) || []).length;
  ok(n >= 3, `${key} localized in ≥3 locale blocks (found ${n})`);
}

for (const [legacy, canonical] of LEGACY) {
  ok(
    tactical.includes(`'${legacy}': '${canonical}'`) || tactical.includes(`${legacy}: '${canonical}'`),
    `legacy map ${legacy} → ${canonical}`,
  );
}

ok(tactical.includes('scoreTextForTacticalPrefs'), 'personalization bias helper present');
ok(tactical.includes('tacticalPreferenceKeywords'), 'keyword helper present');

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log('\nPASS');
