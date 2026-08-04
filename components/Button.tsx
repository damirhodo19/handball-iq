import { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, View, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Typography, Spacing } from '@/lib/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'gold' | 'outline' | 'ghost' | 'dark' | 'danger';
  size?: 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
  activeOpacity?: number;
}

export function Button({
  label,
  onPress,
  variant = 'gold',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  style,
  fullWidth = true,
  activeOpacity = 0.85,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const py = size === 'lg' ? 18 : 14;

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'gold' ? Colors.background : Colors.gold} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[
            styles.label,
            variant === 'gold' && styles.labelGold,
            variant === 'outline' && styles.labelOutline,
            variant === 'ghost' && styles.labelGhost,
            variant === 'dark' && styles.labelDark,
            variant === 'danger' && styles.labelDanger,
            size === 'lg' && styles.labelLg,
          ]}>
            {label}
          </Text>
          {iconRight}
        </View>
      )}
    </>
  );

  const wrapperStyle = [styles.touchable, fullWidth && styles.fullWidth, isDisabled && styles.disabled, style];

  if (variant === 'gold') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={wrapperStyle}>
        <LinearGradient
          colors={Colors.goldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.goldBtn, { paddingVertical: py }]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'outline') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={[wrapperStyle, styles.outlineBtn, { paddingVertical: py }]}>
        {content}
      </Pressable>
    );
  }

  if (variant === 'dark') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={[wrapperStyle, styles.darkBtn, { paddingVertical: py }]}>
        {content}
      </Pressable>
    );
  }

  if (variant === 'danger') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={[wrapperStyle, styles.dangerBtn, { paddingVertical: py }]}>
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={[wrapperStyle, { paddingVertical: 12 }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: { borderRadius: Radius.lg, overflow: 'hidden' },
  fullWidth: { width: '100%' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  goldBtn: { borderRadius: Radius.lg },
  label: { ...Typography.bodyStrong, fontSize: 17, fontWeight: '700' },
  labelLg: { fontSize: 17 },
  labelGold: { color: Colors.background },
  labelOutline: { color: Colors.gold },
  labelGhost: { color: Colors.textSecondary },
  labelDark: { color: Colors.textPrimary },
  labelDanger: { color: Colors.error },
  outlineBtn: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    backgroundColor: 'transparent',
  },
  darkBtn: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dangerBtn: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.errorSoft,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  disabled: { opacity: 0.35 },
});
