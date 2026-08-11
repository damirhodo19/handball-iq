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
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Heart,
  HelpCircle,
  MapPin,
  Plus,
  Trash2,
  Trophy,
  UserCheck,
  UserX,
  X,
} from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import { useTranslation } from '@/hooks/useTranslation';
import { syncCoachWorkspaceForTeam } from '@/lib/coach-workspace';
import { migrateLegacyCustomCalendarEvents } from '@/lib/team-platform/legacy-calendar';
import {
  addTeamCalendarEvent,
  deleteTeamCalendarEvent,
  fetchTeamCalendar,
  fetchTeamEventResponses,
  finalizeTeamEventAttendance,
} from '@/lib/team-platform/platform';
import type {
  CalendarEventType,
  TeamCalendarEvent,
  TeamEventResponse,
  TeamEventResponseStatus,
} from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';

const CREATE_EVENT_TYPES: CalendarEventType[] = ['training', 'match', 'recovery'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function todayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function eventIcon(type: CalendarEventType, color: string) {
  if (type === 'match') return <Trophy size={17} color={color} />;
  if (type === 'recovery') return <Heart size={17} color={color} />;
  if (type === 'assigned_session' || type === 'completed_session') return <ClipboardCheck size={17} color={color} />;
  return <Dumbbell size={17} color={color} />;
}

function eventTone(type: CalendarEventType): { color: string; background: string } {
  if (type === 'match') return { color: Colors.info, background: Colors.infoSoft };
  if (type === 'recovery') return { color: Colors.success, background: Colors.successSoft };
  if (type === 'assigned_session' || type === 'completed_session') {
    return { color: Colors.warning, background: Colors.warningSoft };
  }
  return { color: Colors.gold, background: Colors.goldSoft };
}

export default function CoachCalendarScreen() {
  const { t, lang } = useTranslation();
  const { user, profile } = useAuth();
  const coachId = user?.id ?? 'dev_coach';
  const { team, teams, selectTeam, loading: teamsLoading } = useTeamPlatform(
    coachId,
    profile?.display_name ?? undefined,
  );
  const [events, setEvents] = useState<TeamCalendarEvent[]>([]);
  const [responses, setResponses] = useState<Record<string, TeamEventResponse[]>>({});
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyEventId, setBusyEventId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState(todayString());
  const [newTime, setNewTime] = useState('18:00');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEventType>('training');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [responseRequired, setResponseRequired] = useState(true);

  const loadEvents = useCallback(async () => {
    if (!team?.id) {
      setEvents([]);
      return;
    }
    setLoading(true);
    let loaded = await fetchTeamCalendar(team.id, user?.id);
    if (user?.id) {
      const migration = await migrateLegacyCustomCalendarEvents({
        teamId: team.id,
        coachId: user.id,
        existingEvents: loaded,
      });
      if (migration.error) setMessage(t('cdCalendar.legacyImportFailed'));
      if (migration.imported > 0) {
        loaded = await fetchTeamCalendar(team.id, user.id);
        setMessage(t('cdCalendar.legacyImported', { n: migration.imported }));
      }
    }
    setEvents(loaded);
    setLoading(false);
  }, [team?.id, t, user?.id]);

  useFocusEffect(useCallback(() => {
    void loadEvents();
  }, [loadEvents]));

  const grouped = useMemo(() => {
    const map = new Map<string, TeamCalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.event_date) ?? [];
      list.push(event);
      map.set(event.event_date, list);
    }
    return Array.from(map.entries()).map(([date, dateEvents]) => ({ date, events: dateEvents }));
  }, [events]);

  const locale = lang === 'hr' ? 'hr-HR' : lang === 'de' ? 'de-DE' : 'en-US';

  const typeLabel = (type: CalendarEventType): string => {
    if (type === 'match') return t('cdCalendar.eventMatch');
    if (type === 'recovery') return t('cdCalendar.eventRecovery');
    if (type === 'assigned_session') return t('cdCalendar.eventAssigned');
    if (type === 'completed_session') return t('cdCalendar.eventCompleted');
    return t('cdCalendar.eventTraining');
  };

  const responseLabel = (status: TeamEventResponseStatus): string => {
    if (status === 'attending') return t('teamCalendar.attending');
    if (status === 'not_attending') return t('teamCalendar.notAttending');
    return t('teamCalendar.maybe');
  };

  const resetForm = () => {
    setNewDate(todayString());
    setNewTime('18:00');
    setNewTitle('');
    setNewType('training');
    setNewLocation('');
    setNewDescription('');
    setResponseRequired(true);
  };

  const handleAdd = async () => {
    if (!team?.id) return;
    if (!newTitle.trim()) {
      setMessage(t('cdCalendar.titleRequired'));
      return;
    }
    if (!isValidDate(newDate.trim())) {
      setMessage(t('cdCalendar.invalidDate'));
      return;
    }
    if (!TIME_RE.test(newTime.trim())) {
      setMessage(t('cdCalendar.invalidTime'));
      return;
    }
    setBusyEventId('new');
    const result = await addTeamCalendarEvent({
      team_id: team.id,
      event_type: newType,
      event_date: newDate.trim(),
      event_time: newTime.trim(),
      end_time: null,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      location: newLocation.trim() || null,
      response_required: responseRequired,
      event_status: 'scheduled',
      player_id: null,
      assignment_id: null,
      created_by: user?.id ?? null,
    });
    setBusyEventId(null);
    if (result.error) {
      setMessage(t('cdCalendar.saveFailed'));
      return;
    }
    setShowAddModal(false);
    resetForm();
    setMessage(t('cdCalendar.saved'));
    await loadEvents();
  };

  const toggleDetails = async (event: TeamCalendarEvent) => {
    if (expandedEventId === event.id) {
      setExpandedEventId(null);
      return;
    }
    setExpandedEventId(event.id);
    if (responses[event.id] || !team?.id) return;
    setBusyEventId(event.id);
    const result = await fetchTeamEventResponses(team.id, event.id);
    setBusyEventId(null);
    if (result.error) {
      setMessage(t('cdCalendar.responsesFailed'));
      return;
    }
    setResponses((current) => ({ ...current, [event.id]: result.responses }));
  };

  const confirmDelete = (event: TeamCalendarEvent) => {
    if (!team?.id) return;
    Alert.alert(
      t('cdCalendar.deleteTitle'),
      t('cdCalendar.deleteConfirm', { title: event.title }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            setBusyEventId(event.id);
            const error = await deleteTeamCalendarEvent(team.id, event.id);
            setBusyEventId(null);
            setMessage(error ? t('cdCalendar.deleteFailed') : t('cdCalendar.deleted'));
            if (!error) {
              setExpandedEventId(null);
              await loadEvents();
            }
          },
        },
      ],
    );
  };

  const confirmFinalize = (event: TeamCalendarEvent) => {
    if (!team?.id) return;
    Alert.alert(
      t('cdCalendar.finalizeTitle'),
      t('cdCalendar.finalizeConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cdCalendar.finalize'),
          onPress: async () => {
            setBusyEventId(event.id);
            const result = await finalizeTeamEventAttendance({
              teamId: team.id,
              eventId: event.id,
              coachId,
            });
            if (!result.error) await syncCoachWorkspaceForTeam(coachId, team.id);
            setBusyEventId(null);
            setMessage(result.error
              ? t('cdCalendar.finalizeFailed')
              : t('cdCalendar.finalized', {
                  present: result.present,
                  absent: result.absent,
                  skipped: result.skipped,
                }));
            if (!result.error) await loadEvents();
          },
        },
      ],
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('cdCalendar.title')}</Text>
            <Text style={styles.headerSub}>{t('cdCalendar.teamSubtitle')}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, !team && styles.disabledButton]}
            onPress={() => setShowAddModal(true)}
            disabled={!team}
          >
            <Plus size={20} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {teams.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamRow}>
            {teams.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.teamChip, team?.id === item.id && styles.teamChipActive]}
                onPress={() => selectTeam(item.id)}
              >
                <Text style={[styles.teamChipText, team?.id === item.id && styles.teamChipTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {!team && !teamsLoading ? (
          <EmptyState
            icon={<Calendar size={32} color={Colors.gold} />}
            title={t('cdCalendar.noTeam')}
            description={t('cdCalendar.noTeamCoachSub')}
          />
        ) : loading ? (
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Calendar size={32} color={Colors.gold} />}
            title={t('cdCalendar.empty')}
            description={t('cdCalendar.emptyCoachSub')}
            actionLabel={t('cdCalendar.addEvent')}
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          grouped.map((group, groupIndex) => {
            const date = new Date(`${group.date}T12:00:00`);
            const isToday = group.date === todayString();
            return (
              <Animated.View key={group.date} entering={FadeInDown.delay(groupIndex * 30).duration(350)}>
                <View style={styles.dateHeader}>
                  <Text style={[styles.dateLabel, isToday && styles.dateLabelToday]}>
                    {date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                  {isToday ? <Text style={styles.todayPill}>{t('cdCalendar.today')}</Text> : null}
                </View>
                {group.events.map((event) => {
                  const tone = eventTone(event.event_type);
                  const expanded = expandedEventId === event.id;
                  const eventResponses = responses[event.id] ?? [];
                  const canFinalize = event.event_status === 'scheduled'
                    && (event.event_type === 'training' || event.event_type === 'match');
                  return (
                    <Card
                      key={event.id}
                      variant="gradient"
                      shadow="card"
                      style={[styles.eventCard, event.event_status !== 'scheduled' && styles.pastEvent]}
                    >
                      <TouchableOpacity style={styles.eventTop} onPress={() => toggleDetails(event)} activeOpacity={0.8}>
                        <View style={[styles.eventIcon, { backgroundColor: tone.background, borderColor: tone.color }]}>
                          {eventIcon(event.event_type, tone.color)}
                        </View>
                        <View style={styles.eventCopy}>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <View style={styles.metaLine}>
                            <Clock3 size={12} color={Colors.textTertiary} />
                            <Text style={styles.eventMeta}>
                              {event.event_time?.slice(0, 5) ?? t('cdCalendar.timeNotSet')}
                            </Text>
                            {event.location ? <MapPin size={12} color={Colors.textTertiary} /> : null}
                            {event.location ? <Text style={styles.eventMeta}>{event.location}</Text> : null}
                          </View>
                        </View>
                        <View style={styles.eventRight}>
                          <Text style={[styles.typePill, { color: tone.color, backgroundColor: tone.background }]}>
                            {typeLabel(event.event_type)}
                          </Text>
                          {expanded
                            ? <ChevronUp size={17} color={Colors.gold} />
                            : <ChevronDown size={17} color={Colors.textTertiary} />}
                        </View>
                      </TouchableOpacity>

                      {event.response_required ? (
                        <View style={styles.countRow}>
                          <ResponseCount icon={<UserCheck size={13} color={Colors.success} />} value={event.attending_count} color={Colors.success} />
                          <ResponseCount icon={<HelpCircle size={13} color={Colors.warning} />} value={event.maybe_count} color={Colors.warning} />
                          <ResponseCount icon={<UserX size={13} color={Colors.error} />} value={event.not_attending_count} color={Colors.error} />
                        </View>
                      ) : null}

                      {expanded ? (
                        <View style={styles.details}>
                          {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
                          <Text style={styles.sectionLabel}>{t('cdCalendar.playerResponses')}</Text>
                          {busyEventId === event.id && !responses[event.id] ? (
                            <Text style={styles.loadingText}>{t('common.loading')}</Text>
                          ) : eventResponses.length === 0 ? (
                            <Text style={styles.emptyText}>{t('cdCalendar.noResponses')}</Text>
                          ) : eventResponses.map((response) => (
                            <View key={response.player_id} style={styles.responseRow}>
                              <View style={styles.responseCopy}>
                                <Text style={styles.responseName}>{response.display_name}</Text>
                                {response.note ? <Text style={styles.responseNote}>{response.note}</Text> : null}
                              </View>
                              <Text style={[
                                styles.responseStatus,
                                response.response_status === 'attending' && { color: Colors.success },
                                response.response_status === 'not_attending' && { color: Colors.error },
                              ]}>
                                {responseLabel(response.response_status)}
                              </Text>
                            </View>
                          ))}

                          {event.event_status === 'completed' ? (
                            <Text style={styles.completedText}>{t('cdCalendar.completed')}</Text>
                          ) : null}
                          <View style={styles.actionRow}>
                            {canFinalize ? (
                              <View style={styles.actionButton}>
                                <Button
                                  label={t('cdCalendar.finalize')}
                                  onPress={() => confirmFinalize(event)}
                                  loading={busyEventId === event.id}
                                  size="md"
                                />
                              </View>
                            ) : null}
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => confirmDelete(event)}
                              disabled={busyEventId === event.id}
                              accessibilityLabel={t('common.delete')}
                            >
                              <Trash2 size={18} color={Colors.error} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : null}
                    </Card>
                  );
                })}
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdCalendar.addEvent')}</Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowAddModal(false)}>
                <X size={20} color={Colors.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FieldLabel text={t('cdCalendar.eventType')} />
              <View style={styles.typeRow}>
                {CREATE_EVENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, newType === type && styles.typeChipActive]}
                    onPress={() => setNewType(type)}
                  >
                    <Text style={[styles.typeChipText, newType === type && styles.typeChipTextActive]}>{typeLabel(type)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldLabel text={t('cdCalendar.dateField')} />
              <TextInput
                style={styles.input}
                value={newDate}
                onChangeText={setNewDate}
                placeholder={t('cdCalendar.datePlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
              />
              <FieldLabel text={t('cdCalendar.timeField')} />
              <TextInput
                style={styles.input}
                value={newTime}
                onChangeText={setNewTime}
                placeholder={t('cdCalendar.timePlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
              />
              <FieldLabel text={t('cdCalendar.titleField')} />
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder={t('cdCalendar.titlePlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
              />
              <FieldLabel text={t('cdCalendar.locationField')} />
              <TextInput
                style={styles.input}
                value={newLocation}
                onChangeText={setNewLocation}
                placeholder={t('cdCalendar.locationPlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
              />
              <FieldLabel text={t('cdCalendar.descriptionField')} />
              <TextInput
                style={[styles.input, styles.multiline]}
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder={t('cdCalendar.descPlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
                multiline
              />

              <FieldLabel text={t('cdCalendar.responseRequired')} />
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeChip, responseRequired && styles.typeChipActive]}
                  onPress={() => setResponseRequired(true)}
                >
                  <Text style={[styles.typeChipText, responseRequired && styles.typeChipTextActive]}>{t('common.yes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeChip, !responseRequired && styles.typeChipActive]}
                  onPress={() => setResponseRequired(false)}
                >
                  <Text style={[styles.typeChipText, !responseRequired && styles.typeChipTextActive]}>{t('common.no')}</Text>
                </TouchableOpacity>
              </View>

              <Button
                label={t('cdCalendar.save')}
                onPress={handleAdd}
                loading={busyEventId === 'new'}
                disabled={!newTitle.trim()}
                style={styles.saveButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={styles.fieldLabel}>{text.toUpperCase()}</Text>;
}

function ResponseCount({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <View style={styles.countItem}>
      {icon}
      <Text style={[styles.countText, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  addButton: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gold },
  disabledButton: { opacity: 0.4 },
  teamRow: { gap: Spacing.sm, paddingBottom: Spacing.md },
  teamChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  teamChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  teamChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  teamChipTextActive: { color: Colors.background },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, textAlign: 'center', marginBottom: Spacing.sm },
  loadingText: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, textAlign: 'center', padding: Spacing.md },
  dateHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md, marginBottom: Spacing.sm },
  dateLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textSecondary, textTransform: 'capitalize' },
  dateLabelToday: { color: Colors.gold },
  todayPill: { fontFamily: 'Inter-ExtraBold', fontSize: 9, color: Colors.background, backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, letterSpacing: 0.7 },
  eventCard: { marginBottom: Spacing.sm, gap: Spacing.sm },
  pastEvent: { opacity: 0.72 },
  eventTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  eventIcon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  eventCopy: { flex: 1, minWidth: 0 },
  eventTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  eventMeta: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
  eventRight: { alignItems: 'flex-end', gap: 6 },
  typePill: { fontFamily: 'Inter-SemiBold', fontSize: 9, borderRadius: Radius.sm, paddingHorizontal: 7, paddingVertical: 3 },
  countRow: { flexDirection: 'row', gap: Spacing.md, marginLeft: 48 },
  countItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  countText: { fontFamily: 'Inter-ExtraBold', fontSize: 12 },
  details: { borderTopWidth: 1, borderTopColor: Colors.hairline, paddingTop: Spacing.sm },
  description: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.md, marginBottom: 4 },
  emptyText: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, paddingVertical: 6 },
  responseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  responseCopy: { flex: 1 },
  responseName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textPrimary },
  responseNote: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  responseStatus: { fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Colors.warning },
  completedText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.success, marginTop: Spacing.sm },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md },
  actionButton: { flex: 1 },
  deleteButton: { width: 46, height: 46, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.error, backgroundColor: Colors.errorSoft, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { maxHeight: '90%', backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalClose: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.goldSoft },
  fieldLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.md, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, paddingHorizontal: Spacing.md, paddingVertical: 12, textAlignVertical: 'top' },
  multiline: { minHeight: 76 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceRaised },
  typeChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  typeChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.background },
  saveButton: { marginTop: Spacing.lg },
});
