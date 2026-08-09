export type ThemePalette = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceRaised: string;
  border: string;
  borderLight: string;
  hairline: string;
  white: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  gold: string;
  goldBright: string;
  goldDeep: string;
  goldGlow: string;
  goldSoft: string;
  goldFaint: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  info: string;
  infoSoft: string;
  overlay: string;
  overlayLight: string;
  goldGradient: readonly [string, string, string];
  surfaceGradient: readonly [string, string];
  bgGradient: readonly [string, string, string];
};

export const lightPalette: ThemePalette = {
  background: '#F7F7F8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceRaised: '#F0F0F2',
  border: '#E4E4E7',
  borderLight: '#EEEEF0',
  hairline: 'rgba(0,0,0,0.06)',
  white: '#FFFFFF',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textTertiary: '#71717A',
  textQuaternary: '#A1A1AA',
  gold: '#C9A227',
  goldBright: '#D4AF37',
  goldDeep: '#A8842A',
  goldGlow: 'rgba(201,162,39,0.16)',
  goldSoft: 'rgba(201,162,39,0.10)',
  goldFaint: 'rgba(201,162,39,0.06)',
  success: '#16A34A',
  successSoft: 'rgba(22,163,74,0.10)',
  warning: '#D97706',
  warningSoft: 'rgba(217,119,6,0.10)',
  error: '#DC2626',
  errorSoft: 'rgba(220,38,38,0.10)',
  info: '#2563EB',
  infoSoft: 'rgba(37,99,235,0.10)',
  overlay: 'rgba(247,247,248,0.92)',
  overlayLight: 'rgba(247,247,248,0.65)',
  goldGradient: ['#D4AF37', '#C9A227', '#A8842A'],
  surfaceGradient: ['#FFFFFF', '#F7F7F8'],
  bgGradient: ['#F7F7F8', '#FFFFFF', '#F7F7F8'],
};

export const darkPalette: ThemePalette = {
  background: '#0B0B0D',
  surface: '#141417',
  surfaceElevated: '#1A1A1E',
  surfaceRaised: '#222227',
  border: '#2A2A30',
  borderLight: '#1F1F24',
  hairline: 'rgba(255,255,255,0.06)',
  white: '#FFFFFF',
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textQuaternary: '#52525B',
  gold: '#D4AF37',
  goldBright: '#E8C547',
  goldDeep: '#A8842A',
  goldGlow: 'rgba(212,175,55,0.18)',
  goldSoft: 'rgba(212,175,55,0.12)',
  goldFaint: 'rgba(212,175,55,0.06)',
  success: '#22C55E',
  successSoft: 'rgba(34,197,94,0.12)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245,158,11,0.12)',
  error: '#EF4444',
  errorSoft: 'rgba(239,68,68,0.12)',
  info: '#3B82F6',
  infoSoft: 'rgba(59,130,246,0.12)',
  overlay: 'rgba(11,11,13,0.92)',
  overlayLight: 'rgba(11,11,13,0.6)',
  goldGradient: ['#E8C547', '#D4AF37', '#A8842A'],
  surfaceGradient: ['#1A1A1E', '#141417'],
  bgGradient: ['#0B0B0D', '#0E0E11', '#0B0B0D'],
};
