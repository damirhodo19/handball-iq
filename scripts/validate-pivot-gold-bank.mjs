#!/usr/bin/env node
/** Non-mutating validation of the integrated Pivot Gold runtime bank. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_60 } from './scenario-bank/data/pivot-gold-60.mjs';
import { GOALKEEPER_LEGACY_BASELINE_HASH, PIVOT_GOLD_FAMILIES } from './scenario-bank/data/pivot-gold-taxonomy.mjs';
import { pivotGoldRuntimeId, toPivotGoldRuntimeScenario } from './scenario-bank/pivot-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperLock = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8'));
const legacyBackup = JSON.parse(readFileSync(join(root, 'scripts/pivot-legacy-cleanup-backup.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positionRows = (position) => bank.filter((scenario) => scenario.primaryPosition === position);
const positionHash = (position) => hash(positionRows(position));
const errors = [];
const warnings = [];
const pivot = positionRows('Pivot');
const expected = PIVOT_GOLD_60.map(toPivotGoldRuntimeScenario);
const expectedIds = PIVOT_GOLD_60.map((_, index) => pivotGoldRuntimeId(index));
const legacyIds = new Set(legacyBackup.scenarios.map(({ id }) => id));

if (pivot.length !== 60) errors.push(`Pivot primary count ${pivot.length} !== 60`);
if (bank.filter(({ category }) => category === 'Pivot').length !== 60) errors.push('Pivot category count is not 60');
if (hash(pivot) !== lock.contentHash) errors.push('Pivot runtime lock hash drift');
if (hash(pivot) !== hash(expected)) errors.push('Runtime Pivot rows do not exactly match approved source mapping');
if (expectedIds.some((id, index) => pivot[index]?.id !== id)) errors.push('Pivot ID range/order is not exactly 1001–1060');
if (bank.some(({ id }) => id === 'scn_bank_982')) errors.push('Forbidden scn_bank_982 exists');
if (bank.some(({ id }) => legacyIds.has(id))) errors.push('Legacy Pivot ID remains in runtime bank');
if (new Set(bank.map(({ id }) => id)).size !== bank.length) errors.push('Duplicate bank IDs');
if (bank.length !== goalkeeperLock.totalAfter) errors.push(`Runtime bank total ${bank.length} !== ${goalkeeperLock.totalAfter}`);

const familyKeys = [];
for (const scenario of pivot) {
  const familyTag = (scenario.skillTags || []).find((tag) => String(tag).startsWith('family:'));
  if (!familyTag) errors.push(`${scenario.id}: missing family tag`);
  else familyKeys.push(familyTag.slice(7));
  if (scenario.primaryPosition !== 'Pivot' || scenario.category !== 'Pivot') errors.push(`${scenario.id}: position/category identity`);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.id}: answer ladder`);
  if (scenario.qualityScore < 8.5) errors.push(`${scenario.id}: quality score below Gold threshold`);
  if (!scenario.title.en.startsWith('Pivot —') || !scenario.title.hr.startsWith('Pivot —') || !scenario.title.de.startsWith('Kreisläufer —')) errors.push(`${scenario.id}: title identity`);
}
const taxonomy = PIVOT_GOLD_FAMILIES.map(({ familyKey }) => familyKey);
if (new Set(familyKeys).size !== 60) errors.push('Pivot family tags are not unique');
if (taxonomy.some((family) => !familyKeys.includes(family))) errors.push('Pivot taxonomy coverage is incomplete');

const lockCheck = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  lockCheck[key] = { expected: manifest.positions[key].contentHash, actual: positionHash(position) };
  lockCheck[key].ok = lockCheck[key].expected === lockCheck[key].actual;
  if (!lockCheck[key].ok) errors.push(`${key} Gold drift`);
}
const goalkeeperCheck = {
  expected: [GOALKEEPER_LEGACY_BASELINE_HASH, goalkeeperLock.contentHash],
  actual: positionHash('Goalkeeper'),
};
goalkeeperCheck.ok = goalkeeperCheck.expected.includes(goalkeeperCheck.actual);
if (!goalkeeperCheck.ok) errors.push('Goalkeeper drift');

const report = {
  status: errors.length ? 'FAIL' : 'PASS',
  generatedAt: new Date().toISOString(),
  pivotCount: pivot.length,
  idRange: pivot.length ? `${pivot[0].id}–${pivot.at(-1).id}` : null,
  legacyPivotCount: bank.filter(({ id }) => legacyIds.has(id)).length,
  runtimeTotal: bank.length,
  contentHash: hash(pivot),
  sourceMappingHash: hash(expected),
  familyCount: new Set(familyKeys).size,
  attack: pivot.filter(({ attackOrDefence }) => attackOrDefence === 'Attack').length,
  defence: pivot.filter(({ attackOrDefence }) => attackOrDefence === 'Defence').length,
  lockCheck,
  goalkeeperCheck,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/pivot-gold-bank-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  pivotCount: report.pivotCount,
  legacyPivotCount: report.legacyPivotCount,
  runtimeTotal: report.runtimeTotal,
  familyCount: report.familyCount,
  attack: report.attack,
  defence: report.defence,
  lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok),
  goalkeeperStable: goalkeeperCheck.ok,
  errors: errors.length,
  warnings: warnings.length,
}, null, 2));
if (errors.length) process.exit(1);
