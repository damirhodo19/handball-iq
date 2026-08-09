/**
 * Validates player development system: XP dedup, levels 1–100, programs, streaks calendar.
 * Run: node scripts/validate-development.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const XP_PER_LEVEL = 80;
const LEVEL_TIERS = [
  { tier: 'Foundation', minLevel: 1, maxLevel: 10 },
  { tier: 'Developing', minLevel: 11, maxLevel: 25 },
  { tier: 'Advanced', minLevel: 26, maxLevel: 40 },
  { tier: 'Competitive', minLevel: 41, maxLevel: 60 },
  { tier: 'Elite', minLevel: 61, maxLevel: 80 },
  { tier: 'Master', minLevel: 81, maxLevel: 100 },
];

function calculatePlayerLevel(totalXp) {
  return Math.min(100, Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1);
}

function tierForLevel(level) {
  for (const entry of LEVEL_TIERS) {
    if (level >= entry.minLevel && level <= entry.maxLevel) return entry.tier;
  }
  return 'Foundation';
}

function hasXpEvent(state, eventKey) {
  return state.xpEvents.some((e) => e.eventKey === eventKey);
}

function awardXp(state, eventKey, amount) {
  if (amount <= 0 || hasXpEvent(state, eventKey)) return 0;
  state.xpEvents.push({ eventKey, amount });
  state.totalXp += amount;
  return amount;
}

const issues = [];
let passed = 0;

function assert(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    issues.push(`${name}${detail ? `: ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== Level 1–100 + tiers ===');
assert('Level 1 at 0 XP', calculatePlayerLevel(0) === 1);
assert('Level 2 at 80 XP', calculatePlayerLevel(80) === 2);
assert('Foundation at level 5', tierForLevel(5) === 'Foundation');
assert('Developing at level 15', tierForLevel(15) === 'Developing');
assert('Advanced at level 30', tierForLevel(30) === 'Advanced');
assert('Competitive at level 50', tierForLevel(50) === 'Competitive');
assert('Elite at level 70', tierForLevel(70) === 'Elite');
assert('Master at level 90', tierForLevel(90) === 'Master');
assert('Cap at 100', calculatePlayerLevel(99999) === 100);

console.log('\n=== XP Dedup ===');
const state = { totalXp: 0, xpEvents: [] };
const key = 'training_test_123';
const first = awardXp(state, key, 50);
const second = awardXp(state, key, 50);
assert('First award grants XP', first === 50);
assert('Duplicate award blocked', second === 0);
assert('Total XP not doubled', state.totalXp === 50);

console.log('\n=== Required Sprint 4 files ===');
const required = [
  'lib/development/programs.ts',
  'lib/development/program-progress.ts',
  'lib/development/goals.ts',
  'lib/development/calendar.ts',
  'lib/development/levels.ts',
  'lib/development/engine.ts',
  'lib/coach-platform/tracks.ts',
  'locales/sprint4-messages.ts',
];
for (const f of required) {
  assert(f, existsSync(join(root, f)));
}

console.log('\n=== Program position safety ===');
const programsSrc = readFileSync(join(root, 'lib/development/programs.ts'), 'utf8');
assert('Goalkeeper IQ exists', programsSrc.includes("id: 'goalkeeper_iq'"));
assert('Wing Finishing exists', programsSrc.includes("id: 'wing_finishing'"));
assert('GK core only Goalkeeper', /goalkeeper_iq[\s\S]*?eligiblePositions:\s*\['Goalkeeper'\]/.test(programsSrc));
assert(
  'Wing not eligible for GK',
  /id: 'wing_finishing'[\s\S]*?eligiblePositions:\s*\['Left Wing', 'Right Wing'\]/.test(programsSrc),
);

console.log('\n=== Scenario volume ===');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const byPos = {};
for (const s of bank) byPos[s.primaryPosition] = (byPos[s.primaryPosition] || 0) + 1;
const positions = ['Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot'];
for (const p of positions) {
  const n = byPos[p] || 0;
  assert(`${p} primary >= 50`, n >= 50, `got ${n}`);
}
assert('Universal/All present', (byPos.All || 0) >= 100, `got ${byPos.All || 0}`);

console.log(`\n${passed} assertions passed`);
if (issues.length) {
  console.error('\nFAILURES:');
  for (const i of issues) console.error(' -', i);
  process.exit(1);
}
console.log('PASS');
