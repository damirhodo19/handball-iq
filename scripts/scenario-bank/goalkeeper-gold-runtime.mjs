export function goalkeeperGoldRuntimeId(index) {
  return `scn_bank_${1061 + index}`;
}

export function toGoalkeeperGoldRuntimeScenario(source, index) {
  const skillTags = [
    ...(source.skillTags || []),
    ...(source.perception && !(source.skillTags || []).includes('perception') ? ['perception'] : []),
    ...(source.numerical && source.numerical !== '6v6' ? [`numerical:${source.numerical}`] : []),
    `family:${source.familyKey}`,
    `teachingArea:${source.teachingArea}`,
    'source:goalkeeper-gold-75',
  ];

  return {
    id: goalkeeperGoldRuntimeId(index),
    title: source.title,
    category: 'Goalkeeper',
    primaryPosition: 'Goalkeeper',
    secondaryPositions: [],
    difficulty: source.difficulty,
    pressureLevel: source.pressureLevel,
    attackOrDefence: source.attackOrDefence,
    matchPhase: source.matchPhase,
    minute: source.minute,
    score: source.score,
    ...(source.defensiveSystem ? { defensiveSystem: source.defensiveSystem } : {}),
    situation: source.situation,
    question: source.question,
    answers: source.answers,
    explanation: source.explanation,
    whyCorrectOverSecondBest: source.whyCorrectOverSecondBest,
    skillTags,
    qualityScore: 8.8,
  };
}
