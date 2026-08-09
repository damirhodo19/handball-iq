import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Spacing } from '@/lib/theme';

/** Tab bar content row height (icons + labels), excluding bottom safe inset. */
export const TAB_BAR_BASE_HEIGHT = 56;

/** Clearance gap between the last Home CTA and the top of the tab bar. */
export const TAB_SCREEN_BOTTOM_GAP = Spacing.md; // 16

let cachedCssSafeAreaBottom: number | null = null;

/**
 * CSS env(safe-area-inset-bottom) — used when RN insets are 0 on mobile web
 * (common without viewport-fit=cover / incorrect 100vh sizing).
 */
function readCssSafeAreaBottom(): number {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return 0;
  if (cachedCssSafeAreaBottom != null) return cachedCssSafeAreaBottom;
  try {
    const probe = document.createElement('div');
    probe.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    document.body.appendChild(probe);
    const value = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
    document.body.removeChild(probe);
    cachedCssSafeAreaBottom = Number.isFinite(value) ? value : 0;
  } catch {
    cachedCssSafeAreaBottom = 0;
  }
  return cachedCssSafeAreaBottom;
}

/** Bottom inset for tab bar chrome: RN insets, CSS env, web minimum. */
export function useBottomSafeInset(): number {
  const insets = useSafeAreaInsets();
  const cssBottom = useMemo(() => readCssSafeAreaBottom(), []);
  const webFloor = Platform.OS === 'web' ? 8 : 0;
  return Math.max(insets.bottom, cssBottom, webFloor);
}

/**
 * Estimated tab bar height for the tab navigator style itself
 * (cannot use useBottomTabBarHeight here — that hook is for tab screens).
 */
export function useTabBarHeight(): number {
  return TAB_BAR_BASE_HEIGHT + useBottomSafeInset();
}

/**
 * Scroll/content bottom clearance for screens inside the tab navigator.
 * Uses the measured tab bar height from React Navigation + a small visual gap.
 *
 * Prefer an explicit spacer View in addition to (or instead of) relying solely on
 * contentContainerStyle.paddingBottom — RN-web has dropped padding from scroll
 * extent in some layouts, which left the last CTA under the tab bar.
 */
export function useTabScreenBottomPadding(gap: number = TAB_SCREEN_BOTTOM_GAP): number {
  const measured = useBottomTabBarHeight();
  return measured + gap;
}
