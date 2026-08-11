#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_PILOT_14 } from './scenario-bank/data/coach-gold-pilot-14.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = {
  status: 'COACH GOLD PILOT 14 — HUMAN COACH REVIEW',
  pilotCount: 14,
  fullTarget: 70,
  runtimeCutoverPerformed: false,
  scenarios: COACH_GOLD_PILOT_14,
};
writeFileSync(join(root, 'scripts/coach-gold-pilot-14-review.json'), `${JSON.stringify(output, null, 2)}\n`);

const categoryNames = {
  timeout: 'Minuta odmora',
  defensive_adjustment: 'Obrambena prilagodba',
  substitution: 'Zamjena',
  training_plan: 'Planiranje treninga',
  player_development: 'Razvoj igrača',
  opponent_analysis: 'Analiza protivnika',
  leadership: 'Vodstvo',
};
const md = ['# Coach Gold — pilot 14', '', '**Dva reprezentativna scenarija iz svake od sedam kategorija. Aktivni Coach runtime nije promijenjen.**', ''];
for (const scenario of COACH_GOLD_PILOT_14) {
  md.push(`## ${scenario.id} · ${categoryNames[scenario.category]}`, '');
  md.push(`Obitelj: \`${scenario.familyKey}\` · Težina: **${scenario.difficulty}**`, '');
  md.push(`**Situacija:** ${scenario.situation.hr}`, '');
  md.push(`**Pitanje:** ${scenario.question.hr}`, '');
  for (const answer of scenario.answers) {
    const label = { optimal: 'OPTIMALNO', good: 'DOBRO', risky: 'RIZIČNO', poor: 'LOŠE' }[answer.quality];
    md.push(`- **${label}:** ${answer.text.hr}`, `  - ${answer.feedback.hr}`);
  }
  md.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '');
}
writeFileSync(join(root, 'scripts/coach-gold-pilot-14-hr-review.md'), `${md.join('\n')}\n`);
console.log(JSON.stringify({ status: output.status, scenarios: output.pilotCount, fullTarget: output.fullTarget }, null, 2));
