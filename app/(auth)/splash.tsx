import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  withTiming,
  withDelay,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';

export default function SplashScreen() {
  const { t } = useTranslation();
  const { session, profile, loading, error, retry } = useAuth();
  const { isDevAuthenticated } = useDevAuth();
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);
  const subOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.3);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 14, stiffness: 120, mass: 0.8 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    glowScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 80 }));
    glowOpacity.value = withDelay(200, withTiming(0.6, { duration: 1000 }));
    titleY.value = withDelay(400, withSpring(0, { damping: 18, stiffness: 200 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (isDevAuthenticated) {
      router.replace('/(tabs)/home');
      return;
    }
    if (!loading) {
      if (session && profile?.onboarded) router.replace('/(tabs)');
      else if (session && !profile?.onboarded) router.replace('/(auth)/onboarding');
      else router.replace('/(auth)/login');
    }
  }, [loading, session, profile, isDevAuthenticated]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));

  return (
    <LinearGradient colors={Colors.bgGradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Animated.View style={[styles.glow, glowStyle]} />
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <LinearGradient colors={Colors.goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoBox}>
              <Text style={styles.logoText}>IQ</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View style={[styles.titleWrap, titleStyle]}>
          <Text style={styles.title}>{t('splash.title1')}</Text>
          <Text style={styles.titleGold}>{t('splash.title2')}</Text>
        </Animated.View>

        <Animated.View style={subStyle}>
          <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(1000).duration(600)}>
        <Text style={styles.footer}>{t('splash.tagline')}</Text>
      </Animated.View>

      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label={t('common.retry')} onPress={retry} variant="outline" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  content: { alignItems: 'center', gap: Spacing.xl },
  logoWrap: { justifyContent: 'center', alignItems: 'center' },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.goldGlow,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 26,
    overflow: 'hidden',
  },
  logoBox: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontFamily: 'Inter-ExtraBold', fontSize: 36, color: Colors.background, letterSpacing: -1 },
  titleWrap: { alignItems: 'center' },
  title: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary, letterSpacing: 6 },
  titleGold: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.gold, letterSpacing: 4, marginTop: 2 },
  subtitle: { ...Typography.body, fontFamily: 'Inter-Medium', color: Colors.textSecondary, letterSpacing: 0.5, marginTop: Spacing.sm },
  footer: { ...Typography.micro, color: Colors.textQuaternary, position: 'absolute', bottom: 60, letterSpacing: 2.5 },
  errorBox: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.xl },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center' },
});
