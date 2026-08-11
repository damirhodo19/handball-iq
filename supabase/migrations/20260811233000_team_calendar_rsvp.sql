/*
  Team calendar and RSVP workflow.

  Extends the existing team_calendar_events table without replacing or deleting
  old events. Players can respond only for themselves, coaches can see team
  responses, and a coach can convert confirmed responses into the existing
  private attendance workspace without losing manual roster history.
*/

BEGIN;

ALTER TABLE public.team_calendar_events
  ADD COLUMN IF NOT EXISTS event_time time without time zone,
  ADD COLUMN IF NOT EXISTS end_time time without time zone,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS response_required boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS event_status text NOT NULL DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.team_calendar_events
SET response_required = false
WHERE event_type IN ('assigned_session', 'completed_session')
  AND response_required = true;

ALTER TABLE public.team_calendar_events
  DROP CONSTRAINT IF EXISTS team_calendar_events_event_status_check;
ALTER TABLE public.team_calendar_events
  ADD CONSTRAINT team_calendar_events_event_status_check
  CHECK (event_status IN ('scheduled', 'completed', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_team_calendar_status_date
  ON public.team_calendar_events(team_id, event_status, event_date, event_time);

DROP TRIGGER IF EXISTS team_calendar_events_updated_at ON public.team_calendar_events;
CREATE TRIGGER team_calendar_events_updated_at
  BEFORE UPDATE ON public.team_calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.team_event_responses (
  event_id uuid NOT NULL REFERENCES public.team_calendar_events(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_status text NOT NULL
    CHECK (response_status IN ('attending', 'not_attending', 'maybe')),
  note text CHECK (note IS NULL OR char_length(note) <= 500),
  responded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_team_event_responses_player
  ON public.team_event_responses(player_id, responded_at DESC);

ALTER TABLE public.team_event_responses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.team_event_responses FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.team_event_responses TO authenticated;

DROP POLICY IF EXISTS team_event_responses_select ON public.team_event_responses;
CREATE POLICY team_event_responses_select ON public.team_event_responses
  FOR SELECT TO authenticated
  USING (
    player_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.team_calendar_events event
      WHERE event.id = event_id
        AND public.can_manage_team(event.team_id)
    )
  );

DROP POLICY IF EXISTS team_event_responses_insert_own ON public.team_event_responses;
CREATE POLICY team_event_responses_insert_own ON public.team_event_responses
  FOR INSERT TO authenticated
  WITH CHECK (
    player_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.team_calendar_events event
      WHERE event.id = event_id
        AND event.event_status = 'scheduled'
        AND event.response_required = true
        AND public.is_team_member(event.team_id)
    )
  );

DROP POLICY IF EXISTS team_event_responses_update_own ON public.team_event_responses;
CREATE POLICY team_event_responses_update_own ON public.team_event_responses
  FOR UPDATE TO authenticated
  USING (player_id = auth.uid())
  WITH CHECK (
    player_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.team_calendar_events event
      WHERE event.id = event_id
        AND event.event_status = 'scheduled'
        AND event.response_required = true
        AND public.is_team_member(event.team_id)
    )
  );

DROP POLICY IF EXISTS team_event_responses_delete_own ON public.team_event_responses;
CREATE POLICY team_event_responses_delete_own ON public.team_event_responses
  FOR DELETE TO authenticated
  USING (player_id = auth.uid());

CREATE OR REPLACE FUNCTION public.list_team_calendar(
  p_team_id uuid,
  p_from_date date DEFAULT NULL,
  p_to_date date DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  team_id uuid,
  event_type text,
  event_date date,
  event_time time without time zone,
  end_time time without time zone,
  title text,
  description text,
  location text,
  response_required boolean,
  event_status text,
  player_id uuid,
  assignment_id uuid,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  attending_count integer,
  not_attending_count integer,
  maybe_count integer,
  my_response text
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

  IF NOT public.is_team_member(p_team_id)
     AND NOT public.can_manage_team(p_team_id)
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team access required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    event.id,
    event.team_id,
    event.event_type,
    event.event_date,
    event.event_time,
    event.end_time,
    event.title,
    event.description,
    event.location,
    event.response_required,
    event.event_status,
    event.player_id,
    event.assignment_id,
    event.created_by,
    event.created_at,
    event.updated_at,
    (count(response.player_id) FILTER (WHERE response.response_status = 'attending'))::integer,
    (count(response.player_id) FILTER (WHERE response.response_status = 'not_attending'))::integer,
    (count(response.player_id) FILTER (WHERE response.response_status = 'maybe'))::integer,
    max(response.response_status) FILTER (WHERE response.player_id = auth.uid())::text
  FROM public.team_calendar_events event
  LEFT JOIN public.team_event_responses response ON response.event_id = event.id
  WHERE event.team_id = p_team_id
    AND (p_from_date IS NULL OR event.event_date >= p_from_date)
    AND (p_to_date IS NULL OR event.event_date <= p_to_date)
  GROUP BY event.id
  ORDER BY event.event_date ASC, event.event_time ASC NULLS LAST, event.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.respond_to_team_event(
  p_event_id uuid,
  p_response_status text,
  p_note text DEFAULT NULL
)
RETURNS TABLE (
  event_id uuid,
  player_id uuid,
  display_name text,
  email text,
  response_status text,
  note text,
  responded_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.team_calendar_events%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  IF p_response_status NOT IN ('attending', 'not_attending', 'maybe') THEN
    RAISE EXCEPTION 'Invalid response status' USING ERRCODE = '22023';
  END IF;
  IF p_note IS NOT NULL AND char_length(p_note) > 500 THEN
    RAISE EXCEPTION 'Response note is too long' USING ERRCODE = '22001';
  END IF;

  SELECT * INTO v_event
  FROM public.team_calendar_events event
  WHERE event.id = p_event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_event.event_status <> 'scheduled' OR NOT v_event.response_required THEN
    RAISE EXCEPTION 'This event is not accepting responses' USING ERRCODE = '22023';
  END IF;
  IF NOT public.is_team_member(v_event.team_id) THEN
    RAISE EXCEPTION 'Team membership required' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.team_event_responses AS response (
    event_id,
    player_id,
    response_status,
    note,
    responded_at
  ) VALUES (
    p_event_id,
    auth.uid(),
    p_response_status,
    NULLIF(trim(p_note), ''),
    now()
  )
  ON CONFLICT ON CONSTRAINT team_event_responses_pkey DO UPDATE
    SET response_status = EXCLUDED.response_status,
        note = EXCLUDED.note,
        responded_at = EXCLUDED.responded_at;

  RETURN QUERY
  SELECT
    response.event_id,
    response.player_id,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    )::text,
    users.email::text,
    response.response_status,
    response.note,
    response.responded_at
  FROM public.team_event_responses response
  JOIN auth.users users ON users.id = response.player_id
  LEFT JOIN public.profiles profile ON profile.id = response.player_id
  WHERE response.event_id = p_event_id
    AND response.player_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.list_team_event_responses(p_event_id uuid)
RETURNS TABLE (
  event_id uuid,
  player_id uuid,
  display_name text,
  email text,
  response_status text,
  note text,
  responded_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_team_id uuid;
BEGIN
  SELECT event.team_id INTO v_team_id
  FROM public.team_calendar_events event
  WHERE event.id = p_event_id;

  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;
  IF NOT public.can_manage_team(v_team_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    response.event_id,
    response.player_id,
    COALESCE(
      NULLIF(trim(profile.display_name), ''),
      NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
      split_part(users.email, '@', 1),
      'Player'
    )::text,
    users.email::text,
    response.response_status,
    response.note,
    response.responded_at
  FROM public.team_event_responses response
  JOIN auth.users users ON users.id = response.player_id
  LEFT JOIN public.profiles profile ON profile.id = response.player_id
  WHERE response.event_id = p_event_id
  ORDER BY response.responded_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_team_event_attendance(p_event_id uuid)
RETURNS TABLE (
  event_id uuid,
  event_date date,
  present_count integer,
  absent_count integer,
  skipped_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.team_calendar_events%ROWTYPE;
  v_present integer := 0;
  v_absent integer := 0;
  v_eligible integer := 0;
  v_synced integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_event
  FROM public.team_calendar_events event
  WHERE event.id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;
  IF NOT public.can_manage_team(v_event.team_id) THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;
  IF v_event.event_type NOT IN ('training', 'match') THEN
    RAISE EXCEPTION 'Attendance can be finalized only for training or match events' USING ERRCODE = '22023';
  END IF;

  SELECT
    (count(*) FILTER (WHERE response.response_status = 'attending'))::integer,
    (count(*) FILTER (WHERE response.response_status = 'not_attending'))::integer,
    (count(*) FILTER (WHERE response.response_status IN ('attending', 'not_attending')))::integer
  INTO v_present, v_absent, v_eligible
  FROM public.team_event_responses response
  WHERE response.event_id = p_event_id;

  INSERT INTO public.coach_attendance_entries (
    coach_id,
    team_key,
    roster_player_id,
    training_date,
    status
  )
  SELECT
    auth.uid(),
    roster.team_key,
    roster.id,
    v_event.event_date,
    CASE
      WHEN response.response_status = 'attending' THEN 'present'
      ELSE 'absent'
    END
  FROM public.team_event_responses response
  JOIN LATERAL (
    SELECT player.id, player.team_key
    FROM public.coach_roster_players player
    WHERE player.coach_id = auth.uid()
      AND player.linked_user_id = response.player_id
      AND player.team_key IN (v_event.team_id::text, 'default')
    ORDER BY CASE WHEN player.team_key = v_event.team_id::text THEN 0 ELSE 1 END
    LIMIT 1
  ) roster ON true
  WHERE response.event_id = p_event_id
    AND response.response_status IN ('attending', 'not_attending')
  ON CONFLICT (coach_id, team_key, roster_player_id, training_date) DO UPDATE
    SET status = EXCLUDED.status,
        updated_at = now();

  GET DIAGNOSTICS v_synced = ROW_COUNT;

  UPDATE public.team_calendar_events event
  SET event_status = 'completed', updated_at = now()
  WHERE event.id = p_event_id;

  RETURN QUERY
  SELECT
    p_event_id,
    v_event.event_date,
    v_present,
    v_absent,
    GREATEST(v_eligible - v_synced, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.list_team_calendar(uuid, date, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.respond_to_team_event(uuid, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_team_event_responses(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.finalize_team_event_attendance(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.list_team_calendar(uuid, date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_to_team_event(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_team_event_responses(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_team_event_attendance(uuid) TO authenticated;

COMMIT;
