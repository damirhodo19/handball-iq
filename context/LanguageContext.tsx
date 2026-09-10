import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { SupportedLanguage } from '@/locales';
import { readStorageRaw, writeStorageRaw } from '@/lib/platform-storage';
import { loadSettings, saveSettings, type AppSettings } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { normalizeSupportedLanguage } from '@/lib/locale';
import { createTranslator } from '@/lib/locale-text';

const STORAGE_KEY = 'handball_iq_language';

function getStoredLang(): SupportedLanguage {
  const raw = readStorageRaw(STORAGE_KEY);
  return normalizeSupportedLanguage(raw);
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  const [lang, setLangState] = useState<SupportedLanguage>(() => getStoredLang());

  const setLang = useCallback((newLang: SupportedLanguage) => {
    newLang = normalizeSupportedLanguage(newLang);
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
    if (!profile?.preferred_language) return;
    const cloudLang = normalizeSupportedLanguage(profile.preferred_language, lang);
    if (cloudLang === lang) return;
    setLangState(cloudLang);
    storeLang(cloudLang);
    saveSettings({ ...loadSettings(), language: languageName(cloudLang) });
  }, [profile?.id, profile?.preferred_language]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      return createTranslator(lang)(key, vars);
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
