export type { SupportedLanguage, TranslationDict } from './types';

import { en } from './en';
import { hr } from './hr';
import { de } from './de';
import { buildTerminologyLocalePatch } from './handball-terminology';
import type { SupportedLanguage, TranslationDict } from './types';

/** Merge base locale strings with official handball terminology (terminology wins). */
function withTerminology(base: TranslationDict, lang: SupportedLanguage): TranslationDict {
  return { ...base, ...buildTerminologyLocalePatch(lang) };
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: withTerminology(en, 'en'),
  hr: withTerminology(hr, 'hr'),
  de: withTerminology(de, 'de'),
};
