#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_PILOT_10 } from './scenario-bank/data/pivot-gold-pilot-10.mjs';
import { PIVOT_GOLD_FAMILIES } from './scenario-bank/data/pivot-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = {
  status: 'PIVOT GOLD PILOT — HUMAN COACH REVIEW',
  pilotCount: PIVOT_GOLD_PILOT_10.length,
  fullBankTarget: PIVOT_GOLD_FAMILIES.length,
  instructions: [
    'Approve tactical correctness, not wording preference alone.',
    'Confirm optimal is clearly better than good under the stated cue.',
    'Reject any screen, seal, or defensive contact that depends on illegal holding.',
    'Confirm HR/DE language sounds native to a handball coach.',
    'Do not insert pilot into runtime bank until human approval.',
  ],
  scenarios: PIVOT_GOLD_PILOT_10,
};
writeFileSync(
  join(root, 'scripts/pivot-gold-pilot-10-review.json'),
  `${JSON.stringify(out, null, 2)}\n`,
);

const md = [
  '# Pivot Gold Pilot — Human Coach Review',
  '',
  `**Pilot: ${out.pilotCount} / full architecture: ${out.fullBankTarget} unique families**`,
  '',
  ...out.instructions.map((x) => `- ${x}`),
  '',
];
for (const [index, p] of PIVOT_GOLD_PILOT_10.entries()) {
  md.push(`## ${index + 1}. ${p.title.en}`);
  md.push('');
  md.push(`- Family: \`${p.familyKey}\``);
  md.push(`- Area: \`${p.teachingArea}\``);
  md.push(`- Cue: ${p.primaryTacticalCue}`);
  md.push(`- Structure: ${p.defensiveSystem || p.matchPhase} / ${p.numerical}`);
  md.push('');
  for (const locale of ['en', 'hr', 'de']) {
    md.push(`### ${locale.toUpperCase()}`);
    md.push('');
    md.push(`**Situation:** ${p.situation[locale]}`);
    md.push('');
    md.push(`**Question:** ${p.question[locale]}`);
    md.push('');
    for (const [ai, a] of p.answers.entries()) {
      md.push(`${String.fromCharCode(65 + ai)}. **${a.quality}** — ${a.text[locale]}`);
      md.push(`   - ${a.feedback[locale]}`);
    }
    md.push('');
    md.push(`**Explanation:** ${p.explanation[locale]}`);
    md.push('');
    md.push(`**A over B:** ${p.whyCorrectOverSecondBest[locale]}`);
    md.push('');
  }
}
writeFileSync(join(root, 'scripts/pivot-gold-pilot-10-review.md'), md.join('\n'));
console.log(
  JSON.stringify(
    {
      status: out.status,
      pilotCount: out.pilotCount,
      fullBankTarget: out.fullBankTarget,
      runtimeBankModified: false,
    },
    null,
    2,
  ),
);
