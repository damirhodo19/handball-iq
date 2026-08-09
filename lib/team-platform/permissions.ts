import type { PlatformRole } from './types';
import { PERMISSION_MATRIX } from './types';

export function hasPermission(role: PlatformRole, permission: string): boolean {
  const perms = PERMISSION_MATRIX[role] ?? [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function canManageTeam(role: PlatformRole): boolean {
  return hasPermission(role, 'team.create') || hasPermission(role, 'team.invite');
}

export function canInvitePlayers(role: PlatformRole): boolean {
  return hasPermission(role, 'team.invite');
}

export function canRemovePlayers(role: PlatformRole): boolean {
  return hasPermission(role, 'team.remove');
}

export function canAssignTraining(role: PlatformRole): boolean {
  return hasPermission(role, 'assignment.create');
}

export function canExportReports(role: PlatformRole): boolean {
  return hasPermission(role, 'reports.export');
}

export function canWriteNotes(role: PlatformRole): boolean {
  return hasPermission(role, 'notes.write');
}

export function resolveEffectiveRole(
  clubRole: PlatformRole | null,
  teamRole: string | null,
): PlatformRole {
  if (clubRole === 'admin' || clubRole === 'club_owner') return clubRole;
  if (teamRole === 'head_coach') return 'head_coach';
  if (teamRole === 'assistant_coach') return 'assistant_coach';
  return clubRole ?? 'player';
}

export function isCoachRole(role: PlatformRole): boolean {
  return ['admin', 'club_owner', 'head_coach', 'assistant_coach'].includes(role);
}

export function getCoachPlatformRole(): PlatformRole {
  return 'head_coach';
}
