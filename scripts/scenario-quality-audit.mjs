/**
 * Sprint 5 — score active scenarios 1–10 and flag quality issues.
 * Run: node scripts/scenario-quality-audit.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import {
  scoreDecisionDepth,
  findAbsurdAnswers,
  isWeakQuestion,
  countContextSignals,
} from './scenario-bank/quality-rubric.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

function scoreScenario(s) {
  const sit = s.situation?.en || '';
  const q = s.question?.en || '';
  const exp = s.explanation?.en || '';
  const depth = scoreDecisionDepth({
    situationEn: sit,
    questionEn: q,
    answers: (s.answers || []).map((a) => ({
      textEn: a.text?.en,
      feedbackEn: a.feedback?.en,
      quality: a.quality,
    })),
    difficulty: s.difficulty,
  });

  const clamp = (n) => Math.max(1, Math.min(10, Math.round(n)));
  const signals = countContextSignals(sit);
  const absurd = findAbsurdAnswers(s.answers || []);
  const dims = {
    realism: clamp(4 + Math.min(4, signals) + (sit.length > 120 ? 1 : 0)),
    clarity: clamp(isWeakQuestion(q) ? 4 : 8 + (q.length > 40 ? 1 : 0)),
    decision: clamp(depth),
    answers: clamp(8 - absurd.length * 2 + ((s.answers || []).every((a) => (a.text?.en || '').length >= 28) ? 1 : 0)),
    explanation: clamp(exp.length > 80 ? 9 : exp.length > 40 ? 7 : 4),
    position: clamp(s.primaryPosition && s.primaryPosition !== 'All' ? 9 : 6),
  };
  const overall = clamp(
    (dims.realism + dims.clarity + dims.decision + dims.answers + dims.explanation + dims.position) / 6,
  );
  return { ...dims, overall, depth, absurd: absurd.length, weakQuestion: isWeakQuestion(q) };
}

const fingerprints = new Map();
const near = [];
const below = [];
const obvious = [];
const scored = [];

for (const s of bank) {
  const fp = createHash('sha1')
    .update(JSON.stringify({ t: s.title?.en, sit: s.situation?.en, q: s.question?.en }))
    .digest('hex')
    .slice(0, 12);
  if (fingerprints.has(fp)) near.push({ id: s.id, dupOf: fingerprints.get(fp) });
  else fingerprints.set(fp, s.id);

  const dims = scoreScenario(s);
  scored.push({ id: s.id, primaryPosition: s.primaryPosition, ...dims });
  if (dims.overall < 8) below.push({ id: s.id, overall: dims.overall, primaryPosition: s.primaryPosition });

  const qualities = (s.answers || []).map((a) => a.quality);
  if (qualities.filter((q) => q === 'optimal').length === 1) {
    const opt = s.answers.find((a) => a.quality === 'optimal');
    const others = s.answers.filter((a) => a.quality !== 'optimal');
    if (opt && others.every((a) => (a.text?.en || '').length < (opt.text?.en || '').length * 0.45)) {
      obvious.push(s.id);
    }
  }
}

// Persist decision-depth qualityScore (no artificial lift of shallow content)
let lifted = 0;
for (const s of bank) {
  const dims = scoreScenario(s);
  const next = dims.overall;
  if (s.qualityScore !== next) {
    s.qualityScore = next;
    lifted++;
  }
  const text = `${s.title?.en || ''} ${s.situation?.en || ''}`.toLowerCase();
  const tags = [];
  if (/shot|read|shoulder/.test(text)) tags.push('shotReading');
  if (/7m|seven|penalty/.test(text)) tags.push('sevenMetre');
  if (/fast break|counter|breakaway/.test(text)) tags.push('fastBreakTiming');
  if (/screen|block|pick/.test(text)) tags.push('screening');
  if (/pressure|final|clutch|late/.test(text)) tags.push('pressureDecisions');
  if (/angle|corner|narrow/.test(text)) tags.push('angleSelection');
  if (/defence|defense|recover/.test(text)) tags.push('defensiveReading');
  // Merge inferred tags — never wipe gold-bank metadata (handedness, perception, numerical, gameState).
  if (tags.length) {
    s.skillTags = [...new Set([...(s.skillTags || []), ...tags])];
  }
}

writeFileSync(join(root, 'content/scenario-bank/scenarios.json'), JSON.stringify(bank, null, 2) + '\n');

const report = {
  total: bank.length,
  below8: below.length,
  duplicates: near.length,
  obviousAnswers: obvious.length,
  liftedQualityScores: lifted,
  belowSample: below.slice(0, 25),
  byPositionBelow: below.reduce((acc, b) => {
    acc[b.primaryPosition] = (acc[b.primaryPosition] || 0) + 1;
    return acc;
  }, {}),
};

writeFileSync(join(root, 'scripts/scenario-quality-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (below.length > bank.length * 0.35) {
  console.error('FAIL: too many scenarios below 8/10');
  process.exit(1);
}
console.log('PASS');
