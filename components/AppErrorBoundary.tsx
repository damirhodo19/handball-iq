import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/lib/theme';
import { getBetaVersionLabel } from '@/lib/app-version';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  children: ReactNode;
  t: (key: string) => string;
}

interface State {
  error: Error | null;
}

/**
 * Last-resort crash surface for standalone beta builds.
 * Keeps testers from a blank redbox with no recovery path.
 */
class AppErrorBoundaryInner extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error('[AppErrorBoundary]', error, info.componentStack);
    }
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.container} accessibilityRole="alert">
        <Text style={styles.title}>{this.props.t('errorBoundary.title')}</Text>
        <Text style={styles.version}>{getBetaVersionLabel()}</Text>
        <Text style={styles.body}>{this.props.t('errorBoundary.body')}</Text>
        {__DEV__ ? <Text style={styles.dev}>{this.state.error.message}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={this.reset} activeOpacity={0.85}>
          <Text style={styles.btnText}>{this.props.t('common.tryAgain')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <AppErrorBoundaryInner t={t}>{children}</AppErrorBoundaryInner>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  version: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.textTertiary,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  dev: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.error,
  },
  btn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.background,
  },
});
