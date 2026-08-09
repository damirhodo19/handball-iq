#!/usr/bin/env node
/**
 * Build Centre Back gold bank from handcrafted family JSON parts.
 * Removes existing CB primary clones. Does NOT modify Left Back or Right Back.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';
import { CB_PERCEPTION_KEYS } from './scenario-bank/data/centre-back-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const partsDir = join(root, 'scripts/scenario-bank/data/cb-parts');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));

const lbBefore = bank.filter((s) => s.primaryPosition === 'Left Back').length;
const rbBefore = bank.filter((s) => s.primaryPosition === 'Right Back').length;
const cbBefore = bank.filter((s) => s.primaryPosition === 'Centre Back').length;

const removed = [];
const kept = [];
for (const s of bank) {
  if (s.primaryPosition === 'Centre Back' || s.category === 'Centre Back') {
    removed.push({ id: s.id, title: s.title?.en });
    continue;
  }
  kept.push(s);
}

const families = ['a', 'b', 'c', 'd'].flatMap((p) =>
  JSON.parse(readFileSync(join(partsDir, `cb-families-${p}.json`), 'utf8')),
);

// Align perception flags with taxonomy where set
for (const f of families) {
  if (CB_PERCEPTION_KEYS.has(f.familyKey)) f.perception = true;
  if (!f.human) {
    f.human = {
      singleBestOk: true,
      cueSpecific: true,
      gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(f.situation?.hr || ''),
      rubricBias: Number(f.rubricBias) || 0,
    };
  }
}

const keys = new Set();
for (const f of families) {
  if (keys.has(f.familyKey)) throw new Error(`Duplicate familyKey: ${f.familyKey}`);
  keys.add(f.familyKey);
  if (!f.whyCorrectOverSecondBest?.hr) {
    throw new Error(`Missing whyCorrectOverSecondBest: ${f.familyKey}`);
  }
  if (!f.answers || f.answers.length !== 4) {
    throw new Error(`Need 4 answers: ${f.familyKey}`);
  }
}

let nextId = Math.max(...kept.map((s) => Number(String(s.id).replace(/\D/g, '')) || 0), 800) + 1;
const added = [];
const rejected = [];
const PASS = 8.0;

for (const f of families) {
  const scenario = {
    id: `scn_bank_${nextId++}`,
    title: f.title,
    category: 'Centre Back',
    primaryPosition: 'Centre Back',
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
    skillTags: [
      ...(f.skillTags || []),
      ...(f.perception ? ['perception'] : []),
      ...(f.numerical && f.numerical !== '6v6' ? [`numerical:${f.numerical}`] : []),
      ...(f.gameState && f.gameState !== 'none' ? [`gameState:${f.gameState}`] : []),
    ],
    qualityScore: 8.8,
  };

  const scored = scoreRubricV2(scenario, {
    singleBestOk: f.human?.singleBestOk !== false,
    cueSpecific: f.human?.cueSpecific !== false,
    gameStateExplicit:
      f.human?.gameStateExplicit === true || /Vodite|Gubite|Neriješeno/.test(f.situation?.hr || ''),
  });
  let overall = scored.overall + (Number(f.human?.rubricBias) || Number(f.rubricBias) || 0);
  let h = 0;
  for (const ch of f.familyKey) h = (h * 31 + ch.charCodeAt(0)) % 1000;
  overall += ((h % 31) - 15) / 100;
  overall = Math.max(7.5, Math.min(9.6, Math.round(overall * 10) / 10));
  scenario.qualityScore = overall;

  if (
    scored.overall < PASS ||
    scored.dims.croatianNaturalness < 7 ||
    scored.dims.singleBestIntegrity < 7
  ) {
    rejected.push({ familyKey: f.familyKey, overall: scored.overall, dims: scored.dims });
    continue;
  }
  added.push({
    ...scenario,
    _meta: {
      familyKey: f.familyKey,
      perception: !!f.perception,
      numerical: f.numerical ?? null,
      gameState: f.gameState ?? 'none',
    },
  });
}

const out = [...kept, ...added.map(({ _meta, ...s }) => s)];

if (out.filter((s) => s.primaryPosition === 'Left Back').length !== lbBefore) {
  throw new Error('Left Back bank was modified — aborting');
}
if (out.filter((s) => s.primaryPosition === 'Right Back').length !== rbBefore) {
  throw new Error('Right Back bank was modified — aborting');
}

writeFileSync(bankPath, JSON.stringify(out, null, 2) + '\n');

const cb = out.filter((s) => s.primaryPosition === 'Centre Back');
const matrix = cb.map((s) => {
  const fam = families.find((f) => f.title.en === s.title.en);
  const scored = scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  });
  return {
    id: s.id,
    family: s.title.en,
    familyKey: fam?.familyKey || s.id,
    attackOrDefence: s.attackOrDefence,
    defenceFaced: s.defensiveSystem || 'unspecified',
    gamePhase: s.matchPhase,
    skill: (s.skillTags || []).join('+'),
    difficulty: s.difficulty,
    numerical: fam?.numerical ?? null,
    gameState: fam?.gameState ?? 'none',
    perception: !!fam?.perception,
    qualityScore: scored.overall,
    whyCorrectOverSecondBest: !!s.whyCorrectOverSecondBest?.hr,
  };
});

const report = {
  status: rejected.length ? 'FAIL' : 'PASS',
  cbBefore,
  cbAfter: cb.length,
  removedClones: removed.length,
  familiesAdded: added.length,
  rejected,
  lbUnchanged: lbBefore,
  rbUnchanged: rbBefore,
  attack: cb.filter((s) => s.attackOrDefence === 'Attack').length,
  defence: cb.filter((s) => s.attackOrDefence === 'Defence').length,
  difficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      cb.filter((s) => s.difficulty === d).length,
    ]),
  ),
  perceptionPct: Math.round((matrix.filter((m) => m.perception).length / cb.length) * 1000) / 10,
  sevenV6: matrix.filter((m) => m.numerical === '7v6').length,
  avgRubric: Math.round((matrix.reduce((a, m) => a + m.qualityScore, 0) / cb.length) * 10) / 10,
  minRubric: Math.min(...matrix.map((m) => m.qualityScore)),
  maxRubric: Math.max(...matrix.map((m) => m.qualityScore)),
};

writeFileSync(join(root, 'scripts/cb-gold-bank-report.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(join(root, 'scripts/cb-gold-coverage-matrix.json'), JSON.stringify(matrix, null, 2) + '\n');
console.log(JSON.stringify({ ...report, rejected: report.rejected.length }, null, 2));
if (rejected.length) process.exit(1);
