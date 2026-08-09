import { ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors, Spacing, Typography, Radius } from '@/lib/theme';

export function ScreenBackground({ children, style, edges = ['top', 'bottom'] }: { children: ReactNode; style?: StyleProp<ViewStyle>; edges?: ('top' | 'bottom')[] }) {
  const insets = useSafeAreaInsets();
  const paddingTop = edges.includes('top') ? Math.max(insets.top, Spacing.sm) : 0;
  const paddingBottom = edges.includes('bottom') ? Math.max(insets.bottom, Spacing.sm) : 0;

  return (
    <LinearGradient colors={Colors.bgGradient} style={[styles.bg, { paddingTop, paddingBottom }, style]}>
      {children}
    </LinearGradient>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {action}
    </View>
  );
}

export function StatTile({
  icon,
  value,
  label,
  sublabel,
  accent,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  sublabel?: string;
  accent?: string;
}) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIcon, accent ? { backgroundColor: accent + '20' } : undefined]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sublabel && <Text style={styles.statSublabel}>{sublabel}</Text>}
    </View>
  );
}

export function ProgressBar({
  progress,
  color = Colors.gold,
  height = 6,
  trackColor = Colors.border,
  style,
}: {
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress]);
  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));
  return (
    <View style={[styles.progressTrack, { height, backgroundColor: trackColor }, style]}>
      <Animated.View style={[styles.progressFill, { height, backgroundColor: color }, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { ...Typography.h3, fontFamily: 'Inter-Bold', color: Colors.textPrimary, fontSize: 17 },
  sectionSubtitle: { ...Typography.caption, color: Colors.textTertiary, marginTop: 1 },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: { ...Typography.statSm, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary },
  statLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 0.5, textTransform: 'uppercase' },
  statSublabel: { fontSize: 10, color: Colors.textQuaternary, fontFamily: 'Inter-Regular' },
  progressTrack: { borderRadius: 99, overflow: 'hidden', width: '100%' },
  progressFill: { borderRadius: 99 },
});
