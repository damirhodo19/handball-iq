#!/usr/bin/env node
/**
 * Human-coach risk audit v2 for recovered RW gold bank.
 * Goal: top 15 should be mostly POLISH / KEEP — not template failures.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { RW_LOCKED_REFERENCES } from './scenario-bank/data/right-wing-gold-taxonomy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const matrix = JSON.parse(readFileSync(join(root, 'scripts/rw-gold-coverage-matrix.json'), 'utf8'));
const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');
const byId = Object.fromEntries(rw.map((s) => [s.id, s]));
const lockedIds = new Set(
  matrix.filter((m) => RW_LOCKED_REFERENCES.includes(m.familyKey)).map((m) => m.id),
);

function riskScore(m, s) {
  let score = 3;
  const reasons = [];
  const blob = JSON.stringify(s);
  const a = s.answers?.find((x) => x.quality === 'optimal')?.text?.en || '';
  const b = s.answers?.find((x) => x.quality === 'good')?.text?.en || '';
  const exp = s.explanation?.hr || '';

  if (/Yoat |Čitaj konkretnu|available side of goal|Secure the catch and play a short return to rebuild the attack/.test(blob)) {
    score += 5;
    reasons.push('template residue');
  }
  if (/ispuštanje|nosač lopte|mrtvi val|jedan takt|puštanje/.test(exp + (s.situation?.hr || ''))) {
    score += 2;
    reasons.push('questionable HR lexicon');
  }
  if ((exp.match(/Signal:/g) || []).length) {
    score += 0.5;
    reasons.push('Signal: opener');
  }
  // A vs B: B should be conditional
  if (!/\b(if|only if|when|ako|kad|wenn)\b/i.test(b)) {
    score += 1;
    reasons.push('B weakly conditioned');
  }
  if (/far[- ]?post|near[- ]?post|lob/i.test(a) && !/goalkeeper|keeper|arm|foot|hand|deep|empty net/i.test(s.situation?.en || '')) {
    score += 4;
    reasons.push('GK target without cue');
  }
  if (m.perception && /score|minute|6v5|lead|trail/i.test(m.primaryTacticalCue || '') && !/hip|arm|foot|hand|recover|block|lane|take-off|defender/i.test(m.primaryTacticalCue || '')) {
    score += 1.5;
    reasons.push('perception may be soft');
  }
  if (lockedIds.has(m.id)) {
    score = Math.min(score, 2);
    reasons.push('locked reference');
  }
  // Length ≠ quality
  if ((s.situation?.en || '').length > 700) {
    score += 0.5;
    reasons.push('long situation');
  }

  score = Math.min(10, Math.round(score * 10) / 10);
  let verdict = 'KEEP';
  if (score >= 8) verdict = 'TACTICAL REWRITE';
  else if (score >= 6.5) verdict = 'POLISH';
  else if (score >= 5) verdict = 'POLISH';
  else verdict = 'KEEP';
  if (reasons.includes('template residue') || reasons.includes('GK target without cue')) {
    verdict = score >= 8 ? 'REMOVE / MERGE' : 'TACTICAL REWRITE';
  }
  return { score, verdict, reasons };
}

const rows = matrix.map((m) => {
  const s = byId[m.id];
  const r = riskScore(m, s);
  return {
    id: m.id,
    familyKey: m.familyKey,
    title: s.title?.en,
    risk: r.score,
    verdict: r.verdict,
    reasons: r.reasons,
    difficulty: m.difficulty,
    perception: m.perception,
    attackOrDefence: m.attackOrDefence,
  };
});

rows.sort((a, b) => b.risk - a.risk || a.id.localeCompare(b.id));
const top15 = rows.slice(0, 15);

const verdictCounts = {};
for (const r of top15) verdictCounts[r.verdict] = (verdictCounts[r.verdict] || 0) + 1;

const systemic =
  top15.filter((r) => r.verdict === 'TACTICAL REWRITE' || r.verdict === 'REMOVE / MERGE').length >= 4;

const report = {
  generatedAt: new Date().toISOString(),
  bankCount: rw.length,
  top15,
  top15VerdictCounts: verdictCounts,
  bankRisk: {
    avg: Math.round((rows.reduce((a, r) => a + r.risk, 0) / rows.length) * 10) / 10,
    max: rows[0]?.risk,
    min: rows[rows.length - 1]?.risk,
    rewriteOrRemoveInTop15: top15.filter((r) =>
      ['TACTICAL REWRITE', 'REMOVE / MERGE'].includes(r.verdict),
    ).length,
    polishOrKeepInTop15: top15.filter((r) => ['POLISH', 'KEEP'].includes(r.verdict)).length,
  },
  systemicTemplateCluster: systemic,
  readyForHumanReview: !systemic && (verdictCounts['TACTICAL REWRITE'] || 0) + (verdictCounts['REMOVE / MERGE'] || 0) <= 2,
  note: 'Goal is not zero risk. Top 15 should be mostly POLISH/KEEP.',
};

writeFileSync(join(root, 'scripts/rw-gold-human-coach-risk-v2.json'), JSON.stringify(report, null, 2) + '\n');

const md = [
  '# RW Gold — Human Coach Risk Audit v2',
  '',
  `Bank count: ${rw.length}`,
  `Ready for human review (automated gate): ${report.readyForHumanReview ? 'YES' : 'NO'}`,
  `Systemic template cluster: ${systemic ? 'YES' : 'NO'}`,
  '',
  '## Top 15 remaining risks',
  '',
  ...top15.map(
    (r, i) =>
      `${i + 1}. **${r.id}** \`${r.familyKey}\` — risk ${r.risk} — **${r.verdict}**\n   - ${r.reasons.join('; ') || 'general'}\n   - ${r.title}`,
  ),
  '',
  `Verdict counts (top 15): ${JSON.stringify(verdictCounts)}`,
  '',
];
writeFileSync(join(root, 'scripts/rw-gold-human-coach-risk-v2.md'), md.join('\n'));
console.log(JSON.stringify({ ...report, top15: top15.map((t) => ({ id: t.id, risk: t.risk, verdict: t.verdict })) }, null, 2));
