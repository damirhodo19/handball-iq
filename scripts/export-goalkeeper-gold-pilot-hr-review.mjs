#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_PILOT_10 } from './scenario-bank/data/goalkeeper-gold-pilot-10.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = [
  '# Goalkeeper Gold — hrvatski pregled pilota v2',
  '',
  '**Potpuno prepisanih 10 scenarija. Goalkeeper runtime nije promijenjen.**',
  '',
];

for (const [index, scenario] of GOALKEEPER_GOLD_PILOT_10.entries()) {
  md.push(
    `## ${index + 1}. ${scenario.title.hr}`,
    '',
    `**Situacija:** ${scenario.situation.hr}`,
    '',
    `**Pitanje:** ${scenario.question.hr}`,
    '',
  );
  scenario.answers.forEach((answer, answerIndex) => {
    md.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text.hr}`);
    md.push(`   - ${answer.feedback.hr}`);
  });
  md.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '', `**Zašto A prije B:** ${scenario.whyCorrectOverSecondBest.hr}`, '');
}

writeFileSync(join(root, 'scripts/goalkeeper-gold-pilot-10-hr-review.md'), `${md.join('\n')}\n`);
console.log(JSON.stringify({ status: 'PASS', scenarios: GOALKEEPER_GOLD_PILOT_10.length, locale: 'hr', runtimeBankModified: false }, null, 2));
