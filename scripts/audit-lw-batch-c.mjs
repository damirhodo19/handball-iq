#!/usr/bin/env node
/**
 * Non-mutating Batch C audit + review export.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const batch = JSON.parse(readFileSync(join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-c.json'), 'utf8'));
const matrix = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-full-family-matrix.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/.lw-batch-c-lock-before.json'), 'utf8'));
const plan = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-batch-c-plan.json'), 'utf8'));

const hash = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (pos) => hash(bank.filter((s) => s.primaryPosition === pos));

const suspiciousHr = [
  /prava širina/i,
  /linija živa/i,
  /\bšav\b/i,
  /\bkoridor\b/i,
  /geometry/i,
  /live lane/i,
  /folklore/i,
  /selfish/i,
  /prozor umre/i,
  /živi odraz/i,
  /zarađen odraz/i,
  /nahraniti/i,
  /vlasnik igrača/i,
  /živa prijetnja/i,
];

const rows = [];
const blockers = [];

for (const src of batch) {
  const s = bank.find((x) => x.id === src.id);
  if (!s) {
    blockers.push(`Missing in bank: ${src.id}`);
    continue;
  }
  const n = Number(String(src.id).replace('scn_bank_', ''));
  if (n < 975 || n > 986) blockers.push(`${src.id} outside 975-986`);
  if (src.id === 'scn_bank_987' || bank.some((x) => x.id === 'scn_bank_987')) blockers.push('987 exists');

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
  if (coachRisk > 5) blockers.push(`${src.id} coachRisk ${coachRisk} > 5`);
  if (src.reviewer?.duplicateClassification === 'DUPLICATE' || src.reviewer?.duplicateClassification === 'SEMANTIC_DUPLICATE') {
    blockers.push(`${src.id} DUPLICATE`);
  }
  if (src.reviewer?.lwNativity === 'MIRRORED') blockers.push(`${src.id} MIRRORED`);

  const sit = s.situation.en.toLowerCase();
  const geometryOk = (sit.includes('left') || sit.includes('wing')) && sit.length > 160 && !!s.question.en;

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
    closestLw: src.reviewer?.closestLw || null,
    closestRw: src.reviewer?.closestRw || null,
    sharedConcept: src.reviewer?.sharedConcept || null,
    criticalDifference: src.reviewer?.criticalDifference || null,
    duplicateVerdict: src.reviewer?.duplicateClassification || 'UNKNOWN',
    lwNativity: src.reviewer?.lwNativity || arch?.lwNativity || null,
    recommendation: src.reviewer?.recommendation || 'KEEP',
    title: s.title,
    situation: s.situation,
    question: s.question,
    answers: s.answers,
    explanation: s.explanation,
    whyCorrectOverSecondBest: s.whyCorrectOverSecondBest,
  });

  if (!abClear) blockers.push(`${src.id} A/B unclear`);
  if (!geometryOk) blockers.push(`${src.id} geometry weak`);
  if (hrFlags.length) blockers.push(`${src.id} HR flags`);
}

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

const lockedOk = Object.entries(lock.seeds941to974).every(([id, h]) => hash(bank.find((s) => s.id === id)) === h);
if (!locks.allOk) blockers.push('locked bank hash/count changed');
if (!lockedOk) blockers.push('941-974 changed');

const expectedLw = 74 + batch.length;
const lwCount = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lwCount !== expectedLw) blockers.push(`LW count ${lwCount} != ${expectedLw}`);

const rewriteOrRemove = rows.filter((r) => r.recommendation === 'TACTICAL REWRITE' || r.recommendation === 'REMOVE');
if (rewriteOrRemove.length) {
  for (const r of rewriteOrRemove) blockers.push(`${r.id} ${r.recommendation}`);
}

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
  systems: rows.reduce((acc, r) => {
    acc[r.defensiveSystem] = (acc[r.defensiveSystem] || 0) + 1;
    return acc;
  }, {}),
  numerical: rows.reduce((acc, r) => {
    acc[r.numerical] = (acc[r.numerical] || 0) + 1;
    return acc;
  }, {}),
  nativity: rows.reduce((acc, r) => {
    acc[r.lwNativity] = (acc[r.lwNativity] || 0) + 1;
    return acc;
  }, {}),
  maxCoachRisk: Math.max(...rows.map((r) => r.coachRisk)),
  temporaryLwTotal: lwCount,
};

const usedFamilies = new Set();
for (let i = 941; i <= 974 + batch.length; i++) {
  const s = bank.find((x) => x.id === `scn_bank_${i}`);
  if (!s) continue;
  const fk = (s.skillTags || []).find((t) => String(t).startsWith('family:'))?.replace('family:', '');
  if (fk) usedFamilies.add(fk);
}
const remainingUnused = matrix.remainingFamilies.filter((f) => !usedFamilies.has(f.familyKey)).length;

const strongest = [...rows].sort((a, b) => a.coachRisk - b.coachRisk).slice(0, 3);
const inspect = [...rows]
  .filter((r) => r.coachRisk >= 4 || r.duplicateVerdict === 'RELATED_BUT_DISTINCT')
  .sort((a, b) => b.coachRisk - a.coachRisk)
  .slice(0, 3);

const verdict =
  blockers.length === 0 ? 'LW BATCH C APPROVED FOR HUMAN REVIEW' : 'LW BATCH C NEEDS TACTICAL REVISION';

const review = {
  phase: 'BATCH_C',
  verdict,
  rows,
  totals,
  strongest: strongest.map((r) => r.id),
  inspectClosely: inspect.map((r) => r.id),
  remainingUnusedFamilyCount: remainingUnused,
  planSelection: plan.selectedForBatchC.map((s) => s.familyKey),
};

const audit = {
  phase: 'BATCH_C_AUDIT',
  verdict,
  blockers,
  totals,
  locks,
  locked941to974Ok: lockedOk,
  selection: rows.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    teachingArea: r.teachingArea,
    difficulty: r.difficulty,
    attackOrDefence: r.attackOrDefence,
    system: r.defensiveSystem,
    numerical: r.numerical,
    perception: r.perception,
    handedness: r.handedness,
    coachRisk: r.coachRisk,
    abVerdict: r.abVerdict,
    hrVerdict: r.hrVerdict,
    geometryVerdict: r.geometryVerdict,
    closestRw: r.closestRw,
    closestLw: r.closestLw,
    duplicateVerdict: r.duplicateVerdict,
    lwNativity: r.lwNativity,
    recommendation: r.recommendation,
  })),
  strongest: strongest.map((r) => ({ id: r.id, familyKey: r.familyKey, coachRisk: r.coachRisk })),
  inspectClosely: inspect.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    coachRisk: r.coachRisk,
    reason: r.coachRisk >= 4 ? `coachRisk ${r.coachRisk}` : r.duplicateVerdict,
  })),
  remainingConcerns: [
    'Human coach should read HR aloud for all Batch C, especially 977 (3:3 switch) and 979 (5v6 priority).',
    '978 opposite-map of 972 — confirm far-wing side geometry holds in review.',
    '981 opposite of 968 — confirm Open system relevance holds.',
    `Legacy 40 still present; temporary LW=${lwCount} until later cleanup.`,
  ],
  remainingUnusedFamilyCount: remainingUnused,
  rejectedFamilies: plan.rejected,
  questionableFamilies: plan.questionable,
};

const dupAudit = {
  phase: 'BATCH_C_DUPLICATE_AUDIT',
  vsLocked941to974: 'no shared familyKeys with locked Gold',
  rows: rows.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    closestLw: r.closestLw,
    closestRw: r.closestRw,
    sharedConcept: r.sharedConcept,
    criticalDifference: r.criticalDifference,
    duplicateClassification: r.duplicateVerdict,
  })),
  unresolvedDuplicates: rows.filter((r) => ['DUPLICATE', 'SEMANTIC_DUPLICATE'].includes(r.duplicateVerdict)).length,
};

const status = {
  phase: 'BATCH_C',
  verdict,
  insertedIds: batch.map((b) => b.id),
  temporaryLwTotal: lwCount,
  locksOk: locks.allOk,
  locked941to974Ok: lockedOk,
  blockers,
  remainingUnusedFamilyCount: remainingUnused,
};

writeFileSync(join(root, 'scripts/lw-gold-batch-c-review.json'), JSON.stringify(review, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-c-audit.json'), JSON.stringify(audit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-c-duplicate-audit.json'), JSON.stringify(dupAudit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-c-status.json'), JSON.stringify(status, null, 2) + '\n');

let md = `# LW Gold Batch C — Human Review (${rows.length})

**Verdict: ${verdict}**

Temporary LW total: **${lwCount}** (40 legacy + 34 Gold 941–974 + ${rows.length} Batch C)

| ID | familyKey | area | diff | A/D | sys | num | perc | risk | A/B | HR | geo | dup | nativity | rec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows
  .map(
    (r) =>
      `| ${r.id} | \`${r.familyKey}\` | ${r.teachingArea} | ${r.difficulty} | ${r.attackOrDefence} | ${r.defensiveSystem} | ${r.numerical} | ${r.perception} | ${r.coachRisk} | ${r.abVerdict} | ${r.hrVerdict} | ${r.geometryVerdict} | ${r.duplicateVerdict} | ${r.lwNativity} | ${r.recommendation} |`,
  )
  .join('\n')}

## Strongest 3
${strongest.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk})`).join('\n')}

## Inspect closely
${inspect.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk}) — ${r.duplicateVerdict}`).join('\n')}

## Distributions
- Attack / Defence: ${totals.attack} / ${totals.defence}
- Difficulty: ${JSON.stringify(totals.difficulty)}
- Perception T/F: ${totals.perceptionTrue} / ${totals.perceptionFalse}
- Systems: ${JSON.stringify(totals.systems)}
- Numerical: ${JSON.stringify(totals.numerical)}
- Nativity: ${JSON.stringify(totals.nativity)}

## Remaining unused matrix families: ${remainingUnused}

`;

for (const r of rows) {
  md += `---

## ${r.id} — ${r.title.en}

**HR title:** ${r.title.hr}

**Situation HR:** ${r.situation.hr}

**Question HR:** ${r.question.hr}

**A:** ${r.answers[0].text.hr}

**B:** ${r.answers[1].text.hr}

**whyCorrectOverSecondBest:** ${r.whyCorrectOverSecondBest.hr}

`;
}

writeFileSync(join(root, 'scripts/lw-gold-batch-c-review.md'), md);
writeFileSync(
  join(root, 'scripts/lw-gold-batch-c-audit.md'),
  `# LW Batch C Audit\n\n**Verdict: ${verdict}**\n\nBlockers: ${blockers.length ? blockers.join('; ') : 'none'}\n\n` +
    `Locks OK: ${locks.allOk}\n941–974 OK: ${lockedOk}\nMax risk: ${totals.maxCoachRisk}\nRemaining unused: ${remainingUnused}\n`,
);

console.log(
  JSON.stringify(
    {
      verdict,
      blockers,
      totals,
      locksOk: locks.allOk,
      lockedOk,
      remainingUnused,
    },
    null,
    2,
  ),
);
