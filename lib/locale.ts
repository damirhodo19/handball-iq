import type { SupportedLanguage } from '@/locales';

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  en: 'en',
  eng: 'en',
  english: 'en',
  hr: 'hr',
  hrv: 'hr',
  hrvatski: 'hr',
  croatian: 'hr',
  de: 'de',
  deu: 'de',
  ger: 'de',
  deutsch: 'de',
  german: 'de',
};

export function normalizeSupportedLanguage(
  value: unknown,
  fallback: SupportedLanguage = 'en',
): SupportedLanguage {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase().replace(/_/g, '-');
  if (!normalized) return fallback;
  return LANGUAGE_ALIASES[normalized] ?? LANGUAGE_ALIASES[normalized.split('-')[0]] ?? fallback;
}

export function localeTagForLanguage(lang: SupportedLanguage): string {
  if (lang === 'hr') return 'hr-HR';
  if (lang === 'de') return 'de-DE';
  return 'en-US';
}
