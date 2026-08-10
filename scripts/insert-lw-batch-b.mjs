#!/usr/bin/env node
/**
 * Append LW Batch B (scn_bank_963–974) only.
 * Does not touch 941–962, legacy LW, or LB/RB/CB/RW.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-b.json');
const lockPath = join(root, 'scripts/.lw-batch-b-lock-before.json');

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
for (const [id, h] of Object.entries(lock.seeds941to962)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Locked LW seed changed before insert: ${id}`);
}

if (batch.length !== 12) throw new Error(`Expected 12 batch scenarios, got ${batch.length}`);
if (bank.some((s) => /^scn_bank_96[3-9]$|^scn_bank_97[0-4]$/.test(s.id))) {
  throw new Error('Batch B IDs already present in bank — abort');
}

const added = [];
for (const f of batch) {
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

  bank.push({
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
  added.push(f.id);
}

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(pos) !== lock[k]) throw new Error(`LOCK HASH CHANGED AFTER INSERT: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds941to962)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Locked LW seed mutated: ${id}`);
}

const lw = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 74) throw new Error(`Expected temporary LW=74, got ${lw}`);

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/lw-gold-batch-b-insert.json'),
  JSON.stringify({ inserted: added, temporaryLwTotal: lw, status: 'INSERTED' }, null, 2) + '\n',
);
console.log(JSON.stringify({ inserted: added, temporaryLwTotal: lw }, null, 2));
