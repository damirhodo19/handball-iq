#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_75 } from './scenario-bank/data/goalkeeper-gold-75.mjs';
import { GOALKEEPER_GOLD_FAMILIES, GOALKEEPER_LEGACY_BASELINE_HASH } from './scenario-bank/data/goalkeeper-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperRuntimeLock = (() => { try { return JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8')); } catch { return null; } })();
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hashPosition = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));
const taxonomy = GOALKEEPER_GOLD_FAMILIES.map(({ familyKey }) => familyKey);
const taxonomySet = new Set(taxonomy);
const errors = [];
const warnings = [];
const seen = { family: new Set(), title: new Set(), fingerprint: new Set() };
const coverage = { difficulty: {}, attackDefence: {}, areas: {}, perception: 0 };
const HR_BAD = [/golman/i, /protunapad/i, /središnji stražnji/i, /\bfeed\b/i, /\bkeeper\b/i, /take-off/i, /bacačko rame/i, /opterećeni kuk/i, /stvarni osnovni položaj/i, /živi signal/i, /živi šut/i, /oba kuka/i];
const DE_BAD = [/\bKeeper\b/i, /\bfeed\b/i, /take-off/i];
const tokenSet = (scenario) => new Set(`${scenario.situation.en} ${scenario.question.en} ${scenario.answers[0].text.en}`.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 4));

if (GOALKEEPER_GOLD_75.length !== 75) errors.push('Source count is not 75');
for (const scenario of GOALKEEPER_GOLD_75) {
  const id = scenario.pilotId || scenario.batchId;
  if (!taxonomySet.has(scenario.familyKey)) errors.push(`${id}: family absent from taxonomy`);
  if (seen.family.has(scenario.familyKey)) errors.push(`${id}: duplicate family`); else seen.family.add(scenario.familyKey);
  const title = scenario.title.en.toLowerCase();
  if (seen.title.has(title)) errors.push(`${id}: duplicate title`); else seen.title.add(title);
  const fingerprint = JSON.stringify([scenario.fingerprint?.cue, scenario.fingerprint?.decision]);
  if (seen.fingerprint.has(fingerprint)) errors.push(`${id}: duplicate fingerprint`); else seen.fingerprint.add(fingerprint);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${id}: answer ladder`);
  if (!scenario.perception) errors.push(`${id}: perception flag missing`);
  const localized = [scenario.title, scenario.situation, scenario.question, scenario.explanation, scenario.whyCorrectOverSecondBest, ...scenario.answers.flatMap((answer) => [answer.text, answer.feedback])];
  for (const locale of ['en', 'hr', 'de']) {
    if (localized.some((node) => !node?.[locale]?.trim())) errors.push(`${id}: missing ${locale}`);
    const answerTexts = scenario.answers.map(({ text }) => text[locale].trim().toLowerCase());
    if (new Set(answerTexts).size !== 4) errors.push(`${id}: duplicate answer text ${locale}`);
  }
  const hr = localized.map((node) => node.hr).join('\n');
  const de = localized.map((node) => node.de).join('\n');
  for (const pattern of HR_BAD) if (pattern.test(hr)) errors.push(`${id}: HR blacklist ${pattern}`);
  for (const pattern of DE_BAD) if (pattern.test(de)) errors.push(`${id}: DE blacklist ${pattern}`);
  if (!scenario.title.en.startsWith('Goalkeeper —') || !scenario.title.hr.startsWith('Vratar —') || !scenario.title.de.startsWith('Torwart —')) errors.push(`${id}: title identity`);
  coverage.difficulty[scenario.difficulty] = (coverage.difficulty[scenario.difficulty] || 0) + 1;
  coverage.attackDefence[scenario.attackOrDefence] = (coverage.attackDefence[scenario.attackOrDefence] || 0) + 1;
  coverage.areas[scenario.teachingArea] = (coverage.areas[scenario.teachingArea] || 0) + 1;
  coverage.perception += 1;
}

if (seen.family.size !== taxonomy.length || taxonomy.some((family) => !seen.family.has(family))) errors.push('Taxonomy coverage is incomplete');
for (const [area, expected] of Object.entries({ backcourt_positioning_and_release_cues: 15, wing_pivot_and_close_range: 15, breakaway_and_seven_metre: 15, defence_cooperation_and_numbers: 15, distribution_and_transition_attack: 8, mental_endgame_and_communication: 7 })) {
  if (coverage.areas[area] !== expected) errors.push(`${area}: coverage ${coverage.areas[area] || 0} !== ${expected}`);
}

const semanticRisks = [];
for (let i = 0; i < GOALKEEPER_GOLD_75.length; i += 1) {
  const left = tokenSet(GOALKEEPER_GOLD_75[i]);
  for (let j = i + 1; j < GOALKEEPER_GOLD_75.length; j += 1) {
    const right = tokenSet(GOALKEEPER_GOLD_75[j]);
    const overlap = [...left].filter((token) => right.has(token)).length;
    const ratio = overlap / Math.max(1, Math.min(left.size, right.size));
    if (ratio >= 0.72 && overlap >= 10) semanticRisks.push({ a: GOALKEEPER_GOLD_75[i].familyKey, b: GOALKEEPER_GOLD_75[j].familyKey, ratio: Math.round(ratio * 100) / 100 });
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic similarity pair(s)`);

const setPoint = GOALKEEPER_GOLD_75.find(({ familyKey }) => familyKey === 'gk_7m_set_point');
if (!setPoint?.answers[0].text.hr.includes('barem jedno stopalo')) errors.push('Seven-metre four-metre rule wording drift');
const substitution = GOALKEEPER_GOLD_75.find(({ familyKey }) => familyKey === 'gk_substitution_readiness');
if (!substitution?.situation.en.includes('before the thrower')) errors.push('Seven-metre substitution window wording drift');

const lockCheck = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  lockCheck[key] = { expected: manifest.positions[key].contentHash, actual: hashPosition(position) };
  lockCheck[key].ok = lockCheck[key].expected === lockCheck[key].actual;
  if (!lockCheck[key].ok) errors.push(`${key} Gold drift`);
}
const pivotCheck = { expected: pivotLock.contentHash, actual: hashPosition('Pivot') };
pivotCheck.ok = pivotCheck.expected === pivotCheck.actual;
if (!pivotCheck.ok) errors.push('Pivot Gold drift');
const goalkeeperCheck = { allowed: [GOALKEEPER_LEGACY_BASELINE_HASH, goalkeeperRuntimeLock?.contentHash].filter(Boolean), actual: hashPosition('Goalkeeper') };
goalkeeperCheck.ok = goalkeeperCheck.allowed.includes(goalkeeperCheck.actual);
if (!goalkeeperCheck.ok) errors.push('Goalkeeper bank drift');

const report = { status: errors.length ? 'FAIL' : 'GOALKEEPER GOLD 75 SOURCE READY FOR RUNTIME CUTOVER', generatedAt: new Date().toISOString(), sourceGoldCount: GOALKEEPER_GOLD_75.length, taxonomyCount: taxonomy.length, sourceHash: hash(GOALKEEPER_GOLD_75), coverage, semanticRisks, lockCheck, pivotCheck, goalkeeperCheck, errors, warnings };
writeFileSync(join(root, 'scripts/goalkeeper-gold-full-source-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, sourceGoldCount: report.sourceGoldCount, taxonomyCount: report.taxonomyCount, semanticRisks: semanticRisks.length, coverage: report.coverage.areas, lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok), pivotGoldStable: pivotCheck.ok, goalkeeperBankStable: goalkeeperCheck.ok, errors: errors.length, warnings: warnings.length }, null, 2));
if (errors.length) process.exit(1);
