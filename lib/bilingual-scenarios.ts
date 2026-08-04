import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/locales';

export interface BilingualScenario {
  title_en?: string;
  title_hr?: string;
  situation_en?: string;
  situation_hr?: string;
  question_en?: string;
  question_hr?: string;
  answer_options_en?: string[];
  answer_options_hr?: string[];
  explanation_en?: string;
  explanation_hr?: string;
  learning_objective_en?: string;
  learning_objective_hr?: string;
  common_mistake_en?: string;
  common_mistake_hr?: string;
  coach_note_en?: string;
  coach_note_hr?: string;
}

export function getScenarioTitle(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.title_hr) return s.title_hr;
  return s.title_en ?? '';
}

export function getScenarioSituation(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.situation_hr) return s.situation_hr;
  return s.situation_en ?? '';
}

export function getScenarioQuestion(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.question_hr) return s.question_hr;
  return s.question_en ?? '';
}

export function getScenarioAnswerOptions(s: BilingualScenario, lang: SupportedLanguage): string[] {
  if (lang === 'hr' && s.answer_options_hr && s.answer_options_hr.length > 0) return s.answer_options_hr;
  return s.answer_options_en ?? [];
}

export function getScenarioExplanation(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.explanation_hr) return s.explanation_hr;
  return s.explanation_en ?? '';
}

export function getScenarioLearningObjective(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.learning_objective_hr) return s.learning_objective_hr;
  return s.learning_objective_en ?? '';
}

export function getScenarioCommonMistake(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.common_mistake_hr) return s.common_mistake_hr;
  return s.common_mistake_en ?? '';
}

export function getScenarioCoachNote(s: BilingualScenario, lang: SupportedLanguage): string {
  if (lang === 'hr' && s.coach_note_hr) return s.coach_note_hr;
  return s.coach_note_en ?? '';
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
