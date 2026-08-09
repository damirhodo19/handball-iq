import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ALL_POSITIONS, DominantHand, HandballPosition } from '@/lib/positions';
import { loadProfile, saveProfile } from '@/lib/storage';
import { mapServiceError } from '@/lib/map-error';
import { useTranslation } from '@/hooks/useTranslation';
import type { SupportedLanguage } from '@/locales';
import { translatePosition, translateHand } from '@/lib/translations';
import {
  AppRole,
  COUNTRIES,
  PLAYING_LEVELS_V2,
  PLAYER_GOALS_V2,
  COACH_TYPES_V2,
  EXPERIENCE_BANDS,
  DEFENSE_SYSTEMS_V2,
  ATTACK_STYLES_V2,
  DEFENSE_LABEL_KEYS,
  ATTACK_LABEL_KEYS,
  COACH_GOALS_V2,
  PlayingLevelId,
  PlayerGoalId,
  CoachTypeId,
  ExperienceBand,
  DefenseSystemId,
  AttackStyleId,
  CoachGoalId,
} from '@/lib/platform/types';
import { normalizeHandballPosition } from '@/lib/platform/resolve-position';

const LANGUAGES: { code: SupportedLanguage; labelKey: string; flag: string }[] = [
  { code: 'en', labelKey: 'settings.languageEn', flag: '🇬🇧' },
  { code: 'hr', labelKey: 'settings.languageHr', flag: '🇭🇷' },
  { code: 'de', labelKey: 'settings.languageDe', flag: '🇩🇪' },
];

const LEVEL_KEYS: Record<PlayingLevelId, string> = {
  Beginner: 'playingLevel.beginner',
  Youth: 'level.youth',
  Junior: 'level.junior',
  Senior: 'level.senior',
  Professional: 'playingLevel.professional',
};

const GOAL_KEYS: Record<PlayerGoalId, string> = {
  'Decision Making': 'devGoal.decisionMaking',
  'Game Intelligence': 'goal.gameIntelligence',
  Defence: 'goal.defence',
  Attack: 'goal.attack',
  'Mental Preparation': 'devGoal.mentalPreparation',
  'Match Preparation': 'goal.matchPreparation',
  Leadership: 'goal.leadership',
  'Complete Development': 'goal.completeDevelopment',
};

const COACH_TYPE_KEYS: Record<CoachTypeId, string> = {
  'Youth Coach': 'coachType.youth',
  'Senior Coach': 'coachType.senior',
  'Professional Coach': 'coachType.professional',
  'Goalkeeper Coach': 'coachType.goalkeeper',
  'Assistant Coach': 'coachType.assistant',
  'Head Coach': 'coachType.head',
};

const EXPERIENCE_KEYS: Record<ExperienceBand, string> = {
  '0-2': 'experience.0_2',
  '3-5': 'experience.3_5',
  '6-10': 'experience.6_10',
  '10+': 'experience.10_plus',
};

const COACH_GOAL_KEYS: Record<CoachGoalId, string> = {
  Tactics: 'coachGoal.tactics',
  Leadership: 'coachGoal.leadership',
  'Player Development': 'coachGoal.playerDevelopment',
  'Training Planning': 'coachGoal.trainingPlanning',
  'Match Analysis': 'coachGoal.matchAnalysis',
  'Complete Development': 'coachGoal.complete',
};

type StepId = 'locale' | 'role' | 'player' | 'coach';

function Chip({
  label,
  selected,
  onPress,
  compact,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        selected && styles.chipSelected,
      ]}
    >
      {selected && <Check size={14} color={Colors.background} />}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ChipGrid({ children }: { children: ReactNode }) {
  return <View style={styles.chipGrid}>{children}</View>;
}

export default function OnboardingScreen() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const { lang, setLang, t } = useTranslation();

  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState('');
  const [role, setRole] = useState<AppRole | null>(null);
  const [position, setPosition] = useState<HandballPosition | null>(null);
  const [dominantHand, setDominantHand] = useState<DominantHand | null>(null);
  const [playingLevel, setPlayingLevel] = useState<PlayingLevelId | null>(null);
  const [developmentGoal, setDevelopmentGoal] = useState<PlayerGoalId | null>(null);
  const [coachType, setCoachType] = useState<CoachTypeId | null>(null);
  const [experienceBand, setExperienceBand] = useState<ExperienceBand | null>(null);
  const [favoriteDefense, setFavoriteDefense] = useState<DefenseSystemId | null>(null);
  const [favoriteAttack, setFavoriteAttack] = useState<AttackStyleId | null>(null);
  const [coachDevelopmentGoal, setCoachDevelopmentGoal] = useState<CoachGoalId | null>(null);

  const steps = useMemo<StepId[]>(() => {
    const list: StepId[] = ['locale', 'role'];
    if (role === 'player' || role === 'player_coach') list.push('player');
    if (role === 'coach' || role === 'player_coach') list.push('coach');
    return list;
  }, [role]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const totalSteps = steps.length;

  const canProceed = () => {
    if (step === 'locale') return Boolean(country);
    if (step === 'role') return role !== null;
    if (step === 'player') {
      return Boolean(position && dominantHand && playingLevel && developmentGoal);
    }
    if (step === 'coach') {
      return Boolean(coachType && experienceBand && favoriteDefense && favoriteAttack && coachDevelopmentGoal);
    }
    return false;
  };

  const finishOnboarding = useCallback(async () => {
    if (!role) return;
    setSaving(true);
    setError(null);

    const existing = loadProfile();
    const name =
      authProfile?.display_name?.trim() ||
      (user?.user_metadata?.full_name as string | undefined)?.trim() ||
      existing.name ||
      '';

    const canonicalPosition =
      normalizeHandballPosition(position) ??
      normalizeHandballPosition(existing.position) ??
      '';

    const nextProfile = {
      ...existing,
      name,
      role,
      country,
      position: canonicalPosition,
      dominantHand: dominantHand ?? existing.dominantHand ?? '',
      playingLevel: playingLevel ?? existing.playingLevel,
      developmentGoal: developmentGoal ?? existing.developmentGoal,
      coachType: coachType ?? null,
      experienceBand: experienceBand ?? null,
      favoriteDefense: favoriteDefense ?? null,
      favoriteAttack: favoriteAttack ?? null,
      coachDevelopmentGoal: coachDevelopmentGoal ?? null,
      onboardingVersion: 2,
    };
    saveProfile(nextProfile);

    if (user && supabase) {
      // Preserve player | coach | player_coach — never collapse dual-role to player
      const dbRole = role;
      const base = {
        id: user.id,
        role: dbRole,
        primary_position: canonicalPosition || null,
        dominant_hand: dominantHand,
        playing_level: playingLevel,
        development_goal: developmentGoal,
        country,
        onboarded: true,
        onboarding_version: 2,
        position: canonicalPosition || null,
      };

      const fullPayload = {
        ...base,
        coach_type: coachType,
        experience_band: experienceBand,
        favorite_defense: favoriteDefense,
        favorite_attack: favoriteAttack,
        coach_development_goal: coachDevelopmentGoal,
      };

      let { error: upsertError } = await supabase.from('profiles').upsert(fullPayload as any);

      if (upsertError) {
        if (__DEV__) {
          console.error('[onboarding] profiles.upsert (full) failed', {
            operation: 'profiles.upsert',
            code: upsertError.code,
            message: upsertError.message,
            details: upsertError.details,
            hint: upsertError.hint,
            fields: Object.keys(fullPayload),
          });
        }
        ({ error: upsertError } = await supabase.from('profiles').upsert(base as any));
      }

      if (upsertError) {
        if (__DEV__) {
          console.error('[onboarding] profiles.upsert (base) failed', {
            operation: 'profiles.upsert',
            code: upsertError.code,
            message: upsertError.message,
            details: upsertError.details,
            hint: upsertError.hint,
            fields: Object.keys(base),
          });
        } else {
          // Production: keep console diagnostics non-sensitive for beta triage
          console.error('[onboarding] profiles.upsert failed', {
            operation: 'profiles.upsert',
            code: upsertError.code,
            message: upsertError.message,
            details: upsertError.details,
            hint: upsertError.hint,
          });
        }
        setError(mapServiceError(upsertError.message, t));
        setSaving(false);
        return;
      }
      try {
        const { syncPreferencesToCloud } = await import('@/services/preferencesService');
        await syncPreferencesToCloud(user.id);
      } catch {
        /* preferences sync is best-effort; profile row already has onboarding_version */
      }
      await refreshProfile();
    }

    setSaving(false);
    if (role === 'coach') {
      router.replace('/coach-dashboard');
    } else {
      router.replace('/(tabs)/home');
    }
  }, [
    role, country, position, dominantHand, playingLevel, developmentGoal,
    coachType, experienceBand, favoriteDefense, favoriteAttack, coachDevelopmentGoal,
    user, authProfile, refreshProfile, t,
  ]);

  function next() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    void finishOnboarding();
  }

  function back() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  const isLast = stepIndex >= steps.length - 1;

  return (
    <ScreenBackground>
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === stepIndex && styles.progressDotActive,
              i < stepIndex && styles.progressDotDone,
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepOf}>
        {t('onboarding.v2.stepOf', { n: stepIndex + 1, total: totalSteps })}
      </Text>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 'locale' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.step}>
            <Text style={styles.title}>{t('onboarding.v2.welcomeTitle')}</Text>
            <Text style={styles.sub}>{t('onboarding.v2.welcomeSub')}</Text>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.language')}</Text>
            <ChipGrid>
              {LANGUAGES.map((l) => (
                <Chip
                  key={l.code}
                  label={`${l.flag}  ${t(l.labelKey)}`}
                  selected={lang === l.code}
                  onPress={() => setLang(l.code)}
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.country')}</Text>
            <Text style={styles.hint}>{t('onboarding.v2.selectCountry')}</Text>
            <ChipGrid>
              {COUNTRIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={country === c}
                  onPress={() => setCountry(c)}
                  compact
                />
              ))}
            </ChipGrid>
          </Animated.View>
        )}

        {step === 'role' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.step}>
            <Text style={styles.title}>{t('onboarding.v2.whoAreYou')}</Text>
            <View style={styles.roleList}>
              {(
                [
                  { id: 'player' as const, title: t('onboarding.v2.player'), sub: t('onboarding.v2.playerSub') },
                  { id: 'coach' as const, title: t('onboarding.v2.coach'), sub: t('onboarding.v2.coachSub') },
                  { id: 'player_coach' as const, title: t('onboarding.v2.playerCoach'), sub: t('onboarding.v2.playerCoachSub') },
                ]
              ).map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.85}
                  onPress={() => setRole(opt.id)}
                >
                  <Card
                    variant="gradient"
                    style={[styles.roleCard, role === opt.id && styles.roleCardSelected]}
                  >
                    <Text style={[styles.roleTitle, role === opt.id && styles.roleTitleSelected]}>
                      {opt.title}
                    </Text>
                    <Text style={styles.roleSub}>{opt.sub}</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 'player' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.step}>
            <Text style={styles.fieldLabel}>{t('onboarding.v2.position')}</Text>
            <ChipGrid>
              {ALL_POSITIONS.map((p) => (
                <Chip
                  key={p}
                  label={translatePosition(p, t)}
                  selected={position === p}
                  onPress={() => setPosition(p)}
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.dominantHand')}</Text>
            <ChipGrid>
              {(['Left', 'Right'] as DominantHand[]).map((h) => (
                <Chip
                  key={h}
                  label={translateHand(h, t)}
                  selected={dominantHand === h}
                  onPress={() => setDominantHand(h)}
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.playingLevel')}</Text>
            <ChipGrid>
              {PLAYING_LEVELS_V2.map((lvl) => (
                <Chip
                  key={lvl}
                  label={t(LEVEL_KEYS[lvl])}
                  selected={playingLevel === lvl}
                  onPress={() => setPlayingLevel(lvl)}
                  compact
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.devGoal')}</Text>
            <ChipGrid>
              {PLAYER_GOALS_V2.map((g) => (
                <Chip
                  key={g}
                  label={t(GOAL_KEYS[g])}
                  selected={developmentGoal === g}
                  onPress={() => setDevelopmentGoal(g)}
                />
              ))}
            </ChipGrid>
          </Animated.View>
        )}

        {step === 'coach' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.step}>
            <Text style={styles.fieldLabel}>{t('onboarding.v2.coachType')}</Text>
            <ChipGrid>
              {COACH_TYPES_V2.map((ct) => (
                <Chip
                  key={ct}
                  label={t(COACH_TYPE_KEYS[ct])}
                  selected={coachType === ct}
                  onPress={() => setCoachType(ct)}
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.experience')}</Text>
            <ChipGrid>
              {EXPERIENCE_BANDS.map((band) => (
                <Chip
                  key={band}
                  label={t(EXPERIENCE_KEYS[band])}
                  selected={experienceBand === band}
                  onPress={() => setExperienceBand(band)}
                  compact
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.favDefence')}</Text>
            <ChipGrid>
              {DEFENSE_SYSTEMS_V2.map((d) => (
                <Chip
                  key={d}
                  label={t(DEFENSE_LABEL_KEYS[d])}
                  selected={favoriteDefense === d}
                  onPress={() => setFavoriteDefense(d)}
                  compact
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.favAttack')}</Text>
            <ChipGrid>
              {ATTACK_STYLES_V2.map((a) => (
                <Chip
                  key={a}
                  label={t(ATTACK_LABEL_KEYS[a])}
                  selected={favoriteAttack === a}
                  onPress={() => setFavoriteAttack(a)}
                  compact
                />
              ))}
            </ChipGrid>

            <Text style={styles.fieldLabel}>{t('onboarding.v2.coachGoal')}</Text>
            <ChipGrid>
              {COACH_GOALS_V2.map((g) => (
                <Chip
                  key={g}
                  label={t(COACH_GOAL_KEYS[g])}
                  selected={coachDevelopmentGoal === g}
                  onPress={() => setCoachDevelopmentGoal(g)}
                />
              ))}
            </ChipGrid>
          </Animated.View>
        )}
      </ScrollView>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.navRow}>
        {stepIndex > 0 ? (
          <TouchableOpacity onPress={back} style={styles.backBtn}>
            <ArrowLeft size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Button
            label={isLast ? t('onboarding.v2.finish') : t('onboarding.v2.continue')}
            onPress={next}
            disabled={!canProceed()}
            loading={saving}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.huge,
  },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.gold },
  progressDotDone: { backgroundColor: Colors.goldDeep },
  stepOf: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
  },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingBottom: Spacing.xxl },
  step: { gap: Spacing.sm },
  title: {
    ...Typography.hero,
    fontFamily: 'Inter-ExtraBold',
    color: Colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: Spacing.xs,
  },
  sub: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  fieldLabel: {
    color: Colors.textTertiary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: '46%',
    flexGrow: 1,
  },
  chipCompact: { minWidth: '30%', flexGrow: 0 },
  chipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  chipText: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 14, flexShrink: 1 },
  chipTextSelected: { color: Colors.gold },
  roleList: { gap: Spacing.sm, marginTop: Spacing.lg },
  roleCard: { padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border },
  roleCardSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  roleTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  roleTitleSelected: { color: Colors.gold },
  roleSub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, marginTop: 4 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnPlaceholder: { width: 52 },
  errorText: {
    color: Colors.error,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});
