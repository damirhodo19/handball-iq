#!/usr/bin/env node
/** Non-mutating validation of the integrated Goalkeeper Gold runtime bank. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_75 } from './scenario-bank/data/goalkeeper-gold-75.mjs';
import { GOALKEEPER_GOLD_FAMILIES } from './scenario-bank/data/goalkeeper-gold-taxonomy.mjs';
import { goalkeeperGoldRuntimeId, toGoalkeeperGoldRuntimeScenario } from './scenario-bank/goalkeeper-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8'));
const legacyBackup = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-legacy-cleanup-backup.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positionRows = (position) => bank.filter((scenario) => scenario.primaryPosition === position);
const positionHash = (position) => hash(positionRows(position));
const errors = [];
const warnings = [];
const goalkeeper = positionRows('Goalkeeper');
const expected = GOALKEEPER_GOLD_75.map(toGoalkeeperGoldRuntimeScenario);
const expectedIds = GOALKEEPER_GOLD_75.map((_, index) => goalkeeperGoldRuntimeId(index));
const legacyIds = new Set(legacyBackup.scenarios.map(({ id }) => id));

if (goalkeeper.length !== 75) errors.push(`Goalkeeper primary count ${goalkeeper.length} !== 75`);
if (bank.filter(({ category }) => category === 'Goalkeeper').length !== 75) errors.push('Goalkeeper category count is not 75');
if (hash(goalkeeper) !== lock.contentHash) errors.push('Goalkeeper runtime lock hash drift');
if (hash(goalkeeper) !== hash(expected)) errors.push('Runtime Goalkeeper rows do not exactly match approved source mapping');
if (expectedIds.some((id, index) => goalkeeper[index]?.id !== id)) errors.push('Goalkeeper ID range/order is not exactly 1061–1135');
if (bank.some(({ id }) => id === 'scn_bank_982')) errors.push('Forbidden scn_bank_982 exists');
if (bank.some(({ id }) => legacyIds.has(id))) errors.push('Legacy Goalkeeper ID remains in runtime bank');
if (new Set(bank.map(({ id }) => id)).size !== bank.length) errors.push('Duplicate bank IDs');
if (bank.length !== 692) errors.push(`Runtime bank total ${bank.length} !== 692`);

const familyKeys = [];
for (const scenario of goalkeeper) {
  const familyTag = (scenario.skillTags || []).find((tag) => String(tag).startsWith('family:'));
  if (!familyTag) errors.push(`${scenario.id}: missing family tag`); else familyKeys.push(familyTag.slice(7));
  if (scenario.primaryPosition !== 'Goalkeeper' || scenario.category !== 'Goalkeeper') errors.push(`${scenario.id}: position/category identity`);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.id}: answer ladder`);
  if (scenario.qualityScore < 8.5) errors.push(`${scenario.id}: quality score below Gold threshold`);
  if (!scenario.title.en.startsWith('Goalkeeper —') || !scenario.title.hr.startsWith('Vratar —') || !scenario.title.de.startsWith('Torwart —')) errors.push(`${scenario.id}: title identity`);
}
const taxonomy = GOALKEEPER_GOLD_FAMILIES.map(({ familyKey }) => familyKey);
if (new Set(familyKeys).size !== 75) errors.push('Goalkeeper family tags are not unique');
if (taxonomy.some((family) => !familyKeys.includes(family))) errors.push('Goalkeeper taxonomy coverage is incomplete');

const lockCheck = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  lockCheck[key] = { expected: manifest.positions[key].contentHash, actual: positionHash(position) };
  lockCheck[key].ok = lockCheck[key].expected === lockCheck[key].actual;
  if (!lockCheck[key].ok) errors.push(`${key} Gold drift`);
}
const pivotCheck = { expected: pivotLock.contentHash, actual: positionHash('Pivot') };
pivotCheck.ok = pivotCheck.expected === pivotCheck.actual;
if (!pivotCheck.ok) errors.push('Pivot Gold drift');

const report = { status: errors.length ? 'FAIL' : 'PASS', generatedAt: new Date().toISOString(), goalkeeperCount: goalkeeper.length, idRange: goalkeeper.length ? `${goalkeeper[0].id}–${goalkeeper.at(-1).id}` : null, legacyGoalkeeperCount: bank.filter(({ id }) => legacyIds.has(id)).length, runtimeTotal: bank.length, contentHash: hash(goalkeeper), sourceMappingHash: hash(expected), familyCount: new Set(familyKeys).size, attack: goalkeeper.filter(({ attackOrDefence }) => attackOrDefence === 'Attack').length, defence: goalkeeper.filter(({ attackOrDefence }) => attackOrDefence === 'Defence').length, lockCheck, pivotCheck, errors, warnings };
writeFileSync(join(root, 'scripts/goalkeeper-gold-bank-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, goalkeeperCount: report.goalkeeperCount, legacyGoalkeeperCount: report.legacyGoalkeeperCount, runtimeTotal: report.runtimeTotal, familyCount: report.familyCount, attack: report.attack, defence: report.defence, lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok), pivotGoldStable: pivotCheck.ok, errors: errors.length, warnings: warnings.length }, null, 2));
if (errors.length) process.exit(1);
