import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Check, X, Clock, Activity } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { useMatch } from '@/context/MatchContext';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePressure } from '@/lib/translations';

const PRESSURE_COLORS: Record<string, string> = {
  Low: Colors.success,
  Moderate: Colors.info,
  High: Colors.warning,
  Critical: Colors.error,
};

const QUALITY_COLORS: Record<string, string> = {
  optimal: Colors.success,
  good: Colors.gold,
  risky: Colors.warning,
  poor: Colors.error,
};

export default function MatchReviewScreen() {
  const { t } = useTranslation();
  const { situations, answers } = useMatch();

  function handleBack() {
    router.back();
  }

  function handleHome() {
    router.push('/(tabs)/home');
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={handleBack}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('sessionReview.title')}</Text>
            <Text style={styles.headerSub}>{t('sessionReview.situation', { n: answers.length })}</Text>
          </View>
        </View>

        {/* Situation-by-situation review */}
        {situations.map((sit, i) => {
          const answer = answers[i];
          if (!answer) return null;
          const chosen = sit.decisions.find((d) => d.id === answer.chosenDecisionId);
          const correct = sit.decisions.find((d) => d.id === sit.correctDecisionId);
          const isCorrect = answer.isCorrect;
          const qualityColor = QUALITY_COLORS[answer.quality] ?? Colors.textTertiary;
          const pressureColor = PRESSURE_COLORS[sit.pressure] ?? Colors.textTertiary;

          return (
            <Animated.View key={sit.index} entering={FadeInDown.delay(i * 50).duration(400)}>
              <Card variant="gradient" shadow="card" style={styles.reviewCard}>
                {/* Situation header */}
                <View style={styles.sitHeader}>
                  <View style={styles.sitHeaderLeft}>
                    <View style={[styles.sitNum, { backgroundColor: qualityColor + '20', borderColor: qualityColor }]}>
                      <Text style={[styles.sitNumText, { color: qualityColor }]}>{i + 1}</Text>
                    </View>
                    <View>
                      <Text style={styles.sitType}>{sit.scenarioType}</Text>
                      <View style={styles.sitMeta}>
                        <Clock size={11} color={Colors.textTertiary} />
                        <Text style={styles.sitMetaText}>
                          {String(sit.minute).padStart(2, '0')}:{String(sit.second).padStart(2, '0')}
                        </Text>
                        <Text style={styles.sitScore}>{sit.scoreTeam}–{sit.scoreOpp}</Text>
                        <View style={[styles.pressureDot, { backgroundColor: pressureColor }]} />
                        <Text style={[styles.sitPressure, { color: pressureColor }]}>{translatePressure(sit.pressure, t)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.resultBadge, { backgroundColor: qualityColor + '20', borderColor: qualityColor }]}>
                    {isCorrect
                      ? <Check size={14} color={qualityColor} />
                      : <X size={14} color={qualityColor} />}
                    <Text style={[styles.resultText, { color: qualityColor }]}>{isCorrect ? t('sessionReview.correct') : t('sessionReview.incorrect')}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.sitDesc}>{sit.description}</Text>

                {/* Your choice */}
                <View style={styles.choiceBox}>
                  <Text style={styles.choiceLabel}>{t('sessionReview.yourAnswer')}</Text>
                  <View style={[styles.choiceRow, !isCorrect && styles.choiceRowWrong]}>
                    {!isCorrect && <X size={14} color={Colors.error} />}
                    <Text style={[styles.choiceText, !isCorrect && { color: Colors.textSecondary }]}>{chosen?.text}</Text>
                  </View>
                </View>

                {/* Correct answer (if wrong) */}
                {!isCorrect && correct && (
                  <View style={styles.choiceBox}>
                    <Text style={styles.choiceLabel}>{t('sessionReview.recommended')}</Text>
                    <View style={[styles.choiceRow, styles.choiceRowCorrect]}>
                      <Check size={14} color={Colors.success} />
                      <Text style={styles.choiceText}>{correct.text}</Text>
                    </View>
                  </View>
                )}

                {/* Feedback */}
                <View style={styles.feedbackBox}>
                  <View style={styles.feedbackIcon}><Activity size={12} color={Colors.gold} /></View>
                  <Text style={styles.feedbackText}>{answer.feedback}</Text>
                </View>
              </Card>
            </Animated.View>
          );
        })}

        {/* Return Home */}
        <TouchableOpacity style={styles.homeBtn} activeOpacity={0.85} onPress={handleHome}>
          <Text style={styles.homeBtnText}>{t('sessionReview.backToResults')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },

  reviewCard: { gap: Spacing.md, marginBottom: Spacing.sm },
  sitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sitHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  sitNum: { width: 32, height: 32, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  sitNumText: { fontFamily: 'Inter-ExtraBold', fontSize: 14 },
  sitType: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  sitMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  sitMetaText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 11 },
  sitScore: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11 },
  pressureDot: { width: 5, height: 5, borderRadius: 3, marginLeft: 4 },
  sitPressure: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5 },

  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  resultText: { fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 0.5 },

  sitDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20 },

  choiceBox: { gap: 6 },
  choiceLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 1 },
  choiceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: Colors.successSoft, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.success },
  choiceRowWrong: { backgroundColor: Colors.errorSoft, borderColor: Colors.error },
  choiceRowCorrect: { backgroundColor: Colors.successSoft, borderColor: Colors.success },
  choiceText: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 13, lineHeight: 19 },

  feedbackBox: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  feedbackIcon: { width: 24, height: 24, borderRadius: 8, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  feedbackText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19 },

  homeBtn: { marginTop: Spacing.xl, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.gold, alignItems: 'center' },
  homeBtnText: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 16 },
});
