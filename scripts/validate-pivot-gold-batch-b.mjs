#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_PILOT_10 } from './scenario-bank/data/pivot-gold-pilot-10.mjs';
import { PIVOT_GOLD_BATCH_A_15 } from './scenario-bank/data/pivot-gold-batch-a-15.mjs';
import { PIVOT_GOLD_BATCH_B_20 } from './scenario-bank/data/pivot-gold-batch-b-20.mjs';
import { GOALKEEPER_LEGACY_BASELINE_HASH, PIVOT_GOLD_FAMILIES, PIVOT_LEGACY_BASELINE_HASH } from './scenario-bank/data/pivot-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'));
const all = [...PIVOT_GOLD_PILOT_10, ...PIVOT_GOLD_BATCH_A_15, ...PIVOT_GOLD_BATCH_B_20];
const taxonomy = new Set(PIVOT_GOLD_FAMILIES.map((x) => x.familyKey));
const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (p) => hash(bank.filter((s) => s.primaryPosition === p));
const errors = [];
const warnings = [];
const seen = { family: new Set(), title: new Set(), fingerprint: new Set() };
const coverage = { difficulty: {}, attackDefence: {}, systems: {}, areas: {}, perception: 0 };
const HR_BAD = [/\bPrimate\b/i, /\bHvatate\b/i, /zapečaćen/i, /krivotvoren/i, /utičnic/i, /take-off/i, /goalkeeper/i, /\bfeed\b/i];
const DE_BAD = [/take-off/i, /goalkeeper/i, /\bfeed\b/i];
const tokenSet = (s) => new Set(`${s.situation.en} ${s.question.en} ${s.answers[0].text.en}`.toLowerCase().split(/[^a-z0-9]+/).filter((x) => x.length > 4));

if (PIVOT_GOLD_BATCH_B_20.length !== 20 || all.length !== 45) errors.push('Source count mismatch');
for (const s of all) {
  const id = s.pilotId || s.batchId;
  if (!taxonomy.has(s.familyKey)) errors.push(`${id}: family absent from taxonomy`);
  if (seen.family.has(s.familyKey)) errors.push(`${id}: duplicate family`); else seen.family.add(s.familyKey);
  const title = s.title.en.toLowerCase();
  if (seen.title.has(title)) errors.push(`${id}: duplicate title`); else seen.title.add(title);
  const fp = JSON.stringify([s.fingerprint?.cue, s.fingerprint?.decision]);
  if (seen.fingerprint.has(fp)) errors.push(`${id}: duplicate fingerprint`); else seen.fingerprint.add(fp);
  if (s.answers.map((a) => a.quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${id}: answer ladder`);
  const nodes = [s.title, s.situation, s.question, s.explanation, s.whyCorrectOverSecondBest, ...s.answers.flatMap((a) => [a.text, a.feedback])];
  for (const loc of ['en', 'hr', 'de']) if (nodes.some((n) => !n?.[loc]?.trim())) errors.push(`${id}: missing ${loc}`);
  const hr = nodes.map((n) => n.hr).join('\n');
  const de = nodes.map((n) => n.de).join('\n');
  for (const r of HR_BAD) if (r.test(hr)) errors.push(`${id}: HR blacklist ${r}`);
  for (const r of DE_BAD) if (r.test(de)) errors.push(`${id}: DE blacklist ${r}`);
  if (!s.title.en.startsWith('Pivot —') || !s.title.hr.startsWith('Pivot —') || !s.title.de.startsWith('Kreisläufer —')) errors.push(`${id}: title identity`);
  coverage.difficulty[s.difficulty] = (coverage.difficulty[s.difficulty] || 0) + 1;
  coverage.attackDefence[s.attackOrDefence] = (coverage.attackDefence[s.attackOrDefence] || 0) + 1;
  coverage.systems[s.defensiveSystem || s.matchPhase] = (coverage.systems[s.defensiveSystem || s.matchPhase] || 0) + 1;
  coverage.areas[s.teachingArea] = (coverage.areas[s.teachingArea] || 0) + 1;
  if (s.perception) coverage.perception++;
}

const semanticRisks = [];
for (let i = 0; i < all.length; i++) {
  const a = tokenSet(all[i]);
  for (let j = i + 1; j < all.length; j++) {
    const b = tokenSet(all[j]);
    const overlap = [...a].filter((x) => b.has(x)).length;
    const ratio = overlap / Math.max(1, Math.min(a.size, b.size));
    if (ratio >= 0.72 && overlap >= 10) semanticRisks.push({ a: all[i].familyKey, b: all[j].familyKey, ratio: Math.round(ratio * 100) / 100 });
  }
}
if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic similarity pair(s)`);

const lockCheck = {};
for (const [k, p] of Object.entries({ LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' })) {
  lockCheck[k] = { expected: manifest.positions[k].contentHash, actual: hashPos(p) };
  lockCheck[k].ok = lockCheck[k].expected === lockCheck[k].actual;
  if (!lockCheck[k].ok) errors.push(`${k} Gold drift`);
}
const legacyCheck = { pivot: { expected: PIVOT_LEGACY_BASELINE_HASH, actual: hashPos('Pivot') }, goalkeeper: { expected: GOALKEEPER_LEGACY_BASELINE_HASH, actual: hashPos('Goalkeeper') } };
legacyCheck.pivot.ok = legacyCheck.pivot.expected === legacyCheck.pivot.actual;
legacyCheck.goalkeeper.ok = legacyCheck.goalkeeper.expected === legacyCheck.goalkeeper.actual;
if (!legacyCheck.pivot.ok) errors.push('Legacy Pivot changed');
if (!legacyCheck.goalkeeper.ok) errors.push('Goalkeeper changed');

const report = { status: errors.length ? 'FAIL' : 'PIVOT BATCH B READY FOR HUMAN COACH REVIEW', generatedAt: new Date().toISOString(), sourceGoldCount: all.length, fullTarget: PIVOT_GOLD_FAMILIES.length, batchBCount: PIVOT_GOLD_BATCH_B_20.length, families: all.map((s) => s.familyKey), coverage, semanticRisks, lockCheck, legacyCheck, errors, warnings };
writeFileSync(join(root, 'scripts/pivot-gold-batch-b-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, sourceGoldCount: all.length, fullTarget: report.fullTarget, semanticRisks: semanticRisks.length, lockedGoldStable: Object.values(lockCheck).every((x) => x.ok), errors: errors.length, warnings: warnings.length }, null, 2));
if (errors.length) process.exit(1);
