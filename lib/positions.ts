// ── Central Position Configuration ──────────────────────────────────────────
// Single source of truth for position-specific content across the entire app.
// Every module (Home, Training, Match Simulator, Match Day, AI Coach, Coach Dashboard)
// reads from this file to deliver position-appropriate content.

export type HandballPosition =
  | 'Goalkeeper'
  | 'Left Wing'
  | 'Right Wing'
  | 'Pivot'
  | 'Centre Back'
  | 'Left Back'
  | 'Right Back';

export type PositionGroup = 'Goalkeeper' | 'Wing' | 'Back' | 'Centre Back' | 'Pivot';

export type AgeGroup = 'Under 14' | 'Under 16' | 'Under 18' | 'Senior';
export type PlayingLevel = 'Beginner' | 'Amateur' | 'Competitive' | 'Semi Professional' | 'Professional';
export type DevelopmentGoal =
  | 'Decision Making'
  | 'Tactical Understanding'
  | 'Mental Preparation'
  | 'Playing Under Pressure'
  | 'Reading the Defence'
  | 'Position Specific Skills';
export type DominantHand = 'Left' | 'Right';

export interface PositionConfig {
  position: HandballPosition;
  group: PositionGroup;
  label: string;
  shortLabel: string;
  icon: string;
  developmentTitle: string;
  dailySessionTitle: string;
  dailySessionDesc: string;
  scenarioCategories: { id: string; name: string; icon: string; description: string; scenarioCount: number; difficulty: string }[];
  metrics: { key: string; label: string }[];
  matchDayReminders: string[];
  matchDayPersonalGoals: string[];
  matchScenarioTypes: string[];
  coachReportLabels: { key: string; label: string }[];
  trainingPlanFocus: string[];
  playerTypeOptions: string[];
}

// ── Helper: get position group ────────────────────────────────────────────────

export function getPositionGroup(pos: HandballPosition): PositionGroup {
  switch (pos) {
    case 'Goalkeeper': return 'Goalkeeper';
    case 'Left Wing':
    case 'Right Wing': return 'Wing';
    case 'Left Back':
    case 'Right Back': return 'Back';
    case 'Centre Back': return 'Centre Back';
    case 'Pivot': return 'Pivot';
  }
}

// ── Position Configurations ───────────────────────────────────────────────────

export const POSITION_CONFIGS: Record<HandballPosition, PositionConfig> = {
  Goalkeeper: {
    position: 'Goalkeeper',
    group: 'Goalkeeper',
    label: 'Goalkeeper',
    shortLabel: 'GK',
    icon: 'Shield',
    developmentTitle: 'Goalkeeper Development',
    dailySessionTitle: 'Reading the Shooter',
    dailySessionDesc: 'Analyze five realistic match situations and choose the best goalkeeper response.',
    scenarioCategories: [
      { id: 'gk-backcourt', name: 'Backcourt Shots', icon: 'Crosshair', description: 'Jump shots from 9m and long-range efforts', scenarioCount: 14, difficulty: 'Intermediate' },
      { id: 'gk-wing', name: 'Wing Shots', icon: 'ArrowRight', description: 'Narrow angle finishes and near-post coverage', scenarioCount: 10, difficulty: 'Intermediate' },
      { id: 'gk-pivot', name: 'Pivot Shots', icon: 'Shield', description: 'Six-metre finishes and back-up coverage', scenarioCount: 9, difficulty: 'Advanced' },
      { id: 'gk-fastbreak', name: 'Fast Breaks', icon: 'Zap', description: 'Quick transition decisions and 1v1 situations', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'gk-7m', name: 'Seven Metre Throws', icon: 'Target', description: 'Penalty reads under pressure', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'gk-7v6', name: 'Seven Against Six', icon: 'Users', description: 'Attack with extra player — spatial reads', scenarioCount: 7, difficulty: 'Expert' },
      { id: 'gk-pressure', name: 'Pressure Situations', icon: 'Clock', description: 'Final-minute pressure and clutch decisions', scenarioCount: 6, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'shooterReading', label: 'Shooter Reading' },
      { key: 'patience', label: 'Patience' },
      { key: 'positioning', label: 'Positioning' },
      { key: 'fastBreak', label: 'Fast Break Performance' },
      { key: 'wingSituations', label: 'Wing Situations' },
      { key: 'sevenMetre', label: 'Seven Metre Situations' },
      { key: 'pressureControl', label: 'Pressure Control' },
    ],
    matchDayReminders: [
      'Stay patient before moving.',
      'Use previous shots as information, not certainty.',
      'Reset immediately after every action.',
    ],
    matchDayPersonalGoals: ['Stay patient', 'Read the shooter', 'Control emotions', 'Improve communication', 'Fast break saves', 'Seven metre saves'],
    matchScenarioTypes: ['Wing Shot', 'Backcourt Jump Shot', '7m Throw', 'Pivot Shot', 'Fast Break', '7 vs 6 Attack', 'Last Attack', 'Breakaway', 'Counter-Attack Read', 'Set Play', 'Crossing Movement', 'Final Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'patience', label: 'Patience' },
      { key: 'readingShooter', label: 'Reading the Shooter' },
      { key: 'fastBreak', label: 'Fast Break Performance' },
      { key: 'wingSituations', label: 'Wing Situations' },
      { key: 'sevenMetre', label: '7m Situations' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Patience Training', 'Reading the Shooter', 'Wing Situations', '7m Throws', 'Pressure Situations', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Calm Reader', 'Aggressive Goalkeeper', 'Reactive Goalkeeper', 'Balanced Goalkeeper', 'Pressure Specialist', 'Developing Goalkeeper'],
  },

  'Centre Back': {
    position: 'Centre Back',
    group: 'Centre Back',
    label: 'Centre Back',
    shortLabel: 'CB',
    icon: 'Target',
    developmentTitle: 'Centre Back Development',
    dailySessionTitle: 'Reading the Defensive System',
    dailySessionDesc: 'Analyze five defensive formations and choose the correct attacking response.',
    scenarioCategories: [
      { id: 'cb-60', name: 'Reading 6:0 Defence', icon: 'Shield', description: 'Recognize and exploit flat defensive formations', scenarioCount: 10, difficulty: 'Intermediate' },
      { id: 'cb-51', name: 'Reading 5:1 Defence', icon: 'Shield', description: 'Handle aggressive man-marking defences', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'cb-321', name: 'Reading 3:2:1 Defence', icon: 'Shield', description: 'Break down complex defensive systems', scenarioCount: 7, difficulty: 'Expert' },
      { id: 'cb-pivot', name: 'Playing With the Pivot', icon: 'Users', description: 'Build the pivot connection', scenarioCount: 9, difficulty: 'Intermediate' },
      { id: 'cb-tempo', name: 'Controlling Tempo', icon: 'Clock', description: 'Manage rhythm and timing of attacks', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'cb-advantage', name: 'Player Advantage', icon: 'Zap', description: 'Exploit numerical superiority situations', scenarioCount: 6, difficulty: 'Intermediate' },
      { id: 'cb-final', name: 'Final Attack', icon: 'Target', description: 'Decide the last possession of a half', scenarioCount: 5, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'gameVision', label: 'Game Vision' },
      { key: 'tempoControl', label: 'Tempo Control' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'passingDecisions', label: 'Passing Decisions' },
      { key: 'pivotConnection', label: 'Pivot Connection' },
      { key: 'leadership', label: 'Leadership' },
      { key: 'pressureDecisions', label: 'Pressure Decisions' },
    ],
    matchDayReminders: [
      'Scan the defence before receiving the ball.',
      'Control the tempo — do not rush the first pass.',
      'Communicate the attacking plan before each phase.',
    ],
    matchDayPersonalGoals: ['Control the tempo', 'Read the defence', 'Connect with the pivot', 'Lead the attack', 'Manage pressure situations', 'Final attack decisions'],
    matchScenarioTypes: ['Reading 6:0', 'Reading 5:1', 'Reading 3:2:1', 'Playing With Pivot', 'Controlling Tempo', 'Player Advantage', 'Final Attack', 'Defensive Transition', 'Power Play', 'Counter-Attack', 'Set Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'gameVision', label: 'Game Vision' },
      { key: 'tempoControl', label: 'Tempo Control' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'passingDecisions', label: 'Passing Decisions' },
      { key: 'pivotConnection', label: 'Pivot Connection' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Defence Reading', 'Tempo Control', 'Pivot Connection', 'Pressure Decisions', 'Player Advantage', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Playmaker', 'Tempo Controller', 'Aggressive Playmaker', 'Balanced Playmaker', 'Pressure Specialist', 'Developing Playmaker'],
  },

  'Left Back': {
    position: 'Left Back',
    group: 'Back',
    label: 'Left Back',
    shortLabel: 'LB',
    icon: 'ArrowLeft',
    developmentTitle: 'Left Back Development',
    dailySessionTitle: 'Decision Making Against 6:0',
    dailySessionDesc: 'Analyze five backcourt situations against a flat defence and choose the best action.',
    scenarioCategories: [
      { id: 'lb-longrange', name: 'Long Range Decisions', icon: 'Crosshair', description: 'Jump shot decisions from 9-10 metres', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'lb-1v1', name: 'One Against One', icon: 'Zap', description: 'Beat your defender in isolation', scenarioCount: 10, difficulty: 'Advanced' },
      { id: 'lb-crossing', name: 'Crossing Actions', icon: 'Activity', description: 'Coordinate with the centre back', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'lb-pivot', name: 'Playing With the Pivot', icon: 'Users', description: 'Feed and combine with the line player', scenarioCount: 9, difficulty: 'Intermediate' },
      { id: 'lb-wing', name: 'Passing to the Wing', icon: 'ArrowRight', description: 'Time and place the wing pass', scenarioCount: 7, difficulty: 'Intermediate' },
      { id: 'lb-defence', name: 'Defensive Pressure', icon: 'Shield', description: 'Defensive transition and positioning', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'lb-shotselection', name: 'Shot Selection', icon: 'Target', description: 'Choose when and where to shoot', scenarioCount: 6, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'shotSelection', label: 'Shot Selection' },
      { key: 'oneOnOne', label: 'One Against One Decisions' },
      { key: 'passingQuality', label: 'Passing Quality' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'timing', label: 'Timing' },
      { key: 'pressureDecisions', label: 'Pressure Decisions' },
    ],
    matchDayReminders: [
      'Attack the space before choosing the final action.',
      'Read the defender\'s stance before committing to the drive.',
      'Time the wing pass — do not force it into coverage.',
    ],
    matchDayPersonalGoals: ['Shot selection', 'One-on-one decisions', 'Creating space', 'Defensive positioning', 'Pressure situations', 'Playing with the pivot'],
    matchScenarioTypes: ['Long Range Shot', 'One Against One', 'Crossing Action', 'Playing With Pivot', 'Passing to Wing', 'Defensive Transition', 'Shot Selection', 'Fast Break', 'Power Play', 'Counter-Attack', 'Set Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'shotSelection', label: 'Shot Selection' },
      { key: 'oneOnOne', label: 'One Against One Decisions' },
      { key: 'passingQuality', label: 'Passing Quality' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Shot Selection', 'One Against One', 'Crossing Actions', 'Defensive Pressure', 'Pressure Decisions', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Power Shooter', 'Playmaking Back', 'Aggressive Driver', 'Balanced Back', 'Pressure Specialist', 'Developing Back'],
  },

  'Right Back': {
    position: 'Right Back',
    group: 'Back',
    label: 'Right Back',
    shortLabel: 'RB',
    icon: 'ArrowRight',
    developmentTitle: 'Right Back Development',
    dailySessionTitle: 'Creating Space for the Pivot',
    dailySessionDesc: 'Analyze five backcourt situations and decide when to create space or feed the pivot.',
    scenarioCategories: [
      { id: 'rb-longrange', name: 'Long Range Decisions', icon: 'Crosshair', description: 'Jump shot decisions from 9-10 metres', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'rb-1v1', name: 'One Against One', icon: 'Zap', description: 'Beat your defender in isolation', scenarioCount: 10, difficulty: 'Advanced' },
      { id: 'rb-crossing', name: 'Crossing Actions', icon: 'Activity', description: 'Coordinate with the centre back', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'rb-pivot', name: 'Playing With the Pivot', icon: 'Users', description: 'Feed and combine with the line player', scenarioCount: 9, difficulty: 'Intermediate' },
      { id: 'rb-wing', name: 'Passing to the Wing', icon: 'ArrowLeft', description: 'Time and place the wing pass', scenarioCount: 7, difficulty: 'Intermediate' },
      { id: 'rb-defence', name: 'Defensive Pressure', icon: 'Shield', description: 'Defensive transition and positioning', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'rb-shotselection', name: 'Shot Selection', icon: 'Target', description: 'Choose when and where to shoot', scenarioCount: 6, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'shotSelection', label: 'Shot Selection' },
      { key: 'oneOnOne', label: 'One Against One Decisions' },
      { key: 'passingQuality', label: 'Passing Quality' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'timing', label: 'Timing' },
      { key: 'pressureDecisions', label: 'Pressure Decisions' },
    ],
    matchDayReminders: [
      'Attack the space before choosing the final action.',
      'Read the defender\'s stance before committing to the drive.',
      'Draw the defender before passing to the pivot.',
    ],
    matchDayPersonalGoals: ['Shot selection', 'One-on-one decisions', 'Creating space', 'Defensive positioning', 'Pressure situations', 'Playing with the pivot'],
    matchScenarioTypes: ['Long Range Shot', 'One Against One', 'Crossing Action', 'Playing With Pivot', 'Passing to Wing', 'Defensive Transition', 'Shot Selection', 'Fast Break', 'Power Play', 'Counter-Attack', 'Set Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'shotSelection', label: 'Shot Selection' },
      { key: 'oneOnOne', label: 'One Against One Decisions' },
      { key: 'passingQuality', label: 'Passing Quality' },
      { key: 'defenceReading', label: 'Defence Reading' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Space Creation', 'One Against One', 'Crossing Actions', 'Defensive Pressure', 'Pressure Decisions', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Power Shooter', 'Playmaking Back', 'Aggressive Driver', 'Balanced Back', 'Pressure Specialist', 'Developing Back'],
  },

  'Left Wing': {
    position: 'Left Wing',
    group: 'Wing',
    label: 'Left Wing',
    shortLabel: 'LW',
    icon: 'ArrowLeft',
    developmentTitle: 'Left Wing Development',
    dailySessionTitle: 'Finishing From Difficult Angles',
    dailySessionDesc: 'Analyze five wing situations and choose the best finishing or passing option.',
    scenarioCategories: [
      { id: 'lw-finishing', name: 'Wing Finishing', icon: 'Target', description: 'Near post, far post or lob decisions', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'lw-fastbreak', name: 'Fast Break Timing', icon: 'Zap', description: 'When to sprint and when to hold position', scenarioCount: 10, difficulty: 'Intermediate' },
      { id: 'lw-narrow', name: 'Narrow Angles', icon: 'Crosshair', description: 'Shooting from impossible positions', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'lw-offball', name: 'Playing Without the Ball', icon: 'Activity', description: 'Movement and positioning off the ball', scenarioCount: 9, difficulty: 'Advanced' },
      { id: 'lw-gkreading', name: 'Goalkeeper Reading', icon: 'Eye', description: 'Read the goalkeeper before finishing', scenarioCount: 7, difficulty: 'Advanced' },
      { id: 'lw-advantage', name: 'Player Advantage', icon: 'Users', description: 'Exploit numerical superiority on the wing', scenarioCount: 6, difficulty: 'Intermediate' },
      { id: 'lw-pressure', name: 'Pressure Finishing', icon: 'Clock', description: 'Final-minute wing situations', scenarioCount: 5, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'finishingDecisions', label: 'Finishing Decisions' },
      { key: 'angleManagement', label: 'Angle Management' },
      { key: 'fastBreakTiming', label: 'Fast Break Timing' },
      { key: 'gkReading', label: 'Goalkeeper Reading' },
      { key: 'movementOffBall', label: 'Movement Without the Ball' },
      { key: 'composure', label: 'Composure' },
      { key: 'pressureFinishing', label: 'Pressure Finishing' },
    ],
    matchDayReminders: [
      'Start the fast break immediately after possession changes.',
      'Read the goalkeeper before choosing near post, far post or lob.',
      'Stay patient on narrow angles — the goalkeeper has less goal to cover.',
    ],
    matchDayPersonalGoals: ['Improve finishing', 'Fast break timing', 'Read the goalkeeper', 'Off-ball movement', 'Pressure finishing', 'Angle management'],
    matchScenarioTypes: ['Wing Finishing', 'Fast Break Timing', 'Narrow Angle', 'Playing Without Ball', 'Goalkeeper Reading', 'Player Advantage', 'Pressure Finishing', 'Defensive Transition', 'Counter-Attack', 'Set Play', 'Power Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'finishingDecisions', label: 'Finishing Decisions' },
      { key: 'angleManagement', label: 'Angle Management' },
      { key: 'fastBreakTiming', label: 'Fast Break Timing' },
      { key: 'gkReading', label: 'Goalkeeper Reading' },
      { key: 'composure', label: 'Composure' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Wing Finishing', 'Fast Break Timing', 'Narrow Angles', 'Goalkeeper Reading', 'Pressure Finishing', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Speed Finisher', 'Technical Finisher', 'Fast Break Specialist', 'Balanced Wing', 'Pressure Finisher', 'Developing Wing'],
  },

  'Right Wing': {
    position: 'Right Wing',
    group: 'Wing',
    label: 'Right Wing',
    shortLabel: 'RW',
    icon: 'ArrowRight',
    developmentTitle: 'Right Wing Development',
    dailySessionTitle: 'Fast Break Timing',
    dailySessionDesc: 'Analyze five wing situations focused on transition and finishing decisions.',
    scenarioCategories: [
      { id: 'rw-finishing', name: 'Wing Finishing', icon: 'Target', description: 'Near post, far post or lob decisions', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'rw-fastbreak', name: 'Fast Break Timing', icon: 'Zap', description: 'When to sprint and when to hold position', scenarioCount: 10, difficulty: 'Intermediate' },
      { id: 'rw-narrow', name: 'Narrow Angles', icon: 'Crosshair', description: 'Shooting from impossible positions', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'rw-offball', name: 'Playing Without the Ball', icon: 'Activity', description: 'Movement and positioning off the ball', scenarioCount: 9, difficulty: 'Advanced' },
      { id: 'rw-gkreading', name: 'Goalkeeper Reading', icon: 'Eye', description: 'Read the goalkeeper before finishing', scenarioCount: 7, difficulty: 'Advanced' },
      { id: 'rw-advantage', name: 'Player Advantage', icon: 'Users', description: 'Exploit numerical superiority on the wing', scenarioCount: 6, difficulty: 'Intermediate' },
      { id: 'rw-pressure', name: 'Pressure Finishing', icon: 'Clock', description: 'Final-minute wing situations', scenarioCount: 5, difficulty: 'Expert' },
    ],
    metrics: [
      { key: 'finishingDecisions', label: 'Finishing Decisions' },
      { key: 'angleManagement', label: 'Angle Management' },
      { key: 'fastBreakTiming', label: 'Fast Break Timing' },
      { key: 'gkReading', label: 'Goalkeeper Reading' },
      { key: 'movementOffBall', label: 'Movement Without the Ball' },
      { key: 'composure', label: 'Composure' },
      { key: 'pressureFinishing', label: 'Pressure Finishing' },
    ],
    matchDayReminders: [
      'Start the fast break immediately after possession changes.',
      'Read the goalkeeper before choosing near post, far post or lob.',
      'Time your sprint — do not arrive too early or too late.',
    ],
    matchDayPersonalGoals: ['Improve finishing', 'Fast break timing', 'Read the goalkeeper', 'Off-ball movement', 'Pressure finishing', 'Angle management'],
    matchScenarioTypes: ['Wing Finishing', 'Fast Break Timing', 'Narrow Angle', 'Playing Without Ball', 'Goalkeeper Reading', 'Player Advantage', 'Pressure Finishing', 'Defensive Transition', 'Counter-Attack', 'Set Play', 'Power Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'finishingDecisions', label: 'Finishing Decisions' },
      { key: 'angleManagement', label: 'Angle Management' },
      { key: 'fastBreakTiming', label: 'Fast Break Timing' },
      { key: 'gkReading', label: 'Goalkeeper Reading' },
      { key: 'composure', label: 'Composure' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Fast Break Timing', 'Wing Finishing', 'Narrow Angles', 'Goalkeeper Reading', 'Pressure Finishing', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Speed Finisher', 'Technical Finisher', 'Fast Break Specialist', 'Balanced Wing', 'Pressure Finisher', 'Developing Wing'],
  },

  Pivot: {
    position: 'Pivot',
    group: 'Pivot',
    label: 'Pivot',
    shortLabel: 'PV',
    icon: 'Shield',
    developmentTitle: 'Pivot Development',
    dailySessionTitle: 'Positioning and Blocking',
    dailySessionDesc: 'Analyze five pivot situations and choose the best positioning or finishing action.',
    scenarioCategories: [
      { id: 'pv-blocking', name: 'Blocking', icon: 'Shield', description: 'Screen and block the goalkeeper\'s view', scenarioCount: 10, difficulty: 'Intermediate' },
      { id: 'pv-positioning', name: 'Positioning', icon: 'Target', description: 'Find the right spot at the six-metre line', scenarioCount: 12, difficulty: 'Intermediate' },
      { id: 'pv-receiving', name: 'Receiving Under Pressure', icon: 'Zap', description: 'Catch and finish under contact', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'pv-creating', name: 'Creating Space', icon: 'Activity', description: 'Open lanes for back players', scenarioCount: 9, difficulty: 'Advanced' },
      { id: 'pv-rotation', name: 'Reading Defensive Rotation', icon: 'Eye', description: 'React to defensive shifting', scenarioCount: 7, difficulty: 'Expert' },
      { id: 'pv-finishing', name: 'Finishing at Six Metres', icon: 'Crosshair', description: 'Close-range finishing decisions', scenarioCount: 8, difficulty: 'Advanced' },
      { id: 'pv-defensive', name: 'Defensive Work', icon: 'Shield', description: 'Transition and defensive duties', scenarioCount: 6, difficulty: 'Intermediate' },
    ],
    metrics: [
      { key: 'positioning', label: 'Positioning' },
      { key: 'blockingDecisions', label: 'Blocking Decisions' },
      { key: 'receivingDecisions', label: 'Receiving Decisions' },
      { key: 'finishing', label: 'Finishing' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'defensiveReading', label: 'Defensive Reading' },
      { key: 'pressureControl', label: 'Pressure Control' },
    ],
    matchDayReminders: [
      'Create space before asking for the ball.',
      'Read the defensive rotation before changing position.',
      'Stay ready for contact — protect the ball on reception.',
    ],
    matchDayPersonalGoals: ['Improve positioning', 'Blocking decisions', 'Receiving under pressure', 'Creating space', 'Finishing at six metres', 'Defensive work'],
    matchScenarioTypes: ['Blocking', 'Positioning', 'Receiving Under Pressure', 'Creating Space', 'Reading Defensive Rotation', 'Finishing at Six Metres', 'Defensive Work', 'Defensive Transition', 'Counter-Attack', 'Set Play', 'Power Play', 'Last Minute'],
    coachReportLabels: [
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'positioning', label: 'Positioning' },
      { key: 'blockingDecisions', label: 'Blocking Decisions' },
      { key: 'receivingDecisions', label: 'Receiving Decisions' },
      { key: 'finishing', label: 'Finishing' },
      { key: 'spaceCreation', label: 'Space Creation' },
      { key: 'pressureHandling', label: 'Pressure Handling' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'mentalPreparation', label: 'Mental Preparation' },
    ],
    trainingPlanFocus: ['Positioning', 'Receiving Under Pressure', 'Creating Space', 'Finishing at Six Metres', 'Pressure Control', 'Match Preparation', 'Recovery and Review'],
    playerTypeOptions: ['Physical Pivot', 'Technical Pivot', 'Mobile Pivot', 'Balanced Pivot', 'Pressure Specialist', 'Developing Pivot'],
  },
};

// ── All positions list ────────────────────────────────────────────────────────

export const ALL_POSITIONS: HandballPosition[] = [
  'Goalkeeper', 'Left Wing', 'Right Wing', 'Pivot', 'Centre Back', 'Left Back', 'Right Back',
];

// ── API helpers ────────────────────────────────────────────────────────────────

/** Returns config only for a validated position — never invents a default. */
export function getPositionConfig(pos: HandballPosition | null | undefined): PositionConfig | null {
  if (!pos || !(pos in POSITION_CONFIGS)) return null;
  return POSITION_CONFIGS[pos];
}

export function getDevelopmentTitle(pos: HandballPosition | null | undefined): string {
  return getPositionConfig(pos)?.developmentTitle ?? '';
}

export function getDailySession(pos: HandballPosition | null | undefined): { title: string; desc: string } | null {
  const cfg = getPositionConfig(pos);
  if (!cfg) return null;
  return { title: cfg.dailySessionTitle, desc: cfg.dailySessionDesc };
}

export function getScenarioCategories(pos: HandballPosition | null | undefined) {
  return getPositionConfig(pos)?.scenarioCategories ?? [];
}

export function getPositionMetrics(pos: HandballPosition | null | undefined) {
  return getPositionConfig(pos)?.metrics ?? [];
}

export function getMatchDayReminders(pos: HandballPosition | null | undefined): string[] {
  return getPositionConfig(pos)?.matchDayReminders ?? [];
}

export function getMatchDayPersonalGoals(pos: HandballPosition | null | undefined): string[] {
  return getPositionConfig(pos)?.matchDayPersonalGoals ?? [];
}

export function getMatchScenarioTypes(pos: HandballPosition | null | undefined): string[] {
  return getPositionConfig(pos)?.matchScenarioTypes ?? [];
}

export function getCoachReportLabels(pos: HandballPosition | null | undefined): { key: string; label: string }[] {
  return getPositionConfig(pos)?.coachReportLabels ?? [];
}

export function getTrainingPlanFocus(pos: HandballPosition | null | undefined): string[] {
  return getPositionConfig(pos)?.trainingPlanFocus ?? [];
}

export function getPlayerTypeOptions(pos: HandballPosition | null | undefined): string[] {
  return getPositionConfig(pos)?.playerTypeOptions ?? [];
}

// ── Age groups and playing levels ──────────────────────────────────────────────

export const AGE_GROUPS: AgeGroup[] = ['Under 14', 'Under 16', 'Under 18', 'Senior'];

export const PLAYING_LEVELS: PlayingLevel[] = ['Beginner', 'Amateur', 'Competitive', 'Semi Professional', 'Professional'];

export const DEVELOPMENT_GOALS: DevelopmentGoal[] = [
  'Decision Making',
  'Tactical Understanding',
  'Mental Preparation',
  'Playing Under Pressure',
  'Reading the Defence',
  'Position Specific Skills',
];
