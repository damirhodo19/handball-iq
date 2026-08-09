import { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton, navigateBack } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';
import { loadProfile } from '@/lib/storage';
import {
  AGE_LEVEL_OPTIONS,
  DURATION_OPTIONS,
  TRAINING_FOCUS_OPTIONS,
  generateTrainingPlan,
  saveTrainingPlan,
  type TrainingFocus,
  type TrainingPlan,
} from '@/lib/coach-platform';
import { attackLabelKey, defenseLabelKey } from '@/lib/platform/tactical-systems';

export default function TrainingPlannerScreen() {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const profile = loadProfile();
  const styles = useMemo(() => createStyles(), [themeVersion]);

  const [ageLevel, setAgeLevel] = useState<string>(profile.ageGroup || 'U16');
  const [durationMin, setDurationMin] = useState(90);
  const [objective, setObjective] = useState('');
  const [playerCount, setPlayerCount] = useState('14');
  const [focus, setFocus] = useState<TrainingFocus>(
    profile.favoriteDefense && profile.favoriteDefense !== 'none'
      ? 'Defence'
      : profile.favoriteAttack && profile.favoriteAttack !== 'none'
        ? 'Attack'
        : 'Decision Making',
  );
  const [plan, setPlan] = useState<TrainingPlan | null>(null);

  const generate = () => {
    const created = generateTrainingPlan({
      ageLevel,
      durationMin,
      objective: objective.trim() || t('planner.defaultObjective'),
      playerCount: Math.max(5, parseInt(playerCount, 10) || 12),
      focus,
      favoriteDefense: profile.favoriteDefense,
      favoriteAttack: profile.favoriteAttack,
    });
    saveTrainingPlan(created);
    setPlan(created);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <BackButton labeled label={t('common.back')} fallbackHref="/(tabs)/home" style={{ marginBottom: Spacing.sm }} />

        <Text style={styles.title}>{t('planner.title')}</Text>
        <Text style={styles.sub}>{t('planner.subtitle')}</Text>

        {!plan ? (
          <>
            <Label text={t('planner.ageLevel')} />
            <ChipRow
              options={AGE_LEVEL_OPTIONS as unknown as string[]}
              value={ageLevel}
              onChange={setAgeLevel}
            />

            <Label text={t('planner.duration')} />
            <ChipRow
              options={DURATION_OPTIONS.map(String)}
              value={String(durationMin)}
              onChange={(v) => setDurationMin(Number(v))}
              format={(v) => t('planner.minutes', { n: v })}
            />

            <Label text={t('planner.players')} />
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={playerCount}
              onChangeText={setPlayerCount}
              placeholderTextColor={Colors.textQuaternary}
            />

            <Label text={t('planner.focus')} />
            <ChipRow
              options={TRAINING_FOCUS_OPTIONS as unknown as string[]}
              value={focus}
              onChange={(v) => setFocus(v as TrainingFocus)}
              format={(v) => t(`planner.focus.${v.replace(/\s+/g, '')}`)}
            />

            <Label text={t('planner.objective')} />
            <TextInput
              style={[styles.input, styles.inputMulti]}
              multiline
              value={objective}
              onChangeText={setObjective}
              placeholder={t('planner.objectivePlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
            />

            {(profile.favoriteDefense || profile.favoriteAttack) && (
              <Text style={styles.hint}>
                {t('planner.profileHint', {
                  defence: profile.favoriteDefense && profile.favoriteDefense !== 'none'
                    ? t(defenseLabelKey(profile.favoriteDefense))
                    : '—',
                  attack: profile.favoriteAttack && profile.favoriteAttack !== 'none'
                    ? t(attackLabelKey(profile.favoriteAttack))
                    : '—',
                })}
              </Text>
            )}

            <Button label={t('planner.generate')} onPress={generate} />
          </>
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} style={{ gap: Spacing.md }}>
            <Text style={styles.planTitle}>{t('planner.planReady')}</Text>
            {plan.blocks.map((block) => (
              <View key={block.id} style={styles.block}>
                <View style={styles.blockTop}>
                  <Text style={styles.blockTitle}>{t(block.titleKey, block.params)}</Text>
                  <Text style={styles.blockDur}>{t('planner.minutes', { n: block.durationMin })}</Text>
                </View>
                <Text style={styles.blockLabel}>{t('planner.blockObjective')}</Text>
                <Text style={styles.blockBody}>{t(block.objectiveKey, block.params)}</Text>
                <Text style={styles.blockLabel}>{t('planner.instructions')}</Text>
                <Text style={styles.blockBody}>{t(block.instructionsKey, block.params)}</Text>
                <Text style={styles.blockLabel}>{t('planner.coachingPoints')}</Text>
                <Text style={styles.blockBody}>{t(block.coachingPointsKey, block.params)}</Text>
              </View>
            ))}
            <Button label={t('planner.newPlan')} onPress={() => setPlan(null)} />
            <Button label={t('coachChallenge.done')} onPress={() => navigateBack('/(tabs)/home')} variant="outline" />
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={labelStyle}>{text}</Text>;
}

const labelStyle = {
  color: Colors.textTertiary,
  fontFamily: 'Inter-SemiBold' as const,
  fontSize: 11,
  letterSpacing: 1.2,
  textTransform: 'uppercase' as const,
  marginTop: Spacing.sm,
};

function ChipRow({
  options,
  value,
  onChange,
  format,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  format?: (v: string) => string;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: Radius.pill,
              borderWidth: 1,
              borderColor: active ? Colors.gold : Colors.border,
              backgroundColor: active ? Colors.goldSoft : Colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 12,
                color: active ? Colors.gold : Colors.textTertiary,
              }}
            >
              {format ? format(opt) : opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function createStyles() {
  return StyleSheet.create({
    scroll: { padding: Spacing.lg, paddingTop: Spacing.xxxl + 8, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
    title: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
    sub: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.md },
    input: {
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
      color: Colors.textPrimary,
      fontFamily: 'Inter-Medium',
      fontSize: 15,
    },
    inputMulti: { minHeight: 80, textAlignVertical: 'top' },
    hint: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.gold, marginVertical: Spacing.sm },
    planTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
    block: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: 6,
    },
    blockTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    blockTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, flex: 1 },
    blockDur: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold },
    blockLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, marginTop: 6, letterSpacing: 0.8 },
    blockBody: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  });
}
