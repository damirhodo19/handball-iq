import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadPlayers, PlayerProfile } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition } from '@/lib/translations';

export default function PlayersScreen() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [search, setSearch] = useState('');

  useFocusEffect(useCallback(() => {
    setPlayers(loadPlayers());
  }, []));

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.club.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('cdPlayers.title')}</Text>
            <Text style={styles.headerSub}>{t('cdPlayers.subtitle', { n: players.length })}</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Search size={16} color={Colors.textQuaternary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('cdPlayers.searchPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Player cards */}
        {filtered.map((player, i) => (
          <PlayerCard key={player.id} player={player} index={i} onPress={() => router.push({ pathname: '/coach-dashboard/player-report', params: { playerId: player.id } })} />
        ))}

        {filtered.length === 0 && (
          <Text style={styles.emptyText}>{t('cdPlayers.empty')}</Text>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function PlayerCard({ player, index, onPress }: { player: PlayerProfile; index: number; onPress: () => void }) {
  const { t } = useTranslation();
  const trendColor = player.weeklyTrend > 0 ? Colors.success : player.weeklyTrend < 0 ? Colors.error : Colors.textTertiary;
  const TrendIcon = player.weeklyTrend > 0 ? TrendingUp : player.weeklyTrend < 0 ? TrendingDown : Minus;
  const decisionColor = player.decisionScore >= 75 ? Colors.success : player.decisionScore >= 55 ? Colors.gold : Colors.warning;
  const lastSession = player.lastSessionDate
    ? new Date(player.lastSessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : t('cdPlayers.noSessions');

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(400)}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <Card variant="gradient" shadow="card" style={styles.playerCard}>
          <View style={styles.playerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerMeta}>{translatePosition(player.position, t)} · {player.age} yrs · {player.club}</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: trendColor + '22', borderColor: trendColor }]}>
              <TrendIcon size={12} color={trendColor} />
              <Text style={[styles.trendText, { color: trendColor }]}>
                {player.weeklyTrend > 0 ? '+' : ''}{player.weeklyTrend}
              </Text>
            </View>
          </View>

          <View style={styles.scoresRow}>
            <View style={styles.scoreCol}>
              <Text style={[styles.scoreValue, { color: decisionColor }]}>{player.decisionScore}</Text>
              <Text style={styles.scoreLabel}>{t('cdPlayers.decision')}</Text>
              <ProgressBar progress={player.decisionScore / 100} height={4} color={decisionColor} />
            </View>
            <View style={styles.scoreCol}>
              <Text style={[styles.scoreValue, { color: Colors.gold }]}>{player.mentalReadiness}</Text>
              <Text style={styles.scoreLabel}>{t('cdPlayers.mental')}</Text>
              <ProgressBar progress={player.mentalReadiness / 100} height={4} color={Colors.gold} />
            </View>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreValueSmall}>{lastSession}</Text>
              <Text style={styles.scoreLabel}>{t('cdPlayers.lastSession')}</Text>
              <View style={styles.sessionsPill}>
                <Text style={styles.sessionsText}>{t('cdPlayers.total', { n: player.sessionsCompleted })}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerRow}>
            {player.assignedSession && (
              <View style={styles.assignedPill}>
                <Text style={styles.assignedText}>{t('cdPlayers.assigned', { type: player.assignedSession.type })}</Text>
              </View>
            )}
            <ChevronRight size={18} color={Colors.gold} style={{ marginLeft: 'auto' }} />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 12, marginBottom: Spacing.md },
  searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },

  playerCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  playerHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  playerName: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  playerMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  trendText: { fontFamily: 'Inter-ExtraBold', fontSize: 12 },

  scoresRow: { flexDirection: 'row', gap: Spacing.md },
  scoreCol: { flex: 1, gap: 4 },
  scoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 20 },
  scoreValueSmall: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textSecondary },
  scoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 0.5 },
  sessionsPill: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  sessionsText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary },

  footerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline, paddingTop: Spacing.sm },
  assignedPill: { backgroundColor: Colors.goldSoft, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.gold },
  assignedText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },

  emptyText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', marginTop: Spacing.xxl },
});
