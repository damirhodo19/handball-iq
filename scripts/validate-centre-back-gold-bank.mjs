#!/usr/bin/env node
/**
 * validate:centre-back-gold-bank
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
  /tuljan|brtva|brtv|\bosovin|novinar|\btisak\b|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|sporni šut|\bu hvatu\b|\bHvatate\b|\bPrimate\b|čovjek na čovjeka|dugopas|preko fronta|pečat|Innenverteidiger/i;

/** Standalone vi-forms only — do not match Croatian -vaš conjugations (kažnjavaš, čuvaš, …). */
const VI_FORM =
  /\b(morate|imate|smijete|napadate|držite|čitate|primite|Hvatate|Primate|Odmaknite|Napadnite|Napadate|Morate|Imate|Smijete)\b|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(Vaš|vaš)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(vašim|Vašim|vašeg|Vašeg)(?=\s)|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])vam se\b/;

const RAW_EN_IN_HR =
  /\b(gap|wingback|pick and roll|through ball|crosscourt|man-to-man|first wave|second wave|passive warning|left-hander|right-hander|half-space|strong side|weak side|seal|screen)\b/i;

const REQUIRED = {
  '6:0': /6:0|6-0/,
  '5:1': /5:1|5-1/,
  '3:2:1': /3:2:1|3-2-1/,
  '3:3': /3:3|3-3/,
  '4:2': /4:2|4-2/,
  '1:5': /1:5|1-5/,
  '5+1': /5\+1/,
  '4+2': /4\+2/,
  open_or_individual: /man-to-man|open defen|individualn|otvoren/i,
  '6v5': /6v5|6 na 5|6-on-5|igračem više|igrač više/i,
  '5v6': /5v6|5 na 6|5-on-6|igračem manje|igrač manje/i,
  '7v6': /7v6|7 na 6|second.?pivot|drugog pivota/i,
  passive: /passive|pasivn/i,
  transition_attack: /first wave|polukontra|second wave|partially|tranzicij|kontranapad/i,
  transition_defence: /recover|povratak|deny|protect centr|prvi u povratku|zaštiti sredin/i,
  end_game: /Final Minutes|final possession|kasno|18 sekund|14 sekund|90 sekund|30 sekund|20 sekund|10 sekund/i,
  pivot: /pivot|kreisl/i,
  wing: /wing|krilo|flügel|außen/i,
  left_back_coop: /left back|lijevi vanjski|linker rückraum/i,
  right_back_coop: /right back|desni vanjski|rechter rückraum/i,
  crossing: /cross|križanj/i,
  parallel: /parallel|paralel/i,
};

const report = { status: 'PASS', errors: [], warnings: [] };

const cb = bank.filter((s) => s.primaryPosition === 'Centre Back');
const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
const rb = bank.filter((s) => s.primaryPosition === 'Right Back');
report.cbCount = cb.length;
report.lbCount = lb.length;
report.rbCount = rb.length;

if (cb.length < 55) report.errors.push(`CB primary count too low: ${cb.length}`);
if (cb.length > 80) report.warnings.push(`CB primary count high: ${cb.length}`);
if (lb.length < 60) report.errors.push(`Left Back gold damaged: only ${lb.length}`);
if (rb.length < 60) report.errors.push(`Right Back gold damaged: only ${rb.length}`);

const families = new Map();
for (const s of cb) {
  const fid = getScenarioFamilyId(s);
  if (!families.has(fid)) families.set(fid, []);
  families.get(fid).push(s.id);
}
report.familyCount = families.size;
for (const [fid, ids] of families) {
  if (ids.length > 1) report.errors.push(`Semantic clone: ${fid} → ${ids.join(',')}`);
}

const fps = new Map();
const qfps = new Map();
for (const s of cb) {
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

  const opts = (s.answers || []).filter((a) => a.quality === 'optimal');
  if (opts.length !== 1) report.errors.push(`${s.id} optimal count ${opts.length}`);
  if ((s.answers || []).length !== 4) report.errors.push(`${s.id} answer count ${(s.answers || []).length}`);

  const hr = [s.title?.hr, s.situation?.hr, s.question?.hr, s.explanation?.hr, s.whyCorrectOverSecondBest?.hr, ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr])].join(
    '\n',
  );
  if (FORBIDDEN.test(hr)) report.errors.push(`${s.id} forbidden HR: ${hr.match(FORBIDDEN)?.[0]}`);
  if (VI_FORM.test(hr)) report.errors.push(`${s.id} ti/vi mix: ${hr.match(VI_FORM)?.[0]}`);
  if (RAW_EN_IN_HR.test(hr)) report.errors.push(`${s.id} raw EN in HR: ${hr.match(RAW_EN_IN_HR)?.[0]}`);
  if (/scn_bank_\d+/.test(hr)) report.errors.push(`${s.id} raw id in content`);
}

const blobAll = cb.map((s) => `${s.title?.en} ${s.situation?.en} ${s.situation?.hr} ${s.question?.hr} ${s.explanation?.hr}`).join('\n');
report.coverage = {};
for (const [name, re] of Object.entries(REQUIRED)) {
  const ok = re.test(blobAll);
  report.coverage[name] = ok;
  if (!ok) report.errors.push(`Missing required coverage: ${name}`);
}

const seven = cb.filter(
  (s) =>
    (s.skillTags || []).includes('numerical:7v6') ||
    /7v6|7 na 6|drugog pivota|second pivot/i.test(`${s.title?.en} ${s.situation?.en} ${s.situation?.hr}`),
).length;
report.sevenV6Count = seven;
if (seven < 4) report.errors.push(`7v6 depth too low: ${seven}`);

report.attack = cb.filter((s) => s.attackOrDefence === 'Attack').length;
report.defence = cb.filter((s) => s.attackOrDefence === 'Defence').length;
const defPct = (report.defence / cb.length) * 100;
report.defencePct = Math.round(defPct * 10) / 10;
if (defPct < 12) report.errors.push(`Defensive content critically thin: ${defPct.toFixed(1)}%`);
else if (defPct < 15) report.warnings.push(`Defence share ${defPct.toFixed(1)}% below aspirational 15–20%`);

report.difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [d, cb.filter((s) => s.difficulty === d).length]),
);

const perceptionRe =
  /čitaš|prvi signal|koji je signal|koji je prvi signal|gdje nastaje|što ti pokazuje|što se promijenilo|koga (prvo )?moraš|koji branič|koji se prostor|koju opciju|signal za|ne mijenjaš|gdje se otvara|što je prvi/i;
const percN = cb.filter(
  (s) => perceptionRe.test(s.question?.hr || '') || (s.skillTags || []).includes('perception'),
).length;
report.perceptionCount = percN;
report.perceptionPct = Math.round((percN / cb.length) * 1000) / 10;
if (report.perceptionPct < 30) {
  report.errors.push(`Perception ${report.perceptionPct}% (${percN}/${cb.length}) below required 30%`);
}

const scores = cb.map((s) =>
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

report.status = report.errors.length ? 'FAIL' : 'PASS';
writeFileSync(join(root, 'scripts/cb-gold-bank-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exit(report.status === 'PASS' ? 0 : 1);
