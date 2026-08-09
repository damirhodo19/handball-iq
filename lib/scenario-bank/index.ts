import scenariosJson from '@/content/scenario-bank/scenarios.json';
import type { BankScenario, ScenarioCategory } from '@/content/scenario-bank/types';
import type { HandballPosition } from '@/lib/positions';
import type { GKScenario } from '@/lib/scenarios';
import type { MatchDecision } from '@/lib/match-engine';
import type { TacticalScenario } from '@/lib/match-day-tactics';
import { getPositionModule } from '@/lib/platform/position-modules';
import { isScenarioForPosition, isUniversalPrimary } from '@/lib/platform/scenario-position';

const scenarios = scenariosJson as BankScenario[];

export function getAllScenarios(): BankScenario[] {
  return scenarios;
}

export function getScenariosByCategory(category: ScenarioCategory): BankScenario[] {
  return scenarios.filter((s) => s.category === category);
}

export function getScenariosByPosition(position: HandballPosition): BankScenario[] {
  return scenarios.filter((s) => isScenarioForPosition(s, position));
}

export function getBestScenariosByCategory(
  category: ScenarioCategory,
  count: number,
): BankScenario[] {
  return [...getScenariosByCategory(category)]
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, count);
}

export interface MatchTemplateFromBank {
  type: string;
  type_hr?: string;
  type_de?: string;
  description: string;
  description_hr?: string;
  description_de?: string;
  pressure: BankScenario['pressureLevel'];
  attackOrDefence: BankScenario['attackOrDefence'];
  decisions: MatchDecision[];
}

export function toMatchTemplate(scenario: BankScenario): MatchTemplateFromBank {
  const decisions: MatchDecision[] = scenario.answers.map((a, i) => ({
    id: String.fromCharCode(97 + i),
    text: a.text.en,
    text_hr: a.text.hr,
    text_de: a.text.de,
    quality: a.quality,
    feedback: a.feedback.en,
    feedback_hr: a.feedback.hr,
    feedback_de: a.feedback.de,
  }));

  return {
    type: scenario.title.en,
    type_hr: scenario.title.hr,
    type_de: scenario.title.de,
    description: scenario.situation.en,
    description_hr: scenario.situation.hr,
    description_de: scenario.situation.de,
    pressure: scenario.pressureLevel,
    attackOrDefence: scenario.attackOrDefence,
    decisions,
  };
}

export function toGKScenario(
  scenario: BankScenario,
  id: number,
  position?: import('@/lib/positions').HandballPosition | null,
): GKScenario {
  const correctIndex = scenario.answers.findIndex((a) => a.quality === 'optimal');
  const minute = scenario.minute;
  const half: GKScenario['half'] = minute <= 30 ? 'First Half' : 'Second Half';
  // Metric labels from position skill matrix — never force GK labels on other positions
  const primary = scenario.primaryPosition as string;
  const pos =
    position ??
    (primary !== 'All' && primary !== 'Universal' ? (scenario.primaryPosition as HandballPosition) : null);
  const mod = getPositionModule(pos);
  const metrics = mod?.positionSkills?.length
    ? mod.positionSkills
    : ['decisionMaking', 'pressureControl', 'gameReading'];
  const metric = metrics[id % metrics.length] as GKScenario['metric'];

  return {
    id,
    bankId: scenario.id,
    half,
    time: `${minute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    score: scenario.score,
    situation: scenario.situation.en,
    situation_hr: scenario.situation.hr,
    situation_de: scenario.situation.de,
    question: scenario.question.en,
    question_hr: scenario.question.hr,
    question_de: scenario.question.de,
    options: scenario.answers.map((a) => a.text.en),
    options_hr: scenario.answers.map((a) => a.text.hr),
    options_de: scenario.answers.map((a) => a.text.de),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: scenario.explanation.en,
    explanation_hr: scenario.explanation.hr,
    explanation_de: scenario.explanation.de,
    metric,
  };
}

export function toTacticalScenario(scenario: BankScenario): TacticalScenario {
  const correctAnswer = scenario.answers.find((a) => a.quality === 'optimal');
  const correctIndex = scenario.answers.findIndex((a) => a.quality === 'optimal');

  return {
    id: scenario.id,
    type: scenario.title.en,
    type_hr: scenario.title.hr,
    type_de: scenario.title.de,
    description: scenario.situation.en,
    description_hr: scenario.situation.hr,
    description_de: scenario.situation.de,
    decisions: scenario.answers.map((a, i) => ({
      id: String.fromCharCode(97 + i),
      text: a.text.en,
      text_hr: a.text.hr,
      text_de: a.text.de,
    })),
    correctId: String.fromCharCode(97 + (correctIndex >= 0 ? correctIndex : 0)),
    explanation: correctAnswer?.feedback.en ?? scenario.explanation.en,
    explanation_hr: correctAnswer?.feedback.hr ?? scenario.explanation.hr,
    explanation_de: correctAnswer?.feedback.de ?? scenario.explanation.de,
  };
}

export function getMatchTemplatesForPosition(position: HandballPosition): MatchTemplateFromBank[] {
  const positionScenarios = getScenariosByPosition(position);
  let pool = positionScenarios;
  if (pool.length < 15) {
    // Prefer same primary + compatible All/Universal — never force Goalkeeper pool
    const primary = getAllScenarios().filter((s) => isScenarioForPosition(s, position));
    const byId = new Map(pool.map((s) => [s.id, s]));
    for (const s of primary) byId.set(s.id, s);
    pool = [...byId.values()];
  }
  if (pool.length < 8) {
    // Universal player content only — never Goalkeeper bank
    pool = getAllScenarios().filter(
      (s) =>
        s.primaryPosition === position ||
        (isUniversalPrimary(s.primaryPosition) && isScenarioForPosition(s, position)),
    );
  }
  return pool.map(toMatchTemplate);
}

export function getGKScenariosFromBank(count = 5): GKScenario[] {
  return getBestScenariosByCategory('Goalkeeper', count).map((s, i) => toGKScenario(s, i + 1));
}

/** Position-compatible bank rows — never Goalkeeper primaries for field players. */
export function getPositionTacticalPool(position: HandballPosition): BankScenario[] {
  return getAllScenarios().filter((s) => {
    if (!isScenarioForPosition(s, position)) return false;
    if (position !== 'Goalkeeper' && s.primaryPosition === 'Goalkeeper') return false;
    return true;
  });
}

export function getPositionTacticalFallback(
  position: HandballPosition,
  count = 5,
): TacticalScenario[] {
  const pool = getPositionTacticalPool(position)
    .filter((s) => s.primaryPosition === position || isUniversalPrimary(s.primaryPosition))
    .sort((a, b) => b.qualityScore - a.qualityScore);
  return pool.slice(0, count).map(toTacticalScenario);
}

const GOAL_KEYWORDS: Record<string, string[]> = {
  'Stay patient': ['patience', 'pattern', 'read', 'balanced'],
  'Read the shooter': ['read', 'shoulder', 'release', 'wing', 'backcourt'],
  'Control emotions': ['emotion', 'conced', 'pressure', 'reset', 'referee'],
  'Improve communication': ['communicat', 'leadership', 'call', 'organis'],
  'Fast break saves': ['fast break', 'breakaway', 'counter', 'outlet'],
  'Seven metre saves': ['seven', '7m', 'seven-metre', 'penalty', 'shootout'],
  'Control the tempo': ['tempo', 'rhythm', 'pace', 'control'],
  'Read the defence': ['defence', '6:0', '5:1', '3:2:1', 'read', 'system'],
  'Connect with the pivot': ['pivot', 'line', 'feed'],
  'Lead the attack': ['attack', 'lead', 'organis', 'playmaker'],
  'Manage pressure situations': ['pressure', 'final', 'clutch', 'late'],
  'Final attack decisions': ['final', 'last', 'match ending', 'clutch'],
  'Shot selection': ['shot', 'release', 'jump', 'selection', '9m'],
  'One-on-one decisions': ['1v1', 'one against', 'isolation', 'breakthrough'],
  'Creating space': ['space', 'gap', 'create', 'draw'],
  'Defensive positioning': ['defence', 'recover', 'transition', 'position'],
  'Pressure situations': ['pressure', 'final', 'clutch', 'late'],
  'Playing with the pivot': ['pivot', 'line', 'feed'],
  'Improve finishing': ['finish', 'shot', 'scoring', 'angle'],
  'Fast break timing': ['fast break', 'counter', 'timing', 'breakaway'],
  'Read the goalkeeper': ['goalkeeper', 'keeper', 'near', 'far', 'angle'],
  'Off-ball movement': ['off-ball', 'movement', 'timing', 'space'],
  'Pressure finishing': ['pressure', 'finish', 'final', 'clutch'],
  'Angle management': ['angle', 'near', 'far', 'corner', 'narrow'],
  'Improve positioning': ['position', 'screen', 'line', 'seal'],
  'Blocking decisions': ['block', 'screen', 'seal'],
  'Receiving under pressure': ['receiv', 'pressure', 'contact', 'catch'],
  'Finishing at six metres': ['six', '6m', 'finish', 'pivot'],
  'Defensive work': ['defence', 'recover', 'block', 'track'],
  'Decision Making': ['decision', 'read', 'choice'],
};

function keywordsForGoal(goal: string): string[] {
  if (GOAL_KEYWORDS[goal]) return GOAL_KEYWORDS[goal];
  return goal
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
}

/**
 * Match Day tactical scenarios for a personal goal + position.
 * Field players never receive Goalkeeper bank content.
 */
export function getTacticalScenariosForGoal(
  goal: string,
  count = 5,
  position?: HandballPosition | null,
): TacticalScenario[] {
  if (!position) return [];

  const positionPool = getPositionTacticalPool(position);
  const filterByKeyword = (pool: BankScenario[], keywords: string[]) =>
    pool.filter((s) =>
      keywords.some((k) =>
        `${s.title.en} ${s.situation.en} ${s.question.en}`.toLowerCase().includes(k.toLowerCase()),
      ),
    );

  // GK-only goals stay on GK-compatible pools when position is Goalkeeper
  if (position === 'Goalkeeper') {
    const decisionMaking = getBestScenariosByCategory('Decision Making', 30);
    const goalkeeper = getBestScenariosByCategory('Goalkeeper', 30);
    const matchEnding = getBestScenariosByCategory('Match Ending', 20);
    const fastBreak = getBestScenariosByCategory('Fast Break', 15);
    let pool: BankScenario[];
    switch (goal) {
      case 'Stay patient':
        pool = filterByKeyword([...goalkeeper, ...decisionMaking], GOAL_KEYWORDS['Stay patient']);
        break;
      case 'Read the shooter':
        pool = filterByKeyword(goalkeeper, GOAL_KEYWORDS['Read the shooter']);
        break;
      case 'Control emotions':
        pool = filterByKeyword([...goalkeeper, ...decisionMaking], GOAL_KEYWORDS['Control emotions']);
        break;
      case 'Improve communication':
        pool = filterByKeyword(
          [...goalkeeper, ...decisionMaking, ...getScenariosByCategory('Defence')],
          GOAL_KEYWORDS['Improve communication'],
        );
        break;
      case 'Fast break saves':
        pool = filterByKeyword([...goalkeeper, ...fastBreak], GOAL_KEYWORDS['Fast break saves']);
        break;
      case 'Seven metre saves':
        pool = filterByKeyword(goalkeeper, GOAL_KEYWORDS['Seven metre saves']);
        break;
      default:
        pool = filterByKeyword(positionPool, keywordsForGoal(goal));
    }
    if (pool.length < count) {
      pool = [...pool, ...goalkeeper, ...decisionMaking, ...matchEnding].filter(
        (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i,
      );
    }
    return pool.slice(0, count).map(toTacticalScenario);
  }

  // Field players: keyword match within position-compatible pool only
  let pool = filterByKeyword(positionPool, keywordsForGoal(goal));
  if (pool.length < count) {
    const primary = positionPool.filter((s) => s.primaryPosition === position);
    const universal = positionPool.filter((s) => isUniversalPrimary(s.primaryPosition));
    pool = [...pool, ...primary, ...universal].filter(
      (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i,
    );
  }

  return pool.slice(0, count).map(toTacticalScenario);
}
