import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { useTranslation } from '@/hooks/useTranslation';

type BackButtonProps = {
  /** Override press handler. Default: router.back() or safe fallback. */
  onPress?: () => void;
  /** Route used when there is no navigation history. */
  fallbackHref?: string;
  /** Show accessible text label next to the icon. */
  labeled?: boolean;
  /** Optional custom accessibility / visible label (defaults to common.back). */
  label?: string;
  style?: StyleProp<ViewStyle>;
  /** When true, render nothing (for conditional mounts). */
  hidden?: boolean;
};

/** Player + Coach home share `/(tabs)/home`; ModeContext swaps content. */
const HOME_FALLBACK = '/(tabs)/home';

/**
 * History-aware navigation used by BackButton and secondary CTAs (e.g. Done).
 * Prefer this over bare `router.back()` so deep links / refresh never dead-end.
 */
export function navigateBack(fallbackHref: string = HOME_FALLBACK) {
  if (typeof router.canGoBack === 'function' && router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallbackHref as any);
}

/**
 * Consistent secondary-screen back control.
 * Uses history when available; otherwise falls back to Home (coach-aware via ModeContext).
 */
export function BackButton({
  onPress,
  fallbackHref,
  labeled = false,
  label,
  style,
  hidden = false,
}: BackButtonProps) {
  const { t } = useTranslation();
  const a11y = label ?? t('common.back');

  if (hidden) return null;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigateBack(fallbackHref ?? HOME_FALLBACK);
  };

  if (labeled) {
    return (
      <TouchableOpacity
        testID="app-back-button"
        style={[styles.labeledBtn, style]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={a11y}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.75}
      >
        <View style={styles.iconBtn}>
          <ArrowLeft size={20} color={Colors.gold} />
        </View>
        <Text style={styles.labelText} numberOfLines={1}>
          {a11y}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID="app-back-button"
      style={[styles.iconBtn, style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.75}
    >
      <ArrowLeft size={20} color={Colors.gold} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  labeledBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  labelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.gold,
    flexShrink: 1,
  },
});
