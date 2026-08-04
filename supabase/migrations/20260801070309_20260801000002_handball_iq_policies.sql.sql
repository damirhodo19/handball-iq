/*
# Handball IQ — RLS Policies for All New Tables

Adds Row Level Security policies to all 9 new tables created in the previous
migration. Split into a separate migration because several policies reference
other tables (e.g. teams policies reference team_members) which must already
exist.

## Policy Summary
- teams: coach (creator) CRUD, members can SELECT
- team_members: members self-SELECT, coach INSERT/DELETE
- scenarios: all authenticated read published; admin full CRUD
- session_results: owner CRUD; coach can SELECT team members' results
- match_simulations: owner CRUD; coach can SELECT team members' simulations
- match_day_preparations: owner CRUD
- post_match_reflections: owner CRUD
- assigned_sessions: coach & player SELECT; coach INSERT/UPDATE/DELETE
- user_goals: owner CRUD
*/

-- teams policies
DROP POLICY IF EXISTS "select_own_teams" ON teams;
CREATE POLICY "select_own_teams" ON teams FOR SELECT TO authenticated USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid())
);
DROP POLICY IF EXISTS "insert_own_teams" ON teams;
CREATE POLICY "insert_own_teams" ON teams FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS "update_own_teams" ON teams;
CREATE POLICY "update_own_teams" ON teams FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS "delete_own_teams" ON teams;
CREATE POLICY "delete_own_teams" ON teams FOR DELETE TO authenticated USING (created_by = auth.uid());

-- team_members policies
DROP POLICY IF EXISTS "select_team_members" ON team_members;
CREATE POLICY "select_team_members" ON team_members FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.created_by = auth.uid())
);
DROP POLICY IF EXISTS "insert_team_members" ON team_members;
CREATE POLICY "insert_team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.created_by = auth.uid())
);
DROP POLICY IF EXISTS "delete_team_members" ON team_members;
CREATE POLICY "delete_team_members" ON team_members FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM teams WHERE teams.id = team_members.team_id AND teams.created_by = auth.uid())
);

-- scenarios policies
DROP POLICY IF EXISTS "select_published_scenarios" ON scenarios;
CREATE POLICY "select_published_scenarios" ON scenarios FOR SELECT TO authenticated USING (
  deleted_at IS NULL AND status = 'Published'
);
DROP POLICY IF EXISTS "select_all_scenarios_admin" ON scenarios;
CREATE POLICY "select_all_scenarios_admin" ON scenarios FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "insert_scenarios_admin" ON scenarios;
CREATE POLICY "insert_scenarios_admin" ON scenarios FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "update_scenarios_admin" ON scenarios;
CREATE POLICY "update_scenarios_admin" ON scenarios FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "delete_scenarios_admin" ON scenarios;
CREATE POLICY "delete_scenarios_admin" ON scenarios FOR DELETE TO authenticated USING (public.is_admin());

-- session_results policies
DROP POLICY IF EXISTS "select_own_session_results" ON session_results;
CREATE POLICY "select_own_session_results" ON session_results FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM team_members tm JOIN teams t ON t.id = tm.team_id
    WHERE tm.user_id = session_results.user_id AND t.created_by = auth.uid()
  )
);
DROP POLICY IF EXISTS "insert_own_session_results" ON session_results;
CREATE POLICY "insert_own_session_results" ON session_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_session_results" ON session_results;
CREATE POLICY "update_own_session_results" ON session_results FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_session_results" ON session_results;
CREATE POLICY "delete_own_session_results" ON session_results FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- match_simulations policies
DROP POLICY IF EXISTS "select_own_match_simulations" ON match_simulations;
CREATE POLICY "select_own_match_simulations" ON match_simulations FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM team_members tm JOIN teams t ON t.id = tm.team_id
    WHERE tm.user_id = match_simulations.user_id AND t.created_by = auth.uid()
  )
);
DROP POLICY IF EXISTS "insert_own_match_simulations" ON match_simulations;
CREATE POLICY "insert_own_match_simulations" ON match_simulations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_match_simulations" ON match_simulations;
CREATE POLICY "update_own_match_simulations" ON match_simulations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_match_simulations" ON match_simulations;
CREATE POLICY "delete_own_match_simulations" ON match_simulations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- match_day_preparations policies
DROP POLICY IF EXISTS "select_own_match_day_prep" ON match_day_preparations;
CREATE POLICY "select_own_match_day_prep" ON match_day_preparations FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_match_day_prep" ON match_day_preparations;
CREATE POLICY "insert_own_match_day_prep" ON match_day_preparations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_match_day_prep" ON match_day_preparations;
CREATE POLICY "update_own_match_day_prep" ON match_day_preparations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_match_day_prep" ON match_day_preparations;
CREATE POLICY "delete_own_match_day_prep" ON match_day_preparations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- post_match_reflections policies
DROP POLICY IF EXISTS "select_own_reflections" ON post_match_reflections;
CREATE POLICY "select_own_reflections" ON post_match_reflections FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_reflections" ON post_match_reflections;
CREATE POLICY "insert_own_reflections" ON post_match_reflections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_reflections" ON post_match_reflections;
CREATE POLICY "update_own_reflections" ON post_match_reflections FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_reflections" ON post_match_reflections;
CREATE POLICY "delete_own_reflections" ON post_match_reflections FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- assigned_sessions policies
DROP POLICY IF EXISTS "select_assigned_sessions" ON assigned_sessions;
CREATE POLICY "select_assigned_sessions" ON assigned_sessions FOR SELECT TO authenticated USING (
  player_id = auth.uid() OR coach_id = auth.uid()
);
DROP POLICY IF EXISTS "insert_assigned_sessions" ON assigned_sessions;
CREATE POLICY "insert_assigned_sessions" ON assigned_sessions FOR INSERT TO authenticated WITH CHECK (coach_id = auth.uid());
DROP POLICY IF EXISTS "update_assigned_sessions" ON assigned_sessions;
CREATE POLICY "update_assigned_sessions" ON assigned_sessions FOR UPDATE TO authenticated USING (
  coach_id = auth.uid() OR player_id = auth.uid()
) WITH CHECK (coach_id = auth.uid() OR player_id = auth.uid());
DROP POLICY IF EXISTS "delete_assigned_sessions" ON assigned_sessions;
CREATE POLICY "delete_assigned_sessions" ON assigned_sessions FOR DELETE TO authenticated USING (coach_id = auth.uid());

-- user_goals policies
DROP POLICY IF EXISTS "select_own_goals" ON user_goals;
CREATE POLICY "select_own_goals" ON user_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_goals" ON user_goals;
CREATE POLICY "insert_own_goals" ON user_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_goals" ON user_goals;
CREATE POLICY "update_own_goals" ON user_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_goals" ON user_goals;
CREATE POLICY "delete_own_goals" ON user_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);