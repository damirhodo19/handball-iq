#!/usr/bin/env node
/**
 * validate:right-back-gold-bank
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

function getScenarioFamilyId(scenario) {
  const base = (scenario.title?.en ?? scenario.id).replace(/\s*\(\d+\)\s*$/, '').trim();
  return base
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

const FORBIDDEN =
  /tuljan|brtva|\bosovin|novinar|\btisak\b|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|sporni šut|\bu hvatu\b|\bHvatate\b|\bPrimate\b|čovjek na čovjeka|dugopas|preko fronta|istaknuti branič|niska trojka|niske trojke|pucaj prirodnu liniju/i;

/** Detectable vi-forms / formal register in player-facing HR (coach "ti"). */
/** Standalone vi-forms only — do not match Croatian -vaš conjugations (kažnjavaš, čuvaš, …). */
const VI_FORM =
  /\b(morate|imate|smijete|napadate|držite|čitate|primite|Hvatate|Primate|Odmaknite|Napadnite|Napadate|Morate|Imate|Smijete)\b|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(Vaš|vaš)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(vašim|Vašim|vašeg|Vašeg)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])vam se\b/;

/** Raw English tactical phrases that should not appear in HR copy. */
const RAW_EN_IN_HR =
  /\b(gap|wingback|pick and roll|through ball|crosscourt|man-to-man|first wave|second wave|passive warning|left-hander|right-hander|half-space|strong side|weak side)\b/i;

const LEFT_CUE = /lijevom rukom|ljevoruk|lijevak|left-hand|left handed|lijevoruk/i;
const RIGHT_CUE = /desnom rukom|desnoruk|desnjak|right-hand|right handed|desnoruk/i;

const REQUIRED = {
  '6:0': /6:0|6-0/,
  '5:1': /5:1|5-1/,
  '3:2:1': /3:2:1|3-2-1/,
  '3:3': /3:3|3-3/,
  '4:2': /4:2|4-2/,
  '1:5': /1:5|1-5/,
  '5+1': /5\+1/,
  '4+2': /4\+2/,
  open_or_individual: /man-to-man|open defen|individualn/i,
  '6v5': /6v5|6 na 5|6-on-5|igračem više|igrač više/i,
  '5v6': /5v6|5 na 6|5-on-6|igračem manje|igrač manje/i,
  '7v6': /7v6|7 na 6|second.?pivot|drugog pivota/i,
  passive: /passive|pasivn/i,
  transition_attack: /first wave|polukontra|second wave|partially|tranzicij|kontranapad/i,
  transition_defence: /recover|povratak|deny|protect centr|prvi u povratku/i,
  end_game: /Final Minutes|final possession|kasno|18 sekund|14 sekund|90 sekund/i,
  handedness: /left-hand|right-hand|lijevak|lijevom rukom|desnom rukom|left handed|right handed/i,
  right_wing: /right wing|desno krilo|Rechtsaußen/i,
};

/** Canonical defence terminology cues (at least one RB scenario must state clearly). */
const CANONICAL_DEFENCE = {
  '5+1_pivot_mark': /5\+1.*individualn|individualn.*5\+1|kombiniran[aeu].*5\+1|\+1.*čuva.*pivot|pivot.*individualn/i,
  'prednji_branic': /prednji branič|prednjeg braniča/i,
};

const report = { status: 'PASS', errors: [], warnings: [] };

const rb = bank.filter((s) => s.primaryPosition === 'Right Back');
const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
report.rbCount = rb.length;
report.lbCount = lb.length;

if (rb.length < 50) report.errors.push(`RB primary count too low: ${rb.length}`);
if (rb.length > 70) report.warnings.push(`RB primary count high: ${rb.length}`);

const families = new Map();
for (const s of rb) {
  const fid = getScenarioFamilyId(s);
  if (!families.has(fid)) families.set(fid, []);
  families.get(fid).push(s.id);
}
report.familyCount = families.size;
for (const [fid, ids] of families) {
  if (ids.length > 1) report.errors.push(`Semantic clone: ${fid} → ${ids.join(',')}`);
}

const fps = new Map();
for (const s of rb) {
  const fp = createHash('sha1')
    .update(`${s.title?.en}|${s.situation?.en}|${s.question?.en}`)
    .digest('hex')
    .slice(0, 12);
  if (fps.has(fp)) report.errors.push(`Exact duplicate of ${fps.get(fp)}: ${s.id}`);
  else fps.set(fp, s.id);
}

for (const s of rb) {
  if (s.primaryPosition === 'Goalkeeper') report.errors.push(`${s.id} GK leakage`);
  const blob = [s.situation, s.question, s.explanation, ...(s.answers || []).map((a) => a.text)]
    .map((x) => `${x?.en || ''} ${x?.hr || ''}`)
    .join(' ');
  if (/scn_bank_\d+/.test(blob)) report.errors.push(`${s.id} raw id in content`);
  const hr = [s.title?.hr, s.situation?.hr, s.question?.hr, s.explanation?.hr, ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr])].join(
    '\n',
  );
  if (FORBIDDEN.test(hr)) report.errors.push(`${s.id} forbidden HR: ${hr.match(FORBIDDEN)?.[0]}`);
  if (VI_FORM.test(hr)) report.errors.push(`${s.id} ti/vi mix: ${hr.match(VI_FORM)?.[0]}`);
  if (RAW_EN_IN_HR.test(hr)) report.errors.push(`${s.id} raw EN in HR: ${hr.match(RAW_EN_IN_HR)?.[0]}`);

  // Handedness metadata consistency: if text depends on one dominant hand, tag must match.
  const textBlob = [
    s.title?.en,
    s.title?.hr,
    s.situation?.en,
    s.situation?.hr,
    s.question?.en,
    s.question?.hr,
    s.explanation?.en,
    s.explanation?.hr,
    ...(s.answers || []).flatMap((a) => [a.text?.en, a.text?.hr, a.feedback?.en, a.feedback?.hr]),
  ].join('\n');
  const meta = (s.skillTags || []).find((t) => String(t).startsWith('handedness:'))?.replace('handedness:', '') || 'none';
  const hasL = LEFT_CUE.test(textBlob);
  const hasR = RIGHT_CUE.test(textBlob);
  let expect = 'none';
  if (hasL && !hasR) expect = 'left';
  else if (hasR && !hasL) expect = 'right';
  else if (hasL && hasR) expect = meta; // ambiguous both → keep tagged value
  if (expect !== meta) {
    report.errors.push(`${s.id} handedness mismatch: meta=${meta} expect=${expect}`);
  }
}

const blobAll = rb.map((s) => `${s.title?.en} ${s.situation?.en} ${s.situation?.hr} ${s.question?.hr}`).join('\n');
report.coverage = {};
for (const [name, re] of Object.entries(REQUIRED)) {
  const ok = re.test(blobAll);
  report.coverage[name] = ok;
  if (!ok) report.errors.push(`Missing required coverage: ${name}`);
}

report.canonicalDefence = {};
for (const [name, re] of Object.entries(CANONICAL_DEFENCE)) {
  const ok = re.test(blobAll);
  report.canonicalDefence[name] = ok;
  if (!ok) report.errors.push(`Missing canonical defence terminology: ${name}`);
}

report.attack = rb.filter((s) => s.attackOrDefence === 'Attack').length;
report.defence = rb.filter((s) => s.attackOrDefence === 'Defence').length;
const defPct = (report.defence / rb.length) * 100;
if (defPct < 12) report.errors.push(`Defensive content critically thin: ${defPct.toFixed(1)}%`);
else if (defPct < 15) report.warnings.push(`Defence share ${defPct.toFixed(1)}% below aspirational 15–20%`);

report.difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [d, rb.filter((s) => s.difficulty === d).length]),
);

const perceptionRe =
  /čitaš|prvi signal|koji je signal|koji je prvi signal|gdje nastaje|što ti pokazuje|što ti (kut|položaj)|koji branič mora|koji se prostor|što se promijenilo|koju opciju|ne križaš|otvoriti sljedeća|što vratar|što ti kut/i;
const percN = rb.filter(
  (s) => perceptionRe.test(s.question?.hr || '') || (s.skillTags || []).includes('perception'),
).length;
report.perceptionCount = percN;
report.perceptionPct = Math.round((percN / rb.length) * 1000) / 10;
if (report.perceptionPct < 25) {
  report.errors.push(`Perception ${report.perceptionPct}% (${percN}/${rb.length}) below required 25%`);
}

const handN = rb.filter((s) => (s.skillTags || []).some((t) => /^handedness:(left|right)$/.test(t)) || /lijevom rukom|desnom rukom|left-hand|right-hand|lijevak/i.test(`${s.situation?.en} ${s.situation?.hr}`)).length;
report.handednessSpecific = handN;
if (handN < 8) report.errors.push(`Handedness-specific families too few: ${handN}`);

for (const s of rb) {
  const opts = (s.answers || []).filter((a) => a.quality === 'optimal');
  if (opts.length !== 1) report.errors.push(`${s.id} optimal count ${opts.length}`);
}

const scores = rb.map((s) =>
  scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  }).overall,
);
report.avgRubricV2 = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
report.minRubricV2 = Math.min(...scores);
report.maxRubricV2 = Math.max(...scores);
if (report.minRubricV2 < 7.5) report.errors.push(`Lowest rubric ${report.minRubricV2} below floor`);

// Ensure LB gold still intact
if (lb.length < 60) report.errors.push(`Left Back gold damaged: only ${lb.length} primary`);

report.status = report.errors.length ? 'FAIL' : 'PASS';
writeFileSync(join(root, 'scripts/rb-gold-bank-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exit(report.status === 'PASS' ? 0 : 1);
