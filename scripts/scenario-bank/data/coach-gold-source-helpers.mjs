import { COACH_GOLD_FAMILIES } from './coach-gold-taxonomy.mjs';

export const L = (en, hr, de) => ({ en, hr, de });
const answer = (quality, text, feedback) => ({ quality, text, feedback });
export const O = (en, hr, de, feedbackEn, feedbackHr, feedbackDe) => answer('optimal', L(en, hr, de), L(feedbackEn, feedbackHr, feedbackDe));
export const G = (en, hr, de, feedbackEn, feedbackHr, feedbackDe) => answer('good', L(en, hr, de), L(feedbackEn, feedbackHr, feedbackDe));
export const R = (en, hr, de, feedbackEn, feedbackHr, feedbackDe) => answer('risky', L(en, hr, de), L(feedbackEn, feedbackHr, feedbackDe));
export const P = (en, hr, de, feedbackEn, feedbackHr, feedbackDe) => answer('poor', L(en, hr, de), L(feedbackEn, feedbackHr, feedbackDe));

export function defineCoachGoldScenario(input) {
  const family = COACH_GOLD_FAMILIES.find(({ familyKey }) => familyKey === input.familyKey);
  if (!family) throw new Error(`Unknown Coach Gold family: ${input.familyKey}`);
  if (input.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') {
    throw new Error(`${input.familyKey}: answer ladder must be optimal,good,risky,poor`);
  }
  return Object.freeze({
    id: family.id,
    familyKey: family.familyKey,
    category: family.category,
    difficulty: family.difficulty,
    coachTypeTags: family.coachTypeTags,
    experienceTags: family.experienceTags,
    situation: input.situation,
    question: input.question,
    answers: input.answers.map((item, index) => ({ ...item, id: String.fromCharCode(97 + index) })),
    explanation: input.explanation,
  });
}
