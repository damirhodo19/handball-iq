#!/usr/bin/env node
/**
 * Right Wing Handball Language Gate — hard FAIL audit.
 * Default: production bank Right Wing primaries.
 * Pilot: node scripts/audit-right-wing-language-gate.mjs --pilot [path]
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const pilotIdx = args.indexOf('--pilot');
const pilotMode = pilotIdx !== -1;
const pilotPath =
  pilotMode && args[pilotIdx + 1] && !args[pilotIdx + 1].startsWith('-')
    ? args[pilotIdx + 1]
    : join(root, 'scripts/scenario-bank/data/right-wing-gold-pilot-10.json');

let rw;
let sourceLabel;
if (pilotMode) {
  if (!existsSync(pilotPath)) {
    console.error(`Pilot file missing: ${pilotPath}`);
    process.exit(1);
  }
  const pilot = JSON.parse(readFileSync(pilotPath, 'utf8'));
  rw = Array.isArray(pilot) ? pilot : pilot.scenarios || [];
  sourceLabel = pilotPath;
} else {
  const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
  rw = bank.filter((s) => s.primaryPosition === 'Right Wing');
  sourceLabel = 'content/scenario-bank/scenarios.json (Right Wing primary)';
}

function blob(s) {
  return [
    s.title,
    s.situation,
    s.question,
    s.explanation,
    s.whyCorrectOverSecondBest,
    ...(s.answers || []).flatMap((a) => [a.text, a.feedback]),
  ]
    .map((x) => `${x?.en || ''}\n${x?.hr || ''}\n${x?.de || ''}`)
    .join('\n');
}

function hrBlob(s) {
  return [
    s.title?.hr,
    s.situation?.hr,
    s.question?.hr,
    s.explanation?.hr,
    s.whyCorrectOverSecondBest?.hr,
    ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr]),
  ]
    .filter(Boolean)
    .join('\n');
}

const FORBIDDEN = [
  { re: /Vratar sjedi|vratar sjedi|goalkeeper sits|keeper sits|Torhüter sitzt/i, label: 'gk_sits' },
  { re: /\b(wide|narrow|open|good|bad)\s+angle\b/i, label: 'empty_angle_en' },
  { re: /po širokom kutu|širok(i|om) kut(?!\w)|uzak kut|uski kut(?!\w)/i, label: 'empty_kut_hr' },
  { re: /Vratar ostavlja kut|vratar ostavlja kut/i, label: 'vague_gk_kut' },
  { re: /\b(open|closed)\s+space\b/i, label: 'empty_space_en' },
  { re: /\b(Primate|Hvatate|Imate|morate|smijete|Napadnite|Odmaknite)\b/, label: 'vi_or_formal_hr' },
  { re: /\b(utičnic|sjecanje|završni sloj|odlutao|bočni branič|stražnji dio)\b/i, label: 'mt_nonsense_hr' },
  { re: /^\s*Napadni prostor\.?\s*$/im, label: 'bare_napadni_prostor' },
  // standalone keeper/feed/power-play — not substring of goalkeeper
  { re: /(?:^|[^A-Za-z])keeper(?:[^A-Za-z]|$)/i, label: 'forbidden_loan_mt_keeper' },
  { re: /(?:^|[^A-Za-z])feed(?:[^A-Za-z]|$)/i, label: 'forbidden_loan_mt_feed' },
  { re: /power-?play|tuljan|brtva|centaršut/i, label: 'forbidden_loan_mt' },
];

const GEO_HR =
  /krilni branič|polubranitelj|desni vanjski|pivot|prva stativa|druga stativa|bliži kut|dalji kut|odraz|aut-linij|šest metara|linija šest|ulazak|utrč|kontranapad|prvi val|drugi val|preuzimanje|prazan gol/i;

const report = {
  status: 'PASS',
  mode: pilotMode ? 'pilot' : 'production',
  source: sourceLabel,
  rwCount: rw.length,
  errors: [],
  warnings: [],
  byScenario: [],
};

if (rw.length === 0) {
  report.errors.push('No Right Wing scenarios found in source');
}

for (const s of rw) {
  const all = blob(s);
  const hr = hrBlob(s);
  const errs = [];
  const warns = [];
  const id = s.id || s.familyKey || 'unknown';

  for (const { re, label } of FORBIDDEN) {
    if (re.test(all) || re.test(hr)) {
      const hit = (all.match(re) || hr.match(re) || [])[0];
      errs.push(`${label}: ${hit}`);
    }
  }

  const opt = (s.answers || []).find((a) => a.quality === 'optimal');
  if (opt && /^\s*Napadni prostor\.?\s*$/i.test(opt.text?.hr || '')) {
    errs.push('bare_napadni_prostor: optimal answer');
  }

  if (!GEO_HR.test(s.situation?.hr || '')) {
    warns.push('situation_hr_weak_geometry_vocabulary');
  }

  if (/\d+\s*[:–-]\s*\d+/.test(s.situation?.hr || '') && !/Vodite|Gubite|Neriješeno/.test(s.situation?.hr || '')) {
    warns.push('score_without_vodite_gubite_nerijeseno');
  }

  // Completeness
  for (const lang of ['en', 'hr', 'de']) {
    if (!s.situation?.[lang] || !s.question?.[lang] || !s.explanation?.[lang]) {
      errs.push(`missing_${lang}_core_fields`);
    }
    if (!s.whyCorrectOverSecondBest?.[lang]) errs.push(`missing_why_${lang}`);
  }
  if (!(s.answers || []).length || s.answers.length !== 4) errs.push('need_exactly_4_answers');
  else {
    const qs = s.answers.map((a) => a.quality).join(',');
    if (qs !== 'optimal,good,risky,poor') errs.push(`answer_qualities=${qs}`);
    for (const [i, a] of s.answers.entries()) {
      for (const lang of ['en', 'hr', 'de']) {
        if (!a.text?.[lang] || !a.feedback?.[lang]) errs.push(`A${i}_missing_${lang}`);
      }
    }
  }

  if (errs.length || warns.length) {
    report.byScenario.push({ id, title: s.title?.en, errors: errs, warnings: warns });
  }
  for (const e of errs) report.errors.push(`${id}: ${e}`);
  for (const w of warns) report.warnings.push(`${id}: ${w}`);
}

report.errorCount = report.errors.length;
report.warningCount = report.warnings.length;
report.scenariosWithErrors = report.byScenario.filter((x) => x.errors.length).length;
report.status = report.errors.length ? 'FAIL' : 'PASS';

const outName = pilotMode ? 'rw-gold-pilot-language-gate-report.json' : 'rw-language-gate-report.json';
writeFileSync(join(root, 'scripts', outName), JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify(
    {
      status: report.status,
      mode: report.mode,
      source: report.source,
      rwCount: report.rwCount,
      scenariosWithErrors: report.scenariosWithErrors,
      errorCount: report.errorCount,
      warningCount: report.warningCount,
      sampleErrors: report.errors.slice(0, 20),
    },
    null,
    2,
  ),
);
process.exit(report.status === 'PASS' ? 0 : 1);
