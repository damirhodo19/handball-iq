import { translations, type TranslationDict } from '@/locales';

type TFunc = (key: string, vars?: Record<string, string | number>) => string;

// Map position identifier to translation key
const POSITION_KEYS: Record<string, string> = {
  'Goalkeeper': 'position.goalkeeper',
  'Left Wing': 'position.leftWing',
  'Right Wing': 'position.rightWing',
  'Pivot': 'position.pivot',
  'Centre Back': 'position.centreBack',
  'Left Back': 'position.leftBack',
  'Right Back': 'position.rightBack',
};

const POSITION_SHORT_KEYS: Record<string, string> = {
  'GK': 'positionShort.gk',
  'LW': 'positionShort.lw',
  'RW': 'positionShort.rw',
  'PV': 'positionShort.pv',
  'CB': 'positionShort.cb',
  'LB': 'positionShort.lb',
  'RB': 'positionShort.rb',
};

const POSITION_GROUP_KEYS: Record<string, string> = {
  'Goalkeeper': 'positionGroup.goalkeeper',
  'Wing': 'positionGroup.wing',
  'Back': 'positionGroup.back',
  'Centre Back': 'positionGroup.centreBack',
  'Pivot': 'positionGroup.pivot',
};

const ROLE_KEYS: Record<string, string> = {
  'Player': 'role.player',
  'Coach': 'role.coach',
  'Assistant Coach': 'role.assistantCoach',
  'Goalkeeper Coach': 'role.gkCoach',
  'Academy Coach': 'role.academyCoach',
  'Admin': 'role.admin',
};

const ROLE_SHORT_KEYS: Record<string, string> = {
  'Coach': 'roleShort.coach',
  'Assistant Coach': 'roleShort.assistant',
  'Goalkeeper Coach': 'roleShort.gkCoach',
  'Academy Coach': 'roleShort.academy',
};

const AGE_GROUP_KEYS: Record<string, string> = {
  'Under 14': 'ageGroup.under14',
  'Under 16': 'ageGroup.under16',
  'Under 18': 'ageGroup.under18',
  'Senior': 'ageGroup.senior',
};

const PLAYING_LEVEL_KEYS: Record<string, string> = {
  'Beginner': 'playingLevel.beginner',
  'Amateur': 'playingLevel.amateur',
  'Competitive': 'playingLevel.competitive',
  'Semi Professional': 'playingLevel.semiPro',
  'Professional': 'playingLevel.professional',
};

const DIFFICULTY_KEYS: Record<string, string> = {
  'Beginner': 'difficulty.beginner',
  'Easy': 'difficulty.easy',
  'Intermediate': 'difficulty.medium',
  'Medium': 'difficulty.medium',
  'Advanced': 'difficulty.hard',
  'Hard': 'difficulty.hard',
  'Expert': 'difficulty.elite',
  'Elite': 'difficulty.elite',
  'Professional': 'difficulty.professional',
};

const DEV_GOAL_KEYS: Record<string, string> = {
  'Decision Making': 'devGoal.decisionMaking',
  'Tactical Understanding': 'devGoal.tacticalUnderstanding',
  'Mental Preparation': 'devGoal.mentalPreparation',
  'Playing Under Pressure': 'devGoal.playingUnderPressure',
  'Reading the Defence': 'devGoal.readingDefence',
  'Position Specific Skills': 'devGoal.positionSpecific',
};

const HAND_KEYS: Record<string, string> = {
  'Left': 'hand.left',
  'Right': 'hand.right',
};

const MATCH_TYPE_KEYS: Record<string, string> = {
  'League': 'matchType.league',
  'Cup': 'matchType.cup',
  'Friendly': 'matchType.friendly',
  'Tournament': 'matchType.tournament',
};

const MATCH_LOCATION_KEYS: Record<string, string> = {
  'Home': 'matchLocation.home',
  'Away': 'matchLocation.away',
  'Neutral': 'matchLocation.neutral',
};

const PLAYING_TIME_KEYS: Record<string, string> = {
  'Starter': 'playingTime.starter',
  'Shared minutes': 'playingTime.shared',
  'Substitute': 'playingTime.substitute',
};

const STATUS_KEYS: Record<string, string> = {
  'Draft': 'status.draft',
  'Published': 'status.published',
  'Archived': 'status.archived',
};

const MATCH_PHASE_KEYS: Record<string, string> = {
  'First Half': 'matchPhase.firstHalf',
  'Second Half': 'matchPhase.secondHalf',
  'Warmup': 'matchPhase.warmup',
};

const PRESSURE_KEYS: Record<string, string> = {
  'Low': 'pressure.low',
  'Moderate': 'pressure.moderate',
  'High': 'pressure.high',
  'Critical': 'pressure.critical',
};

const MOMENTUM_KEYS: Record<string, string> = {
  'Your Team': 'momentum.yourTeam',
  'Opponent': 'momentum.opponent',
  'Balanced': 'momentum.balanced',
};

const CONFIDENCE_KEYS: Record<string, string> = {
  'Low': 'confidence.low',
  'Medium': 'confidence.medium',
  'High': 'confidence.high',
};

const PERSONAL_GOAL_KEYS: Record<string, string> = {
  'Stay patient': 'personalGoal.stayPatient',
  'Read the shooter': 'personalGoal.readShooter',
  'Control emotions': 'personalGoal.controlEmotions',
  'Improve communication': 'personalGoal.improveCommunication',
  'Fast break saves': 'personalGoal.fastBreakSaves',
  'Seven metre saves': 'personalGoal.sevenMetreSaves',
  'Control the tempo': 'personalGoal.controlTempo',
  'Read the defence': 'personalGoal.readDefence',
  'Connect with the pivot': 'personalGoal.connectPivot',
  'Lead the attack': 'personalGoal.leadAttack',
  'Manage pressure situations': 'personalGoal.managePressure',
  'Final attack decisions': 'personalGoal.finalAttack',
  'Shot selection': 'personalGoal.shotSelection',
  'One-on-one decisions': 'personalGoal.oneOnOne',
  'Creating space': 'personalGoal.creatingSpace',
  'Defensive positioning': 'personalGoal.defensivePositioning',
  'Pressure situations': 'personalGoal.pressureSituations',
  'Playing with the pivot': 'personalGoal.playingWithPivot',
  'Improve finishing': 'personalGoal.improveFinishing',
  'Fast break timing': 'personalGoal.fastBreakTiming',
  'Read the goalkeeper': 'personalGoal.readGoalkeeper',
  'Off-ball movement': 'personalGoal.offBallMovement',
  'Pressure finishing': 'personalGoal.pressureFinishing',
  'Angle management': 'personalGoal.angleManagement',
  'Improve positioning': 'personalGoal.improvePositioning',
  'Blocking decisions': 'personalGoal.blockingDecisions',
  'Receiving under pressure': 'personalGoal.receivingPressure',
  'Finishing at six metres': 'personalGoal.finishingSixMetres',
  'Defensive work': 'personalGoal.defensiveWork',
};

const SESSION_TYPE_KEYS: Record<string, string> = {
  'Wing Session': 'sessionType.wingSession',
  'Pressure Session': 'sessionType.pressureSession',
  'Fast Break Session': 'sessionType.fastBreakSession',
  '7m Session': 'sessionType.7mSession',
  'Match Day Preparation': 'sessionType.matchDayPrep',
  'Mental Training': 'sessionType.mentalTraining',
};

const SKILL_KEYS: Record<string, string> = {
  'Patience Training': 'coach.plan.focus.patience',
  'Match Preparation': 'coach.plan.focus.matchPrep',
  'Recovery and Review': 'coach.plan.focus.recovery',
  'Defence Reading': 'iq.skill.defensiveReading',
  'Tempo Control': 'training.focus.tempoControl',
  'Pivot Connection': 'training.focus.pivotConnection',
  'Pressure Decisions': 'iq.skill.pressureDecisions',
  'Space Creation': 'iq.skill.spaceCreation',
  'Pressure Control': 'iq.skill.pressureControl',
  'Position Skills': 'training.focus.positionSkills',
  'Match Simulation': 'training.focus.matchSimulation',
  'Decision Making': 'skill.decisionMaking',
  'Patience': 'skill.patience',
  'Reading the Shooter': 'skill.readingShooter',
  'Fast Break Performance': 'skill.fastBreakPerf',
  'Wing Situations': 'skill.wingSituations',
  '7m Situations': 'skill.7mSituations',
  'Pressure Handling': 'skill.pressureHandling',
  'Consistency': 'skill.consistency',
  'Mental Preparation': 'skill.mentalPrep',
  'Decision Score': 'skill.decisionMaking',
  'Pressure Performance': 'skill.pressureHandling',
  'Reading Ability': 'skill.readingShooter',
  'Fast Break': 'skill.fastBreakPerf',
  '7m Throws': 'skill.7mSituations',
  'Pivot Situations': 'skill.wingSituations',
};

const PLAYER_TYPE_KEYS: Record<string, string> = {
  'Calm Reader': 'playerType.calmReader',
  'Aggressive Goalkeeper': 'playerType.aggressiveGK',
  'Reactive Goalkeeper': 'playerType.reactiveGK',
  'Balanced Goalkeeper': 'playerType.balancedGK',
  'Pressure Specialist': 'playerType.pressureSpecialist',
  'Developing Goalkeeper': 'playerType.developingGK',
};

const DAY_KEYS: Record<string, string> = {
  'Monday': 'day.monday',
  'Tuesday': 'day.tuesday',
  'Wednesday': 'day.wednesday',
  'Thursday': 'day.thursday',
  'Friday': 'day.friday',
  'Saturday': 'day.saturday',
  'Sunday': 'day.sunday',
  'Mon': 'day.monday',
  'Tue': 'day.tuesday',
  'Wed': 'day.wednesday',
  'Thu': 'day.thursday',
  'Fri': 'day.friday',
  'Sat': 'day.saturday',
  'Sun': 'day.sunday',
};

const ATTACK_DEFENCE_KEYS: Record<string, string> = {
  'Attack': 'term.attack',
  'Defence': 'term.defence',
};

const CATEGORY_KEYS: Record<string, string> = {
  'General': 'category.general',
  'Goalkeeper': 'position.goalkeeper',
  'Left Wing': 'position.leftWing',
  'Right Wing': 'position.rightWing',
  'Left Back': 'position.leftBack',
  'Centre Back': 'position.centreBack',
  'Right Back': 'position.rightBack',
  'Pivot': 'position.pivot',
  'Defence': 'term.defence',
  'Fast Break': 'category.fastBreak',
  'Power Play': 'category.powerPlay',
  'Short Handed': 'category.shortHanded',
  'Match Ending': 'category.matchEnding',
  'Decision Making': 'category.decisionMaking',
  'Wing Shots': 'category.wingShots',
  '7m Throws': 'category.7mThrows',
  'Reading 6:0 Defence': 'category.reading60Defence',
  'Finishing at Six Metres': 'category.finishingSixMetres',
  'Fast Break Timing': 'category.fastBreakTiming',
  'Pressure': 'category.pressure',
  'Mental': 'category.mental',
};

const DEFENSIVE_SYSTEM_KEYS: Record<string, string> = {
  '6-0': 'defensiveSystem.60',
  '5-1': 'defensiveSystem.51',
  '4-2': 'defensiveSystem.42',
  '3-2-1': 'defensiveSystem.321',
  'Man-to-Man': 'defensiveSystem.manToMan',
  'Mixed': 'defensiveSystem.mixed',
};

function makeTranslator(keyMap: Record<string, string>): (value: string, t: TFunc) => string {
  return (value: string, t: TFunc) => {
    const key = keyMap[value];
    return key ? t(key) : value;
  };
}

export const translatePosition = makeTranslator(POSITION_KEYS);
export const translatePositionShort = makeTranslator(POSITION_SHORT_KEYS);
export const translatePositionGroup = makeTranslator(POSITION_GROUP_KEYS);
export const translateRole = makeTranslator(ROLE_KEYS);
export const translateRoleShort = makeTranslator(ROLE_SHORT_KEYS);
export const translateAgeGroup = makeTranslator(AGE_GROUP_KEYS);
export const translatePlayingLevel = makeTranslator(PLAYING_LEVEL_KEYS);
export const translateDifficulty = makeTranslator(DIFFICULTY_KEYS);
export const translateDevGoal = makeTranslator(DEV_GOAL_KEYS);
export const translateHand = makeTranslator(HAND_KEYS);
export const translateMatchType = makeTranslator(MATCH_TYPE_KEYS);
export const translateMatchLocation = makeTranslator(MATCH_LOCATION_KEYS);
export const translatePlayingTime = makeTranslator(PLAYING_TIME_KEYS);
export const translateStatus = makeTranslator(STATUS_KEYS);
export const translateMatchPhase = makeTranslator(MATCH_PHASE_KEYS);
export const translatePressure = makeTranslator(PRESSURE_KEYS);
export const translateMomentum = makeTranslator(MOMENTUM_KEYS);
export const translateConfidence = makeTranslator(CONFIDENCE_KEYS);
export const translatePersonalGoal = makeTranslator(PERSONAL_GOAL_KEYS);
export const translateSessionType = makeTranslator(SESSION_TYPE_KEYS);
export function translateSkill(value: string, t: TFunc): string {
  const explicit = SKILL_KEYS[value];
  if (explicit) return t(explicit);
  // Runtime metric IDs and old saved English labels share the same display path.
  for (const key of [`iq.skill.${value}`, `coach.skill.${value}`, `skill.${value}`]) {
    const result = t(key);
    if (result !== key) return result;
  }
  const key = Object.keys(translations.en).find((candidate) =>
    /^(iq\.skill|coach\.skill|skill|category|term)\./.test(candidate) && translations.en[candidate] === value,
  );
  return key ? t(key) : translateCategory(value, t);
}
export const translatePlayerType = makeTranslator(PLAYER_TYPE_KEYS);
export const translateDay = makeTranslator(DAY_KEYS);
export const translateAttackDefence = makeTranslator(ATTACK_DEFENCE_KEYS);
export const translateCategory = makeTranslator(CATEGORY_KEYS);
export const translateFormation = makeTranslator({
  '3-2-1 attacking formation': 'formation.attacking321',
  '2-4 attacking with line player': 'formation.attacking24',
  '7 vs 6 empty-court attack': 'formation.emptyCourt76',
  'Standard 6-0 defence': 'formation.standard60',
  '5-1 aggressive defence': 'formation.aggressive51',
  '3-2-1 defence shifting': 'formation.shifting321',
});
export function translateDefensiveSystem(value: string, t: TFunc): string {
  const normalized = value.replace(/:/g, '-');
  return makeTranslator(DEFENSIVE_SYSTEM_KEYS)(normalized, t) === normalized
    ? value
    : makeTranslator(DEFENSIVE_SYSTEM_KEYS)(normalized, t);
}

const ENGLISH_DEFAULT_STATEMENT = 'Today I will focus on the next action, not the previous result.';

export function resolveDefaultStatement(statement: string, t: TFunc): string {
  if (statement === 'default.statement' || statement === ENGLISH_DEFAULT_STATEMENT) {
    return t('default.statement');
  }
  return statement;
}

const STORED_ACTIVITY_KEYS = [
  'home.trainingSession',
  'match.title',
  'match.configCompetition',
  'match.configCompetitionShort',
] as const;

export function translateStoredActivityTitle(
  title: string,
  type: 'session' | 'match',
  t: TFunc,
): string {
  if (type === 'session') {
    const skill = translateSkill(title, t);
    if (skill !== title) return skill;
  }
  for (const key of STORED_ACTIVITY_KEYS) {
    const isKnownValue = Object.values(translations).some((dict) => dict[key] === title);
    if (isKnownValue) return t(key);
  }
  return title;
}

export { TFunc };
