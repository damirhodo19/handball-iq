import { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  accessibilityLabel?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  accessibilityLabel,
}: EmptyStateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel={accessibilityLabel ?? title}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} onPress={onSecondary} variant="dark" style={styles.secondary} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.md },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary, textAlign: 'center' },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  action: { marginTop: Spacing.sm, minWidth: 200 },
  secondary: { marginTop: Spacing.xs },
});
