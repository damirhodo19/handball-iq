import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, Send, Check, X, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { loadPlayers, sendNotification, PlayerProfile } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition } from '@/lib/translations';

const QUICK_MESSAGE_KEYS = [
  'cdNotif.quick1',
  'cdNotif.quick2',
  'cdNotif.quick3',
  'cdNotif.quick4',
  'cdNotif.quick5',
  'cdNotif.quick6',
  'cdNotif.quick7',
] as const;

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [message, setMessage] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useFocusEffect(useCallback(() => {
    setPlayers(loadPlayers());
  }, []));

  const handleSend = () => {
    if (!selectedPlayer || !message.trim()) return;
    sendNotification(selectedPlayer.id, message.trim());
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setMessage('');
      setSelectedPlayer(null);
      setPlayers(loadPlayers());
    }, 1500);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('cdNotif.title')}</Text>
            <Text style={styles.headerSub}>{t('cdNotif.subtitle')}</Text>
          </View>
        </View>

        {/* Select Player */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.label}>{t('cdNotif.selectPlayer')}</Text>
          <PressableCard onPress={() => setShowPlayerModal(true)} variant="gradient" shadow="card" style={styles.selectCard}>
            <View style={styles.selectRow}>
              <View style={styles.selectIcon}><Bell size={18} color={Colors.gold} /></View>
              {selectedPlayer ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectValue}>{selectedPlayer.name}</Text>
                  <Text style={styles.selectSub}>{translatePosition(selectedPlayer.position, t)} · {selectedPlayer.club}</Text>
                </View>
              ) : (
                <Text style={styles.selectPlaceholder}>{t('cdNotif.selectPlayer')}</Text>
              )}
              <ChevronRight size={18} color={Colors.gold} />
            </View>
          </PressableCard>
        </Animated.View>

        {/* Quick Messages */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text style={styles.label}>{t('cdNotif.message')}</Text>
          <View style={styles.quickGrid}>
            {QUICK_MESSAGE_KEYS.map((key) => {
              const msg = t(key);
              return (
              <TouchableOpacity
                key={key}
                style={[styles.quickChip, message === msg && styles.quickChipActive]}
                onPress={() => setMessage(msg)}
                activeOpacity={0.8}
              >
                <Text style={[styles.quickChipText, message === msg && styles.quickChipTextActive]}>{msg}</Text>
              </TouchableOpacity>
            );})}
          </View>
        </Animated.View>

        {/* Custom Message */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.label}>{t('cdNotif.message')}</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder={t('cdNotif.placeholder')}
            placeholderTextColor={Colors.textQuaternary}
            multiline
          />
        </Animated.View>

        {/* Send Button */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ marginTop: Spacing.lg }}>
          <Button
            label={t('cdNotif.send')}
            onPress={handleSend}
            disabled={!selectedPlayer || !message.trim()}
            iconRight={<Send size={18} color={Colors.background} />}
          />
        </Animated.View>

        {/* Recent Notifications */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('cdNotif.recentlySent')}</Text>
          {players.flatMap((p) => p.notifications.map((n) => ({ player: p, notif: n }))).sort((a, b) => b.notif.sentAt.localeCompare(a.notif.sentAt)).slice(0, 5).map(({ player, notif }, i) => (
            <Card key={notif.id} variant="gradient" shadow="card" style={styles.notifCard}>
              <View style={styles.notifHeader}>
                <View style={styles.notifIcon}><Bell size={12} color={Colors.gold} /></View>
                <Text style={styles.notifPlayer}>{player.name}</Text>
                <Text style={styles.notifTime}>{new Date(notif.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <Text style={styles.notifMessage}>{notif.message}</Text>
            </Card>
          ))}
          {players.flatMap((p) => p.notifications).length === 0 && (
            <Text style={styles.emptyText}>{t('cdNotif.empty')}</Text>
          )}
        </Animated.View>

        {/* Success overlay */}
        {showSuccess && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.successOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}><Check size={32} color={Colors.success} /></View>
              <Text style={styles.successText}>{t('cdNotif.success')}</Text>
              <Text style={styles.successSub}>{t('cdNotif.successSub')}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Player Selection Modal */}
      <Modal visible={showPlayerModal} animationType="slide" transparent={true} onRequestClose={() => setShowPlayerModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdNotif.selectPlayer')}</Text>
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
                    <Text style={styles.modalPlayerMeta}>{translatePosition(p.position, t)} · {p.age} {t('common.yrs')} · {p.club}</Text>
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
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  label: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  selectCard: { marginBottom: 0 },
  selectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  selectIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  selectValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  selectSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  selectPlaceholder: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 15, color: Colors.textQuaternary },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  quickChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  quickChipText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  quickChipTextActive: { color: Colors.background },

  messageInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, padding: Spacing.md, minHeight: 80, textAlignVertical: 'top' },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  notifCard: { gap: Spacing.xs, marginBottom: Spacing.sm },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  notifPlayer: { fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textPrimary, flex: 1 },
  notifTime: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textQuaternary },
  notifMessage: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },

  emptyText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', marginTop: Spacing.md },

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
