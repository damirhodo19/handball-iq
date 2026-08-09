export interface MatchDecision {
  id: string;
  text: string;
  quality: 'optimal' | 'good' | 'risky' | 'poor';
  feedback: string;
  text_hr?: string;
  text_de?: string;
  feedback_hr?: string;
  feedback_de?: string;
}

export interface MatchSituation {
  index: number;
  minute: number;
  second: number;
  scoreTeam: number;
  scoreOpp: number;
  pressure: 'Low' | 'Moderate' | 'High' | 'Critical';
  formation: string;
  description: string;
  description_hr?: string;
  description_de?: string;
  scenarioType: string;
  scenarioType_hr?: string;
  scenarioType_de?: string;
  decisions: MatchDecision[];
  correctDecisionId: string;
}

export interface MatchAnswer {
  situationIndex: number;
  chosenDecisionId: string;
  correctDecisionId: string;
  isCorrect: boolean;
  quality: 'optimal' | 'good' | 'risky' | 'poor';
  minute: number;
  scenarioType: string;
  feedback: string;
}

export interface MatchConfig {
  opponent: string;
  competition: string;
  difficulty: string;
  duration: string;
  description: string;
  situationCount: number;
}

export type Momentum = 'Your Team' | 'Opponent' | 'Balanced';
export type Confidence = 'Low' | 'Medium' | 'High';

export interface MatchReport {
  matchRating: number;
  decisionScore: number;
  pressureControl: number;
  readingAbility: number;
  consistency: number;
  mentalFocus: number;
  momentum: Momentum;
  confidence: Confidence;
  decisionAccuracy: number;
  optimalCount: number;
  goodCount: number;
  riskyCount: number;
  poorCount: number;
}

export interface MatchRecord {
  id: string;
  date: string;
  opponent: string;
  competition: string;
  matchRating: number;
  decisionScore: number;
  pressureControl: number;
  readingAbility: number;
  consistency: number;
  summary: string;
  answers: MatchAnswer[];
  situations: MatchSituation[];
}

export const MATCH_CONFIG: MatchConfig = {
  opponent: 'Opponent',
  competition: 'League Match',
  difficulty: 'Intermediate',
  duration: '10–15 minutes',
  description: 'Experience a complete mental match simulation. Every decision influences your final performance report.',
  situationCount: 15,
};

const FORMATIONS = [
  '3-2-1 attacking formation',
  '2-4 attacking with line player',
  '7 vs 6 empty-court attack',
  'Standard 6-0 defence',
  '5-1 aggressive defence',
  '3-2-1 defence shifting',
];

interface ScenarioTemplate {
  type: string;
  description: string;
  pressure: 'Low' | 'Moderate' | 'High' | 'Critical';
  decisions: MatchDecision[];
}

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    type: 'Wing Shot',
    description: 'The left wing receives a quick pass on the edge. They have a narrow angle but are one-on-one with you. The shot could go short or cross-court.',
    pressure: 'Moderate',
    decisions: [
      { id: 'a', text: 'Stay centred, react to the shooter\'s shoulder', quality: 'optimal', feedback: 'Correct — at a narrow angle, staying centred gives you the best chance to react to the shot direction.' },
      { id: 'b', text: 'Step forward to cut the angle', quality: 'good', feedback: 'Reasonable — stepping out narrows the angle but commits you early against a quick release.' },
      { id: 'c', text: 'Shift toward the short corner', quality: 'risky', feedback: 'Risky — anticipating the short corner opens the cross-court shot if the wing reads your movement.' },
      { id: 'd', text: 'Drop deep on the goal line', quality: 'poor', feedback: 'Poor — dropping deep gives the wing too much goal to aim at from a narrow position.' },
    ],
  },
  {
    type: 'Fast Break',
    description: 'The opposition wins the ball and launches a 2-on-1 fast break. The left back has the ball and your lone defender is trailing. A pass to the right wing is open.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Hold position, watch the ball carrier\'s eyes', quality: 'optimal', feedback: 'Correct — reading the passer\'s eyes lets you react to the pass rather than guessing early.' },
      { id: 'b', text: 'Commit to the ball carrier', quality: 'risky', feedback: 'Risky — committing to the carrier opens an easy pass to the wing for an open shot.' },
      { id: 'c', text: 'Position between both attackers', quality: 'good', feedback: 'Good — splitting the difference delays the decision but may not fully cover either option.' },
      { id: 'd', text: 'Retreat to the goal line', quality: 'poor', feedback: 'Poor — retreating gives both attackers a clear shooting lane.' },
    ],
  },
  {
    type: '7m Throw',
    description: 'A 7m throw is awarded. The shooter is their top scorer, right-handed, and tends to go high-left. The arena goes quiet.',
    pressure: 'Critical',
    decisions: [
      { id: 'a', text: 'Move slightly right, delay your dive', quality: 'optimal', feedback: 'Correct — shading their tendency while delaying gives you a read on the shot direction.' },
      { id: 'b', text: 'Dive hard to the left side', quality: 'risky', feedback: 'Risky — committing to the tendency early lets the shooter adjust and go the other way.' },
      { id: 'c', text: 'Stay centred and react', quality: 'good', feedback: 'Good — staying centred is safe but gives up the corners against a placed shot.' },
      { id: 'd', text: 'Step off the line to distract', quality: 'poor', feedback: 'Poor — stepping off the line is illegal and gives the shooter an open goal.' },
    ],
  },
  {
    type: 'Pivot Shot',
    description: 'The pivot receives the ball at the 6m line with their back to goal. They spin and prepare to shoot. Your defender is behind them.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Close the gap, block the low zone', quality: 'optimal', feedback: 'Correct — pivots often shoot low on the spin; closing the gap cuts off the most likely angle.' },
      { id: 'b', text: 'Stay on the line and react', quality: 'good', feedback: 'Good — reacting is safe but the pivot has a short distance and little time to read the shot.' },
      { id: 'c', text: 'Anticipate the cross-court finish', quality: 'risky', feedback: 'Risky — guessing the direction before the spin is complete can leave you flat-footed.' },
      { id: 'd', text: 'Call your defender to block', quality: 'poor', feedback: 'Poor — the defender is behind the pivot and cannot get a block in time.' },
    ],
  },
  {
    type: 'Backcourt Jump Shot',
    description: 'The right back receives the ball at 9m and launches a jump shot. They have a clear lane and tend to shoot to the far corner.',
    pressure: 'Moderate',
    decisions: [
      { id: 'a', text: 'Shift slightly to the far post, watch the release', quality: 'optimal', feedback: 'Correct — shading the tendency while tracking the release gives you the best read.' },
      { id: 'b', text: 'Hold centre and react to the ball', quality: 'good', feedback: 'Good — pure reaction is reliable but may be too slow against a powerful jump shot.' },
      { id: 'c', text: 'Step out to narrow the angle', quality: 'risky', feedback: 'Risky — stepping out against a jump shot opens the lob or the near post.' },
      { id: 'd', text: 'Guess the far corner early', quality: 'poor', feedback: 'Poor — guessing early lets the shooter adjust to the open side.' },
    ],
  },
  {
    type: '7 vs 6 Attack',
    description: 'The opposition plays 7 vs 6 with an empty court. The extra player creates an overload on the left side. The ball moves quickly around the perimeter.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Track the ball, communicate the overload', quality: 'optimal', feedback: 'Correct — tracking the ball while calling out the overload keeps your defence organised.' },
      { id: 'b', text: 'Shift to cover the overload side', quality: 'good', feedback: 'Good — covering the overload is logical but can open the weak side for a skip pass.' },
      { id: 'c', text: 'Stay centred and wait', quality: 'risky', feedback: 'Risky — waiting against an overload gives the attack time to find the gap.' },
      { id: 'd', text: 'Abandon the goal to press', quality: 'poor', feedback: 'Poor — leaving the goal open against a 7 vs 6 is an easy goal for the attack.' },
    ],
  },
  {
    type: 'Last Attack Before Halftime',
    description: '30 seconds remain in the first half. The score is level. The opposition holds for a final shot. The back court moves the ball patiently.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Stay patient, read the shooter\'s body', quality: 'optimal', feedback: 'Correct — patience lets you read the final shot rather than committing early against a deliberate setup.' },
      { id: 'b', text: 'Anticipate a quick release', quality: 'risky', feedback: 'Risky — they are holding for the last shot; anticipating a quick release misreads the situation.' },
      { id: 'c', text: 'Step out to pressure the ball', quality: 'good', feedback: 'Good — pressuring can rush the shot but opens the goal if they drive past you.' },
      { id: 'd', text: 'Drop deep and wait', quality: 'poor', feedback: 'Poor — dropping deep gives the shooter the entire upper goal.' },
    ],
  },
  {
    type: 'Final Minute Under Pressure',
    description: '59:30 on the clock. Your team leads by one. The opposition needs a goal. They set up a 7 vs 6 attack, desperate to score.',
    pressure: 'Critical',
    decisions: [
      { id: 'a', text: 'Hold position, communicate with defence', quality: 'optimal', feedback: 'Correct — in the final minute, holding position and organising your defence is the safest path to preserving the lead.' },
      { id: 'b', text: 'Step out to intercept the extra player', quality: 'risky', feedback: 'Risky — stepping out against a 7 vs 6 opens the goal for a quick pass and finish.' },
      { id: 'c', text: 'Stay on the line and react', quality: 'good', feedback: 'Good — reacting is safe but the overload may find a gap before you can respond.' },
      { id: 'd', text: 'Rush the ball carrier', quality: 'poor', feedback: 'Poor — rushing out leaves an empty goal in the most critical moment of the match.' },
    ],
  },
  {
    type: 'Crossing Movement',
    description: 'The left back and centre back cross near the 9m line. The ball could go to either player. The crossing creates confusion in the defence.',
    pressure: 'Moderate',
    decisions: [
      { id: 'a', text: 'Track the ball through the crossing', quality: 'optimal', feedback: 'Correct — following the ball through the crossing lets you stay aligned with the actual shooter.' },
      { id: 'b', text: 'Follow the initial ball carrier', quality: 'risky', feedback: 'Risky — following the initial carrier loses track of the receiver after the crossing.' },
      { id: 'c', text: 'Hold centre and wait for the shot', quality: 'good', feedback: 'Good — holding centre is safe but may give the shooter a clean angle.' },
      { id: 'd', text: 'Shift to the crossing side early', quality: 'poor', feedback: 'Poor — committing to one side before the crossing completes opens the other.' },
    ],
  },
  {
    type: 'Breakaway',
    description: 'A long pass sends the right wing alone toward your goal. Your defenders are 10m behind. It is a pure 1-on-1 with the wing approaching at speed.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Advance slightly, then set and react', quality: 'optimal', feedback: 'Correct — a small advance narrows the angle, then setting lets you read the shot.' },
      { id: 'b', text: 'Charge out to meet the wing', quality: 'risky', feedback: 'Risky — charging out at speed gives the wing an easy lob or a sidestep around you.' },
      { id: 'c', text: 'Stay on the line and wait', quality: 'good', feedback: 'Good — waiting is safe but gives the wing the full goal to aim at.' },
      { id: 'd', text: 'Guess the near post early', quality: 'poor', feedback: 'Poor — guessing the near post opens the far corner against a fast approach.' },
    ],
  },
  {
    type: 'Counter-Attack Read',
    description: 'Your team loses the ball in attack. The opposition transitions instantly. The centre back drives forward with two options left and right.',
    pressure: 'High',
    decisions: [
      { id: 'a', text: 'Retrace quickly, watch the ball handler', quality: 'optimal', feedback: 'Correct — quick retraction while watching the ball lets you adjust to the final pass.' },
      { id: 'b', text: 'Sprint to the goal and set', quality: 'good', feedback: 'Good — getting set early is safe but may not account for the developing options.' },
      { id: 'c', text: 'Guess the right side pass', quality: 'risky', feedback: 'Risky — guessing the side before the pass is made opens the other option.' },
      { id: 'd', text: 'Slow jog back', quality: 'poor', feedback: 'Poor — jogging back in transition gives the attack a numerical advantage.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'The opposition runs a rehearsed set play from a free throw. The pivot screens your defender while the left back cuts to the centre.',
    pressure: 'Moderate',
    decisions: [
      { id: 'a', text: 'Read around the screen, track the cutter', quality: 'optimal', feedback: 'Correct — reading around the screen keeps you aligned with the actual shooting threat.' },
      { id: 'b', text: 'Follow the pivot', quality: 'risky', feedback: 'Risky — following the pivot loses track of the cutting back, who is the real threat.' },
      { id: 'c', text: 'Hold position and react late', quality: 'good', feedback: 'Good — holding is safe but the screen may delay your reaction.' },
      { id: 'd', text: 'Call timeout', quality: 'poor', feedback: 'Poor — you cannot call a timeout during the opposition\'s set play.' },
    ],
  },
];

const QUALITY_SCORE: Record<string, number> = { optimal: 100, good: 75, risky: 45, poor: 20 };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function distributeGoals(totalGoals: number, slots: number): number[] {
  const result = new Array(slots).fill(0);
  if (totalGoals <= 0 || slots <= 0) return result;
  let remaining = totalGoals;
  while (remaining > 0) {
    const idx = Math.floor(Math.random() * slots);
    result[idx]++;
    remaining--;
  }
  return result;
}

const FALLBACK_TEMPLATE: ScenarioTemplate = {
  type: 'Backcourt Jump Shot',
  description: 'The opponent prepares a backcourt jump shot from the 9m line. The shooter is right-handed and has a clear lane.',
  pressure: 'Moderate',
  decisions: [
    { id: 'a', text: 'Stay patient and read the shooter', quality: 'optimal', feedback: 'Correct — patience lets you read the shot direction rather than guessing early.' },
    { id: 'b', text: 'Move early toward one corner', quality: 'risky', feedback: 'Risky — committing early opens the opposite corner.' },
    { id: 'c', text: 'Leave the goal immediately', quality: 'poor', feedback: 'Poor — leaving the goal gives the shooter an empty target.' },
    { id: 'd', text: 'Focus only on the pivot', quality: 'poor', feedback: 'Poor — ignoring the shooter leaves you unprepared for the shot.' },
  ],
};

export function generateMatch(): MatchSituation[] {
  if (!SCENARIO_TEMPLATES || SCENARIO_TEMPLATES.length === 0) {
    if (__DEV__) console.warn('[match-engine] SCENARIO_TEMPLATES is empty — using fallback only.');
  }

  const pool = SCENARIO_TEMPLATES.length > 0 ? shuffle(SCENARIO_TEMPLATES) : [];
  const situations: MatchSituation[] = [];

  // Realistic handball scores: ~28-30 total goals across 60 minutes.
  // Each situation represents ~4 minutes of play, so we distribute
  // goals so the final score lands in a realistic range (e.g. 16-15, 23-22).
  const TOTAL_SITUATIONS = 15;
  const targetTotalGoals = 28 + Math.floor(Math.random() * 5); // 28-32
  const teamShare = 0.45 + Math.random() * 0.1; // 45-55%
  const finalTeamGoals = Math.round(targetTotalGoals * teamShare);
  const finalOppGoals = targetTotalGoals - finalTeamGoals;

  // Build a per-situation goal increment schedule that sums to the finals.
  const teamIncrements = distributeGoals(finalTeamGoals, TOTAL_SITUATIONS);
  const oppIncrements = distributeGoals(finalOppGoals, TOTAL_SITUATIONS);

  let scoreTeam = 0;
  let scoreOpp = 0;

  for (let i = 0; i < TOTAL_SITUATIONS; i++) {
    const template = pool.length > 0 ? pool[i % pool.length] : undefined;
    const selectedTemplate = template ?? FALLBACK_TEMPLATE;

    if (!template && __DEV__) {
      console.warn(`[match-engine] No template for situation ${i} — using fallback.`);
    }

    const isSecondHalf = i >= 8;
    const minute = isSecondHalf ? 31 + Math.floor((i - 8) * 3.5) : Math.floor(i * 3.5) + 2;
    const second = Math.floor(Math.random() * 60);

    // Accumulate realistic score
    scoreTeam += teamIncrements[i];
    scoreOpp += oppIncrements[i];

    let pressure = selectedTemplate.pressure;
    if (minute >= 28 && minute <= 30) pressure = 'High';
    if (minute >= 57) pressure = 'Critical';
    if (minute <= 5) pressure = 'Low';

    const formation = pickRandom(FORMATIONS) ?? 'Standard 6-0 defence';
    const decisions = shuffle(selectedTemplate.decisions);
    const correct = decisions.find((d) => d.quality === 'optimal') ?? decisions[0];

    situations.push({
      index: i,
      minute,
      second,
      scoreTeam,
      scoreOpp,
      pressure,
      formation,
      description: selectedTemplate.description,
      scenarioType: selectedTemplate.type,
      decisions,
      correctDecisionId: correct.id,
    });
  }

  return situations;
}

export function evaluateMatch(answers: MatchAnswer[], situations: MatchSituation[]): MatchReport {
  const total = answers.length;
  if (total === 0) {
    return {
      matchRating: 0,
      decisionScore: 0,
      pressureControl: 0,
      readingAbility: 0,
      consistency: 0,
      mentalFocus: 60,
      momentum: 'Balanced',
      confidence: 'Low',
      decisionAccuracy: 0,
      optimalCount: 0,
      goodCount: 0,
      riskyCount: 0,
      poorCount: 0,
    };
  }

  const qualityScores = answers.map((a) => QUALITY_SCORE[a.quality] ?? 50);
  const decisionScore = Math.round(qualityScores.reduce((s, v) => s + v, 0) / total);

  // Pressure control: performance in high/critical situations
  const highPressure = answers.filter((a) => {
    const s = situations[a.situationIndex];
    return s && (s.pressure === 'High' || s.pressure === 'Critical');
  });
  const pressureControl = highPressure.length > 0
    ? Math.round(highPressure.map((a) => QUALITY_SCORE[a.quality]).reduce((s, v) => s + v, 0) / highPressure.length)
    : decisionScore;

  // Reading ability: performance on shooter-reading scenarios
  const readingTypes = ['Wing Shot', 'Backcourt Jump Shot', '7m Throw', 'Pivot Shot', 'Breakaway'];
  const readingAnswers = answers.filter((a) => readingTypes.includes(a.scenarioType));
  const readingAbility = readingAnswers.length > 0
    ? Math.round(readingAnswers.map((a) => QUALITY_SCORE[a.quality]).reduce((s, v) => s + v, 0) / readingAnswers.length)
    : decisionScore;

  // Consistency: inverse of variance
  const avg = decisionScore;
  const variance = qualityScores.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / total;
  const consistency = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance) * 1.5)));

  const matchRating = Math.round((decisionScore + pressureControl + readingAbility + consistency) / 4);

  // Dynamic stats
  const mentalFocus = calculateMentalFocus(answers, situations);
  const momentum = calculateMomentum(answers);
  const confidence = calculateConfidence(answers);
  const decisionAccuracy = calculateDecisionAccuracy(answers);

  // Strengths and areas to improve
  const optimalCount = answers.filter((a) => a.quality === 'optimal').length;
  const goodCount = answers.filter((a) => a.quality === 'good').length;
  const riskyCount = answers.filter((a) => a.quality === 'risky').length;
  const poorCount = answers.filter((a) => a.quality === 'poor').length;

  return {
    matchRating,
    decisionScore,
    pressureControl,
    readingAbility,
    consistency,
    mentalFocus,
    momentum,
    confidence,
    decisionAccuracy,
    optimalCount,
    goodCount,
    riskyCount,
    poorCount,
  };
}

/**
 * Mental Focus: weighted blend of correct decisions, consistency, and
 * performance under pressure. Clamped to 60-98%.
 */
export function calculateMentalFocus(answers: MatchAnswer[], situations: MatchSituation[]): number {
  if (answers.length === 0) return 60;

  const correctCount = answers.filter((a) => a.quality === 'optimal' || a.quality === 'good').length;
  const accuracyRatio = correctCount / answers.length;

  const qualityScores = answers.map((a) => QUALITY_SCORE[a.quality] ?? 50);
  const avg = qualityScores.reduce((s, v) => s + v, 0) / answers.length;
  const variance = qualityScores.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / answers.length;
  const consistencyFactor = Math.max(0, 1 - Math.sqrt(variance) / 50);

  const pressureAnswers = answers.filter((a) => {
    const s = situations[a.situationIndex];
    return s && (s.pressure === 'High' || s.pressure === 'Critical');
  });
  const pressureCorrect = pressureAnswers.filter((a) => a.quality === 'optimal' || a.quality === 'good').length;
  const pressureFactor = pressureAnswers.length > 0 ? pressureCorrect / pressureAnswers.length : accuracyRatio;

  const raw = accuracyRatio * 0.45 + consistencyFactor * 0.25 + pressureFactor * 0.30;
  const clamped = Math.round(60 + raw * 38);
  return Math.max(60, Math.min(98, clamped));
}

export function calculateMomentum(answers: MatchAnswer[]): Momentum {
  if (answers.length < 2) return 'Balanced';
  const recent = answers.slice(-4);
  const goodRecent = recent.filter((a) => a.quality === 'optimal' || a.quality === 'good').length;
  const badRecent = recent.filter((a) => a.quality === 'risky' || a.quality === 'poor').length;
  if (goodRecent > badRecent + 1) return 'Your Team';
  if (badRecent > goodRecent + 1) return 'Opponent';
  return 'Balanced';
}

export function calculateConfidence(answers: MatchAnswer[]): Confidence {
  if (answers.length === 0) return 'Low';
  const correctCount = answers.filter((a) => a.quality === 'optimal' || a.quality === 'good').length;
  const ratio = correctCount / answers.length;
  if (ratio >= 0.7) return 'High';
  if (ratio >= 0.45) return 'Medium';
  return 'Low';
}

export function calculateDecisionAccuracy(answers: MatchAnswer[]): number {
  if (answers.length === 0) return 0;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  return Math.round((correctCount / answers.length) * 100);
}
