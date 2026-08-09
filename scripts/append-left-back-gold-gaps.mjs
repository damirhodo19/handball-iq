#!/usr/bin/env node
/**
 * Append-only Left Back gap-closure families.
 * Does NOT regenerate bank or rewrite existing LB families.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LEFT_BACK_GOLD_FAMILIES_C } from './scenario-bank/data/left-back-gold-families-c.mjs';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));

const existingTitles = new Set(
  bank.filter((s) => s.primaryPosition === 'Left Back').map((s) => s.title?.en),
);
const existingKeys = new Set();

let nextId = Math.max(...bank.map((s) => Number(String(s.id).replace(/\D/g, '')) || 0)) + 1;
const added = [];
const skipped = [];

for (const f of LEFT_BACK_GOLD_FAMILIES_C) {
  if (existingTitles.has(f.title.en)) {
    skipped.push({ familyKey: f.familyKey, reason: 'title exists' });
    continue;
  }
  // Clean accidental draft text
  const situation = { ...f.situation };
  if (/wait EN/i.test(situation.en || '')) {
    throw new Error(`Draft text left in ${f.familyKey}`);
  }

  const scenario = {
    id: `scn_bank_${nextId++}`,
    title: f.title,
    category: 'Left Back',
    primaryPosition: 'Left Back',
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
    skillTags: f.skillTags || [],
    qualityScore: 8.8,
  };

  const scored = scoreRubricV2(scenario, {
    singleBestOk: f.human?.singleBestOk !== false,
    cueSpecific: f.human?.cueSpecific !== false,
    gameStateExplicit: true,
  });
  let overall = scored.overall + (Number(f.human?.rubricBias) || 0);
  overall = Math.max(7.5, Math.min(9.6, Math.round(overall * 10) / 10));
  scenario.qualityScore = overall;

  if (scored.dims.croatianNaturalness < 7 || scored.dims.singleBestIntegrity < 7 || scored.overall < 8) {
    throw new Error(`Rejected ${f.familyKey}: rubric ${JSON.stringify(scored)}`);
  }

  bank.push(scenario);
  added.push({ id: scenario.id, familyKey: f.familyKey, title: f.title.en, perception: !!f.perception });
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');

const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
const perceptionRe =
  /čitaš|prvi signal|koji je signal|koji je prvi signal|gdje nastaje|što ti pokazuje|što ti položaj|koji branič mora|koji se prostor|što se promijenilo|koju opciju|ne križaš|otvoriti sljedeća|što vratar/i;
const perc = lb.filter(
  (s) => perceptionRe.test(s.question?.hr || '') || (s.skillTags || []).includes('perception'),
).length;

const report = {
  added,
  skipped,
  lbPrimaryCount: lb.length,
  attack: lb.filter((s) => s.attackOrDefence === 'Attack').length,
  defence: lb.filter((s) => s.attackOrDefence === 'Defence').length,
  perceptionCount: perc,
  perceptionPct: Math.round((perc / lb.length) * 1000) / 10,
  difficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      lb.filter((s) => s.difficulty === d).length,
    ]),
  ),
};

writeFileSync(join(root, 'scripts/lb-gold-gap-closure-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
