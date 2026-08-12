import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Check, X, TrendingUp, TrendingDown, Lightbulb, ArrowRight, Home, RotateCcw } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { ProgressRing } from '@/components/ProgressRing';
import { useSession } from '@/context/SessionContext';
import { getMetricRating } from '@/lib/scenarios';
import { saveSession } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { buildTrainingActivityPayload, processActivity, clearSessionMode, stableActivityId } from '@/lib/development';
import { syncDevelopmentFull } from '@/services/developmentService';
import { persistOrQueue } from '@/services/syncService';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSkill } from '@/lib/translations';
import { getLocalizedSessionResults } from '@/lib/content-localize';

export default function ResultsScreen() {
  const { position, scenarios, answers, decisionScore, correctCount, resetSession } = useSession();
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const activityKeyRef = useRef<string | null>(null);
  const cloudSavedRef = useRef(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [devResult, setDevResult] = useState<{ xp: number; achievements: string[]; levelUp: boolean } | null>(null);

  const sourceId = useMemo(
    () =>
      scenarios.length === 0
        ? ''
        : stableActivityId('s', [
            ...scenarios.map((s) => s.id ?? s.metric),
            ...answers.map((a) => a ?? 'x'),
            position ?? 'no-position',
            decisionScore,
            correctCount,
          ]),
    [scenarios, answers, position, decisionScore, correctCount],
  );

  useEffect(() => {
    if (!sourceId || scenarios.length === 0) return;
    if (activityKeyRef.current === sourceId) return;
    activityKeyRef.current = sourceId;
    const sessionMetrics = scenarios.map((s, i) => ({
      metric: s.metric,
      correct: answers[i] === s.correctIndex,
    }));
    saveSession({
      id: sourceId,
      date: new Date().toISOString(),
      sessionName: scenarios[0]?.metric ?? t('home.trainingSession'),
      position: position ?? undefined,
      decisionScore,
      timeSpent: scenarios.length * 120,
      correctCount,
      totalCount: scenarios.length,
      metrics: sessionMetrics,
    });

    if (position) {
      const payload = buildTrainingActivityPayload(
        scenarios, answers, decisionScore, correctCount, position, sourceId, t('home.trainingSession'),
      );
      const result = processActivity(payload);
      setDevResult({ xp: result.xpEarned, achievements: result.newAchievements, levelUp: result.levelUp });
    }
    clearSessionMode();
  }, [sourceId, scenarios, answers, position, decisionScore, correctCount, t]);

  useEffect(() => {
    if (cloudSavedRef.current || !sourceId || scenarios.length === 0) return;
    if (!user) {
      // Queue once so completed session is never discarded while auth hydrates
      const sessionMetrics = scenarios.map((s, i) => ({
        metric: s.metric,
        correct: answers[i] === s.correctIndex,
      }));
      void persistOrQueue(
        'session',
        {
          session_type: 'training',
          session_name: scenarios[0]?.metric ?? t('home.trainingSession'),
          position,
          score: decisionScore,
          decision_score: decisionScore,
          mental_readiness: 0,
          pressure_control: 0,
          duration_seconds: scenarios.length * 120,
          answers: sessionMetrics,
        },
        { dedupeKey: sourceId },
      );
      return;
    }
    cloudSavedRef.current = true;
    const sessionMetrics = scenarios.map((s, i) => ({
      metric: s.metric,
      correct: answers[i] === s.correctIndex,
    }));
    void persistOrQueue(
      'session',
      {
        session_type: 'training',
        session_name: scenarios[0]?.metric ?? t('home.trainingSession'),
        position,
        score: decisionScore,
        decision_score: decisionScore,
        mental_readiness: 0,
        pressure_control: 0,
        duration_seconds: scenarios.length * 120,
        answers: sessionMetrics,
      },
      { dedupeKey: sourceId, userId: user.id },
    ).then(({ error, queued }) => {
      if (error && !queued) setSaveError(error);
      else if (!error) syncDevelopmentFull(user.id);
      else if (queued) setSaveError(null);
    });
  }, [user, sourceId, scenarios, answers, position, decisionScore, t]);

  const sessionResults = getLocalizedSessionResults(lang);

  const metricKeys = useMemo(() => {
    const fromScenarios = [...new Set(scenarios.map((s) => s.metric).filter(Boolean))];
    return fromScenarios.length > 0 ? fromScenarios : ['decisionMaking', 'pressureControl', 'gameReading'];
  }, [scenarios]);
  const metrics: { name: string; rating: string }[] = metricKeys.map((name) => ({
    name: (() => {
      const key = `iq.skill.${name}`;
      const localized = t(key);
      return localized === key ? translateSkill(name, t) : localized;
    })(),
    rating: getMetricRating(name, countMetricCorrect(name), countMetricTotal(name)),
  }));

  function countMetricCorrect(metric: string): number {
    return scenarios.reduce((count, s, i) => {
      if (s.metric === metric && answers[i] === s.correctIndex) return count + 1;
      return count;
    }, 0);
  }
  function countMetricTotal(metric: string): number {
    return scenarios.filter((s) => s.metric === metric).length;
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: Spacing.md }}>
          <BackButton fallbackHref="/(tabs)/home" />
        </View>
        {saveError && <Text style={{ color: Colors.error, textAlign: 'center', fontFamily: 'Inter-Regular', fontSize: 13, marginBottom: Spacing.sm }}>{t('error.failedSaveSession')}</Text>}

        {devResult && devResult.xp > 0 && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Card variant="gradient" shadow="card" style={{ marginBottom: Spacing.md, padding: Spacing.md, gap: 6 }}>
              <Text style={styles.xpEarned}>+{devResult.xp} XP</Text>
              {devResult.levelUp && <Text style={styles.levelUp}>{t('dev.levelUp')}</Text>}
              {devResult.achievements.length > 0 && (
                <Text style={styles.achievementUnlock}>{t('dev.achievementUnlocked', { n: devResult.achievements.length })}</Text>
              )}
            </Card>
          </Animated.View>
        )}

        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.completeLabel}>{t('training.sessionComplete')}</Text>
          <Text style={styles.sessionTitle}>{t('home.trainingSession')}</Text>
        </Animated.View>

        {/* Score ring */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.scoreRingWrap}>
          <ProgressRing progress={decisionScore / 100} size={160} strokeWidth={12}>
            <View style={styles.ringInner}>
              <Text style={styles.ringValue}>{decisionScore}%</Text>
              <Text style={styles.ringLabel}>{t('term.decisionScore')}</Text>
            </View>
          </ProgressRing>
          <Text style={styles.correctText}>
            {t('training.correctOutOf', { n: correctCount, total: scenarios.length })}
          </Text>
        </Animated.View>

        {/* Metrics */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.performanceMetrics')}</Text>
          <Card variant="gradient" shadow="card" style={styles.metricsCard}>
            {metrics.map((m, i) => (
              <View key={i}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricName}>{translateSkill(m.name, t)}</Text>
                  <View style={[styles.metricBadge, m.rating === 'Strong' && styles.metricBadgeStrong, m.rating === 'Good' && styles.metricBadgeGood, m.rating === 'Developing' && styles.metricBadgeDeveloping]}>
                    <Text style={[styles.metricBadgeText, m.rating === 'Strong' && styles.metricBadgeTextStrong, m.rating === 'Good' && styles.metricBadgeTextGood, m.rating === 'Developing' && styles.metricBadgeTextDeveloping]}>
                      {m.rating === 'Strong' ? t('training.ratingStrong') : m.rating === 'Good' ? t('training.ratingGood') : t('training.ratingDeveloping')}
                    </Text>
                  </View>
                </View>
                {i < metrics.length - 1 && <View style={styles.metricDivider} />}
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Strengths */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.strengths')}</Text>
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            {sessionResults.strengths.map((s, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.listIconGreen}>
                  <Check size={14} color={Colors.success} />
                </View>
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Improve */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.areasToImprove')}</Text>
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            {sessionResults.improve.map((s, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.listIconAmber}>
                  <TrendingUp size={14} color={Colors.warning} />
                </View>
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Recommendation */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.recommendationBox}>
            <View style={styles.recommendationHeader}>
              <Lightbulb size={16} color={Colors.gold} />
              <Text style={styles.recommendationLabel}>{t('training.recommendation')}</Text>
            </View>
            <Text style={styles.recommendationText}>{sessionResults.recommendation}</Text>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.buttonWrap}>
          <Button
            label={t('training.reviewDecisions')}
            variant="dark"
            onPress={() => router.push('/session/review')}
            iconRight={<ArrowRight size={18} color={Colors.gold} />}
          />
          <Button
            label={t('training.returnHome')}
            onPress={() => {
              resetSession();
              router.replace('/(tabs)/home');
            }}
            style={{ marginTop: Spacing.sm }}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 24, paddingBottom: Spacing.xxxl },

  completeLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, letterSpacing: 2, textAlign: 'center' },
  sessionTitle: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 26, lineHeight: 32, textAlign: 'center', marginTop: Spacing.xs },

  scoreRingWrap: { alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xl },
  ringInner: { alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontFamily: 'Inter-ExtraBold', fontSize: 44, color: Colors.textPrimary },
  ringLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 2, marginTop: 4 },
  correctText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 14, marginTop: Spacing.md },

  sectionLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, marginBottom: Spacing.sm },

  metricsCard: { gap: 0, padding: 0, marginBottom: Spacing.xl },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  metricName: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },
  metricBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1 },
  metricBadgeStrong: { backgroundColor: Colors.successSoft, borderColor: Colors.success },
  metricBadgeGood: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  metricBadgeDeveloping: { backgroundColor: Colors.warningSoft, borderColor: Colors.warning },
  metricBadgeText: { fontFamily: 'Inter-SemiBold', fontSize: 12 },
  metricBadgeTextStrong: { color: Colors.success },
  metricBadgeTextGood: { color: Colors.gold },
  metricBadgeTextDeveloping: { color: Colors.warning },
  metricDivider: { height: 1, backgroundColor: Colors.hairline, marginLeft: Spacing.lg },

  listCard: { gap: Spacing.sm, marginBottom: Spacing.xl },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  listIconGreen: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.successSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  listIconAmber: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.warningSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  listText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  recommendationBox: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.xxl, gap: Spacing.sm,
    ...Shadows.gold,
  },
  recommendationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recommendationLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, letterSpacing: 1 },
  recommendationText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  buttonWrap: { gap: Spacing.sm },
  xpEarned: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.gold, textAlign: 'center' },
  levelUp: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success, textAlign: 'center' },
  achievementUnlock: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
});
