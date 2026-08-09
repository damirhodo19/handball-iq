import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '@/lib/theme';

interface LoadingStateProps {
  message?: string;
  accessibilityLabel: string;
}

export function LoadingState({ message, accessibilityLabel }: LoadingStateProps) {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      <ActivityIndicator size="large" color={Colors.gold} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  message: { fontFamily: 'Inter-Medium', fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
