/**
 * Handball IQ Quality Rubric 2.0 — human-relevant criteria.
 * Structural depth alone cannot yield 9–10.
 */

export const RUBRIC_V2_VERSION = '2.0.0';

/** @typedef {{ tacticalRealism: number, singleBestIntegrity: number, cueQuality: number, distractorPlausibility: number, educationalValue: number, croatianNaturalness: number, positionRelevance: number, gameStateClarity: number }} RubricV2Dims */

const clamp = (n) => Math.max(1, Math.min(10, Math.round(n * 10) / 10));

const BAD_HR = [
  /tuljan/i,
  /brtv/i,
  /\bosovin/i,
  /novinar/i,
  /\btisak\b/i,
  /centaršut/i,
  /\bfeed\b/i,
  /power-?play/i,
  /\bkeeper\b/i,
  /\brelease\b/i,
  /pokojni branič/i,
  /zaprljan/i,
  /zujalic/i,
  /krivotvor/i,
  /Hvatate\b/,
  /Primate\b/,
  /morate\b/,
  /Odmaknite\b/,
  /Pročitajte\b/,
  /Napadnite\b/,
  /Držite\b/,
];

const VI_FORM = /\b(vi ste|imate|primite|morate|pročitajte|napadnite|držite|odmaknite|zamahnite)\b/i;
const TI_FORM = /\b(primaš|imaš|čitaš|napadaš|držiš|što prvo|kada |kako )\b/i;

/**
 * Score one scenario with Rubric 2.0.
 * @param {object} s Bank scenario (en + hr fields)
 * @param {{ singleBestOk?: boolean, gameStateExplicit?: boolean, cueSpecific?: boolean }} human
 */
export function scoreRubricV2(s, human = {}) {
  const sitHr = s.situation?.hr || '';
  const qHr = s.question?.hr || '';
  const expHr = s.explanation?.hr || '';
  const answers = s.answers || [];
  const allHr = [sitHr, qHr, expHr, ...answers.map((a) => `${a.text?.hr || ''} ${a.feedback?.hr || ''}`)].join('\n');

  let croatianNaturalness = 9;
  for (const re of BAD_HR) {
    if (re.test(allHr)) croatianNaturalness -= 1.5;
  }
  if (VI_FORM.test(allHr) && TI_FORM.test(allHr)) croatianNaturalness -= 2;
  if (VI_FORM.test(allHr) && !TI_FORM.test(allHr)) croatianNaturalness -= 1.5;
  if (/[A-Za-z]{4,}/.test(sitHr) && /\b(feed|release|keeper|power)\b/i.test(sitHr)) croatianNaturalness -= 1;
  croatianNaturalness = clamp(croatianNaturalness);

  let singleBestIntegrity = human.singleBestOk === false ? 4 : human.singleBestOk === true ? 9 : 7;
  // Heuristic: optimal and good answer texts too similar in EN → penalty
  const opt = answers.find((a) => a.quality === 'optimal');
  const good = answers.find((a) => a.quality === 'good');
  if (opt && good) {
    const o = (opt.text?.en || '').toLowerCase();
    const g = (good.text?.en || '').toLowerCase();
    const shared = o.split(/\s+/).filter((w) => w.length > 4 && g.includes(w)).length;
    if (shared >= 6) singleBestIntegrity = Math.min(singleBestIntegrity, 5);
  }
  singleBestIntegrity = clamp(singleBestIntegrity);

  let cueQuality = human.cueSpecific === false ? 4 : human.cueSpecific === true ? 9 : 7;
  const sitEn = s.situation?.en || '';
  if (
    /half-step late|still turning|help is late|already covered|shading|rotating late|leading|trailing|seconds left|passive/i.test(
      sitEn,
    )
  ) {
    cueQuality = Math.max(cueQuality, 8);
  }
  if ((sitEn.match(/\./g) || []).length < 2) cueQuality -= 1;
  cueQuality = clamp(cueQuality);

  let distractorPlausibility = 8;
  for (const a of answers) {
    const t = a.text?.en || '';
    if (/^always\b|^never\b|refuse to shoot|stop playing|run away|argue with/i.test(t)) {
      distractorPlausibility -= 2;
    }
    if ((a.quality === 'poor' || a.quality === 'risky') && t.length < 28) distractorPlausibility -= 1;
  }
  distractorPlausibility = clamp(distractorPlausibility);

  let tacticalRealism = 8;
  if (!/\d+['′]|min|score|–|-/.test(sitEn)) tacticalRealism -= 1;
  if (
    !/6:0|5:1|3:2:1|3:3|4:2|5\+1|4\+2|1:5|6-on-5|5-on-6|7v6|fast break|polukontra|pivot|wing|defence|defense|passive/i.test(
      sitEn,
    )
  ) {
    tacticalRealism -= 1;
  }
  if (croatianNaturalness < 6) tacticalRealism -= 1;
  tacticalRealism = clamp(tacticalRealism);

  let educationalValue = 7;
  if (/jer |zato|dok |prije |nakon |ako /i.test(expHr) || /because|before|after|if |while /i.test(s.explanation?.en || '')) {
    educationalValue += 1;
  }
  if ((expHr || s.explanation?.en || '').length > 120) educationalValue += 1;
  if ((expHr || '').length < 40) educationalValue -= 2;
  educationalValue = clamp(educationalValue);

  let positionRelevance = 6;
  if (
    s.primaryPosition === 'Left Back' ||
    s.category === 'Left Back' ||
    s.primaryPosition === 'Right Back' ||
    s.category === 'Right Back' ||
    s.primaryPosition === 'Centre Back' ||
    s.category === 'Centre Back' ||
    s.primaryPosition === 'Right Wing' ||
    s.category === 'Right Wing'
  ) {
    positionRelevance = 9;
  }
  if (
    s.primaryPosition === 'All' &&
    ((s.secondaryPositions || []).includes('Left Back') ||
      (s.secondaryPositions || []).includes('Right Back'))
  ) {
    positionRelevance = 7;
  }
  positionRelevance = clamp(positionRelevance);

  let gameStateClarity = human.gameStateExplicit === true ? 9 : human.gameStateExplicit === false ? 4 : 7;
  if (s.matchPhase === 'Final Minutes' || /final|seconds|leading|trailing|gubiš|vodiš|Vodite|Gubite|pasivn/i.test(sitEn + sitHr)) {
    if (
      !/leading|trailing|gubiš|vodiš|Vodite|Gubite|Neriješeno|ahead|behind|pobjedi|porazu|\d+[:–-]\d+/i.test(
        sitEn + sitHr,
      )
    ) {
      gameStateClarity = Math.min(gameStateClarity, 5);
    } else {
      gameStateClarity = Math.max(gameStateClarity, 8);
    }
  }
  gameStateClarity = clamp(gameStateClarity);

  /** @type {RubricV2Dims} */
  const dims = {
    tacticalRealism,
    singleBestIntegrity,
    cueQuality,
    distractorPlausibility,
    educationalValue,
    croatianNaturalness,
    positionRelevance,
    gameStateClarity,
  };

  const avg =
    Object.values(dims).reduce((a, b) => a + b, 0) / Object.keys(dims).length;

  // Hard caps: cannot be 9+ if Croatian fails or single-best fails
  let overall = clamp(avg);
  if (croatianNaturalness < 7) overall = Math.min(overall, 6.5);
  if (singleBestIntegrity < 7) overall = Math.min(overall, 7);
  if (croatianNaturalness < 5 || singleBestIntegrity < 5) overall = Math.min(overall, 5);

  return {
    version: RUBRIC_V2_VERSION,
    dims,
    overall,
    passGold: overall >= 8.5 && croatianNaturalness >= 8 && singleBestIntegrity >= 8,
  };
}
