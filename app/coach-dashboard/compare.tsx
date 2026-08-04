import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, UserCircle, Check, X, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadPlayers, PlayerProfile } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSkill, translatePosition } from '@/lib/translations';

export default function CompareScreen() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [playerA, setPlayerA] = useState<PlayerProfile | null>(null);
  const [playerB, setPlayerB] = useState<PlayerProfile | null>(null);
  const [modalFor, setModalFor] = useState<'A' | 'B' | null>(null);

  useFocusEffect(useCallback(() => {
    setPlayers(loadPlayers());
  }, []));

  const skills = [
    { key: 'decisionScore', label: t('cdCompare.decisionScore') },
    { key: 'mentalReadiness', label: t('cdCompare.overallScore') },
    { key: 'pressurePerformance', label: translateSkill('Pressure Performance', t) },
    { key: 'consistency', label: translateSkill('Consistency', t) },
    { key: 'readingAbility', label: translateSkill('Reading Ability', t) },
    { key: 'fastBreak', label: translateSkill('Fast Break', t) },
    { key: 'wingSituations', label: translateSkill('Wing Situations', t) },
    { key: 'pivotSituations', label: translateSkill('Pivot Situations', t) },
    { key: 'sevenMetre', label: translateSkill('7m Throws', t) },
  ] as const;

  const getVal = (p: PlayerProfile | null, key: string): number => {
    if (!p) return 0;
    return p[key as keyof PlayerProfile] as number;
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('cdCompare.title')}</Text>
            <Text style={styles.headerSub}>{t('cdCompare.subtitle')}</Text>
          </View>
        </View>

        {/* Player Selectors */}
        <View style={styles.selectRow}>
          <PlayerSelector
            player={playerA}
            label={t('cdCompare.selectPlayer1')}
            onPress={() => setModalFor('A')}
          />
          <View style={{ width: Spacing.sm }} />
          <PlayerSelector
            player={playerB}
            label={t('cdCompare.selectPlayer2')}
            onPress={() => setModalFor('B')}
          />
        </View>

        {/* Comparison */}
        {playerA && playerB ? (
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.sectionLabel}>{t('cdCompare.overallScore')}</Text>
            <Card variant="gradient" shadow="card" style={styles.compareCard}>
              {skills.map((skill, i) => {
                const valA = getVal(playerA, skill.key);
                const valB = getVal(playerB, skill.key);
                const aWins = valA > valB;
                const bWins = valB > valA;
                const colorA = aWins ? Colors.success : Colors.textTertiary;
                const colorB = bWins ? Colors.success : Colors.textTertiary;
                return (
                  <View key={i} style={[styles.compareRow, i < skills.length - 1 && styles.compareRowBorder]}>
                    <View style={styles.compareValCol}>
                      <Text style={[styles.compareVal, { color: colorA, fontFamily: aWins ? 'Inter-ExtraBold' : 'Inter-SemiBold' }]}>{valA}</Text>
                    </View>
                    <View style={styles.compareLabelCol}>
                      <Text style={styles.compareLabel}>{skill.label}</Text>
                      <View style={styles.compareBars}>
                        <View style={styles.compareBarHalf}>
                          <ProgressBar progress={valA / 100} height={4} color={aWins ? Colors.success : Colors.gold} />
                        </View>
                        <View style={styles.compareBarHalf}>
                          <ProgressBar progress={valB / 100} height={4} color={bWins ? Colors.success : Colors.gold} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.compareValCol}>
                      <Text style={[styles.compareVal, { color: colorB, fontFamily: bWins ? 'Inter-ExtraBold' : 'Inter-SemiBold' }]}>{valB}</Text>
                    </View>
                  </View>
                );
              })}
            </Card>

            {/* Progress Comparison */}
            <Text style={styles.sectionLabel}>PROGRESS</Text>
            <Card variant="gradient" shadow="card" style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressCol}>
                  <Text style={styles.progressName}>{playerA.name.split(' ')[0]}</Text>
                  <TrendBadge value={playerA.weeklyTrend} />
                  <Text style={styles.progressLabel}>Weekly Trend</Text>
                  <TrendBadge value={playerA.monthlyTrend} />
                  <Text style={styles.progressLabel}>Monthly Trend</Text>
                </View>
                <View style={styles.progressDivider} />
                <View style={styles.progressCol}>
                  <Text style={styles.progressName}>{playerB.name.split(' ')[0]}</Text>
                  <TrendBadge value={playerB.weeklyTrend} />
                  <Text style={styles.progressLabel}>Weekly Trend</Text>
                  <TrendBadge value={playerB.monthlyTrend} />
                  <Text style={styles.progressLabel}>Monthly Trend</Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        ) : (
          <View style={styles.emptyWrap}>
            <UserCircle size={48} color={Colors.textQuaternary} />
            <Text style={styles.emptyText}>{t('cdCompare.errorSame')}</Text>
          </View>
        )}
      </ScrollView>

      {/* Player Selection Modal */}
      <Modal visible={modalFor !== null} animationType="slide" transparent={true} onRequestClose={() => setModalFor(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdCompare.selectPlayer1')}</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalFor(null)}>
                <X size={20} color={Colors.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {players.map((p) => {
                const isSelected = (modalFor === 'A' && playerA?.id === p.id) || (modalFor === 'B' && playerB?.id === p.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.modalPlayerCard, isSelected && styles.modalPlayerCardActive]}
                    onPress={() => {
                      if (modalFor === 'A') setPlayerA(p);
                      else setPlayerB(p);
                      setModalFor(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalPlayerName}>{p.name}</Text>
                      <Text style={styles.modalPlayerMeta}>{translatePosition(p.position, t)} · {p.age} yrs · {t('cdCompare.decisionScore')}: {p.decisionScore}%</Text>
                    </View>
                    {isSelected && <Check size={18} color={Colors.gold} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function PlayerSelector({ player, label, onPress }: { player: PlayerProfile | null; label: string; onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <PressableCard onPress={onPress} variant="gradient" shadow="card" style={styles.selectorCard}>
      <View style={styles.selectorInner}>
        <View style={styles.selectorIcon}><UserCircle size={18} color={Colors.gold} /></View>
        {player ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.selectorName}>{player.name}</Text>
            <Text style={styles.selectorSub}>{label} · {t('cdCompare.decisionScore')}: {player.decisionScore}%</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.selectorPlaceholder}>{label}</Text>
            <Text style={styles.selectorSub}>{t('cdCompare.compareBtn')}</Text>
          </View>
        )}
        <ChevronRight size={18} color={Colors.gold} />
      </View>
    </PressableCard>
  );
}

function TrendBadge({ value }: { value: number }) {
  const color = value > 0 ? Colors.success : value < 0 ? Colors.error : Colors.textTertiary;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <View style={[styles.trendBadge, { backgroundColor: color + '22', borderColor: color }]}>
      <Icon size={11} color={color} />
      <Text style={[styles.trendText, { color }]}>{value > 0 ? '+' : ''}{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  selectRow: { flexDirection: 'row', marginBottom: Spacing.md },
  selectorCard: { flex: 1, marginBottom: 0 },
  selectorInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  selectorIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  selectorName: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  selectorSub: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 1 },
  selectorPlaceholder: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textQuaternary },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  compareCard: { gap: 0 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 10 },
  compareRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  compareValCol: { width: 40, alignItems: 'center' },
  compareVal: { fontSize: 16 },
  compareLabelCol: { flex: 1, gap: 4 },
  compareLabel: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary, textAlign: 'center' },
  compareBars: { flexDirection: 'row', gap: 4 },
  compareBarHalf: { flex: 1 },

  progressCard: { gap: 0 },
  progressRow: { flexDirection: 'row', alignItems: 'stretch' },
  progressCol: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: Spacing.sm },
  progressName: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.xs },
  progressLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 0.5 },
  progressDivider: { width: 1, backgroundColor: Colors.hairline },

  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  trendText: { fontFamily: 'Inter-ExtraBold', fontSize: 12 },

  emptyWrap: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xxl },
  emptyText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '75%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  modalPlayerCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm },
  modalPlayerCardActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  modalPlayerName: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  modalPlayerMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
});
