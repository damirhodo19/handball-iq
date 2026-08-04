export const Colors = {
  // Surfaces
  background: '#0B0B0D',
  surface: '#141417',
  surfaceElevated: '#1A1A1E',
  surfaceRaised: '#222227',
  border: '#2A2A30',
  borderLight: '#1F1F24',
  hairline: 'rgba(255,255,255,0.06)',

  // Text
  white: '#FFFFFF',
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textQuaternary: '#52525B',

  // Brand
  gold: '#D4AF37',
  goldBright: '#E8C547',
  goldDeep: '#A8842A',
  goldGlow: 'rgba(212,175,55,0.18)',
  goldSoft: 'rgba(212,175,55,0.12)',
  goldFaint: 'rgba(212,175,55,0.06)',

  // Status
  success: '#22C55E',
  successSoft: 'rgba(34,197,94,0.12)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245,158,11,0.12)',
  error: '#EF4444',
  errorSoft: 'rgba(239,68,68,0.12)',
  info: '#3B82F6',
  infoSoft: 'rgba(59,130,246,0.12)',

  // Overlays
  overlay: 'rgba(11,11,13,0.92)',
  overlayLight: 'rgba(11,11,13,0.6)',

  // Gradients
  goldGradient: ['#E8C547', '#D4AF37', '#A8842A'] as const,
  surfaceGradient: ['#1A1A1E', '#141417'] as const,
  bgGradient: ['#0B0B0D', '#0E0E11', '#0B0B0D'] as const,
} as const;

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
  sm: 10,
  md: 14,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Motion = {
  spring: { damping: 18, stiffness: 220, mass: 0.9 } as const,
  springGentle: { damping: 26, stiffness: 140, mass: 1 } as const,
  timing: { duration: 400 } as const,
  timingSlow: { duration: 800 } as const,
};
