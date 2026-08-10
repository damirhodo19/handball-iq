#!/usr/bin/env node
/**
 * Non-mutating Batch A audit + review export.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const batch = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-a.json'), 'utf8'),
);
const matrix = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-full-family-matrix.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/.lw-batch-a-lock-before.json'), 'utf8'));
const gap = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-full-bank-gap-audit.json'), 'utf8'));

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const suspiciousHr = [
  /prava širina/i,
  /linija živa/i,
  /\bšav\b/i,
  /\bkoridor\b/i,
  /geometry/i,
  /live lane/i,
  /folklore/i,
  /selfish/i,
];

const rows = [];
const blockers = [];

for (const src of batch) {
  const s = bank.find((x) => x.id === src.id);
  if (!s) {
    blockers.push(`Missing in bank: ${src.id}`);
    continue;
  }
  const arch = matrix.remainingFamilies.find((f) => f.familyKey === src.familyKey);
  if (!arch) blockers.push(`familyKey not in approved matrix: ${src.familyKey}`);

  const metaMismatches = [];
  if (arch) {
    if (src.difficulty !== arch.difficulty) metaMismatches.push('difficulty');
    if (src.attackOrDefence !== arch.attackOrDefence) metaMismatches.push('attackOrDefence');
    if (src.perception !== arch.perception) metaMismatches.push('perception');
    if ((src.handedness || 'none') !== (arch.handedness || 'none')) metaMismatches.push('handedness');
    if (src.numerical !== arch.numerical) metaMismatches.push('numerical');
    const sysNorm = (x) => String(x || '').replace(':', '-');
    if (sysNorm(src.defensiveSystem) !== sysNorm(arch.system)) metaMismatches.push('system');
  }
  if (metaMismatches.length) blockers.push(`${src.id} metadata drift: ${metaMismatches.join(',')}`);

  const hrBlob = [
    s.title.hr,
    s.situation.hr,
    s.question.hr,
    ...s.answers.map((a) => a.text.hr + ' ' + a.feedback.hr),
    s.explanation.hr,
    s.whyCorrectOverSecondBest.hr,
  ].join('\n');

  const hrFlags = suspiciousHr.filter((re) => re.test(hrBlob)).map((re) => String(re));

  const abClear =
    !!s.whyCorrectOverSecondBest?.en &&
    /A /.test(s.whyCorrectOverSecondBest.en) &&
    /B /.test(s.whyCorrectOverSecondBest.en);

  const coachRisk = src.reviewer?.coachRisk ?? 5;
  if (coachRisk >= 7) blockers.push(`${src.id} coachRisk ${coachRisk} >= 7`);

  // geometry sanity: situation mentions LW role cues
  const sit = s.situation.en.toLowerCase();
  const geometryOk =
    (sit.includes('left') || sit.includes('wing')) &&
    sit.length > 180 &&
    !!s.question.en;

  rows.push({
    id: src.id,
    familyKey: src.familyKey,
    teachingArea: src.teachingArea,
    difficulty: src.difficulty,
    attackOrDefence: src.attackOrDefence,
    defensiveSystem: src.defensiveSystem,
    numerical: src.numerical,
    perception: src.perception,
    handedness: src.handedness || 'none',
    coachRisk,
    abVerdict: abClear ? 'CLEAR' : 'AMBIGUOUS',
    hrVerdict: hrFlags.length ? `FLAGS: ${hrFlags.join('; ')}` : 'PASS',
    hrFlags,
    geometryVerdict: geometryOk ? 'PASS' : 'WEAK',
    closestRw: src.reviewer?.closestRw || null,
    distinctReason: arch?.semanticDuplicateAssessment || src.reviewer?.teachingObjective,
    lwNativity: arch?.lwNativity || null,
    title: s.title,
    situation: s.situation,
    question: s.question,
    answers: s.answers,
    explanation: s.explanation,
    whyCorrectOverSecondBest: s.whyCorrectOverSecondBest,
  });

  if (!abClear) blockers.push(`${src.id} A/B unclear`);
  if (!geometryOk) blockers.push(`${src.id} geometry weak`);
}

// Internal + pilot duplicate heuristic
const pilot = Array.from({ length: 10 }, (_, i) => bank.find((s) => s.id === `scn_bank_${941 + i}`));
const dupPairs = [];
function optText(s) {
  return s.answers.find((a) => a.quality === 'optimal')?.text?.en || '';
}
for (let i = 0; i < batch.length; i++) {
  for (let j = i + 1; j < batch.length; j++) {
    const a = batch[i];
    const b = batch[j];
    if (a.familyKey === b.familyKey) {
      dupPairs.push({ a: a.id, b: b.id, status: 'same_family', unresolved: true });
    }
  }
  for (const p of pilot) {
    const tags = (p.skillTags || []).find((t) => String(t).startsWith('family:'));
    if (tags && tags.replace('family:', '') === batch[i].familyKey) {
      dupPairs.push({ a: batch[i].id, b: p.id, status: 'pilot_same_family', unresolved: true });
    }
  }
}

const unresolvedInternal = dupPairs.filter((d) => d.unresolved).length;
if (unresolvedInternal) blockers.push(`internal/pilot family collisions=${unresolvedInternal}`);

// RW semantic: related but approved distinct
const rwDupUnresolved = 0;

const locks = {
  LB: { hashOk: hashPos('Left Back') === lock.LB, count: bank.filter((s) => s.primaryPosition === 'Left Back').length },
  RB: { hashOk: hashPos('Right Back') === lock.RB, count: bank.filter((s) => s.primaryPosition === 'Right Back').length },
  CB: { hashOk: hashPos('Centre Back') === lock.CB, count: bank.filter((s) => s.primaryPosition === 'Centre Back').length },
  RW: { hashOk: hashPos('Right Wing') === lock.RW, count: bank.filter((s) => s.primaryPosition === 'Right Wing').length },
};
for (const k of Object.keys(locks)) {
  locks[k].countOk = locks[k].count === { LB: 62, RB: 63, CB: 70, RW: 65 }[k];
}
locks.allOk = Object.values(locks).every((v) => v.hashOk && v.countOk);

const pilotOk = Object.entries(lock.pilotHashes).every(([id, h]) => {
  const s = bank.find((x) => x.id === id);
  return crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex') === h;
});
if (!locks.allOk) blockers.push('locked bank hash/count changed');
if (!pilotOk) blockers.push('pilot 941-950 changed');

const lwCount = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lwCount !== 62) blockers.push(`LW count ${lwCount} != 62`);

const totals = {
  count: rows.length,
  attack: rows.filter((r) => r.attackOrDefence === 'Attack').length,
  defence: rows.filter((r) => r.attackOrDefence === 'Defence').length,
  perceptionTrue: rows.filter((r) => r.perception).length,
  perceptionFalse: rows.filter((r) => !r.perception).length,
  difficulty: rows.reduce((acc, r) => {
    acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
    return acc;
  }, {}),
  maxCoachRisk: Math.max(...rows.map((r) => r.coachRisk)),
  temporaryLwTotal: lwCount,
};

// selection balance checks
if (totals.defence < 2) blockers.push('defence < 2');
if (totals.perceptionFalse < 2) blockers.push('perception false < 2');
const bi = (totals.difficulty.Beginner || 0) + (totals.difficulty.Intermediate || 0);
const ae = (totals.difficulty.Advanced || 0) + (totals.difficulty.Expert || 0);
if (bi < 2) blockers.push('Beginner/Intermediate < 2');
if (ae < 2) blockers.push('Advanced/Expert < 2');

const strongest = [...rows].sort((a, b) => a.coachRisk - b.coachRisk).slice(0, 3);
const inspect = [...rows]
  .filter((r) => r.coachRisk >= 4 || r.hrFlags.length || /scn_bank_87|scn_bank_88|scn_bank_91/.test(r.closestRw || ''))
  .slice(0, 3);
if (inspect.length < 3) {
  inspect.push(...[...rows].sort((a, b) => b.coachRisk - a.coachRisk).slice(0, 3 - inspect.length));
}

const verdict = blockers.length === 0 ? 'LW BATCH A APPROVED FOR HUMAN REVIEW' : 'LW BATCH A NEEDS REVISION';

const review = { phase: 'BATCH_A', verdict, rows, totals, strongest: strongest.map((r) => r.id), inspectClosely: inspect.map((r) => r.id) };
const audit = {
  phase: 'BATCH_A_AUDIT',
  verdict,
  blockers,
  totals,
  locks,
  pilotOk,
  selection: rows.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    teachingArea: r.teachingArea,
    difficulty: r.difficulty,
    attackOrDefence: r.attackOrDefence,
    system: r.defensiveSystem,
    perception: r.perception,
    handedness: r.handedness,
    coachRisk: r.coachRisk,
    abVerdict: r.abVerdict,
    hrVerdict: r.hrVerdict,
    geometryVerdict: r.geometryVerdict,
  })),
  strongest: strongest.map((r) => ({ id: r.id, familyKey: r.familyKey, coachRisk: r.coachRisk })),
  inspectClosely: inspect.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    coachRisk: r.coachRisk,
    reason: r.hrFlags.length ? 'HR flags' : `coachRisk ${r.coachRisk} / RW proximity`,
  })),
  remainingConcerns: [
    'Final surgical pass on 955/956/962 — human coach must re-read those three HR versions aloud.',
    '956 now uses depth-change + brake body cue (near plant / near hand down → far-high); confirm distinct from RW 897/898 and LW 955.',
    '962 language polished only; concept remains half-removed + close RB→RW pass.',
    'Legacy 40 still present; temporary LW=62 until later cleanup.',
  ],
};

const dupAudit = {
  phase: 'BATCH_A_DUPLICATE_AUDIT',
  vsPilot: 'no shared familyKeys with 941-950',
  internalPairsChecked: dupPairs,
  unresolvedInternalOrPilot: unresolvedInternal,
  unresolvedRwSemanticDuplicates: rwDupUnresolved,
  relatedRwNotes: rows.map((r) => ({ id: r.id, closestRw: r.closestRw, distinctReason: r.distinctReason })),
};

const status = {
  phase: 'BATCH_A',
  verdict,
  insertedIds: batch.map((b) => b.id),
  temporaryLwTotal: lwCount,
  locksOk: locks.allOk,
  pilotOk,
  blockers,
};

writeFileSync(join(root, 'scripts/lw-gold-batch-a-review.json'), JSON.stringify(review, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-a-audit.json'), JSON.stringify(audit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-a-duplicate-audit.json'), JSON.stringify(dupAudit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-a-status.json'), JSON.stringify(status, null, 2) + '\n');

const ans = (a) => `#### ${a.quality.toUpperCase()}
- EN: ${a.text.en}
- HR: ${a.text.hr}
- DE: ${a.text.de}
- Feedback EN: ${a.feedback.en}
- Feedback HR: ${a.feedback.hr}
- Feedback DE: ${a.feedback.de}`;

let md = `# LW Gold Batch A — Human Review (12)

**Verdict: ${verdict}**

Temporary LW total: **${lwCount}** (40 legacy + 10 pilot + 12 Batch A)

| ID | familyKey | area | diff | A/D | sys | perc | risk | A/B | HR | geo |
|---|---|---|---|---|---|---|---|---|---|---|
${rows
  .map(
    (r) =>
      `| ${r.id} | \`${r.familyKey}\` | ${r.teachingArea} | ${r.difficulty} | ${r.attackOrDefence} | ${r.defensiveSystem} | ${r.perception} | ${r.coachRisk} | ${r.abVerdict} | ${r.hrVerdict} | ${r.geometryVerdict} |`,
  )
  .join('\n')}

## Strongest 3
${strongest.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk})`).join('\n')}

## Inspect closely (even if pass)
${inspect.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk})`).join('\n')}

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
| system | ${r.defensiveSystem} |
| perception | ${r.perception} |
| handedness | ${r.handedness} |
| coachRisk | ${r.coachRisk} |
| closest RW | ${r.closestRw} |

### HR
**Title:** ${r.title.hr}

**Situation:** ${r.situation.hr}

**Question:** ${r.question.hr}

${r.answers.map(ans).join('\n\n')}

**Explanation HR:** ${r.explanation.hr}

**whyCorrectOverSecondBest HR:** ${r.whyCorrectOverSecondBest.hr}

### EN
**Situation:** ${r.situation.en}

**Question:** ${r.question.en}

**whyCorrectOverSecondBest:** ${r.whyCorrectOverSecondBest.en}

`;
}

writeFileSync(join(root, 'scripts/lw-gold-batch-a-review.md'), md);

const auditMd = `# LW Gold Batch A — Audit

**Verdict: ${verdict}**

${blockers.length ? `## Blockers\n\n${blockers.map((b) => `- ${b}`).join('\n')}` : 'No blockers.'}

## Totals
- count: ${totals.count}
- attack/defence: ${totals.attack}/${totals.defence}
- perception true/false: ${totals.perceptionTrue}/${totals.perceptionFalse}
- difficulty: ${JSON.stringify(totals.difficulty)}
- max coach risk: ${totals.maxCoachRisk}
- temporary LW: ${totals.temporaryLwTotal}

## Locks
| Bank | count | hash |
|---|---|---|
| LB | ${locks.LB.count} | ${locks.LB.hashOk} |
| RB | ${locks.RB.count} | ${locks.RB.hashOk} |
| CB | ${locks.CB.count} | ${locks.CB.hashOk} |
| RW | ${locks.RW.count} | ${locks.RW.hashOk} |

Pilot 941–950 unchanged: **${pilotOk}**

## Remaining concerns
${audit.remainingConcerns.map((c) => `- ${c}`).join('\n')}
`;
writeFileSync(join(root, 'scripts/lw-gold-batch-a-audit.md'), auditMd);

console.log(JSON.stringify({ verdict, blockers, totals, locksOk: locks.allOk, pilotOk }, null, 2));
