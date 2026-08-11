#!/usr/bin/env node
/** Replace the legacy Goalkeeper bank with the reviewed Goalkeeper Gold 75 source. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_75 } from './scenario-bank/data/goalkeeper-gold-75.mjs';
import { GOALKEEPER_LEGACY_BASELINE_HASH } from './scenario-bank/data/goalkeeper-gold-taxonomy.mjs';
import { toGoalkeeperGoldRuntimeScenario } from './scenario-bank/goalkeeper-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const sourceValidation = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-full-source-validation.json'), 'utf8'));
const runtimeLockPath = join(root, 'scripts/goalkeeper-gold-runtime-lock.json');
const previousRuntimeLock = (() => { try { return JSON.parse(readFileSync(runtimeLockPath, 'utf8')); } catch { return null; } })();
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positionRows = (rows, position) => rows.filter((scenario) => scenario.primaryPosition === position);
const positionHash = (rows, position) => hash(positionRows(rows, position));

if (sourceValidation.status !== 'GOALKEEPER GOLD 75 SOURCE READY FOR RUNTIME CUTOVER') throw new Error('Goalkeeper source validation is not clean');
if (sourceValidation.sourceHash !== hash(GOALKEEPER_GOLD_75)) throw new Error('Goalkeeper source hash drift before build');
if (GOALKEEPER_GOLD_75.length !== 75) throw new Error('Goalkeeper source count is not 75');
if (new Set(bank.map(({ id }) => id)).size !== bank.length) throw new Error('Duplicate bank ID before build');
if (bank.some(({ id }) => id === 'scn_bank_982')) throw new Error('Forbidden scn_bank_982 exists');
const targetRangeRows = bank.filter(({ id }) => /^scn_bank_1(?:06[1-9]|0[7-9][0-9]|1[0-2][0-9]|13[0-5])$/.test(id));
if (targetRangeRows.some(({ primaryPosition }) => primaryPosition !== 'Goalkeeper')) throw new Error('Goalkeeper Gold target ID range 1061–1135 is occupied');

for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  if (positionHash(bank, position) !== manifest.positions[key].contentHash) throw new Error(`${key} Gold drift before Goalkeeper build`);
}
if (positionHash(bank, 'Pivot') !== pivotLock.contentHash) throw new Error('Pivot Gold drift before Goalkeeper build');
const goalkeeperBeforeHash = positionHash(bank, 'Goalkeeper');
const allowedGoalkeeperBefore = [GOALKEEPER_LEGACY_BASELINE_HASH, previousRuntimeLock?.contentHash].filter(Boolean);
if (!allowedGoalkeeperBefore.includes(goalkeeperBeforeHash)) throw new Error('Goalkeeper baseline/runtime lock drift before build');

const goalkeeperBefore = positionRows(bank, 'Goalkeeper');
const isLegacyCutover = goalkeeperBeforeHash === GOALKEEPER_LEGACY_BASELINE_HASH;
if (isLegacyCutover && goalkeeperBefore.length !== 84) throw new Error(`Expected 84 legacy Goalkeeper rows, found ${goalkeeperBefore.length}`);
if (!isLegacyCutover && (goalkeeperBefore.length !== 75 || goalkeeperBefore.some(({ category }) => category !== 'Goalkeeper'))) throw new Error('Existing Goalkeeper Gold runtime bank is not an isolated 75-row set');

const kept = bank.filter(({ primaryPosition }) => primaryPosition !== 'Goalkeeper');
const gold = GOALKEEPER_GOLD_75.map(toGoalkeeperGoldRuntimeScenario);
const out = [...kept, ...gold];
if (out.length !== bank.length - goalkeeperBefore.length + gold.length) throw new Error('Unexpected total after Goalkeeper replacement');
if (new Set(out.map(({ id }) => id)).size !== out.length) throw new Error('Duplicate bank ID after Goalkeeper build');
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  if (positionHash(out, position) !== manifest.positions[key].contentHash) throw new Error(`${key} Gold changed during Goalkeeper build`);
}
if (positionHash(out, 'Pivot') !== pivotLock.contentHash) throw new Error('Pivot Gold changed during Goalkeeper build');

const goalkeeperHash = positionHash(out, 'Goalkeeper');
const backupPath = join(root, 'scripts/goalkeeper-legacy-cleanup-backup.json');
const backup = isLegacyCutover
  ? { status: 'LEGACY GOALKEEPER BACKUP', generatedAt: new Date().toISOString(), count: goalkeeperBefore.length, contentHash: hash(goalkeeperBefore), scenarios: goalkeeperBefore }
  : JSON.parse(readFileSync(backupPath, 'utf8'));
const lock = {
  status: 'GOALKEEPER GOLD RUNTIME LOCK',
  generatedAt: new Date().toISOString(),
  approvedSourceHash: sourceValidation.sourceHash,
  count: gold.length,
  idRange: `${gold[0].id}–${gold.at(-1).id}`,
  contentHash: goalkeeperHash,
  legacyRemoved: backup.count,
  totalBefore: bank.length,
  totalAfter: out.length,
  lockedGoldHashes: Object.fromEntries(Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' }).map(([key, position]) => [key, positionHash(out, position)])),
  pivotHash: positionHash(out, 'Pivot'),
};

writeFileSync(backupPath, `${JSON.stringify(backup, null, 2)}\n`);
writeFileSync(bankPath, `${JSON.stringify(out, null, 2)}\n`);
writeFileSync(runtimeLockPath, `${JSON.stringify(lock, null, 2)}\n`);
writeFileSync(join(root, 'scripts/goalkeeper-gold-build-report.json'), `${JSON.stringify({ ...lock, status: 'PASS' }, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', goalkeeperBefore: goalkeeperBefore.length, goalkeeperAfter: gold.length, legacyRemoved: backup.count, idRange: lock.idRange, totalAfter: out.length, lockedGoldStable: true, pivotGoldStable: true }, null, 2));
