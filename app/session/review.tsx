import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Check, X, Clock, Target } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { useSession } from '@/context/SessionContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ReviewScreen() {
  const { scenarios, answers } = useSession();
  const { t } = useTranslation();

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{t('sessionReview.title')}</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        <Text style={styles.subtitle}>{t('sessionReview.subtitle')}</Text>

        {/* Scenario reviews */}
        {scenarios.map((scenario, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === scenario.correctIndex;
          const userText = userAnswer !== null ? scenario.options[userAnswer] : t('sessionReview.noAnswer');
          const recommendedText = scenario.options[scenario.correctIndex];

          return (
            <Animated.View
              key={scenario.id}
              entering={FadeInDown.delay(i * 80).duration(400)}
              style={styles.reviewItem}
            >
              <Card variant="gradient" shadow="card" style={styles.reviewCard}>
                {/* Header */}
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewNumber}>{t('sessionReview.situation', { n: i + 1 })}</Text>
                  <View style={[styles.resultBadge, isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeWrong]}>
                    {isCorrect ? <Check size={13} color={Colors.background} /> : <X size={13} color={Colors.error} />}
                    <Text style={[styles.resultBadgeText, isCorrect ? styles.resultBadgeTextCorrect : styles.resultBadgeTextWrong]}>
                      {isCorrect ? t('sessionReview.correct') : t('sessionReview.incorrect')}
                    </Text>
                  </View>
                </View>

                {/* Match info */}
                <View style={styles.matchInfoRow}>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>{scenario.half}</Text>
                  </View>
                  <View style={styles.matchTime}>
                    <Clock size={12} color={Colors.textTertiary} />
                    <Text style={styles.matchTimeText}>{scenario.time}</Text>
                  </View>
                  <Text style={styles.scoreText}>Score {scenario.score}</Text>
                </View>

                {/* Situation */}
                <View style={styles.situationWrap}>
                  <View style={styles.situationIcon}>
                    <Target size={14} color={Colors.gold} />
                  </View>
                  <Text style={styles.situationText} numberOfLines={3}>{scenario.situation}</Text>
                </View>

                {/* User answer */}
                <View style={styles.answerBlock}>
                  <Text style={styles.answerLabel}>{t('sessionReview.yourAnswer')}</Text>
                  <View style={[styles.answerRow, isCorrect ? styles.answerRowCorrect : styles.answerRowWrong]}>
                    <Text style={styles.answerLetter}>{userAnswer !== null ? String.fromCharCode(65 + userAnswer) : '—'}</Text>
                    <Text style={styles.answerText}>{userText}</Text>
                  </View>
                </View>

                {/* Recommended answer */}
                <View style={styles.answerBlock}>
                  <Text style={styles.answerLabel}>{t('sessionReview.recommended')}</Text>
                  <View style={styles.answerRowRecommended}>
                    <Text style={styles.answerLetterRecommended}>{String.fromCharCode(65 + scenario.correctIndex)}</Text>
                    <Text style={styles.answerTextRecommended}>{recommendedText}</Text>
                  </View>
                </View>

                {/* Explanation */}
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationLabel}>{t('sessionReview.explanation')}</Text>
                  <Text style={styles.explanationText}>{scenario.explanation}</Text>
                </View>
              </Card>
            </Animated.View>
          );
        })}

        {/* Button */}
        <View style={styles.buttonWrap}>
          <Button
            label={t('sessionReview.backToResults')}
            onPress={() => router.replace('/(tabs)/home')}
          />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  backBtnPlaceholder: { width: 40 },
  topBarTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  subtitle: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 13, marginBottom: Spacing.lg, textAlign: 'center' },

  reviewItem: { marginBottom: Spacing.md },
  reviewCard: { gap: Spacing.md },

  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewNumber: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1 },
  resultBadgeCorrect: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  resultBadgeWrong: { backgroundColor: Colors.errorSoft, borderColor: Colors.error },
  resultBadgeText: { fontFamily: 'Inter-SemiBold', fontSize: 11 },
  resultBadgeTextCorrect: { color: Colors.background },
  resultBadgeTextWrong: { color: Colors.error },

  matchInfoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold },
  matchBadgeText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11 },
  matchTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  matchTimeText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 13 },
  scoreText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 13 },

  situationWrap: { flexDirection: 'row', gap: Spacing.sm },
  situationIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  situationText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19 },

  answerBlock: { gap: Spacing.xs },
  answerLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1 },

  answerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5 },
  answerRowCorrect: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  answerRowWrong: { backgroundColor: Colors.surface, borderColor: Colors.error },
  answerLetter: { fontFamily: 'Inter-Bold', fontSize: 14, color: Colors.gold, minWidth: 20 },
  answerText: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },

  answerRowRecommended: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.gold, borderWidth: 1.5, borderColor: Colors.gold },
  answerLetterRecommended: { fontFamily: 'Inter-Bold', fontSize: 14, color: Colors.background, minWidth: 20 },
  answerTextRecommended: { flex: 1, color: Colors.background, fontFamily: 'Inter-SemiBold', fontSize: 14, lineHeight: 20 },

  explanationBox: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs },
  explanationLabel: { ...Typography.micro, color: Colors.gold, fontFamily: 'Inter-SemiBold', letterSpacing: 1 },
  explanationText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20 },

  buttonWrap: { marginTop: Spacing.lg },
});
