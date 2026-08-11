#!/usr/bin/env node
/** Non-mutating runtime-selection proof for the Goalkeeper Gold cutover. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const backup = JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-legacy-cleanup-backup.json'), 'utf8'));
const legacyIds = new Set(backup.scenarios.map(({ id }) => id));
const numId = (id) => Number(String(id).replace(/^scn_bank_/, ''));
const pickSession = (pool, count, seed) => [...pool]
  .map((scenario, index) => ({ scenario, key: createHash('sha1').update(`${seed}:${scenario.id}:${index}`).digest('hex') }))
  .sort((left, right) => left.key.localeCompare(right.key))
  .slice(0, count)
  .map(({ scenario }) => scenario);

const goalkeeper = bank.filter(({ primaryPosition }) => primaryPosition === 'Goalkeeper');
const categoryPool = bank.filter(({ category }) => category === 'Goalkeeper');
const errors = [];
const trials = [];
if (goalkeeper.length !== 75) errors.push(`Goalkeeper primary count ${goalkeeper.length} !== 75`);
if (categoryPool.length !== 75) errors.push(`Goalkeeper category count ${categoryPool.length} !== 75`);
if (goalkeeper.some(({ id }) => numId(id) < 1061 || numId(id) > 1135)) errors.push('Out-of-range Goalkeeper scenario in primary pool');
if (goalkeeper.some(({ id }) => legacyIds.has(id))) errors.push('Legacy Goalkeeper scenario in primary pool');
if (goalkeeper.some(({ primaryPosition, category }) => primaryPosition !== 'Goalkeeper' || category !== 'Goalkeeper')) errors.push('Goalkeeper identity leak');

for (let trial = 0; trial < 100; trial += 1) {
  const session = pickSession(goalkeeper, 8, `goalkeeper-runtime-${trial}`);
  const ids = session.map(({ id }) => id);
  const bad = ids.filter((id) => legacyIds.has(id) || numId(id) < 1061 || numId(id) > 1135);
  if (bad.length) errors.push(`Trial ${trial} returned legacy/out-of-range: ${bad.join(', ')}`);
  if (new Set(ids).size !== ids.length) errors.push(`Trial ${trial} returned duplicate IDs`);
  trials.push({ trial, ids, bad });
}

const staleRequested = [...legacyIds].slice(0, 8).concat(['scn_bank_1061', 'scn_bank_1062']);
const byId = new Map(bank.map((scenario) => [scenario.id, scenario]));
const staleResolved = staleRequested.map((id) => byId.get(id)).filter(Boolean);
if (staleResolved.some(({ id }) => legacyIds.has(id))) errors.push('Stale resolver returned legacy Goalkeeper content');

const report = { status: errors.length ? 'FAIL' : 'PASS', goalkeeperPrimaryCount: goalkeeper.length, goalkeeperCategoryCount: categoryPool.length, trials: trials.length, returnedLegacy: trials.some(({ bad }) => bad.length), staleResolve: { requested: staleRequested, resolved: staleResolved.map(({ id }) => id), droppedLegacy: staleRequested.filter((id) => legacyIds.has(id) && !byId.has(id)) }, errors };
writeFileSync(join(root, 'scripts/goalkeeper-runtime-selection-test.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, goalkeeperPrimaryCount: report.goalkeeperPrimaryCount, goalkeeperCategoryCount: report.goalkeeperCategoryCount, trials: report.trials, returnedLegacy: report.returnedLegacy, staleLegacyDropped: report.staleResolve.droppedLegacy.length, errors }, null, 2));
if (errors.length) process.exit(1);
