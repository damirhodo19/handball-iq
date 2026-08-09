import type { HandballPosition } from '@/lib/positions';
import type {
  AttackOrDefence,
  DefensiveSystem,
  Difficulty,
  MatchPhase,
  PressureLevel,
} from '@/lib/admin-storage';

export type ScenarioCategory =
  | 'Goalkeeper'
  | 'Left Wing'
  | 'Right Wing'
  | 'Left Back'
  | 'Centre Back'
  | 'Right Back'
  | 'Pivot'
  | 'Defence'
  | 'Fast Break'
  | 'Power Play'
  | 'Short Handed'
  | 'Match Ending'
  | 'Decision Making';

export type DecisionQuality = 'optimal' | 'good' | 'risky' | 'poor';

export interface LocalizedText {
  en: string;
  hr: string;
  de: string;
}

export interface BankAnswer {
  text: LocalizedText;
  quality: DecisionQuality;
  feedback: LocalizedText;
}

/** Professional scenario — canonical content record in the scenario bank. */
export interface BankScenario {
  id: string;
  title: LocalizedText;
  category: ScenarioCategory;
  primaryPosition: HandballPosition | 'All';
  secondaryPositions: HandballPosition[];
  difficulty: Difficulty;
  pressureLevel: PressureLevel;
  attackOrDefence: AttackOrDefence;
  matchPhase: MatchPhase;
  minute: number;
  score: string;
  defensiveSystem?: DefensiveSystem;
  situation: LocalizedText;
  question: LocalizedText;
  answers: [BankAnswer, BankAnswer, BankAnswer, BankAnswer];
  explanation: LocalizedText;
  /** 1–10 quality score from content audit */
  qualityScore: number;
  /** Optional Sprint 5 position-skill tags (language-neutral ids) */
  skillTags?: string[];
}

export const CATEGORY_TARGETS: Record<ScenarioCategory, number> = {
  Goalkeeper: 75,
  'Left Wing': 60,
  'Right Wing': 65,
  'Left Back': 55,
  'Centre Back': 55,
  'Right Back': 55,
  Pivot: 75,
  Defence: 100,
  'Fast Break': 75,
  'Power Play': 50,
  'Short Handed': 50,
  'Match Ending': 75,
  'Decision Making': 75,
};

export const MINIMUM_TOTAL = 700;
