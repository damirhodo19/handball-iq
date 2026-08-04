import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { Shield, Clock, Activity, Check, X, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { useMatch } from '@/context/MatchContext';
import {
  calculateMentalFocus, calculateMomentum, calculateConfidence,
  calculateDecisionAccuracy, generateHalftimeMessage,
} from '@/lib/match-engine';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePressure, translateMomentum, translateConfidence } from '@/lib/translations';

const PRESSURE_COLORS: Record<string, string> = {
  Low: Colors.success,
  Moderate: Colors.info,
  High: Colors.warning,
  Critical: Colors.error,
};

export default function MatchPlayScreen() {
  const { t } = useTranslation();
  const { situations, answers, currentIndex, phase, submitAnswer, nextSituation, continueSecondHalf, finishMatch } = useMatch();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset selection whenever the current situation index changes
  useEffect(() => {
    setSelectedId(null);
    setShowFeedback(false);
  }, [currentIndex]);

  // Navigate to report when match finishes
  useEffect(() => {
    if (phase === 'finished') {
      router.replace('/match/report');
    }
  }, [phase]);

  if (situations.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>Preparing match...</Text></View>
      </ScreenBackground>
    );
  }

  if (phase === 'halftime') {
    return <HalftimeScreen />;
  }

  const situation = situations[currentIndex];
  if (!situation) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>Loading next situation...</Text></View>
      </ScreenBackground>
    );
  }

  const total = situations.length;
  const isLast = currentIndex === total - 1;

  const handleSelect = (decisionId: string) => {
    if (showFeedback) return;
    setSelectedId(decisionId);
    submitAnswer(situation, decisionId);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (isLast) {
      finishMatch();
    } else {
      nextSituation();
    }
  };

  const continueLabel = isLast
    ? 'Full Time — See Report'
    : currentIndex === 7
    ? t('match.halftime')
    : t('match.nextSituation');

  const isSecondHalf = phase === 'second-half';
  const liveMomentum = calculateMomentum(answers);
  const liveConfidence = calculateConfidence(answers);
  const liveAccuracy = calculateDecisionAccuracy(answers);
  const momentumColor = liveMomentum === 'Your Team' ? Colors.success : liveMomentum === 'Opponent' ? Colors.error : Colors.gold;
  const confidenceColor = liveConfidence === 'High' ? Colors.success : liveConfidence === 'Medium' ? Colors.gold : Colors.warning;

  const lastAnswer = answers[answers.length - 1];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Status bar */}
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

        {/* Clock & Score */}
        <Animated.View key={`clock-${currentIndex}`} entering={FadeIn.duration(400)} style={styles.clockWrap}>
          <View style={styles.clockRow}>
            <View style={styles.clockItem}>
              <Clock size={14} color={Colors.textTertiary} />
              <Text style={styles.clockMinute}>
                {String(situation.minute).padStart(2, '0')}:{String(situation.second).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreBoard}>
              <Text style={styles.scoreText}>{situation.scoreTeam}</Text>
              <Text style={styles.scoreDash}>–</Text>
              <Text style={styles.scoreText}>{situation.scoreOpp}</Text>
            </View>
            <View style={[styles.pressureBadge, { backgroundColor: (PRESSURE_COLORS[situation.pressure] ?? Colors.gold) + '20', borderColor: PRESSURE_COLORS[situation.pressure] ?? Colors.gold }]}>
              <Text style={[styles.pressureText, { color: PRESSURE_COLORS[situation.pressure] ?? Colors.gold }]}>{translatePressure(situation.pressure, t).toUpperCase()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Live stats strip */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View style={styles.strip}>
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>MOM</Text>
              <Text style={[styles.stripValue, { color: momentumColor }]}>{translateMomentum(liveMomentum, t)}</Text>
            </View>
            <View style={styles.stripDiv} />
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>CONF</Text>
              <Text style={[styles.stripValue, { color: confidenceColor }]}>{translateConfidence(liveConfidence, t)}</Text>
            </View>
            <View style={styles.stripDiv} />
            <View style={styles.stripItem}>
              <Text style={styles.stripLabel}>ACC</Text>
              <Text style={styles.stripValue}>{liveAccuracy}%</Text>
            </View>
          </View>
        </Animated.View>

        {/* Situation card */}
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
                const isCorrect = showFeedback && isSelected && dec.id === situation.correctDecisionId;
                const isWrong = showFeedback && isSelected && dec.id !== situation.correctDecisionId;
                const letter = String.fromCharCode(65 + i);
                return (
                  <Animated.View key={dec.id} entering={SlideInDown.delay(150 + i * 60).duration(400)}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={showFeedback}
                      onPress={() => handleSelect(dec.id)}
                      style={[
                        styles.decBtn,
                        isSelected && styles.decBtnSelected,
                        isCorrect && styles.decBtnCorrect,
                        isWrong && styles.decBtnWrong,
                      ]}
                    >
                      <View style={[
                        styles.decLetter,
                        isSelected && styles.decLetterSelected,
                        isCorrect && styles.decLetterCorrect,
                        isWrong && styles.decLetterWrong,
                      ]}>
                        <Text style={[
                          styles.decLetterText,
                          (isSelected || isCorrect || isWrong) && styles.decLetterTextActive,
                        ]}>{letter}</Text>
                      </View>
                      <Text style={[styles.decText, isSelected && styles.decTextSelected]}>{dec.text}</Text>
                      {isCorrect && <Check size={18} color={Colors.success} />}
                      {isWrong && <X size={18} color={Colors.error} />}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* Feedback + continue */}
        {showFeedback && lastAnswer && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.feedbackWrap}>
            <Card variant="gradient" shadow="card" style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackIcon}>
                  {lastAnswer.isCorrect ? <Check size={16} color={Colors.success} /> : <X size={16} color={Colors.error} />}
                </View>
                <Text style={styles.feedbackTitle}>{lastAnswer.isCorrect ? t('match.correct') : t('match.incorrect')}</Text>
              </View>
              <Text style={styles.feedbackText}>{lastAnswer.feedback}</Text>
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

// ── Halftime ──────────────────────────────────────────────────────────────────

function HalftimeScreen() {
  const { t } = useTranslation();
  const { answers, situations, continueSecondHalf } = useMatch();

  const firstAnswers = answers.slice(0, 8);
  const firstSituations = situations.slice(0, 8);

  const mentalFocus = calculateMentalFocus(firstAnswers, firstSituations);
  const momentum = calculateMomentum(firstAnswers);
  const confidence = calculateConfidence(firstAnswers);
  const accuracy = calculateDecisionAccuracy(firstAnswers);
  const coachMsg = generateHalftimeMessage(firstAnswers, firstSituations);

  const lastSit = situations[7];
  const scoreTeam = lastSit?.scoreTeam ?? 0;
  const scoreOpp = lastSit?.scoreOpp ?? 0;

  const momentumColor = momentum === 'Your Team' ? Colors.success : momentum === 'Opponent' ? Colors.error : Colors.gold;
  const confidenceColor = confidence === 'High' ? Colors.success : confidence === 'Medium' ? Colors.gold : Colors.warning;

  const handleContinue = () => {
    continueSecondHalf();
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.htScroll} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(600)} style={styles.htHero}>
          <View style={styles.htIcon}><Clock size={40} color={Colors.gold} /></View>
          <Text style={styles.htTitle}>{t('match.halftime')}</Text>
          <Text style={styles.htScore}>{scoreTeam} – {scoreOpp}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <Card variant="gradient" shadow="card" style={styles.statsCard}>
            <StatRow label="Momentum" value={translateMomentum(momentum, t)} valueColor={momentumColor} />
            <View style={styles.htDivider} />
            <StatRow label="Confidence" value={translateConfidence(confidence, t)} valueColor={confidenceColor} />
            <View style={styles.htDivider} />
            <StatRow label="Decision Accuracy" value={`${accuracy}%`} />
            <View style={styles.htDivider} />
            <StatRow label="Mental Focus" value={`${mentalFocus}%`} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Card variant="gradient" shadow="cardLg" style={styles.coachCard}>
            <View style={styles.coachBox}>
              <View style={styles.coachHeader}>
                <Shield size={14} color={Colors.gold} />
                <Text style={styles.coachLabel}>COACH MESSAGE</Text>
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

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },

  statusBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  statusHalf: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1 },
  statusProgress: { flex: 1 },
  statusCount: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },

  clockWrap: { marginBottom: Spacing.md },
  clockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  clockItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clockMinute: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary, letterSpacing: 1 },
  scoreBoard: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreText: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.gold },
  scoreDash: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textTertiary },
  pressureBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1 },
  pressureText: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5 },

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

  // Halftime
  htScroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 24, paddingBottom: Spacing.xxxl },
  htHero: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  htIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  htTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 32, color: Colors.textPrimary },
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
