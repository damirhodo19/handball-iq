#!/usr/bin/env node
/** Validate the active Coach Gold runtime and every protected player-bank hash. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_70 } from './scenario-bank/data/coach-gold-70.mjs';
import { COACH_GOLD_CATEGORIES, COACH_GOLD_FAMILIES } from './scenario-bank/data/coach-gold-taxonomy.mjs';
import { toCoachGoldRuntimeChallenge } from './scenario-bank/coach-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const runtime = JSON.parse(readFileSync(join(root, 'lib/coach-platform/challenges-gold.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/coach-gold-runtime-lock.json'), 'utf8'));
const backup = JSON.parse(readFileSync(join(root, 'scripts/coach-legacy-cleanup-backup.json'), 'utf8'));
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperLock = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positionHash = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));
const expected = COACH_GOLD_70.map(toCoachGoldRuntimeChallenge);
const legacyIds = new Set(backup.uniqueIds);
const errors = [];
const warnings = [];

if (lock.status !== 'COACH GOLD RUNTIME LOCK') errors.push('Coach runtime lock status');
if (runtime.length !== 70) errors.push(`Coach runtime count ${runtime.length} !== 70`);
if (hash(runtime) !== lock.contentHash) errors.push('Coach runtime lock hash drift');
if (hash(runtime) !== hash(expected)) errors.push('Coach runtime does not exactly match approved source mapping');
if (lock.approvedSourceHash !== hash(COACH_GOLD_70)) errors.push('Approved Coach source hash drift');
if (new Set(runtime.map(({ id }) => id)).size !== 70) errors.push('Coach runtime IDs are not unique');
if (runtime.some(({ id }) => legacyIds.has(id))) errors.push('Legacy Coach ID remains active');
if (runtime.some(({ id }, index) => id !== `coach_gold_${String(index + 1).padStart(3, '0')}`)) errors.push('Coach runtime ID range/order');
if (backup.count !== 13 || backup.uniqueCount !== 12) errors.push('Legacy Coach backup count drift');

const familyKeys = runtime.map(({ familyKey }) => familyKey);
if (new Set(familyKeys).size !== 70) errors.push('Coach runtime family keys are not unique');
if (COACH_GOLD_FAMILIES.some(({ familyKey }) => !familyKeys.includes(familyKey))) errors.push('Coach taxonomy coverage is incomplete');
for (const category of COACH_GOLD_CATEGORIES) {
  const count = runtime.filter((scenario) => scenario.category === category).length;
  if (count !== 10) errors.push(`${category}: ${count} !== 10`);
}
for (const scenario of runtime) {
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.id}: answer ladder`);
  if (scenario.answers.map(({ id }) => id).join(',') !== 'a,b,c,d') errors.push(`${scenario.id}: answer IDs`);
  if (!scenario.coachTypeTags.length || !scenario.experienceTags.length) errors.push(`${scenario.id}: empty profile tags`);
}

const playerLocks = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  playerLocks[key] = { expected: manifest.positions[key].contentHash, actual: positionHash(position) };
  playerLocks[key].ok = playerLocks[key].expected === playerLocks[key].actual;
  if (!playerLocks[key].ok) errors.push(`${key} Gold drift`);
}
const pivot = { expected: pivotLock.contentHash, actual: positionHash('Pivot') };
pivot.ok = pivot.expected === pivot.actual;
if (!pivot.ok) errors.push('Pivot Gold drift');
const goalkeeper = { expected: goalkeeperLock.contentHash, actual: positionHash('Goalkeeper') };
goalkeeper.ok = goalkeeper.expected === goalkeeper.actual;
if (!goalkeeper.ok) errors.push('Goalkeeper Gold drift');

const report = {
  status: errors.length ? 'FAIL' : 'PASS',
  generatedAt: new Date().toISOString(),
  coachCount: runtime.length,
  familyCount: new Set(familyKeys).size,
  categoryCounts: Object.fromEntries(COACH_GOLD_CATEGORIES.map((category) => [category, runtime.filter((scenario) => scenario.category === category).length])),
  legacyCoachCount: runtime.filter(({ id }) => legacyIds.has(id)).length,
  runtimeHash: hash(runtime),
  sourceMappingHash: hash(expected),
  playerLocks,
  pivot,
  goalkeeper,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/coach-gold-bank-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  coachCount: report.coachCount,
  familyCount: report.familyCount,
  categoryCounts: report.categoryCounts,
  legacyCoachCount: report.legacyCoachCount,
  lockedPlayerBanksStable: Object.values(playerLocks).every(({ ok }) => ok) && pivot.ok && goalkeeper.ok,
  errors: errors.length,
  warnings: warnings.length,
}, null, 2));
if (errors.length) process.exit(1);
