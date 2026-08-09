import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { Shield, Clock, Activity, Check, X, ArrowRight, RefreshCw } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { MatchScoreboard } from '@/components/MatchScoreboard';
import { useMatch, HALFTIME_AFTER_INDEX } from '@/context/MatchContext';
import {
  calculateMentalFocus, calculateMomentum, calculateConfidence,
  calculateDecisionAccuracy,
} from '@/lib/match-engine';
import { generateLocalizedHalftimeMessage } from '@/lib/match-report-i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { localizeContent } from '@/lib/content-localize';
import { translatePressure, translateMomentum, translateConfidence } from '@/lib/translations';
import { localizeMatchSituation } from '@/lib/scenario-localize';

const PRESSURE_COLORS: Record<string, string> = {
  Low: Colors.success,
  Moderate: Colors.info,
  High: Colors.warning,
  Critical: Colors.error,
};

export default function MatchPlayScreen() {
  const { t, lang } = useTranslation();
  const {
    situations, answers, currentIndex, phase,
    submitAnswer, nextSituation, continueSecondHalf, finishMatch,
    pendingAnswerIndex,
  } = useMatch();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const selectingRef = useRef(false);
  const continuingRef = useRef(false);

  const situationRaw = situations[currentIndex] ?? null;
  const situation = useMemo(
    () => (situationRaw ? localizeMatchSituation(situationRaw, lang, t) : null),
    [situationRaw, lang, t],
  );

  const total = situations.length;
  const isLast = total > 0 && currentIndex >= total - 1;
  const lastAnswer = answers.find((a) => a.situationIndex === currentIndex) ?? answers[answers.length - 1];

  useEffect(() => {
    setSelectedId(null);
    setShowFeedback(false);
    setSubmitError(false);
    selectingRef.current = false;
    continuingRef.current = false;
  }, [currentIndex]);

  useEffect(() => {
    if (phase === 'finished') {
      router.replace('/match/report');
    }
  }, [phase]);

  const handleSelect = useCallback((decisionId: string) => {
    if (showFeedback || selectingRef.current || !situationRaw) return;
    selectingRef.current = true;
    setSelectedId(decisionId);
    const ok = submitAnswer(situationRaw, decisionId);
    if (!ok) {
      setSubmitError(true);
      selectingRef.current = false;
      setSelectedId(null);
      return;
    }
    setShowFeedback(true);
  }, [showFeedback, situationRaw, submitAnswer]);

  const handleContinue = useCallback(() => {
    if (!showFeedback || continuingRef.current) return;
    continuingRef.current = true;

    if (isLast) {
      finishMatch();
      return;
    }

    nextSituation();
  }, [showFeedback, isLast, finishMatch, nextSituation]);

  const handleRetryLoad = useCallback(() => {
    router.replace('/match/intro');
  }, []);

  if (situations.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.blockedWrap}>
          <Card variant="gradient" shadow="card" style={styles.blockedCard}>
            <Text style={styles.blockedTitle}>{t('match.loadingNext')}</Text>
            <Text style={styles.blockedSub}>{t('common.errorGeneric')}</Text>
            <Button
              label={t('common.retry')}
              onPress={handleRetryLoad}
              icon={<RefreshCw size={18} color={Colors.background} />}
            />
          </Card>
        </View>
      </ScreenBackground>
    );
  }

  if (phase === 'halftime') {
    return <HalftimeScreen />;
  }

  if (!situationRaw || !situation || situation.decisions.length < 2) {
    return (
      <ScreenBackground>
        <View style={styles.blockedWrap}>
          <Card variant="gradient" shadow="card" style={styles.blockedCard}>
            <Text style={styles.blockedTitle}>{t('match.loadingNext')}</Text>
            <Text style={styles.blockedSub}>
              {t('common.errorGeneric')}
            </Text>
            <Button
              label={t('common.retry')}
              onPress={handleRetryLoad}
              icon={<RefreshCw size={18} color={Colors.background} />}
            />
          </Card>
        </View>
      </ScreenBackground>
    );
  }

  const continueLabel = isLast
    ? t('match.fullTimeReport')
    : currentIndex === HALFTIME_AFTER_INDEX
    ? t('match.halftime')
    : t('match.nextSituation');

  const isSecondHalf = phase === 'second-half';
  const liveMomentum = calculateMomentum(answers);
  const liveConfidence = calculateConfidence(answers);
  const liveAccuracy = calculateDecisionAccuracy(answers);
  const momentumColor = liveMomentum === 'Your Team' ? Colors.success : liveMomentum === 'Opponent' ? Colors.error : Colors.gold;
  const confidenceColor = liveConfidence === 'High' ? Colors.success : liveConfidence === 'Medium' ? Colors.gold : Colors.warning;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.exitRow}>
          <BackButton fallbackHref="/match/intro" />
        </View>

        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIcon}><Shield size={14} color={Colors.gold} /></View>
            <Text style={styles.statusHalf}>{isSecondHalf ? t('match.secondHalf') : t('match.firstHalf')}</Text>
          </View>
          <View style={styles.statusProgress}>
            <ProgressBar progress={(currentIndex + 1) / total} height={4} color={Colors.gold} />
          </View>
          <Text style={styles.statusCount}>{t('match.situationProgress', { n: currentIndex + 1, total })}</Text>
        </View>

        <Animated.View key={`clock-${currentIndex}`} entering={FadeIn.duration(400)}>
          <MatchScoreboard
            minute={situation.minute}
            second={situation.second}
            scoreTeam={situation.scoreTeam}
            scoreOpp={situation.scoreOpp}
            halfLabel={isSecondHalf ? t('match.secondHalf') : t('match.firstHalf')}
            teamLabel={t('match.teamLabel')}
            opponentLabel={t('match.opponentLabel')}
            pressureLabel={translatePressure(situationRaw.pressure, t).toUpperCase()}
            pressureColor={PRESSURE_COLORS[situationRaw.pressure] ?? Colors.gold}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View style={styles.strip}>
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>{t('match.momAbbr')}</Text>
              <Text style={[styles.stripValue, { color: momentumColor }]}>{translateMomentum(liveMomentum, t)}</Text>
            </View>
            <View style={styles.stripDiv} />
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>{t('match.confAbbr')}</Text>
              <Text style={[styles.stripValue, { color: confidenceColor }]}>{translateConfidence(liveConfidence, t)}</Text>
            </View>
            <View style={styles.stripDiv} />
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>{t('match.accAbbr')}</Text>
              <Text style={styles.stripValue}>{liveAccuracy}%</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View key={`sit-${currentIndex}`} entering={FadeInDown.delay(100).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.situationCard}>
            <View style={styles.typeBadgeRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{situation.scenarioType.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.formationRow}>
              <Activity size={13} color={Colors.textTertiary} />
              <Text style={styles.formationText}>{situation.formation}</Text>
            </View>
            <Text style={styles.sitDesc}>{situation.description}</Text>
            <View style={styles.decisionsList}>
              {situation.decisions.map((dec, i) => {
                const isSelected = selectedId === dec.id;
                const isCorrectOpt = dec.id === situationRaw.correctDecisionId;
                const isCorrect = showFeedback && isSelected && isCorrectOpt;
                const isWrong = showFeedback && isSelected && !isCorrectOpt;
                const showCorrectHint = showFeedback && !isSelected && isCorrectOpt;
                const letter = String.fromCharCode(65 + i);
                return (
                  <Animated.View key={dec.id} entering={SlideInDown.delay(150 + i * 60).duration(400)}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={showFeedback}
                      onPress={() => handleSelect(dec.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`${letter}. ${dec.text}`}
                      accessibilityState={{ selected: isSelected, disabled: showFeedback }}
                      style={[
                        styles.decBtn,
                        isSelected && styles.decBtnSelected,
                        isCorrect && styles.decBtnCorrect,
                        isWrong && styles.decBtnWrong,
                        showCorrectHint && styles.decBtnCorrectHint,
                      ]}
                    >
                      <View style={[
                        styles.decLetter,
                        isSelected && styles.decLetterSelected,
                        isCorrect && styles.decLetterCorrect,
                        isWrong && styles.decLetterWrong,
                        showCorrectHint && styles.decLetterCorrect,
                      ]}>
                        <Text style={[
                          styles.decLetterText,
                          (isSelected || isCorrect || isWrong || showCorrectHint) && styles.decLetterTextActive,
                        ]}>{letter}</Text>
                      </View>
                      <Text style={[styles.decText, isSelected && styles.decTextSelected]}>{dec.text}</Text>
                      {isCorrect && <Check size={18} color={Colors.success} />}
                      {isWrong && <X size={18} color={Colors.error} />}
                      {showCorrectHint && <Check size={18} color={Colors.success} />}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {submitError && (
          <Card variant="gradient" shadow="card" style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{t('common.errorGeneric')}</Text>
            <Button label={t('common.retry')} onPress={() => { setSubmitError(false); selectingRef.current = false; }} />
          </Card>
        )}

        {showFeedback && lastAnswer && lastAnswer.situationIndex === currentIndex && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.feedbackWrap}>
            <Card variant="gradient" shadow="card" style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackIcon}>
                  {lastAnswer.isCorrect ? <Check size={16} color={Colors.success} /> : <X size={16} color={Colors.error} />}
                </View>
                <Text style={styles.feedbackTitle}>{lastAnswer.isCorrect ? t('match.correct') : t('match.incorrect')}</Text>
              </View>
              <Text style={styles.feedbackText}>{localizeContent(lastAnswer.feedback, lang, t)}</Text>
              {!lastAnswer.isCorrect ? (
                <Text style={styles.correctHint}>
                  {t('match.correctAnswer')}: {situation.decisions.find((d) => d.id === situationRaw.correctDecisionId)?.text}
                </Text>
              ) : null}
              <Button
                label={continueLabel}
                onPress={handleContinue}
                iconRight={<ArrowRight size={20} color={Colors.background} />}
              />
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function HalftimeScreen() {
  const { t, lang } = useTranslation();
  const { answers, situations, continueSecondHalf } = useMatch();
  const continuingRef = useRef(false);

  const firstAnswers = answers.slice(0, HALFTIME_AFTER_INDEX + 1);
  const firstSituations = situations.slice(0, HALFTIME_AFTER_INDEX + 1);

  const mentalFocus = calculateMentalFocus(firstAnswers, firstSituations);
  const momentum = calculateMomentum(firstAnswers);
  const confidence = calculateConfidence(firstAnswers);
  const accuracy = calculateDecisionAccuracy(firstAnswers);
  const coachMsg = generateLocalizedHalftimeMessage(firstAnswers, firstSituations, t);

  const lastSit = situations[HALFTIME_AFTER_INDEX];
  const scoreTeam = lastSit?.scoreTeam ?? 0;
  const scoreOpp = lastSit?.scoreOpp ?? 0;

  const momentumColor = momentum === 'Your Team' ? Colors.success : momentum === 'Opponent' ? Colors.error : Colors.gold;
  const confidenceColor = confidence === 'High' ? Colors.success : confidence === 'Medium' ? Colors.gold : Colors.warning;

  const handleContinue = () => {
    if (continuingRef.current) return;
    continuingRef.current = true;
    continueSecondHalf();
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.htScroll} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(600)} style={styles.htHero}>
          <View style={styles.htIcon}><Clock size={40} color={Colors.gold} /></View>
          <Text style={styles.htTitle}>{t('match.halftime')}</Text>
          <Text style={styles.htSub}>{t('match.halftimeBreak')}</Text>
          <Text style={styles.htScoreLabel}>{t('match.firstHalfSummary')}</Text>
          <Text style={styles.htScore}>{scoreTeam} – {scoreOpp}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <Card variant="gradient" shadow="card" style={styles.statsCard}>
            <StatRow label={t('match.momentum')} value={translateMomentum(momentum, t)} valueColor={momentumColor} />
            <View style={styles.htDivider} />
            <StatRow label={t('match.confidence')} value={translateConfidence(confidence, t)} valueColor={confidenceColor} />
            <View style={styles.htDivider} />
            <StatRow label={t('match.decisionAccuracy')} value={`${accuracy}%`} />
            <View style={styles.htDivider} />
            <StatRow label={t('match.mentalFocus')} value={`${mentalFocus}%`} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Card variant="gradient" shadow="cardLg" style={styles.coachCard}>
            <View style={styles.coachBox}>
              <View style={styles.coachHeader}>
                <Shield size={14} color={Colors.gold} />
                <Text style={styles.coachLabel}>{t('match.coachMessageHeader')}</Text>
              </View>
              <Text style={styles.coachText}>{coachMsg}</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(600)} style={styles.htBtn}>
          <Button
            label={t('match.continueSecondHalf')}
            onPress={handleContinue}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl },
  exitRow: { marginBottom: Spacing.md, alignSelf: 'flex-start' },
  blockedWrap: { flex: 1, justifyContent: 'center', padding: Spacing.lg },
  blockedCard: { gap: Spacing.md },
  blockedTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  blockedSub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },

  statusBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  statusHalf: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1 },
  statusProgress: { flex: 1 },
  statusCount: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },

  strip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingVertical: Spacing.sm, marginBottom: Spacing.md },
  stripItem: { flex: 1, alignItems: 'center', gap: 2 },
  stripLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.textQuaternary, letterSpacing: 1 },
  stripValue: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.textPrimary },
  stripDiv: { width: 1, height: 24, backgroundColor: Colors.hairline },

  situationCard: { gap: Spacing.md, marginBottom: Spacing.md },
  typeBadgeRow: { flexDirection: 'row' },
  typeBadge: { backgroundColor: Colors.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold },
  typeBadgeText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1 },
  formationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  formationText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  sitDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 23 },

  decisionsList: { gap: Spacing.sm, marginTop: Spacing.xs },
  decBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  decBtnSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  decBtnCorrect: { borderColor: Colors.success, backgroundColor: Colors.successSoft },
  decBtnWrong: { borderColor: Colors.error, backgroundColor: Colors.errorSoft },
  decBtnCorrectHint: { borderColor: Colors.success, backgroundColor: Colors.successSoft, opacity: 0.95 },
  decLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  decLetterSelected: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  decLetterCorrect: { backgroundColor: Colors.success, borderColor: Colors.success },
  decLetterWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  decLetterText: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textSecondary },
  decLetterTextActive: { color: Colors.background },
  decText: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20 },
  decTextSelected: { color: Colors.textPrimary },

  feedbackWrap: { marginBottom: Spacing.lg },
  feedbackCard: { gap: Spacing.md },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  feedbackIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  feedbackTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  feedbackText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  correctHint: { color: Colors.success, fontFamily: 'Inter-SemiBold', fontSize: 13, lineHeight: 19 },

  htScroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 24, paddingBottom: Spacing.xxxl },
  htHero: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  htIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  htTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 32, color: Colors.textPrimary },
  htSub: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textTertiary },
  htScoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1.5, marginTop: Spacing.sm },
  htScore: { fontFamily: 'Inter-ExtraBold', fontSize: 36, color: Colors.gold },
  statsCard: { gap: 0, padding: 0, marginBottom: Spacing.md },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  statLabel: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 14 },
  statValue: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 16 },
  htDivider: { height: 1, backgroundColor: Colors.hairline, marginHorizontal: Spacing.lg },
  coachCard: { gap: 0, padding: 0, marginBottom: 0 },
  coachBox: { padding: Spacing.lg, gap: Spacing.sm },
  coachHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coachLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1 },
  coachText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  htBtn: { marginTop: Spacing.xxl },
});
