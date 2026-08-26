import { SupportedLanguage } from '@/locales';
import { GKScenario } from '@/lib/scenarios';
import { MatchSituation, MatchDecision } from '@/lib/match-engine';
import { TacticalScenario, VisualizationStep } from '@/lib/match-day-scenarios';
import { scenarioTextDe, scenarioTextHr } from '@/locales/scenario-text';
import { translateDefensiveSystem, translateMatchPhase, translatePressure, translateSkill } from '@/lib/translations';
import { localizeMatchDayText } from '@/lib/match-day-localize';

type TFunc = (key: string, vars?: Record<string, string | number>) => string;

const SCENARIO_TYPE_KEYS: Record<string, string> = {
  '7 vs 6 Attack': 'scenarioType.7Vs6Attack',
  '7m Throw': 'scenarioType.7mThrow',
  'After Conceding': 'scenarioType.afterConceding',
  'Backcourt Jump Shot': 'scenarioType.backcourtJumpShot',
  'Backcourt Shot': 'scenarioType.backcourtShot',
  'Blocking': 'scenarioType.blocking',
  'Breakaway': 'scenarioType.breakaway',
  'Controlling Tempo': 'scenarioType.controllingTempo',
  'Counter-Attack': 'scenarioType.counterAttack',
  'Counter-Attack Read': 'scenarioType.counterAttackRead',
  'Creating Space': 'scenarioType.creatingSpace',
  'Crossing Action': 'scenarioType.crossingAction',
  'Crossing Movement': 'scenarioType.crossingMovement',
  'Defensive Organisation': 'scenarioType.defensiveOrganisation',
  'Defensive Transition': 'scenarioType.defensiveTransition',
  'Defensive Work': 'scenarioType.defensiveWork',
  'Emotional Pressure': 'scenarioType.emotionalPressure',
  'Fast Break': 'scenarioType.fastBreak',
  'Fast Break Timing': 'scenarioType.fastBreakTiming',
  'Final Attack': 'scenarioType.finalAttack',
  'Final Minute Under Pressure': 'scenarioType.finalMinuteUnderPressure',
  'Finishing at Six Metres': 'scenarioType.finishingAtSixMetres',
  'First Attack': 'scenarioType.firstAttack',
  'Goalkeeper Reading': 'scenarioType.goalkeeperReading',
  'Last Attack Before Halftime': 'scenarioType.lastAttackBeforeHalftime',
  'Last Minute': 'scenarioType.lastMinute',
  'Long Range Shot': 'scenarioType.longRangeShot',
  'Narrow Angle': 'scenarioType.narrowAngle',
  'One Against One': 'scenarioType.oneAgainstOne',
  'Passing to Wing': 'scenarioType.passingToWing',
  'Pivot Shot': 'scenarioType.pivotShot',
  'Player Advantage': 'scenarioType.playerAdvantage',
  'Playing With Pivot': 'scenarioType.playingWithPivot',
  'Playing Without Ball': 'scenarioType.playingWithoutBall',
  'Positioning': 'scenarioType.positioning',
  'Power Play': 'scenarioType.powerPlay',
  'Pressure Finishing': 'scenarioType.pressureFinishing',
  'Reading 3:2:1': 'scenarioType.reading321',
  'Reading 5:1': 'scenarioType.reading51',
  'Reading 6:0': 'scenarioType.reading60',
  'Reading Defensive Rotation': 'scenarioType.readingDefensiveRotation',
  'Receiving Under Pressure': 'scenarioType.receivingUnderPressure',
  'Referee Decision': 'scenarioType.refereeDecision',
  'Set Play': 'scenarioType.setPlay',
  'Seven Metre Throw': 'scenarioType.sevenMetreThrow',
  'Shot Selection': 'scenarioType.shotSelection',
  'Wing Finishing': 'scenarioType.wingFinishing',
  'Wing Shot': 'scenarioType.wingShot',
};

export function translateScenarioType(type: string, t: TFunc): string {
  const key = SCENARIO_TYPE_KEYS[type];
  return key ? t(key) : type;
}

export function translateScenarioText(text: string, lang: SupportedLanguage): string {
  if (!text || lang === 'en') return text;
  const map = lang === 'hr' ? scenarioTextHr : scenarioTextDe;
  return map[text] ?? text;
}

export function localizeGKScenario(scenario: GKScenario, lang: SupportedLanguage, t: TFunc): GKScenario {
  if (lang === 'en') return scenario;
  const suffix = lang === 'hr' ? '_hr' : '_de';
  const s = scenario as GKScenario & Record<string, unknown>;
  return {
    ...scenario,
    half: translateMatchPhase(scenario.half, t) as GKScenario['half'],
    situation: translateScenarioText(String(s[`situation${suffix}`] ?? scenario.situation), lang),
    question: translateScenarioText(String(s[`question${suffix}`] ?? scenario.question), lang),
    options: (s[`options${suffix}`] as string[] | undefined)?.map((o) => translateScenarioText(o, lang))
      ?? scenario.options.map((o) => translateScenarioText(o, lang)),
    explanation: translateScenarioText(String(s[`explanation${suffix}`] ?? scenario.explanation), lang),
    metric: translateSkill(scenario.metric, t) as GKScenario['metric'],
  };
}

function localizeDecision(decision: MatchDecision, lang: SupportedLanguage): MatchDecision {
  if (lang === 'en') return decision;
  const suffix = lang === 'hr' ? '_hr' : '_de';
  const d = decision as MatchDecision & Record<string, unknown>;
  return {
    ...decision,
    text: String(d[`text${suffix}`] ?? translateScenarioText(decision.text, lang)),
    feedback: String(d[`feedback${suffix}`] ?? translateScenarioText(decision.feedback, lang)),
  };
}

export function localizeMatchSituation(
  situation: MatchSituation,
  lang: SupportedLanguage,
  t: TFunc,
): MatchSituation {
  if (lang === 'en') {
    return {
      ...situation,
      scenarioType: translateScenarioType(situation.scenarioType, t),
      pressure: translatePressure(situation.pressure, t) as MatchSituation['pressure'],
    };
  }
  const suffix = lang === 'hr' ? '_hr' : '_de';
  const s = situation as MatchSituation & Record<string, unknown>;
  const adminFormation = situation.formation.match(/^(6-0|5-1|4-2|3-2-1|Man-to-Man|Mixed) defence$/);
  return {
    ...situation,
    scenarioType: String(s[`scenarioType${suffix}`] ?? translateScenarioType(situation.scenarioType, t)),
    pressure: translatePressure(situation.pressure, t) as MatchSituation['pressure'],
    formation: adminFormation
      ? translateDefensiveSystem(adminFormation[1], t)
      : translateScenarioText(situation.formation, lang),
    description: String(s[`description${suffix}`] ?? translateScenarioText(situation.description, lang)),
    decisions: situation.decisions.map((d) => localizeDecision(d, lang)),
  };
}

export function localizeTacticalScenario(
  scenario: TacticalScenario,
  lang: SupportedLanguage,
  t: TFunc,
): TacticalScenario {
  if (lang === 'en') {
    return {
      ...scenario,
      type: translateScenarioType(scenario.type, t),
    };
  }
  const suffix = lang === 'hr' ? '_hr' : '_de';
  const s = scenario as TacticalScenario & Record<string, unknown>;
  return {
    ...scenario,
    type: String(s[`type${suffix}`] ?? translateScenarioType(scenario.type, t)),
    description: String(s[`description${suffix}`] ?? translateScenarioText(scenario.description, lang)),
    explanation: String(s[`explanation${suffix}`] ?? translateScenarioText(scenario.explanation, lang)),
    decisions: scenario.decisions.map((d) => ({
      ...d,
      text: String((d as Record<string, unknown>)[`text${suffix}`] ?? translateScenarioText(d.text, lang)),
    })),
  };
}

export function localizeVisualizationStep(
  step: VisualizationStep,
  lang: SupportedLanguage,
  t: TFunc,
): VisualizationStep {
  return {
    title: translateScenarioType(step.title, t) !== step.title
      ? translateScenarioType(step.title, t)
      : localizeMatchDayText(translateScenarioText(step.title, lang), lang, t),
    instruction: localizeMatchDayText(translateScenarioText(step.instruction, lang), lang, t),
  };
}

export function localizeSkillLabel(skill: string, t: TFunc): string {
  return translateSkill(skill, t);
}
