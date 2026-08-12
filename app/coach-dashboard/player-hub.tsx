import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CalendarCheck, Check, ClipboardList, Link2, Minus, NotebookPen, Plus, Target, Trash2, UserRound } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  createCoachPlayerGoal,
  deleteCoachPlayerGoal,
  fetchCoachPlayerGoals,
  fetchCoachPlayerOverview,
  updateCoachPlayerGoalProgress,
  type CoachPlayerGoal,
  type CoachPlayerOverview,
} from '@/lib/coach-player-hub';
import {
  loadCoachAttendanceHistoryForTeam,
  loadCoachWorkspaceNotesForTeam,
  syncCoachWorkspaceForTeam,
  type CoachWorkspaceNote,
} from '@/lib/coach-workspace';
import { fetchAssignments, getActiveTeam } from '@/lib/team-platform/platform';
import type { TrainingAssignment } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translatePosition } from '@/lib/translations';

export default function CoachPlayerHubScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    rosterPlayerId?: string;
    playerId?: string;
    playerName?: string;
    position?: string;
    avatarUrl?: string;
  }>();
  const rosterPlayerId = params.rosterPlayerId || null;
  const playerId = params.playerId || null;
  const team = getActiveTeam();
  const teamKey = team?.id ?? 'default';
  const coachId = user?.id ?? 'dev_coach';

  const [overview, setOverview] = useState<CoachPlayerOverview | null>(null);
  const [goals, setGoals] = useState<CoachPlayerGoal[]>([]);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [notes, setNotes] = useState<CoachWorkspaceNote[]>([]);
  const [attendance, setAttendance] = useState({ total: 0, present: 0 });
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDueDate, setGoalDueDate] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    await syncCoachWorkspaceForTeam(coachId, teamKey);
    if (rosterPlayerId) {
      const history = loadCoachAttendanceHistoryForTeam(coachId, teamKey, rosterPlayerId);
      setAttendance({ total: history.length, present: history.filter((entry) => entry.status === 'present').length });
      setNotes(loadCoachWorkspaceNotesForTeam(coachId, teamKey, rosterPlayerId).slice(0, 3));
    } else {
      setAttendance({ total: 0, present: 0 });
      setNotes([]);
    }
    if (team?.id && playerId) {
      const [overviewResult, playerGoals, teamAssignments] = await Promise.all([
        fetchCoachPlayerOverview(team.id, playerId),
        fetchCoachPlayerGoals(team.id, playerId),
        fetchAssignments(team.id),
      ]);
      setOverview(overviewResult.overview);
      setGoals(playerGoals);
      setAssignments(teamAssignments.filter((assignment) => assignment.player_id === playerId));
      if (overviewResult.error) setMessage(t('coachPlayerHub.progressUnavailable'));
    } else {
      setOverview(null);
      setGoals([]);
      setAssignments([]);
    }
  }, [coachId, playerId, rosterPlayerId, team?.id, teamKey, t]);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const activeGoals = goals.filter((goal) => goal.status === 'active');
  const completedGoals = goals.filter((goal) => goal.status === 'completed');
  const activeAssignments = assignments.filter((assignment) => assignment.status !== 'completed');
  const attendanceRate = attendance.total ? Math.round((attendance.present / attendance.total) * 100) : null;
  const displayName = overview?.display_name ?? params.playerName ?? t('cdReport.playerNotFound');
  const displayPosition = overview?.primary_position ?? params.position ?? null;

  const ownDevelopmentGoals = useMemo(() => overview?.development_goals ?? [], [overview?.development_goals]);

  const addGoal = async () => {
    if (!team?.id || !playerId || !goalTitle.trim()) return;
    if (activeGoals.length >= 3) {
      setMessage(t('coachPlayerHub.goalLimit'));
      return;
    }
    setSaving(true);
    const result = await createCoachPlayerGoal({
      teamId: team.id,
      playerId,
      coachId,
      title: goalTitle,
      dueDate: goalDueDate || null,
    });
    setSaving(false);
    if (result.error) {
      setMessage(result.error === 'goal_limit' ? t('coachPlayerHub.goalLimit') : t('coachPlayerHub.saveFailed'));
      return;
    }
    setGoalTitle('');
    setGoalDueDate('');
    setShowGoalForm(false);
    setMessage(t('coachPlayerHub.goalSaved'));
    await refresh();
  };

  const changeProgress = async (goal: CoachPlayerGoal, amount: number) => {
    const error = await updateCoachPlayerGoalProgress(goal, goal.progress + amount);
    if (error) setMessage(t('coachPlayerHub.saveFailed'));
    await refresh();
  };

  const removeGoal = (goal: CoachPlayerGoal) => {
    Alert.alert(t('coachPlayerHub.deleteGoal'), goal.title, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const error = await deleteCoachPlayerGoal(goal);
          if (error) setMessage(t('coachPlayerHub.saveFailed'));
          await refresh();
        },
      },
    ]);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <ProfileAvatar uri={params.avatarUrl} fallback={displayName} size={46} />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{displayName}</Text>
            <Text style={styles.headerSub}>{displayPosition ? translatePosition(displayPosition, t) : t('team.positionNotSet')}</Text>
          </View>
          {playerId ? <Link2 size={18} color={Colors.success} /> : null}
        </View>

        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.statsRow}>
            <Stat value={attendanceRate == null ? '—' : `${attendanceRate}%`} label={t('team.attendance')} />
            <Stat value={overview ? `${overview.average_decision_score}%` : '—'} label={t('cdPlayers.decision')} />
            <Stat value={String(overview?.completed_sessions ?? 0)} label={t('coachPlayerHub.sessions')} />
            <Stat value={String(activeAssignments.length)} label={t('coachPlayerHub.activeTasks')} />
          </View>
        </Animated.View>

        {!playerId ? (
          <Card variant="gradient" style={styles.infoCard}>
            <Text style={styles.infoTitle}>{t('coachPlayerHub.manualPlayer')}</Text>
            <Text style={styles.infoText}>{t('coachPlayerHub.manualPlayerDescription')}</Text>
          </Card>
        ) : null}

        {overview ? (
          <Card variant="gradient" shadow="card" style={styles.progressCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('coachPlayerHub.development')}</Text>
              <Text style={styles.xp}>{overview.total_xp} XP · {overview.player_level}</Text>
            </View>
            <MetricBar label={t('cdReport.skillDecision')} value={overview.average_decision_score} />
            <MetricBar label={t('cdReport.skillMental')} value={overview.average_mental_readiness} />
            <MetricBar label={t('cdReport.skillPressure')} value={overview.average_pressure_control} />
            {ownDevelopmentGoals.length ? (
              <View style={styles.chipWrap}>
                {ownDevelopmentGoals.map((goal) => <Text key={goal} style={styles.playerGoalChip}>{goal}</Text>)}
              </View>
            ) : null}
          </Card>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('coachPlayerHub.coachGoals')}</Text>
          {playerId && activeGoals.length < 3 ? (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowGoalForm((value) => !value)}>
              <Plus size={16} color={Colors.background} />
              <Text style={styles.addButtonText}>{t('coachPlayerHub.addGoal')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {showGoalForm ? (
          <Card variant="gradient" style={styles.goalForm}>
            <TextInput
              style={styles.input}
              value={goalTitle}
              onChangeText={setGoalTitle}
              placeholder={t('coachPlayerHub.goalPlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              maxLength={160}
            />
            <TextInput
              style={styles.input}
              value={goalDueDate}
              onChangeText={setGoalDueDate}
              placeholder={t('coachPlayerHub.dueDatePlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
            />
            <Button label={t('coachPlayerHub.saveGoal')} onPress={addGoal} loading={saving} disabled={!goalTitle.trim()} />
          </Card>
        ) : null}

        {activeGoals.length === 0 ? (
          <EmptyState icon={<Target size={28} color={Colors.gold} />} title={t('coachPlayerHub.noGoals')} description={playerId ? t('coachPlayerHub.noGoalsDescription') : t('coachPlayerHub.connectForGoals')} />
        ) : activeGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onChange={changeProgress} onDelete={removeGoal} t={t} />
        ))}

        {completedGoals.length ? (
          <Text style={styles.completedText}>{t('coachPlayerHub.completedGoals', { n: completedGoals.length })}</Text>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('coachPlayerHub.tasks')}</Text>
          {playerId ? (
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push({ pathname: '/coach-dashboard/assign', params: { playerId } })}>
              <ClipboardList size={15} color={Colors.gold} />
              <Text style={styles.linkButtonText}>{t('coachPlayerHub.assignTask')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {assignments.length === 0 ? <Text style={styles.emptyLine}>{t('coachPlayerHub.noTasks')}</Text> : assignments.slice(0, 5).map((assignment) => (
          <Card key={assignment.id} variant="gradient" style={styles.listCard}>
            <View style={styles.listIcon}><ClipboardList size={16} color={Colors.gold} /></View>
            <View style={styles.listCopy}>
              <Text style={styles.listTitle}>{assignment.category || assignment.session_type}</Text>
              <Text style={styles.listMeta}>{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : t('coachPlayerHub.noDeadline')} · {t(`coachPlayerHub.status.${assignment.status}`)}</Text>
            </View>
            {assignment.status === 'completed' ? <Check size={18} color={Colors.success} /> : null}
          </Card>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('team.coachNotes')}</Text>
          {rosterPlayerId ? (
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push({ pathname: '/coach-dashboard/notes', params: { rosterPlayerId } })}>
              <NotebookPen size={15} color={Colors.gold} />
              <Text style={styles.linkButtonText}>{t('coachPlayerHub.addNote')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {notes.length === 0 ? <Text style={styles.emptyLine}>{t('team.noNotes')}</Text> : notes.map((note) => (
          <Card key={note.id} variant="gradient" style={styles.noteCard}>
            <Text style={styles.noteType}>{t(`team.note.${note.note_type}`)}</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
            <Text style={styles.noteDate}>{new Date(note.created_at).toLocaleDateString()}</Text>
          </Card>
        ))}

        <View style={styles.actionsRow}>
          <Button label={t('team.openAttendance')} onPress={() => router.push('/coach-dashboard/attendance')} variant="outline" icon={<CalendarCheck size={18} color={Colors.gold} />} />
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </ScreenBackground>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return <View style={styles.metricBar}><View style={styles.metricHeader}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}%</Text></View><ProgressBar progress={Math.max(0, Math.min(1, value / 100))} height={5} color={Colors.gold} /></View>;
}

function GoalCard({ goal, onChange, onDelete, t }: {
  goal: CoachPlayerGoal;
  onChange: (goal: CoachPlayerGoal, amount: number) => void;
  onDelete: (goal: CoachPlayerGoal) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  return (
    <Card variant="gradient" shadow="card" style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Target size={18} color={Colors.gold} />
        <View style={styles.listCopy}><Text style={styles.goalTitle}>{goal.title}</Text>{goal.due_date ? <Text style={styles.listMeta}>{t('coachPlayerHub.due', { date: new Date(goal.due_date).toLocaleDateString() })}</Text> : null}</View>
        <TouchableOpacity onPress={() => onDelete(goal)} style={styles.iconButton}><Trash2 size={16} color={Colors.textQuaternary} /></TouchableOpacity>
      </View>
      <ProgressBar progress={goal.progress / 100} height={6} color={Colors.gold} />
      <View style={styles.goalControls}>
        <TouchableOpacity onPress={() => onChange(goal, -10)} style={styles.progressButton}><Minus size={16} color={Colors.gold} /></TouchableOpacity>
        <Text style={styles.goalProgress}>{goal.progress}%</Text>
        <TouchableOpacity onPress={() => onChange(goal, 10)} style={styles.progressButton}><Plus size={16} color={Colors.gold} /></TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, minWidth: 0 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 21, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Spacing.xs },
  stat: { flex: 1, minHeight: 66, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', padding: 6 },
  statValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.gold },
  statLabel: { fontFamily: 'Inter-SemiBold', fontSize: 8, color: Colors.textTertiary, textAlign: 'center', marginTop: 3 },
  infoCard: { gap: Spacing.xs },
  infoTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  infoText: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, color: Colors.textTertiary },
  progressCard: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, marginTop: Spacing.sm },
  sectionTitle: { flex: 1, fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  xp: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  metricBar: { gap: 5 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  metricLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },
  metricValue: { fontFamily: 'Inter-ExtraBold', fontSize: 11, color: Colors.gold },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  playerGoalChip: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, backgroundColor: Colors.goldSoft, borderRadius: Radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.gold, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  addButtonText: { fontFamily: 'Inter-ExtraBold', fontSize: 11, color: Colors.background },
  goalForm: { gap: Spacing.sm },
  input: { minHeight: 46, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14 },
  goalCard: { gap: Spacing.sm },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  goalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  goalControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  progressButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  goalProgress: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold, minWidth: 42, textAlign: 'center' },
  completedText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.success },
  linkButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6 },
  linkButtonText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  listCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  listIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  listCopy: { flex: 1, minWidth: 0 },
  listTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textPrimary },
  listMeta: { fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  emptyLine: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary },
  noteCard: { gap: 5 },
  noteType: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold },
  noteContent: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, color: Colors.textPrimary },
  noteDate: { fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.textTertiary },
  actionsRow: { marginTop: Spacing.sm },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, textAlign: 'center' },
});
