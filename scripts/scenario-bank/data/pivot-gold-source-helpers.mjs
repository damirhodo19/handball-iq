export const L = (en, hr, de) => ({ en, hr, de });
export const answer = (quality, text, feedback) => ({ quality, text, feedback });
export const ladder = (optimal, good, risky, poor) => [
  answer('optimal', optimal[0], optimal[1]),
  answer('good', good[0], good[1]),
  answer('risky', risky[0], risky[1]),
  answer('poor', poor[0], poor[1]),
];
