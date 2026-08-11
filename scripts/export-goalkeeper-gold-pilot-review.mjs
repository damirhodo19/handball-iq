#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GOALKEEPER_GOLD_PILOT_10 } from './scenario-bank/data/goalkeeper-gold-pilot-10.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = { status: 'GOALKEEPER GOLD PILOT — HUMAN COACH REVIEW', pilotCount: 10, fullTarget: 75, runtimeBankModified: false, scenarios: GOALKEEPER_GOLD_PILOT_10 };
writeFileSync(join(root, 'scripts/goalkeeper-gold-pilot-10-review.json'), `${JSON.stringify(out, null, 2)}\n`);
const md = ['# Goalkeeper Gold — Pilot 10 Human Coach Review', '', '**10 representative families from the planned 75-scenario bank**', '', '- Goalkeeper runtime bank is unchanged.', '- Review goalkeeper technique, block cooperation, live-cue priority, communication and A-over-B clarity.', ''];
for (const [index, scenario] of GOALKEEPER_GOLD_PILOT_10.entries()) {
  md.push(`## ${index + 1}. ${scenario.title.en}`, '', `- Family: \`${scenario.familyKey}\``, `- Cue: ${scenario.primaryTacticalCue}`, `- Structure: ${scenario.defensiveSystem || scenario.matchPhase} / ${scenario.numerical}`, '');
  for (const locale of ['en', 'hr', 'de']) {
    md.push(`### ${locale.toUpperCase()}`, '', `**Situation:** ${scenario.situation[locale]}`, '', `**Question:** ${scenario.question[locale]}`, '');
    scenario.answers.forEach((answer, answerIndex) => {
      md.push(`${String.fromCharCode(65 + answerIndex)}. **${answer.quality}** — ${answer.text[locale]}`);
      md.push(`   - ${answer.feedback[locale]}`);
    });
    md.push('', `**Explanation:** ${scenario.explanation[locale]}`, '', `**A over B:** ${scenario.whyCorrectOverSecondBest[locale]}`, '');
  }
}
writeFileSync(join(root, 'scripts/goalkeeper-gold-pilot-10-review.md'), md.join('\n'));
console.log(JSON.stringify({ status: out.status, pilotCount: out.pilotCount, fullTarget: out.fullTarget, runtimeBankModified: false }, null, 2));
