#!/usr/bin/env node
/**
 * validate:right-wing-gold-bank / validate:rw-gold-bank
 * Quality-first: floor >= 50, no hard exact-count quota.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';
import {
  RW_ALL_FAMILY_KEYS,
  RW_PARENT_FAMILIES,
  RW_TACTICAL_MODEL,
  RW_LOCKED_REFERENCES,
} from './scenario-bank/data/right-wing-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const matrixPath = join(root, 'scripts/rw-gold-coverage-matrix.json');
const matrix = existsSync(matrixPath) ? JSON.parse(readFileSync(matrixPath, 'utf8')) : [];
const snapPath = join(root, 'scripts/rw-gold-locked-refs-snapshot.json');
const snap = existsSync(snapPath) ? JSON.parse(readFileSync(snapPath, 'utf8')) : null;

const FORBIDDEN =
  /tuljan|brtva|brtv|\bosovin|novinar|\btisak\b|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|\bHvatate\b|\bPrimate\b|(?<![Ii]s)puštanje|prijem sjedne|mrtvi val|nosač lopte|\bOutlet\b|vratar sjedi|jedan takt|unovčava|Yoat |at lead |take-offa |goalkeeperat |izmeđat |at kut|Čitaj konkretnu geometriju|available side of goal/i;

const VI_FORM =
  /\b(morate|imate|smijete|napadate|držite|čitate|primite|Hvatate|Primate|Odmaknite|Napadnite|Napadate|Morate|Imate|Smijete)\b|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(Vaš|vaš)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(vašim|Vašim|vašeg|Vašeg)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])vam se\b/;

const EN_CORRUPT = /Yoat |at lead |take-offa |goalkeeperat |Čitaj konkretnu/i;
const HR_EN_LEAK =
  /\b(wing defender|right back|left back|centre back|take-off|goalkeeper)\b|izmeđat |\bat kut\b|at povratkat|ballt |sat dva|minutes protiv/i;

const report = { status: 'PASS', errors: [], warnings: [] };

const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');
const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
const rb = bank.filter((s) => s.primaryPosition === 'Right Back');
const cb = bank.filter((s) => s.primaryPosition === 'Centre Back');

report.rwCount = rw.length;
report.lbCount = lb.length;
report.rbCount = rb.length;
report.cbCount = cb.length;

const floor = RW_TACTICAL_MODEL.scenarioFloor || 50;
if (rw.length < floor) report.errors.push(`RW count ${rw.length} < floor ${floor}`);
if (rw.length > 68) report.warnings.push(`RW count ${rw.length} still high — check for padding`);
if (lb.length < 60) report.errors.push(`Left Back gold damaged: only ${lb.length}`);
if (rb.length < 60) report.errors.push(`Right Back gold damaged: only ${rb.length}`);
if (cb.length < 60) report.errors.push(`Centre Back gold damaged: only ${cb.length}`);

// Locked references unchanged
if (snap?.locked) {
  const idByFamily = Object.fromEntries(matrix.map((m) => [m.familyKey, m.id]));
  for (const fk of RW_LOCKED_REFERENCES) {
    const id = idByFamily[fk];
    if (!id) {
      report.errors.push(`Locked family missing: ${fk}`);
      continue;
    }
    const s = rw.find((x) => x.id === id);
    const h = createHash('sha256').update(JSON.stringify(s)).digest('hex');
    const expected = snap.locked[id]?.hash;
    if (!expected) report.errors.push(`No snapshot hash for locked ${id}`);
    else if (h !== expected) report.errors.push(`LOCKED REF CHANGED: ${id} (${fk})`);
  }
  report.lockedRefsUnchanged = report.errors.every((e) => !e.startsWith('LOCKED'));
}

const families = new Map();
const teachingKeys = new Map();
for (const s of rw) {
  const base = (s.title?.en ?? s.id).replace(/\s*\(\d+\)\s*$/, '').trim().toLowerCase();
  if (!families.has(base)) families.set(base, []);
  families.get(base).push(s.id);

  const m = matrix.find((x) => x.id === s.id);
  const tk = m?.primaryTacticalCue || s.question?.en || s.id;
  const norm = String(tk)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  if (!teachingKeys.has(norm)) teachingKeys.set(norm, []);
  teachingKeys.get(norm).push(s.id);
}
report.familyCount = families.size;
report.uniqueTeachingCueCount = teachingKeys.size;
for (const [fid, ids] of families) {
  if (ids.length > 1) report.errors.push(`Semantic clone: ${fid} → ${ids.join(',')}`);
}
for (const [tk, ids] of teachingKeys) {
  if (ids.length > 1 && tk.length > 20) {
    report.errors.push(`Strong teaching-cue duplicate: ${ids.join(',')} :: ${tk.slice(0, 80)}`);
  }
}

const fps = new Map();
const qfps = new Map();
for (const s of rw) {
  const fp = createHash('sha1')
    .update(`${s.title?.en}|${s.situation?.en}|${s.question?.en}`)
    .digest('hex')
    .slice(0, 12);
  if (fps.has(fp)) report.errors.push(`Exact duplicate of ${fps.get(fp)}: ${s.id}`);
  else fps.set(fp, s.id);

  const qfp = createHash('sha1').update(String(s.question?.en || '')).digest('hex').slice(0, 12);
  if (qfps.has(qfp)) report.errors.push(`Duplicate question of ${qfps.get(qfp)}: ${s.id}`);
  else qfps.set(qfp, s.id);

  if (!s.whyCorrectOverSecondBest?.hr && !s.whyCorrectOverSecondBest?.en) {
    report.errors.push(`${s.id} missing whyCorrectOverSecondBest`);
  }

  const hr = [
    s.situation?.hr,
    s.question?.hr,
    s.explanation?.hr,
    ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr]),
  ].join('\n');
  const en = s.situation?.en || '';
  if (FORBIDDEN.test(hr) || FORBIDDEN.test(en)) {
    report.errors.push(`${s.id} forbidden lexicon: ${(hr + en).match(FORBIDDEN)?.[0]}`);
  }
  if (VI_FORM.test(hr)) {
    report.errors.push(`${s.id} vi-form HR: ${(hr.match(VI_FORM) || [])[0]}`);
  }
  if (EN_CORRUPT.test(en) || HR_EN_LEAK.test(hr)) {
    report.errors.push(`${s.id} mixed/corrupted language`);
  }

  // GK gate: far/near/lob answers need GK cues in situation
  const opt = (s.answers || []).find((a) => a.quality === 'optimal');
  const optEn = opt?.text?.en || '';
  const sitEn = `${s.situation?.en || ''} ${s.question?.en || ''}`;
  const claimsGkTarget =
    /\b(far[- ]?post|near[- ]?post|lob|far side|near side)\b/i.test(optEn) &&
    /\b(goalkeeper|keeper|post|arm|foot|lob)\b/i.test(optEn);
  if (claimsGkTarget) {
    const hasGkCue =
      /\b(goalkeeper|keeper).{0,80}(arm|foot|hand|deep|step|commit|drop|high|near post|far)/i.test(
        sitEn,
      ) || /\b(near arm|near foot|drops? (both )?hands|stays deep|steps? out|off the goal line)/i.test(sitEn);
    if (!hasGkCue && !/empty (net|goal)/i.test(sitEn)) {
      report.errors.push(`${s.id} GK target without observable GK cue`);
    }
  }

  const opts = (s.answers || []).filter((a) => a.quality === 'optimal');
  if (opts.length !== 1) report.errors.push(`${s.id} need exactly one optimal`);
  if ((s.answers || []).length !== 4) report.errors.push(`${s.id} need 4 answers`);
  const qualities = (s.answers || []).map((a) => a.quality).join(',');
  if (qualities !== 'optimal,good,risky,poor') {
    report.warnings.push(`${s.id} answer quality order: ${qualities}`);
  }
  for (const lang of ['en', 'hr', 'de']) {
    if (!s.situation?.[lang] || !s.question?.[lang] || !s.explanation?.[lang]) {
      report.errors.push(`${s.id} missing ${lang} core`);
    }
    for (const a of s.answers || []) {
      if (!a.text?.[lang] || !a.feedback?.[lang]) {
        report.errors.push(`${s.id} answer missing ${lang}`);
        break;
      }
    }
  }

  const scored = scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  });
  if (scored.overall < 7.5) report.errors.push(`${s.id} rubric ${scored.overall} < 7.5`);
}

// Taxonomy coverage
const matrixKeys = new Set(matrix.map((m) => m.familyKey));
for (const k of RW_ALL_FAMILY_KEYS) {
  if (!matrixKeys.has(k)) report.errors.push(`Missing taxonomy family in matrix: ${k}`);
}
for (const k of matrixKeys) {
  if (!RW_ALL_FAMILY_KEYS.includes(k)) report.errors.push(`Matrix family not in taxonomy: ${k}`);
}
report.parentFamilyCount = Object.keys(RW_PARENT_FAMILIES).length;
report.taxonomyKeys = RW_ALL_FAMILY_KEYS.length;

const defence = rw.filter((s) => s.attackOrDefence === 'Defence').length;
const defencePct = rw.length ? (defence / rw.length) * 100 : 0;
report.defencePct = Math.round(defencePct * 10) / 10;
if (defencePct < 12) report.errors.push(`Defence coverage too low: ${report.defencePct}%`);
if (defencePct > 28) report.warnings.push(`Defence coverage high: ${report.defencePct}%`);

const perceptionCount = matrix.length
  ? matrix.filter((m) => m.perception).length
  : rw.filter((s) => (s.skillTags || []).includes('perception')).length;
const perceptionPct = rw.length ? (perceptionCount / rw.length) * 100 : 0;
report.perceptionPct = Math.round(perceptionPct * 10) / 10;
report.perceptionCount = perceptionCount;
if (perceptionPct < (RW_TACTICAL_MODEL.perceptionFloorPct || 30)) {
  report.errors.push(`Perception too low: ${report.perceptionPct}%`);
}
if (perceptionPct > 85) {
  report.errors.push(`Perception not credible: ${report.perceptionPct}% (likely over-tagged)`);
}

const difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
    d,
    rw.filter((s) => s.difficulty === d).length,
  ]),
);
report.difficulty = difficulty;
if (difficulty.Beginner < 3) report.warnings.push(`Beginner low: ${difficulty.Beginner}`);
if (difficulty.Expert < 5) report.warnings.push(`Expert low: ${difficulty.Expert}`);

const handLeft = rw.filter((s) => (s.skillTags || []).some((t) => t === 'handedness:left')).length;
const handRight = rw.filter((s) => (s.skillTags || []).some((t) => t === 'handedness:right')).length;
const handNone = rw.length - handLeft - handRight;
report.handedness = { left: handLeft, right: handRight, none: handNone };

const scores = rw.map((s) => s.qualityScore || 0);
report.avgRubric = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
report.minRubric = scores.length ? Math.min(...scores) : 0;
report.maxRubric = scores.length ? Math.max(...scores) : 0;
if (report.minRubric < 7.5) report.errors.push(`minRubric ${report.minRubric} < 7.5`);
if (report.avgRubric < 8.0) report.warnings.push(`avgRubric ${report.avgRubric} < 8.0`);

report.errorCount = report.errors.length;
report.warningCount = report.warnings.length;
report.status = report.errors.length ? 'FAIL' : 'PASS';

writeFileSync(join(root, 'scripts/rw-gold-bank-validation.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(join(root, 'scripts/rw-gold-bank-validation-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exit(1);
