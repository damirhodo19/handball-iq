import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/lib/theme';
import { getBetaVersionLabel } from '@/lib/app-version';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last-resort crash surface for standalone beta builds.
 * Keeps testers from a blank redbox with no recovery path.
 */
export class AppErrorBoundary extends Component<Props, State> {
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
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.version}>{getBetaVersionLabel()}</Text>
        <Text style={styles.body}>
          The app hit an unexpected error. Please restart. If it keeps happening, send beta feedback
          from Settings after relaunch.
        </Text>
        {__DEV__ ? <Text style={styles.dev}>{this.state.error.message}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={this.reset} activeOpacity={0.85}>
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
