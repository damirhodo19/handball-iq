#!/usr/bin/env node
/**
 * validate:left-wing-gold-bank (NON-MUTATING)
 * Validates the approved Left Wing Gold subset: scn_bank_941–981 (count = 41).
 * Does NOT require 59/60. Does NOT mutate bank data.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const lockPath = join(root, 'scripts/.lw-batch-c-gold-lock.json');
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const APPROVED = 41;
const LO = 941;
const HI = 981;

const report = {
  status: 'PASS',
  approvedCount: APPROVED,
  errors: [],
  warnings: [],
  ids: [],
  familyKeys: {},
  difficulty: {},
  attackDefence: {},
  perception: { true: 0, false: 0 },
  locks: {},
};

function numId(id) {
  const m = String(id).match(/^scn_bank_(\d+)$/);
  return m ? Number(m[1]) : NaN;
}

const lwAll = bank.filter((s) => s.primaryPosition === 'Left Wing');
const gold = bank
  .filter((s) => s.primaryPosition === 'Left Wing' && numId(s.id) >= LO && numId(s.id) <= HI)
  .sort((a, b) => numId(a.id) - numId(b.id));

report.ids = gold.map((s) => s.id);
report.legacyLwStillPresent = lwAll.length - gold.length;
report.lwPrimaryTotal = lwAll.length;

if (gold.length !== APPROVED) {
  report.errors.push(`LW Gold count ${gold.length} !== approved ${APPROVED}`);
}
if (bank.some((s) => s.id === 'scn_bank_982')) {
  report.errors.push('scn_bank_982 exists — Batch D / overflow not allowed');
}

const missing = [];
for (let n = LO; n <= HI; n++) {
  const id = `scn_bank_${n}`;
  const s = bank.find((x) => x.id === id);
  if (!s) missing.push(id);
  else if (s.primaryPosition !== 'Left Wing') {
    report.errors.push(`${id} exists but primaryPosition=${s.primaryPosition}`);
  }
}
if (missing.length) report.errors.push(`Missing LW Gold IDs: ${missing.join(', ')}`);

const idSet = new Set(report.ids);
if (idSet.size !== report.ids.length) report.errors.push('Duplicate LW Gold IDs in subset');

// Seed hashes vs Batch C lock
const seedExpected = { ...lock.hashes.seeds941to974, ...lock.hashes.seeds975to981 };
for (const [id, expected] of Object.entries(seedExpected)) {
  const s = bank.find((x) => x.id === id);
  if (!s) {
    report.errors.push(`Lock seed missing in bank: ${id}`);
    continue;
  }
  const actual = hash(s);
  if (actual !== expected) report.errors.push(`Hash drift ${id}`);
}
report.locks.seedHashesOk = report.errors.filter((e) => e.startsWith('Hash drift')).length === 0;

// Sibling position locks
const posHash = (pos) => hash(bank.filter((s) => s.primaryPosition === pos));
for (const [k, pos] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
})) {
  const actual = posHash(pos);
  report.locks[k] = { expected: lock.hashes[k], actual, ok: actual === lock.hashes[k] };
  if (!report.locks[k].ok) report.errors.push(`${k} position hash drift`);
}

const familySeen = new Map();
for (const s of gold) {
  const tag = (s.skillTags || []).find((t) => String(t).startsWith('family:'));
  const fk = tag ? tag.slice(7) : null;
  if (!fk) report.errors.push(`${s.id} missing family: skillTag`);
  else {
    report.familyKeys[s.id] = fk;
    if (familySeen.has(fk)) report.errors.push(`Duplicate familyKey inside LW Gold: ${fk} (${familySeen.get(fk)}, ${s.id})`);
    else familySeen.set(fk, s.id);
  }
  report.difficulty[s.difficulty] = (report.difficulty[s.difficulty] || 0) + 1;
  report.attackDefence[s.attackOrDefence] = (report.attackDefence[s.attackOrDefence] || 0) + 1;
  const perc = (s.skillTags || []).includes('perception');
  report.perception[perc ? 'true' : 'false'] += 1;

  const title = s.title?.en || '';
  if (/Right Wing|Rechtsaußen|desno krilo/i.test(title) && !/their right wing|opp/i.test(title)) {
    // title claiming RW as player position
    if (/^Right Wing/i.test(title) || /— Right Wing/i.test(title)) {
      report.errors.push(`${s.id} title position leakage toward RW`);
    }
  }
  if (!/Left Wing|Lijevo krilo|Linksaußen/i.test(title)) {
    report.warnings.push(`${s.id} title may lack LW identity`);
  }
}

report.contentHash = hash(gold);
report.status = report.errors.length ? 'FAIL' : 'PASS';

writeFileSync(join(root, 'scripts/lw-gold-bank-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, count: gold.length, errors: report.errors.length, warnings: report.warnings.length }, null, 2));
if (report.status !== 'PASS') process.exit(1);
