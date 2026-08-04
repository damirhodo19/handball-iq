export type { SupportedLanguage, TranslationDict } from './types';

import { en } from './en';
import { hr } from './hr';
import type { SupportedLanguage, TranslationDict } from './types';

export const translations: Record<SupportedLanguage, TranslationDict> = { en, hr };
