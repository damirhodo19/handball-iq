#!/usr/bin/env node
/**
 * Export full Right Wing Gold Bank (70) for human review.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const matrix = existsSync(join(root, 'scripts/rw-gold-coverage-matrix.json'))
  ? JSON.parse(readFileSync(join(root, 'scripts/rw-gold-coverage-matrix.json'), 'utf8'))
  : [];
const metaById = Object.fromEntries(matrix.map((m) => [m.id, m]));

const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');

const review = rw.map((s, i) => {
  const meta = metaById[s.id] || {};
  const scored = scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  });
  const answers = s.answers || [];
  const flags = [];
  if (scored.overall < 8.0) flags.push('rubric_below_8');
  if (!s.whyCorrectOverSecondBest?.hr) flags.push('missing_why');
  if ((s.skillTags || []).some((t) => t.startsWith('handedness:')) && !/ljevoruk|desnoruk|left-hand|right-hand|Linkshänder|Rechtshänder/i.test(`${s.situation?.en} ${s.situation?.hr}`)) {
    flags.push('handedness_tag_without_situation_mention');
  }

  return {
    label: `${i + 1}_${meta.familyKey || s.id}`,
    id: s.id,
    family: meta.familyKey || s.title?.en,
    familyEn: s.title?.en,
    parentFamily: meta.parentFamily || null,
    difficulty: s.difficulty,
    attackOrDefence: s.attackOrDefence,
    handedness: meta.handedness || 'none',
    perception: !!meta.perception || (s.skillTags || []).includes('perception'),
    numerical: meta.numerical || '6v6',
    gameState: meta.gameState || 'none',
    primaryTacticalCue: meta.primaryTacticalCue || '',
    situation: s.situation,
    question: s.question,
    A: answers[0],
    B: answers[1],
    C: answers[2],
    D: answers[3],
    correct: answers.find((a) => a.quality === 'optimal')?.text,
    explanation: s.explanation,
    whyCorrectOverSecondBest: s.whyCorrectOverSecondBest,
    qualityScore: s.qualityScore ?? scored.overall,
    autoRubricScore: scored.overall,
    flags,
  };
});

const summary = {
  status: 'RIGHT WING GOLD BANK READY FOR HUMAN REVIEW',
  count: review.length,
  ids: review.map((r) => r.id),
  difficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      review.filter((r) => r.difficulty === d).length,
    ]),
  ),
  attack: review.filter((r) => r.attackOrDefence === 'Attack').length,
  defence: review.filter((r) => r.attackOrDefence === 'Defence').length,
  perceptionCount: review.filter((r) => r.perception).length,
  perceptionPct: Math.round((review.filter((r) => r.perception).length / review.length) * 1000) / 10,
  handedness: {
    left: review.filter((r) => r.handedness === 'left').length,
    right: review.filter((r) => r.handedness === 'right').length,
    none: review.filter((r) => r.handedness === 'none').length,
  },
  avgRubric: Math.round((review.reduce((a, r) => a + r.qualityScore, 0) / review.length) * 10) / 10,
  minRubric: Math.min(...review.map((r) => r.qualityScore)),
  maxRubric: Math.max(...review.map((r) => r.qualityScore)),
  flagged: review.filter((r) => r.flags.length).length,
};

writeFileSync(join(root, 'scripts/rw-gold-bank-human-review-70.json'), JSON.stringify(review, null, 2) + '\n');
writeFileSync(join(root, 'scripts/rw-gold-bank-summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
