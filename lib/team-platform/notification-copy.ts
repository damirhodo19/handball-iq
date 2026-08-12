import type { TeamNotification } from './types';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

function textMeta(notification: TeamNotification, key: string, fallback = ''): string {
  const value = notification.metadata?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function renderTeamNotification(
  notification: TeamNotification,
  t: Translate,
): { title: string; message: string } {
  const teamName = textMeta(notification, 'teamName');
  const playerName = textMeta(notification, 'playerName');
  const eventTitle = textMeta(notification, 'eventTitle');
  const eventDate = textMeta(notification, 'eventDate');
  const eventTime = textMeta(notification, 'eventTime');

  switch (notification.notification_kind) {
    case 'join_request':
      return {
        title: t('notifications.joinRequestTitle'),
        message: t('notifications.joinRequestMessage', { player: playerName, team: teamName }),
      };
    case 'join_approved':
      return {
        title: t('notifications.joinApprovedTitle'),
        message: t('notifications.joinApprovedMessage', { team: teamName }),
      };
    case 'join_rejected':
      return {
        title: t('notifications.joinRejectedTitle'),
        message: t('notifications.joinRejectedMessage', { team: teamName }),
      };
    case 'team_event_created':
      return {
        title: t('notifications.newEventTitle'),
        message: t('notifications.newEventMessage', {
          event: eventTitle,
          date: eventDate,
          time: eventTime || '—',
          team: teamName,
        }),
      };
    case 'event_response': {
      const status = textMeta(notification, 'responseStatus');
      const response = status
        ? t(`notifications.response.${status}`)
        : t('notifications.response.maybe');
      return {
        title: t('notifications.eventResponseTitle'),
        message: t('notifications.eventResponseMessage', {
          player: playerName,
          response,
          event: eventTitle,
        }),
      };
    }
    default:
      return { title: notification.title, message: notification.message };
  }
}
