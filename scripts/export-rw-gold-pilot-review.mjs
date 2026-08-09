#!/usr/bin/env node
/**
 * Export Right Wing Gold 10-scenario pilot for human review.
 * Does NOT touch production scenarios.json.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pilot = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/right-wing-gold-pilot-10.json'), 'utf8'),
);

const review = pilot.map((f, i) => {
  const scenario = {
    id: `rw_pilot_${String(i + 1).padStart(2, '0')}`,
    title: f.title,
    category: 'Right Wing',
    primaryPosition: 'Right Wing',
    difficulty: f.difficulty,
    pressureLevel: f.pressureLevel,
    attackOrDefence: f.attackOrDefence,
    matchPhase: f.matchPhase,
    minute: f.minute,
    score: f.score,
    ...(f.defensiveSystem ? { defensiveSystem: f.defensiveSystem } : {}),
    situation: f.situation,
    question: f.question,
    answers: f.answers,
    explanation: f.explanation,
    whyCorrectOverSecondBest: f.whyCorrectOverSecondBest,
    skillTags: [
      ...(f.skillTags || []),
      ...(f.perception ? ['perception'] : []),
      ...(f.handedness && f.handedness !== 'none' ? [`handedness:${f.handedness}`] : []),
      ...(f.numerical && f.numerical !== '6v6' ? [`numerical:${f.numerical}`] : []),
      ...(f.gameState && f.gameState !== 'none' ? [`gameState:${f.gameState}`] : []),
    ],
  };

  const scored = scoreRubricV2(scenario, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(f.situation?.hr || ''),
  });
  const qualityScore = typeof f.qualityScoreOverride === 'number' ? f.qualityScoreOverride : scored.overall;
  scenario.qualityScore = qualityScore;

  const answers = f.answers || [];
  return {
    label: `${i + 1}_${f.familyKey}`,
    id: scenario.id,
    family: f.familyKey,
    familyEn: f.title.en,
    difficulty: f.difficulty,
    attackOrDefence: f.attackOrDefence,
    handedness: f.handedness || 'none',
    perception: !!f.perception,
    numerical: f.numerical || '6v6',
    gameState: f.gameState || 'none',
    primaryTacticalCue: f.primaryTacticalCue,
    situation: f.situation,
    question: f.question,
    A: answers[0],
    B: answers[1],
    C: answers[2],
    D: answers[3],
    correct: answers.find((a) => a.quality === 'optimal')?.text,
    explanation: f.explanation,
    whyCorrectOverSecondBest: f.whyCorrectOverSecondBest,
    qualityScore,
    autoRubricScore: scored.overall,
    rubricDims: scored.dims,
  };
});

const summary = {
  status: 'RIGHT WING PILOT HUMAN-REVIEW READY FOR FINAL APPROVAL',
  count: review.length,
  ids: review.map((r) => r.id),
  families: review.map((r) => ({ id: r.id, family: r.family, familyEn: r.familyEn })),
  difficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      review.filter((r) => r.difficulty === d).length,
    ]),
  ),
  attack: review.filter((r) => r.attackOrDefence === 'Attack').length,
  defence: review.filter((r) => r.attackOrDefence === 'Defence').length,
  handednessSpecific: review.filter((r) => r.handedness === 'left' || r.handedness === 'right').length,
  handednessLeft: review.filter((r) => r.handedness === 'left').length,
  handednessRight: review.filter((r) => r.handedness === 'right').length,
  perceptionCount: review.filter((r) => r.perception).length,
  avgRubric: Math.round((review.reduce((a, r) => a + r.qualityScore, 0) / review.length) * 10) / 10,
  minRubric: Math.min(...review.map((r) => r.qualityScore)),
  maxRubric: Math.max(...review.map((r) => r.qualityScore)),
  productionBankUntouched: true,
};

writeFileSync(join(root, 'scripts/rw-gold-pilot-human-review-10.json'), JSON.stringify(review, null, 2) + '\n');
writeFileSync(join(root, 'scripts/rw-gold-pilot-summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
