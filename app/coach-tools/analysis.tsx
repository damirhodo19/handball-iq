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
  buildMatchAnalysis,
  saveMatchAnalysis,
  type MatchAnalysisRecord,
} from '@/lib/coach-platform';
import {
  ATTACK_STYLES_V2,
  DEFENSE_SYSTEMS_V2,
  attackLabelKey,
  defenseLabelKey,
  type AttackStyleId,
  type DefenseSystemId,
} from '@/lib/platform/tactical-systems';

type RatingKey = 'attack' | 'defence' | 'transition' | 'goalkeeper' | 'discipline' | 'decisionMaking';

const RATING_KEYS: RatingKey[] = [
  'attack',
  'defence',
  'transition',
  'goalkeeper',
  'discipline',
  'decisionMaking',
];

export default function MatchAnalysisScreen() {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const profile = loadProfile();
  const styles = useMemo(() => createStyles(), [themeVersion]);

  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [competition, setCompetition] = useState('');
  const [ownTeam, setOwnTeam] = useState(profile.club || '');
  const [result, setResult] = useState('');
  const [opponentDefense, setOpponentDefense] = useState<DefenseSystemId>(
    (profile.favoriteDefense as DefenseSystemId) || 'none',
  );
  const [ownAttack, setOwnAttack] = useState<AttackStyleId>(
    (profile.favoriteAttack as AttackStyleId) || 'none',
  );
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    attack: 3,
    defence: 3,
    transition: 3,
    goalkeeper: 3,
    discipline: 3,
    decisionMaking: 3,
  });
  const [problem, setProblem] = useState('');
  const [best, setBest] = useState('');
  const [report, setReport] = useState<MatchAnalysisRecord | null>(null);

  const generate = () => {
    if (!opponent.trim() || !ownTeam.trim()) return;
    const record = buildMatchAnalysis({
      opponent,
      date,
      competition: competition.trim() || t('analysis.defaultCompetition'),
      ownTeam,
      result: result.trim() || null,
      opponentDefense,
      ownAttack,
      ratings,
      keyTacticalProblem: problem.trim() || t('analysis.defaultProblem'),
      bestTacticalElement: best.trim() || t('analysis.defaultStrength'),
    });
    saveMatchAnalysis(record);
    setReport(record);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <BackButton labeled label={t('common.back')} fallbackHref="/(tabs)/home" style={{ marginBottom: Spacing.sm }} />

        <Text style={styles.title}>{t('analysis.title')}</Text>
        <Text style={styles.sub}>{t('analysis.subtitle')}</Text>

        {!report ? (
          <>
            <Field label={t('analysis.opponent')} value={opponent} onChange={setOpponent} />
            <Field label={t('analysis.date')} value={date} onChange={setDate} />
            <Field label={t('analysis.competition')} value={competition} onChange={setCompetition} />
            <Field label={t('analysis.ownTeam')} value={ownTeam} onChange={setOwnTeam} />
            <Field label={t('analysis.result')} value={result} onChange={setResult} placeholder={t('analysis.resultOptional')} />

            <Text style={styles.section}>{t('analysis.opponentDefence')}</Text>
            <View style={styles.chipRow}>
              {DEFENSE_SYSTEMS_V2.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setOpponentDefense(d)}
                  style={[styles.chip, opponentDefense === d && styles.chipOn]}
                >
                  <Text style={[styles.chipText, opponentDefense === d && styles.chipTextOn]}>
                    {t(defenseLabelKey(d))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.section}>{t('analysis.ownAttack')}</Text>
            <View style={styles.chipRow}>
              {ATTACK_STYLES_V2.map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => setOwnAttack(a)}
                  style={[styles.chip, ownAttack === a && styles.chipOn]}
                >
                  <Text style={[styles.chipText, ownAttack === a && styles.chipTextOn]}>
                    {t(attackLabelKey(a))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.section}>{t('analysis.ratings')}</Text>
            {RATING_KEYS.map((key) => (
              <View key={key} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{t(`analysis.rating.${key}`)}</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity
                      key={n}
                      onPress={() => setRatings((r) => ({ ...r, [key]: n }))}
                      style={[styles.star, ratings[key] >= n && styles.starOn]}
                    >
                      <Text style={[styles.starText, ratings[key] >= n && styles.starTextOn]}>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <Field
              label={t('analysis.keyProblem')}
              value={problem}
              onChange={setProblem}
              multiline
              placeholder={t('analysis.keyProblemPlaceholder')}
            />
            <Field
              label={t('analysis.bestElement')}
              value={best}
              onChange={setBest}
              multiline
              placeholder={t('analysis.bestElementPlaceholder')}
            />

            <Button
              label={t('analysis.generate')}
              onPress={generate}
              disabled={!opponent.trim() || !ownTeam.trim()}
            />
          </>
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} style={{ gap: Spacing.md }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{report.ownTeam} vs {report.opponent}</Text>
              <Text style={styles.cardMeta}>
                {report.date} · {report.competition}
                {report.result ? ` · ${report.result}` : ''}
              </Text>
              <Text style={styles.body}>
                {t(report.summaryKey, {
                  opponent: report.opponent,
                  weakest: t(`analysis.rating.${report.summaryParams?.weakest ?? 'attack'}`),
                  strongest: t(`analysis.rating.${report.summaryParams?.strongest ?? 'defence'}`),
                  avg: String(report.summaryParams?.avg ?? ''),
                })}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.section}>{t('analysis.ratings')}</Text>
              {RATING_KEYS.map((key) => (
                <Text key={key} style={styles.body}>
                  {t(`analysis.rating.${key}`)}: {report.ratings[key]}/5
                </Text>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.section}>{t('analysis.tacticalNotes')}</Text>
              <Text style={styles.body}>{t('analysis.problemLabel')}: {report.keyTacticalProblem}</Text>
              <Text style={styles.body}>{t('analysis.strengthLabel')}: {report.bestTacticalElement}</Text>
              {report.opponentDefense && report.opponentDefense !== 'none' ? (
                <Text style={styles.body}>
                  {t('analysis.opponentDefence')}: {t(defenseLabelKey(report.opponentDefense))}
                </Text>
              ) : null}
              {report.ownAttack && report.ownAttack !== 'none' ? (
                <Text style={styles.body}>
                  {t('analysis.ownAttack')}: {t(attackLabelKey(report.ownAttack))}
                </Text>
              ) : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.section}>{t('analysis.recommendations')}</Text>
              {report.recommendationKeys.map((key) => (
                <Text key={key} style={styles.rec}>
                  • {t(key, {
                    problem: report.keyTacticalProblem,
                    strength: report.bestTacticalElement,
                    defence: report.opponentDefense
                      ? t(defenseLabelKey(report.opponentDefense))
                      : '',
                    attack: report.ownAttack ? t(attackLabelKey(report.ownAttack)) : '',
                  })}
                </Text>
              ))}
            </View>

            <Button label={t('analysis.new')} onPress={() => setReport(null)} />
            <Button label={t('coachChallenge.done')} onPress={() => navigateBack('/(tabs)/home')} />
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 6, marginBottom: 8 }}>
      <Text style={{ color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1 }}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          backgroundColor: Colors.surface,
          borderRadius: Radius.lg,
          paddingHorizontal: Spacing.md,
          paddingVertical: 12,
          color: Colors.textPrimary,
          fontFamily: 'Inter-Medium',
          fontSize: 15,
          minHeight: multiline ? 72 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textQuaternary}
        multiline={multiline}
      />
    </View>
  );
}

function createStyles() {
  return StyleSheet.create({
    scroll: { padding: Spacing.lg, paddingTop: Spacing.xxxl + 8, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
    title: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
    sub: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.md },
    section: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold, marginTop: Spacing.sm },
    ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 4 },
    ratingLabel: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textPrimary, flex: 1 },
    stars: { flexDirection: 'row', gap: 4 },
    star: {
      width: 28,
      height: 28,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.surface,
    },
    starOn: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
    starText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },
    starTextOn: { color: Colors.gold },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: 6,
    },
    cardTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
    cardMeta: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.textTertiary },
    body: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    rec: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: Radius.pill,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      maxWidth: '100%',
    },
    chipOn: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
    chipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary, flexShrink: 1 },
    chipTextOn: { color: Colors.gold },
  });
}
