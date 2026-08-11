#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_75 } from './scenario-bank/data/goalkeeper-gold-75.mjs';
import { GOALKEEPER_GOLD_BATCH_D_15 } from './scenario-bank/data/goalkeeper-gold-batch-d-15.mjs';
import { GOALKEEPER_GOLD_BATCH_E_10 } from './scenario-bank/data/goalkeeper-gold-batch-e-10.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const renderHr = (title, scenarios) => {
  const lines = [`# ${title}`, '', `**${scenarios.length} scenarija**`, ''];
  for (const [index, scenario] of scenarios.entries()) {
    lines.push(`## ${index + 1}. ${scenario.title.hr}`, '', `- Family: \`${scenario.familyKey}\``, '', `**Situacija:** ${scenario.situation.hr}`, '', `**Pitanje:** ${scenario.question.hr}`, '');
    scenario.answers.forEach((answer, answerIndex) => { lines.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text.hr}`); lines.push(`   - ${answer.feedback.hr}`); });
    lines.push('', `**Objašnjenje:** ${scenario.explanation.hr}`, '', `**Zašto A prije B:** ${scenario.whyCorrectOverSecondBest.hr}`, '');
  }
  return `${lines.join('\n')}\n`;
};

const final25 = [...GOALKEEPER_GOLD_BATCH_D_15, ...GOALKEEPER_GOLD_BATCH_E_10];
writeFileSync(join(root, 'scripts/goalkeeper-gold-final-25-review.json'), `${JSON.stringify({ status: 'GOALKEEPER GOLD FINAL 25 REVIEW', priorSourceCount: 50, batchCount: 25, sourceGoldAfterBatch: 75, runtimeBankModified: false, scenarios: final25 }, null, 2)}\n`);
writeFileSync(join(root, 'scripts/goalkeeper-gold-final-25-hr-review.md'), renderHr('Goalkeeper Gold — završnih 25, hrvatski pregled', final25));
writeFileSync(join(root, 'scripts/goalkeeper-gold-75-hr-review.md'), renderHr('Goalkeeper Gold 75 — potpuni hrvatski pregled', GOALKEEPER_GOLD_75));
writeFileSync(join(root, 'scripts/goalkeeper-gold-75-review.json'), `${JSON.stringify({ status: 'GOALKEEPER GOLD 75 FULL REVIEW', count: 75, runtimeBankModified: false, scenarios: GOALKEEPER_GOLD_75 }, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', finalBatchCount: final25.length, fullSourceCount: GOALKEEPER_GOLD_75.length, runtimeBankModified: false }, null, 2));
