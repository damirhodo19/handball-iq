/** Shared helpers for Right Wing gold bank content. */

export function L(en, hr, de) {
  return { en, hr, de };
}

export function answer(quality, en, hr, de, fen, fhr, fde) {
  return {
    quality,
    text: L(en, hr, de),
    feedback: L(fen, fhr, fde),
  };
}

export function scenario(spec) {
  const {
    familyKey,
    title,
    difficulty,
    pressureLevel = 'Moderate',
    attackOrDefence = 'Attack',
    matchPhase = 'Open Play',
    minute,
    score,
    defensiveSystem = '6-0',
    skillTags = [],
    perception = false,
    handedness = 'none',
    numerical = '6v6',
    gameState = 'none',
    primaryTacticalCue,
    situation,
    question,
    answers,
    explanation,
    whyCorrectOverSecondBest,
    pilotId = null,
    rubricBias = 0,
  } = spec;

  if (!answers || answers.length !== 4) throw new Error(`${familyKey}: need 4 answers`);
  if (answers.map((a) => a.quality).join(',') !== 'optimal,good,risky,poor') {
    throw new Error(`${familyKey}: answer qualities must be optimal,good,risky,poor`);
  }
  for (const lang of ['en', 'hr', 'de']) {
    if (!situation?.[lang] || !question?.[lang] || !explanation?.[lang] || !whyCorrectOverSecondBest?.[lang]) {
      throw new Error(`${familyKey}: missing ${lang} core`);
    }
  }

  return {
    familyKey,
    pilotId,
    title,
    difficulty,
    pressureLevel,
    attackOrDefence,
    matchPhase,
    minute,
    score,
    defensiveSystem,
    skillTags,
    perception,
    handedness,
    numerical,
    gameState,
    primaryTacticalCue,
    situation,
    question,
    answers,
    explanation,
    whyCorrectOverSecondBest,
    rubricBias,
  };
}
