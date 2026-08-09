import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowRight, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { ScreenBackground } from '@/components/Screen';
import { useMatchDay } from '@/context/MatchDayContext';
import { MatchType, MatchLocation, PlayingTime, PersonalGoal, PrepMode } from '@/lib/match-day-storage';
import { getMatchDayPersonalGoals } from '@/lib/positions';
import { loadProfile } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translateMatchType, translateMatchLocation, translatePlayingTime, translatePersonalGoal } from '@/lib/translations';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';

const MATCH_TYPES: MatchType[] = ['League', 'Cup', 'Friendly', 'Tournament'];
const LOCATIONS: MatchLocation[] = ['Home', 'Away', 'Neutral'];
const PLAYING_TIMES: PlayingTime[] = ['Starter', 'Shared minutes', 'Substitute'];

export default function SetupScreen() {
  const { mode = 'complete' } = useLocalSearchParams<{ mode?: PrepMode }>();
  const { startPrep } = useMatchDay();
  const { t } = useTranslation();

  const [opponent, setOpponent] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('League');
  const [location, setLocation] = useState<MatchLocation>('Home');
  const [playingTime, setPlayingTime] = useState<PlayingTime>('Starter');
  const [goals, setGoals] = useState<string[]>([]);
  const [opponentError, setOpponentError] = useState(false);

  const profile = loadProfile();
  const position = resolvePlayerPosition(profile);
  const PERSONAL_GOALS = position ? getMatchDayPersonalGoals(position) : [];

  const toggleGoal = (g: string) => {
    setGoals((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 2) return prev;
      return [...prev, g];
    });
  };

  const handleStart = () => {
    if (!position) {
      router.push('/(auth)/onboarding');
      return;
    }
    if (!opponent.trim()) { setOpponentError(true); return; }
    if (goals.length === 0) return;
    setOpponentError(false);
    if (__DEV__) {
      console.log('[match-day] setup.start', {
        position,
        goals,
        opponent: opponent.trim(),
        matchType,
        location,
        playingTime,
        developmentGoal: profile.developmentGoal ?? null,
        playingLevel: profile.playingLevel ?? null,
        route: '/match-day/prepare',
      });
    }
    const prep = startPrep(mode as PrepMode, {
      opponent: opponent.trim(),
      matchType,
      location,
      playingTime,
      goals: goals as PersonalGoal[],
      position,
      developmentGoal: profile.developmentGoal ?? null,
      playingLevel: profile.playingLevel ?? null,
      dominantHand: profile.dominantHand ?? null,
    });
    if (__DEV__) {
      console.log('[match-day] setup.prep-created', { prepId: prep.id, position: prep.setup.position });
    }
    router.replace('/match-day/prepare');
  };

  if (!position) {
    return (
      <ScreenBackground>
        <View style={[styles.scroll, { justifyContent: 'center', gap: Spacing.md }]}>
          <BackButton fallbackHref="/(tabs)/match-day" />
          <Text style={styles.headerTitle}>{t('home.completeProfileTitle')}</Text>
          <Text style={styles.headerSub}>{t('home.completeProfileBody')}</Text>
          <Button label={t('home.setupProfileCta')} onPress={() => router.push('/(auth)/onboarding')} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <BackButton fallbackHref="/(tabs)/match-day" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.headerTitle}>{t('matchDay.setupTitle')}</Text>
            <Text style={styles.headerSub}>{mode === 'quick' ? t('matchDay.modeQuick') : t('matchDay.modeComplete')}</Text>
          </View>
        </View>

        {/* Opponent */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Text style={styles.label}>{t('matchDay.opponentLabel')}</Text>
          <TextInput
            style={[styles.textInput, opponentError && styles.textInputError]}
            placeholder={t('matchDay.opponentPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={opponent}
            onChangeText={(t) => { setOpponent(t); setOpponentError(false); }}
            returnKeyType="done"
          />
          {opponentError && <Text style={styles.errorText}>{t('matchDay.errorNoOpponent')}</Text>}
        </Animated.View>

        {/* Match Type */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.label}>{t('matchDay.matchType')}</Text>
          <View style={styles.chipRow}>
            {MATCH_TYPES.map((mt) => (
              <TouchableOpacity
                key={mt}
                style={[styles.chip, matchType === mt && styles.chipActive]}
                onPress={() => setMatchType(mt)}
                activeOpacity={0.8}
              >
                {matchType === mt && <Check size={12} color={Colors.background} />}
                <Text style={[styles.chipText, matchType === mt && styles.chipTextActive]}>{translateMatchType(mt, t)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={styles.label}>{t('matchDay.matchLocation')}</Text>
          <View style={styles.chipRow}>
            {LOCATIONS.map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.chip, location === l && styles.chipActive]}
                onPress={() => setLocation(l)}
                activeOpacity={0.8}
              >
                {location === l && <Check size={12} color={Colors.background} />}
                <Text style={[styles.chipText, location === l && styles.chipTextActive]}>{translateMatchLocation(l, t)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Playing Time */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.label}>{t('matchDay.playingTime')}</Text>
          <View style={styles.chipRow}>
            {PLAYING_TIMES.map((pt) => (
              <TouchableOpacity
                key={pt}
                style={[styles.chip, playingTime === pt && styles.chipActive]}
                onPress={() => setPlayingTime(pt)}
                activeOpacity={0.8}
              >
                {playingTime === pt && <Check size={12} color={Colors.background} />}
                <Text style={[styles.chipText, playingTime === pt && styles.chipTextActive]}>{translatePlayingTime(pt, t)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Personal Goals */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Text style={styles.label}>{t('matchDay.mainGoal')} <Text style={styles.labelMuted}>{t('matchDay.mainGoalHint')}</Text></Text>
          <View style={styles.goalGrid}>
            {PERSONAL_GOALS.map((g) => {
              const active = goals.includes(g);
              const disabled = !active && goals.length >= 2;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalChip, active && styles.goalChipActive, disabled && styles.goalChipDisabled]}
                  onPress={() => !disabled && toggleGoal(g)}
                  activeOpacity={0.8}
                >
                  {active && <Check size={13} color={Colors.background} />}
                  <Text style={[styles.goalText, active && styles.goalTextActive, disabled && styles.goalTextDisabled]}>{translatePersonalGoal(g, t)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {goals.length === 0 && (
            <Text style={styles.errorText}>{t('matchDay.errorNoGoal')}</Text>
          )}
        </Animated.View>

        {/* Start */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.btnWrap}>
          <Button
            label={t('matchDay.beginPrepBtn')}
            onPress={handleStart}
            disabled={goals.length === 0 || !opponent.trim()}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, marginTop: 2 },

  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  labelMuted: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular' },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: Spacing.xs },

  textInput: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  textInputError: { borderColor: Colors.error },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textSecondary },
  chipTextActive: { color: Colors.background },

  goalGrid: { gap: Spacing.sm },
  goalChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 13, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  goalChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  goalChipDisabled: { opacity: 0.35 },
  goalText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  goalTextActive: { color: Colors.background },
  goalTextDisabled: { color: Colors.textQuaternary },

  btnWrap: { marginTop: Spacing.xxl },
});
