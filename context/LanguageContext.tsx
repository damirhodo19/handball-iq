import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { translations, TranslationDict, SupportedLanguage } from '@/locales';
import { readStorageRaw, writeStorageRaw } from '@/lib/platform-storage';
import { loadSettings, saveSettings, type AppSettings } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'handball_iq_language';

const VALID_LANGS: SupportedLanguage[] = ['en', 'hr', 'de'];

function getStoredLang(): SupportedLanguage {
  const raw = readStorageRaw(STORAGE_KEY);
  if (raw && VALID_LANGS.includes(raw as SupportedLanguage)) return raw as SupportedLanguage;
  return 'en';
}

function storeLang(lang: SupportedLanguage) {
  writeStorageRaw(STORAGE_KEY, lang);
}

function languageName(lang: SupportedLanguage): AppSettings['language'] {
  if (lang === 'de') return 'German';
  if (lang === 'hr') return 'Croatian';
  return 'English';
}

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function resolveKey(dict: TranslationDict, key: string): string | undefined {
  const direct = dict[key];
  if (typeof direct === 'string') return direct;

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
  const { profile, user } = useAuth();
  const [lang, setLangState] = useState<SupportedLanguage>(() => getStoredLang());

  const setLang = useCallback((newLang: SupportedLanguage) => {
    setLangState(newLang);
    storeLang(newLang);
    saveSettings({ ...loadSettings(), language: languageName(newLang) });
    if (user?.id) {
      void import('@/services/preferencesService').then(({ syncPreferencesToCloud }) =>
        syncPreferencesToCloud(user.id),
      ).catch(() => {
        // The local choice stays active and can sync on the next authenticated refresh.
      });
    }
  }, [user?.id]);

  useEffect(() => {
    const cloudLang = profile?.preferred_language as SupportedLanguage | null | undefined;
    if (!cloudLang || !VALID_LANGS.includes(cloudLang) || cloudLang === lang) return;
    setLangState(cloudLang);
    storeLang(cloudLang);
    saveSettings({ ...loadSettings(), language: languageName(cloudLang) });
  }, [profile?.id, profile?.preferred_language]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[lang] ?? translations.en;
      const val = resolveKey(dict, key);
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
