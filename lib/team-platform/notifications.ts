import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import type {
  TeamNotification,
  TeamNotificationCounts,
  TeamNotificationKind,
} from './types';

const STORAGE_KEY = 'hbiq_team_notifications';
const USE_LOCAL = !isSupabaseConfigured;

type LocalNotificationStore = Record<string, TeamNotification[]>;

function uid(): string {
  return `notification_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function localStore(): LocalNotificationStore {
  return readStorageJson<LocalNotificationStore>(STORAGE_KEY, {});
}

function saveLocalStore(store: LocalNotificationStore): void {
  writeStorageJson(STORAGE_KEY, store);
}

function addLocalNotification(input: {
  recipientId: string;
  actorId?: string | null;
  teamId?: string | null;
  eventId?: string | null;
  kind: TeamNotificationKind;
  title: string;
  message: string;
  actionPath?: string | null;
}): TeamNotification {
  const store = localStore();
  const notification: TeamNotification = {
    id: uid(),
    recipient_id: input.recipientId,
    actor_id: input.actorId ?? null,
    team_id: input.teamId ?? null,
    event_id: input.eventId ?? null,
    notification_kind: input.kind,
    title: input.title,
    message: input.message,
    metadata: {},
    action_path: input.actionPath ?? null,
    read_at: null,
    created_at: new Date().toISOString(),
  };
  store[input.recipientId] = [notification, ...(store[input.recipientId] ?? [])];
  saveLocalStore(store);
  return notification;
}

export async function fetchMyTeamNotifications(
  userId?: string,
  limit = 50,
): Promise<{ notifications: TeamNotification[]; error: string | null }> {
  if (USE_LOCAL) {
    const notifications = userId ? (localStore()[userId] ?? []).slice(0, limit) : [];
    return { notifications, error: null };
  }
  if (!supabase) return { notifications: [], error: 'Supabase not configured.' };
  const { data, error } = await supabase.rpc('list_my_app_notifications', { p_limit: limit });
  return { notifications: (data ?? []) as TeamNotification[], error: error?.message ?? null };
}

export async function fetchTeamNotificationCounts(
  teamId?: string | null,
  userId?: string,
): Promise<{ counts: TeamNotificationCounts; error: string | null }> {
  if (USE_LOCAL) {
    const unread = userId
      ? (localStore()[userId] ?? []).filter((notification) => !notification.read_at).length
      : 0;
    return {
      counts: { unreadNotifications: unread, pendingJoinRequests: 0 },
      error: null,
    };
  }
  if (!supabase) {
    return {
      counts: { unreadNotifications: 0, pendingJoinRequests: 0 },
      error: 'Supabase not configured.',
    };
  }
  const { data, error } = await supabase.rpc('get_notification_counts', {
    p_team_id: teamId ?? null,
  });
  const row = Array.isArray(data) ? data[0] : data;
  return {
    counts: {
      unreadNotifications: row?.unread_notifications ?? 0,
      pendingJoinRequests: row?.pending_join_requests ?? 0,
    },
    error: error?.message ?? null,
  };
}

export async function markTeamNotificationRead(
  notificationId: string,
  userId?: string,
): Promise<string | null> {
  if (USE_LOCAL) {
    if (!userId) return null;
    const store = localStore();
    store[userId] = (store[userId] ?? []).map((notification) => (
      notification.id === notificationId
        ? { ...notification, read_at: notification.read_at ?? new Date().toISOString() }
        : notification
    ));
    saveLocalStore(store);
    return null;
  }
  if (!supabase) return 'Supabase not configured.';
  const { error } = await supabase.rpc('mark_app_notification_read', {
    p_notification_id: notificationId,
  });
  return error?.message ?? null;
}

export async function markAllTeamNotificationsRead(userId?: string): Promise<string | null> {
  if (USE_LOCAL) {
    if (!userId) return null;
    const store = localStore();
    const now = new Date().toISOString();
    store[userId] = (store[userId] ?? []).map((notification) => ({
      ...notification,
      read_at: notification.read_at ?? now,
    }));
    saveLocalStore(store);
    return null;
  }
  if (!supabase) return 'Supabase not configured.';
  const { error } = await supabase.rpc('mark_all_app_notifications_read');
  return error?.message ?? null;
}

export async function sendCoachMessage(input: {
  teamId: string;
  playerId: string;
  coachId: string;
  title: string;
  message: string;
}): Promise<string | null> {
  if (USE_LOCAL) {
    addLocalNotification({
      recipientId: input.playerId,
      actorId: input.coachId,
      teamId: input.teamId,
      kind: 'coach_message',
      title: input.title,
      message: input.message,
      actionPath: '/notifications',
    });
    return null;
  }
  if (!supabase) return 'Supabase not configured.';
  const { error } = await supabase.rpc('send_team_notification', {
    p_team_id: input.teamId,
    p_player_ids: [input.playerId],
    p_kind: 'coach_message',
    p_title: input.title,
    p_message: input.message,
    p_event_id: null,
    p_action_path: '/notifications',
  });
  return error?.message ?? null;
}

export async function remindTeamEventNonResponders(input: {
  teamId: string;
  eventId: string;
  coachId: string;
  title: string;
  message: string;
}): Promise<{ sent: number; error: string | null }> {
  if (USE_LOCAL) {
    const { localFetchMembers, localFetchTeamEventResponses } = await import('./storage');
    const responded = new Set(
      localFetchTeamEventResponses(input.teamId, input.eventId).map((response) => response.player_id),
    );
    const recipients = localFetchMembers(input.teamId).filter(
      (member) => member.member_role === 'player' && !responded.has(member.user_id),
    );
    for (const recipient of recipients) {
      addLocalNotification({
        recipientId: recipient.user_id,
        actorId: input.coachId,
        teamId: input.teamId,
        eventId: input.eventId,
        kind: 'event_reminder',
        title: input.title,
        message: input.message,
        actionPath: '/team-calendar',
      });
    }
    return { sent: recipients.length, error: null };
  }
  if (!supabase) return { sent: 0, error: 'Supabase not configured.' };
  const { data, error } = await supabase.rpc('remind_team_event_nonresponders', {
    p_event_id: input.eventId,
    p_title: input.title,
    p_message: input.message,
  });
  const row = Array.isArray(data) ? data[0] : data;
  return { sent: row?.sent_count ?? 0, error: error?.message ?? null };
}
