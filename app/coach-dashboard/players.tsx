import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CheckCircle2, ChevronRight, Link2, Search, UserRound } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  loadCoachAttendanceHistoryForTeam,
  loadCoachRosterForTeam,
  syncCoachWorkspaceForTeam,
  type CoachRosterPlayer,
} from '@/lib/coach-workspace';
import { fetchAssignments, fetchTeamMembers, getActiveTeam } from '@/lib/team-platform/platform';
import type { TeamMemberRecord, TrainingAssignment } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';

interface PlayerListItem {
  rosterId: string | null;
  userId: string | null;
  name: string;
  position: string | null;
  secondaryPosition: string | null;
  decisionScore: number;
  xp: number;
  improvement: number;
  attendanceRate: number | null;
  activeAssignments: number;
}

export default function PlayersScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const coachId = user?.id ?? 'dev_coach';
  const team = getActiveTeam();
  const teamKey = team?.id ?? 'default';
  const [players, setPlayers] = useState<PlayerListItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await syncCoachWorkspaceForTeam(coachId, teamKey);
    const roster = loadCoachRosterForTeam(coachId, teamKey);
    const members = team ? await fetchTeamMembers(team.id) : [];
    const assignments = team ? await fetchAssignments(team.id) : [];
    setPlayers(buildPlayerList(roster, members, assignments, coachId, teamKey));
    setLoading(false);
  }, [coachId, team, teamKey]);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return players;
    return players.filter((player) =>
      player.name.toLowerCase().includes(needle) ||
      (player.position ?? '').toLowerCase().includes(needle),
    );
  }, [players, search]);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('cdPlayers.title')}</Text>
            <Text style={styles.headerSub}>{t('cdPlayers.subtitle', { n: players.length })}</Text>
          </View>
        </View>

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

        {filtered.map((player, index) => (
          <Animated.View key={player.rosterId ?? player.userId ?? player.name} entering={FadeInDown.delay(index * 35).duration(350)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/coach-dashboard/player-hub',
                params: {
                  rosterPlayerId: player.rosterId ?? '',
                  playerId: player.userId ?? '',
                  playerName: player.name,
                  position: player.position ?? '',
                },
              } as never)}
            >
              <Card variant="gradient" shadow="card" style={styles.playerCard}>
                <View style={styles.playerHeader}>
                  <View style={styles.avatar}><UserRound size={20} color={Colors.gold} /></View>
                  <View style={styles.playerCopy}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerMeta}>
                      {player.position ? translatePosition(player.position, t) : t('team.positionNotSet')}
                      {player.secondaryPosition ? ` · ${translatePosition(player.secondaryPosition, t)}` : ''}
                    </Text>
                  </View>
                  {player.userId ? <Link2 size={16} color={Colors.success} /> : null}
                  <ChevronRight size={18} color={Colors.gold} />
                </View>

                <View style={styles.metrics}>
                  <Metric value={player.attendanceRate == null ? '—' : `${player.attendanceRate}%`} label={t('team.attendance')} />
                  <Metric value={player.userId ? `${player.decisionScore}%` : '—'} label={t('cdPlayers.decision')} />
                  <Metric value={String(player.activeAssignments)} label={t('coachPlayerHub.activeTasks')} />
                </View>
                {player.userId ? (
                  <View style={styles.progressWrap}>
                    <View style={styles.progressCopy}>
                      <Text style={styles.progressLabel}>{t('coachPlayerHub.development')}</Text>
                      <Text style={styles.progressValue}>+{player.improvement}% · {player.xp} XP</Text>
                    </View>
                    <ProgressBar progress={Math.max(0, Math.min(1, player.decisionScore / 100))} height={5} color={Colors.gold} />
                  </View>
                ) : (
                  <View style={styles.manualRow}>
                    <CheckCircle2 size={14} color={Colors.textTertiary} />
                    <Text style={styles.manualText}>{t('coachPlayerHub.manualPlayerHint')}</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {!loading && filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={28} color={Colors.gold} />}
            title={t('cdPlayers.empty')}
            description={search ? t('cdPlayers.emptySearch') : t('cdPlayers.emptySub')}
            actionLabel={search ? t('common.clearAll') : t('team.openAttendance')}
            onAction={search ? () => setSearch('') : () => router.push('/coach-dashboard/attendance')}
          />
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

function buildPlayerList(
  roster: CoachRosterPlayer[],
  members: TeamMemberRecord[],
  assignments: TrainingAssignment[],
  coachId: string,
  teamKey: string,
): PlayerListItem[] {
  const playerMembers = members.filter((member) => member.member_role === 'player');
  const memberByUser = new Map(playerMembers.map((member) => [member.user_id, member]));
  const rows: PlayerListItem[] = roster.map((entry) => {
    const member = entry.linked_user_id ? memberByUser.get(entry.linked_user_id) : undefined;
    const attendance = loadCoachAttendanceHistoryForTeam(coachId, teamKey, entry.id);
    const present = attendance.filter((item) => item.status === 'present').length;
    return {
      rosterId: entry.id,
      userId: entry.linked_user_id,
      name: member?.display_name ?? entry.display_name,
      position: member?.position ?? entry.position,
      secondaryPosition: member?.secondary_position ?? null,
      decisionScore: member?.decision_score ?? 0,
      xp: member?.total_xp ?? 0,
      improvement: member?.improvement ?? 0,
      attendanceRate: attendance.length ? Math.round((present / attendance.length) * 100) : null,
      activeAssignments: entry.linked_user_id
        ? assignments.filter((assignment) => assignment.player_id === entry.linked_user_id && assignment.status !== 'completed').length
        : 0,
    };
  });
  for (const member of playerMembers) {
    if (rows.some((row) => row.userId === member.user_id)) continue;
    rows.push({
      rosterId: null,
      userId: member.user_id,
      name: member.display_name ?? member.email ?? 'Player',
      position: member.position ?? null,
      secondaryPosition: member.secondary_position ?? null,
      decisionScore: member.decision_score ?? 0,
      xp: member.total_xp ?? 0,
      improvement: member.improvement ?? 0,
      attendanceRate: null,
      activeAssignments: assignments.filter((assignment) => assignment.player_id === member.user_id && assignment.status !== 'completed').length,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, minHeight: 48, marginBottom: Spacing.sm },
  searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },
  playerCard: { gap: Spacing.md },
  playerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  playerCopy: { flex: 1, minWidth: 0 },
  playerName: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  playerMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  metrics: { flexDirection: 'row', gap: Spacing.sm },
  metric: { flex: 1, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.sm, padding: Spacing.sm, alignItems: 'center' },
  metricValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.gold },
  metricLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.textTertiary, textAlign: 'center', marginTop: 2 },
  progressWrap: { gap: 6 },
  progressCopy: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  progressLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },
  progressValue: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  manualRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  manualText: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
});
