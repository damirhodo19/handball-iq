#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIVOT_GOLD_BATCH_B_20 } from './scenario-bank/data/pivot-gold-batch-b-20.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = { status: 'PIVOT GOLD BATCH B — HUMAN COACH REVIEW', priorSourceCount: 25, batchCount: 20, sourceGoldAfterBatch: 45, runtimeBankModified: false, scenarios: PIVOT_GOLD_BATCH_B_20 };
writeFileSync(join(root, 'scripts/pivot-gold-batch-b-review.json'), `${JSON.stringify(out, null, 2)}\n`);
const md = ['# Pivot Gold — Batch B Human Coach Review', '', '**20 new families; cumulative source count: 45/60**', '', '- Runtime bank is unchanged.', '- Review system geometry, numerical risk, legal screens, and A-over-B clarity.', ''];
for (const [i, s] of PIVOT_GOLD_BATCH_B_20.entries()) {
  md.push(`## B${i + 1}. ${s.title.en}`, '', `- Family: \`${s.familyKey}\``, `- Cue: ${s.primaryTacticalCue}`, `- Structure: ${s.defensiveSystem || s.matchPhase} / ${s.numerical}`, '');
  for (const loc of ['en', 'hr', 'de']) {
    md.push(`### ${loc.toUpperCase()}`, '', `**Situation:** ${s.situation[loc]}`, '', `**Question:** ${s.question[loc]}`, '');
    s.answers.forEach((a, ai) => { md.push(`${String.fromCharCode(65 + ai)}. **${a.quality}** — ${a.text[loc]}`); md.push(`   - ${a.feedback[loc]}`); });
    md.push('', `**Explanation:** ${s.explanation[loc]}`, '', `**A over B:** ${s.whyCorrectOverSecondBest[loc]}`, '');
  }
}
writeFileSync(join(root, 'scripts/pivot-gold-batch-b-review.md'), md.join('\n'));
console.log(JSON.stringify({ status: out.status, batchCount: out.batchCount, sourceGoldAfterBatch: out.sourceGoldAfterBatch, runtimeBankModified: false }, null, 2));
