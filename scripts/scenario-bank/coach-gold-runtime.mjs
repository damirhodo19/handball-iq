export function toCoachGoldRuntimeChallenge(source) {
  return {
    id: source.id,
    familyKey: source.familyKey,
    category: source.category,
    difficulty: source.difficulty,
    coachTypeTags: source.coachTypeTags,
    experienceTags: source.experienceTags,
    situation: source.situation,
    question: source.question,
    answers: source.answers,
    explanation: source.explanation,
  };
}
