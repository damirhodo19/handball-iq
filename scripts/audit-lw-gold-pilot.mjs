#!/usr/bin/env node
/**
 * Read-only audit of Left Wing Gold pilot (scn_bank_941–950).
 * Does not mutate scenarios.json.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const pilotSrc = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'),
);
const lockBefore = JSON.parse(
  readFileSync(join(root, 'scripts/.lw-pilot-lock-before.json'), 'utf8'),
);

const REQUIRED_AREAS = [
  'positional_width_set_defence',
  'left_back_cooperation',
  'wing_defender_hips_feet',
  'takeoff_geometry',
  'when_not_to_enter',
  'goalkeeper_perception',
  'first_wave_transition',
  'numerical_attack',
  'set_defence_wing_responsibility',
  'transition_defence',
];

const HR_BLACKLIST = [
  'Primate',
  'Hvatate',
  'završni sloj',
  'krivotvorenje',
  'čuvara',
  'utičnicu',
  'lob lane',
  'pokojnog braniča',
];

const hashPos = (pos, data = bank) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(data.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const pilots = bank.filter((s) => {
  const n = Number(String(s.id).replace(/\D/g, ''));
  return s.primaryPosition === 'Left Wing' && n >= 941 && n <= 950;
});

const errors = [];
const warnings = [];

if (pilots.length !== 10) errors.push(`Expected 10 pilot scenarios in bank, found ${pilots.length}`);

const byId = Object.fromEntries(pilots.map((s) => [s.id, s]));
const srcByPilot = Object.fromEntries(pilotSrc.map((p) => [p.pilotId, p]));

const familyKeys = new Set();
const areas = new Set();
const fingerprints = [];

for (const src of pilotSrc) {
  const id = `scn_bank_${940 + Number(src.pilotId.replace(/\D/g, ''))}`;
  // pilot_01 -> 941
  const num = Number(src.pilotId.replace('lw_pilot_', ''));
  const expectedId = `scn_bank_${940 + num}`;
  const s = byId[expectedId];
  if (!s) {
    errors.push(`Missing bank scenario for ${src.pilotId} (${expectedId})`);
    continue;
  }
  if (familyKeys.has(src.familyKey)) errors.push(`Duplicate familyKey ${src.familyKey}`);
  familyKeys.add(src.familyKey);
  if (areas.has(src.teachingArea)) errors.push(`Duplicate teachingArea ${src.teachingArea}`);
  areas.add(src.teachingArea);

  const qs = s.answers.map((a) => a.quality).join(',');
  if (qs !== 'optimal,good,risky,poor') errors.push(`${s.id}: answer qualities ${qs}`);

  for (const loc of ['en', 'hr', 'de']) {
    if (!s.title?.[loc] || !s.situation?.[loc] || !s.question?.[loc] || !s.explanation?.[loc]) {
      errors.push(`${s.id}: missing ${loc} core text`);
    }
    for (const a of s.answers) {
      if (!a.text?.[loc] || !a.feedback?.[loc]) errors.push(`${s.id}: missing ${loc} answer`);
    }
  }

  const hrBlob = [s.situation.hr, s.question.hr, ...s.answers.map((a) => a.text.hr), s.explanation.hr].join(
    '\n',
  );
  for (const b of HR_BLACKLIST) {
    if (hrBlob.includes(b)) errors.push(`${s.id}: HR blacklist hit "${b}"`);
  }

  if (!(s.skillTags || []).includes(`family:${src.familyKey}`)) {
    warnings.push(`${s.id}: missing family skillTag`);
  }

  fingerprints.push({
    id: s.id,
    familyKey: src.familyKey,
    teachingArea: src.teachingArea,
    ...src.fingerprint,
  });
}

for (const area of REQUIRED_AREAS) {
  if (!areas.has(area)) errors.push(`Missing required teaching area: ${area}`);
}

const attack = pilots.filter((s) => s.attackOrDefence === 'Attack').length;
const defence = pilots.filter((s) => s.attackOrDefence === 'Defence').length;
const difficulty = { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 };
for (const s of pilots) difficulty[s.difficulty] = (difficulty[s.difficulty] || 0) + 1;

const perceptionCount = pilots.filter((s) => (s.skillTags || []).includes('perception')).length;
const handednessCount = pilots.filter((s) =>
  (s.skillTags || []).some((t) => String(t).startsWith('handedness:')),
).length;

const systems = {};
for (const s of pilots) {
  const sys = s.defensiveSystem || 'UNSPECIFIED';
  systems[sys] = (systems[sys] || 0) + 1;
}

// Semantic clone risk within pilot
const cloneRisks = [];
for (let i = 0; i < fingerprints.length; i++) {
  for (let j = i + 1; j < fingerprints.length; j++) {
    const a = fingerprints[i];
    const b = fingerprints[j];
    if (a.decision === b.decision && a.cue === b.cue) {
      cloneRisks.push({ a: a.id, b: b.id, reason: 'identical decision+cue' });
    }
  }
}

// RW similarity: title stems
const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');
const rwSim = [];
for (const src of pilotSrc) {
  const lwCore = src.title.en
    .replace(/^Left Wing — /, '')
    .toLowerCase()
    .replace(/left /g, '')
    .replace(/lijevo|lijevi/g, '');
  for (const r of rw) {
    const rwCore = (r.title?.en || '')
      .replace(/^Right Wing — /, '')
      .toLowerCase()
      .replace(/right /g, '');
    // crude overlap: same key verbs
    const lwTokens = new Set(lwCore.split(/[^a-z0-9]+/).filter((t) => t.length > 4));
    const rwTokens = new Set(rwCore.split(/[^a-z0-9]+/).filter((t) => t.length > 4));
    let overlap = 0;
    for (const t of lwTokens) if (rwTokens.has(t)) overlap++;
    const ratio = lwTokens.size ? overlap / lwTokens.size : 0;
    if (ratio >= 0.55 && overlap >= 4) {
      rwSim.push({
        lw: src.familyKey,
        rw: r.id,
        rwTitle: r.title.en,
        overlap,
        ratio: Math.round(ratio * 100) / 100,
      });
    }
  }
}

const lockCheck = {
  LB: {
    count: bank.filter((s) => s.primaryPosition === 'Left Back').length,
    hash: hashPos('Left Back'),
    unchanged:
      bank.filter((s) => s.primaryPosition === 'Left Back').length === 62 &&
      hashPos('Left Back') === lockBefore.LB,
  },
  RB: {
    count: bank.filter((s) => s.primaryPosition === 'Right Back').length,
    hash: hashPos('Right Back'),
    unchanged:
      bank.filter((s) => s.primaryPosition === 'Right Back').length === 63 &&
      hashPos('Right Back') === lockBefore.RB,
  },
  CB: {
    count: bank.filter((s) => s.primaryPosition === 'Centre Back').length,
    hash: hashPos('Centre Back'),
    unchanged:
      bank.filter((s) => s.primaryPosition === 'Centre Back').length === 70 &&
      hashPos('Centre Back') === lockBefore.CB,
  },
  RW: {
    count: bank.filter((s) => s.primaryPosition === 'Right Wing').length,
    hash: hashPos('Right Wing'),
    unchanged:
      bank.filter((s) => s.primaryPosition === 'Right Wing').length === 65 &&
      hashPos('Right Wing') === lockBefore.RW,
  },
};

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  if (!lockCheck[k].unchanged) errors.push(`Locked bank changed: ${k}`);
}

const bankSha = crypto
  .createHash('sha256')
  .update(readFileSync(join(root, 'content/scenario-bank/scenarios.json')))
  .digest('hex');

let status = 'PASS';
if (errors.length) status = 'FAIL';
else if (warnings.length || rwSim.length || cloneRisks.length) status = 'PASS WITH GAPS';

const report = {
  status,
  generatedAt: new Date().toISOString(),
  pilotCount: pilots.length,
  ids: pilots.map((s) => s.id),
  teachingFamilies: pilotSrc.map((p) => p.familyKey),
  teachingAreas: [...areas],
  attack,
  defence,
  difficulty,
  perceptionCount,
  perceptionPct: pilots.length ? Math.round((perceptionCount / pilots.length) * 1000) / 10 : 0,
  handednessCount,
  defensiveSystems: systems,
  cloneRisks,
  rwSimilarityRisks: rwSim,
  errors,
  warnings,
  lockCheck,
  bankSha256: bankSha,
  bankSha256Before: lockBefore.bankSha256,
  tacticalUncertainties: [
    'Pilot_08 shares thematic DNA with RW 6v5 help-distance family — wording/geometry are left-native but human should confirm distinctness.',
    'Pilot_09 beginner defence assumes a stated team handover rule — correct for answer ladder; confirm club-agnostic clarity.',
  ],
  languageUncertainties: [
    'HR uses natural ti-form coaching; human native coach should still review rhythm of longer situations (esp. pilot_05, pilot_10).',
    'DE uses Absprung / Halber / Kreisläufer consistently with project terms — confirm Halber vs Halbverteidiger preference in full bank later.',
  ],
};

writeFileSync(join(root, 'scripts/lw-gold-pilot-audit.json'), JSON.stringify(report, null, 2) + '\n');

const md = `# Left Wing Gold Pilot Audit

**Status: ${status}**

Generated: ${report.generatedAt}

## Counts

| Metric | Value |
|---|---|
| Pilot scenarios | ${pilots.length} |
| Attack / Defence | ${attack} / ${defence} |
| Difficulty | B${difficulty.Beginner} / I${difficulty.Intermediate} / A${difficulty.Advanced} / E${difficulty.Expert} |
| Perception | ${perceptionCount} (${report.perceptionPct}%) |
| Handedness tagged | ${handednessCount} |
| Systems | ${JSON.stringify(systems)} |

## IDs and families

${pilotSrc
  .map((p, i) => {
    const id = `scn_bank_${941 + i}`;
    return `- \`${id}\` · \`${p.familyKey}\` · ${p.difficulty} · ${p.attackOrDefence} · ${p.defensiveSystem} · perception=${p.perception}`;
  })
  .join('\n')}

## Required teaching areas

${REQUIRED_AREAS.map((a) => `- ${areas.has(a) ? 'OK' : 'MISSING'}: ${a}`).join('\n')}

## Clone / RW similarity

- Internal clone risks: ${cloneRisks.length ? JSON.stringify(cloneRisks) : 'none'}
- RW similarity flags: ${rwSim.length ? rwSim.length + ' (see JSON)' : 'none above threshold'}

## Lock check

| Bank | Count | Unchanged |
|---|---:|---|
| LB | ${lockCheck.LB.count} | ${lockCheck.LB.unchanged} |
| RB | ${lockCheck.RB.count} | ${lockCheck.RB.unchanged} |
| CB | ${lockCheck.CB.count} | ${lockCheck.CB.unchanged} |
| RW | ${lockCheck.RW.count} | ${lockCheck.RW.unchanged} |

Bank SHA-256 now: \`${bankSha}\`  
Bank SHA-256 before pilot: \`${lockBefore.bankSha256}\`

## Errors

${errors.length ? errors.map((e) => `- ${e}`).join('\n') : '- none'}

## Warnings

${warnings.length ? warnings.map((w) => `- ${w}`).join('\n') : '- none'}

## Uncertainties

${report.tacticalUncertainties.map((u) => `- Tactical: ${u}`).join('\n')}
${report.languageUncertainties.map((u) => `- Language: ${u}`).join('\n')}

## Note

Pilot is **not** Gold-approved. Human coach review required.
`;

writeFileSync(join(root, 'scripts/lw-gold-pilot-audit.md'), md);
console.log(JSON.stringify({ status, errors: errors.length, warnings: warnings.length, perceptionCount, attack, defence }, null, 2));
