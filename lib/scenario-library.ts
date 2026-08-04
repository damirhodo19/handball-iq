export interface ScenarioCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  scenarioCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    id: 'fast-break',
    name: 'Fast Break',
    icon: 'Zap',
    description: 'Quick transition decisions and 1v1 situations',
    scenarioCount: 12,
    difficulty: 'Intermediate',
  },
  {
    id: 'wing-shots',
    name: 'Wing Shots',
    icon: 'ArrowRight',
    description: 'Narrow angle finishes and near-post coverage',
    scenarioCount: 10,
    difficulty: 'Intermediate',
  },
  {
    id: '7m-throws',
    name: '7m Throws',
    icon: 'Target',
    description: 'Penalty reads under pressure',
    scenarioCount: 8,
    difficulty: 'Advanced',
  },
  {
    id: 'pivot',
    name: 'Pivot',
    icon: 'Shield',
    description: 'Six-metre finishes and back-up coverage',
    scenarioCount: 9,
    difficulty: 'Advanced',
  },
  {
    id: 'backcourt-shooters',
    name: 'Backcourt Shooters',
    icon: 'Crosshair',
    description: 'Jump shots from left, right and centre back',
    scenarioCount: 14,
    difficulty: 'Intermediate',
  },
  {
    id: '7-vs-6',
    name: '7 vs 6',
    icon: 'Users',
    description: 'Attack with extra player — spatial reads',
    scenarioCount: 7,
    difficulty: 'Expert',
  },
  {
    id: 'last-minute',
    name: 'Last Minute Situations',
    icon: 'Clock',
    description: 'Final-minute pressure and clutch decisions',
    scenarioCount: 6,
    difficulty: 'Expert',
  },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Zap: 'Zap',
  ArrowRight: 'ArrowRight',
  Target: 'Target',
  Shield: 'Shield',
  Crosshair: 'Crosshair',
  Users: 'Users',
  Clock: 'Clock',
};
