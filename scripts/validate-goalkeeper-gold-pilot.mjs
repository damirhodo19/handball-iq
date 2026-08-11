#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_PILOT_10 } from './scenario-bank/data/goalkeeper-gold-pilot-10.mjs';
import { GOALKEEPER_GOLD_FAMILIES, GOALKEEPER_LEGACY_BASELINE_HASH, GOALKEEPER_PILOT_FAMILY_KEYS } from './scenario-bank/data/goalkeeper-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const pivotLock = JSON.parse(readFileSync(join(root, 'scripts/pivot-gold-runtime-lock.json'), 'utf8'));
const goalkeeperRuntimeLock = (() => { try { return JSON.parse(readFileSync(join(root, 'scripts/goalkeeper-gold-runtime-lock.json'), 'utf8')); } catch { return null; } })();
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hashPosition = (position) => hash(bank.filter((scenario) => scenario.primaryPosition === position));
const taxonomy = new Set(GOALKEEPER_GOLD_FAMILIES.map(({ familyKey }) => familyKey));
const errors = [];
const warnings = [];
const seen = { family: new Set(), title: new Set(), fingerprint: new Set() };
const HR_BAD = [/golman/i, /protunapad/i, /središnji stražnji/i, /\bfeed\b/i, /\bkeeper\b/i, /take-off/i, /bacačko rame/i, /opterećeni kuk/i, /stvarni osnovni položaj/i, /živi signal/i, /živi šut/i];
const DE_BAD = [/\bKeeper\b/i, /\bfeed\b/i, /take-off/i];

if (GOALKEEPER_GOLD_PILOT_10.length !== 10) errors.push('Pilot count mismatch');
for (const scenario of GOALKEEPER_GOLD_PILOT_10) {
  if (!taxonomy.has(scenario.familyKey)) errors.push(`${scenario.pilotId}: family absent from taxonomy`);
  if (!GOALKEEPER_PILOT_FAMILY_KEYS.includes(scenario.familyKey)) errors.push(`${scenario.pilotId}: not selected for pilot`);
  if (seen.family.has(scenario.familyKey)) errors.push(`${scenario.pilotId}: duplicate family`); else seen.family.add(scenario.familyKey);
  const title = scenario.title.en.toLowerCase();
  if (seen.title.has(title)) errors.push(`${scenario.pilotId}: duplicate title`); else seen.title.add(title);
  const fingerprint = JSON.stringify([scenario.fingerprint?.cue, scenario.fingerprint?.decision]);
  if (seen.fingerprint.has(fingerprint)) errors.push(`${scenario.pilotId}: duplicate fingerprint`); else seen.fingerprint.add(fingerprint);
  if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.pilotId}: answer ladder`);
  const localized = [scenario.title, scenario.situation, scenario.question, scenario.explanation, scenario.whyCorrectOverSecondBest, ...scenario.answers.flatMap((answer) => [answer.text, answer.feedback])];
  for (const locale of ['en', 'hr', 'de']) if (localized.some((node) => !node?.[locale]?.trim())) errors.push(`${scenario.pilotId}: missing ${locale}`);
  const hr = localized.map((node) => node.hr).join('\n');
  const de = localized.map((node) => node.de).join('\n');
  for (const pattern of HR_BAD) if (pattern.test(hr)) errors.push(`${scenario.pilotId}: HR blacklist ${pattern}`);
  for (const pattern of DE_BAD) if (pattern.test(de)) errors.push(`${scenario.pilotId}: DE blacklist ${pattern}`);
  if (!scenario.title.en.startsWith('Goalkeeper —') || !scenario.title.hr.startsWith('Vratar —') || !scenario.title.de.startsWith('Torwart —')) errors.push(`${scenario.pilotId}: title identity`);
}

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

const report = {
  status: errors.length ? 'FAIL' : 'GOALKEEPER GOLD PILOT READY FOR HUMAN COACH REVIEW',
  generatedAt: new Date().toISOString(),
  pilotCount: GOALKEEPER_GOLD_PILOT_10.length,
  fullTarget: GOALKEEPER_GOLD_FAMILIES.length,
  families: GOALKEEPER_GOLD_PILOT_10.map(({ familyKey }) => familyKey),
  sourceHash: hash(GOALKEEPER_GOLD_PILOT_10),
  lockCheck,
  pivotCheck,
  goalkeeperCheck,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/goalkeeper-gold-pilot-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  pilotCount: report.pilotCount,
  fullTarget: report.fullTarget,
  lockedGoldStable: Object.values(lockCheck).every(({ ok }) => ok),
  pivotGoldStable: pivotCheck.ok,
  goalkeeperBankStable: goalkeeperCheck.ok,
  errors: errors.length,
  warnings: warnings.length,
}, null, 2));
if (errors.length) process.exit(1);
