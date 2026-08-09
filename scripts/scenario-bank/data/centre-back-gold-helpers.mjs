/** Shared helpers for Centre Back gold families. */

/** @typedef {{ en: string, hr: string, de: string }} L10n */
/** @typedef {'optimal'|'good'|'risky'|'poor'} Quality */

export function L(en, hr, de) {
  return { en, hr, de };
}

export function ans(rows) {
  return rows.map(([quality, en, hr, de, fbEn, fbHr, fbDe]) => ({
    quality,
    text: L(en, hr, de),
    feedback: L(fbEn, fbHr, fbDe),
  }));
}

/**
 * @param {object} p
 * @returns {object}
 */
export function fam(p) {
  return {
    familyKey: p.familyKey,
    title: p.title,
    difficulty: p.difficulty,
    pressureLevel: p.pressureLevel ?? 'Moderate',
    attackOrDefence: p.attackOrDefence ?? 'Attack',
    matchPhase: p.matchPhase ?? 'Open Play',
    minute: p.minute,
    score: p.score,
    ...(p.defensiveSystem ? { defensiveSystem: p.defensiveSystem } : {}),
    skillTags: p.skillTags ?? ['decisionMaking', 'defensiveReading'],
    perception: !!p.perception,
    numerical: p.numerical ?? '6v6',
    gameState: p.gameState ?? 'none',
    situation: p.situation,
    question: p.question,
    answers: p.answers,
    explanation: p.explanation,
    whyCorrectOverSecondBest: p.whyCorrectOverSecondBest,
    human: {
      singleBestOk: true,
      cueSpecific: true,
      gameStateExplicit: p.gameStateExplicit !== false,
      rubricBias: p.rubricBias ?? 0,
    },
  };
}
