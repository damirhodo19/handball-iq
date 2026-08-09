import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Star, Target, Shield, Eye, Activity, TrendingUp, FileText, RotateCcw, Home, ChevronRight, Check, X, Brain, Gauge } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { ProgressRing } from '@/components/ProgressRing';
import { useMatch } from '@/context/MatchContext';
import { saveMatchRecord, loadProfile } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { buildMatchActivityPayload, processActivity, stableActivityId } from '@/lib/development';
import { syncDevelopmentFull } from '@/services/developmentService';
import { persistOrQueue } from '@/services/syncService';
import { LoadingState } from '@/components/LoadingState';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocalizedMatchMetadata } from '@/lib/match-config-i18n';
import { translatePosition } from '@/lib/translations';
import { buildLocalizedReportView } from '@/lib/match-report-i18n';
import { snapshotFromMatchReport } from '@/lib/match-history-i18n';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';

export default function MatchReportScreen() {
  const { t } = useTranslation();
  const { report, answers, situations, resetMatch } = useMatch();
  const { user } = useAuth();
  const localSavedKeyRef = useRef<string | null>(null);
  const cloudSavedKeyRef = useRef<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [devResult, setDevResult] = useState<{ xp: number; levelUp: boolean } | null>(null);

  const profile = loadProfile();
  const position = resolvePlayerPosition(profile);
  const positionLabel = position ? translatePosition(position, t) : t('role.player');
  const matchMeta = getLocalizedMatchMetadata(t, positionLabel);

  const localizedReport = report ? buildLocalizedReportView(report, answers, t) : null;

  const sourceId = report
    ? stableActivityId('m', [
        matchMeta.opponent,
        matchMeta.competition,
        report.decisionScore,
        ...answers.map((a) => `${a.situationIndex}:${a.chosenDecisionId}:${a.isCorrect}`),
      ])
    : '';

  // Local progression — independent of auth readiness
  useEffect(() => {
    if (!report || !sourceId || localSavedKeyRef.current === sourceId) return;
    localSavedKeyRef.current = sourceId;
    const reportSnapshot = snapshotFromMatchReport(report);
    saveMatchRecord({
      id: sourceId,
      date: new Date().toISOString(),
      opponent: matchMeta.opponent,
      competition: matchMeta.competition,
      matchRating: report.matchRating,
      decisionScore: report.decisionScore,
      pressureControl: report.pressureControl,
      readingAbility: report.readingAbility,
      consistency: report.consistency,
      reportSnapshot,
      answers,
    });

    if (position) {
      const payload = buildMatchActivityPayload(
        situations, answers, report.decisionScore, position, sourceId,
      );
      const result = processActivity(payload);
      setDevResult({ xp: result.xpEarned, levelUp: result.levelUp });
    }
  }, [report, sourceId, matchMeta, position, situations, answers]);

  // Cloud persistence — retries when user becomes available; queues when offline
  useEffect(() => {
    if (!report || !sourceId || cloudSavedKeyRef.current === sourceId) return;
    const reportSnapshot = snapshotFromMatchReport(report);
    const payload = {
      position: position ?? '',
      opponent: matchMeta.opponent,
      difficulty: matchMeta.competition,
      final_home_score: 0,
      final_away_score: 0,
      overall_rating: report.matchRating,
      decision_score: report.decisionScore,
      pressure_control: report.pressureControl,
      reading_score: report.readingAbility,
      consistency_score: report.consistency,
      answers: answers as any[],
      report: { reportSnapshot } as any,
    };
    if (!user) {
      void persistOrQueue('match', payload, { dedupeKey: sourceId });
      return;
    }
    cloudSavedKeyRef.current = sourceId;
    void persistOrQueue('match', payload, { dedupeKey: sourceId, userId: user.id }).then(
      ({ error, queued }) => {
        if (error && !queued) setSaveError(t('error.failedSaveMatch'));
        else if (!error) syncDevelopmentFull(user.id);
      },
    );
  }, [report, sourceId, user, matchMeta, position, answers, t]);

  useEffect(() => {
    if (!report) {
      const timer = setTimeout(() => router.replace('/(tabs)/home'), 100);
      return () => clearTimeout(timer);
    }
  }, [report]);

  if (!report) {
    return (
      <ScreenBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg, gap: Spacing.lg }}>
          <LoadingState message={t('common.loading')} accessibilityLabel={t('common.loading')} />
          <Button label={t('match.backToHome')} onPress={() => router.replace('/(tabs)/home')} variant="outline" />
        </View>
      </ScreenBackground>
    );
  }

  const lastSituation = situations[situations.length - 1];
  const finalScoreTeam = lastSituation?.scoreTeam ?? 0;
  const finalScoreOpp = lastSituation?.scoreOpp ?? 0;
  const ratingColor = report.matchRating >= 80 ? Colors.success : report.matchRating >= 60 ? Colors.gold : report.matchRating >= 40 ? Colors.warning : Colors.error;

  function handlePlayAgain() {
    resetMatch();
    router.push('/match/intro');
  }

  function handleReview() {
    router.push('/match/review');
  }

  function handleHome() {
    resetMatch();
    router.push('/(tabs)/home');
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: Spacing.md }}>
          <BackButton fallbackHref="/(tabs)/home" />
        </View>
        {saveError ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.saveErrorBanner}>
            <Text style={styles.saveErrorText}>{t('editor.saveFailed')}: {saveError}</Text>
          </Animated.View>
        ) : null}
        {devResult && devResult.xp > 0 ? (
          <Card variant="gradient" shadow="card" style={{ marginBottom: Spacing.md, padding: Spacing.md }}>
            <Text style={{ fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.gold, textAlign: 'center' }}>+{devResult.xp} XP</Text>
            {devResult.levelUp ? <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success, textAlign: 'center', marginTop: 4 }}>{t('dev.levelUp')}</Text> : null}
          </Card>
        ) : null}
        {/* Final Score */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.finalScoreCard}>
            <Text style={styles.finalScoreLabel}>{t('match.finalScore')}</Text>
            <Text style={styles.finalScoreValue}>{finalScoreTeam} – {finalScoreOpp}</Text>
            <View style={styles.decisionHero}>
              <Text style={styles.decisionHeroLabel}>{t('term.decisionScore')}</Text>
              <Text style={styles.decisionHeroValue}>{report.decisionScore}%</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Match Rating Hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.heroWrap}>
          <ProgressRing progress={report.matchRating / 100} size={160} strokeWidth={12} color={ratingColor}>
            <View style={styles.heroInner}>
              <Text style={[styles.heroRating, { color: ratingColor }]}>{report.matchRating}</Text>
              <Text style={styles.heroLabel}>{t('match.overallRating')}</Text>
            </View>
          </ProgressRing>
          <Text style={styles.heroTitle}>{t('match.reportSub')}</Text>
          <Text style={styles.heroSub}>{t('match.reportTitle')}</Text>
        </Animated.View>

        {/* Score Breakdown */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Card variant="gradient" shadow="cardLg" style={styles.scoresCard}>
            <ScoreRow icon={<Target size={16} color={Colors.gold} />} label={t('term.decisionScore')} value={report.decisionScore} />
            <ScoreDivider />
            <ScoreRow icon={<Shield size={16} color={Colors.gold} />} label={t('match.pressureControl')} value={report.pressureControl} />
            <ScoreDivider />
            <ScoreRow icon={<Eye size={16} color={Colors.gold} />} label={t('match.readingAbility')} value={report.readingAbility} />
            <ScoreDivider />
            <ScoreRow icon={<Activity size={16} color={Colors.gold} />} label={t('match.consistency')} value={report.consistency} />
          </Card>
        </Animated.View>

        {/* Strengths */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <SectionLabel label={t('match.strengths')} />
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            {(localizedReport?.strengths ?? []).map((s, i) => (
              <View key={i} style={styles.listRow}>
                <View style={styles.listIconSuccess}><Check size={14} color={Colors.success} /></View>
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Areas to Improve */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <SectionLabel label={t('match.areasToImprove')} />
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            {(localizedReport?.areasToImprove ?? []).map((s, i) => (
              <View key={i} style={styles.listRow}>
                <View style={styles.listIconWarning}><X size={14} color={Colors.warning} /></View>
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* AI Match Summary */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <SectionLabel label={t('match.summary')} />
          <Card variant="gradient" shadow="card" style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}><FileText size={16} color={Colors.gold} /></View>
              <Text style={styles.summaryTitle}>{t('match.coachFinalMessage')}</Text>
            </View>
            <Text style={styles.summaryText}>{localizedReport?.summary ?? ''}</Text>
          </Card>
        </Animated.View>

        {/* Final Message */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <Card variant="gradient" shadow="cardLg" style={styles.finalCard}>
            <View style={styles.finalQuote} />
            <Text style={styles.finalText}>{localizedReport?.finalMessage ?? ''}</Text>
          </Card>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.btnGroup}>
          <Button label={t('match.saveMatch')} onPress={handlePlayAgain} icon={<RotateCcw size={20} color={Colors.background} />} />
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={handleReview}>
              <Text style={styles.secondaryBtnText}>{t('match.reviewAnswers')}</Text>
              <ChevronRight size={16} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={handleHome}>
              <Text style={styles.secondaryBtnText}>{t('match.backToHome')}</Text>
              <Home size={16} color={Colors.gold} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function ScoreRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const color = value >= 75 ? Colors.success : value >= 55 ? Colors.gold : value >= 35 ? Colors.warning : Colors.error;
  return (
    <View style={styles.scoreRow}>
      <View style={styles.scoreLeft}>
        <View style={styles.scoreIcon}>{icon}</View>
        <Text style={styles.scoreLabel}>{label}</Text>
      </View>
      <View style={styles.scoreRight}>
        <View style={styles.scoreBar}>
          <ProgressBar progress={value / 100} height={6} color={color} />
        </View>
        <Text style={[styles.scoreValue, { color }]}>{value}%</Text>
      </View>
    </View>
  );
}

function ScoreDivider() {
  return <View style={styles.scoreDivider} />;
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 24, paddingBottom: Spacing.xxxl },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },
  saveErrorBanner: {
    backgroundColor: Colors.errorSoft,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  saveErrorText: { color: Colors.error, fontFamily: 'Inter-Medium', fontSize: 13, lineHeight: 18 },

  finalScoreCard: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg, paddingVertical: Spacing.xl },
  finalScoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5 },
  finalScoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 40, color: Colors.gold },
  decisionHero: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, marginTop: Spacing.sm, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.hairline, width: '100%', justifyContent: 'center' },
  decisionHeroLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textSecondary },
  decisionHeroValue: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.success },

  // Hero
  heroWrap: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  heroInner: { alignItems: 'center' },
  heroRating: { fontFamily: 'Inter-ExtraBold', fontSize: 48, lineHeight: 52 },
  heroLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 1.5, marginTop: 2 },
  heroTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary, marginTop: Spacing.sm },
  heroSub: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14, letterSpacing: 1 },

  // Scores
  scoresCard: { gap: 0, padding: 0 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  scoreLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  scoreIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  scoreLabel: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 14 },
  scoreRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scoreBar: { width: 80 },
  scoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 18, minWidth: 42, textAlign: 'right' },
  scoreDivider: { height: 1, backgroundColor: Colors.hairline, marginHorizontal: Spacing.lg },

  // Lists
  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  listCard: { gap: Spacing.md },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  listIconSuccess: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.successSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  listIconWarning: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.warningSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  listText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  // Summary
  summaryCard: { gap: Spacing.md },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  summaryTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  summaryText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },

  // Final message
  finalCard: { gap: Spacing.md },
  finalQuote: { width: 3, height: 40, backgroundColor: Colors.gold, borderRadius: 2 },
  finalText: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, lineHeight: 23, fontStyle: 'italic' },

  // Buttons
  btnGroup: { marginTop: Spacing.xxl, gap: Spacing.md },
  btnRow: { flexDirection: 'row', gap: Spacing.md },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.gold },
  secondaryBtnText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 15 },
});
