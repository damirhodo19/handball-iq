import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { translations, TranslationDict, SupportedLanguage } from '@/locales';

const STORAGE_KEY = 'handball_iq_language';

const VALID_LANGS: SupportedLanguage[] = ['en', 'hr'];

function getStoredLang(): SupportedLanguage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw && VALID_LANGS.includes(raw as SupportedLanguage)) return raw as SupportedLanguage;
    }
  } catch {}
  return 'en';
}

function storeLang(lang: SupportedLanguage) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  } catch {}
}

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function resolveKey(dict: TranslationDict, key: string): string | undefined {
  const parts = key.split('.');
  let current: TranslationDict | string = dict;
  for (const part of parts) {
    if (typeof current === 'string' || current === undefined) return undefined;
    current = (current as TranslationDict)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, name) => {
    const val = vars[name];
    return val !== undefined ? String(val) : `{${name}}`;
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    setLangState(getStoredLang());
  }, []);

  const setLang = useCallback((newLang: SupportedLanguage) => {
    setLangState(newLang);
    storeLang(newLang);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[lang] ?? translations.en;
      const val = resolveKey(dict, key) ?? resolveKey(translations.en, key);
      if (val === undefined) return key;
      return interpolate(val, vars);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
