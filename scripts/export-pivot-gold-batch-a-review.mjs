#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_BATCH_A_15 } from './scenario-bank/data/pivot-gold-batch-a-15.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = {
  status: 'PIVOT GOLD BATCH A — HUMAN COACH REVIEW',
  approvedPilotCount: 10,
  batchCount: PIVOT_GOLD_BATCH_A_15.length,
  sourceGoldAfterBatch: 10 + PIVOT_GOLD_BATCH_A_15.length,
  runtimeBankModified: false,
  scenarios: PIVOT_GOLD_BATCH_A_15,
};
writeFileSync(join(root, 'scripts/pivot-gold-batch-a-review.json'), `${JSON.stringify(out, null, 2)}\n`);

const md = [
  '# Pivot Gold — Batch A Human Coach Review', '',
  `**15 new families; cumulative approved-source candidate count: ${out.sourceGoldAfterBatch}/60**`, '',
  '- Runtime bank is unchanged.',
  '- Review legality of seals/screens, A-over-B clarity, and native HR/DE language.',
  '- Reject any family that teaches holding, moving screens, blind passing, or whistle hunting.', '',
];
for (const [i, s] of PIVOT_GOLD_BATCH_A_15.entries()) {
  md.push(`## A${i + 1}. ${s.title.en}`, '', `- Family: \`${s.familyKey}\``, `- Cue: ${s.primaryTacticalCue}`, `- Structure: ${s.defensiveSystem || s.matchPhase} / ${s.numerical}`, '');
  for (const locale of ['en', 'hr', 'de']) {
    md.push(`### ${locale.toUpperCase()}`, '', `**Situation:** ${s.situation[locale]}`, '', `**Question:** ${s.question[locale]}`, '');
    s.answers.forEach((a, ai) => {
      md.push(`${String.fromCharCode(65 + ai)}. **${a.quality}** — ${a.text[locale]}`);
      md.push(`   - ${a.feedback[locale]}`);
    });
    md.push('', `**Explanation:** ${s.explanation[locale]}`, '', `**A over B:** ${s.whyCorrectOverSecondBest[locale]}`, '');
  }
}
writeFileSync(join(root, 'scripts/pivot-gold-batch-a-review.md'), md.join('\n'));
console.log(JSON.stringify({ status: out.status, batchCount: out.batchCount, sourceGoldAfterBatch: out.sourceGoldAfterBatch, runtimeBankModified: false }, null, 2));
