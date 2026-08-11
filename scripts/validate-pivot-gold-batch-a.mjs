#!/usr/bin/env node
/** Validate approved Pivot pilot + Batch A source without runtime insertion. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_BATCH_A_15 } from './scenario-bank/data/pivot-gold-batch-a-15.mjs';
import { PIVOT_GOLD_PILOT_10 } from './scenario-bank/data/pivot-gold-pilot-10.mjs';
import {
  GOALKEEPER_LEGACY_BASELINE_HASH,
  PIVOT_GOLD_FAMILIES,
  PIVOT_LEGACY_BASELINE_HASH,
} from './scenario-bank/data/pivot-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (position) => hash(bank.filter((s) => s.primaryPosition === position));
const taxonomy = new Set(PIVOT_GOLD_FAMILIES.map((x) => x.familyKey));
const all = [...PIVOT_GOLD_PILOT_10, ...PIVOT_GOLD_BATCH_A_15];
const errors = [];
const warnings = [];

if (PIVOT_GOLD_BATCH_A_15.length !== 15) errors.push('Batch A count must be 15');
if (all.length !== 25) errors.push('Pilot + Batch A must total 25');

const familySeen = new Set();
const titleSeen = new Set();
const fingerprintSeen = new Set();
const areas = {};
const difficulty = {};
const attackDefence = {};
const systems = {};
const HR_BAD = [/\bPrimate\b/i, /\bHvatate\b/i, /zapečaćen/i, /krivotvoren/i, /utičnic/i, /take-off/i, /goalkeeper/i, /\bfeed\b/i];
const DE_BAD = [/take-off/i, /goalkeeper/i, /\bfeed\b/i];

const coreTokens = (s) =>
  new Set(
    `${s.situation.en} ${s.question.en} ${s.answers[0].text.en}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((x) => x.length > 4),
  );

for (const s of all) {
  const id = s.pilotId || s.batchId;
  if (!taxonomy.has(s.familyKey)) errors.push(`${id}: family absent from taxonomy`);
  if (familySeen.has(s.familyKey)) errors.push(`${id}: duplicate family ${s.familyKey}`);
  familySeen.add(s.familyKey);
  const titleKey = s.title.en.toLowerCase();
  if (titleSeen.has(titleKey)) errors.push(`${id}: duplicate EN title`);
  titleSeen.add(titleKey);
  const fp = JSON.stringify([s.fingerprint?.cue, s.fingerprint?.decision]);
  if (fingerprintSeen.has(fp)) errors.push(`${id}: duplicate cue+decision fingerprint`);
  fingerprintSeen.add(fp);
  if (s.answers.map((a) => a.quality).join(',') !== 'optimal,good,risky,poor') {
    errors.push(`${id}: invalid answer ladder`);
  }
  const nodes = [s.title, s.situation, s.question, s.explanation, s.whyCorrectOverSecondBest, ...s.answers.flatMap((a) => [a.text, a.feedback])];
  for (const locale of ['en', 'hr', 'de']) {
    if (nodes.some((n) => !n?.[locale]?.trim())) errors.push(`${id}: missing ${locale} text`);
  }
  const hr = nodes.map((n) => n.hr).join('\n');
  const de = nodes.map((n) => n.de).join('\n');
  for (const rule of HR_BAD) if (rule.test(hr)) errors.push(`${id}: HR blacklist ${rule}`);
  for (const rule of DE_BAD) if (rule.test(de)) errors.push(`${id}: DE blacklist ${rule}`);
  if (!s.title.en.startsWith('Pivot —') || !s.title.hr.startsWith('Pivot —') || !s.title.de.startsWith('Kreisläufer —')) {
    errors.push(`${id}: title position identity failure`);
  }
  areas[s.teachingArea] = (areas[s.teachingArea] || 0) + 1;
  difficulty[s.difficulty] = (difficulty[s.difficulty] || 0) + 1;
  attackDefence[s.attackOrDefence] = (attackDefence[s.attackOrDefence] || 0) + 1;
  systems[s.defensiveSystem || s.matchPhase || 'none'] = (systems[s.defensiveSystem || s.matchPhase || 'none'] || 0) + 1;
}

const semanticRisks = [];
for (let i = 0; i < all.length; i++) {
  const a = coreTokens(all[i]);
  for (let j = i + 1; j < all.length; j++) {
    const b = coreTokens(all[j]);
    const overlap = [...a].filter((x) => b.has(x)).length;
    const ratio = overlap / Math.max(1, Math.min(a.size, b.size));
    if (ratio >= 0.72 && overlap >= 10) {
      semanticRisks.push({ a: all[i].familyKey, b: all[j].familyKey, ratio: Math.round(ratio * 100) / 100 });
    }
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} high semantic similarity pair(s)`);

const lockCheck = {};
for (const [key, position] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  const expected = manifest.positions?.[key]?.contentHash;
  const actual = hashPos(position);
  lockCheck[key] = { expected, actual, ok: expected === actual };
  if (!lockCheck[key].ok) errors.push(`${key} Gold hash drift`);
}
const legacyCheck = {
  pivot: { expected: PIVOT_LEGACY_BASELINE_HASH, actual: hashPos('Pivot') },
  goalkeeper: { expected: GOALKEEPER_LEGACY_BASELINE_HASH, actual: hashPos('Goalkeeper') },
};
legacyCheck.pivot.ok = legacyCheck.pivot.expected === legacyCheck.pivot.actual;
legacyCheck.goalkeeper.ok = legacyCheck.goalkeeper.expected === legacyCheck.goalkeeper.actual;
if (!legacyCheck.pivot.ok) errors.push('Legacy Pivot changed before Batch A approval');
if (!legacyCheck.goalkeeper.ok) errors.push('Goalkeeper changed during Pivot phase');

const report = {
  status: errors.length ? 'FAIL' : 'PIVOT BATCH A READY FOR HUMAN COACH REVIEW',
  generatedAt: new Date().toISOString(),
  approvedPilotCount: PIVOT_GOLD_PILOT_10.length,
  batchACount: PIVOT_GOLD_BATCH_A_15.length,
  sourceGoldCount: all.length,
  fullTarget: PIVOT_GOLD_FAMILIES.length,
  families: all.map((x) => x.familyKey),
  coverage: { areas, difficulty, attackDefence, systems, perceptionCount: all.filter((x) => x.perception).length },
  semanticRisks,
  lockCheck,
  legacyCheck,
  errors,
  warnings,
};
writeFileSync(join(root, 'scripts/pivot-gold-batch-a-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, sourceGoldCount: report.sourceGoldCount, fullTarget: report.fullTarget, semanticRisks: semanticRisks.length, lockedGoldStable: Object.values(lockCheck).every((x) => x.ok), errors: errors.length, warnings: warnings.length }, null, 2));
if (errors.length) process.exit(1);
