import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';
import type { NoteType } from '@/lib/team-platform/types';

export type CoachAttendanceStatus = 'present' | 'absent';

export interface CoachRosterPlayer {
  id: string;
  coach_id: string;
  team_key: string;
  display_name: string;
  position: string | null;
  linked_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachAttendanceEntry {
  id: string;
  coach_id: string;
  team_key: string;
  roster_player_id: string;
  training_date: string;
  status: CoachAttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface CoachWorkspaceNote {
  id: string;
  coach_id: string;
  team_key: string;
  roster_player_id: string | null;
  note_type: NoteType;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CoachWorkspaceState {
  players: CoachRosterPlayer[];
  attendance: CoachAttendanceEntry[];
  notes: CoachWorkspaceNote[];
}

const STORAGE_KEY = 'hbiq_coach_workspace_v1';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function loadState(): CoachWorkspaceState {
  const stored = readStorageJson<Partial<CoachWorkspaceState>>(STORAGE_KEY, {});
  return {
    players: Array.isArray(stored.players)
      ? stored.players.map((player) => ({ ...player, linked_user_id: player.linked_user_id ?? null }))
      : [],
    attendance: Array.isArray(stored.attendance) ? stored.attendance : [],
    notes: Array.isArray(stored.notes) ? stored.notes : [],
  };
}

function saveState(state: CoachWorkspaceState): void {
  writeStorageJson(STORAGE_KEY, state);
}

function createUuid(): string {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string; getRandomValues?: (values: Uint8Array) => Uint8Array } | undefined;
  if (cryptoObject?.randomUUID) return cryptoObject.randomUUID();

  const bytes = new Uint8Array(16);
  if (cryptoObject?.getRandomValues) cryptoObject.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function scoped<T extends { coach_id: string; team_key: string }>(items: T[], coachId: string, teamKey: string): T[] {
  return items.filter((item) => item.coach_id === coachId && item.team_key === teamKey);
}

function mergeById<T extends { id: string }>(localItems: T[], cloudItems: T[]): T[] {
  const merged = new Map(localItems.map((item) => [item.id, item]));
  for (const item of cloudItems) merged.set(item.id, item);
  return Array.from(merged.values());
}

function canUseCloud(coachId: string): boolean {
  return Boolean(isSupabaseConfigured && supabase && UUID_RE.test(coachId));
}

export function loadCoachRoster(coachId: string, teamKey: string): CoachRosterPlayer[] {
  return scoped(loadState().players, coachId, teamKey)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
}

export function loadCoachRosterForTeam(coachId: string, teamKey: string): CoachRosterPlayer[] {
  const keys = teamKey === 'default' ? ['default'] : [teamKey, 'default'];
  return keys
    .flatMap((key) => loadCoachRoster(coachId, key))
    .filter((player, index, all) => all.findIndex((item) => item.id === player.id) === index)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
}

export function loadCoachAttendance(coachId: string, teamKey: string, trainingDate: string): CoachAttendanceEntry[] {
  return scoped(loadState().attendance, coachId, teamKey)
    .filter((entry) => entry.training_date === trainingDate);
}

export function loadCoachAttendanceForTeam(
  coachId: string,
  teamKey: string,
  trainingDate: string,
): CoachAttendanceEntry[] {
  const keys = teamKey === 'default' ? ['default'] : [teamKey, 'default'];
  return keys
    .flatMap((key) => loadCoachAttendance(coachId, key, trainingDate))
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index);
}

export function loadCoachWorkspaceNotes(
  coachId: string,
  teamKey: string,
  rosterPlayerId?: string | null,
): CoachWorkspaceNote[] {
  const notes = scoped(loadState().notes, coachId, teamKey);
  const filtered = rosterPlayerId === undefined
    ? notes
    : notes.filter((note) => note.roster_player_id === rosterPlayerId);
  return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function loadCoachWorkspaceNotesForTeam(
  coachId: string,
  teamKey: string,
  rosterPlayerId?: string | null,
): CoachWorkspaceNote[] {
  const keys = teamKey === 'default' ? ['default'] : [teamKey, 'default'];
  return keys
    .flatMap((key) => loadCoachWorkspaceNotes(coachId, key, rosterPlayerId))
    .filter((note, index, all) => all.findIndex((item) => item.id === note.id) === index)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function addCoachRosterPlayer(input: {
  coachId: string;
  teamKey: string;
  displayName: string;
  position?: string | null;
}): Promise<{ player: CoachRosterPlayer; cloudError: string | null }> {
  const now = new Date().toISOString();
  const player: CoachRosterPlayer = {
    id: createUuid(),
    coach_id: input.coachId,
    team_key: input.teamKey,
    display_name: input.displayName.trim(),
    position: input.position ?? null,
    linked_user_id: null,
    created_at: now,
    updated_at: now,
  };
  const state = loadState();
  state.players.push(player);
  saveState(state);

  if (!canUseCloud(input.coachId) || !supabase) return { player, cloudError: null };
  const { error } = await supabase.from('coach_roster_players').upsert(player, { onConflict: 'id' });
  return { player, cloudError: error?.message ?? null };
}

export function cacheLinkedCoachRosterPlayer(player: CoachRosterPlayer): void {
  const state = loadState();
  state.players = mergeById(state.players, [player]);
  saveState(state);
}

export async function removeCoachRosterPlayer(
  coachId: string,
  teamKey: string,
  playerId: string,
): Promise<string | null> {
  const state = loadState();
  state.players = state.players.filter((player) => player.id !== playerId);
  state.attendance = state.attendance.filter((entry) => entry.roster_player_id !== playerId);
  state.notes = state.notes.filter((note) => note.roster_player_id !== playerId);
  saveState(state);

  if (!canUseCloud(coachId) || !supabase) return null;
  const { error } = await supabase
    .from('coach_roster_players')
    .delete()
    .eq('id', playerId)
    .eq('coach_id', coachId)
    .eq('team_key', teamKey);
  return error?.message ?? null;
}

export async function setCoachAttendance(input: {
  coachId: string;
  teamKey: string;
  rosterPlayerId: string;
  trainingDate: string;
  status: CoachAttendanceStatus;
}): Promise<{ entry: CoachAttendanceEntry; cloudError: string | null }> {
  const state = loadState();
  const now = new Date().toISOString();
  const existing = state.attendance.find((entry) =>
    entry.coach_id === input.coachId
    && entry.team_key === input.teamKey
    && entry.roster_player_id === input.rosterPlayerId
    && entry.training_date === input.trainingDate,
  );
  const entry: CoachAttendanceEntry = existing
    ? { ...existing, status: input.status, updated_at: now }
    : {
        id: createUuid(),
        coach_id: input.coachId,
        team_key: input.teamKey,
        roster_player_id: input.rosterPlayerId,
        training_date: input.trainingDate,
        status: input.status,
        created_at: now,
        updated_at: now,
      };

  if (existing) state.attendance[state.attendance.indexOf(existing)] = entry;
  else state.attendance.push(entry);
  saveState(state);

  if (!canUseCloud(input.coachId) || !supabase) return { entry, cloudError: null };
  const { error } = await supabase.from('coach_attendance_entries').upsert(entry, {
    onConflict: 'coach_id,team_key,roster_player_id,training_date',
  });
  return { entry, cloudError: error?.message ?? null };
}

export async function addCoachWorkspaceNote(input: {
  coachId: string;
  teamKey: string;
  rosterPlayerId: string | null;
  noteType: NoteType;
  content: string;
}): Promise<{ note: CoachWorkspaceNote; cloudError: string | null }> {
  const now = new Date().toISOString();
  const note: CoachWorkspaceNote = {
    id: createUuid(),
    coach_id: input.coachId,
    team_key: input.teamKey,
    roster_player_id: input.rosterPlayerId,
    note_type: input.noteType,
    content: input.content.trim(),
    created_at: now,
    updated_at: now,
  };
  const state = loadState();
  state.notes.unshift(note);
  saveState(state);

  if (!canUseCloud(input.coachId) || !supabase) return { note, cloudError: null };
  const { error } = await supabase.from('coach_workspace_notes').upsert(note, { onConflict: 'id' });
  return { note, cloudError: error?.message ?? null };
}

export async function removeCoachWorkspaceNote(coachId: string, noteId: string): Promise<string | null> {
  const state = loadState();
  state.notes = state.notes.filter((note) => note.id !== noteId);
  saveState(state);

  if (!canUseCloud(coachId) || !supabase) return null;
  const { error } = await supabase.from('coach_workspace_notes').delete().eq('id', noteId).eq('coach_id', coachId);
  return error?.message ?? null;
}

export async function syncCoachWorkspace(coachId: string, teamKey: string): Promise<string | null> {
  if (!canUseCloud(coachId) || !supabase) return null;
  const state = loadState();
  let localPlayers = scoped(state.players, coachId, teamKey);
  const localAttendance = scoped(state.attendance, coachId, teamKey);
  const localNotes = scoped(state.notes, coachId, teamKey);

  // A verified account link created by a coach approval must never be erased by
  // stale offline data from another device. Non-null cloud links win before the
  // regular local-first workspace sync continues.
  const cloudLinksResult = await supabase
    .from('coach_roster_players')
    .select('id, linked_user_id')
    .eq('coach_id', coachId)
    .eq('team_key', teamKey)
    .not('linked_user_id', 'is', null);
  if (cloudLinksResult.error) return cloudLinksResult.error.message;
  const cloudLinks = new Map(
    (cloudLinksResult.data ?? []).map((player) => [player.id, player.linked_user_id as string]),
  );
  if (cloudLinks.size > 0) {
    localPlayers = localPlayers.map((player) => {
      const linkedUserId = cloudLinks.get(player.id);
      return linkedUserId ? { ...player, linked_user_id: linkedUserId } : player;
    });
    state.players = mergeById(state.players, localPlayers);
    saveState(state);
  }

  if (localPlayers.length) {
    const { error } = await supabase.from('coach_roster_players').upsert(localPlayers, { onConflict: 'id' });
    if (error) return error.message;
  }
  if (localAttendance.length) {
    const { error } = await supabase.from('coach_attendance_entries').upsert(localAttendance, {
      onConflict: 'coach_id,team_key,roster_player_id,training_date',
    });
    if (error) return error.message;
  }
  if (localNotes.length) {
    const { error } = await supabase.from('coach_workspace_notes').upsert(localNotes, { onConflict: 'id' });
    if (error) return error.message;
  }

  const [playersResult, attendanceResult, notesResult] = await Promise.all([
    supabase.from('coach_roster_players').select('*').eq('coach_id', coachId).eq('team_key', teamKey),
    supabase.from('coach_attendance_entries').select('*').eq('coach_id', coachId).eq('team_key', teamKey),
    supabase.from('coach_workspace_notes').select('*').eq('coach_id', coachId).eq('team_key', teamKey),
  ]);
  const firstError = playersResult.error ?? attendanceResult.error ?? notesResult.error;
  if (firstError) return firstError.message;

  state.players = mergeById(state.players, (playersResult.data ?? []) as CoachRosterPlayer[]);
  state.attendance = mergeById(state.attendance, (attendanceResult.data ?? []) as CoachAttendanceEntry[]);
  state.notes = mergeById(state.notes, (notesResult.data ?? []) as CoachWorkspaceNote[]);
  saveState(state);
  return null;
}

export async function syncCoachWorkspaceForTeam(coachId: string, teamKey: string): Promise<string | null> {
  const keys = teamKey === 'default' ? ['default'] : [teamKey, 'default'];
  for (const key of keys) {
    const error = await syncCoachWorkspace(coachId, key);
    if (error) return error;
  }
  return null;
}
