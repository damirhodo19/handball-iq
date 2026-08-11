export function pivotGoldRuntimeId(index) {
  return `scn_bank_${1001 + index}`;
}

export function toPivotGoldRuntimeScenario(source, index) {
  const skillTags = [
    ...(source.skillTags || []),
    ...(source.perception && !(source.skillTags || []).includes('perception') ? ['perception'] : []),
    ...(source.numerical && source.numerical !== '6v6' ? [`numerical:${source.numerical}`] : []),
    `family:${source.familyKey}`,
    `teachingArea:${source.teachingArea}`,
    'source:pivot-gold-60',
  ];

  return {
    id: pivotGoldRuntimeId(index),
    title: source.title,
    category: 'Pivot',
    primaryPosition: 'Pivot',
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
