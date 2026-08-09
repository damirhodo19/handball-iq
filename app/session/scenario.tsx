import { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Check, Clock, Target } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { useSession } from '@/context/SessionContext';
import { useTranslation } from '@/hooks/useTranslation';
import { localizeGKScenario } from '@/lib/scenario-localize';

export default function ScenarioScreen() {
  const {
    scenarios,
    currentScenarioIndex,
    selectedIndex,
    confirmed,
    selectAnswer,
    confirmAnswer,
    nextScenario,
    isComplete,
  } = useSession();
  const { t, lang } = useTranslation();

  const scenarioRaw = scenarios[currentScenarioIndex];
  const scenario = useMemo(
    () => (scenarioRaw ? localizeGKScenario(scenarioRaw, lang, t) : null),
    [scenarioRaw, lang, t],
  );
  const progress = ((currentScenarioIndex + (confirmed ? 1 : 0)) / scenarios.length);

  useEffect(() => {
    if (isComplete) {
      router.replace('/session/results');
    }
  }, [isComplete]);

  if (!scenario) {
    return (
      <ScreenBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg, gap: Spacing.lg }}>
          <Text style={{ color: Colors.textSecondary, fontFamily: 'Inter-Regular', textAlign: 'center' }}>{t('session.loadingScenario')}</Text>
          <BackButton labeled label={t('common.back')} fallbackHref="/session" />
        </View>
      </ScreenBackground>
    );
  }

  const isLast = currentScenarioIndex === scenarios.length - 1;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        key={currentScenarioIndex}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <BackButton fallbackHref="/session" />
          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>{t('training.session01')}</Text>
            <Text style={styles.topBarSub}>{t('training.questionProgress', { n: currentScenarioIndex + 1, total: scenarios.length })}</Text>
          </View>
          <View style={styles.backBtnPlaceholder} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} color={Colors.gold} height={4} />
          <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Match info card */}
        <Animated.View entering={FadeIn.duration(400)} key={`match-${currentScenarioIndex}`}>
          <Card variant="gradient" shadow="card" style={styles.matchCard}>
            <View style={styles.matchRow}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{scenario.half}</Text>
              </View>
              <View style={styles.matchTime}>
                <Clock size={13} color={Colors.gold} />
                <Text style={styles.matchTimeText}>{scenario.time}</Text>
              </View>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{t('match.score')}</Text>
              <Text style={styles.scoreValue}>{scenario.score}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Situation */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} key={`sit-${currentScenarioIndex}`}>
          <Text style={styles.sectionLabel}>{t('training.situation')}</Text>
          <Card variant="gradient" shadow="card" style={styles.situationCard}>
            <View style={styles.situationIcon}>
              <Target size={18} color={Colors.gold} />
            </View>
            <Text style={styles.situationText}>{scenario.situation}</Text>
          </Card>
        </Animated.View>

        {/* Question */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} key={`q-${currentScenarioIndex}`}>
          <Text style={styles.questionText}>{scenario.question}</Text>
        </Animated.View>

        {/* Answer options */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} key={`opts-${currentScenarioIndex}`}>
          <View style={styles.optionsContainer}>
            {scenario.options.map((option, i) => {
              const isSelected = selectedIndex === i;
              const letter = String.fromCharCode(65 + i);
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.85}
                  disabled={confirmed}
                  onPress={() => selectAnswer(i)}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                    confirmed && !isSelected && styles.optionDimmed,
                  ]}
                >
                  <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                    <Text style={[styles.optionLetterText, isSelected && styles.optionLetterTextSelected]}>
                      {letter}
                    </Text>
                  </View>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option}
                  </Text>
                  {isSelected && (
                    <View style={styles.optionCheckIcon}>
                      <Check size={16} color={Colors.background} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Confirm / Next button */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} key={`btn-${currentScenarioIndex}`}>
          {confirmed ? (
            <Button
              label={isLast ? t('training.seeResults') : t('training.nextQuestion')}
              onPress={() => {
                if (isLast) {
                  router.replace('/session/results');
                } else {
                  nextScenario();
                }
              }}
            />
          ) : (
            <Button
              label={t('training.confirmAnswer')}
              onPress={confirmAnswer}
              disabled={selectedIndex === null}
            />
          )}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  backBtnPlaceholder: { width: 40 },
  topBarCenter: { alignItems: 'center' },
  topBarTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  topBarSub: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },

  // Progress
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  progressLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, minWidth: 36 },

  // Match card
  matchCard: { marginBottom: Spacing.lg, gap: Spacing.md },
  matchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.sm, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold },
  matchBadgeText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, letterSpacing: 0.5 },
  matchTime: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchTimeText: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreLabel: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 14 },
  scoreValue: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 22 },

  // Situation
  sectionLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, marginBottom: Spacing.sm },
  situationCard: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  situationIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  situationText: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 23 },

  // Question
  questionText: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary, lineHeight: 24, marginBottom: Spacing.lg },

  // Options
  optionsContainer: { gap: Spacing.sm, marginBottom: Spacing.xl },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: 18, paddingHorizontal: Spacing.md, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.gold, borderColor: Colors.gold,
    ...Shadows.gold,
  },
  optionDimmed: { opacity: 0.4 },
  optionLetter: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  optionLetterSelected: { backgroundColor: 'rgba(11,11,13,0.2)', borderColor: 'transparent' },
  optionLetterText: { fontFamily: 'Inter-Bold', fontSize: 14, color: Colors.gold },
  optionLetterTextSelected: { color: Colors.background },
  optionLabel: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 21 },
  optionLabelSelected: { color: Colors.background, fontFamily: 'Inter-SemiBold' },
  optionCheckIcon: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
});
