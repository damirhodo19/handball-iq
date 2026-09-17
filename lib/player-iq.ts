export const PLAYER_IQ_MIN_ANSWERS = 5;

/** Training accuracy, not a psychometric IQ. Every valid answer has equal weight.
 * Stored metric labels are assigned by sequence, so cannot support skill scores.
 */
export function calculatePlayerIq(sessions: readonly { metrics?: unknown }[]) {
  let sampleCount = 0;
  let correctCount = 0;
  for (const session of sessions) {
    if (!Array.isArray(session.metrics)) continue;
    for (const answer of session.metrics) {
      if (!answer || typeof answer.correct !== 'boolean') continue;
      sampleCount++;
      if (answer.correct) correctCount++;
    }
  }
  return {
    sampleCount,
    correctCount,
    overall: sampleCount >= PLAYER_IQ_MIN_ANSWERS
      ? Math.round(100 * correctCount / sampleCount)
      : null,
  };
}
