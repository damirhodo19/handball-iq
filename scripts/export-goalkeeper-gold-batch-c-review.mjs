#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_BATCH_C_15 } from './scenario-bank/data/goalkeeper-gold-batch-c-15.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = { status: 'GOALKEEPER GOLD BATCH C — HUMAN COACH REVIEW', priorSourceCount: 35, batchCount: 15, sourceGoldAfterBatch: 50, runtimeBankModified: false, scenarios: GOALKEEPER_GOLD_BATCH_C_15 };
writeFileSync(join(root, 'scripts/goalkeeper-gold-batch-c-review.json'), `${JSON.stringify(out, null, 2)}\n`);
const full = ['# Goalkeeper Gold — Batch C Review', '', '**15 new scenarios; cumulative source count: 50/75**', '', '- Goalkeeper runtime is unchanged.', ''];
const hr = ['# Goalkeeper Gold — Batch C hrvatski pregled', '', '**15 novih scenarija; ukupno 50/75 u izvoru**', '', '- Goalkeeper runtime nije promijenjen.', ''];
for (const [index, scenario] of GOALKEEPER_GOLD_BATCH_C_15.entries()) {
  full.push(`## C${index + 1}. ${scenario.title.en}`, '', `- Family: \`${scenario.familyKey}\``, `- Cue: ${scenario.primaryTacticalCue}`, '');
  for (const locale of ['en', 'hr', 'de']) {
    full.push(`### ${locale.toUpperCase()}`, '', `**Situation:** ${scenario.situation[locale]}`, '', `**Question:** ${scenario.question[locale]}`, '');
    scenario.answers.forEach((answer, answerIndex) => { full.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text[locale]}`); full.push(`   - ${answer.feedback[locale]}`); });
    full.push('', `**Explanation:** ${scenario.explanation[locale]}`, '', `**A over B:** ${scenario.whyCorrectOverSecondBest[locale]}`, '');
  }
  hr.push(`## C${index + 1}. ${scenario.title.hr}`, '', `**Situacija:** ${scenario.situation.hr}`, '', `**Pitanje:** ${scenario.question.hr}`, '');
  scenario.answers.forEach((answer, answerIndex) => { hr.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text.hr}`); hr.push(`   - ${answer.feedback.hr}`); });
  hr.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '', `**Zašto A prije B:** ${scenario.whyCorrectOverSecondBest.hr}`, '');
}
writeFileSync(join(root, 'scripts/goalkeeper-gold-batch-c-review.md'), `${full.join('\n')}\n`);
writeFileSync(join(root, 'scripts/goalkeeper-gold-batch-c-hr-review.md'), `${hr.join('\n')}\n`);
console.log(JSON.stringify({ status: out.status, batchCount: out.batchCount, sourceGoldAfterBatch: out.sourceGoldAfterBatch, runtimeBankModified: false }, null, 2));
