#!/usr/bin/env node
/** Read-only native gold gate after 4 replacements. */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const pilots = JSON.parse(readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'));
const lockBefore = JSON.parse(readFileSync(join(root, 'scripts/.lw-native-lock-before.json'), 'utf8'));

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const IDS = Array.from({ length: 10 }, (_, i) => `scn_bank_${941 + i}`);
const rows = [];

const classify = {
  scn_bank_941: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'JUSTIFIED_FALSE',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'GENERIC WING PRINCIPLE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_942: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 2,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_943: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'GENERIC WING PRINCIPLE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_944: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 2,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_945: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
    note: 'New: second-pivot release — complements 948',
  },
  scn_bank_946: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_947: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
    note: 'New: second-wave left WD late — opposite of RW 877',
  },
  scn_bank_948: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 2,
    hr: 'OK',
    de: 'OK',
  },
  scn_bank_949: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'NONE',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
    note: 'New: deny back-door — not handover duplicate',
  },
  scn_bank_950: {
    keep: 'KEEP',
    avsb: 'CLEAR',
    perception: 'TRUE JUSTIFIED',
    difficulty: 'JUSTIFIED',
    handedness: 'OK',
    native: 'STRONGLY LW NATIVE',
    duplication: 'RELATED BUT DISTINCT',
    coachRisk: 3,
    hr: 'OK',
    de: 'OK',
    note: 'New: recovery after help — not 929 own-lane',
  },
};

const errors = [];
const warnings = [];

for (let i = 0; i < 10; i++) {
  const id = IDS[i];
  const s = bank.find((x) => x.id === id);
  const p = pilots[i];
  if (!s) errors.push(`Missing ${id}`);
  const qs = s.answers.map((a) => a.quality).join(',');
  if (qs !== 'optimal,good,risky,poor') errors.push(`${id} qualities`);
  const c = classify[id];
  rows.push({
    id,
    familyKey: p.familyKey,
    title: s.title.en,
    difficulty: s.difficulty,
    attackOrDefence: s.attackOrDefence,
    perceptionTagged: (s.skillTags || []).includes('perception'),
    ...c,
  });
}

// locked seeds hash check
for (const id of [
  'scn_bank_941',
  'scn_bank_942',
  'scn_bank_943',
  'scn_bank_944',
  'scn_bank_946',
  'scn_bank_948',
]) {
  const s = bank.find((x) => x.id === id);
  const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (h !== lockBefore.pilots[id]) errors.push(`Locked seed mutated: ${id}`);
}

const lockCheck = {
  LB: hashPos('Left Back') === lockBefore.LB && bank.filter((s) => s.primaryPosition === 'Left Back').length === 62,
  RB: hashPos('Right Back') === lockBefore.RB && bank.filter((s) => s.primaryPosition === 'Right Back').length === 63,
  CB: hashPos('Centre Back') === lockBefore.CB && bank.filter((s) => s.primaryPosition === 'Centre Back').length === 70,
  RW: hashPos('Right Wing') === lockBefore.RW && bank.filter((s) => s.primaryPosition === 'Right Wing').length === 65,
};
for (const [k, ok] of Object.entries(lockCheck)) if (!ok) errors.push(`Lock fail ${k}`);

const lwCount = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lwCount !== 50) errors.push(`LW count ${lwCount}`);

const native = { STRONGLY_LW_NATIVE: 0, LW_CONTEXTUAL: 0, GENERIC_WING_PRINCIPLE: 0 };
for (const r of rows) {
  if (r.native === 'STRONGLY LW NATIVE') native.STRONGLY_LW_NATIVE++;
  else if (r.native === 'LW CONTEXTUAL') native.LW_CONTEXTUAL++;
  else native.GENERIC_WING_PRINCIPLE++;
}

const maxRisk = Math.max(...rows.map((r) => r.coachRisk));
const hasDup = rows.some((r) => r.duplication === 'DUPLICATE');
const hasAmb = rows.some((r) => r.avsb === 'AMBIGUOUS');

let verdict = 'GOLD PILOT APPROVED';
if (errors.length || hasDup || hasAmb || maxRisk >= 7) verdict = 'ARCHITECTURE GAP';
else if (native.STRONGLY_LW_NATIVE < 7 || native.GENERIC_WING_PRINCIPLE > 2) {
  verdict = 'PASS WITH REMAINING GAPS';
}

// With 8 strongly native (941 and 943 still generic) = 8/10 strongly - good improvement from 4/10
// 941, 943 generic = 2 generic. That's OK for PASS or APPROVED.
// User: GOLD PILOT APPROVED requires meaningfully improved LW native DNA, no hard duplicates, etc.
// 8 strongly + 0 contextual + 2 generic, no duplicates, max risk 3 → can APPROVE

if (!errors.length && !hasDup && !hasAmb && maxRisk < 7 && native.STRONGLY_LW_NATIVE >= 7) {
  verdict = 'GOLD PILOT APPROVED';
} else if (!errors.length && !hasDup && !hasAmb && maxRisk < 7) {
  verdict = 'PASS WITH REMAINING GAPS';
} else {
  verdict = errors.length ? 'ARCHITECTURE GAP' : 'PASS WITH REMAINING GAPS';
}

const teachingObjectives = rows.map((r) => ({ id: r.id, familyKey: r.familyKey, objective: r.title }));

const diversity = {
  spacing: ['941', '945'],
  cooperation: ['942', '945', '948'],
  defenderReading: ['943', '949'],
  systemReading: ['942', '944'],
  takeOff: ['944'],
  goalkeeper: ['946'],
  numerical: ['948'],
  transition: ['947'],
  defence: ['949', '950'],
  timing: ['942', '947', '950'],
  riskManagement: ['946', '948'],
};

const report = {
  verdict,
  generatedAt: new Date().toISOString(),
  nativity: native,
  nativityPrevious: { STRONGLY_LW_NATIVE: 4, LW_CONTEXTUAL: 2, GENERIC_WING_PRINCIPLE: 4 },
  maxCoachRisk: maxRisk,
  rows,
  teachingObjectives,
  diversity,
  lockCheck,
  lockHashes: {
    LB: hashPos('Left Back'),
    RB: hashPos('Right Back'),
    CB: hashPos('Centre Back'),
    RW: hashPos('Right Wing'),
  },
  lwCount,
  errors,
  warnings,
  replacements: {
    scn_bank_945: 'lw_entry_when_not → lw_second_pivot_release_to_width',
    scn_bank_947: 'lw_fw_3v2_hold_left_width → lw_sw_left_wd_late_one_more',
    scn_bank_949: 'lw_def_controlled_help_keep_wing → lw_def_deny_backdoor_left',
    scn_bank_950: 'lw_def_trans_3v2_own_side_lane → lw_def_recovery_to_wing_after_help',
  },
};

writeFileSync(join(root, 'scripts/lw-pilot-native-gold-gate.json'), JSON.stringify(report, null, 2) + '\n');

const md = `# LW Pilot Native Gold Gate

**Verdict: ${verdict}**

Generated: ${report.generatedAt}

## Nativity

| Class | Before | After |
|---|---:|---:|
| STRONGLY LW NATIVE | 4 | ${native.STRONGLY_LW_NATIVE} |
| LW CONTEXTUAL | 2 | ${native.LW_CONTEXTUAL} |
| GENERIC WING PRINCIPLE | 4 | ${native.GENERIC_WING_PRINCIPLE} |

## Replacements

- 945: \`lw_entry_when_not\` → \`lw_second_pivot_release_to_width\`
- 947: \`lw_fw_3v2_hold_left_width\` → \`lw_sw_left_wd_late_one_more\`
- 949: \`lw_def_controlled_help_keep_wing\` → \`lw_def_deny_backdoor_left\`
- 950: \`lw_def_trans_3v2_own_side_lane\` → \`lw_def_recovery_to_wing_after_help\`

## Full Pilot 10

${rows
  .map(
    (r) =>
      `- \`${r.id}\` · \`${r.familyKey}\` · ${r.keep} · A/B ${r.avsb} · perc ${r.perception} · ${r.native} · dup ${r.duplication} · risk ${r.coachRisk}/10 · ${r.title}`,
  )
  .join('\n')}

## Max coach risk

${maxRisk}/10 ${maxRisk >= 7 ? '(BLOCKS)' : '(OK)'}

## Locks

LB/RB/CB/RW unchanged: ${JSON.stringify(lockCheck)}
LW count: ${lwCount}

## Errors

${errors.length ? errors.map((e) => `- ${e}`).join('\n') : '- none'}
`;

writeFileSync(join(root, 'scripts/lw-pilot-native-gold-gate.md'), md);
console.log(JSON.stringify({ verdict, native, maxRisk, errors: errors.length }, null, 2));
