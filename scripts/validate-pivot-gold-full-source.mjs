#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_60 } from './scenario-bank/data/pivot-gold-60.mjs';
import {
  GOALKEEPER_LEGACY_BASELINE_HASH,
  PIVOT_GOLD_FAMILIES,
  PIVOT_GOLD_TARGET,
  PIVOT_LEGACY_BASELINE_HASH,
} from './scenario-bank/data/pivot-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hashPosition = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));
const taxonomy = new Set(PIVOT_GOLD_FAMILIES.map(({ familyKey }) => familyKey));
const errors = [];
const warnings = [];
const seen = { family: new Set(), title: new Set(), fingerprint: new Set() };
const coverage = { difficulty: {}, attackDefence: {}, systems: {}, areas: {}, perception: 0 };
const HR_BAD = [/\bPrimate\b/i, /\bHvatate\b/i, /zapečaćen/i, /krivotvoren/i, /utičnic/i, /take-off/i, /goalkeeper/i, /\bfeed\b/i, /protunapad/i, /središnji stražnji/i];
const DE_BAD = [/take-off/i, /goalkeeper/i, /\bfeed\b/i];
const tokenSet = (scenario) => new Set(
  `${scenario.situation.en} ${scenario.question.en} ${scenario.answers[0].text.en}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 4),
);

if (PIVOT_GOLD_60.length !== PIVOT_GOLD_TARGET) errors.push('Source count mismatch');

for (const scenario of PIVOT_GOLD_60) {
  const id = scenario.pilotId || scenario.batchId;
  if (!taxonomy.has(scenario.familyKey)) errors.push(`${id}: family absent from taxonomy`);
  if (seen.family.has(scenario.familyKey)) errors.push(`${id}: duplicate family`); else seen.family.add(scenario.familyKey);
  const title = scenario.title.en.toLowerCase();
  if (seen.title.has(title)) errors.push(`${id}: duplicate title`); else seen.title.add(title);
  const fingerprint = JSON.stringify([
    scenario.fingerprint?.objective,
    scenario.fingerprint?.cue,
    scenario.fingerprint?.decision,
  ]);
  if (seen.fingerprint.has(fingerprint)) errors.push(`${id}: duplicate fingerprint`); else seen.fingerprint.add(fingerprint);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${id}: answer ladder`);

  const localized = [
    scenario.title,
    scenario.situation,
    scenario.question,
    scenario.explanation,
    scenario.whyCorrectOverSecondBest,
    ...scenario.answers.flatMap((answer) => [answer.text, answer.feedback]),
  ];
  for (const locale of ['en', 'hr', 'de']) {
    if (localized.some((node) => !node?.[locale]?.trim())) errors.push(`${id}: missing ${locale}`);
  }
  const hr = localized.map((node) => node.hr).join('\n');
  const de = localized.map((node) => node.de).join('\n');
  for (const pattern of HR_BAD) if (pattern.test(hr)) errors.push(`${id}: HR blacklist ${pattern}`);
  for (const pattern of DE_BAD) if (pattern.test(de)) errors.push(`${id}: DE blacklist ${pattern}`);
  if (!scenario.title.en.startsWith('Pivot —') || !scenario.title.hr.startsWith('Pivot —') || !scenario.title.de.startsWith('Kreisläufer —')) {
    errors.push(`${id}: title identity`);
  }

  coverage.difficulty[scenario.difficulty] = (coverage.difficulty[scenario.difficulty] || 0) + 1;
  coverage.attackDefence[scenario.attackOrDefence] = (coverage.attackDefence[scenario.attackOrDefence] || 0) + 1;
  const system = scenario.defensiveSystem || scenario.matchPhase;
  coverage.systems[system] = (coverage.systems[system] || 0) + 1;
  coverage.areas[scenario.teachingArea] = (coverage.areas[scenario.teachingArea] || 0) + 1;
  if (scenario.perception) coverage.perception += 1;
}

const missingFamilies = [...taxonomy].filter((family) => !seen.family.has(family));
const unexpectedFamilies = [...seen.family].filter((family) => !taxonomy.has(family));
if (missingFamilies.length) errors.push(`Missing taxonomy families: ${missingFamilies.join(', ')}`);
if (unexpectedFamilies.length) errors.push(`Unexpected families: ${unexpectedFamilies.join(', ')}`);

const semanticRisks = [];
for (let i = 0; i < PIVOT_GOLD_60.length; i += 1) {
  const left = tokenSet(PIVOT_GOLD_60[i]);
  for (let j = i + 1; j < PIVOT_GOLD_60.length; j += 1) {
    const right = tokenSet(PIVOT_GOLD_60[j]);
    const overlap = [...left].filter((token) => right.has(token)).length;
    const ratio = overlap / Math.max(1, Math.min(left.size, right.size));
    if (ratio >= 0.72 && overlap >= 10) {
      semanticRisks.push({
        a: PIVOT_GOLD_60[i].familyKey,
        b: PIVOT_GOLD_60[j].familyKey,
        ratio: Math.round(ratio * 100) / 100,
      });
    }
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic similarity pair(s)`);

const lockCheck = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  lockCheck[key] = { expected: manifest.positions[key].contentHash, actual: hashPosition(position) };
  lockCheck[key].ok = lockCheck[key].expected === lockCheck[key].actual;
  if (!lockCheck[key].ok) errors.push(`${key} Gold drift`);
}

const pivotRuntimeLockPath = join(root, 'scripts/pivot-gold-runtime-lock.json');
const pivotRuntimeLock = existsSync(pivotRuntimeLockPath)
  ? JSON.parse(readFileSync(pivotRuntimeLockPath, 'utf8'))
  : null;
const acceptedPivotHashes = [PIVOT_LEGACY_BASELINE_HASH, pivotRuntimeLock?.contentHash].filter(Boolean);
const legacyCheck = {
  pivot: { expected: acceptedPivotHashes, actual: hashPosition('Pivot') },
  goalkeeper: { expected: GOALKEEPER_LEGACY_BASELINE_HASH, actual: hashPosition('Goalkeeper') },
};
legacyCheck.pivot.ok = acceptedPivotHashes.includes(legacyCheck.pivot.actual);
legacyCheck.goalkeeper.ok = legacyCheck.goalkeeper.expected === legacyCheck.goalkeeper.actual;
if (!legacyCheck.pivot.ok) errors.push('Legacy Pivot changed');
if (!legacyCheck.goalkeeper.ok) errors.push('Goalkeeper changed');

const report = {
  status: errors.length ? 'FAIL' : 'PIVOT GOLD 60 SOURCE READY FOR HUMAN COACH REVIEW',
  generatedAt: new Date().toISOString(),
  sourceGoldCount: PIVOT_GOLD_60.length,
  target: PIVOT_GOLD_TARGET,
  runtimeBankModified: false,
  families: PIVOT_GOLD_60.map(({ familyKey }) => familyKey),
  missingFamilies,
  unexpectedFamilies,
  coverage,
  semanticRisks,
  sourceHash: hash(PIVOT_GOLD_60),
  lockCheck,
  legacyCheck,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/pivot-gold-full-source-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  sourceGoldCount: report.sourceGoldCount,
  target: report.target,
  coverage: report.coverage.attackDefence,
  semanticRisks: semanticRisks.length,
  lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok),
  legacyBanksStable: Object.values(legacyCheck).every(({ ok }) => ok),
  errors: errors.length,
  warnings: warnings.length,
}, null, 2));
if (errors.length) process.exit(1);
