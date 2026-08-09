#!/usr/bin/env node
/**
 * validate:left-back-gold-bank
 * Verifies Left Back gold bank coverage, language, uniqueness, difficulty.
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
  /tuljan|brtva|\bosovin|novinar|\btisak\b|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|sporni šut|\bu hvatu\b|pokojni branič/i;

const REQUIRED_COVERAGE = {
  '6:0': /6:0|6-0/,
  '5:1': /5:1|5-1/,
  '3:2:1': /3:2:1|3-2-1/,
  '3:3': /3:3|3-3/,
  '4:2': /4:2|4-2/,
  '1:5': /1:5|1-5/,
  '5+1': /5\+1/,
  '4+2': /4\+2/,
  open_or_man: /man-to-man|open defen|individual|otvoren/i,
  '1v1': /1v1|1 na 1|1 against 1|jedan na jedan|hips|defender too/i,
  pivot: /pivot|kreisläufer|zatvor/i,
  crossing_or_parallel: /cross|križanj|parallel|paralel/i,
  '7v6': /7v6|7 na 6|7 against 6|second.?pivot|drugog pivota/i,
  '5v6': /5v6|5 na 6|5-on-6|short-handed|igračem manje|igrač manje/i,
  '6v5': /6v5|6 na 5|6-on-5|igračem više|igrač više|player-up/i,
  passive: /passive|pasivn/i,
  transition_attack: /first wave|polukontra|second wave|transition|kontranapad|brzinom/i,
  transition_defence: /recover|povratak|first player|deny skip|protect centr/i,
  end_game: /Final Minutes|18 seconds|zadnjem|final possession|kasno/i,
  gk_or_shot: /goalkeeper|vratar|block|blok|šut|shot/i,
};

const report = {
  status: 'PASS',
  errors: [],
  warnings: [],
  lbPrimaryCount: 0,
  familyCount: 0,
  coverage: {},
  difficulty: {},
  perceptionPct: 0,
  avgRubricV2: 0,
  minRubricV2: 0,
};

const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
report.lbPrimaryCount = lb.length;

if (lb.length < 35) report.errors.push(`LB primary count too low: ${lb.length}`);
if (lb.length > 64) report.warnings.push(`LB primary count high: ${lb.length} — review for padding (target ≤64)`);

const families = new Map();
for (const s of lb) {
  const fid = getScenarioFamilyId(s);
  if (!families.has(fid)) families.set(fid, []);
  families.get(fid).push(s.id);
}
report.familyCount = families.size;

for (const [fid, ids] of families) {
  if (ids.length > 1) report.errors.push(`Semantic family duplicate: ${fid} → ${ids.join(',')}`);
}

// Exact duplicate fingerprints
const fps = new Map();
for (const s of lb) {
  const fp = createHash('sha1')
    .update(`${s.title?.en}|${s.situation?.en}|${s.question?.en}`)
    .digest('hex')
    .slice(0, 12);
  if (fps.has(fp)) report.errors.push(`Exact duplicate of ${fps.get(fp)}: ${s.id}`);
  else fps.set(fp, s.id);
}

// GK leakage
for (const s of lb) {
  if (s.primaryPosition === 'Goalkeeper') report.errors.push(`${s.id} GK primary in LB set`);
  if ((s.secondaryPositions || []).includes('Goalkeeper') && /goalkeeper only|save the ball/i.test(s.situation?.en || '')) {
    report.errors.push(`${s.id} possible GK-only leakage`);
  }
}

// Raw IDs in player-facing text
for (const s of lb) {
  const blob = [s.situation, s.question, s.explanation, ...s.answers.map((a) => a.text)]
    .map((x) => `${x?.en || ''} ${x?.hr || ''}`)
    .join(' ');
  if (/scn_bank_\d+/.test(blob)) report.errors.push(`${s.id} raw scenario id in content`);
}

// Forbidden HR
for (const s of lb) {
  const hr = [s.situation?.hr, s.question?.hr, s.explanation?.hr, ...s.answers.flatMap((a) => [a.text?.hr, a.feedback?.hr])].join(
    '\n',
  );
  if (FORBIDDEN.test(hr)) report.errors.push(`${s.id} forbidden HR: ${hr.match(FORBIDDEN)?.[0]}`);
}

// Coverage
const blobAll = lb.map((s) => `${s.title?.en} ${s.situation?.en} ${s.situation?.hr} ${s.question?.hr}`).join('\n');
for (const [name, re] of Object.entries(REQUIRED_COVERAGE)) {
  const ok = re.test(blobAll);
  report.coverage[name] = ok;
  if (!ok) report.errors.push(`Missing required coverage: ${name}`);
}

// Difficulty
report.difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [d, lb.filter((s) => s.difficulty === d).length]),
);
const total = lb.length || 1;
const begPct = report.difficulty.Beginner / total;
const expPct = report.difficulty.Expert / total;
if (begPct < 0.08) report.warnings.push(`Beginner share low: ${(begPct * 100).toFixed(0)}%`);
if (expPct < 0.12) report.warnings.push(`Expert share low: ${(expPct * 100).toFixed(0)}%`);

// Perception — genuine recognition questions (≥25% required; honesty over PASS)
const perceptionRe =
  /čitaš|prvi signal|koji je signal|koji je prvi signal|gdje nastaje|što ti pokazuje|što ti položaj|koji branič mora|koji se prostor|što se promijenilo|koju opciju|ne križaš|otvoriti sljedeća|što vratar/i;
const perceptionN = lb.filter(
  (s) => perceptionRe.test(s.question?.hr || '') || (s.skillTags || []).includes('perception'),
).length;
report.perceptionCount = perceptionN;
report.perceptionPct = Math.round((perceptionN / total) * 1000) / 10; // one decimal
if (report.perceptionPct < 25) {
  report.errors.push(
    `Perception questions ${report.perceptionPct}% (${perceptionN}/${total}) below required minimum 25%`,
  );
}

// Single-best automatable: exactly one optimal
for (const s of lb) {
  const opts = (s.answers || []).filter((a) => a.quality === 'optimal');
  if (opts.length !== 1) report.errors.push(`${s.id} optimal count ${opts.length}`);
  const quals = (s.answers || []).map((a) => a.quality);
  if (!quals.includes('good') || !quals.includes('risky') || !quals.includes('poor')) {
    report.errors.push(`${s.id} missing quality ladder`);
  }
}

// Rubric averages
const scores = lb.map((s) =>
  scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  }).overall,
);
report.avgRubricV2 = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
report.minRubricV2 = Math.min(...scores);
if (report.minRubricV2 < 7.5) report.errors.push(`Lowest rubric ${report.minRubricV2} below floor`);
if (report.avgRubricV2 < 8.2) report.warnings.push(`Average rubric ${report.avgRubricV2} below aspirational 8.2`);

// Score language on attack/final
for (const s of lb) {
  if (!/Vodite|Gubite|Neriješeno/.test(s.situation?.hr || '')) {
    report.warnings.push(`${s.id} missing Vodite/Gubite/Neriješeno score phrasing`);
  }
}

report.status = report.errors.length ? 'FAIL' : 'PASS';
writeFileSync(join(root, 'scripts/lb-gold-bank-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exit(report.status === 'PASS' ? 0 : 1);
