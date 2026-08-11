import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  withTiming,
  withDelay,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { getPendingTeamJoinPath } from '@/lib/team-platform/pending-join';
import { translations, SupportedLanguage } from '@/locales';

function splashCopy(lang: SupportedLanguage) {
  const dict = translations[lang];
  const pick = (key: string) => {
    const val = dict[key];
    return typeof val === 'string' ? val : key;
  };
  return {
    title1: pick('splash.title1'),
    title2: pick('splash.title2'),
    subtitle: pick('splash.subtitle'),
    tagline: pick('splash.tagline'),
  };
}

export default function SplashScreen() {
  const { t, lang } = useTranslation();
  const { session, profile, loading, error, retry } = useAuth();
  const { isDevAuthenticated } = useDevAuth();

  const [visibleLang, setVisibleLang] = useState(lang);
  const [showTagline, setShowTagline] = useState(false);
  const animGen = useRef(0);

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);
  const subOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.3);
  const glowOpacity = useSharedValue(0);

  const resetMotion = () => {
    logoScale.value = 0.5;
    logoOpacity.value = 0;
    titleY.value = 20;
    titleOpacity.value = 0;
    subOpacity.value = 0;
    taglineOpacity.value = 0;
    glowScale.value = 0.3;
    glowOpacity.value = 0;
  };

  const finishSubtitle = (generation: number) => {
    if (animGen.current !== generation) return;
    setShowTagline(true);
    taglineOpacity.value = withTiming(1, { duration: 500 });
  };

  const runEntrance = (generation: number) => {
    resetMotion();
    setShowTagline(false);

    logoScale.value = withSpring(1, { damping: 14, stiffness: 120, mass: 0.8 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    glowScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 80 }));
    glowOpacity.value = withDelay(200, withTiming(0.6, { duration: 1000 }));
    titleY.value = withDelay(400, withSpring(0, { damping: 18, stiffness: 200 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500 }, (finished) => {
        if (finished) runOnJS(finishSubtitle)(generation);
      })
    );
  };

  useEffect(() => {
    if (lang === visibleLang) return;

    const generation = ++animGen.current;
    titleOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (!finished || animGen.current !== generation) return;
      runOnJS(setShowTagline)(false);
      runOnJS(setVisibleLang)(lang);
    });
  }, [lang, visibleLang, titleOpacity]);

  useEffect(() => {
    const generation = ++animGen.current;
    runEntrance(generation);
    return () => {
      animGen.current += 1;
    };
  }, [visibleLang]);

  useEffect(() => {
    if (loading) return;

    if (session && profile?.onboarded) {
      const pendingJoinPath = getPendingTeamJoinPath();
      router.replace((pendingJoinPath ?? '/(tabs)') as never);
      return;
    }
    if (session) {
      router.replace('/(auth)/onboarding');
      return;
    }
    if (__DEV__ && isDevAuthenticated) {
      router.replace('/(tabs)/home');
      return;
    }
    if (error && session) {
      router.replace('/(tabs)/home');
      return;
    }

    let cancelled = false;
    (async () => {
      for (let i = 0; i < 20; i++) {
        if (cancelled) return;
        const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
        if (data.session) return;
        await new Promise((r) => setTimeout(r, 150));
      }
      if (!cancelled) router.replace('/(auth)/login');
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, session, profile, isDevAuthenticated, error]);

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
  const taglineStyle = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));
  const copy = splashCopy(visibleLang);

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

        <Animated.View key={`title-${visibleLang}`} style={[styles.titleWrap, titleStyle]}>
          <Text style={styles.title}>{copy.title1}</Text>
          <Text style={styles.titleGold}>{copy.title2}</Text>
        </Animated.View>

        <Animated.View key={`subtitle-${visibleLang}`} style={subStyle}>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </Animated.View>

        {showTagline ? (
          <Animated.View key={`tagline-${visibleLang}`} style={[styles.taglineWrap, taglineStyle]}>
            <Text style={styles.tagline}>{copy.tagline}</Text>
          </Animated.View>
        ) : null}
      </View>

      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{t(error)}</Text>
          <Button label={t('common.retry')} onPress={retry} variant="outline" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  content: { alignItems: 'center', gap: Spacing.md, width: '100%', maxWidth: 360 },
  logoWrap: { justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
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
  title: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary, letterSpacing: 1.5, textAlign: 'center' },
  titleGold: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.gold, letterSpacing: 1, marginTop: 2, textAlign: 'center' },
  subtitle: { ...Typography.body, fontFamily: 'Inter-Medium', color: Colors.textSecondary, letterSpacing: 0, marginTop: Spacing.sm, textAlign: 'center' },
  taglineWrap: { marginTop: Spacing.xl, width: '100%' },
  tagline: {
    ...Typography.micro,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textQuaternary,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  errorBox: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.xl },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center' },
});
