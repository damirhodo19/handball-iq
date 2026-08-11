#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_BATCH_C_15 } from './scenario-bank/data/pivot-gold-batch-c-15.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = {
  status: 'PIVOT GOLD BATCH C — HUMAN COACH REVIEW',
  priorSourceCount: 45,
  batchCount: 15,
  sourceGoldAfterBatch: 60,
  runtimeBankModified: false,
  scenarios: PIVOT_GOLD_BATCH_C_15,
};
writeFileSync(join(root, 'scripts/pivot-gold-batch-c-review.json'), `${JSON.stringify(out, null, 2)}\n`);

const md = [
  '# Pivot Gold — Batch C Human Coach Review',
  '',
  '**15 new families; cumulative source count: 60/60**',
  '',
  '- Runtime bank is unchanged.',
  '- Review transition choices, defensive ownership, legality and A-over-B clarity.',
  '',
];
for (const [index, scenario] of PIVOT_GOLD_BATCH_C_15.entries()) {
  md.push(
    `## C${index + 1}. ${scenario.title.en}`,
    '',
    `- Family: \`${scenario.familyKey}\``,
    `- Cue: ${scenario.primaryTacticalCue}`,
    `- Structure: ${scenario.defensiveSystem || scenario.matchPhase} / ${scenario.numerical}`,
    '',
  );
  for (const locale of ['en', 'hr', 'de']) {
    md.push(`### ${locale.toUpperCase()}`, '', `**Situation:** ${scenario.situation[locale]}`, '', `**Question:** ${scenario.question[locale]}`, '');
    scenario.answers.forEach((answer, answerIndex) => {
      md.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text[locale]}`);
      md.push(`   - ${answer.feedback[locale]}`);
    });
    md.push('', `**Explanation:** ${scenario.explanation[locale]}`, '', `**A over B:** ${scenario.whyCorrectOverSecondBest[locale]}`, '');
  }
}
writeFileSync(join(root, 'scripts/pivot-gold-batch-c-review.md'), md.join('\n'));
console.log(JSON.stringify({
  status: out.status,
  batchCount: out.batchCount,
  sourceGoldAfterBatch: out.sourceGoldAfterBatch,
  runtimeBankModified: false,
}, null, 2));
