import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  CalendarDays,
  Check,
  Clock3,
  Dumbbell,
  Heart,
  HelpCircle,
  MapPin,
  Trophy,
  Users,
  X,
} from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchTeamCalendar, respondToTeamEvent } from '@/lib/team-platform/platform';
import type {
  CalendarEventType,
  TeamCalendarEvent,
  TeamEventResponseStatus,
} from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { translateCategory, translatePosition } from '@/lib/translations';
import { localeTagForLanguage } from '@/lib/locale';

function localDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function eventTone(type: CalendarEventType): { color: string; background: string } {
  if (type === 'match') return { color: Colors.info, background: Colors.infoSoft };
  if (type === 'recovery') return { color: Colors.success, background: Colors.successSoft };
  return { color: Colors.gold, background: Colors.goldSoft };
}

function eventIcon(type: CalendarEventType, color: string) {
  if (type === 'match') return <Trophy size={18} color={color} />;
  if (type === 'recovery') return <Heart size={18} color={color} />;
  return <Dumbbell size={18} color={color} />;
}

export default function PlayerTeamCalendarScreen() {
  const { t, lang } = useTranslation();
  const { user, profile, loading: authLoading } = useAuth();
  const { team, teams, selectTeam, loading: teamsLoading } = useTeamPlatform(
    user?.id,
    profile?.display_name ?? undefined,
  );
  const [events, setEvents] = useState<TeamCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyEventId, setBusyEventId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadEvents = useCallback(async () => {
    if (!team?.id || !user?.id) {
      setEvents([]);
      return;
    }
    setLoading(true);
    const loaded = await fetchTeamCalendar(team.id, user.id, localDateString(), null);
    setEvents(loaded);
    setLoading(false);
  }, [team?.id, user?.id]);

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

  const locale = localeTagForLanguage(lang);

  const eventTitle = (event: TeamCalendarEvent): string => {
    if (event.event_type !== 'assigned_session') return event.title;
    const [category, position] = event.title.split(' — ');
    if (!category || !position) return event.title;
    return `${translateCategory(category, t)} · ${translatePosition(position, t)}`;
  };

  const eventDescription = (event: TeamCalendarEvent): string | null => {
    if (!event.description || event.event_type !== 'assigned_session') return event.description;
    const due = event.description.match(/^Due (\d{4}-\d{2}-\d{2})$/);
    if (!due) return event.description;
    const date = new Date(`${due[1]}T12:00:00`).toLocaleDateString(locale);
    return t('coachPlayerHub.due', { date });
  };

  const typeLabel = (type: CalendarEventType): string => {
    if (type === 'match') return t('cdCalendar.eventMatch');
    if (type === 'recovery') return t('cdCalendar.eventRecovery');
    if (type === 'assigned_session') return t('cdCalendar.eventAssigned');
    if (type === 'completed_session') return t('cdCalendar.eventCompleted');
    return t('cdCalendar.eventTraining');
  };

  const respond = async (event: TeamCalendarEvent, status: TeamEventResponseStatus) => {
    if (!team?.id || !user?.id) return;
    setBusyEventId(event.id);
    const result = await respondToTeamEvent({
      teamId: team.id,
      eventId: event.id,
      playerId: user.id,
      displayName: profile?.display_name ?? undefined,
      responseStatus: status,
    });
    setBusyEventId(null);
    if (result.error) {
      setMessage(t('teamCalendar.responseFailed'));
      return;
    }
    setMessage(t('teamCalendar.responseSaved'));
    await loadEvents();
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('teamCalendar.title')}</Text>
            <Text style={styles.headerSub}>{t('teamCalendar.subtitle')}</Text>
          </View>
          <View style={styles.headerIcon}><CalendarDays size={21} color={Colors.gold} /></View>
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
        ) : team ? (
          <View style={styles.activeTeam}>
            <Users size={15} color={Colors.gold} />
            <Text style={styles.activeTeamText}>{team.name}</Text>
          </View>
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {!team && !teamsLoading && !authLoading ? (
          <EmptyState
            icon={<Users size={32} color={Colors.gold} />}
            title={t('teamCalendar.noTeam')}
            description={t('teamCalendar.noTeamSub')}
            actionLabel={t('team.joinTeam')}
            onAction={() => router.push('/coach-dashboard/join')}
          />
        ) : loading || teamsLoading || authLoading ? (
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={32} color={Colors.gold} />}
            title={t('teamCalendar.noEvents')}
            description={t('teamCalendar.noEventsSub')}
          />
        ) : (
          grouped.map((group, groupIndex) => {
            const date = new Date(`${group.date}T12:00:00`);
            const isToday = group.date === localDateString();
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
                  const canRespond = event.response_required && event.event_status === 'scheduled';
                  return (
                    <Card
                      key={event.id}
                      variant="gradient"
                      shadow="card"
                      style={[styles.eventCard, event.event_status !== 'scheduled' && styles.inactiveEvent]}
                    >
                      <View style={styles.eventTop}>
                        <View style={[styles.eventIcon, { backgroundColor: tone.background, borderColor: tone.color }]}>
                          {eventIcon(event.event_type, tone.color)}
                        </View>
                        <View style={styles.eventCopy}>
                          <Text style={styles.eventTitle}>{eventTitle(event)}</Text>
                          <Text style={[styles.typeLabel, { color: tone.color }]}>{typeLabel(event.event_type)}</Text>
                        </View>
                      </View>

                      <View style={styles.metaGroup}>
                        <View style={styles.metaLine}>
                          <Clock3 size={14} color={Colors.textTertiary} />
                          <Text style={styles.metaText}>{event.event_time?.slice(0, 5) ?? t('cdCalendar.timeNotSet')}</Text>
                        </View>
                        {event.location ? (
                          <View style={styles.metaLine}>
                            <MapPin size={14} color={Colors.textTertiary} />
                            <Text style={styles.metaText}>{event.location}</Text>
                          </View>
                        ) : null}
                        {eventDescription(event) ? <Text style={styles.description}>{eventDescription(event)}</Text> : null}
                      </View>

                      {canRespond ? (
                        <>
                          <Text style={styles.responsePrompt}>{t('teamCalendar.canYouAttend')}</Text>
                          <View style={styles.responseButtons}>
                            <ResponseButton
                              label={t('teamCalendar.attending')}
                              icon={<Check size={16} color={event.my_response === 'attending' ? Colors.background : Colors.success} />}
                              active={event.my_response === 'attending'}
                              color={Colors.success}
                              disabled={busyEventId === event.id}
                              onPress={() => respond(event, 'attending')}
                            />
                            <ResponseButton
                              label={t('teamCalendar.maybe')}
                              icon={<HelpCircle size={16} color={event.my_response === 'maybe' ? Colors.background : Colors.warning} />}
                              active={event.my_response === 'maybe'}
                              color={Colors.warning}
                              disabled={busyEventId === event.id}
                              onPress={() => respond(event, 'maybe')}
                            />
                            <ResponseButton
                              label={t('teamCalendar.notAttending')}
                              icon={<X size={16} color={event.my_response === 'not_attending' ? Colors.background : Colors.error} />}
                              active={event.my_response === 'not_attending'}
                              color={Colors.error}
                              disabled={busyEventId === event.id}
                              onPress={() => respond(event, 'not_attending')}
                            />
                          </View>
                        </>
                      ) : event.event_status === 'completed' ? (
                        <Text style={styles.completedText}>{t('cdCalendar.completed')}</Text>
                      ) : null}
                    </Card>
                  );
                })}
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function ResponseButton({
  label,
  icon,
  active,
  color,
  disabled,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  color: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.responseButton, { borderColor: color }, active && { backgroundColor: color }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={[styles.responseButtonText, { color: active ? Colors.background : color }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  headerIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  teamRow: { gap: Spacing.sm, paddingBottom: Spacing.md },
  teamChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  teamChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  teamChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  teamChipTextActive: { color: Colors.background },
  activeTeam: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 7, borderRadius: Radius.pill, backgroundColor: Colors.goldSoft, marginBottom: Spacing.md },
  activeTeamText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, textAlign: 'center', marginBottom: Spacing.sm },
  loadingText: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, textAlign: 'center', padding: Spacing.lg },
  dateHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md, marginBottom: Spacing.sm },
  dateLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textSecondary, textTransform: 'capitalize' },
  dateLabelToday: { color: Colors.gold },
  todayPill: { fontFamily: 'Inter-ExtraBold', fontSize: 9, color: Colors.background, backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, letterSpacing: 0.7 },
  eventCard: { marginBottom: Spacing.sm, gap: Spacing.md },
  inactiveEvent: { opacity: 0.72 },
  eventTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  eventIcon: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  eventCopy: { flex: 1 },
  eventTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  typeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, marginTop: 3 },
  metaGroup: { gap: 6 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary },
  description: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginTop: 2 },
  responsePrompt: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  responseButtons: { flexDirection: 'row', gap: 6 },
  responseButton: { flex: 1, minHeight: 44, paddingHorizontal: 5, borderRadius: Radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 2 },
  responseButtonText: { fontFamily: 'Inter-ExtraBold', fontSize: 9, textAlign: 'center' },
  disabled: { opacity: 0.55 },
  completedText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.success },
});
