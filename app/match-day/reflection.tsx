import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import {
  saveReflection, generateReflectionSummary, loadPreps, MatchDayPrep,
  MatchDayReflection,
} from '@/lib/match-day-storage';
import { savePostMatchReflection } from '@/services/matchDayService';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { translateMatchType } from '@/lib/translations';

const DIFFICULT_OPTIONS = [
  'Backcourt shots',
  'Wing shots',
  'Pivot shots',
  'Fast breaks',
  'Seven metre throws',
  'Communication',
  'Emotional control',
];

const DIFFICULT_KEYS: Record<string, string> = {
  'Backcourt shots': 'matchDay.diffBackcourt',
  'Wing shots': 'matchDay.diffWing',
  'Pivot shots': 'matchDay.diffPivot',
  'Fast breaks': 'matchDay.diffFastBreak',
  'Seven metre throws': 'matchDay.diff7m',
  'Communication': 'matchDay.diffCommunication',
  'Emotional control': 'matchDay.diffEmotional',
};

function ScaleInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.scaleWrap}>
      <Text style={styles.scaleLabel}>{label}</Text>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.scaleBtn, value === n && styles.scaleBtnActive]}
            onPress={() => onChange(n)}
            activeOpacity={0.8}
          >
            <Text style={[styles.scaleBtnText, value === n && styles.scaleBtnTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.scaleHint}>
        {value === 0 ? t('matchDay.scaleHint') : value <= 3 ? t('matchDay.scaleNeedsWork') : value <= 6 ? t('matchDay.scaleAdequate') : value <= 8 ? t('matchDay.scaleGood') : t('matchDay.scaleExcellent')}
      </Text>
    </View>
  );
}

export default function ReflectionScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [preparedFeel, setPreparedFeel] = useState(0);
  const [resetAfterConceding, setResetAfterConceding] = useState(0);
  const [patience, setPatience] = useState(0);
  const [difficultSituation, setDifficultSituation] = useState('');
  const [didWell, setDidWell] = useState('');
  const [willImprove, setWillImprove] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState('');

  const canSubmit = preparedFeel > 0 && resetAfterConceding > 0 && patience > 0 && difficultSituation && didWell.trim() && willImprove.trim();

  // Try to find the most recent completed prep to link
  const recentCompleted = loadPreps().find((p) => p.completed && !p.reflectionCompleted);

  const handleSubmit = () => {
    const partial = {
      prepId: recentCompleted?.id ?? '',
      opponent: recentCompleted?.setup.opponent ?? 'Unknown',
      preparedFeel,
      resetAfterConceding,
      patience,
      difficultSituation,
      didWell,
      willImprove,
    };
    const s = generateReflectionSummary(partial);
    setSummary(s);

    const reflection: MatchDayReflection = {
      id: `ref_${Date.now()}`,
      date: new Date().toISOString(),
      summary: s,
      ...partial,
    };
    saveReflection(reflection);

    // Save to Supabase if user is logged in
    if (user) {
      savePostMatchReflection({
        preparation_id: null,
        prepared_rating: preparedFeel,
        reset_rating: resetAfterConceding,
        patience_rating: patience,
        difficult_situation: difficultSituation,
        did_well: didWell,
        improvement: willImprove,
        summary: s,
      }).then(({ error }) => {
        if (error) console.warn('[Reflection] Failed to sync:', error);
      });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.doneWrap}>
            <Text style={styles.doneTitle}>{t('matchDay.reflectionSaved')}</Text>
            <Text style={styles.doneSub}>{t('matchDay.reflectionSavedMsg')}</Text>
          </Animated.View>

          <Card variant="gradient" shadow="cardLg" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('matchDay.yourSummary')}</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </Card>

          <View style={styles.scores}>
            <ScoreRow label={t('matchDay.scorePreparation')} value={preparedFeel} />
            <ScoreRow label={t('matchDay.scoreReset')} value={resetAfterConceding} />
            <ScoreRow label={t('matchDay.scorePatience')} value={patience} />
          </View>

          {didWell.trim().length > 0 && (
            <Card variant="gradient" shadow="card" style={styles.textCard}>
              <Text style={styles.textCardLabel}>{t('matchDay.didWell')}</Text>
              <Text style={styles.textCardValue}>{didWell}</Text>
            </Card>
          )}
          {willImprove.trim().length > 0 && (
            <Card variant="gradient" shadow="card" style={styles.textCard}>
              <Text style={styles.textCardLabel}>{t('matchDay.willImprove')}</Text>
              <Text style={styles.textCardValue}>{willImprove}</Text>
            </Card>
          )}

          <Button
            label={t('matchDay.backToMatchDay')}
            onPress={() => router.replace('/(tabs)/match-day')}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
            style={{ marginTop: Spacing.xl }}
          />
        </ScrollView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('matchDay.reflectionTitle')}</Text>
            <Text style={styles.headerSub}>{t('matchDay.reflectionSub')}</Text>
          </View>
        </View>

        {recentCompleted && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <View style={styles.linkedPrep}>
              <Text style={styles.linkedText}>{t('matchDay.reflectingOn', { opponent: recentCompleted.setup.opponent, matchType: translateMatchType(recentCompleted.setup.matchType, t) })}</Text>
            </View>
          </Animated.View>
        )}

        {/* Scale questions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <ScaleInput label={t('matchDay.qPrepared')} value={preparedFeel} onChange={setPreparedFeel} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <ScaleInput label={t('matchDay.qReset')} value={resetAfterConceding} onChange={setResetAfterConceding} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <ScaleInput label={t('matchDay.qPatience')} value={patience} onChange={setPatience} />
          </Card>
        </Animated.View>

        {/* Difficult situation */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <Text style={styles.cardLabel}>{t('matchDay.qDifficult')}</Text>
            <View style={styles.chipRow}>
              {DIFFICULT_OPTIONS.map((opt) => {
                const label = t(DIFFICULT_KEYS[opt] ?? opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, difficultSituation === opt && styles.chipActive]}
                    onPress={() => setDifficultSituation(opt)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, difficultSituation === opt && styles.chipTextActive]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* Text inputs */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <Text style={styles.cardLabel}>{t('matchDay.qDidWell')}</Text>
            <TextInput
              style={styles.textInput}
              multiline
              value={didWell}
              onChangeText={setDidWell}
              placeholder={t('matchDay.didWellPlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <Text style={styles.cardLabel}>{t('matchDay.qImprove')}</Text>
            <TextInput
              style={styles.textInput}
              multiline
              value={willImprove}
              onChangeText={setWillImprove}
              placeholder={t('matchDay.improvePlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={{ marginTop: Spacing.md }}>
          <Button
            label={t('matchDay.saveReflection')}
            onPress={handleSubmit}
            disabled={!canSubmit}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? Colors.success : value >= 5 ? Colors.gold : Colors.warning;
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={[styles.scoreValue, { color }]}>{value}/10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  linkedPrep: { backgroundColor: Colors.goldSoft, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.md },
  linkedText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },

  card: { marginBottom: Spacing.sm, gap: Spacing.md },
  cardLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },

  scaleWrap: { gap: Spacing.sm },
  scaleLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  scaleRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  scaleBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  scaleBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  scaleBtnText: { fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textTertiary },
  scaleBtnTextActive: { color: Colors.background },
  scaleHint: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textQuaternary },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: Colors.background },

  textInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, padding: Spacing.md, minHeight: 80, textAlignVertical: 'top' },

  doneWrap: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  doneTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary },
  doneSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14 },

  summaryCard: { marginBottom: Spacing.md, gap: Spacing.sm },
  summaryTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.gold },
  summaryText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },

  scores: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  scoreRow: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border },
  scoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, textAlign: 'center', letterSpacing: 0.5 },
  scoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 20 },

  textCard: { marginBottom: Spacing.sm, gap: Spacing.xs },
  textCardLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1.5 },
  textCardValue: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
});
