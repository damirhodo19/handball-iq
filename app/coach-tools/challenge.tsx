import { pickLocalizedText as pickLocalized } from '@/lib/locale-text';
import { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton, navigateBack } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';
import {
  getCoachChallengeById,
  pickCoachChallengeForProfile,
  recordChallengeAttempt,
} from '@/lib/coach-platform';
import { loadProfile } from '@/lib/storage';
import type { CoachChallengeAnswer } from '@/lib/coach-platform';


export default function CoachChallengeScreen() {
  const { t, lang } = useTranslation();
  const { themeVersion } = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const profile = loadProfile();

  const challenge = useMemo(() => {
    if (params.id) {
      return getCoachChallengeById(String(params.id)) ?? pickCoachChallengeForProfile({
        coachType: profile.coachType,
        experienceBand: profile.experienceBand,
        developmentGoal: profile.coachDevelopmentGoal ?? profile.developmentGoal,
        favoriteDefense: profile.favoriteDefense,
        favoriteAttack: profile.favoriteAttack,
      });
    }
    return pickCoachChallengeForProfile({
      coachType: profile.coachType,
      experienceBand: profile.experienceBand,
      developmentGoal: profile.coachDevelopmentGoal ?? profile.developmentGoal,
      favoriteDefense: profile.favoriteDefense,
      favoriteAttack: profile.favoriteAttack,
    });
  }, [
    params.id,
    profile.coachType,
    profile.experienceBand,
    profile.coachDevelopmentGoal,
    profile.developmentGoal,
    profile.favoriteDefense,
    profile.favoriteAttack,
  ]);

  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const styles = useMemo(() => createStyles(), [themeVersion]);

  const chosen: CoachChallengeAnswer | undefined = challenge.answers.find((a) => a.id === selected);
  const optimal = challenge.answers.find((a) => a.quality === 'optimal');

  const confirm = () => {
    if (confirmed || !selected || !chosen) return;
    setConfirmed(true);
    const day = new Date().toISOString().slice(0, 10);
    // One logical completion per challenge per calendar day
    recordChallengeAttempt({
      id: `att_${challenge.id}_${day}`,
      date: new Date().toISOString(),
      challengeId: challenge.id,
      category: challenge.category,
      difficulty: challenge.difficulty,
      chosenAnswerId: selected,
      isCorrect: chosen.quality === 'optimal',
      quality: chosen.quality,
    });
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <BackButton labeled label={t('common.back')} fallbackHref="/(tabs)/home" style={{ marginBottom: Spacing.sm }} />

        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.eyebrow}>{t(`coachChallenge.cat.${challenge.category}`)}</Text>
          <Text style={styles.title}>{t('coachChallenge.title')}</Text>
          <Text style={styles.meta}>{t(`difficulty.${challenge.difficulty.toLowerCase()}`)}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.card}>
          <Text style={styles.situation}>{pickLocalized(challenge.situation, lang)}</Text>
          <Text style={styles.question}>{pickLocalized(challenge.question, lang)}</Text>
        </Animated.View>

        <View style={styles.answers}>
          {challenge.answers.map((ans, i) => {
            const isSelected = selected === ans.id;
            let border = Colors.border;
            if (confirmed && ans.quality === 'optimal') border = Colors.success;
            else if (confirmed && isSelected && ans.quality !== 'optimal') border = Colors.error;
            else if (isSelected) border = Colors.gold;
            return (
              <TouchableOpacity
                key={ans.id}
                disabled={confirmed}
                onPress={() => setSelected(ans.id)}
                style={[styles.answer, { borderColor: border }]}
                activeOpacity={0.85}
              >
                <Text style={styles.answerIndex}>{String.fromCharCode(65 + i)}</Text>
                <Text style={styles.answerText}>{pickLocalized(ans.text, lang)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!confirmed ? (
          <Button
            label={t('coachChallenge.confirm')}
            onPress={confirm}
            disabled={!selected}
          />
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.resultCard}>
            <CheckCircle2 size={22} color={chosen?.quality === 'optimal' ? Colors.success : Colors.gold} />
            <Text style={styles.resultTitle}>
              {chosen?.quality === 'optimal' ? t('coachChallenge.correct') : t('coachChallenge.review')}
            </Text>
            {chosen ? (
              <Text style={styles.feedback}>{pickLocalized(chosen.feedback, lang)}</Text>
            ) : null}
            {optimal && chosen?.quality !== 'optimal' ? (
              <Text style={styles.optimal}>
                {t('coachChallenge.best')}: {pickLocalized(optimal.text, lang)}
              </Text>
            ) : null}
            <Text style={styles.explanation}>{pickLocalized(challenge.explanation, lang)}</Text>
            <Button label={t('coachChallenge.done')} onPress={() => navigateBack('/(tabs)/home')} />
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function createStyles() {
  return StyleSheet.create({
    scroll: { padding: Spacing.lg, paddingTop: Spacing.xxxl + 8, paddingBottom: Spacing.xxxl, gap: Spacing.md },
    eyebrow: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
    title: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary, marginTop: 4 },
    meta: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 13, marginTop: 4 },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    situation: { fontFamily: 'Inter-Regular', fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
    question: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.textPrimary, lineHeight: 22 },
    answers: { gap: Spacing.sm },
    answer: {
      flexDirection: 'row',
      gap: Spacing.md,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      backgroundColor: Colors.surface,
      alignItems: 'flex-start',
    },
    answerIndex: { fontFamily: 'Inter-ExtraBold', color: Colors.gold, fontSize: 14, width: 20 },
    answerText: { flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
    resultCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    resultTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
    feedback: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    optimal: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.gold, lineHeight: 20 },
    explanation: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textPrimary, lineHeight: 21, marginTop: 4 },
  });
}
