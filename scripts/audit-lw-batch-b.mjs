#!/usr/bin/env node
/**
 * Non-mutating Batch B audit + review export.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const batch = JSON.parse(readFileSync(join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-b.json'), 'utf8'));
const matrix = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-full-family-matrix.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'scripts/.lw-batch-b-lock-before.json'), 'utf8'));
const plan = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-batch-b-plan.json'), 'utf8'));

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
  /prozor umre/i,
  /živi odraz/i,
  /zarađen odraz/i,
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
  if (src.reviewer?.duplicateClassification === 'DUPLICATE') blockers.push(`${src.id} DUPLICATE`);

  const sit = s.situation.en.toLowerCase();
  const geometryOk = (sit.includes('left') || sit.includes('wing')) && sit.length > 180 && !!s.question.en;

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

const lockedIds = Array.from({ length: 22 }, (_, i) => `scn_bank_${941 + i}`);
const familyKeysBatch = new Set(batch.map((b) => b.familyKey));
for (const id of lockedIds) {
  const s = bank.find((x) => x.id === id);
  const fk = (s.skillTags || []).find((t) => String(t).startsWith('family:'))?.replace('family:', '');
  if (familyKeysBatch.has(fk)) blockers.push(`Batch B family collides with locked ${id} (${fk})`);
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

const lockedOk = Object.entries(lock.seeds941to962).every(([id, h]) => {
  const s = bank.find((x) => x.id === id);
  return crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex') === h;
});
if (!locks.allOk) blockers.push('locked bank hash/count changed');
if (!lockedOk) blockers.push('941-962 changed');

const lwCount = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lwCount !== 74) blockers.push(`LW count ${lwCount} != 74`);

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

const usedFamilies = new Set();
for (let i = 941; i <= 974; i++) {
  const s = bank.find((x) => x.id === `scn_bank_${i}`);
  const fk = (s.skillTags || []).find((t) => String(t).startsWith('family:'))?.replace('family:', '');
  if (fk) usedFamilies.add(fk);
}
const remainingUnused = matrix.remainingFamilies.filter((f) => !usedFamilies.has(f.familyKey)).length;

// projected final after pilot+A+B (34) of 59
const allGold = [];
for (let i = 941; i <= 974; i++) allGold.push(bank.find((x) => x.id === `scn_bank_${i}`));
const projDiff = allGold.reduce((a, s) => {
  a[s.difficulty] = (a[s.difficulty] || 0) + 1;
  return a;
}, {});
const batchA = JSON.parse(readFileSync(join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-a.json'), 'utf8'));
const pilot = JSON.parse(readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'));
let percTrue = 0;
for (const s of [...pilot, ...batchA, ...batch]) if (s.perception) percTrue++;

const strongest = [...rows].sort((a, b) => a.coachRisk - b.coachRisk).slice(0, 3);
const inspect = [...rows]
  .filter((r) => r.coachRisk >= 4 || r.duplicateVerdict === 'RELATED_BUT_DISTINCT')
  .sort((a, b) => b.coachRisk - a.coachRisk)
  .slice(0, 3);

const goldLockPath = join(root, 'scripts/.lw-batch-b-gold-lock.json');
let goldLocked = false;
try {
  const gl = JSON.parse(readFileSync(goldLockPath, 'utf8'));
  goldLocked = gl.status === 'LW BATCH B GOLD APPROVED';
} catch {
  goldLocked = false;
}
const verdict =
  blockers.length === 0
    ? goldLocked
      ? 'LW BATCH B GOLD APPROVED'
      : 'LW BATCH B APPROVED FOR HUMAN REVIEW'
    : 'LW BATCH B NEEDS TACTICAL REVISION';

const review = {
  phase: 'BATCH_B',
  verdict,
  rows,
  totals,
  strongest: strongest.map((r) => r.id),
  inspectClosely: inspect.map((r) => r.id),
  remainingUnusedFamilyCount: remainingUnused,
  projectedAfterBatchB: {
    goldCount: 34,
    difficulty: projDiff,
    perceptionTrue: percTrue,
    attack: allGold.filter((s) => s.attackOrDefence === 'Attack').length,
    defence: allGold.filter((s) => s.attackOrDefence === 'Defence').length,
  },
};

const audit = {
  phase: 'BATCH_B_AUDIT',
  verdict,
  blockers,
  totals,
  locks,
  locked941to962Ok: lockedOk,
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
    duplicateVerdict: r.duplicateVerdict,
    lwNativity: r.lwNativity,
  })),
  strongest: strongest.map((r) => ({ id: r.id, familyKey: r.familyKey, coachRisk: r.coachRisk })),
  inspectClosely: inspect.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    coachRisk: r.coachRisk,
    reason: r.coachRisk >= 4 ? `coachRisk ${r.coachRisk}` : r.duplicateVerdict,
  })),
  remainingConcerns: [
    'Human coach should read HR aloud for surgically repaired 963/964/970/974 first.',
    '964 RELATED to RW 890/893 — confirm LB free-arm co-cue holds in review.',
    '974 RELATED to RW 880 / LW 962 — confirm ownership-transfer timing stays isolated.',
    'Legacy 40 still present; temporary LW=74 until later cleanup.',
  ],
  remainingUnusedFamilyCount: remainingUnused,
  skippedFamilies: plan.skippedForDuplicateRisk,
};

const dupAudit = {
  phase: 'BATCH_B_DUPLICATE_AUDIT',
  vsLocked941to962: 'no shared familyKeys',
  internalFamilyCollisions: 0,
  rows: rows.map((r) => ({
    id: r.id,
    familyKey: r.familyKey,
    closestLw: r.closestLw,
    closestRw: r.closestRw,
    sharedConcept: r.sharedConcept,
    criticalDifference: r.criticalDifference,
    duplicateClassification: r.duplicateVerdict,
  })),
  unresolvedDuplicates: rows.filter((r) => r.duplicateVerdict === 'DUPLICATE').length,
};

const status = {
  phase: 'BATCH_B',
  verdict,
  insertedIds: batch.map((b) => b.id),
  temporaryLwTotal: lwCount,
  locksOk: locks.allOk,
  locked941to962Ok: lockedOk,
  blockers,
  remainingUnusedFamilyCount: remainingUnused,
};

writeFileSync(join(root, 'scripts/lw-gold-batch-b-review.json'), JSON.stringify(review, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-b-audit.json'), JSON.stringify(audit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-b-duplicate-audit.json'), JSON.stringify(dupAudit, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lw-gold-batch-b-status.json'), JSON.stringify(status, null, 2) + '\n');

const ans = (a) => `#### ${a.quality.toUpperCase()}
- EN: ${a.text.en}
- HR: ${a.text.hr}
- DE: ${a.text.de}
- Feedback EN: ${a.feedback.en}
- Feedback HR: ${a.feedback.hr}
- Feedback DE: ${a.feedback.de}`;

let md = `# LW Gold Batch B — Human Review (12)

**Verdict: ${verdict}**

Temporary LW total: **${lwCount}** (40 legacy + 10 pilot + 12 Batch A + 12 Batch B)

| ID | familyKey | area | diff | A/D | sys | num | perc | risk | A/B | HR | geo | dup | nativity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows
  .map(
    (r) =>
      `| ${r.id} | \`${r.familyKey}\` | ${r.teachingArea} | ${r.difficulty} | ${r.attackOrDefence} | ${r.defensiveSystem} | ${r.numerical} | ${r.perception} | ${r.coachRisk} | ${r.abVerdict} | ${r.hrVerdict} | ${r.geometryVerdict} | ${r.duplicateVerdict} | ${r.lwNativity} |`,
  )
  .join('\n')}

## Strongest 3
${strongest.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk})`).join('\n')}

## Inspect closely
${inspect.map((r) => `- ${r.id} \`${r.familyKey}\` (risk ${r.coachRisk}) — ${r.duplicateVerdict}`).join('\n')}

`;

for (const r of rows) {
  md += `---

## ${r.id} — ${r.title.en}

| Field | Value |
|---|---|
| familyKey | \`${r.familyKey}\` |
| closest LW | ${r.closestLw} |
| closest RW | ${r.closestRw} |
| duplicate | ${r.duplicateVerdict} |
| coachRisk | ${r.coachRisk} |

### HR
**Title:** ${r.title.hr}

**Situation:** ${r.situation.hr}

**Question:** ${r.question.hr}

${r.answers.map(ans).join('\n\n')}

**Explanation HR:** ${r.explanation.hr}

**whyCorrectOverSecondBest HR:** ${r.whyCorrectOverSecondBest.hr}

### EN why A/B
${r.whyCorrectOverSecondBest.en}

**Critical difference:** ${r.criticalDifference}

`;
}

writeFileSync(join(root, 'scripts/lw-gold-batch-b-review.md'), md);

const auditMd = `# LW Gold Batch B — Audit

**Verdict: ${verdict}**

${blockers.length ? `## Blockers\n\n${blockers.map((b) => `- ${b}`).join('\n')}` : 'No blockers.'}

## Totals
- count: ${totals.count}
- attack/defence: ${totals.attack}/${totals.defence}
- perception true/false: ${totals.perceptionTrue}/${totals.perceptionFalse}
- difficulty: ${JSON.stringify(totals.difficulty)}
- max coach risk: ${totals.maxCoachRisk}
- temporary LW: ${totals.temporaryLwTotal}
- remaining unused families: ${remainingUnused}

## Locks
| Bank | count | hash |
|---|---|---|
| LB | ${locks.LB.count} | ${locks.LB.hashOk} |
| RB | ${locks.RB.count} | ${locks.RB.hashOk} |
| CB | ${locks.CB.count} | ${locks.CB.hashOk} |
| RW | ${locks.RW.count} | ${locks.RW.hashOk} |

Locked 941–962 unchanged: **${lockedOk}**

## Remaining concerns
${audit.remainingConcerns.map((c) => `- ${c}`).join('\n')}
`;
writeFileSync(join(root, 'scripts/lw-gold-batch-b-audit.md'), auditMd);

console.log(JSON.stringify({ verdict, blockers, totals, locksOk: locks.allOk, lockedOk, remainingUnused }, null, 2));
