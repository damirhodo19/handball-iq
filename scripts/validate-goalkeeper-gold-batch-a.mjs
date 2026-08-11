#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_PILOT_10 } from './scenario-bank/data/goalkeeper-gold-pilot-10.mjs';
import { GOALKEEPER_GOLD_BATCH_A_15 } from './scenario-bank/data/goalkeeper-gold-batch-a-15.mjs';
import { GOALKEEPER_GOLD_FAMILIES, GOALKEEPER_LEGACY_BASELINE_HASH } from './scenario-bank/data/goalkeeper-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperRuntimeLock = (() => { try { return JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8')); } catch { return null; } })();
const all = [...GOALKEEPER_GOLD_PILOT_10, ...GOALKEEPER_GOLD_BATCH_A_15];
const taxonomy = new Set(GOALKEEPER_GOLD_FAMILIES.map(({ familyKey }) => familyKey));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hashPosition = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));
const errors = [];
const warnings = [];
const seen = { family: new Set(), title: new Set(), fingerprint: new Set() };
const coverage = { difficulty: {}, attackDefence: {}, areas: {}, perception: 0 };
const HR_BAD = [/golman/i, /protunapad/i, /središnji stražnji/i, /\bfeed\b/i, /\bkeeper\b/i, /take-off/i, /bacačko rame/i, /opterećeni kuk/i, /stvarni osnovni položaj/i, /živi signal/i, /živi šut/i];
const DE_BAD = [/\bKeeper\b/i, /\bfeed\b/i, /take-off/i];
const tokenSet = (scenario) => new Set(`${scenario.situation.en} ${scenario.question.en} ${scenario.answers[0].text.en}`.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 4));

if (GOALKEEPER_GOLD_BATCH_A_15.length !== 15 || all.length !== 25) errors.push('Source count mismatch');
for (const scenario of all) {
  const id = scenario.pilotId || scenario.batchId;
  if (!taxonomy.has(scenario.familyKey)) errors.push(`${id}: family absent from taxonomy`);
  if (seen.family.has(scenario.familyKey)) errors.push(`${id}: duplicate family`); else seen.family.add(scenario.familyKey);
  const title = scenario.title.en.toLowerCase();
  if (seen.title.has(title)) errors.push(`${id}: duplicate title`); else seen.title.add(title);
  const fingerprint = JSON.stringify([scenario.fingerprint?.cue, scenario.fingerprint?.decision]);
  if (seen.fingerprint.has(fingerprint)) errors.push(`${id}: duplicate fingerprint`); else seen.fingerprint.add(fingerprint);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${id}: answer ladder`);
  const localized = [scenario.title, scenario.situation, scenario.question, scenario.explanation, scenario.whyCorrectOverSecondBest, ...scenario.answers.flatMap((answer) => [answer.text, answer.feedback])];
  for (const locale of ['en', 'hr', 'de']) if (localized.some((node) => !node?.[locale]?.trim())) errors.push(`${id}: missing ${locale}`);
  const hr = localized.map((node) => node.hr).join('\n');
  const de = localized.map((node) => node.de).join('\n');
  for (const pattern of HR_BAD) if (pattern.test(hr)) errors.push(`${id}: HR blacklist ${pattern}`);
  for (const pattern of DE_BAD) if (pattern.test(de)) errors.push(`${id}: DE blacklist ${pattern}`);
  if (!scenario.title.en.startsWith('Goalkeeper —') || !scenario.title.hr.startsWith('Vratar —') || !scenario.title.de.startsWith('Torwart —')) errors.push(`${id}: title identity`);
  coverage.difficulty[scenario.difficulty] = (coverage.difficulty[scenario.difficulty] || 0) + 1;
  coverage.attackDefence[scenario.attackOrDefence] = (coverage.attackDefence[scenario.attackOrDefence] || 0) + 1;
  coverage.areas[scenario.teachingArea] = (coverage.areas[scenario.teachingArea] || 0) + 1;
  if (scenario.perception) coverage.perception += 1;
}

const semanticRisks = [];
for (let i = 0; i < all.length; i += 1) {
  const left = tokenSet(all[i]);
  for (let j = i + 1; j < all.length; j += 1) {
    const right = tokenSet(all[j]);
    const overlap = [...left].filter((token) => right.has(token)).length;
    const ratio = overlap / Math.max(1, Math.min(left.size, right.size));
    if (ratio >= 0.72 && overlap >= 10) semanticRisks.push({ a: all[i].familyKey, b: all[j].familyKey, ratio: Math.round(ratio * 100) / 100 });
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic similarity pair(s)`);

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

const report = { status: errors.length ? 'FAIL' : 'GOALKEEPER GOLD BATCH A READY FOR HUMAN COACH REVIEW', generatedAt: new Date().toISOString(), sourceGoldCount: all.length, fullTarget: GOALKEEPER_GOLD_FAMILIES.length, batchACount: GOALKEEPER_GOLD_BATCH_A_15.length, sourceHash: hash(all), coverage, semanticRisks, lockCheck, pivotCheck, goalkeeperCheck, errors, warnings };
writeFileSync(join(root, 'scripts/goalkeeper-gold-batch-a-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, sourceGoldCount: report.sourceGoldCount, fullTarget: report.fullTarget, semanticRisks: semanticRisks.length, lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok), pivotGoldStable: pivotCheck.ok, goalkeeperBankStable: goalkeeperCheck.ok, errors: errors.length, warnings: warnings.length }, null, 2));
if (errors.length) process.exit(1);
