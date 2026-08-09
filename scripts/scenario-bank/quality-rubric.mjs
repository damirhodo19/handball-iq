/**
 * Elite Handball IQ content quality rubric.
 * Used by audits and archetype authoring — not a length checklist.
 */

/** Patterns that mark trivia / absurd distractors (not plausible handball actions). */
export const ABSURD_ANSWER_PATTERNS = [
  /^always\b/i,
  /^never\b/i,
  /\bstop playing\b/i,
  /\brun away\b/i,
  /\bjog back to conserve\b/i,
  /\bargue with the referee\b/i,
  /\bcomplain to the referee\b/i,
  /\bdrop the ball\b/i,
  /\bstand behind the goalkeeper\b/i,
  /\bshoot from your own half\b/i,
  /\bpass to the goalkeeper\b/i,
  /\bavoid shooting for the rest\b/i,
  /\bignore the wing\b/i,
  /\bignore (defence|defense|teammates|the game)\b/i,
];

/** Questions that do not force a read of the situation. */
export const WEAK_QUESTION_PATTERNS = [
  /^what is your best (attacking |finishing |defensive )?decision\??$/i,
  /^what is the best decision in this situation\??$/i,
  /^what is the best mental and tactical approach\??$/i,
  /^what is your primary focus\??$/i,
];

/** Situation must include enough tactical signal for a real decision. */
export const CONTEXT_SIGNALS = [
  /\b\d+['′]/, // minute
  /\bscore\b|\d+[–\-]\d+/i,
  /\b6:0\b|\b5:1\b|\b3:2:1\b|\b6-0\b|\b5-1\b|\bdefence\b|\bdefense\b/i,
  /\bpivot\b|\bwing\b|\bback\b|\bgoalkeeper\b|\bkeeper\b/i,
  /\bstep(?:s|ping)?\b|\bpress(?:es|ing)?\b|\bswitch(?:es|ing)?\b|\bseal(?:s|ed)?\b|\bspace\b|\bgap\b|\bnarrow\b|\bopen\b/i,
  /\bfast break\b|\btransition\b|\bpower play\b|\b6-on-5\b|\b7v6\b|\bexclusion\b|\bpassive\b/i,
];

export const DIFFICULTY_EXPECTATIONS = {
  Beginner: {
    minSignals: 2,
    maxSignals: 4,
    note: 'One clear principle; few variables; basic position decision.',
  },
  Intermediate: {
    minSignals: 3,
    maxSignals: 5,
    note: '2–3 tactical signals; multiple plausible options; timing matters.',
  },
  Advanced: {
    minSignals: 4,
    maxSignals: 7,
    note: 'Defensive reactions + score/time; second-order read; risk/reward.',
  },
  Expert: {
    minSignals: 4,
    maxSignals: 8,
    note: 'Incomplete info, deception, opponent adaptation, anticipation.',
  },
};

export function countContextSignals(situationEn) {
  return CONTEXT_SIGNALS.filter((re) => re.test(situationEn || '')).length;
}

export function findAbsurdAnswers(answers) {
  const hits = [];
  for (const a of answers || []) {
    const text = a.textEn || a.text?.en || '';
    for (const re of ABSURD_ANSWER_PATTERNS) {
      if (re.test(text)) {
        hits.push({ text, pattern: String(re) });
        break;
      }
    }
  }
  return hits;
}

export function isWeakQuestion(questionEn) {
  return WEAK_QUESTION_PATTERNS.some((re) => re.test((questionEn || '').trim()));
}

/**
 * Score decision depth 0–10 for EN scenario/archetype fields.
 * Structural completeness alone cannot reach 9+.
 */
export function scoreDecisionDepth({ situationEn, questionEn, answers, difficulty }) {
  let score = 4;
  const sit = situationEn || '';
  const q = questionEn || '';
  const ans = answers || [];

  const signals = countContextSignals(sit);
  score += Math.min(3, signals);

  if (sit.length >= 120) score += 1;
  if (sit.length >= 180) score += 0.5;
  if (sit.length < 60) score -= 2;

  if (!isWeakQuestion(q) && q.includes('?')) score += 1;
  if (isWeakQuestion(q)) score -= 2;
  if (/\bread\b|\bfirst\b|\btiming\b|\bexploit\b|\bwhen\b|\bwhere\b|\bhow do you\b/i.test(q)) {
    score += 0.5;
  }

  const absurd = findAbsurdAnswers(ans);
  score -= absurd.length * 1.5;

  const texts = ans.map((a) => a.textEn || a.text?.en || '');
  const avgLen = texts.reduce((n, t) => n + t.length, 0) / Math.max(texts.length, 1);
  if (avgLen >= 40) score += 1;
  if (avgLen < 25) score -= 1;
  if (texts.every((t) => t.length >= 28)) score += 0.5;

  // Plausible distractors: non-optimal answers should not be tiny jokes
  const nonOpt = ans.filter((a) => (a.quality || '') !== 'optimal');
  if (nonOpt.every((a) => ((a.textEn || a.text?.en || '').length) >= 30)) score += 1;

  const expected = DIFFICULTY_EXPECTATIONS[difficulty];
  if (expected) {
    if (signals < expected.minSignals) score -= 1;
    if (signals > expected.maxSignals + 2) score -= 0.5; // overloaded
  }

  // Feedback must agree with quality tier
  for (const a of ans) {
    const fb = a.feedbackEn || a.feedback?.en || '';
    const qlt = a.quality;
    if (qlt === 'optimal' && /^risky|^poor/i.test(fb)) score -= 1;
    if (qlt === 'poor' && /^correct|^good/i.test(fb)) score -= 1;
    if (qlt === 'good' && /^risky|^poor/i.test(fb)) score -= 0.5;
    if (qlt === 'risky' && /^correct|^good/i.test(fb)) score -= 0.5;
  }

  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

export function auditArchetype(archetype) {
  const issues = [];
  const depth = scoreDecisionDepth({
    situationEn: archetype.situationEn,
    questionEn: archetype.questionEn,
    answers: archetype.answers,
    difficulty: archetype.difficulty,
  });

  if (depth < 6.5) issues.push(`shallow_depth:${depth}`);
  if (isWeakQuestion(archetype.questionEn)) issues.push('weak_question');
  const absurd = findAbsurdAnswers(archetype.answers);
  for (const h of absurd) issues.push(`absurd_answer:${h.text.slice(0, 40)}`);

  if (
    /vs 6-0|against 6-0/i.test(archetype.titleEn) &&
    /\{defensiveSystem\}/.test(archetype.situationEn)
  ) {
    issues.push('title_defence_slot_clash');
  }

  const optimal = archetype.answers.filter((a) => a.quality === 'optimal');
  if (optimal.length !== 1) issues.push(`optimal_count:${optimal.length}`);

  return { depth, issues, pass: issues.length === 0 && depth >= 6.5 };
}
