/*
# Fix infinite RLS recursion between teams and team_members

The circular SELECT policies on teams ↔ team_members caused
"infinite recursion detected in policy for relation team_members"
when session_results INSERT ... RETURNING evaluated the coach-access
branch of select_own_session_results.

Uses SECURITY DEFINER helpers so policy checks bypass RLS on the
underlying tables.
*/

CREATE OR REPLACE FUNCTION public.is_team_coach(_team_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = _team_id AND created_by = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_team_member(_team_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = _team_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_coach_of_user(_player_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = _player_id
      AND public.is_team_coach(tm.team_id)
  );
$$;

-- Internal RLS helpers only — not callable via REST API (matches is_admin/is_coach pattern)
REVOKE EXECUTE ON FUNCTION public.is_team_coach(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_coach_of_user(uuid) FROM PUBLIC, anon, authenticated;

-- teams: break team_members subquery recursion
DROP POLICY IF EXISTS "select_own_teams" ON teams;
CREATE POLICY "select_own_teams" ON teams FOR SELECT TO authenticated USING (
  created_by = auth.uid()
  OR public.is_team_member(id)
);

-- team_members: break teams subquery recursion
DROP POLICY IF EXISTS "select_team_members" ON team_members;
CREATE POLICY "select_team_members" ON team_members FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR public.is_team_coach(team_id)
);

DROP POLICY IF EXISTS "insert_team_members" ON team_members;
CREATE POLICY "insert_team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
  OR public.is_team_coach(team_id)
);

DROP POLICY IF EXISTS "delete_team_members" ON team_members;
CREATE POLICY "delete_team_members" ON team_members FOR DELETE TO authenticated USING (
  public.is_team_coach(team_id)
);

-- session_results / match_simulations: coach access without joining under RLS
DROP POLICY IF EXISTS "select_own_session_results" ON session_results;
CREATE POLICY "select_own_session_results" ON session_results FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR public.is_coach_of_user(user_id)
);

DROP POLICY IF EXISTS "select_own_match_simulations" ON match_simulations;
CREATE POLICY "select_own_match_simulations" ON match_simulations FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR public.is_coach_of_user(user_id)
);
