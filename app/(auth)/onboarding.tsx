import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Brain,
  Eye,
  Shield,
  Sparkles,
  Zap,
  Activity,
  Users,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  HandballPosition,
  DominantHand,
  AgeGroup,
  PlayingLevel,
  DevelopmentGoal,
  ALL_POSITIONS,
  AGE_GROUPS,
  PLAYING_LEVELS,
  DEVELOPMENT_GOALS,
  POSITION_CONFIGS,
} from '@/lib/positions';
import { loadProfile, saveProfile } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const POSITION_ICONS: Record<HandballPosition, React.ReactNode> = {
  Goalkeeper: <Shield size={26} color={Colors.gold} />,
  'Left Wing': <ArrowLeft size={26} color={Colors.gold} />,
  'Right Wing': <ArrowRight size={26} color={Colors.gold} />,
  Pivot: <Users size={26} color={Colors.gold} />,
  'Centre Back': <Target size={26} color={Colors.gold} />,
  'Left Back': <ArrowLeft size={26} color={Colors.gold} />,
  'Right Back': <ArrowRight size={26} color={Colors.gold} />,
};

const GOAL_ICONS: Record<DevelopmentGoal, React.ReactNode> = {
  'Decision Making': <Brain size={22} color={Colors.gold} />,
  'Tactical Understanding': <Target size={22} color={Colors.gold} />,
  'Mental Preparation': <Shield size={22} color={Colors.gold} />,
  'Playing Under Pressure': <Zap size={22} color={Colors.gold} />,
  'Reading the Defence': <Eye size={22} color={Colors.gold} />,
  'Position Specific Skills': <Activity size={22} color={Colors.gold} />,
};

const TOTAL_STEPS = 7;

const LANGUAGES: { code: 'en' | 'hr'; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hr', label: 'Hrvatski' },
];

export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const { lang, setLang, t } = useTranslation();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<HandballPosition | null>(null);
  const [secondaryPosition, setSecondaryPosition] = useState<HandballPosition | null>(null);
  const [dominantHand, setDominantHand] = useState<DominantHand | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [playingLevel, setPlayingLevel] = useState<PlayingLevel | null>(null);
  const [developmentGoal, setDevelopmentGoal] = useState<DevelopmentGoal | null>(null);

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return true; // language selection — always proceedable
    if (step === 2) return position !== null;
    if (step === 3) return position !== null; // secondary is optional
    if (step === 4) return dominantHand !== null && ageGroup !== null;
    if (step === 5) return playingLevel !== null && developmentGoal !== null;
    return false;
  };

  const finishOnboarding = useCallback(async () => {
    setSaving(true);
    setError(null);

    // Save to local storage
    const profile = loadProfile();
    saveProfile({
      ...profile,
      position: position ?? 'Goalkeeper',
      secondaryPosition,
      dominantHand: dominantHand ?? 'Right',
      ageGroup,
      playingLevel,
      developmentGoal,
    });

    // Save to Supabase if user is logged in
    if (user) {
      const { error: upsertError } = await supabase!.from('profiles').upsert({
        id: user.id,
        primary_position: position,
        secondary_position: secondaryPosition,
        dominant_hand: dominantHand,
        age_group: ageGroup,
        playing_level: playingLevel as any,
        development_goal: developmentGoal,
        onboarded: true,
        position: position, // Keep legacy column in sync
      });
      if (upsertError) {
        setError(upsertError.message);
        setSaving(false);
        setStep(5);
        return;
      }
      await refreshProfile();
    }

    setSaving(false);
    router.replace('/(tabs)');
  }, [user, position, secondaryPosition, dominantHand, ageGroup, playingLevel, developmentGoal, refreshProfile]);

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <LinearGradient colors={Colors.bgGradient} style={styles.container}>
      {step < TOTAL_STEPS - 1 && (
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === step && styles.progressDotActive,
                i < step && styles.progressDotDone,
              ]}
            />
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={step !== 6}
      >
        {/* Step 0: Welcome */}
        {step === 0 && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.welcomeContainer}>
            <Animated.View
              entering={FadeInDown.delay(100).duration(800).springify().damping(18)}
              style={styles.welcomeGlowWrap}
            >
              <View style={styles.welcomeGlow} />
              <LinearGradient
                colors={Colors.goldGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.welcomeLogo}
              >
                <Text style={styles.welcomeLogoText}>IQ</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.Text entering={FadeInUp.delay(400).duration(600)} style={styles.welcomeTitle}>
              Welcome to{'\n'}Handball IQ
            </Animated.Text>

            <Animated.Text entering={FadeInUp.delay(600).duration(600)} style={styles.welcomeSub}>
              The first AI platform designed to improve handball intelligence for every position.
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.welcomeFeatures}>
              <FeatureRow icon={<Brain size={16} color={Colors.gold} />} text="Position-specific training" />
              <FeatureRow icon={<Shield size={16} color={Colors.gold} />} text="Mental preparation routines" />
              <FeatureRow icon={<Activity size={16} color={Colors.gold} />} text="Performance analytics" />
            </Animated.View>
          </Animated.View>
        )}

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <Animated.View
            key="language"
            entering={SlideInRight.duration(350).springify().damping(20)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconWrap}><Sparkles size={26} color={Colors.gold} /></View>
            <Text style={styles.stepTitle}>{t('onboarding.languageTitle')}</Text>
            <Text style={styles.stepSubtitle}>{t('onboarding.languageSub')}</Text>
            <View style={styles.positionGrid}>
              {LANGUAGES.map((l, i) => (
                <Animated.View key={l.code} entering={FadeInDown.delay(80 + i * 40).duration(400)} style={styles.positionItemWrap}>
                  <TouchableOpacity
                    onPress={() => setLang(l.code)}
                    activeOpacity={0.85}
                    style={[styles.positionChip, lang === l.code && styles.positionChipSelected]}
                  >
                    <View style={styles.positionIconWrap}>
                      <Text style={styles.languageFlag}>{l.code === 'en' ? '🇬🇧' : '🇭🇷'}</Text>
                    </View>
                    <Text style={[styles.positionLabel, lang === l.code && styles.positionLabelSelected]}>{l.label}</Text>
                    {lang === l.code && (
                      <View style={styles.positionCheck}><Check size={12} color={Colors.background} /></View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 2: Choose Your Position */}
        {step === 2 && (
          <Animated.View
            key="position"
            entering={SlideInRight.duration(350).springify().damping(20)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconWrap}><Target size={26} color={Colors.gold} /></View>
            <Text style={styles.stepTitle}>Choose Your Position</Text>
            <Text style={styles.stepSubtitle}>
              Your training plan and match scenarios will be personalized to your role.
            </Text>
            <View style={styles.positionGrid}>
              {ALL_POSITIONS.map((p, i) => (
                <Animated.View key={p} entering={FadeInDown.delay(80 + i * 40).duration(400)} style={styles.positionItemWrap}>
                  <TouchableOpacity
                    onPress={() => setPosition(p)}
                    activeOpacity={0.85}
                    style={[styles.positionChip, position === p && styles.positionChipSelected]}
                  >
                    <View style={styles.positionIconWrap}>{POSITION_ICONS[p]}</View>
                    <Text style={[styles.positionLabel, position === p && styles.positionLabelSelected]}>{p}</Text>
                    {position === p && (
                      <View style={styles.positionCheck}><Check size={12} color={Colors.background} /></View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 3: Secondary Position (optional) */}
        {step === 3 && (
          <Animated.View
            key="secondary"
            entering={SlideInRight.duration(350).springify().damping(20)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconWrap}><Users size={26} color={Colors.gold} /></View>
            <Text style={styles.stepTitle}>Secondary Position</Text>
            <Text style={styles.stepSubtitle}>
              Optional — select a second position if you play multiple roles.
            </Text>
            <View style={styles.positionGrid}>
              {ALL_POSITIONS.filter((p) => p !== position).map((p, i) => (
                <Animated.View key={p} entering={FadeInDown.delay(80 + i * 40).duration(400)} style={styles.positionItemWrap}>
                  <TouchableOpacity
                    onPress={() => setSecondaryPosition(secondaryPosition === p ? null : p)}
                    activeOpacity={0.85}
                    style={[styles.positionChip, secondaryPosition === p && styles.positionChipSelected]}
                  >
                    <View style={styles.positionIconWrap}>{POSITION_ICONS[p]}</View>
                    <Text style={[styles.positionLabel, secondaryPosition === p && styles.positionLabelSelected]}>{p}</Text>
                    {secondaryPosition === p && (
                      <View style={styles.positionCheck}><Check size={12} color={Colors.background} /></View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
            <TouchableOpacity onPress={() => setSecondaryPosition(null)} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip — I only play one position</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Step 4: Dominant Hand + Age Group */}
        {step === 4 && (
          <Animated.View
            key="hand-age"
            entering={SlideInRight.duration(350).springify().damping(20)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconWrap}><Activity size={26} color={Colors.gold} /></View>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepSubtitle}>Tell us a bit more about your profile.</Text>

            {/* Dominant Hand */}
            <Text style={styles.fieldLabel}>Dominant Hand</Text>
            <View style={styles.chipRow}>
              {(['Left', 'Right'] as DominantHand[]).map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.fieldChip, dominantHand === h && styles.fieldChipSelected]}
                  onPress={() => setDominantHand(h)}
                  activeOpacity={0.85}
                >
                  {dominantHand === h && <Check size={14} color={Colors.background} />}
                  <Text style={[styles.fieldChipText, dominantHand === h && styles.fieldChipTextSelected]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age Group */}
            <Text style={styles.fieldLabel}>Age Group</Text>
            <View style={styles.levelList}>
              {AGE_GROUPS.map((ag) => (
                <TouchableOpacity
                  key={ag}
                  style={[styles.levelChip, ageGroup === ag && styles.levelChipSelected]}
                  onPress={() => setAgeGroup(ag)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.levelLabel, ageGroup === ag && styles.levelLabelSelected]}>{ag}</Text>
                  {ageGroup === ag && <View style={styles.levelCheck}><Check size={16} color={Colors.background} /></View>}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 5: Playing Level + Development Goal */}
        {step === 5 && (
          <Animated.View
            key="level-goal"
            entering={SlideInRight.duration(350).springify().damping(20)}
            exiting={SlideOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconWrap}><Sparkles size={26} color={Colors.gold} /></View>
            <Text style={styles.stepTitle}>Your Level & Goal</Text>
            <Text style={styles.stepSubtitle}>We'll focus your training plan around this.</Text>

            {/* Playing Level */}
            <Text style={styles.fieldLabel}>Playing Level</Text>
            <View style={styles.levelList}>
              {PLAYING_LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.levelChip, playingLevel === lvl && styles.levelChipSelected]}
                  onPress={() => setPlayingLevel(lvl)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.levelLabel, playingLevel === lvl && styles.levelLabelSelected]}>{lvl}</Text>
                  {playingLevel === lvl && <View style={styles.levelCheck}><Check size={16} color={Colors.background} /></View>}
                </TouchableOpacity>
              ))}
            </View>

            {/* Development Goal */}
            <Text style={styles.fieldLabel}>Primary Development Goal</Text>
            <View style={styles.goalList}>
              {DEVELOPMENT_GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalChip, developmentGoal === g && styles.goalChipSelected]}
                  onPress={() => setDevelopmentGoal(g)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.goalIcon, developmentGoal === g && styles.goalIconSelected]}>{GOAL_ICONS[g]}</View>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalLabel, developmentGoal === g && styles.goalLabelSelected]}>{g}</Text>
                  </View>
                  {developmentGoal === g && <View style={styles.goalCheck}><Check size={16} color={Colors.background} /></View>}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 6: Loading */}
        {step === 6 && (
          <LoadingScreen
            position={position}
            secondaryPosition={secondaryPosition}
            playingLevel={playingLevel}
            developmentGoal={developmentGoal}
            onFinish={finishOnboarding}
          />
        )}
      </ScrollView>

      {error && step < 6 && <Text style={styles.errorText}>{error}</Text>}

      {step < TOTAL_STEPS - 1 && (
        <View style={styles.navRow}>
          {step > 0 ? (
            <TouchableOpacity onPress={back} style={styles.backBtn}>
              <ArrowLeft size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtnPlaceholder} />
          )}
          <View style={{ flex: 1 }}>
            <Button
              label={step === 0 ? 'Start' : 'Continue'}
              onPress={next}
              disabled={!canProceed()}
              loading={saving}
              iconRight={<ArrowRight size={20} color={Colors.background} />}
            />
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>{icon}</View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function LoadingScreen({
  position,
  secondaryPosition,
  playingLevel,
  developmentGoal,
  onFinish,
}: {
  position: HandballPosition | null;
  secondaryPosition: HandballPosition | null;
  playingLevel: PlayingLevel | null;
  developmentGoal: DevelopmentGoal | null;
  onFinish: () => void;
}) {
  const ringProgress = useSharedValue(0);
  const [statusText, setStatusText] = useState('Analyzing your profile...');
  const [showSummary, setShowSummary] = useState(false);

  const statuses = [
    'Analyzing your profile...',
    'Mapping position scenarios...',
    'Building your training plan...',
    'Calibrating difficulty levels...',
    'Preparing your dashboard...',
  ];

  useEffect(() => {
    ringProgress.value = withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) });

    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setStatusText(statuses[statusIdx]);
      } else {
        clearInterval(statusInterval);
      }
    }, 700);

    const summaryTimer = setTimeout(() => setShowSummary(true), 2800);
    const finishTimer = setTimeout(() => runOnJS(onFinish)(), 4200);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(summaryTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringProgress.value * 360}deg` }],
  }));

  const cfg = position ? POSITION_CONFIGS[position] : null;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.loadingContainer}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.loadingRingWrap}>
        <ProgressRing progress={ringProgress} size={140} strokeWidth={6}>
          <View style={styles.loadingRingInner}>
            <LinearGradient
              colors={Colors.goldGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loadingInnerCircle}
            >
              <Brain size={32} color={Colors.background} />
            </LinearGradient>
          </View>
        </ProgressRing>
      </Animated.View>

      <Animated.Text entering={FadeInUp.delay(200).duration(500)} style={styles.loadingTitle}>
        Creating your personal{'\n'}development plan
      </Animated.Text>

      <Animated.Text entering={FadeIn.delay(300).duration(400)} style={styles.loadingStatus}>
        {statusText}
      </Animated.Text>

      {showSummary && (
        <Animated.View entering={FadeInUp.duration(500)} style={styles.loadingSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Position</Text>
            <Text style={styles.summaryValue}>{position ?? '—'}</Text>
          </View>
          {secondaryPosition && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Secondary</Text>
                <Text style={styles.summaryValue}>{secondaryPosition}</Text>
              </View>
            </>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Level</Text>
            <Text style={styles.summaryValue}>{playingLevel ?? '—'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Focus</Text>
            <Text style={styles.summaryValue}>{developmentGoal ?? '—'}</Text>
          </View>
          {cfg && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Training</Text>
                <Text style={styles.summaryValue}>{cfg.dailySessionTitle}</Text>
              </View>
            </>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.huge },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.gold },
  progressDotDone: { backgroundColor: Colors.goldDeep },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl },

  welcomeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl, paddingVertical: Spacing.xxl },
  welcomeGlowWrap: { justifyContent: 'center', alignItems: 'center' },
  welcomeGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.goldGlow },
  welcomeLogo: { width: 96, height: 96, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  welcomeLogoText: { fontFamily: 'Inter-ExtraBold', fontSize: 34, color: Colors.background, letterSpacing: -1 },
  welcomeTitle: { ...Typography.hero, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 32, textAlign: 'center', lineHeight: 40 },
  welcomeSub: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xl, lineHeight: 24, fontFamily: 'Inter-Medium' },
  welcomeFeatures: { gap: Spacing.md, paddingHorizontal: Spacing.xl, marginTop: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  featureText: { ...Typography.bodySmall, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },

  stepContainer: { flex: 1, alignItems: 'center', paddingTop: Spacing.xl },
  stepIconWrap: { width: 60, height: 60, borderRadius: 18, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  stepTitle: { ...Typography.hero, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 26, textAlign: 'center' },
  stepSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.md, lineHeight: 22 },

  positionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xs },
  positionItemWrap: { width: '47%' },
  positionChip: { alignItems: 'center', gap: 8, paddingVertical: 22, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, position: 'relative' },
  positionChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  positionIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  positionLabel: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  positionLabelSelected: { color: Colors.gold },
  positionCheck: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  languageFlag: { fontSize: 26 },

  skipBtn: { marginTop: Spacing.lg, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  skipText: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 14 },

  fieldLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 13, letterSpacing: 0.5, marginTop: Spacing.lg, marginBottom: Spacing.sm, alignSelf: 'stretch' },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch' },
  fieldChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  fieldChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  fieldChipText: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 16 },
  fieldChipTextSelected: { color: Colors.gold },

  levelList: { gap: Spacing.sm, marginTop: Spacing.sm, width: '100%' },
  levelChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  levelChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  levelLabel: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 16 },
  levelLabelSelected: { color: Colors.gold },
  levelCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  goalList: { gap: Spacing.sm, marginTop: Spacing.sm, width: '100%' },
  goalChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: 14, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  goalChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  goalIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  goalIconSelected: { borderColor: Colors.gold },
  goalInfo: { flex: 1 },
  goalLabel: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 15 },
  goalLabelSelected: { color: Colors.gold },
  goalCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl, paddingVertical: Spacing.xxxl },
  loadingRingWrap: { marginBottom: Spacing.lg },
  loadingRingInner: { justifyContent: 'center', alignItems: 'center' },
  loadingInnerCircle: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  loadingTitle: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 24, textAlign: 'center', lineHeight: 32 },
  loadingStatus: { ...Typography.bodySmall, color: Colors.gold, fontFamily: 'Inter-Medium', fontSize: 14, letterSpacing: 0.5 },
  loadingSummary: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, width: '100%', maxWidth: 320, gap: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...Typography.caption, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 0.5 },
  summaryValue: { ...Typography.bodyStrong, color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 15 },
  summaryDivider: { height: 1, backgroundColor: Colors.hairline },

  navRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, paddingTop: Spacing.md },
  backBtn: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  backBtnPlaceholder: { width: 52 },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
});
