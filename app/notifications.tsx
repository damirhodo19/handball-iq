import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Bell, CalendarDays, CheckCheck, UserPlus } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { renderTeamNotification } from '@/lib/team-platform/notification-copy';
import {
  fetchMyTeamNotifications,
  markAllTeamNotificationsRead,
  markTeamNotificationRead,
} from '@/lib/team-platform/notifications';
import type { TeamNotification } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';

function notificationIcon(kind: string) {
  if (kind.startsWith('join_')) return <UserPlus size={18} color={Colors.gold} />;
  if (kind.includes('event')) return <CalendarDays size={18} color={Colors.gold} />;
  return <Bell size={18} color={Colors.gold} />;
}

export default function PlayerNotificationsScreen() {
  const { t, lang } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<TeamNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await fetchMyTeamNotifications(user.id);
    setNotifications(result.notifications);
    setMessage(result.error ? t('notifications.loadFailed') : '');
    setLoading(false);
  }, [t, user?.id]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

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
      setMessage(t('notifications.markReadFailed'));
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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
            <Text style={styles.headerSub}>{t('notifications.subtitle')}</Text>
          </View>
          {unread > 0 ? <Text style={styles.unreadBadge}>{unread}</Text> : null}
        </View>

        {unread > 0 ? (
          <Button
            label={t('notifications.markAllRead')}
            onPress={markAllRead}
            variant="outline"
            icon={<CheckCheck size={17} color={Colors.gold} />}
          />
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {loading ? (
          <Text style={styles.loading}>{t('common.loading')}</Text>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={30} color={Colors.gold} />}
            title={t('notifications.empty')}
            description={t('notifications.emptySub')}
          />
        ) : notifications.map((notification) => {
          const copy = renderTeamNotification(notification, t);
          return (
            <TouchableOpacity
              key={notification.id}
              activeOpacity={0.82}
              onPress={() => openNotification(notification)}
            >
              <Card
                variant="gradient"
                style={[styles.notificationCard, !notification.read_at && styles.unreadCard]}
              >
                <View style={styles.notificationRow}>
                  <View style={styles.iconBox}>{notificationIcon(notification.notification_kind)}</View>
                  <View style={styles.notificationCopy}>
                    <View style={styles.titleRow}>
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
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  message: { color: Colors.warning, fontFamily: 'Inter-SemiBold', fontSize: 12, textAlign: 'center', marginVertical: Spacing.sm },
  loading: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', paddingVertical: Spacing.xl },
  notificationCard: { marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  unreadCard: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  notificationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  notificationCopy: { flex: 1, minWidth: 0, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notificationTitle: { flex: 1, fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  notificationMessage: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  notificationTime: { fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.textQuaternary },
});
