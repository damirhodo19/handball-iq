#!/usr/bin/env node
/**
 * Read-only baseline audit before Pivot and Goalkeeper Gold rebuilds.
 * Never mutates scenario content. Writes review reports only.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const numId = (id) => Number(String(id).match(/(\d+)$/)?.[1] ?? NaN);

const locked = {
  LB: { position: 'Left Back', count: 62 },
  RB: { position: 'Right Back', count: 63 },
  CB: { position: 'Centre Back', count: 70 },
  RW: { position: 'Right Wing', count: 65 },
  LW: { position: 'Left Wing', count: 41 },
};

const lockManifest = JSON.parse(
  readFileSync(join(root, 'scripts/gold-bank-final-lock-manifest.json'), 'utf8'),
);

function expectedHash(key) {
  const candidates = [
    lockManifest.contentHashes?.[key],
    lockManifest.hashes?.[key],
    lockManifest.positions?.[key]?.hash,
    lockManifest.positions?.[key]?.contentHash,
    lockManifest.goldBanks?.[key]?.contentHash,
  ];
  return candidates.find(Boolean) ?? null;
}

const lockCheck = {};
const errors = [];
for (const [key, meta] of Object.entries(locked)) {
  const rows = bank.filter((s) => s.primaryPosition === meta.position);
  const actual = hash(rows);
  const expected = expectedHash(key);
  lockCheck[key] = {
    count: rows.length,
    expectedCount: meta.count,
    contentHash: actual,
    expectedHash: expected,
    countOk: rows.length === meta.count,
    hashOk: expected ? actual === expected : null,
  };
  if (!lockCheck[key].countOk) errors.push(`${key} count drift`);
  if (lockCheck[key].hashOk === false) errors.push(`${key} hash drift`);
}

function auditPosition(position) {
  const rows = bank
    .filter((s) => s.primaryPosition === position)
    .sort((a, b) => numId(a.id) - numId(b.id));
  const byTitle = new Map();
  for (const s of rows) {
    const title = String(s.title?.en ?? '').trim().toLowerCase();
    if (!byTitle.has(title)) byTitle.set(title, []);
    byTitle.get(title).push(s.id);
  }
  const duplicateTitleGroups = [...byTitle.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([title, ids]) => ({ title, ids, count: ids.length }));
  const difficulty = {};
  const attackDefence = {};
  for (const s of rows) {
    difficulty[s.difficulty] = (difficulty[s.difficulty] || 0) + 1;
    attackDefence[s.attackOrDefence] = (attackDefence[s.attackOrDefence] || 0) + 1;
  }
  return {
    count: rows.length,
    contentHash: hash(rows),
    ids: rows.map((s) => s.id),
    uniqueEnglishTitles: byTitle.size,
    duplicateTitleGroupCount: duplicateTitleGroups.length,
    duplicateRows: duplicateTitleGroups.reduce((n, g) => n + g.count, 0),
    duplicateTitleGroups,
    difficulty,
    attackDefence,
    familyTagCount: rows.filter((s) =>
      (s.skillTags || []).some((t) => String(t).startsWith('family:')),
    ).length,
  };
}

const pivot = auditPosition('Pivot');
const goalkeeper = auditPosition('Goalkeeper');
const findings = [
  `Pivot has ${pivot.count} rows but only ${pivot.uniqueEnglishTitles} title families.`,
  `Goalkeeper has ${goalkeeper.count} rows but only ${goalkeeper.uniqueEnglishTitles} title families.`,
  'Both legacy banks are variation-heavy and need one-decision-per-family Gold rebuilds.',
  'Pivot rebuild starts first; Goalkeeper remains untouched until Pivot Gold approval.',
  'Existing LB/RB/CB/RW/LW Gold content remains immutable throughout both rebuilds.',
];

const report = {
  status: errors.length ? 'FAIL' : 'PIVOT_GK_PRE_AUDIT_READY',
  generatedAt: new Date().toISOString(),
  lockedGold: lockCheck,
  pivot,
  goalkeeper,
  findings,
  errors,
};

writeFileSync(
  join(root, 'scripts/pivot-goalkeeper-pre-audit.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

const md = [
  '# Pivot + Goalkeeper Gold Pre-Audit',
  '',
  `**Status: ${report.status}**`,
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Baseline',
  '',
  `- Pivot: ${pivot.count} rows / ${pivot.uniqueEnglishTitles} unique English title families / hash \`${pivot.contentHash}\``,
  `- Goalkeeper: ${goalkeeper.count} rows / ${goalkeeper.uniqueEnglishTitles} unique English title families / hash \`${goalkeeper.contentHash}\``,
  '- Existing Gold: LB 62 / RB 63 / CB 70 / RW 65 / LW 41 — immutable',
  '',
  '## Decision',
  '',
  '- Rebuild Pivot first using unique tactical families and a 10-scenario pilot.',
  '- Rebuild Goalkeeper only after Pivot Gold lock and runtime cutover.',
  '- Never promote legacy variations merely to hit a count.',
  '- Preserve all five existing Gold position hashes at every gate.',
  '',
  '## Findings',
  '',
  ...findings.map((x) => `- ${x}`),
  '',
];
writeFileSync(join(root, 'scripts/pivot-goalkeeper-pre-audit.md'), md.join('\n'));

console.log(
  JSON.stringify(
    {
      status: report.status,
      pivot: { count: pivot.count, uniqueFamilies: pivot.uniqueEnglishTitles },
      goalkeeper: { count: goalkeeper.count, uniqueFamilies: goalkeeper.uniqueEnglishTitles },
      lockedGoldErrors: errors.length,
    },
    null,
    2,
  ),
);
if (errors.length) process.exit(1);
