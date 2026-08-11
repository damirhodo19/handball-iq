/*
  Player/coach team linking.

  Players request access with an invitation code or token. A team manager must
  approve the request before membership is created. Existing private coach
  roster rows can be linked to the authenticated player without moving or
  deleting attendance and notes.
*/

BEGIN;

CREATE TABLE IF NOT EXISTS public.team_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_id uuid REFERENCES public.team_invitations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (team_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_team_join_requests_team_status
  ON public.team_join_requests(team_id, status, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_join_requests_player
  ON public.team_join_requests(player_id, requested_at DESC);

ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.team_join_requests FROM PUBLIC, anon, authenticated;

ALTER TABLE public.coach_roster_players
  ADD COLUMN IF NOT EXISTS linked_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_coach_roster_players_linked_user
  ON public.coach_roster_players(coach_id, team_key, linked_user_id)
  WHERE linked_user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.validate_coach_roster_player_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.linked_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.team_members member
    WHERE member.user_id = NEW.linked_user_id
      AND public.can_manage_team(member.team_id, NEW.coach_id)
      AND (NEW.team_key = 'default' OR member.team_id::text = NEW.team_key)
  ) THEN
    RAISE EXCEPTION 'Linked user must be a player in a team managed by this coach'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS coach_roster_players_validate_link ON public.coach_roster_players;
CREATE TRIGGER coach_roster_players_validate_link
  BEFORE INSERT OR UPDATE OF linked_user_id, coach_id, team_key
  ON public.coach_roster_players
  FOR EACH ROW EXECUTE FUNCTION public.validate_coach_roster_player_link();

/* Direct self-enrolment is no longer allowed. All player joins use the
   request/approval functions below. Team managers can still add members. */
DROP POLICY IF EXISTS "insert_team_members" ON public.team_members;
CREATE POLICY "insert_team_members" ON public.team_members
  FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_team(team_id));

DROP POLICY IF EXISTS team_invitations_accept ON public.team_invitations;

CREATE OR REPLACE FUNCTION public.request_team_join(
  p_code text DEFAULT NULL,
  p_token text DEFAULT NULL
)
RETURNS TABLE (
  request_id uuid,
  team_id uuid,
  team_name text,
  request_status text,
  already_member boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_team public.teams%ROWTYPE;
  v_invitation public.team_invitations%ROWTYPE;
  v_request public.team_join_requests%ROWTYPE;
  v_user_email text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF NULLIF(trim(COALESCE(p_token, '')), '') IS NOT NULL THEN
    SELECT invitation.* INTO v_invitation
    FROM public.team_invitations invitation
    WHERE invitation.invite_token = trim(p_token)
      AND invitation.status = 'pending'
      AND invitation.expires_at > now();

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or expired invitation' USING ERRCODE = '22023';
    END IF;

    IF v_invitation.email IS NOT NULL THEN
      SELECT lower(users.email) INTO v_user_email
      FROM auth.users users
      WHERE users.id = v_user_id;

      IF v_user_email IS DISTINCT FROM lower(v_invitation.email) THEN
        RAISE EXCEPTION 'Invitation belongs to another account' USING ERRCODE = '42501';
      END IF;
    END IF;

    SELECT team.* INTO v_team
    FROM public.teams team
    WHERE team.id = v_invitation.team_id;
  ELSE
    IF NULLIF(trim(COALESCE(p_code, '')), '') IS NULL THEN
      RAISE EXCEPTION 'Invitation code is required' USING ERRCODE = '22023';
    END IF;

    SELECT team.* INTO v_team
    FROM public.teams team
    WHERE upper(team.invitation_code) = upper(trim(p_code));
  END IF;

  IF v_team.id IS NULL THEN
    RAISE EXCEPTION 'Invalid invitation code' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.team_members member
    WHERE member.team_id = v_team.id AND member.user_id = v_user_id
  ) THEN
    RETURN QUERY SELECT NULL::uuid, v_team.id, v_team.name, 'approved'::text, true;
    RETURN;
  END IF;

  INSERT INTO public.team_join_requests (
    team_id,
    player_id,
    invitation_id,
    status,
    requested_at,
    decided_at,
    decided_by
  )
  VALUES (
    v_team.id,
    v_user_id,
    v_invitation.id,
    'pending',
    now(),
    NULL,
    NULL
  )
  ON CONFLICT ON CONSTRAINT team_join_requests_team_id_player_id_key DO UPDATE
    SET invitation_id = COALESCE(EXCLUDED.invitation_id, team_join_requests.invitation_id),
        status = 'pending',
        requested_at = now(),
        decided_at = NULL,
        decided_by = NULL
  RETURNING * INTO v_request;

  RETURN QUERY
  SELECT v_request.id, v_team.id, v_team.name, v_request.status, false;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_my_team_join_requests()
RETURNS TABLE (
  request_id uuid,
  team_id uuid,
  team_name text,
  request_status text,
  requested_at timestamptz,
  decided_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT request.id, request.team_id, team.name, request.status,
         request.requested_at, request.decided_at
  FROM public.team_join_requests request
  JOIN public.teams team ON team.id = request.team_id
  WHERE request.player_id = auth.uid()
  ORDER BY request.requested_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_team_join_requests(
  p_team_id uuid,
  p_status text DEFAULT 'pending'
)
RETURNS TABLE (
  request_id uuid,
  team_id uuid,
  player_id uuid,
  display_name text,
  email text,
  primary_position text,
  secondary_position text,
  request_status text,
  requested_at timestamptz
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

  RETURN QUERY
  SELECT
    request.id,
    request.team_id,
    request.player_id,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    )::text,
    users.email::text,
    profile.primary_position,
    profile.secondary_position,
    request.status,
    request.requested_at
  FROM public.team_join_requests request
  JOIN auth.users users ON users.id = request.player_id
  LEFT JOIN public.profiles profile ON profile.id = request.player_id
  WHERE request.team_id = p_team_id
    AND (p_status IS NULL OR request.status = p_status)
  ORDER BY request.requested_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.decide_team_join_request(
  p_request_id uuid,
  p_approve boolean,
  p_roster_player_id uuid DEFAULT NULL
)
RETURNS TABLE (
  request_id uuid,
  team_id uuid,
  player_id uuid,
  request_status text,
  roster_player_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request public.team_join_requests%ROWTYPE;
  v_roster public.coach_roster_players%ROWTYPE;
  v_display_name text;
  v_position text;
  v_is_team_manager boolean;
BEGIN
  SELECT request.* INTO v_request
  FROM public.team_join_requests request
  WHERE request.id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Join request not found' USING ERRCODE = 'P0002';
  END IF;

  v_is_team_manager := public.can_manage_team(v_request.team_id);
  IF NOT v_is_team_manager AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;

  IF v_request.status <> 'pending' THEN
    RAISE EXCEPTION 'Join request has already been decided' USING ERRCODE = '22023';
  END IF;

  IF p_approve THEN
    INSERT INTO public.team_members (team_id, user_id, member_role)
    VALUES (v_request.team_id, v_request.player_id, 'player')
    ON CONFLICT (team_id, user_id) DO NOTHING;

    UPDATE public.profiles
    SET team_id = v_request.team_id,
        updated_at = now()
    WHERE id = v_request.player_id;

    IF v_request.invitation_id IS NOT NULL THEN
      UPDATE public.team_invitations
      SET status = 'accepted', accepted_by = v_request.player_id
      WHERE id = v_request.invitation_id;
    END IF;

    IF v_is_team_manager THEN
      IF p_roster_player_id IS NOT NULL THEN
        SELECT roster.* INTO v_roster
        FROM public.coach_roster_players roster
        WHERE roster.id = p_roster_player_id
          AND roster.coach_id = auth.uid()
          AND roster.team_key IN (v_request.team_id::text, 'default')
          AND (roster.linked_user_id IS NULL OR roster.linked_user_id = v_request.player_id)
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'Roster player is not available for linking' USING ERRCODE = '22023';
        END IF;

        UPDATE public.coach_roster_players
        SET linked_user_id = v_request.player_id
        WHERE id = v_roster.id
        RETURNING * INTO v_roster;
      ELSE
        SELECT roster.* INTO v_roster
        FROM public.coach_roster_players roster
        WHERE roster.coach_id = auth.uid()
          AND roster.team_key IN (v_request.team_id::text, 'default')
          AND roster.linked_user_id = v_request.player_id
        ORDER BY CASE WHEN roster.team_key = v_request.team_id::text THEN 0 ELSE 1 END
        LIMIT 1;

        IF NOT FOUND THEN
          SELECT
            COALESCE(
              NULLIF(trim(profile.display_name), ''),
              NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
              split_part(users.email, '@', 1),
              'Player'
            )::text,
            COALESCE(profile.primary_position, profile.position)
          INTO v_display_name, v_position
          FROM auth.users users
          LEFT JOIN public.profiles profile ON profile.id = users.id
          WHERE users.id = v_request.player_id;

          INSERT INTO public.coach_roster_players (
            coach_id, team_key, display_name, position, linked_user_id
          )
          VALUES (
            auth.uid(), v_request.team_id::text, v_display_name, v_position, v_request.player_id
          )
          RETURNING * INTO v_roster;
        END IF;
      END IF;
    END IF;
  END IF;

  UPDATE public.team_join_requests
  SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
      decided_at = now(),
      decided_by = auth.uid()
  WHERE id = v_request.id
  RETURNING * INTO v_request;

  RETURN QUERY
  SELECT v_request.id, v_request.team_id, v_request.player_id,
         v_request.status, v_roster.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.team_list_members(p_team_id uuid)
RETURNS TABLE (
  member_id uuid,
  team_id uuid,
  user_id uuid,
  member_role text,
  created_at timestamptz,
  display_name text,
  email text,
  primary_position text,
  secondary_position text,
  decision_score integer,
  total_xp integer,
  streak integer,
  weekly_activity integer,
  improvement integer
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

  RETURN QUERY
  SELECT
    member.id,
    member.team_id,
    member.user_id,
    member.member_role,
    member.created_at,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    )::text,
    users.email::text,
    COALESCE(profile.primary_position, profile.position),
    profile.secondary_position,
    COALESCE(
      NULLIF(development.statistics ->> 'decisionAccuracy', '')::numeric::integer,
      profile.handball_iq_score,
      0
    ),
    COALESCE(development.total_xp, 0),
    COALESCE(profile.streak, 0),
    0,
    COALESCE(NULLIF(development.statistics ->> 'improvementTrend', '')::numeric::integer, 0)
  FROM public.team_members member
  JOIN auth.users users ON users.id = member.user_id
  LEFT JOIN public.profiles profile ON profile.id = member.user_id
  LEFT JOIN public.player_development development ON development.user_id = member.user_id
  WHERE member.team_id = p_team_id
  ORDER BY
    CASE WHEN member.member_role = 'player' THEN 0 ELSE 1 END,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    ) ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_teams()
RETURNS TABLE (
  team_id uuid,
  team_name text,
  club_name text,
  team_category text,
  invitation_code text,
  creator_email text,
  created_at timestamptz,
  member_count integer,
  player_count integer,
  coach_count integer,
  pending_request_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    team.id,
    team.name,
    team.club_name,
    team.team_category,
    team.invitation_code,
    creator.email::text,
    team.created_at,
    count(member.id)::integer,
    (count(member.id) FILTER (WHERE member.member_role = 'player'))::integer,
    (count(member.id) FILTER (WHERE member.member_role IN ('head_coach', 'assistant_coach')))::integer,
    (
      SELECT count(*)::integer
      FROM public.team_join_requests request
      WHERE request.team_id = team.id AND request.status = 'pending'
    )
  FROM public.teams team
  JOIN auth.users creator ON creator.id = team.created_by
  LEFT JOIN public.team_members member ON member.team_id = team.id
  GROUP BY team.id, creator.email
  ORDER BY team.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_team_join(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_my_team_join_requests() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_team_join_requests(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decide_team_join_request(uuid, boolean, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.team_list_members(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_teams() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.validate_coach_roster_player_link() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.request_team_join(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_team_join_requests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_team_join_requests(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decide_team_join_request(uuid, boolean, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.team_list_members(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_teams() TO authenticated;

COMMIT;
