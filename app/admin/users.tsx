import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  Ban,
  CheckCircle2,
  ChevronRight,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card, PressableCard } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';
import {
  listAdminUsers,
  setAdminUserBlocked,
  setAdminUserRole,
  type AdminManagedRole,
  type AdminUserRecord,
} from '@/services/adminUserService';

type RoleFilter = 'all' | AdminManagedRole;
type StatusFilter = 'all' | 'active' | 'blocked';
type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

const ROLE_OPTIONS: AdminManagedRole[] = ['player', 'coach', 'player_coach'];

const GOAL_KEYS: Record<string, string> = {
  'Decision Making': 'devGoal.decisionMaking',
  'Game Intelligence': 'goal.gameIntelligence',
  Defence: 'goal.defence',
  Attack: 'goal.attack',
  'Mental Preparation': 'devGoal.mentalPreparation',
  'Match Preparation': 'goal.matchPreparation',
  Leadership: 'goal.leadership',
  'Complete Development': 'goal.completeDevelopment',
  Tactics: 'coachGoal.tactics',
  'Player Development': 'coachGoal.playerDevelopment',
  'Training Planning': 'coachGoal.trainingPlanning',
  'Match Analysis': 'coachGoal.matchAnalysis',
};

function userName(user: AdminUserRecord): string {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.display_name || user.email || '—';
}

function roleLabel(role: string, t: TranslateFn): string {
  if (role === 'player') return t('onboarding.v2.player');
  if (role === 'coach') return t('onboarding.v2.coach');
  if (role === 'player_coach') return t('onboarding.v2.playerCoach');
  if (role === 'admin') return t('role.admin');
  return role;
}

function goalLabel(goal: string, t: TranslateFn): string {
  const key = GOAL_KEYS[goal];
  return key ? t(key) : goal;
}

function localeFor(lang: string): string {
  if (lang === 'hr') return 'hr-HR';
  if (lang === 'de') return 'de-DE';
  return 'en-US';
}

function dateLabel(value: string | null, lang: string, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(localeFor(lang));
}

export default function AdminUsersScreen() {
  const { t, lang } = useTranslation();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [workingUserId, setWorkingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await listAdminUsers();
    if (result.error) {
      setError(t('adminUsers.loadFailed'));
    } else {
      setUsers(result.users);
    }
    setLoading(false);
  }, [t]);

  useFocusEffect(useCallback(() => {
    void loadUsers();
  }, [loadUsers]));

  const selectedUser = useMemo(
    () => users.find((user) => user.user_id === selectedId) ?? null,
    [selectedId, users],
  );

  const filteredUsers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (statusFilter === 'active' && user.blocked) return false;
      if (statusFilter === 'blocked' && !user.blocked) return false;
      if (!needle) return true;
      return `${userName(user)} ${user.email ?? ''}`.toLowerCase().includes(needle);
    });
  }, [roleFilter, search, statusFilter, users]);

  const blockedCount = users.filter((user) => user.blocked).length;
  const onboardedCount = users.filter((user) => user.onboarded).length;

  const applyRole = async (user: AdminUserRecord, role: AdminManagedRole) => {
    setWorkingUserId(user.user_id);
    const result = await setAdminUserRole(user.user_id, role);
    setWorkingUserId(null);
    if (result.error) {
      Alert.alert(t('adminUsers.actionFailed'), t('adminUsers.roleChangeFailed'));
      return;
    }
    await loadUsers();
  };

  const confirmRoleChange = (user: AdminUserRecord, role: AdminManagedRole) => {
    if (user.role === role) return;
    Alert.alert(
      t('adminUsers.changeRole'),
      t('adminUsers.changeRoleConfirm', { name: userName(user), role: roleLabel(role, t) }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('adminUsers.confirmChange'), onPress: () => void applyRole(user, role) },
      ],
    );
  };

  const applyBlocked = async (user: AdminUserRecord, blocked: boolean) => {
    setWorkingUserId(user.user_id);
    const result = await setAdminUserBlocked(user.user_id, blocked);
    setWorkingUserId(null);
    if (result.error) {
      Alert.alert(t('adminUsers.actionFailed'), t('adminUsers.accessChangeFailed'));
      return;
    }
    await loadUsers();
  };

  const confirmBlockedChange = (user: AdminUserRecord) => {
    const nextBlocked = !user.blocked;
    Alert.alert(
      nextBlocked ? t('adminUsers.blockAccount') : t('adminUsers.unblockAccount'),
      nextBlocked
        ? t('adminUsers.blockConfirm', { name: userName(user) })
        : t('adminUsers.unblockConfirm', { name: userName(user) }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: nextBlocked ? t('adminUsers.block') : t('adminUsers.unblock'),
          style: nextBlocked ? 'destructive' : 'default',
          onPress: () => void applyBlocked(user, nextBlocked),
        },
      ],
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('adminUsers.title')}</Text>
            <Text style={styles.headerSub}>{t('adminUsers.subtitle')}</Text>
          </View>
          <View style={styles.headerIcon}><Users size={22} color={Colors.gold} /></View>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard value={users.length} label={t('adminUsers.total')} color={Colors.gold} />
          <SummaryCard value={onboardedCount} label={t('adminUsers.onboarded')} color={Colors.success} />
          <SummaryCard value={blockedCount} label={t('adminUsers.blocked')} color={Colors.error} />
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t('adminUsers.searchPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            autoCapitalize="none"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel={t('common.close')}>
              <X size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.filterLabel}>{t('adminUsers.roleFilter')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <FilterChip label={t('common.all')} active={roleFilter === 'all'} onPress={() => setRoleFilter('all')} />
          {ROLE_OPTIONS.map((role) => (
            <FilterChip key={role} label={roleLabel(role, t)} active={roleFilter === role} onPress={() => setRoleFilter(role)} />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>{t('adminUsers.statusFilter')}</Text>
        <View style={styles.chipRow}>
          <FilterChip label={t('common.all')} active={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
          <FilterChip label={t('adminUsers.active')} active={statusFilter === 'active'} onPress={() => setStatusFilter('active')} />
          <FilterChip label={t('adminUsers.blocked')} active={statusFilter === 'blocked'} onPress={() => setStatusFilter('blocked')} />
        </View>

        {error ? (
          <Card variant="gradient" style={styles.messageCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label={t('common.retry')} onPress={() => void loadUsers()} variant="outline" size="md" />
          </Card>
        ) : loading ? (
          <Card variant="gradient" style={styles.messageCard}>
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users size={30} color={Colors.gold} />}
            title={t('adminUsers.noUsers')}
            description={t('adminUsers.noUsersSub')}
          />
        ) : (
          <View style={styles.userList}>
            <Text style={styles.resultCount}>{t('adminUsers.results', { n: filteredUsers.length })}</Text>
            {filteredUsers.map((user) => (
              <PressableCard
                key={user.user_id}
                onPress={() => setSelectedId(user.user_id)}
                variant="gradient"
                shadow="card"
                style={styles.userCard}
              >
                <View style={styles.userRow}>
                  <View style={styles.avatar}><UserRound size={20} color={Colors.gold} /></View>
                  <View style={styles.userCopy}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName} numberOfLines={1}>{userName(user)}</Text>
                      {user.is_admin ? <ShieldCheck size={15} color={Colors.gold} /> : null}
                    </View>
                    <Text style={styles.userEmail} numberOfLines={1}>{user.email ?? t('common.notSet')}</Text>
                    <View style={styles.metaRow}>
                      <StatusPill label={roleLabel(user.role, t)} color={Colors.gold} />
                      <StatusPill
                        label={user.blocked ? t('adminUsers.blocked') : t('adminUsers.active')}
                        color={user.blocked ? Colors.error : Colors.success}
                      />
                    </View>
                  </View>
                  <ChevronRight size={18} color={Colors.textQuaternary} />
                </View>
              </PressableCard>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedUser !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {selectedUser ? (
              <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatar}><UserRound size={24} color={Colors.gold} /></View>
                  <View style={styles.modalHeaderCopy}>
                    <Text style={styles.modalTitle}>{userName(selectedUser)}</Text>
                    <Text style={styles.userEmail}>{selectedUser.email ?? t('common.notSet')}</Text>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedId(null)}>
                    <X size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailGrid}>
                  <DetailRow label={t('adminUsers.accountStatus')} value={selectedUser.blocked ? t('adminUsers.blocked') : t('adminUsers.active')} />
                  <DetailRow label={t('profile.role')} value={roleLabel(selectedUser.role, t)} />
                  <DetailRow label={t('adminUsers.onboarding')} value={selectedUser.onboarded ? t('adminUsers.completed') : t('adminUsers.notCompleted')} />
                  <DetailRow
                    label={t('adminUsers.positions')}
                    value={[selectedUser.primary_position, selectedUser.secondary_position]
                      .filter(Boolean)
                      .map((position) => translatePosition(position!, t))
                      .join(' · ') || t('common.notSet')}
                  />
                  <DetailRow
                    label={t('adminUsers.developmentGoals')}
                    value={[...selectedUser.development_goals, ...selectedUser.coach_development_goals]
                      .map((goal) => goalLabel(goal, t))
                      .join(' · ') || t('common.notSet')}
                  />
                  <DetailRow label={t('adminUsers.registered')} value={dateLabel(selectedUser.created_at, lang, t('common.notSet'))} />
                  <DetailRow label={t('adminUsers.lastSignIn')} value={dateLabel(selectedUser.last_sign_in_at, lang, t('adminUsers.never'))} />
                  <DetailRow label={t('adminUsers.lastActive')} value={dateLabel(selectedUser.last_active_date, lang, t('common.notSet'))} />
                </View>

                <Text style={styles.modalSectionLabel}>{t('adminUsers.changeRole')}</Text>
                <View style={styles.roleActions}>
                  {ROLE_OPTIONS.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[styles.roleButton, selectedUser.role === role && styles.roleButtonActive]}
                      onPress={() => confirmRoleChange(selectedUser, role)}
                      disabled={workingUserId === selectedUser.user_id}
                    >
                      <Text style={[styles.roleButtonText, selectedUser.role === role && styles.roleButtonTextActive]}>
                        {roleLabel(role, t)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedUser.is_admin ? (
                  <View style={styles.adminProtection}>
                    <ShieldCheck size={18} color={Colors.gold} />
                    <Text style={styles.adminProtectionText}>{t('adminUsers.adminProtected')}</Text>
                  </View>
                ) : (
                  <Button
                    label={selectedUser.blocked ? t('adminUsers.unblockAccount') : t('adminUsers.blockAccount')}
                    onPress={() => confirmBlockedChange(selectedUser)}
                    variant={selectedUser.blocked ? 'outline' : 'danger'}
                    loading={workingUserId === selectedUser.user_id}
                    icon={selectedUser.blocked
                      ? <CheckCircle2 size={19} color={Colors.gold} />
                      : <Ban size={19} color={Colors.error} />}
                  />
                )}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function SummaryCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.filterChip, active && styles.filterChipActive]} onPress={onPress}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.statusPill, { borderColor: color }]}>
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
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
  summaryLabel: { fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 50, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 15, paddingVertical: 12, outlineStyle: 'none' } as never,
  filterLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1, color: Colors.textTertiary, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingRight: Spacing.sm, marginBottom: Spacing.sm },
  filterChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  filterChipText: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.gold, fontFamily: 'Inter-Bold' },
  messageCard: { marginTop: Spacing.lg, gap: Spacing.md, alignItems: 'center' },
  loadingText: { fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.textSecondary },
  errorText: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.error, textAlign: 'center' },
  userList: { gap: Spacing.sm, marginTop: Spacing.lg },
  resultCount: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary, marginBottom: 2 },
  userCard: { marginBottom: 0 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  userCopy: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { flexShrink: 1, fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  userEmail: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  statusPill: { borderRadius: Radius.pill, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  statusPillText: { fontFamily: 'Inter-Bold', fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.62)', justifyContent: 'flex-end' },
  modalSheet: { maxHeight: '92%', backgroundColor: Colors.background, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  modalContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  modalAvatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  modalHeaderCopy: { flex: 1 },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  closeButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  detailGrid: { borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  detailRow: { paddingHorizontal: Spacing.md, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.hairline, gap: 4 },
  detailLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 },
  detailValue: { fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  modalSectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.sm },
  roleActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  roleButton: { flexGrow: 1, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  roleButtonActive: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  roleButtonText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  roleButtonTextActive: { color: Colors.gold },
  adminProtection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold },
  adminProtectionText: { flex: 1, fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.textPrimary, lineHeight: 19 },
});
