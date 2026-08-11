import { useCallback, useEffect, useState } from 'react';
import type { TeamRecord, TeamDashboardStats, TeamMemberRecord, PlatformRole } from '@/lib/team-platform/types';
import {
  getActiveTeam,
  setActiveTeam,
  initCoachPlatform,
  fetchTeams,
  fetchTeamMembers,
} from '@/lib/team-platform/platform';
import { computeTeamDashboardFromMembers } from '@/lib/team-platform/reports';
import { getCoachPlatformRole, isCoachRole } from '@/lib/team-platform/permissions';

export function useTeamPlatform(userId?: string, userName?: string) {
  const [team, setTeam] = useState<TeamRecord | null>(null);
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [stats, setStats] = useState<TeamDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const role: PlatformRole = getCoachPlatformRole();

  const refresh = useCallback(async () => {
    setLoading(true);
    const availableTeams = await fetchTeams();
    const active = getActiveTeam() ?? availableTeams[0] ?? null;
    setTeam(active);
    setTeams(availableTeams);
    if (!active) {
      setMembers([]);
      setStats(null);
      setLoading(false);
      return;
    }
    const loadedMembers = await fetchTeamMembers(active.id);
    setMembers(loadedMembers);
    setStats(computeTeamDashboardFromMembers(loadedMembers));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const init = useCallback(async () => {
    if (!userId) return null;
    const t = await initCoachPlatform(userId, userName ?? 'Coach');
    await refresh();
    return t;
  }, [userId, userName, refresh]);

  const selectTeam = useCallback(async (teamId: string) => {
    setActiveTeam(teamId);
    await refresh();
  }, [refresh]);

  return {
    team,
    teams,
    members,
    stats,
    loading,
    role,
    isCoach: isCoachRole(role),
    refresh,
    init,
    selectTeam,
  };
}

export type { TeamRecord, TeamDashboardStats, TeamMemberRecord, PlatformRole };
