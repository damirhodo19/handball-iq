#!/usr/bin/env node
/**
 * Insert Left Wing Gold pilot (10 scenarios) as scn_bank_941–950.
 * Does NOT modify LB, RB, CB, or RW.
 * Does NOT remove legacy LW scenarios (Phase 7 later).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const pilotPath = join(root, 'scripts/scenario-bank/data/lw-pilot-10.json');

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const pilots = JSON.parse(readFileSync(pilotPath, 'utf8'));

if (pilots.length !== 10) throw new Error(`Expected 10 pilots, got ${pilots.length}`);

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const before = {
  LB: bank.filter((s) => s.primaryPosition === 'Left Back').length,
  RB: bank.filter((s) => s.primaryPosition === 'Right Back').length,
  CB: bank.filter((s) => s.primaryPosition === 'Centre Back').length,
  RW: bank.filter((s) => s.primaryPosition === 'Right Wing').length,
  LW: bank.filter((s) => s.primaryPosition === 'Left Wing').length,
  hashes: {
    LB: hashPos('Left Back'),
    RB: hashPos('Right Back'),
    CB: hashPos('Centre Back'),
    RW: hashPos('Right Wing'),
  },
};

const existingIds = new Set(bank.map((s) => s.id));
const START = 941;
const ids = [];
for (let i = 0; i < 10; i++) {
  const id = `scn_bank_${START + i}`;
  if (existingIds.has(id)) throw new Error(`ID already exists: ${id}`);
  ids.push(id);
}

// Remove previous pilot insertion if re-run
const cleaned = bank.filter((s) => {
  const n = Number(String(s.id).replace(/\D/g, ''));
  return !(s.primaryPosition === 'Left Wing' && n >= 941 && n <= 950);
});

const areas = new Set();
const keys = new Set();
const added = [];

for (let i = 0; i < pilots.length; i++) {
  const f = pilots[i];
  if (areas.has(f.teachingArea)) throw new Error(`Duplicate teachingArea: ${f.teachingArea}`);
  if (keys.has(f.familyKey)) throw new Error(`Duplicate familyKey: ${f.familyKey}`);
  areas.add(f.teachingArea);
  keys.add(f.familyKey);

  const qs = f.answers.map((a) => a.quality).join(',');
  if (qs !== 'optimal,good,risky,poor') {
    throw new Error(`${f.familyKey}: qualities=${qs}`);
  }
  if (!f.whyCorrectOverSecondBest?.hr) {
    throw new Error(`Missing whyCorrectOverSecondBest: ${f.familyKey}`);
  }

  const skillTags = [
    ...(f.skillTags || []),
    ...(f.perception && !(f.skillTags || []).includes('perception') ? ['perception'] : []),
    ...(f.handedness && f.handedness !== 'none' ? [`handedness:${f.handedness}`] : []),
    ...(f.numerical && f.numerical !== '6v6' && !(f.skillTags || []).some((t) => String(t).startsWith('numerical:'))
      ? [`numerical:${f.numerical}`]
      : []),
    ...(f.gameState && f.gameState !== 'none' ? [`gameState:${f.gameState}`] : []),
    `family:${f.familyKey}`,
    `pilot:${f.pilotId}`,
  ];

  const scenario = {
    id: ids[i],
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
    ...(f.defensiveSystem ? { defensiveSystem: f.defensiveSystem } : {}),
    situation: f.situation,
    question: f.question,
    answers: f.answers,
    explanation: f.explanation,
    whyCorrectOverSecondBest: f.whyCorrectOverSecondBest,
    skillTags,
    qualityScore: 8.6,
  };

  cleaned.push(scenario);
  added.push({ id: scenario.id, familyKey: f.familyKey, teachingArea: f.teachingArea });
}

const afterHashes = {
  LB: crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.filter((s) => s.primaryPosition === 'Left Back')))
    .digest('hex'),
  RB: crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.filter((s) => s.primaryPosition === 'Right Back')))
    .digest('hex'),
  CB: crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.filter((s) => s.primaryPosition === 'Centre Back')))
    .digest('hex'),
  RW: crypto
    .createHash('sha256')
    .update(JSON.stringify(cleaned.filter((s) => s.primaryPosition === 'Right Wing')))
    .digest('hex'),
};

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  if (afterHashes[k] !== before.hashes[k]) {
    throw new Error(`LOCKED BANK HASH CHANGED: ${k}`);
  }
}

writeFileSync(bankPath, JSON.stringify(cleaned, null, 2) + '\n');

const mapping = {
  insertedAt: new Date().toISOString(),
  ids,
  added,
  countsBefore: before,
  countsAfter: {
    LB: cleaned.filter((s) => s.primaryPosition === 'Left Back').length,
    RB: cleaned.filter((s) => s.primaryPosition === 'Right Back').length,
    CB: cleaned.filter((s) => s.primaryPosition === 'Centre Back').length,
    RW: cleaned.filter((s) => s.primaryPosition === 'Right Wing').length,
    LW: cleaned.filter((s) => s.primaryPosition === 'Left Wing').length,
  },
  lockedHashesUnchanged: true,
};

writeFileSync(
  join(root, 'scripts/lw-gold-pilot-mapping.json'),
  JSON.stringify(mapping, null, 2) + '\n',
);

console.log(
  JSON.stringify(
    {
      status: 'LW_PILOT_INSERTED',
      ids,
      lwCount: mapping.countsAfter.LW,
      lockedOk: true,
    },
    null,
    2,
  ),
);
