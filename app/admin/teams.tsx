import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ChevronDown, ChevronUp, Search, Shield, UserPlus, Users } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card, PressableCard } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';
import {
  getAdminTeamDetails,
  listAdminTeams,
  type AdminTeamDetails,
  type AdminTeamRecord,
} from '@/services/adminTeamService';

export default function AdminTeamsScreen() {
  const { t, lang } = useTranslation();
  const [teams, setTeams] = useState<AdminTeamRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, AdminTeamDetails>>({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await listAdminTeams();
    if (result.error) setError(t('adminTeams.loadFailed'));
    else setTeams(result.teams);
    setLoading(false);
  }, [t]);

  useFocusEffect(useCallback(() => {
    loadTeams();
  }, [loadTeams]));

  const visibleTeams = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return teams;
    return teams.filter((team) =>
      `${team.team_name} ${team.club_name ?? ''} ${team.creator_email ?? ''}`
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [search, teams]);

  const totalPlayers = teams.reduce((sum, team) => sum + team.player_count, 0);
  const totalPending = teams.reduce((sum, team) => sum + team.pending_request_count, 0);

  const toggleTeam = async (team: AdminTeamRecord) => {
    if (selectedId === team.team_id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(team.team_id);
    if (details[team.team_id]) return;
    setLoadingDetails(team.team_id);
    const result = await getAdminTeamDetails(team.team_id);
    if (result.error) setError(t('adminTeams.detailsFailed'));
    else setDetails((current) => ({ ...current, [team.team_id]: result.details }));
    setLoadingDetails(null);
  };

  const locale = lang === 'hr' ? 'hr-HR' : lang === 'de' ? 'de-DE' : 'en-US';

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('adminTeams.title')}</Text>
            <Text style={styles.headerSub}>{t('adminTeams.subtitle')}</Text>
          </View>
          <View style={styles.headerIcon}><Shield size={21} color={Colors.gold} /></View>
        </View>

        <View style={styles.summaryRow}>
          <Summary value={teams.length} label={t('adminTeams.totalTeams')} color={Colors.gold} />
          <Summary value={totalPlayers} label={t('adminTeams.totalPlayers')} color={Colors.success} />
          <Summary value={totalPending} label={t('adminTeams.pending')} color={Colors.warning} />
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t('adminTeams.searchPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
          />
        </View>

        {error ? (
          <Card style={styles.messageCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label={t('common.retry')} onPress={loadTeams} variant="outline" size="md" />
          </Card>
        ) : null}

        {loading ? (
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        ) : visibleTeams.length === 0 ? (
          <EmptyState
            icon={<Users size={30} color={Colors.gold} />}
            title={t('adminTeams.noTeams')}
            description={t('adminTeams.noTeamsSub')}
          />
        ) : (
          <View style={styles.list}>
            <Text style={styles.resultCount}>{t('adminTeams.results', { n: visibleTeams.length })}</Text>
            {visibleTeams.map((team) => {
              const expanded = selectedId === team.team_id;
              const teamDetails = details[team.team_id];
              return (
                <View key={team.team_id} style={styles.teamGroup}>
                  <PressableCard onPress={() => toggleTeam(team)} variant="gradient" style={styles.teamCard}>
                    <View style={styles.teamRow}>
                      <View style={styles.teamIcon}><Users size={20} color={Colors.gold} /></View>
                      <View style={styles.teamCopy}>
                        <Text style={styles.teamName}>{team.team_name}</Text>
                        <Text style={styles.teamMeta}>
                          {[team.club_name, team.team_category].filter(Boolean).join(' · ') || t('common.notSet')}
                        </Text>
                        <Text style={styles.creator} numberOfLines={1}>{team.creator_email ?? '—'}</Text>
                      </View>
                      <View style={styles.counts}>
                        <Text style={styles.countText}>{team.player_count} {t('adminTeams.playersShort')}</Text>
                        {team.pending_request_count > 0 ? (
                          <Text style={styles.pendingText}>{team.pending_request_count} {t('adminTeams.pendingShort')}</Text>
                        ) : null}
                      </View>
                      {expanded
                        ? <ChevronUp size={18} color={Colors.gold} />
                        : <ChevronDown size={18} color={Colors.textTertiary} />}
                    </View>
                  </PressableCard>

                  {expanded ? (
                    <Card variant="gradient" shadow="none" style={styles.detailsCard}>
                      <View style={styles.detailTop}>
                        <Detail label={t('adminTeams.code')} value={team.invitation_code ?? '—'} />
                        <Detail label={t('adminTeams.created')} value={new Date(team.created_at).toLocaleDateString(locale)} />
                        <Detail label={t('adminTeams.coaches')} value={String(team.coach_count)} />
                      </View>

                      {loadingDetails === team.team_id ? (
                        <Text style={styles.loadingText}>{t('common.loading')}</Text>
                      ) : teamDetails ? (
                        <>
                          <Text style={styles.sectionLabel}>{t('adminTeams.members')}</Text>
                          {teamDetails.members.length === 0 ? (
                            <Text style={styles.emptyText}>{t('adminTeams.noMembers')}</Text>
                          ) : teamDetails.members.map((member) => (
                            <View key={member.id} style={styles.memberRow}>
                              <View style={styles.memberAvatar}><Users size={15} color={Colors.gold} /></View>
                              <View style={styles.memberCopy}>
                                <Text style={styles.memberName}>{member.display_name ?? member.email ?? '—'}</Text>
                                <Text style={styles.memberMeta}>
                                  {member.member_role === 'player'
                                    ? (member.position ? translatePosition(member.position, t) : t('common.notSet'))
                                    : t(`team.role.${member.member_role}`)}
                                </Text>
                              </View>
                            </View>
                          ))}

                          <Text style={styles.sectionLabel}>{t('adminTeams.joinRequests')}</Text>
                          {teamDetails.requests.length === 0 ? (
                            <Text style={styles.emptyText}>{t('adminTeams.noRequests')}</Text>
                          ) : teamDetails.requests.map((request) => (
                            <View key={request.request_id} style={styles.memberRow}>
                              <View style={[styles.memberAvatar, { backgroundColor: Colors.warningSoft }]}>
                                <UserPlus size={15} color={Colors.warning} />
                              </View>
                              <View style={styles.memberCopy}>
                                <Text style={styles.memberName}>{request.display_name}</Text>
                                <Text style={styles.memberMeta}>{request.email ?? '—'}</Text>
                              </View>
                              <Text style={[
                                styles.requestStatus,
                                request.request_status === 'approved' && { color: Colors.success },
                                request.request_status === 'rejected' && { color: Colors.error },
                              ]}>
                                {t(`adminTeams.status.${request.request_status}`)}
                              </Text>
                            </View>
                          ))}
                        </>
                      ) : null}
                    </Card>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function Summary({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  headerIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  summaryCard: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  summaryValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24 },
  summaryLabel: { fontFamily: 'Inter-Medium', fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 50, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 15, paddingVertical: 12, outlineStyle: 'none' } as never,
  messageCard: { marginTop: Spacing.md, gap: Spacing.md },
  errorText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.error, textAlign: 'center' },
  list: { gap: Spacing.sm, marginTop: Spacing.lg },
  resultCount: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },
  teamGroup: { gap: 2 },
  teamCard: { marginBottom: 0 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  teamIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  teamCopy: { flex: 1, minWidth: 0 },
  teamName: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  teamMeta: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.gold, marginTop: 2 },
  creator: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  counts: { alignItems: 'flex-end', gap: 2 },
  countText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textSecondary },
  pendingText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.warning },
  detailsCard: { marginHorizontal: Spacing.sm, borderTopLeftRadius: 0, borderTopRightRadius: 0, gap: Spacing.sm, padding: Spacing.md },
  detailTop: { flexDirection: 'row', gap: Spacing.sm },
  detailItem: { flex: 1, padding: Spacing.sm, borderRadius: Radius.sm, backgroundColor: Colors.surfaceRaised },
  detailLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.textTertiary, letterSpacing: 0.5 },
  detailValue: { fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textPrimary, marginTop: 3 },
  loadingText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.textSecondary, textAlign: 'center', padding: Spacing.md },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.md },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  memberAvatar: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  memberCopy: { flex: 1, minWidth: 0 },
  memberName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textPrimary },
  memberMeta: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  requestStatus: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.warning },
  emptyText: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, paddingVertical: Spacing.sm },
});
