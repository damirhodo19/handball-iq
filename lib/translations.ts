import { TranslationDict } from '@/locales';

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
  'Intermediate': 'difficulty.intermediate',
  'Advanced': 'difficulty.advanced',
  'Expert': 'difficulty.expert',
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
};

const ATTACK_DEFENCE_KEYS: Record<string, string> = {
  'Attack': 'term.attack',
  'Defence': 'term.defence',
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
export const translateSkill = makeTranslator(SKILL_KEYS);
export const translatePlayerType = makeTranslator(PLAYER_TYPE_KEYS);
export const translateDay = makeTranslator(DAY_KEYS);
export const translateAttackDefence = makeTranslator(ATTACK_DEFENCE_KEYS);

export { TFunc };
