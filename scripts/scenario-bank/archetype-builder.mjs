/** Archetype definition helpers and shared variation slots. */

/** Decision-relevant slot sets — keep small so clones are not fake depth. */
export const COMMON_SLOTS = {
  minute: [9, 28, 51],
  score: ['14–13', '22–21', '28–27'],
  opponent: ['Hamburg', 'Zagreb', 'Kiel'],
  handedness: ['left-handed', 'right-handed'],
  wingSide: ['left', 'right'],
  defensiveSystem: ['6:0', '5:1', '3:2:1'],
};

/**
 * @param {object} cfg
 * @returns {import('./types.mjs').Archetype}
 */
export function defineArchetype(cfg) {
  const answers = cfg.answers.map(([textEn, quality, feedbackEn]) => ({
    textEn,
    quality,
    feedbackEn,
  }));
  if (answers.length !== 4) throw new Error(`Archetype "${cfg.titleEn}" needs exactly 4 answers`);
  if (answers.filter((a) => a.quality === 'optimal').length !== 1) {
    throw new Error(`Archetype "${cfg.titleEn}" needs exactly one optimal answer`);
  }
  return {
    category: cfg.category,
    primaryPosition: cfg.primaryPosition,
    secondaryPositions: cfg.secondaryPositions ?? [],
    difficulty: cfg.difficulty ?? 'Intermediate',
    pressureLevel: cfg.pressureLevel ?? 'Moderate',
    attackOrDefence: cfg.attackOrDefence ?? 'Defence',
    matchPhase: cfg.matchPhase ?? 'Open Play',
    titleEn: cfg.titleEn,
    situationEn: cfg.situationEn,
    questionEn: cfg.questionEn ?? 'What is the best decision in this situation?',
    explanationEn: cfg.explanationEn,
    answers,
    variationSlots: cfg.variationSlots ?? {},
    defensiveSystem: cfg.defensiveSystem,
  };
}

/**
 * Build four answers. Feedback strings should start with Correct/Good/Risky/Poor
 * matching the quality tier. Prefer plausible handball actions in every slot.
 */
export function answer(optimal, good, risky, poor) {
  const rows = [
    [optimal[0], 'optimal', optimal[1]],
    [good[0], 'good', good[1]],
    [risky[0], 'risky', risky[1]],
    [poor[0], 'poor', poor[1]],
  ];
  const expect = { optimal: /^correct/i, good: /^good/i, risky: /^risky/i, poor: /^poor/i };
  for (const [text, quality, feedback] of rows) {
    if (!text || text.length < 24) {
      throw new Error(`Answer too short (${quality}): "${text}"`);
    }
    if (/^always\b|^never\b/i.test(text)) {
      throw new Error(`Absurd distractor banned (${quality}): "${text}"`);
    }
    if (feedback && !expect[quality].test(feedback)) {
      throw new Error(`Feedback mismatch for ${quality}: "${feedback}"`);
    }
  }
  return rows;
}
