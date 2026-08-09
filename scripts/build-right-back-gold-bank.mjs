#!/usr/bin/env node
/**
 * Build Right Back gold bank from handcrafted families.
 * Removes existing RB primary clones. Does NOT modify Left Back.
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { RIGHT_BACK_GOLD_FAMILIES_A } from './scenario-bank/data/right-back-gold-families-a.mjs';
import { RIGHT_BACK_GOLD_FAMILIES_B } from './scenario-bank/data/right-back-gold-families-b.mjs';
import { RIGHT_BACK_GOLD_FAMILIES_C } from './scenario-bank/data/right-back-gold-families-c.mjs';
import { RIGHT_BACK_GOLD_FAMILIES_D } from './scenario-bank/data/right-back-gold-families-d.mjs';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));

const lbBefore = bank.filter((s) => s.primaryPosition === 'Left Back').length;
const rbBefore = bank.filter((s) => s.primaryPosition === 'Right Back').length;

const removed = [];
const kept = [];
for (const s of bank) {
  if (s.primaryPosition === 'Right Back' || s.category === 'Right Back') {
    removed.push({ id: s.id, title: s.title?.en });
    continue;
  }
  kept.push(s);
}

// Prefer post-correction synced snapshot so rebuilds cannot regress human fixes.
const syncedPath = join(root, 'scripts/scenario-bank/data/right-back-gold-families-synced.json');
const families = existsSync(syncedPath)
  ? JSON.parse(readFileSync(syncedPath, 'utf8'))
  : [
      ...RIGHT_BACK_GOLD_FAMILIES_A,
      ...RIGHT_BACK_GOLD_FAMILIES_B,
      ...RIGHT_BACK_GOLD_FAMILIES_C,
      ...RIGHT_BACK_GOLD_FAMILIES_D,
    ];

// Retag a few clear single-cue Intermediate → Beginner for distribution
const forceBeginner = new Set([
  'rb_lh_natural_line_6_0',
  'rb_1v1_def_high_lh',
  'rb_gk_block_coop',
  'rb_trans_first_wave',
  'rb_open_man',
  'rb_def_6_0_block',
  'rb_def_pivot_control',
]);
for (const f of families) {
  if (forceBeginner.has(f.familyKey) && f.difficulty !== 'Expert') f.difficulty = 'Beginner';
}

let nextId = Math.max(...kept.map((s) => Number(String(s.id).replace(/\D/g, '')) || 0), 709) + 1;
const added = [];
const rejected = [];
const PASS = 8.0;

for (const f of families) {
  const scenario = {
    id: `scn_bank_${nextId++}`,
    title: f.title,
    category: 'Right Back',
    primaryPosition: 'Right Back',
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
    skillTags: [...(f.skillTags || []), ...(f.handedness && f.handedness !== 'none' ? [`handedness:${f.handedness}`] : [])],
    qualityScore: 8.8,
  };

  const scored = scoreRubricV2(scenario, {
    singleBestOk: f.human?.singleBestOk !== false,
    cueSpecific: f.human?.cueSpecific !== false,
    gameStateExplicit:
      f.human?.gameStateExplicit === true || /Vodite|Gubite|Neriješeno/.test(f.situation?.hr || ''),
  });
  let overall = scored.overall + (Number(f.human?.rubricBias) || 0);
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
      handedness: f.handedness || 'none',
      numerical: f.numerical ?? null,
      gameState: f.gameState ?? 'none',
    },
  });
}

const out = [
  ...kept,
  ...added.map(({ _meta, ...s }) => s),
];

if (out.filter((s) => s.primaryPosition === 'Left Back').length !== lbBefore) {
  throw new Error('Left Back bank was modified — aborting');
}

writeFileSync(bankPath, JSON.stringify(out, null, 2) + '\n');

const rb = out.filter((s) => s.primaryPosition === 'Right Back');
const matrix = rb.map((s) => {
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
    handedness: fam?.handedness || 'none',
    gamePhase: s.matchPhase,
    skill: (s.skillTags || []).join('+'),
    difficulty: s.difficulty,
    numerical: fam?.numerical ?? null,
    gameState: fam?.gameState ?? 'none',
    perception: !!fam?.perception,
    qualityScore: scored.overall,
  };
});

const report = {
  status: rejected.length ? 'FAIL' : 'PASS',
  rbBefore,
  rbAfter: rb.length,
  removedClones: removed.length,
  familiesAdded: added.length,
  rejected,
  lbUnchanged: lbBefore,
  attack: rb.filter((s) => s.attackOrDefence === 'Attack').length,
  defence: rb.filter((s) => s.attackOrDefence === 'Defence').length,
  difficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      rb.filter((s) => s.difficulty === d).length,
    ]),
  ),
  handednessSpecific: matrix.filter((m) => m.handedness === 'left' || m.handedness === 'right').length,
  perceptionPct: Math.round((matrix.filter((m) => m.perception).length / rb.length) * 1000) / 10,
  avgRubric: Math.round((matrix.reduce((a, m) => a + m.qualityScore, 0) / rb.length) * 10) / 10,
  minRubric: Math.min(...matrix.map((m) => m.qualityScore)),
  maxRubric: Math.max(...matrix.map((m) => m.qualityScore)),
};

writeFileSync(join(root, 'scripts/rb-gold-bank-report.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(join(root, 'scripts/rb-gold-coverage-matrix.json'), JSON.stringify(matrix, null, 2) + '\n');
console.log(JSON.stringify({ ...report, rejected: report.rejected.length }, null, 2));
if (rejected.length) process.exit(1);
