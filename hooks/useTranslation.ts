import { useLanguage } from '@/context/LanguageContext';

export function useTranslation() {
  return useLanguage();
}

export type { SupportedLanguage } from '@/locales';
