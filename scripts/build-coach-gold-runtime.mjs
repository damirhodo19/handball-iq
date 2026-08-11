#!/usr/bin/env node
/** Build the reviewed Coach Gold 70 source into the app runtime without touching player banks. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_70 } from './scenario-bank/data/coach-gold-70.mjs';
import { COACH_LEGACY_SOURCE_HASHES } from './scenario-bank/data/coach-gold-taxonomy.mjs';
import { toCoachGoldRuntimeChallenge } from './scenario-bank/coach-gold-runtime.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const runtimePath = 'lib/coach-platform/challenges-gold.json';
const backupPath = 'scripts/coach-legacy-cleanup-backup.json';
const lockPath = 'scripts/coach-gold-runtime-lock.json';
const sourceValidation = JSON.parse(readFileSync(join(root, 'scripts/coach-gold-full-source-validation.json'), 'utf8'));
const baseline = JSON.parse(readFileSync(join(root, 'scripts/coach-bank-baseline-audit.json'), 'utf8'));
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperLock = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const textHash = (value) => createHash('sha256').update(value).digest('hex');
const positionHash = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));

if (sourceValidation.status !== 'COACH GOLD SOURCE 70 READY FOR HUMAN COACH REVIEW') throw new Error('Coach source validation is not clean');
if (sourceValidation.sourceHash !== hash(COACH_GOLD_70)) throw new Error('Coach source hash drift before runtime build');
if (COACH_GOLD_70.length !== 70) throw new Error('Coach source count is not 70');
if (new Set(COACH_GOLD_70.map(({ id }) => id)).size !== 70) throw new Error('Coach source IDs are not unique');
if (baseline.count !== 13 || baseline.uniqueIds !== 12) throw new Error('Legacy Coach baseline count drift');

for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  if (positionHash(position) !== manifest.positions[key].contentHash) throw new Error(`${key} Gold drift before Coach build`);
}
if (positionHash('Pivot') !== pivotLock.contentHash) throw new Error('Pivot Gold drift before Coach build');
if (positionHash('Goalkeeper') !== goalkeeperLock.contentHash) throw new Error('Goalkeeper Gold drift before Coach build');

let backup;
if (existsSync(join(root, backupPath))) {
  backup = JSON.parse(readFileSync(join(root, backupPath), 'utf8'));
} else {
  const files = Object.fromEntries(Object.keys(COACH_LEGACY_SOURCE_HASHES).map((path) => [path, readFileSync(join(root, path), 'utf8')]));
  const sourceHashes = Object.fromEntries(Object.entries(files).map(([path, text]) => [path, textHash(text)]));
  for (const [path, expected] of Object.entries(COACH_LEGACY_SOURCE_HASHES)) {
    if (sourceHashes[path] !== expected) throw new Error(`${path}: legacy source drift before backup`);
  }
  const ids = Object.values(files).flatMap((text) => [...text.matchAll(/^ {4}id: '([^']+)'/gm)].map((match) => match[1]));
  if (ids.length !== 13 || new Set(ids).size !== 12) throw new Error('Could not resolve the approved 13-row legacy Coach set');
  backup = {
    status: 'LEGACY COACH BACKUP',
    generatedAt: new Date().toISOString(),
    count: ids.length,
    uniqueCount: new Set(ids).size,
    ids,
    uniqueIds: [...new Set(ids)],
    sourceHashes,
    files,
  };
}

const runtime = COACH_GOLD_70.map(toCoachGoldRuntimeChallenge);
const runtimeHash = hash(runtime);
const lock = {
  status: 'COACH GOLD RUNTIME LOCK',
  generatedAt: new Date().toISOString(),
  approvedSourceHash: sourceValidation.sourceHash,
  count: runtime.length,
  familyCount: new Set(runtime.map(({ familyKey }) => familyKey)).size,
  idRange: `${runtime[0].id}–${runtime.at(-1).id}`,
  contentHash: runtimeHash,
  runtimePath,
  legacyRemoved: backup.count,
  legacyUniqueIds: backup.uniqueCount,
  lockedPlayerHashes: Object.fromEntries(Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' }).map(([key, position]) => [key, positionHash(position)])),
  pivotHash: positionHash('Pivot'),
  goalkeeperHash: positionHash('Goalkeeper'),
};

writeFileSync(join(root, backupPath), `${JSON.stringify(backup, null, 2)}\n`);
writeFileSync(join(root, runtimePath), `${JSON.stringify(runtime, null, 2)}\n`);
writeFileSync(join(root, lockPath), `${JSON.stringify(lock, null, 2)}\n`);
writeFileSync(join(root, 'scripts/coach-gold-runtime-build-report.json'), `${JSON.stringify({ ...lock, status: 'PASS' }, null, 2)}\n`);
console.log(JSON.stringify({
  status: 'PASS',
  coachBefore: backup.count,
  coachBeforeUnique: backup.uniqueCount,
  coachAfter: runtime.length,
  familyCount: lock.familyCount,
  idRange: lock.idRange,
  legacyRemoved: backup.count,
  playerGoldStable: true,
}, null, 2));
