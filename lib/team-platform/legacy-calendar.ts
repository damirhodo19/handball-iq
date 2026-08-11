import type { CalendarEvent, CalendarEventType as LegacyEventType } from '@/lib/coach-dashboard-data';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import { addTeamCalendarEvent } from './platform';
import type { CalendarEventType, TeamCalendarEvent } from './types';

const MIGRATION_KEY = 'hbiq_team_calendar_legacy_migration_v1';

function readCustomText(value: { key?: string; params?: Record<string, string | number> }): string | null {
  const text = value?.params?.text;
  return typeof text === 'string' && text.trim() ? text.trim() : null;
}

function mapEventType(type: LegacyEventType): CalendarEventType {
  if (type === 'Match') return 'match';
  if (type === 'Recovery') return 'recovery';
  if (type === 'Assigned Session') return 'assigned_session';
  return 'training';
}

export async function migrateLegacyCustomCalendarEvents(input: {
  teamId: string;
  coachId: string;
  existingEvents: TeamCalendarEvent[];
}): Promise<{ imported: number; error: string | null }> {
  const completed = readStorageJson<Record<string, boolean>>(MIGRATION_KEY, {});
  if (completed[input.teamId]) return { imported: 0, error: null };

  const legacyEvents = readStorageJson<CalendarEvent[]>('hbiq_coach_calendar', []).flatMap((event) => {
    if (event.title.key !== 'cdCalendar.custom.title') return [];
    const title = readCustomText(event.title);
    if (!title) return [];
    const description = readCustomText(event.description);
    return [{ event, title, description }];
  });

  let imported = 0;
  for (const legacy of legacyEvents) {
    const alreadyExists = input.existingEvents.some((event) =>
      event.event_date === legacy.event.date && event.title.trim() === legacy.title,
    );
    if (alreadyExists) continue;
    const eventType = mapEventType(legacy.event.type);
    const result = await addTeamCalendarEvent({
      team_id: input.teamId,
      event_type: eventType,
      event_date: legacy.event.date,
      event_time: null,
      end_time: null,
      title: legacy.title,
      description: legacy.description,
      location: null,
      response_required: eventType === 'training' || eventType === 'match',
      event_status: 'scheduled',
      player_id: legacy.event.playerId ?? null,
      assignment_id: null,
      created_by: input.coachId,
    });
    if (result.error) return { imported, error: result.error };
    imported += 1;
  }

  completed[input.teamId] = true;
  writeStorageJson(MIGRATION_KEY, completed);
  return { imported, error: null };
}
