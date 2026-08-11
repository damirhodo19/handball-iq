#!/usr/bin/env node
/** Replace the approved legacy Pivot bank with the reviewed Pivot Gold 60 source. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_60 } from './scenario-bank/data/pivot-gold-60.mjs';
import {
  GOALKEEPER_LEGACY_BASELINE_HASH,
  PIVOT_LEGACY_BASELINE_HASH,
} from './scenario-bank/data/pivot-gold-taxonomy.mjs';
import { toPivotGoldRuntimeScenario } from './scenario-bank/pivot-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const sourceValidation = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-full-source-validation.json'), 'utf8'));
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const runtimeLockPath = join(root, 'scripts/pivot-gold-runtime-lock.json');
const previousRuntimeLock = (() => {
  try { return JSON.parse(readFileSync(runtimeLockPath, 'utf8')); } catch { return null; }
})();
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positionRows = (rows, position) => rows.filter((scenario) => scenario.primaryPosition === position);
const positionHash = (rows, position) => hash(positionRows(rows, position));

if (sourceValidation.status !== 'PIVOT GOLD 60 SOURCE READY FOR HUMAN COACH REVIEW') {
  throw new Error('Approved Pivot source validation is not clean');
}
if (sourceValidation.sourceHash !== hash(PIVOT_GOLD_60)) throw new Error('Pivot source hash drift before build');
if (PIVOT_GOLD_60.length !== 60) throw new Error('Pivot source count is not 60');
if (new Set(bank.map(({ id }) => id)).size !== bank.length) throw new Error('Duplicate bank ID before build');
if (bank.some(({ id }) => id === 'scn_bank_982')) throw new Error('Forbidden scn_bank_982 exists');
const targetRangeRows = bank.filter(({ id }) => /^scn_bank_10(?:0[1-9]|[1-5][0-9]|60)$/.test(id));
if (targetRangeRows.some(({ primaryPosition }) => primaryPosition !== 'Pivot')) {
  throw new Error('Pivot Gold target ID range 1001–1060 is occupied');
}

for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  if (positionHash(bank, position) !== manifest.positions[key].contentHash) throw new Error(`${key} Gold drift before Pivot build`);
}
const pivotBeforeHash = positionHash(bank, 'Pivot');
const allowedPivotBefore = [PIVOT_LEGACY_BASELINE_HASH, previousRuntimeLock?.contentHash].filter(Boolean);
if (!allowedPivotBefore.includes(pivotBeforeHash)) throw new Error('Pivot baseline/runtime lock drift before build');
if (positionHash(bank, 'Goalkeeper') !== GOALKEEPER_LEGACY_BASELINE_HASH) throw new Error('Goalkeeper baseline drift before build');

const pivotBefore = positionRows(bank, 'Pivot');
const isLegacyCutover = pivotBeforeHash === PIVOT_LEGACY_BASELINE_HASH;
if (isLegacyCutover && (pivotBefore.length !== 50 || pivotBefore.some(({ category }) => category !== 'Pivot'))) {
  throw new Error(`Expected exactly 50 isolated legacy Pivot rows, found ${pivotBefore.length}`);
}
if (!isLegacyCutover && (pivotBefore.length !== 60 || pivotBefore.some(({ category }) => category !== 'Pivot'))) {
  throw new Error('Existing Pivot Gold runtime bank is not an isolated 60-row set');
}

const kept = bank.filter(({ primaryPosition }) => primaryPosition !== 'Pivot');
const gold = PIVOT_GOLD_60.map(toPivotGoldRuntimeScenario);
const out = [...kept, ...gold];

if (out.length !== bank.length - pivotBefore.length + gold.length) throw new Error('Unexpected total after Pivot replacement');
if (new Set(out.map(({ id }) => id)).size !== out.length) throw new Error('Duplicate bank ID after Pivot build');
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  if (positionHash(out, position) !== manifest.positions[key].contentHash) throw new Error(`${key} Gold changed during Pivot build`);
}
if (positionHash(out, 'Goalkeeper') !== GOALKEEPER_LEGACY_BASELINE_HASH) throw new Error('Goalkeeper changed during Pivot build');

const pivotHash = positionHash(out, 'Pivot');
const backupPath = join(root, 'scripts/pivot-legacy-cleanup-backup.json');
const backup = isLegacyCutover
  ? {
      status: 'LEGACY PIVOT BACKUP',
      generatedAt: new Date().toISOString(),
      count: pivotBefore.length,
      contentHash: hash(pivotBefore),
      scenarios: pivotBefore,
    }
  : JSON.parse(readFileSync(backupPath, 'utf8'));
const lock = {
  status: 'PIVOT GOLD RUNTIME LOCK',
  generatedAt: new Date().toISOString(),
  approvedSourceHash: sourceValidation.sourceHash,
  count: gold.length,
  idRange: `${gold[0].id}–${gold.at(-1).id}`,
  contentHash: pivotHash,
  legacyRemoved: backup.count,
  totalBefore: bank.length,
  totalAfter: out.length,
  lockedGoldHashes: Object.fromEntries(
    Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })
      .map(([key, position]) => [key, positionHash(out, position)]),
  ),
  goalkeeperHash: positionHash(out, 'Goalkeeper'),
};

writeFileSync(backupPath, `${JSON.stringify(backup, null, 2)}\n`);
writeFileSync(bankPath, `${JSON.stringify(out, null, 2)}\n`);
writeFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);
writeFileSync(join(root, 'scripts/pivot-gold-build-report.json'), `${JSON.stringify({ ...lock, status: 'PASS' }, null, 2)}\n`);

console.log(JSON.stringify({
  status: 'PASS',
  pivotBefore: pivotBefore.length,
  pivotAfter: gold.length,
  legacyRemoved: backup.count,
  idRange: lock.idRange,
  totalAfter: out.length,
  lockedGoldStable: true,
  goalkeeperStable: true,
}, null, 2));
