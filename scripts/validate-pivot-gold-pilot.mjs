#!/usr/bin/env node
/** Validate Pivot Gold pilot source without inserting it into runtime bank. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_PILOT_10 } from './scenario-bank/data/pivot-gold-pilot-10.mjs';
import {
  GOALKEEPER_LEGACY_BASELINE_HASH,
  PIVOT_GOLD_FAMILIES,
  PIVOT_GOLD_TARGET,
  PIVOT_LEGACY_BASELINE_HASH,
  PIVOT_PILOT_FAMILY_KEYS,
} from './scenario-bank/data/pivot-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(
  readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'),
);
const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (position) => hash(bank.filter((s) => s.primaryPosition === position));

const errors = [];
const warnings = [];
const taxonomyKeys = new Set(PIVOT_GOLD_FAMILIES.map((x) => x.familyKey));
const familyKeys = new Set();
const teachingAreas = new Set();
const fingerprints = new Set();
const localeCounts = { en: 0, hr: 0, de: 0 };
const difficulty = {};
const attackDefence = {};
const systems = {};
const HR_BLACKLIST = [
  /\bPrimate\b/i,
  /\bHvatate\b/i,
  /zapečaćen/i,
  /krivotvoren/i,
  /čuvara/i,
  /utičnic/i,
  /take-off/i,
  /goalkeeper/i,
  /\bfeed\b/i,
];
const DE_BLACKLIST = [/Goalkeeper/i, /take-off/i, /\bfeed\b/i];

if (PIVOT_GOLD_FAMILIES.length !== PIVOT_GOLD_TARGET) {
  errors.push(`Taxonomy ${PIVOT_GOLD_FAMILIES.length} != target ${PIVOT_GOLD_TARGET}`);
}
if (PIVOT_GOLD_PILOT_10.length !== 10) errors.push('Pilot count must equal 10');
if (PIVOT_PILOT_FAMILY_KEYS.length !== 10) errors.push('Pilot taxonomy key count must equal 10');

for (let i = 0; i < PIVOT_GOLD_PILOT_10.length; i++) {
  const p = PIVOT_GOLD_PILOT_10[i];
  const expectedPilotId = `pv_pilot_${String(i + 1).padStart(2, '0')}`;
  if (p.pilotId !== expectedPilotId) errors.push(`${p.pilotId}: expected ${expectedPilotId}`);
  if (!taxonomyKeys.has(p.familyKey)) errors.push(`${p.pilotId}: family missing from taxonomy`);
  if (PIVOT_PILOT_FAMILY_KEYS[i] !== p.familyKey) {
    errors.push(`${p.pilotId}: pilot taxonomy order mismatch`);
  }
  if (familyKeys.has(p.familyKey)) errors.push(`${p.pilotId}: duplicate family ${p.familyKey}`);
  familyKeys.add(p.familyKey);
  if (teachingAreas.has(p.teachingArea)) {
    errors.push(`${p.pilotId}: duplicate teachingArea ${p.teachingArea}`);
  }
  teachingAreas.add(p.teachingArea);
  const fp = JSON.stringify([p.fingerprint?.cue, p.fingerprint?.decision]);
  if (fingerprints.has(fp)) errors.push(`${p.pilotId}: duplicate cue+decision fingerprint`);
  fingerprints.add(fp);

  if (!p.title?.en.startsWith('Pivot —')) errors.push(`${p.pilotId}: EN title lacks Pivot identity`);
  if (!p.title?.hr.startsWith('Pivot —')) errors.push(`${p.pilotId}: HR title lacks Pivot identity`);
  if (!p.title?.de.startsWith('Kreisläufer —')) {
    errors.push(`${p.pilotId}: DE title lacks Kreisläufer identity`);
  }
  if (p.answers?.map((a) => a.quality).join(',') !== 'optimal,good,risky,poor') {
    errors.push(`${p.pilotId}: answer ladder must be optimal,good,risky,poor`);
  }

  const localizedNodes = [
    p.title,
    p.situation,
    p.question,
    p.explanation,
    p.whyCorrectOverSecondBest,
    ...p.answers.flatMap((a) => [a.text, a.feedback]),
  ];
  for (const locale of ['en', 'hr', 'de']) {
    if (localizedNodes.some((node) => !node?.[locale]?.trim())) {
      errors.push(`${p.pilotId}: missing ${locale} localized text`);
    } else {
      localeCounts[locale] += localizedNodes.length;
    }
  }
  const hr = localizedNodes.map((x) => x.hr).join('\n');
  const de = localizedNodes.map((x) => x.de).join('\n');
  for (const rule of HR_BLACKLIST) if (rule.test(hr)) errors.push(`${p.pilotId}: HR blacklist ${rule}`);
  for (const rule of DE_BLACKLIST) if (rule.test(de)) errors.push(`${p.pilotId}: DE blacklist ${rule}`);

  difficulty[p.difficulty] = (difficulty[p.difficulty] || 0) + 1;
  attackDefence[p.attackOrDefence] = (attackDefence[p.attackOrDefence] || 0) + 1;
  systems[p.defensiveSystem || 'none'] = (systems[p.defensiveSystem || 'none'] || 0) + 1;
  if (!p.whyCorrectOverSecondBest?.en) errors.push(`${p.pilotId}: missing A-vs-B rationale`);
}

const lockCheck = {};
for (const [key, position] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
  LW: 'Left Wing',
})) {
  const expected = manifest.positions?.[key]?.contentHash;
  const actual = hashPos(position);
  lockCheck[key] = { expected, actual, ok: expected === actual };
  if (!lockCheck[key].ok) errors.push(`${key} Gold hash drift`);
}

const legacyCheck = {
  pivot: {
    expected: PIVOT_LEGACY_BASELINE_HASH,
    actual: hashPos('Pivot'),
  },
  goalkeeper: {
    expected: GOALKEEPER_LEGACY_BASELINE_HASH,
    actual: hashPos('Goalkeeper'),
  },
};
legacyCheck.pivot.ok = legacyCheck.pivot.expected === legacyCheck.pivot.actual;
legacyCheck.goalkeeper.ok = legacyCheck.goalkeeper.expected === legacyCheck.goalkeeper.actual;
if (!legacyCheck.pivot.ok) errors.push('Legacy Pivot changed before pilot approval');
if (!legacyCheck.goalkeeper.ok) errors.push('Legacy Goalkeeper changed during Pivot phase');

const report = {
  status: errors.length ? 'FAIL' : 'PIVOT GOLD PILOT READY FOR HUMAN COACH REVIEW',
  generatedAt: new Date().toISOString(),
  pilotCount: PIVOT_GOLD_PILOT_10.length,
  targetFamilyCount: PIVOT_GOLD_TARGET,
  pilotFamilies: [...familyKeys],
  teachingAreas: [...teachingAreas],
  difficulty,
  attackDefence,
  systems,
  perceptionCount: PIVOT_GOLD_PILOT_10.filter((p) => p.perception).length,
  localizedTextNodeCounts: localeCounts,
  lockCheck,
  legacyCheck,
  errors,
  warnings,
};

writeFileSync(
  join(root, 'scripts/pivot-gold-pilot-validation.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      status: report.status,
      pilotCount: report.pilotCount,
      targetFamilyCount: report.targetFamilyCount,
      lockedGoldStable: Object.values(lockCheck).every((x) => x.ok),
      legacyStable: legacyCheck.pivot.ok && legacyCheck.goalkeeper.ok,
      errors: errors.length,
      warnings: warnings.length,
    },
    null,
    2,
  ),
);
if (errors.length) process.exit(1);
