import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/locales';

export interface BilingualScenario {
  title_en?: string;
  title_hr?: string;
  title_de?: string;
  situation_en?: string;
  situation_hr?: string;
  situation_de?: string;
  question_en?: string;
  question_hr?: string;
  question_de?: string;
  answer_options_en?: string[];
  answer_options_hr?: string[];
  answer_options_de?: string[];
  explanation_en?: string;
  explanation_hr?: string;
  explanation_de?: string;
  learning_objective_en?: string;
  learning_objective_hr?: string;
  learning_objective_de?: string;
  common_mistake_en?: string;
  common_mistake_hr?: string;
  common_mistake_de?: string;
  coach_note_en?: string;
  coach_note_hr?: string;
  coach_note_de?: string;
}

function pickLangField<T>(en: T | undefined, hr: T | undefined, de: T | undefined, lang: SupportedLanguage): T | undefined {
  if (lang === 'hr') return hr ?? en;
  if (lang === 'de') return de ?? en;
  return en;
}

export function getScenarioTitle(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.title_en, s.title_hr, s.title_de, lang) ?? '';
}

export function getScenarioSituation(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.situation_en, s.situation_hr, s.situation_de, lang) ?? '';
}

export function getScenarioQuestion(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.question_en, s.question_hr, s.question_de, lang) ?? '';
}

export function getScenarioAnswerOptions(s: BilingualScenario, lang: SupportedLanguage): string[] {
  return pickLangField(s.answer_options_en, s.answer_options_hr, s.answer_options_de, lang) ?? [];
}

export function getScenarioExplanation(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.explanation_en, s.explanation_hr, s.explanation_de, lang) ?? '';
}

export function getScenarioLearningObjective(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.learning_objective_en, s.learning_objective_hr, s.learning_objective_de, lang) ?? '';
}

export function getScenarioCommonMistake(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.common_mistake_en, s.common_mistake_hr, s.common_mistake_de, lang) ?? '';
}

export function getScenarioCoachNote(s: BilingualScenario, lang: SupportedLanguage): string {
  return pickLangField(s.coach_note_en, s.coach_note_hr, s.coach_note_de, lang) ?? '';
}

export function useScenarioText() {
  const { lang } = useLanguage();
  return {
    lang,
    title: (s: BilingualScenario) => getScenarioTitle(s, lang),
    situation: (s: BilingualScenario) => getScenarioSituation(s, lang),
    question: (s: BilingualScenario) => getScenarioQuestion(s, lang),
    answerOptions: (s: BilingualScenario) => getScenarioAnswerOptions(s, lang),
    explanation: (s: BilingualScenario) => getScenarioExplanation(s, lang),
    learningObjective: (s: BilingualScenario) => getScenarioLearningObjective(s, lang),
    commonMistake: (s: BilingualScenario) => getScenarioCommonMistake(s, lang),
    coachNote: (s: BilingualScenario) => getScenarioCoachNote(s, lang),
  };
}
