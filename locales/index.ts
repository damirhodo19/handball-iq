export type SupportedLanguage = 'en' | 'hr';

export type TranslationDict = { [key: string]: string | TranslationDict };

import { en } from './en';
import { hr } from './hr';

export const translations: Record<SupportedLanguage, TranslationDict> = { en, hr };
