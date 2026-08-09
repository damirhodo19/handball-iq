#!/usr/bin/env node
/**
 * Diverse 20-scenario human review sample for recovered RW gold bank.
 * HR first, then EN/DE. Not random — coverage-driven.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const matrix = JSON.parse(readFileSync(join(root, 'scripts/rw-gold-coverage-matrix.json'), 'utf8'));
const byFamily = Object.fromEntries(matrix.map((m) => [m.familyKey, m]));
const byId = Object.fromEntries(bank.filter((s) => s.primaryPosition === 'Right Wing').map((s) => [s.id, s]));

const SLOTS = [
  { slot: '6:0 positional', familyKey: 'rw_60_rb_binds_takeoff' },
  { slot: 'RB cooperation', familyKey: 'rw_rb_hips_ask_now' },
  { slot: 'wing defender hips', familyKey: 'rw_rb_hips_wait_recover' },
  { slot: 'stay-wide', familyKey: 'rw_entry_when_not' },
  { slot: 'entry', familyKey: 'rw_entry_when_yes_second' },
  { slot: 'pivot cooperation', familyKey: 'rw_pivot_block_middle_takeoff' },
  { slot: 'goalkeeper near-post read', familyKey: 'rw_gk_near_post_commit' },
  { slot: 'goalkeeper depth', familyKey: 'rw_gk_stays_deep' },
  { slot: 'take-off geometry', familyKey: 'rw_60_takeoff_closed_from_inside' },
  { slot: 'first wave', familyKey: 'rw_trans_2v1_finish_lane' },
  { slot: '3v2', familyKey: 'rw_trans_3v2_hold_width' },
  { slot: 'second wave', familyKey: 'rw_trans_second_wave_positional' },
  { slot: '6v5', familyKey: 'rw_6v5_free_finish' },
  { slot: '5v6', familyKey: 'rw_5v6_safe_width' },
  { slot: '7v6', familyKey: 'rw_7v6_extra_attacker_space' },
  { slot: 'own empty goal', familyKey: 'rw_empty_own_goal_safe_return' },
  { slot: 'late-game attack', familyKey: 'rw_trailing_one_force_window' },
  { slot: 'passive play', familyKey: 'rw_passive_warning_no_force' },
  { slot: 'wing defence', familyKey: 'rw_def_protect_wing_until_handover' },
  { slot: 'transition defence', familyKey: 'rw_def_close_transition_lane' },
];

const scenarios = [];
for (const slot of SLOTS) {
  const m = byFamily[slot.familyKey];
  if (!m) throw new Error(`Missing family for slot ${slot.slot}: ${slot.familyKey}`);
  const s = byId[m.id];
  scenarios.push({
    slot: slot.slot,
    id: s.id,
    familyKey: m.familyKey,
    difficulty: s.difficulty,
    attackOrDefence: s.attackOrDefence,
    perception: m.perception,
    handedness: m.handedness,
    hr: {
      title: s.title.hr,
      situation: s.situation.hr,
      question: s.question.hr,
      answers: s.answers.map((a) => ({
        quality: a.quality,
        text: a.text.hr,
        feedback: a.feedback.hr,
      })),
      explanation: s.explanation.hr,
      whyCorrectOverSecondBest: s.whyCorrectOverSecondBest?.hr,
    },
    en: {
      title: s.title.en,
      situation: s.situation.en,
      question: s.question.en,
      answers: s.answers.map((a) => ({
        quality: a.quality,
        text: a.text.en,
        feedback: a.feedback.en,
      })),
      explanation: s.explanation.en,
      whyCorrectOverSecondBest: s.whyCorrectOverSecondBest?.en,
    },
    de: {
      title: s.title.de,
      situation: s.situation.de,
      question: s.question.de,
      answers: s.answers.map((a) => ({
        quality: a.quality,
        text: a.text.de,
        feedback: a.feedback.de,
      })),
      explanation: s.explanation.de,
      whyCorrectOverSecondBest: s.whyCorrectOverSecondBest?.de,
    },
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  purpose: 'Final human coach review sample — diversity slots, HR first',
  count: scenarios.length,
  scenarios,
};

writeFileSync(join(root, 'scripts/rw-gold-human-review-20.json'), JSON.stringify(out, null, 2) + '\n');

const md = ['# RW Gold — Human Review Sample (20)', '', `Generated: ${out.generatedAt}`, ''];
for (const sc of scenarios) {
  md.push(`## ${sc.slot} — ${sc.id} (\`${sc.familyKey}\`)`);
  md.push('');
  md.push(`Difficulty: ${sc.difficulty} · ${sc.attackOrDefence} · perception=${sc.perception}`);
  md.push('');
  md.push('### HR');
  md.push(`**${sc.hr.title}**`);
  md.push('');
  md.push(sc.hr.situation);
  md.push('');
  md.push(`**Pitanje:** ${sc.hr.question}`);
  md.push('');
  for (const a of sc.hr.answers) {
    md.push(`- **${a.quality}:** ${a.text}`);
  }
  md.push('');
  md.push(`*Objašnjenje:* ${sc.hr.explanation}`);
  md.push('');
  md.push('### EN');
  md.push(`**${sc.en.title}**`);
  md.push('');
  md.push(sc.en.situation);
  md.push('');
  md.push(`**Q:** ${sc.en.question}`);
  md.push('');
  for (const a of sc.en.answers) md.push(`- **${a.quality}:** ${a.text}`);
  md.push('');
  md.push('### DE');
  md.push(`**${sc.de.title}**`);
  md.push('');
  md.push(sc.de.situation);
  md.push('');
  md.push(`**Q:** ${sc.de.question}`);
  md.push('');
  for (const a of sc.de.answers) md.push(`- **${a.quality}:** ${a.text}`);
  md.push('');
  md.push('---');
  md.push('');
}
writeFileSync(join(root, 'scripts/rw-gold-human-review-20.md'), md.join('\n'));
console.log(JSON.stringify({ count: scenarios.length, slots: scenarios.map((s) => s.slot + ' → ' + s.id) }, null, 2));
