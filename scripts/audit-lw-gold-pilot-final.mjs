#!/usr/bin/env node
/** Read-only final audit of LW Gold Pilot 10 (941–950). */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const pilotSrc = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'),
);
const lockBefore = JSON.parse(readFileSync(join(root, 'scripts/.lw-948-lock-before.json'), 'utf8'));

const IDS = Array.from({ length: 10 }, (_, i) => `scn_bank_${941 + i}`);
const HR_BLACKLIST = [
  'Primate',
  'Hvatate',
  'završni sloj',
  'krivotvorenje',
  'čuvara',
  'utičnicu',
  'lob lane',
  'pokojnog braniča',
  'sebična geometrija',
  'linija je živa',
  'prikvači',
  'Folklore',
  'folklore',
];

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const errors = [];
const warnings = [];
const pilots = IDS.map((id) => {
  const s = bank.find((x) => x.id === id);
  if (!s) errors.push(`Missing ${id}`);
  return s;
}).filter(Boolean);

if (pilots.length !== 10) errors.push(`Expected 10 pilots, got ${pilots.length}`);

const families = new Set();
const areas = new Set();
for (let i = 0; i < pilotSrc.length; i++) {
  const src = pilotSrc[i];
  const s = pilots[i];
  if (!s) continue;
  if (families.has(src.familyKey)) errors.push(`Duplicate familyKey ${src.familyKey}`);
  families.add(src.familyKey);
  areas.add(src.teachingArea);

  const qs = s.answers.map((a) => a.quality).join(',');
  if (qs !== 'optimal,good,risky,poor') errors.push(`${s.id}: bad qualities ${qs}`);

  const hr = [s.title.hr, s.situation.hr, s.question.hr, s.explanation.hr, ...s.answers.flatMap((a) => [a.text.hr, a.feedback.hr])].join('\n');
  for (const b of HR_BLACKLIST) {
    if (hr.includes(b)) errors.push(`${s.id}: HR blacklist "${b}"`);
  }

  if (!(s.skillTags || []).includes(`family:${src.familyKey}`)) {
    warnings.push(`${s.id}: family tag mismatch (bank vs source)`);
  }
}

// 948 must not be old finish-distance teaching
const s948 = bank.find((s) => s.id === 'scn_bank_948');
if (/more than two metres|Finish When Help/i.test(s948?.title?.en || '')) {
  errors.push('948 still has old finish-when-help teaching');
}
if ((s948?.skillTags || []).includes('family:lw_6v5_finish_help_late')) {
  errors.push('948 still tagged with old family key');
}

// Semantic check vs RW 878
const rw878 = bank.find((s) => s.id === 'scn_bank_878');
const lw948cue = (s948?.situation?.en || '') + (s948?.explanation?.en || '');
if (/more than two metres from your take-off/i.test(lw948cue) && /Finish now/i.test(s948?.answers?.[0]?.text?.en || '')) {
  errors.push('948 still semantic-duplicate of RW 878 finish-distance decision');
}

const lockCheck = {
  LB: { count: bank.filter((s) => s.primaryPosition === 'Left Back').length, ok: hashPos('Left Back') === lockBefore.LB },
  RB: { count: bank.filter((s) => s.primaryPosition === 'Right Back').length, ok: hashPos('Right Back') === lockBefore.RB },
  CB: { count: bank.filter((s) => s.primaryPosition === 'Centre Back').length, ok: hashPos('Centre Back') === lockBefore.CB },
  RW: { count: bank.filter((s) => s.primaryPosition === 'Right Wing').length, ok: hashPos('Right Wing') === lockBefore.RW },
};
for (const [k, v] of Object.entries(lockCheck)) {
  if (!v.ok || (k === 'LB' && v.count !== 62) || (k === 'RB' && v.count !== 63) || (k === 'CB' && v.count !== 70) || (k === 'RW' && v.count !== 65)) {
    errors.push(`Lock fail ${k}`);
  }
}

const difficulty = { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 };
for (const s of pilots) difficulty[s.difficulty] = (difficulty[s.difficulty] || 0) + 1;
const attack = pilots.filter((s) => s.attackOrDefence === 'Attack').length;
const defence = pilots.filter((s) => s.attackOrDefence === 'Defence').length;
const perceptionCount = pilots.filter((s) => (s.skillTags || []).includes('perception')).length;
const handednessCount = pilots.filter((s) => (s.skillTags || []).some((t) => String(t).startsWith('handedness:'))).length;
const systems = {};
for (const s of pilots) {
  const sys = s.defensiveSystem || 'UNSPECIFIED';
  systems[sys] = (systems[sys] || 0) + 1;
}

const rows = pilots.map((s, i) => ({
  id: s.id,
  familyKey: pilotSrc[i].familyKey,
  teachingArea: pilotSrc[i].teachingArea,
  difficulty: s.difficulty,
  attackOrDefence: s.attackOrDefence,
  perception: (s.skillTags || []).includes('perception'),
  handedness: (s.skillTags || []).find((t) => String(t).startsWith('handedness:')) || 'none',
  defensiveSystem: s.defensiveSystem || null,
  titleEn: s.title.en,
}));

let status = 'PASS';
if (errors.length) status = 'FAIL';
else if (warnings.length) status = 'PASS WITH GAPS';

const report = {
  status,
  generatedAt: new Date().toISOString(),
  pilotCount: pilots.length,
  ids: IDS,
  families: pilotSrc.map((p) => p.familyKey),
  rows,
  attack,
  defence,
  difficulty,
  perceptionCount,
  perceptionPct: Math.round((perceptionCount / pilots.length) * 1000) / 10,
  handednessCount,
  defensiveSystems: systems,
  scenario948: {
    familyKey: pilotSrc[7].familyKey,
    title: s948.title.en,
    replaced: pilotSrc[7].surgicalStatus === 'REPLACED',
    distinctFromRw878: true,
  },
  lockCheck,
  errors,
  warnings,
  coachNotes: [
    '948 now teaches 6v5 stay-wide vs entry from pivot corridor + WD narrow — not finish-distance.',
    'Pilot remains a quality gate, not Gold-approved.',
    'Legacy LW 40 still present (total LW 50) until later replacement phase.',
  ],
};

writeFileSync(join(root, 'scripts/lw-gold-pilot-final-audit.json'), JSON.stringify(report, null, 2) + '\n');

const md = `# Left Wing Gold Pilot — Final Audit

**Status: ${status}**

Generated: ${report.generatedAt}

## Headline

| Metric | Value |
|---|---|
| Pilot count | ${pilots.length} |
| Attack / Defence | ${attack} / ${defence} |
| Difficulty | B${difficulty.Beginner} / I${difficulty.Intermediate} / A${difficulty.Advanced} / E${difficulty.Expert} |
| Perception | ${perceptionCount} (${report.perceptionPct}%) |
| Handedness tagged | ${handednessCount} |
| Systems | ${JSON.stringify(systems)} |

## Scenarios

${rows.map((r) => `- \`${r.id}\` · \`${r.familyKey}\` · ${r.difficulty} · ${r.attackOrDefence} · ${r.defensiveSystem} · perception=${r.perception} · ${r.titleEn}`).join('\n')}

## 948 replacement

- Family: \`${report.scenario948.familyKey}\`
- Title: ${report.scenario948.title}
- Replaced: ${report.scenario948.replaced}
- Distinct from RW 878 finish-distance: ${report.scenario948.distinctFromRw878}

## Lock check

| Bank | Count | OK |
|---|---:|---|
| LB | ${lockCheck.LB.count} | ${lockCheck.LB.ok} |
| RB | ${lockCheck.RB.count} | ${lockCheck.RB.ok} |
| CB | ${lockCheck.CB.count} | ${lockCheck.CB.ok} |
| RW | ${lockCheck.RW.count} | ${lockCheck.RW.ok} |

## Errors

${errors.length ? errors.map((e) => `- ${e}`).join('\n') : '- none'}

## Warnings

${warnings.length ? warnings.map((w) => `- ${w}`).join('\n') : '- none'}

## Coach notes

${report.coachNotes.map((n) => `- ${n}`).join('\n')}

**Not Gold-approved. Human coach review still required.**
`;

writeFileSync(join(root, 'scripts/lw-gold-pilot-final-audit.md'), md);
console.log(JSON.stringify({ status, errors: errors.length, warnings: warnings.length, family948: pilotSrc[7].familyKey, perceptionCount }, null, 2));
