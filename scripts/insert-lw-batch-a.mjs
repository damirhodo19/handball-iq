#!/usr/bin/env node
/**
 * Append LW Batch A (scn_bank_951–962) only.
 * Does not touch pilot 941–950, legacy LW, or LB/RB/CB/RW.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-a.json');
const lockPath = join(root, 'scripts/.lw-batch-a-lock-before.json');

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(pos) !== lock[k]) throw new Error(`LOCK HASH CHANGED BEFORE INSERT: ${k}`);
}
for (let n = 941; n <= 950; n++) {
  const id = `scn_bank_${n}`;
  const h = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (h !== lock.pilotHashes[id]) throw new Error(`Pilot changed before insert: ${id}`);
}

if (batch.length !== 12) throw new Error(`Expected 12 batch scenarios, got ${batch.length}`);

const existing = new Set(bank.map((s) => s.id));
const cleaned = bank.filter((s) => {
  const n = Number(String(s.id).replace(/\D/g, ''));
  return !(s.primaryPosition === 'Left Wing' && n >= 951 && n <= 962);
});

const added = [];
for (const f of batch) {
  if (existing.has(f.id) && !cleaned.find((s) => s.id === f.id)) {
    // ok after clean
  }
  if (cleaned.find((s) => s.id === f.id)) throw new Error(`ID still present after clean: ${f.id}`);

  const qs = f.answers.map((a) => a.quality).join(',');
  if (qs !== 'optimal,good,risky,poor') throw new Error(`${f.id} qualities=${qs}`);

  const skillTags = [
    ...(f.skillTags || []),
    ...(f.perception && !(f.skillTags || []).includes('perception') ? ['perception'] : []),
    ...(f.numerical && f.numerical !== '6v6' && !(f.skillTags || []).some((t) => String(t).startsWith('numerical:'))
      ? [`numerical:${f.numerical}`]
      : []),
    ...(f.gameState && f.gameState !== 'none' ? [`gameState:${f.gameState}`] : []),
    `family:${f.familyKey}`,
    `batch:${f.batchId}`,
  ];

  cleaned.push({
    id: f.id,
    title: f.title,
    category: 'Left Wing',
    primaryPosition: 'Left Wing',
    secondaryPositions: [],
    difficulty: f.difficulty,
    pressureLevel: f.pressureLevel,
    attackOrDefence: f.attackOrDefence,
    matchPhase: f.matchPhase,
    minute: f.minute,
    score: f.score,
    defensiveSystem: f.defensiveSystem,
    situation: f.situation,
    question: f.question,
    answers: f.answers,
    explanation: f.explanation,
    whyCorrectOverSecondBest: f.whyCorrectOverSecondBest,
    skillTags,
    qualityScore: 8.6,
  });
  added.push({ id: f.id, familyKey: f.familyKey });
}

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  const h = crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.filter((s) => s.primaryPosition === pos)))
    .digest('hex');
  if (h !== lock[k]) throw new Error(`LOCK HASH CHANGED AFTER INSERT: ${k}`);
}
for (let n = 941; n <= 950; n++) {
  const id = `scn_bank_${n}`;
  const h = crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.find((s) => s.id === id)))
    .digest('hex');
  if (h !== lock.pilotHashes[id]) throw new Error(`Pilot mutated: ${id}`);
}

const lw = cleaned.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 62) throw new Error(`Expected temporary LW=62, got ${lw}`);

writeFileSync(bankPath, JSON.stringify(cleaned, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/lw-gold-batch-a-insert.json'),
  JSON.stringify({ status: 'BATCH_A_INSERTED', added, lwCount: lw, lockOk: true }, null, 2) + '\n',
);
console.log(JSON.stringify({ status: 'BATCH_A_INSERTED', added, lwCount: lw }, null, 2));
