#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_PILOT_14 } from './scenario-bank/data/coach-gold-pilot-14.mjs';
import {
  COACH_GOLD_CATEGORIES,
  COACH_GOLD_FAMILIES,
  COACH_GOLD_PILOT_FAMILY_KEYS,
  COACH_LEGACY_SOURCE_HASHES,
  COACH_TYPES,
  EXPERIENCE_BANDS,
} from './scenario-bank/data/coach-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const bank = readJson('content/scenario-bank/scenarios.json');
const manifest = readJson('scripts/gold-bank-final-lock-manifest.json');
const pivotLock = readJson('scripts/pivot-gold-runtime-lock.json');
const goalkeeperLock = readJson('scripts/goalkeeper-gold-runtime-lock.json');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const textHash = (path) => createHash('sha256').update(readFileSync(join(root, path), 'utf8')).digest('hex');
const errors = [];
const warnings = [];

const positionNames = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' };
const lockCheck = Object.fromEntries(Object.entries(positionNames).map(([key, position]) => {
  const expected = manifest.positions[key].contentHash;
  const actual = hash(bank.filter(({ primaryPosition }) => primaryPosition === position));
  if (expected !== actual) errors.push(`${key} Gold hash drift`);
  return [key, { expected, actual, ok: expected === actual }];
}));
const pivotActual = hash(bank.filter(({ primaryPosition }) => primaryPosition === 'Pivot'));
const goalkeeperActual = hash(bank.filter(({ primaryPosition }) => primaryPosition === 'Goalkeeper'));
if (pivotActual !== pivotLock.contentHash) errors.push('Pivot Gold hash drift');
if (goalkeeperActual !== goalkeeperLock.contentHash) errors.push('Goalkeeper Gold hash drift');

const coachRuntimeCheck = Object.fromEntries(Object.entries(COACH_LEGACY_SOURCE_HASHES).map(([path, expected]) => {
  const actual = textHash(path);
  if (expected !== actual) errors.push(`${path}: active Coach runtime changed during source pilot`);
  return [path, { expected, actual, ok: expected === actual }];
}));

if (COACH_GOLD_FAMILIES.length !== 70) errors.push(`Taxonomy count ${COACH_GOLD_FAMILIES.length} !== 70`);
for (const category of COACH_GOLD_CATEGORIES) {
  const count = COACH_GOLD_FAMILIES.filter((family) => family.category === category).length;
  if (count !== 10) errors.push(`${category}: taxonomy count ${count} !== 10`);
}
if (COACH_GOLD_PILOT_14.length !== 14) errors.push(`Pilot count ${COACH_GOLD_PILOT_14.length} !== 14`);
if (new Set(COACH_GOLD_PILOT_14.map(({ id }) => id)).size !== 14) errors.push('Pilot IDs are not unique');
if (new Set(COACH_GOLD_PILOT_14.map(({ familyKey }) => familyKey)).size !== 14) errors.push('Pilot family keys are not unique');
for (const familyKey of COACH_GOLD_PILOT_FAMILY_KEYS) {
  if (!COACH_GOLD_PILOT_14.some((scenario) => scenario.familyKey === familyKey)) errors.push(`Missing pilot family ${familyKey}`);
}

const normalize = (value) => String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9čćžšđäöüß\s]/gi, ' ').replace(/\s+/g, ' ').trim();
const hrBlacklist = /\b(cue|reset|outlet|head coach|LB|RB|constraint|match-specific|session|timing|performance|startera?)\b/i;
const decisionBlobs = [];
for (const scenario of COACH_GOLD_PILOT_14) {
  if (!COACH_GOLD_CATEGORIES.includes(scenario.category)) errors.push(`${scenario.id}: invalid category`);
  if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(scenario.difficulty)) errors.push(`${scenario.id}: invalid difficulty`);
  if (!scenario.coachTypeTags.length || scenario.coachTypeTags.some((tag) => !COACH_TYPES.includes(tag))) errors.push(`${scenario.id}: invalid coachTypeTags`);
  if (!scenario.experienceTags.length || scenario.experienceTags.some((tag) => !EXPERIENCE_BANDS.includes(tag))) errors.push(`${scenario.id}: invalid experienceTags`);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.id}: answer ladder`);
  if (scenario.answers.map(({ id }) => id).join(',') !== 'a,b,c,d') errors.push(`${scenario.id}: answer IDs`);
  const localized = [
    ['situation', scenario.situation],
    ['question', scenario.question],
    ['explanation', scenario.explanation],
    ...scenario.answers.flatMap((answer, index) => [
      [`answers.${index}.text`, answer.text],
      [`answers.${index}.feedback`, answer.feedback],
    ]),
  ];
  for (const [field, value] of localized) {
    for (const locale of ['en', 'hr', 'de']) {
      if (!value?.[locale]?.trim()) errors.push(`${scenario.id}: ${field}.${locale} missing`);
    }
    if (hrBlacklist.test(value.hr)) errors.push(`${scenario.id}: ${field}.hr contains non-native term: ${value.hr.match(hrBlacklist)?.[0]}`);
    if (new Set(['en', 'hr', 'de'].map((locale) => normalize(value[locale]))).size !== 3) errors.push(`${scenario.id}: ${field} locale copy`);
  }
  for (const locale of ['en', 'hr', 'de']) {
    const answerTexts = scenario.answers.map(({ text }) => normalize(text[locale]));
    if (new Set(answerTexts).size !== 4) errors.push(`${scenario.id}: duplicate ${locale} answer text`);
  }
  if (normalize(scenario.answers[0].text.en) === normalize(scenario.answers[1].text.en)) errors.push(`${scenario.id}: optimal and good are identical`);
  decisionBlobs.push({
    id: scenario.id,
    familyKey: scenario.familyKey,
    tokens: new Set(normalize(`${scenario.question.en} ${scenario.answers[0].text.en}`).split(' ').filter((token) => token.length > 3)),
  });
}

const semanticRisks = [];
for (let i = 0; i < decisionBlobs.length; i++) {
  for (let j = i + 1; j < decisionBlobs.length; j++) {
    const a = decisionBlobs[i];
    const b = decisionBlobs[j];
    let intersection = 0;
    for (const token of a.tokens) if (b.tokens.has(token)) intersection++;
    const similarity = intersection / (a.tokens.size + b.tokens.size - intersection || 1);
    if (similarity >= 0.62) semanticRisks.push({ a: a.id, b: b.id, similarity: Number(similarity.toFixed(3)) });
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic decision overlap(s)`);

const coverage = {
  categories: Object.fromEntries(COACH_GOLD_CATEGORIES.map((category) => [category, COACH_GOLD_PILOT_14.filter((scenario) => scenario.category === category).length])),
  difficulty: Object.fromEntries(['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((difficulty) => [difficulty, COACH_GOLD_PILOT_14.filter((scenario) => scenario.difficulty === difficulty).length])),
  coachTypes: Object.fromEntries(COACH_TYPES.map((tag) => [tag, COACH_GOLD_PILOT_14.filter(({ coachTypeTags }) => coachTypeTags.includes(tag)).length])),
  experience: Object.fromEntries(EXPERIENCE_BANDS.map((tag) => [tag, COACH_GOLD_PILOT_14.filter(({ experienceTags }) => experienceTags.includes(tag)).length])),
};
for (const [category, count] of Object.entries(coverage.categories)) if (count !== 2) errors.push(`${category}: pilot count ${count} !== 2`);

const report = {
  status: errors.length ? 'FAIL' : 'COACH GOLD PILOT 14 READY FOR HUMAN COACH REVIEW',
  generatedAt: new Date().toISOString(),
  pilotCount: COACH_GOLD_PILOT_14.length,
  fullTarget: COACH_GOLD_FAMILIES.length,
  sourceHash: hash(COACH_GOLD_PILOT_14),
  familyCount: new Set(COACH_GOLD_PILOT_14.map(({ familyKey }) => familyKey)).size,
  coverage,
  semanticRisks,
  lockedPlayerBanks: {
    originalGold: lockCheck,
    pivot: { expected: pivotLock.contentHash, actual: pivotActual, ok: pivotLock.contentHash === pivotActual },
    goalkeeper: { expected: goalkeeperLock.contentHash, actual: goalkeeperActual, ok: goalkeeperLock.contentHash === goalkeeperActual },
  },
  activeCoachRuntimeStable: coachRuntimeCheck,
  runtimeCutoverPerformed: false,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/coach-gold-pilot-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  pilotCount: report.pilotCount,
  fullTarget: report.fullTarget,
  familyCount: report.familyCount,
  categories: report.coverage.categories,
  semanticRisks: report.semanticRisks.length,
  lockedPlayerBanksStable: Object.values(lockCheck).every(({ ok }) => ok) && report.lockedPlayerBanks.pivot.ok && report.lockedPlayerBanks.goalkeeper.ok,
  activeCoachRuntimeStable: Object.values(coachRuntimeCheck).every(({ ok }) => ok),
  errors: errors.length,
  warnings: warnings.length,
}, null, 2));
if (errors.length) process.exit(1);
