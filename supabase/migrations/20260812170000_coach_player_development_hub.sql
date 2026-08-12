/*
  Unified coach player development hub.
  Coaches can set up to three active individual goals and read a safe aggregate
  of development activity for players in teams they manage.
*/

BEGIN;

CREATE TABLE IF NOT EXISTS public.coach_player_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 160),
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_player_goals_player
  ON public.coach_player_goals(team_id, player_id, status, created_at DESC);

ALTER TABLE public.coach_player_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coach_player_goals_select ON public.coach_player_goals;
CREATE POLICY coach_player_goals_select ON public.coach_player_goals
  FOR SELECT TO authenticated
  USING (
    player_id = auth.uid()
    OR public.can_manage_team(team_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS coach_player_goals_insert ON public.coach_player_goals;
CREATE POLICY coach_player_goals_insert ON public.coach_player_goals
  FOR INSERT TO authenticated
  WITH CHECK (
    coach_id = auth.uid()
    AND public.can_manage_team(team_id)
    AND EXISTS (
      SELECT 1 FROM public.team_members member
      WHERE member.team_id = coach_player_goals.team_id
        AND member.user_id = coach_player_goals.player_id
        AND member.member_role = 'player'
    )
  );

DROP POLICY IF EXISTS coach_player_goals_update ON public.coach_player_goals;
CREATE POLICY coach_player_goals_update ON public.coach_player_goals
  FOR UPDATE TO authenticated
  USING (coach_id = auth.uid() AND public.can_manage_team(team_id))
  WITH CHECK (coach_id = auth.uid() AND public.can_manage_team(team_id));

DROP POLICY IF EXISTS coach_player_goals_delete ON public.coach_player_goals;
CREATE POLICY coach_player_goals_delete ON public.coach_player_goals
  FOR DELETE TO authenticated
  USING (coach_id = auth.uid() AND public.can_manage_team(team_id));

CREATE OR REPLACE FUNCTION public.enforce_three_active_coach_player_goals()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' AND (
    SELECT count(*)
    FROM public.coach_player_goals goal
    WHERE goal.team_id = NEW.team_id
      AND goal.player_id = NEW.player_id
      AND goal.status = 'active'
      AND goal.id IS DISTINCT FROM NEW.id
  ) >= 3 THEN
    RAISE EXCEPTION 'A player can have at most three active coach goals'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS coach_player_goals_limit_active ON public.coach_player_goals;
CREATE TRIGGER coach_player_goals_limit_active
  BEFORE INSERT OR UPDATE OF status, team_id, player_id
  ON public.coach_player_goals
  FOR EACH ROW EXECUTE FUNCTION public.enforce_three_active_coach_player_goals();

DROP TRIGGER IF EXISTS coach_player_goals_updated_at ON public.coach_player_goals;
CREATE TRIGGER coach_player_goals_updated_at
  BEFORE UPDATE ON public.coach_player_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.get_coach_player_overview(
  p_team_id uuid,
  p_player_id uuid
)
RETURNS TABLE (
  player_id uuid,
  display_name text,
  primary_position text,
  secondary_position text,
  playing_level text,
  development_goals text[],
  total_xp integer,
  player_level text,
  completed_sessions integer,
  average_decision_score integer,
  average_mental_readiness integer,
  average_pressure_control integer,
  last_session_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF NOT public.can_manage_team(p_team_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.team_members member
    WHERE member.team_id = p_team_id
      AND member.user_id = p_player_id
      AND member.member_role = 'player'
  ) THEN
    RAISE EXCEPTION 'Player is not a member of this team' USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  SELECT
    p_player_id,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    )::text,
    COALESCE(profile.primary_position, profile.position)::text,
    profile.secondary_position::text,
    profile.playing_level::text,
    COALESCE(
      profile.development_goals,
      CASE WHEN profile.development_goal IS NOT NULL THEN ARRAY[profile.development_goal] ELSE ARRAY[]::text[] END
    ),
    COALESCE(development.total_xp, 0),
    COALESCE(development.player_level, 'Beginner')::text,
    count(result.id)::integer,
    COALESCE(round(avg(result.decision_score)), 0)::integer,
    COALESCE(round(avg(result.mental_readiness)), 0)::integer,
    COALESCE(round(avg(result.pressure_control)), 0)::integer,
    max(result.completed_at)
  FROM auth.users users
  LEFT JOIN public.profiles profile ON profile.id = users.id
  LEFT JOIN public.player_development development ON development.user_id = users.id
  LEFT JOIN public.session_results result ON result.user_id = users.id
  WHERE users.id = p_player_id
  GROUP BY users.id, users.email, profile.id, development.id;
END;
$$;

REVOKE ALL ON TABLE public.coach_player_goals FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.coach_player_goals TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_coach_player_overview(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_coach_player_overview(uuid, uuid) TO authenticated;

COMMIT;
