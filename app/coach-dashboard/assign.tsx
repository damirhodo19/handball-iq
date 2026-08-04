import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, ClipboardList, Check, Calendar, X, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { Button } from '@/components/Button';
import { loadPlayers, loadCoachAccount, assignSession, PlayerProfile, SessionType } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSessionType, translatePosition } from '@/lib/translations';

const SESSION_TYPES: SessionType[] = [
  'Wing Session',
  'Pressure Session',
  'Fast Break Session',
  '7m Session',
  'Match Day Preparation',
  'Mental Training',
];

const SESSION_ICONS: Record<SessionType, string> = {
  'Wing Session': 'Wing',
  'Pressure Session': 'Pressure',
  'Fast Break Session': 'Fast Break',
  '7m Session': '7m',
  'Match Day Preparation': 'Match Prep',
  'Mental Training': 'Mental',
};

export default function AssignScreen() {
  const { t } = useTranslation();
  const { playerId, sessionType } = useLocalSearchParams<{ playerId?: string; sessionType?: SessionType }>();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(sessionType ?? null);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useFocusEffect(useCallback(() => {
    const all = loadPlayers();
    setPlayers(all);
    if (playerId) {
      const p = all.find((x) => x.id === playerId);
      if (p) setSelectedPlayer(p);
    }
  }, [playerId]));

  const handleAssign = () => {
    if (!selectedPlayer || !selectedSession) return;
    const coach = loadCoachAccount();
    assignSession(selectedPlayer.id, selectedSession, dueDate, note.trim() || `Assigned by ${coach?.name ?? 'Coach'}`, coach?.name ?? 'Coach');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPlayer(null);
      setSelectedSession(null);
      setNote('');
      router.back();
    }, 1500);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('cdAssign.title')}</Text>
            <Text style={styles.headerSub}>{t('cdAssign.subtitle')}</Text>
          </View>
        </View>

        {/* Select Player */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.label}>{t('cdAssign.selectPlayer')}</Text>
          <PressableCard onPress={() => setShowPlayerModal(true)} variant="gradient" shadow="card" style={styles.selectCard}>
            <View style={styles.selectRow}>
              <View style={styles.selectIcon}><ClipboardList size={18} color={Colors.gold} /></View>
              {selectedPlayer ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectValue}>{selectedPlayer.name}</Text>
                  <Text style={styles.selectSub}>{translatePosition(selectedPlayer.position, t)} · {selectedPlayer.club}</Text>
                </View>
              ) : (
                <Text style={styles.selectPlaceholder}>{t('cdAssign.selectPlayer')}</Text>
              )}
              <ChevronRight size={18} color={Colors.gold} />
            </View>
          </PressableCard>
        </Animated.View>

        {/* Select Session Type */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text style={styles.label}>{t('cdAssign.selectSessionType')}</Text>
          <View style={styles.sessionGrid}>
            {SESSION_TYPES.map((st) => {
              const active = selectedSession === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.sessionChip, active && styles.sessionChipActive]}
                  onPress={() => setSelectedSession(st)}
                  activeOpacity={0.8}
                >
                  {active && <Check size={12} color={Colors.background} />}
                  <Text style={[styles.sessionChipText, active && styles.sessionChipTextActive]}>{translateSessionType(st, t)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Due Date */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.label}>{t('cdAssign.dueDate')}</Text>
          <View style={styles.dateRow}>
            <Calendar size={16} color={Colors.gold} />
            <TextInput
              style={styles.dateInput}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textQuaternary}
            />
          </View>
        </Animated.View>

        {/* Note */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={styles.label}>{t('cdAssign.message')}</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder={t('cdAssign.messagePlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            multiline
          />
        </Animated.View>

        {/* Assign Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginTop: Spacing.lg }}>
          <Button
            label={t('cdAssign.assignBtn')}
            onPress={handleAssign}
            disabled={!selectedPlayer || !selectedSession}
            iconRight={<Check size={20} color={Colors.background} />}
          />
        </Animated.View>

        {/* Success overlay */}
        {showSuccess && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.successOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}><Check size={32} color={Colors.success} /></View>
              <Text style={styles.successText}>{t('cdAssign.success')}</Text>
              <Text style={styles.successSub}>The player will see it on their home screen.</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Player Selection Modal */}
      <Modal visible={showPlayerModal} animationType="slide" transparent={true} onRequestClose={() => setShowPlayerModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdAssign.selectPlayer')}</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPlayerModal(false)}>
                <X size={20} color={Colors.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {players.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.modalPlayerCard, selectedPlayer?.id === p.id && styles.modalPlayerCardActive]}
                  onPress={() => { setSelectedPlayer(p); setShowPlayerModal(false); }}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalPlayerName}>{p.name}</Text>
                    <Text style={styles.modalPlayerMeta}>{translatePosition(p.position, t)} · {p.age} yrs · {p.club}</Text>
                  </View>
                  {selectedPlayer?.id === p.id && <Check size={18} color={Colors.gold} />}
                </TouchableOpacity>
              ))}
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

  label: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  selectCard: { marginBottom: 0 },
  selectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  selectIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  selectValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  selectSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  selectPlaceholder: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 15, color: Colors.textQuaternary },

  sessionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sessionChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  sessionChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  sessionChipText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  sessionChipTextActive: { color: Colors.background },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 12 },
  dateInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },

  noteInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, padding: Spacing.md, minHeight: 80, textAlignVertical: 'top' },

  successOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  successCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.success },
  successIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.successSoft, justifyContent: 'center', alignItems: 'center' },
  successText: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  successSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '75%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  modalPlayerCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm },
  modalPlayerCardActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  modalPlayerName: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  modalPlayerMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
});
