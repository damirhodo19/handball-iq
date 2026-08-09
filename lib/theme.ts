import { darkPalette, lightPalette, type ThemePalette } from '@/lib/theme/palettes';

export type { ThemePalette };
export type ThemePreference = 'light' | 'dark' | 'system';

/** Mutable active palette — light is the Sprint 1 default. */
export const Colors: ThemePalette = { ...lightPalette };

export function applyThemePalette(palette: ThemePalette): void {
  Object.assign(Colors, palette);
}

export function getPaletteForScheme(scheme: 'light' | 'dark'): ThemePalette {
  return scheme === 'dark' ? darkPalette : lightPalette;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Typography = {
  display: { fontSize: 44, fontWeight: '800' as const, lineHeight: 50 },
  hero: { fontSize: 34, fontWeight: '800' as const, lineHeight: 40 },
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyStrong: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  statLg: { fontSize: 40, fontWeight: '800' as const, lineHeight: 44 },
  statMd: { fontSize: 28, fontWeight: '800' as const, lineHeight: 32 },
  statSm: { fontSize: 20, fontWeight: '700' as const, lineHeight: 24 },
} as const;

export const Shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  gold: {
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  float: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const Motion = {
  spring: { damping: 18, stiffness: 220, mass: 0.9 } as const,
  springGentle: { damping: 26, stiffness: 140, mass: 1 } as const,
  timing: { duration: 400 } as const,
  timingSlow: { duration: 800 } as const,
};

export const Accessibility = {
  minTouchTarget: 44,
} as const;
