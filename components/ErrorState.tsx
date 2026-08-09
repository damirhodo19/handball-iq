import { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Colors, Spacing } from '@/lib/theme';
import { Button } from '@/components/Button';

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onGoBack?: () => void;
  goBackLabel?: string;
  icon?: ReactNode;
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  onGoBack,
  goBackLabel,
  icon,
}: ErrorStateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <View style={styles.iconWrap}>{icon ?? <AlertCircle size={40} color={Colors.error} />}</View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <View style={styles.actions}>
        {onRetry && retryLabel ? <Button label={retryLabel} onPress={onRetry} variant="outline" style={styles.btn} /> : null}
        {onGoBack && goBackLabel ? <Button label={goBackLabel} onPress={onGoBack} variant="dark" style={styles.btn} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  iconWrap: { marginBottom: Spacing.xs },
  title: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary, textAlign: 'center' },
  message: { fontFamily: 'Inter-Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  btn: { minWidth: 140 },
});
