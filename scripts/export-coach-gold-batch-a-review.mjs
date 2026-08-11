#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_BATCH_A_14 } from './scenario-bank/data/coach-gold-batch-a-14.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = { status: 'COACH GOLD BATCH A — HUMAN COACH REVIEW', priorCount: 14, batchCount: 14, sourceCount: 28, fullTarget: 70, runtimeCutoverPerformed: false, scenarios: COACH_GOLD_BATCH_A_14 };
writeFileSync(join(root, 'scripts/coach-gold-batch-a-review.json'), `${JSON.stringify(output, null, 2)}\n`);
const categoryNames = { timeout: 'Minuta odmora', defensive_adjustment: 'Obrambena prilagodba', substitution: 'Zamjena', training_plan: 'Planiranje treninga', player_development: 'Razvoj igrača', opponent_analysis: 'Analiza protivnika', leadership: 'Vodstvo' };
const labels = { optimal: 'OPTIMALNO', good: 'DOBRO', risky: 'RIZIČNO', poor: 'LOŠE' };
const md = ['# Coach Gold — Batch A (14 novih scenarija)', '', '**Ukupni Gold izvor nakon ovog batcha: 28/70. Aktivni Coach runtime nije promijenjen.**', ''];
for (const scenario of COACH_GOLD_BATCH_A_14) {
  md.push(`## ${scenario.id} · ${categoryNames[scenario.category]}`, '', `Obitelj: \`${scenario.familyKey}\` · Težina: **${scenario.difficulty}**`, '', `**Situacija:** ${scenario.situation.hr}`, '', `**Pitanje:** ${scenario.question.hr}`, '');
  for (const answer of scenario.answers) md.push(`- **${labels[answer.quality]}:** ${answer.text.hr}`, `  - ${answer.feedback.hr}`);
  md.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '');
}
writeFileSync(join(root, 'scripts/coach-gold-batch-a-14-hr-review.md'), `${md.join('\n')}\n`);
console.log(JSON.stringify({ status: output.status, batchCount: output.batchCount, sourceCount: output.sourceCount, fullTarget: output.fullTarget }, null, 2));
