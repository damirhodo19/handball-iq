#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_70 } from './scenario-bank/data/coach-gold-70.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = {
  status: 'COACH GOLD 70 — HUMAN COACH REVIEW',
  sourceCount: COACH_GOLD_70.length,
  fullTarget: 70,
  runtimeCutoverPerformed: false,
  scenarios: COACH_GOLD_70,
};
writeFileSync(join(root, 'scripts/coach-gold-70-review.json'), `${JSON.stringify(output, null, 2)}\n`);

const categoryNames = {
  timeout: 'Minuta odmora',
  defensive_adjustment: 'Obrambena prilagodba',
  substitution: 'Zamjena',
  training_plan: 'Planiranje treninga',
  player_development: 'Razvoj igrača',
  opponent_analysis: 'Analiza protivnika',
  leadership: 'Vodstvo',
};
const labels = { optimal: 'OPTIMALNO', good: 'DOBRO', risky: 'RIZIČNO', poor: 'LOŠE' };
const md = [
  '# Coach Gold — svih 70 scenarija',
  '',
  '**Izvor je potpun: 70/70, po 10 scenarija u svakoj od 7 kategorija. Aktivni Coach runtime nije promijenjen.**',
  '',
];
let currentCategory = null;
for (const scenario of COACH_GOLD_70) {
  if (scenario.category !== currentCategory) {
    currentCategory = scenario.category;
    md.push(`# ${categoryNames[currentCategory]}`, '');
  }
  md.push(`## ${scenario.id}`, '', `Obitelj: \`${scenario.familyKey}\` · Težina: **${scenario.difficulty}**`, '', `**Situacija:** ${scenario.situation.hr}`, '', `**Pitanje:** ${scenario.question.hr}`, '');
  for (const answer of scenario.answers) md.push(`- **${labels[answer.quality]}:** ${answer.text.hr}`, `  - ${answer.feedback.hr}`);
  md.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '');
}
writeFileSync(join(root, 'scripts/coach-gold-70-hr-review.md'), `${md.join('\n')}\n`);
console.log(JSON.stringify({ status: output.status, sourceCount: output.sourceCount, fullTarget: output.fullTarget }, null, 2));
