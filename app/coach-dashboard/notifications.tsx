import { useCallback, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Bell, Check, CheckCheck, ChevronRight, Send, UserPlus, Users, X } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card, PressableCard } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import { useTranslation } from '@/hooks/useTranslation';
import { renderTeamNotification } from '@/lib/team-platform/notification-copy';
import {
  fetchMyTeamNotifications,
  markAllTeamNotificationsRead,
  markTeamNotificationRead,
  sendCoachMessage,
} from '@/lib/team-platform/notifications';
import type { TeamMemberRecord, TeamNotification } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';
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

export default function CoachNotificationsScreen() {
  const { t, lang } = useTranslation();
  const { user, profile } = useAuth();
  const { team, members, loading: teamLoading } = useTeamPlatform(
    user?.id,
    profile?.display_name ?? undefined,
  );
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMemberRecord | null>(null);
  const [message, setMessage] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [notifications, setNotifications] = useState<TeamNotification[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(true);

  const players = useMemo(
    () => members.filter((member) => member.member_role === 'player'),
    [members],
  );

  const loadInbox = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoadingInbox(false);
      return;
    }
    setLoadingInbox(true);
    const result = await fetchMyTeamNotifications(user.id);
    setNotifications(result.notifications);
    if (result.error) setFeedback(t('notifications.loadFailed'));
    setLoadingInbox(false);
  }, [t, user?.id]);

  useFocusEffect(useCallback(() => {
    void loadInbox();
  }, [loadInbox]));

  const handleSend = async () => {
    if (!team?.id || !selectedPlayer || !message.trim() || !user?.id) return;
    setSending(true);
    setFeedback('');
    const error = await sendCoachMessage({
      teamId: team.id,
      playerId: selectedPlayer.user_id,
      coachId: user.id,
      title: t('notifications.coachMessageTitle', { team: team.name }),
      message: message.trim(),
    });
    setSending(false);
    if (error) {
      setFeedback(t('cdNotif.failed'));
      return;
    }
    setFeedback(t('cdNotif.success'));
    setMessage('');
    setSelectedPlayer(null);
  };

  const openNotification = async (notification: TeamNotification) => {
    if (!notification.read_at) {
      await markTeamNotificationRead(notification.id, user?.id);
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
      )));
    }
    if (notification.action_path?.startsWith('/')) {
      router.push(notification.action_path as never);
    }
  };

  const markAllRead = async () => {
    const error = await markAllTeamNotificationsRead(user?.id);
    if (error) {
      setFeedback(t('notifications.markReadFailed'));
      return;
    }
    const now = new Date().toISOString();
    setNotifications((current) => current.map((item) => ({
      ...item,
      read_at: item.read_at ?? now,
    })));
  };

  const unread = notifications.filter((notification) => !notification.read_at).length;
  const locale = lang === 'hr' ? 'hr-HR' : lang === 'de' ? 'de-DE' : 'en-US';

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
            <Text style={styles.headerSub}>{team?.name ?? t('cdNotif.subtitle')}</Text>
          </View>
          {unread > 0 ? <Text style={styles.unreadBadge}>{unread}</Text> : null}
        </View>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('notifications.inbox')}</Text>
          {unread > 0 ? (
            <TouchableOpacity style={styles.markReadButton} onPress={markAllRead}>
              <CheckCheck size={15} color={Colors.gold} />
              <Text style={styles.markReadText}>{t('notifications.markAllRead')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {loadingInbox ? (
          <Text style={styles.loading}>{t('common.loading')}</Text>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={28} color={Colors.gold} />}
            title={t('notifications.empty')}
            description={t('notifications.coachEmptySub')}
          />
        ) : notifications.slice(0, 20).map((notification) => {
          const copy = renderTeamNotification(notification, t);
          const joinNotification = notification.notification_kind === 'join_request';
          return (
            <TouchableOpacity key={notification.id} activeOpacity={0.82} onPress={() => openNotification(notification)}>
              <Card variant="gradient" style={[styles.notificationCard, !notification.read_at && styles.unreadCard]}>
                <View style={styles.notificationRow}>
                  <View style={styles.notificationIcon}>
                    {joinNotification
                      ? <UserPlus size={18} color={Colors.gold} />
                      : <Bell size={18} color={Colors.gold} />}
                  </View>
                  <View style={styles.notificationCopy}>
                    <View style={styles.notificationTitleRow}>
                      <Text style={styles.notificationTitle}>{copy.title}</Text>
                      {!notification.read_at ? <View style={styles.unreadDot} /> : null}
                    </View>
                    <Text style={styles.notificationMessage}>{copy.message}</Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.created_at).toLocaleString(locale, {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={Colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.sectionLabel}>{t('notifications.sendDirectMessage')}</Text>
        <PressableCard
          onPress={() => setShowPlayerModal(true)}
          variant="gradient"
          shadow="card"
          style={styles.selectCard}
        >
          <View style={styles.selectRow}>
            <View style={styles.selectIcon}><Users size={18} color={Colors.gold} /></View>
            <View style={styles.selectCopy}>
              <Text style={selectedPlayer ? styles.selectValue : styles.selectPlaceholder}>
                {selectedPlayer?.display_name ?? t('cdNotif.selectPlayer')}
              </Text>
              {selectedPlayer?.position ? (
                <Text style={styles.selectSub}>{translatePosition(selectedPlayer.position, t)}</Text>
              ) : null}
            </View>
            <ChevronRight size={18} color={Colors.gold} />
          </View>
        </PressableCard>

        <View style={styles.quickGrid}>
          {QUICK_MESSAGE_KEYS.map((key) => {
            const quickMessage = t(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.quickChip, message === quickMessage && styles.quickChipActive]}
                onPress={() => setMessage(quickMessage)}
              >
                <Text style={[styles.quickChipText, message === quickMessage && styles.quickChipTextActive]}>
                  {quickMessage}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder={t('cdNotif.placeholder')}
          placeholderTextColor={Colors.textQuaternary}
          maxLength={1000}
          multiline
        />

        <Button
          label={t('cdNotif.send')}
          onPress={handleSend}
          disabled={!team || !selectedPlayer || !message.trim() || teamLoading}
          loading={sending}
          iconRight={<Send size={18} color={Colors.background} />}
        />
      </ScrollView>

      <Modal visible={showPlayerModal} animationType="slide" transparent onRequestClose={() => setShowPlayerModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('cdNotif.selectPlayer')}</Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowPlayerModal(false)}>
                <X size={20} color={Colors.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {players.length === 0 ? (
                <Text style={styles.loading}>{t('cdAssign.noPlayers')}</Text>
              ) : players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={[styles.playerOption, selectedPlayer?.id === player.id && styles.playerOptionActive]}
                  onPress={() => { setSelectedPlayer(player); setShowPlayerModal(false); }}
                >
                  <View style={styles.selectCopy}>
                    <Text style={styles.playerName}>{player.display_name ?? player.email ?? t('role.player')}</Text>
                    <Text style={styles.playerMeta}>
                      {player.position ? translatePosition(player.position, t) : t('common.notSet')}
                    </Text>
                  </View>
                  {selectedPlayer?.id === player.id ? <Check size={18} color={Colors.gold} /> : null}
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
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  unreadBadge: { minWidth: 28, paddingHorizontal: 8, paddingVertical: 5, borderRadius: Radius.pill, overflow: 'hidden', textAlign: 'center', fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.background, backgroundColor: Colors.gold },
  feedback: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.3, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  markReadButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  markReadText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  loading: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, textAlign: 'center', paddingVertical: Spacing.lg },
  notificationCard: { borderWidth: 1, borderColor: Colors.border },
  unreadCard: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  notificationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notificationIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  notificationCopy: { flex: 1, minWidth: 0, gap: 4 },
  notificationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notificationTitle: { flex: 1, fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textPrimary },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.gold },
  notificationMessage: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  notificationTime: { fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.textQuaternary },
  selectCard: { marginBottom: Spacing.sm },
  selectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  selectIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  selectCopy: { flex: 1, minWidth: 0 },
  selectValue: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  selectPlaceholder: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textQuaternary },
  selectSub: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  quickChip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  quickChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  quickChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  quickChipTextActive: { color: Colors.background },
  messageInput: { minHeight: 88, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceRaised, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20, textAlignVertical: 'top', marginBottom: Spacing.sm },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: Colors.overlay },
  modalContent: { maxHeight: '75%', padding: Spacing.lg, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalClose: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.goldSoft },
  playerOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm },
  playerOptionActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  playerName: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  playerMeta: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
});
