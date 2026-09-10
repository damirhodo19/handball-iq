import { translations, type TranslationDict } from '@/locales';
import { normalizeSupportedLanguage } from '@/lib/locale';

export function createTranslator(language: unknown) {
  const dict = translations[normalizeSupportedLanguage(language)];
  return (key: string, vars?: Record<string, string | number>): string => {
    let value: TranslationDict | string | undefined = dict[key];
    if (value === undefined) {
      value = dict;
      for (const part of key.split('.')) {
        value = typeof value === 'object' ? value[part] : undefined;
      }
    }
    if (typeof value !== 'string') return key;
    return value.replace(/\{(\w+)\}/g, (match, name) => vars?.[name] !== undefined ? String(vars[name]) : match);
  };
}

export function pickLocalizedText(text: Record<'en' | 'hr' | 'de', string>, language: unknown): string {
  return text[normalizeSupportedLanguage(language)];
}
