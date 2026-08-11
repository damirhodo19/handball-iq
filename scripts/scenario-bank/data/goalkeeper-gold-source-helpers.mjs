export const L = (en, hr, de) => ({ en, hr, de });

export const ladder = (optimal, good, risky, poor) => [
  { text: optimal[0], quality: 'optimal', feedback: optimal[1] },
  { text: good[0], quality: 'good', feedback: good[1] },
  { text: risky[0], quality: 'risky', feedback: risky[1] },
  { text: poor[0], quality: 'poor', feedback: poor[1] },
];
