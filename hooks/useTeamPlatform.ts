import { useCallback, useEffect, useState } from 'react';
import type { TeamRecord, TeamDashboardStats, TeamMemberRecord, PlatformRole } from '@/lib/team-platform/types';
import {
  getActiveTeam,
  setActiveTeam,
  initCoachPlatform,
} from '@/lib/team-platform/platform';
import { localFetchTeams, localFetchMembers } from '@/lib/team-platform/storage';
import { computeTeamDashboard } from '@/lib/team-platform/reports';
import { getCoachPlatformRole, isCoachRole } from '@/lib/team-platform/permissions';

export function useTeamPlatform(userId?: string, userName?: string) {
  const [team, setTeam] = useState<TeamRecord | null>(null);
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [stats, setStats] = useState<TeamDashboardStats | null>(null);
  const role: PlatformRole = getCoachPlatformRole();

  const refresh = useCallback(() => {
    const active = getActiveTeam();
    setTeam(active);
    setTeams(localFetchTeams());
    if (active) {
      const m = localFetchMembers(active.id);
      setMembers(m);
      setStats(computeTeamDashboard(active.id));
    } else {
      setMembers([]);
      setStats(null);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const init = useCallback(async () => {
    if (!userId) return null;
    const t = await initCoachPlatform(userId, userName ?? 'Coach');
    refresh();
    return t;
  }, [userId, userName, refresh]);

  const selectTeam = useCallback((teamId: string) => {
    setActiveTeam(teamId);
    refresh();
  }, [refresh]);

  return {
    team,
    teams,
    members,
    stats,
    role,
    isCoach: isCoachRole(role),
    refresh,
    init,
    selectTeam,
  };
}

export type { TeamRecord, TeamDashboardStats, TeamMemberRecord, PlatformRole };
