#!/usr/bin/env node
/** Non-mutating runtime-selection proof for the Pivot Gold cutover. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const backup = JSON.parse(readFileSync(join(root, 'scripts/pivot-legacy-cleanup-backup.json'), 'utf8'));
const legacyIds = new Set(backup.scenarios.map(({ id }) => id));
const numId = (id) => Number(String(id).replace(/^scn_bank_/, ''));
const pickSession = (pool, count, seed) => [...pool]
  .map((scenario, index) => ({ scenario, key: createHash('sha1').update(`${seed}:${scenario.id}:${index}`).digest('hex') }))
  .sort((left, right) => left.key.localeCompare(right.key))
  .slice(0, count)
  .map(({ scenario }) => scenario);

const pivot = bank.filter(({ primaryPosition }) => primaryPosition === 'Pivot');
const errors = [];
const trials = [];
if (pivot.length !== 60) errors.push(`Pivot primary count ${pivot.length} !== 60`);
if (pivot.some(({ id }) => numId(id) < 1001 || numId(id) > 1060)) errors.push('Out-of-range Pivot scenario in primary pool');
if (pivot.some(({ id }) => legacyIds.has(id))) errors.push('Legacy Pivot scenario in primary pool');
if (pivot.some(({ primaryPosition, category }) => primaryPosition !== 'Pivot' || category !== 'Pivot')) errors.push('Pivot identity leak');

for (let trial = 0; trial < 100; trial += 1) {
  const session = pickSession(pivot, 8, `pivot-runtime-${trial}`);
  const ids = session.map(({ id }) => id);
  const bad = ids.filter((id) => legacyIds.has(id) || numId(id) < 1001 || numId(id) > 1060);
  if (bad.length) errors.push(`Trial ${trial} returned legacy/out-of-range: ${bad.join(', ')}`);
  if (new Set(ids).size !== ids.length) errors.push(`Trial ${trial} returned duplicate IDs`);
  trials.push({ trial, ids, bad });
}

const staleRequested = [...legacyIds].slice(0, 5).concat(['scn_bank_1001', 'scn_bank_1002']);
const byId = new Map(bank.map((scenario) => [scenario.id, scenario]));
const staleResolved = staleRequested.map((id) => byId.get(id)).filter(Boolean);
if (staleResolved.some(({ id }) => legacyIds.has(id))) errors.push('Stale resolver returned legacy Pivot content');

const report = {
  status: errors.length ? 'FAIL' : 'PASS',
  pivotPrimaryCount: pivot.length,
  trials: trials.length,
  returnedLegacy: trials.some(({ bad }) => bad.length),
  staleResolve: {
    requested: staleRequested,
    resolved: staleResolved.map(({ id }) => id),
    droppedLegacy: staleRequested.filter((id) => legacyIds.has(id) && !byId.has(id)),
  },
  errors,
};
writeFileSync(join(root, 'scripts/pivot-runtime-selection-test.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  pivotPrimaryCount: report.pivotPrimaryCount,
  trials: report.trials,
  returnedLegacy: report.returnedLegacy,
  staleLegacyDropped: report.staleResolve.droppedLegacy.length,
  errors,
}, null, 2));
if (errors.length) process.exit(1);
