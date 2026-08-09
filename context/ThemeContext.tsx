import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { applyThemePalette, getPaletteForScheme, ThemePreference, Colors } from '@/lib/theme';
import { loadSettings, saveSettings } from '@/lib/storage';

interface ThemeContextValue {
  preference: ThemePreference;
  scheme: 'light' | 'dark';
  setPreference: (pref: ThemePreference) => void;
  themeVersion: number;
  colors: typeof Colors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveScheme(preference: ThemePreference, system: ColorSchemeName): 'light' | 'dark' {
  if (preference === 'system') return system === 'dark' ? 'dark' : 'light';
  return preference;
}

function migratePreference(): ThemePreference {
  const settings = loadSettings();
  if (settings.theme === 'light' || settings.theme === 'dark' || settings.theme === 'system') {
    return settings.theme;
  }
  // Legacy darkMode boolean → theme preference (Sprint 1 default light for new)
  if (settings.darkMode === true && settings.themeMigrated) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('light');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    setPreferenceState(migratePreference());
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const scheme = resolveScheme(preference, systemScheme);

  useEffect(() => {
    applyThemePalette(getPaletteForScheme(scheme));
    setThemeVersion((v) => v + 1);
  }, [scheme]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    const current = loadSettings();
    saveSettings({
      ...current,
      theme: pref,
      darkMode: pref === 'dark' || (pref === 'system' && Appearance.getColorScheme() === 'dark'),
      themeMigrated: true,
    });
    // Best-effort cloud sync for theme preference
    void import('@/services/preferencesService').then(async ({ syncPreferencesToCloud }) => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const user = (await supabase?.auth.getUser())?.data?.user;
        if (user?.id) await syncPreferencesToCloud(user.id);
      } catch {
        // offline / unauthenticated — local save is enough
      }
    });
  }, []);

  const value = useMemo(
    () => ({ preference, scheme, setPreference, themeVersion, colors: Colors }),
    [preference, scheme, setPreference, themeVersion],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
