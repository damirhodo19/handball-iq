import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Check, ChevronLeft, ChevronRight, Link2, Plus, Trash2, UserRound, Users, X } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  addCoachRosterPlayer,
  loadCoachAttendanceForTeam,
  loadCoachRosterForTeam,
  removeCoachRosterPlayer,
  setCoachAttendance,
  syncCoachWorkspaceForTeam,
  type CoachAttendanceEntry,
  type CoachAttendanceStatus,
  type CoachRosterPlayer,
} from '@/lib/coach-workspace';
import { ALL_POSITIONS } from '@/lib/positions';
import { getActiveTeam } from '@/lib/team-platform/platform';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';

function localDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(value: string, amount: number): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return localDateString();
  date.setDate(date.getDate() + amount);
  return localDateString(date);
}

export default function CoachAttendanceScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const coachId = user?.id ?? 'dev_coach';
  const team = getActiveTeam();
  const teamKey = team?.id ?? 'default';
  const [date, setDate] = useState(localDateString());
  const [players, setPlayers] = useState<CoachRosterPlayer[]>([]);
  const [attendance, setAttendance] = useState<CoachAttendanceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(() => {
    setPlayers(loadCoachRosterForTeam(coachId, teamKey));
    setAttendance(loadCoachAttendanceForTeam(coachId, teamKey, date));
  }, [coachId, teamKey, date]);

  useFocusEffect(useCallback(() => {
    let active = true;
    refresh();
    (async () => {
      const error = await syncCoachWorkspaceForTeam(coachId, teamKey);
      if (!active) return;
      if (error) setMessage(t('team.workspaceSyncError'));
      refresh();
    })();
    return () => { active = false; };
  }, [coachId, teamKey, refresh, t]));

  const attendanceMap = useMemo(
    () => new Map(attendance.map((entry) => [entry.roster_player_id, entry.status])),
    [attendance],
  );
  const presentCount = attendance.filter((entry) => entry.status === 'present').length;
  const absentCount = attendance.filter((entry) => entry.status === 'absent').length;

  const handleAddPlayer = async () => {
    if (!playerName.trim()) {
      setMessage(t('team.playerNameRequired'));
      return;
    }
    setSaving(true);
    const { cloudError } = await addCoachRosterPlayer({
      coachId,
      teamKey,
      displayName: playerName,
      position,
    });
    setPlayerName('');
    setPosition(null);
    setShowForm(false);
    setMessage(cloudError ? t('team.savedLocally') : t('team.playerAdded'));
    refresh();
    setSaving(false);
  };

  const markAttendance = async (player: CoachRosterPlayer, status: CoachAttendanceStatus) => {
    const { cloudError } = await setCoachAttendance({
      coachId,
      teamKey: player.team_key,
      rosterPlayerId: player.id,
      trainingDate: date,
      status,
    });
    setMessage(cloudError ? t('team.savedLocally') : '');
    refresh();
  };

  const confirmRemove = (player: CoachRosterPlayer) => {
    Alert.alert(
      t('team.removePlayer'),
      t('team.removePlayerConfirm', { name: player.display_name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const error = await removeCoachRosterPlayer(coachId, player.team_key, player.id);
            setMessage(error ? t('team.savedLocally') : '');
            refresh();
          },
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
            <Text style={styles.headerTitle}>{t('team.attendanceManager')}</Text>
            <Text style={styles.headerSub}>{team?.name ?? t('team.myTeam')}</Text>
          </View>
          <TouchableOpacity style={styles.addIcon} onPress={() => setShowForm((value) => !value)} accessibilityLabel={t('team.addPlayer')}>
            {showForm ? <X size={20} color={Colors.gold} /> : <Plus size={20} color={Colors.gold} />}
          </TouchableOpacity>
        </View>

        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setDate((value) => shiftDate(value, -1))}>
            <ChevronLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={styles.dateCenter}>
            <Text style={styles.dateLabel}>{t('team.trainingDate')}</Text>
            <Text style={styles.dateInput}>{date}</Text>
          </View>
          <TouchableOpacity style={styles.dateButton} onPress={() => setDate((value) => shiftDate(value, 1))}>
            <ChevronRight size={20} color={Colors.gold} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <Summary value={players.length} label={t('team.roster')} color={Colors.gold} />
          <Summary value={presentCount} label={t('team.present')} color={Colors.success} />
          <Summary value={absentCount} label={t('team.absent')} color={Colors.error} />
        </View>

        {showForm ? (
          <Card variant="gradient" shadow="card" style={styles.formCard}>
            <Text style={styles.sectionTitle}>{t('team.addPlayer')}</Text>
            <TextInput
              style={styles.input}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder={t('team.playerNamePlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              autoFocus
            />
            <Text style={styles.fieldLabel}>{t('team.selectPosition')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.positionRow}>
              {ALL_POSITIONS.map((playerPosition) => (
                <TouchableOpacity
                  key={playerPosition}
                  style={[styles.positionChip, position === playerPosition && styles.positionChipActive]}
                  onPress={() => setPosition(position === playerPosition ? null : playerPosition)}
                >
                  <Text style={[styles.positionText, position === playerPosition && styles.positionTextActive]}>
                    {translatePosition(playerPosition, t)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button label={t('team.addPlayer')} onPress={handleAddPlayer} loading={saving} />
          </Card>
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('team.playerList')}</Text>
          <Text style={styles.sectionMeta}>{t('team.markEveryone')}</Text>
        </View>

        {players.length === 0 ? (
          <EmptyState
            icon={<Users size={30} color={Colors.gold} />}
            title={t('team.noRosterPlayers')}
            description={t('team.noRosterPlayersSub')}
            actionLabel={t('team.addFirstPlayer')}
            onAction={() => setShowForm(true)}
          />
        ) : (
          players.map((player) => {
            const status = attendanceMap.get(player.id);
            return (
              <Card key={player.id} variant="gradient" shadow="card" style={styles.playerCard}>
                <View style={styles.playerTop}>
                  <View style={styles.avatar}><UserRound size={20} color={Colors.gold} /></View>
                  <View style={styles.playerCopy}>
                    <Text style={styles.playerName}>{player.display_name}</Text>
                    <Text style={styles.playerPosition}>
                      {player.position ? translatePosition(player.position, t) : t('common.notSet')}
                    </Text>
                    {player.linked_user_id ? (
                      <View style={styles.linkedRow}>
                        <Link2 size={11} color={Colors.success} />
                        <Text style={styles.linkedText}>{t('team.linkedAccount')}</Text>
                      </View>
                    ) : null}
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => confirmRemove(player)} accessibilityLabel={t('team.removePlayer')}>
                    <Trash2 size={17} color={Colors.textQuaternary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.attendanceRow}>
                  <AttendanceButton
                    label={t('team.present')}
                    icon={<Check size={17} color={status === 'present' ? Colors.background : Colors.success} />}
                    active={status === 'present'}
                    tone="present"
                    onPress={() => markAttendance(player, 'present')}
                  />
                  <AttendanceButton
                    label={t('team.absent')}
                    icon={<X size={17} color={status === 'absent' ? Colors.background : Colors.error} />}
                    active={status === 'absent'}
                    tone="absent"
                    onPress={() => markAttendance(player, 'absent')}
                  />
                </View>
                {!status ? <Text style={styles.unmarked}>{t('team.notMarked')}</Text> : null}
              </Card>
            );
          })
        )}

        <Button
          label={t('team.openCoachNotes')}
          onPress={() => router.push('/coach-dashboard/notes')}
          variant="outline"
        />
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

function AttendanceButton({
  label,
  icon,
  active,
  tone,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  tone: CoachAttendanceStatus;
  onPress: () => void;
}) {
  const toneColor = tone === 'present' ? Colors.success : Colors.error;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.attendanceButton,
        { borderColor: toneColor },
        active && { backgroundColor: toneColor },
      ]}
    >
      {icon}
      <Text style={[styles.attendanceText, { color: active ? Colors.background : toneColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  addIcon: { width: 44, height: 44, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gold, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.sm },
  dateButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, backgroundColor: Colors.goldSoft },
  dateCenter: { flex: 1, alignItems: 'center' },
  dateLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 1 },
  dateInput: { minWidth: 120, textAlign: 'center', fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, paddingVertical: 4 },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm },
  summaryCard: { flex: 1, alignItems: 'center', gap: 2, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: Spacing.md },
  summaryValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24 },
  summaryLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  formCard: { gap: Spacing.md },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  fieldLabel: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  positionRow: { gap: Spacing.sm, paddingBottom: 2 },
  positionChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  positionChipActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  positionText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },
  positionTextActive: { color: Colors.gold },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, textAlign: 'center' },
  sectionHeader: { marginTop: Spacing.sm, gap: 2 },
  sectionTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  sectionMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary },
  playerCard: { gap: Spacing.md },
  playerTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.goldSoft },
  playerCopy: { flex: 1 },
  playerName: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  playerPosition: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  linkedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  linkedText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success },
  deleteButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  attendanceRow: { flexDirection: 'row', gap: Spacing.sm },
  attendanceButton: { flex: 1, minHeight: 44, borderRadius: Radius.md, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  attendanceText: { fontFamily: 'Inter-ExtraBold', fontSize: 13 },
  unmarked: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textQuaternary, textAlign: 'center' },
});
