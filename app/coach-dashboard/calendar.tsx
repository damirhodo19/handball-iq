import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Calendar, Plus, Dumbbell, Trophy, Heart, ClipboardList, X } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { Button } from '@/components/Button';
import { loadCalendar, addCalendarEvent, CalendarEvent, CalendarEventType } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';

const TYPE_CONFIG: Record<CalendarEventType, { icon: React.ReactNode; color: string; bg: string }> = {
  'Training': { icon: <Dumbbell size={14} color={Colors.gold} />, color: Colors.gold, bg: Colors.goldSoft },
  'Match': { icon: <Trophy size={14} color={Colors.info} />, color: Colors.info, bg: Colors.infoSoft },
  'Recovery': { icon: <Heart size={14} color={Colors.success} />, color: Colors.success, bg: Colors.successSoft },
  'Assigned Session': { icon: <ClipboardList size={14} color={Colors.warning} />, color: Colors.warning, bg: Colors.warningSoft },
};

export default function CalendarScreen() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEventType>('Training');
  const [newDesc, setNewDesc] = useState('');

  useFocusEffect(useCallback(() => {
    setEvents(loadCalendar());
  }, []));

  // Group events by date
  const grouped: { date: string; events: CalendarEvent[] }[] = [];
  const dateMap = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    if (!dateMap.has(e.date)) dateMap.set(e.date, []);
    dateMap.get(e.date)!.push(e);
  }
  const sortedDates = [...dateMap.keys()].sort((a, b) => a.localeCompare(b));
  for (const date of sortedDates) {
    grouped.push({ date, events: dateMap.get(date)! });
  }

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addCalendarEvent({ date: newDate, type: newType, title: newTitle.trim(), description: newDesc.trim() || '' });
    setEvents(loadCalendar());
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('cdCalendar.title')}</Text>
            <Text style={styles.headerSub}>{t('cdCalendar.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Plus size={20} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {(Object.keys(TYPE_CONFIG) as CalendarEventType[]).map((type) => {
            const cfg = TYPE_CONFIG[type];
            return (
              <View key={type} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cfg.color }]} />
                <Text style={styles.legendText}>{type === 'Training' ? t('cdCalendar.eventTraining') : type === 'Match' ? t('cdCalendar.eventMatch') : type === 'Recovery' ? t('cdCalendar.eventRecovery') : t('cdCalendar.eventAssigned')}</Text>
              </View>
            );
          })}
        </View>

        {/* Events */}
        {grouped.map((group, gi) => {
          const isToday = group.date === today;
          const isPast = group.date < today;
          const d = new Date(group.date);
          const dateLabel = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

          return (
            <Animated.View key={group.date} entering={FadeInDown.delay(gi * 30).duration(400)}>
              <View style={styles.dateHeader}>
                <Text style={[styles.dateLabel, isToday && styles.dateLabelToday]}>{dateLabel}</Text>
                {isToday && <View style={styles.todayPill}><Text style={styles.todayPillText}>{t('cdCalendar.today')}</Text></View>}
              </View>
              {group.events.map((e) => {
                const cfg = TYPE_CONFIG[e.type];
                return (
                  <Card key={e.id} variant="gradient" shadow="card" style={[styles.eventCard, isPast && styles.eventCardPast]}>
                    <View style={styles.eventRow}>
                      <View style={[styles.eventIcon, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>{cfg.icon}</View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.eventTitle}>{e.title}</Text>
                        <Text style={styles.eventDesc}>{e.description}</Text>
                      </View>
                      <View style={[styles.eventTypePill, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
                        <Text style={[styles.eventTypeText, { color: cfg.color }]}>{e.type === 'Training' ? t('cdCalendar.eventTraining') : e.type === 'Match' ? t('cdCalendar.eventMatch') : e.type === 'Recovery' ? t('cdCalendar.eventRecovery') : t('cdCalendar.eventAssigned')}</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </Animated.View>
          );
        })}

        {events.length === 0 && (
          <View style={styles.emptyWrap}>
            <Calendar size={48} color={Colors.textQuaternary} />
            <Text style={styles.emptyText}>{t('cdCalendar.empty')}</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true} onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdCalendar.addEvent')}</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAddModal(false)}>
                <X size={20} color={Colors.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>{t('cdCalendar.dateField')}</Text>
              <TextInput style={styles.modalInput} value={newDate} onChangeText={setNewDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textQuaternary} />
              <Text style={styles.modalLabel}>{t('cdCalendar.eventType')}</Text>
              <View style={styles.typeRow}>
                {(Object.keys(TYPE_CONFIG) as CalendarEventType[]).map((et) => (
                  <TouchableOpacity
                    key={et}
                    style={[styles.typeChip, newType === et && styles.typeChipActive]}
                    onPress={() => setNewType(et)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.typeChipText, newType === et && styles.typeChipTextActive]}>{et === 'Training' ? t('cdCalendar.eventTraining') : et === 'Match' ? t('cdCalendar.eventMatch') : et === 'Recovery' ? t('cdCalendar.eventRecovery') : t('cdCalendar.eventAssigned')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalLabel}>{t('cdCalendar.titleField')}</Text>
              <TextInput style={styles.modalInput} value={newTitle} onChangeText={setNewTitle} placeholder="e.g. Team Training" placeholderTextColor={Colors.textQuaternary} />
              <Text style={styles.modalLabel}>{t('cdCalendar.descriptionField')}</Text>
              <TextInput style={[styles.modalInput, { minHeight: 60 }]} value={newDesc} onChangeText={setNewDesc} placeholder="Optional description..." placeholderTextColor={Colors.textQuaternary} multiline />
              <Button label={t('cdCalendar.save')} onPress={handleAdd} disabled={!newTitle.trim()} style={{ marginTop: Spacing.md }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg, paddingHorizontal: Spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },

  dateHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm, marginTop: Spacing.md },
  dateLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textSecondary },
  dateLabelToday: { color: Colors.gold },
  todayPill: { backgroundColor: Colors.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  todayPillText: { fontFamily: 'Inter-ExtraBold', fontSize: 9, color: Colors.background, letterSpacing: 1 },

  eventCard: { gap: 0, marginBottom: Spacing.sm },
  eventCardPast: { opacity: 0.5 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  eventIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  eventTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  eventDesc: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary },
  eventTypePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, borderWidth: 1 },
  eventTypeText: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5 },

  emptyWrap: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xxl },
  emptyText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '85%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  modalLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.md },
  modalInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, paddingHorizontal: Spacing.md, paddingVertical: 12, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  typeChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  typeChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.background },
});
