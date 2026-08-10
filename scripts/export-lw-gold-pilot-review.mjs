#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const pilotSrc = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'),
);

const rows = pilotSrc.map((src, i) => {
  const id = `scn_bank_${941 + i}`;
  const s = bank.find((x) => x.id === id);
  if (!s) throw new Error(`Missing ${id}`);
  return {
    id,
    familyKey: src.familyKey,
    teachingArea: src.teachingArea,
    difficulty: s.difficulty,
    attackOrDefence: s.attackOrDefence,
    perception: src.perception,
    handedness: src.handedness || 'none',
    defensiveSystem: s.defensiveSystem || null,
    numerical: src.numerical,
    title: s.title,
    situation: s.situation,
    question: s.question,
    answers: s.answers,
    explanation: s.explanation,
    whyCorrectOverSecondBest: s.whyCorrectOverSecondBest,
    reviewer: src.reviewer,
    fingerprint: src.fingerprint,
  };
});

writeFileSync(join(root, 'scripts/lw-gold-pilot-10-review.json'), JSON.stringify(rows, null, 2) + '\n');

const ansBlock = (a) => {
  const q = a.quality.toUpperCase();
  return `#### ${q}
- EN: ${a.text.en}
- HR: ${a.text.hr}
- DE: ${a.text.de}
- Feedback EN: ${a.feedback.en}
- Feedback HR: ${a.feedback.hr}
- Feedback DE: ${a.feedback.de}`;
};

let md = `# Left Wing Gold Pilot — Human Review (10)

**Not Gold-approved. Human coach review required.**

`;

for (const r of rows) {
  md += `---

## ${r.id} — ${r.title.en}

| Field | Value |
|---|---|
| familyKey | \`${r.familyKey}\` |
| teachingArea | ${r.teachingArea} |
| difficulty | ${r.difficulty} |
| attack/defence | ${r.attackOrDefence} |
| perception | ${r.perception} |
| handedness | ${r.handedness} |
| defensiveSystem | ${r.defensiveSystem} |
| numerical | ${r.numerical} |

### HR
**Title:** ${r.title.hr}

**Situation:** ${r.situation.hr}

**Question:** ${r.question.hr}

${r.answers.map(ansBlock).join('\n\n')}

**Explanation:** ${r.explanation.hr}

### EN
**Title:** ${r.title.en}

**Situation:** ${r.situation.en}

**Question:** ${r.question.en}

${r.answers
  .map(
    (a) =>
      `- **${a.quality}:** ${a.text.en}\n  - feedback: ${a.feedback.en}`,
  )
  .join('\n')}

**Explanation:** ${r.explanation.en}

### DE
**Title:** ${r.title.de}

**Situation:** ${r.situation.de}

**Question:** ${r.question.de}

${r.answers
  .map(
    (a) =>
      `- **${a.quality}:** ${a.text.de}\n  - feedback: ${a.feedback.de}`,
  )
  .join('\n')}

**Explanation:** ${r.explanation.de}

### Reviewer block
- **Teaching objective:** ${r.reviewer.teachingObjective}
- **Primary cue:** ${r.reviewer.primaryCue}
- **Why optimal:** ${r.reviewer.whyOptimal}
- **Why good is conditional:** ${r.reviewer.whyGoodConditional}
- **Why risky:** ${r.reviewer.whyRisky}
- **Why poor:** ${r.reviewer.whyPoor}
- **Clone-risk assessment:** ${r.reviewer.cloneRisk}

`;
}

writeFileSync(join(root, 'scripts/lw-gold-pilot-10-review.md'), md);
console.log(`Exported ${rows.length} pilot scenarios for review`);
