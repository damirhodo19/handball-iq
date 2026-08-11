import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Check, Link2, UserPlus, Users, X } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import {
  cacheLinkedCoachRosterPlayer,
  loadCoachRosterForTeam,
  syncCoachWorkspaceForTeam,
  type CoachRosterPlayer,
} from '@/lib/coach-workspace';
import { mapServiceError } from '@/lib/map-error';
import {
  decideTeamJoinRequest,
  fetchTeamJoinRequests,
  getActiveTeam,
} from '@/lib/team-platform/platform';
import type { TeamJoinRequest, TeamRecord } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';

export default function TeamJoinRequestsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const coachId = user?.id ?? 'dev_coach';
  const { refresh: refreshTeams } = useTeamPlatform(user?.id, user?.email);
  const [team, setTeam] = useState<TeamRecord | null>(getActiveTeam());
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [roster, setRoster] = useState<CoachRosterPlayer[]>([]);
  const [selections, setSelections] = useState<Record<string, string | null>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    await refreshTeams();
    const activeTeam = getActiveTeam();
    setTeam(activeTeam);
    if (!activeTeam) {
      setRequests([]);
      setRoster([]);
      setLoading(false);
      return;
    }

    await syncCoachWorkspaceForTeam(coachId, activeTeam.id);

    const availableRoster = loadCoachRosterForTeam(coachId, activeTeam.id)
      .filter((player) => !player.linked_user_id);
    setRoster(availableRoster);

    const result = await fetchTeamJoinRequests(activeTeam.id);
    if (result.error) setMessage(mapServiceError(result.error, t));
    setRequests(result.requests);
    setSelections((current) => {
      const next = { ...current };
      for (const request of result.requests) {
        if (next[request.request_id] !== undefined) continue;
        const normalizedName = request.display_name.trim().toLocaleLowerCase();
        const match = availableRoster.find(
          (player) => player.display_name.trim().toLocaleLowerCase() === normalizedName,
        );
        next[request.request_id] = match?.id ?? null;
      }
      return next;
    });
    setLoading(false);
  }, [coachId, refreshTeams, t]);

  useFocusEffect(useCallback(() => {
    refresh();
  }, [refresh]));

  const decide = async (request: TeamJoinRequest, approve: boolean) => {
    setBusyId(request.request_id);
    setMessage('');
    const result = await decideTeamJoinRequest({
      requestId: request.request_id,
      approve,
      rosterPlayerId: approve ? selections[request.request_id] ?? null : null,
    });
    if (result.error) {
      setMessage(mapServiceError(result.error, t));
      setBusyId(null);
      return;
    }
    if (result.rosterPlayer) cacheLinkedCoachRosterPlayer(result.rosterPlayer);
    setMessage(t(approve ? 'team.requestApproved' : 'team.requestRejected', {
      name: request.display_name,
    }));
    setRequests((current) => current.filter((item) => item.request_id !== request.request_id));
    setBusyId(null);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('team.joinRequests')}</Text>
            <Text style={styles.headerSub}>{team?.name ?? t('team.myTeam')}</Text>
          </View>
          <View style={styles.headerIcon}><UserPlus size={21} color={Colors.gold} /></View>
        </View>

        <Card variant="gradient" shadow="card" style={styles.infoCard}>
          <Link2 size={20} color={Colors.gold} />
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>{t('team.linkRosterTitle')}</Text>
            <Text style={styles.infoText}>{t('team.linkRosterHint')}</Text>
          </View>
        </Card>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {loading ? (
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        ) : !team ? (
          <EmptyState
            icon={<Users size={30} color={Colors.gold} />}
            title={t('team.noTeamForRequests')}
            description={t('team.noTeamForRequestsSub')}
          />
        ) : requests.length === 0 && !loading ? (
          <EmptyState
            icon={<Check size={30} color={Colors.gold} />}
            title={t('team.noJoinRequests')}
            description={t('team.noJoinRequestsSub')}
          />
        ) : (
          <View style={styles.list}>
            <Text style={styles.sectionLabel}>{t('team.pendingRequests')} · {requests.length}</Text>
            {requests.map((request) => {
              const selectedRosterId = selections[request.request_id] ?? null;
              return (
                <Card key={request.request_id} variant="gradient" shadow="card" style={styles.requestCard}>
                  <View style={styles.playerRow}>
                    <View style={styles.avatar}><Users size={19} color={Colors.gold} /></View>
                    <View style={styles.playerCopy}>
                      <Text style={styles.playerName}>{request.display_name}</Text>
                      <Text style={styles.playerMeta} numberOfLines={1}>{request.email ?? '—'}</Text>
                      <Text style={styles.playerPosition}>
                        {request.primary_position
                          ? [request.primary_position, request.secondary_position]
                              .filter(Boolean)
                              .map((position) => translatePosition(position!, t))
                              .join(' · ')
                          : t('common.notSet')}
                      </Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>{t('team.requestPending')}</Text>
                    </View>
                  </View>

                  <Text style={styles.linkLabel}>{t('team.linkExistingRoster')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rosterOptions}>
                    <TouchableOpacity
                      style={[styles.rosterChip, selectedRosterId === null && styles.rosterChipActive]}
                      onPress={() => setSelections((current) => ({ ...current, [request.request_id]: null }))}
                    >
                      <Text style={[styles.rosterChipText, selectedRosterId === null && styles.rosterChipTextActive]}>
                        {t('team.createRosterAutomatically')}
                      </Text>
                    </TouchableOpacity>
                    {roster.map((player) => (
                      <TouchableOpacity
                        key={player.id}
                        style={[styles.rosterChip, selectedRosterId === player.id && styles.rosterChipActive]}
                        onPress={() => setSelections((current) => ({ ...current, [request.request_id]: player.id }))}
                      >
                        <Text style={[styles.rosterChipText, selectedRosterId === player.id && styles.rosterChipTextActive]}>
                          {player.display_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.actions}>
                    <Button
                      label={t('team.rejectRequest')}
                      onPress={() => decide(request, false)}
                      variant="danger"
                      size="md"
                      fullWidth={false}
                      disabled={busyId !== null}
                      icon={<X size={17} color={Colors.error} />}
                      style={styles.actionButton}
                    />
                    <Button
                      label={t('team.approveRequest')}
                      onPress={() => decide(request, true)}
                      size="md"
                      fullWidth={false}
                      loading={busyId === request.request_id}
                      disabled={busyId !== null && busyId !== request.request_id}
                      icon={<Check size={17} color={Colors.background} />}
                      style={styles.actionButton}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  headerCopy: { flex: 1, minWidth: 0 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.gold },
  infoCard: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', padding: Spacing.md },
  infoCopy: { flex: 1, gap: 4 },
  infoTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  infoText: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 13, lineHeight: 19, color: Colors.gold, textAlign: 'center' },
  loadingText: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.xl },
  list: { gap: Spacing.md },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.4, color: Colors.textTertiary, marginTop: Spacing.sm },
  requestCard: { gap: Spacing.md, padding: Spacing.md },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  playerCopy: { flex: 1, minWidth: 0 },
  playerName: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  playerMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  playerPosition: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, marginTop: 2 },
  pendingBadge: { backgroundColor: Colors.warningSoft, borderRadius: Radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  pendingText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.warning },
  linkLabel: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  rosterOptions: { gap: Spacing.sm, paddingRight: Spacing.sm },
  rosterChip: { borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.surfaceRaised },
  rosterChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  rosterChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  rosterChipTextActive: { color: Colors.background },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionButton: { flex: 1 },
});
