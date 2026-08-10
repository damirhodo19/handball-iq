#!/usr/bin/env node
/**
 * Non-mutating runtime selection proof for LW Gold cutover.
 * Exercises bank filtering + repeated random picks (mirrors production selectors).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

function numId(id) {
  const m = String(id).match(/^scn_bank_(\d+)$/);
  return m ? Number(m[1]) : NaN;
}

function isScenarioForPosition(s, position) {
  if (s.primaryPosition === position) return true;
  if (Array.isArray(s.secondaryPositions) && s.secondaryPositions.includes(position)) return true;
  return false;
}

function pickSession(pool, count, seed) {
  const scored = pool.map((s, i) => ({
    s,
    k: createHash('sha1').update(`${seed}:${s.id}:${i}`).digest('hex'),
  }));
  scored.sort((a, b) => a.k.localeCompare(b.k));
  const seen = new Set();
  const out = [];
  for (const row of scored) {
    const title = row.s.title?.en ?? row.s.id;
    if (seen.has(title)) continue;
    seen.add(title);
    out.push(row.s);
    if (out.length >= count) break;
  }
  return out;
}

const positions = ['Left Back', 'Right Back', 'Centre Back', 'Right Wing', 'Left Wing'];
const report = { status: 'PASS', errors: [], positions: {}, lwTrials: [] };

for (const position of positions) {
  const primary = bank.filter((s) => s.primaryPosition === position);
  const eligible = bank.filter((s) => isScenarioForPosition(s, position));
  report.positions[position] = {
    primaryCount: primary.length,
    eligibleCount: eligible.length,
  };
}

const lwPrimary = bank.filter((s) => s.primaryPosition === 'Left Wing');
const lwIds = lwPrimary.map((s) => s.id).sort((a, b) => numId(a) - numId(b));
const nums = lwIds.map(numId);

if (lwPrimary.length !== 41) report.errors.push(`LW primary ${lwPrimary.length} !== 41`);
if (Math.min(...nums) !== 941) report.errors.push(`LW min id ${Math.min(...nums)} !== 941`);
if (Math.max(...nums) !== 981) report.errors.push(`LW max id ${Math.max(...nums)} !== 981`);
if (bank.some((s) => s.id === 'scn_bank_982')) report.errors.push('scn_bank_982 exists');
if (lwPrimary.some((s) => numId(s.id) < 941 || numId(s.id) > 981)) {
  report.errors.push('legacy LW still in primary pool');
}

// Repeated randomized sessions
const legacyPattern = /^scn_bank_0(7[4-9]|8\d|9\d|10\d|11[0-4])$/;
for (let t = 0; t < 50; t++) {
  const session = pickSession(lwPrimary, 5, `lw-trial-${t}`);
  const ids = session.map((s) => s.id);
  const bad = ids.filter((id) => legacyPattern.test(id) || numId(id) < 941 || numId(id) > 981);
  report.lwTrials.push({ t, ids, bad });
  if (bad.length) report.errors.push(`trial ${t} returned legacy/out-of-range: ${bad.join(',')}`);
  if (ids.length < 3) report.errors.push(`trial ${t} too short: ${ids.length}`);
}

// Stale offline resolve simulation
const staleIds = ['scn_bank_074', 'scn_bank_075', 'scn_bank_076', 'scn_bank_941', 'scn_bank_942', 'scn_bank_943'];
const map = new Map(bank.map((s) => [s.id, s]));
const resolved = staleIds.map((id) => map.get(id)).filter(Boolean);
report.staleResolve = {
  requested: staleIds,
  resolved: resolved.map((s) => s.id),
  droppedLegacy: staleIds.filter((id) => !map.has(id)),
};
if (resolved.some((s) => numId(s.id) < 941)) report.errors.push('stale resolve returned legacy');
if (report.staleResolve.droppedLegacy.length < 3) report.errors.push('expected legacy IDs to be missing from bank');

report.counts = {
  LB: bank.filter((s) => s.primaryPosition === 'Left Back').length,
  RB: bank.filter((s) => s.primaryPosition === 'Right Back').length,
  CB: bank.filter((s) => s.primaryPosition === 'Centre Back').length,
  RW: bank.filter((s) => s.primaryPosition === 'Right Wing').length,
  LW: lwPrimary.length,
  totalGold: 62 + 63 + 70 + 65 + lwPrimary.length,
};

report.status = report.errors.length ? 'FAIL' : 'PASS';
writeFileSync(join(root, 'scripts/lw-runtime-selection-test.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, errors: report.errors, counts: report.counts, stale: report.staleResolve }, null, 2));
if (report.status !== 'PASS') process.exit(1);
