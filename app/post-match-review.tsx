import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ClipboardList, ArrowRight, Brain, Target, Shield } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { isValidDateString, isNonEmpty } from '@/lib/form-validation';
import { mapServiceError } from '@/lib/map-error';
import { useTranslation } from '@/hooks/useTranslation';

const RATING_KEYS = ['postMatch.ratingPoor', 'postMatch.ratingBelowAvg', 'postMatch.ratingAverage', 'postMatch.ratingGood', 'postMatch.ratingExcellent'];

export default function PostMatchReviewScreen() {
  const { refreshProfile, user } = useAuth();
  const { t } = useTranslation();
  const [opponent, setOpponent] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [decisionMaking, setDecisionMaking] = useState(3);
  const [focus, setFocus] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [mistakes, setMistakes] = useState('');
  const [mentalState, setMentalState] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function submit() {
    if (!isNonEmpty(opponent)) { setError(t('postMatch.errorOpponent')); return; }
    if (!isValidDateString(matchDate)) { setError(t('postMatch.errorInvalidDate')); return; }
    if (!user) { setError(t('postMatch.errorNotSignedIn')); return; }
    if (!isSupabaseConfigured || !supabase) {
      setError(t('error.serverConnectFailed'));
      return;
    }
    setSaving(true);
    setError(null);
    const { error } = await supabase.from('post_match_reviews').insert({
      opponent: opponent.trim(),
      match_date: matchDate ? new Date(matchDate).toISOString() : new Date().toISOString(),
      decision_making: decisionMaking,
      focus,
      confidence,
      mistakes: mistakes.trim() || null,
      mental_state: mentalState.trim() || null,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) { setError(mapServiceError(error.message, t)); return; }
    setSaved(true);
    await refreshProfile();
  }

  if (saved) {
    return (
      <ScreenBackground>
        <View style={styles.savedWrap}>
          <View style={styles.savedIcon}><ClipboardList size={36} color={Colors.background} /></View>
          <Text style={styles.savedTitle}>{t('postMatch.saved')}</Text>
          <Text style={styles.savedSub}>{t('postMatch.savedSub')}</Text>
          <Button label={t('postMatch.backToMatchDay')} onPress={() => router.replace('/(tabs)/match-day')} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <BackButton fallbackHref="/(tabs)/match-day" />
        <Text style={styles.headerTitle}>{t('postMatch.title')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>{t('postMatch.intro')}</Text>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('postMatch.opponent')}</Text>
              <TextInput style={styles.input} placeholder={t('postMatch.opponentPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={opponent} onChangeText={setOpponent} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('postMatch.matchDate')}</Text>
              <TextInput style={styles.input} placeholder={t('common.datePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={matchDate} onChangeText={setMatchDate} />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <Text style={styles.cardSectionTitle}>{t('postMatch.performanceRatings')}</Text>
            <SliderRow icon={<Brain size={16} color={Colors.gold} />} label={t('postMatch.decisionMaking')} value={decisionMaking} onChange={setDecisionMaking} t={t} />
            <SliderRow icon={<Target size={16} color={Colors.gold} />} label={t('postMatch.focus')} value={focus} onChange={setFocus} t={t} />
            <SliderRow icon={<Shield size={16} color={Colors.gold} />} label={t('postMatch.confidence')} value={confidence} onChange={setConfidence} t={t} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.card}>
            <Text style={styles.cardSectionTitle}>{t('postMatch.reflection')}</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('postMatch.keyMistakes')}</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder={t('postMatch.mistakesPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={mistakes} onChangeText={setMistakes} multiline numberOfLines={3} textAlignVertical="top" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('postMatch.mentalState')}</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder={t('postMatch.mentalPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={mentalState} onChangeText={setMentalState} multiline numberOfLines={3} textAlignVertical="top" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('postMatch.notes')}</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder={t('postMatch.notesPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={notes} onChangeText={setNotes} multiline numberOfLines={3} textAlignVertical="top" />
            </View>
          </Card>
        </Animated.View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button label={t('postMatch.save')} onPress={submit} loading={saving} iconRight={<ArrowRight size={20} color={Colors.background} />} />
      </ScrollView>
    </ScreenBackground>
  );
}

function SliderRow({ icon, label, value, onChange, t }: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void; t: (key: string, vars?: Record<string, string | number>) => string }) {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.sliderHeader}>
        <View style={styles.sliderIcon}>{icon}</View>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{t(RATING_KEYS[value - 1])}</Text>
      </View>
      <View style={styles.sliderTrack}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            activeOpacity={0.7}
            style={[styles.sliderSegment, n <= value && styles.sliderSegmentActive, n === 1 && styles.sliderSegmentFirst, n === 5 && styles.sliderSegmentLast]}
          >
            <Text style={[styles.sliderSegmentText, n <= value && styles.sliderSegmentTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.sm },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  headerTitle: { ...Typography.h2, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 18 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.lg },
  intro: { ...Typography.bodySmall, color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontStyle: 'italic', paddingHorizontal: Spacing.xs, marginBottom: Spacing.xs },

  card: { gap: Spacing.md },
  cardSectionTitle: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, letterSpacing: 1.5, marginBottom: Spacing.xs },
  inputGroup: { gap: Spacing.xs },
  inputLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 16 },
  textArea: { minHeight: 80, paddingTop: 14, lineHeight: 22 },

  sliderRow: { gap: Spacing.sm },
  sliderHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sliderIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  sliderLabel: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 15 },
  sliderValue: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },
  sliderTrack: { flexDirection: 'row', gap: 6, height: 44 },
  sliderSegment: { flex: 1, borderRadius: Radius.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  sliderSegmentActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  sliderSegmentFirst: { borderTopLeftRadius: Radius.md, borderBottomLeftRadius: Radius.md },
  sliderSegmentLast: { borderTopRightRadius: Radius.md, borderBottomRightRadius: Radius.md },
  sliderSegmentText: { color: Colors.textQuaternary, fontFamily: 'Inter-SemiBold', fontSize: 15 },
  sliderSegmentTextActive: { color: Colors.background, fontFamily: 'Inter-ExtraBold' },

  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center' },
  savedWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.md },
  savedIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  savedTitle: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary },
  savedSub: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.lg, lineHeight: 22 },
});
