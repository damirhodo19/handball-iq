/*
  Shared in-app notification centre for coaches and players.

  Existing team membership, invitations, RSVP and calendar records remain the
  source of truth. Notifications are append-only delivery records and can be
  marked read without changing the underlying workflow.
*/

BEGIN;

CREATE TABLE IF NOT EXISTS public.app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.team_calendar_events(id) ON DELETE CASCADE,
  notification_kind text NOT NULL CHECK (notification_kind IN (
    'coach_message',
    'join_request',
    'join_approved',
    'join_rejected',
    'team_event_created',
    'event_response',
    'event_reminder'
  )),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_path text CHECK (action_path IS NULL OR char_length(action_path) <= 300),
  dedupe_key text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_notifications_recipient_created
  ON public.app_notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_notifications_recipient_unread
  ON public.app_notifications(recipient_id, created_at DESC)
  WHERE read_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_notifications_dedupe
  ON public.app_notifications(recipient_id, dedupe_key)
  WHERE dedupe_key IS NOT NULL;

ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.app_notifications FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.app_notifications TO authenticated;

DROP POLICY IF EXISTS app_notifications_select_own ON public.app_notifications;
CREATE POLICY app_notifications_select_own ON public.app_notifications
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE OR REPLACE FUNCTION public.list_my_app_notifications(p_limit integer DEFAULT 50)
RETURNS SETOF public.app_notifications
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT notification.*
  FROM public.app_notifications notification
  WHERE notification.recipient_id = auth.uid()
  ORDER BY notification.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
$$;

CREATE OR REPLACE FUNCTION public.get_notification_counts(p_team_id uuid DEFAULT NULL)
RETURNS TABLE (
  unread_notifications integer,
  pending_join_requests integer
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_pending integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_team_id IS NOT NULL
     AND (public.can_manage_team(p_team_id) OR public.is_admin()) THEN
    SELECT count(*)::integer INTO v_pending
    FROM public.team_join_requests request
    WHERE request.team_id = p_team_id
      AND request.status = 'pending';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*)::integer
     FROM public.app_notifications notification
     WHERE notification.recipient_id = auth.uid()
       AND notification.read_at IS NULL),
    v_pending;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_app_notification_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.app_notifications notification
  SET read_at = COALESCE(notification.read_at, now())
  WHERE notification.id = p_notification_id
    AND notification.recipient_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_all_app_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.app_notifications notification
  SET read_at = now()
  WHERE notification.recipient_id = auth.uid()
    AND notification.read_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_team_notification(
  p_team_id uuid,
  p_player_ids uuid[],
  p_kind text,
  p_title text,
  p_message text,
  p_event_id uuid DEFAULT NULL,
  p_action_path text DEFAULT NULL
)
RETURNS TABLE (sent_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sent integer := 0;
BEGIN
  IF NOT public.can_manage_team(p_team_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;
  IF p_kind NOT IN ('coach_message', 'event_reminder') THEN
    RAISE EXCEPTION 'Invalid notification type' USING ERRCODE = '22023';
  END IF;
  IF NULLIF(trim(COALESCE(p_title, '')), '') IS NULL
     OR char_length(p_title) > 160
     OR NULLIF(trim(COALESCE(p_message, '')), '') IS NULL
     OR char_length(p_message) > 1000 THEN
    RAISE EXCEPTION 'Invalid notification content' USING ERRCODE = '22023';
  END IF;
  IF p_event_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.team_calendar_events event
    WHERE event.id = p_event_id AND event.team_id = p_team_id
  ) THEN
    RAISE EXCEPTION 'Event does not belong to team' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, event_id, notification_kind,
    title, message, action_path
  )
  SELECT
    member.user_id,
    auth.uid(),
    p_team_id,
    p_event_id,
    p_kind,
    trim(p_title),
    trim(p_message),
    p_action_path
  FROM public.team_members member
  WHERE member.team_id = p_team_id
    AND member.member_role = 'player'
    AND member.user_id = ANY(COALESCE(p_player_ids, ARRAY[]::uuid[]));

  GET DIAGNOSTICS v_sent = ROW_COUNT;
  RETURN QUERY SELECT v_sent;
END;
$$;

CREATE OR REPLACE FUNCTION public.remind_team_event_nonresponders(
  p_event_id uuid,
  p_title text,
  p_message text
)
RETURNS TABLE (sent_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.team_calendar_events%ROWTYPE;
  v_sent integer := 0;
BEGIN
  SELECT event.* INTO v_event
  FROM public.team_calendar_events event
  WHERE event.id = p_event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found' USING ERRCODE = 'P0002';
  END IF;
  IF NOT public.can_manage_team(v_event.team_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;
  IF v_event.event_status <> 'scheduled' OR NOT v_event.response_required THEN
    RAISE EXCEPTION 'Event is not accepting responses' USING ERRCODE = '22023';
  END IF;
  IF NULLIF(trim(COALESCE(p_title, '')), '') IS NULL
     OR char_length(p_title) > 160
     OR NULLIF(trim(COALESCE(p_message, '')), '') IS NULL
     OR char_length(p_message) > 1000 THEN
    RAISE EXCEPTION 'Invalid notification content' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, event_id, notification_kind,
    title, message, metadata, action_path, dedupe_key
  )
  SELECT
    member.user_id,
    auth.uid(),
    v_event.team_id,
    v_event.id,
    'event_reminder',
    trim(p_title),
    trim(p_message),
    '{}'::jsonb,
    '/team-calendar',
    concat('event-reminder:', v_event.id::text, ':', member.user_id::text, ':', current_date::text)
  FROM public.team_members member
  WHERE member.team_id = v_event.team_id
    AND member.member_role = 'player'
    AND NOT EXISTS (
      SELECT 1
      FROM public.team_event_responses response
      WHERE response.event_id = v_event.id
        AND response.player_id = member.user_id
    )
  ON CONFLICT (recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;

  GET DIAGNOSTICS v_sent = ROW_COUNT;
  RETURN QUERY SELECT v_sent;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_team_join_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_name text;
  v_player_name text;
BEGIN
  IF NEW.status <> 'pending' THEN RETURN NEW; END IF;

  SELECT team.name INTO v_team_name FROM public.teams team WHERE team.id = NEW.team_id;
  SELECT COALESCE(
    NULLIF(trim(profile.display_name), ''),
    NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
    split_part(users.email, '@', 1),
    'Player'
  ) INTO v_player_name
  FROM auth.users users
  LEFT JOIN public.profiles profile ON profile.id = users.id
  WHERE users.id = NEW.player_id;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, notification_kind,
    title, message, metadata, action_path, dedupe_key
  )
  SELECT
    member.user_id,
    NEW.player_id,
    NEW.team_id,
    'join_request',
    'New player request',
    concat(v_player_name, ' wants to join ', v_team_name, '.'),
    jsonb_build_object('playerName', v_player_name, 'teamName', v_team_name),
    '/coach-dashboard/join-requests',
    concat('join-request:', NEW.id::text, ':', member.user_id::text)
  FROM public.team_members member
  WHERE member.team_id = NEW.team_id
    AND member.member_role IN ('head_coach', 'assistant_coach')
  ON CONFLICT (recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO UPDATE
    SET read_at = NULL,
        created_at = now(),
        message = EXCLUDED.message,
        metadata = EXCLUDED.metadata;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS team_join_request_notification ON public.team_join_requests;
CREATE TRIGGER team_join_request_notification
  AFTER INSERT OR UPDATE OF status, requested_at ON public.team_join_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_team_join_request();

CREATE OR REPLACE FUNCTION public.notify_join_request_decision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_name text;
BEGIN
  IF NEW.status NOT IN ('approved', 'rejected') OR NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT team.name INTO v_team_name FROM public.teams team WHERE team.id = NEW.team_id;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, notification_kind,
    title, message, metadata, action_path, dedupe_key
  ) VALUES (
    NEW.player_id,
    NEW.decided_by,
    NEW.team_id,
    CASE WHEN NEW.status = 'approved' THEN 'join_approved' ELSE 'join_rejected' END,
    CASE WHEN NEW.status = 'approved' THEN 'Team request approved' ELSE 'Team request declined' END,
    CASE
      WHEN NEW.status = 'approved' THEN concat('You are now connected with ', v_team_name, '.')
      ELSE concat('Your request to join ', v_team_name, ' was declined.')
    END,
    jsonb_build_object('teamName', v_team_name),
    CASE WHEN NEW.status = 'approved' THEN '/team-calendar' ELSE '/coach-dashboard/join' END,
    concat('join-decision:', NEW.id::text)
  )
  ON CONFLICT (recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO UPDATE
    SET notification_kind = EXCLUDED.notification_kind,
        title = EXCLUDED.title,
        message = EXCLUDED.message,
        metadata = EXCLUDED.metadata,
        action_path = EXCLUDED.action_path,
        read_at = NULL,
        created_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS team_join_decision_notification ON public.team_join_requests;
CREATE TRIGGER team_join_decision_notification
  AFTER UPDATE OF status ON public.team_join_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_join_request_decision();

CREATE OR REPLACE FUNCTION public.notify_team_event_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_name text;
BEGIN
  IF NEW.event_status <> 'scheduled' THEN RETURN NEW; END IF;
  SELECT team.name INTO v_team_name FROM public.teams team WHERE team.id = NEW.team_id;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, event_id, notification_kind,
    title, message, metadata, action_path, dedupe_key
  )
  SELECT
    member.user_id,
    NEW.created_by,
    NEW.team_id,
    NEW.id,
    'team_event_created',
    'New team event',
    concat(NEW.title, ' · ', NEW.event_date::text, COALESCE(' ' || to_char(NEW.event_time, 'HH24:MI'), ''), ' · ', v_team_name),
    jsonb_build_object(
      'eventTitle', NEW.title,
      'eventDate', NEW.event_date::text,
      'eventTime', COALESCE(to_char(NEW.event_time, 'HH24:MI'), ''),
      'teamName', v_team_name
    ),
    '/team-calendar',
    concat('event-created:', NEW.id::text, ':', member.user_id::text)
  FROM public.team_members member
  WHERE member.team_id = NEW.team_id
    AND member.member_role = 'player'
  ON CONFLICT (recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS team_event_created_notification ON public.team_calendar_events;
CREATE TRIGGER team_event_created_notification
  AFTER INSERT ON public.team_calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.notify_team_event_created();

CREATE OR REPLACE FUNCTION public.notify_team_event_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.team_calendar_events%ROWTYPE;
  v_player_name text;
BEGIN
  SELECT event.* INTO v_event
  FROM public.team_calendar_events event
  WHERE event.id = NEW.event_id;

  SELECT COALESCE(
    NULLIF(trim(profile.display_name), ''),
    NULLIF(trim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
    split_part(users.email, '@', 1),
    'Player'
  ) INTO v_player_name
  FROM auth.users users
  LEFT JOIN public.profiles profile ON profile.id = users.id
  WHERE users.id = NEW.player_id;

  INSERT INTO public.app_notifications (
    recipient_id, actor_id, team_id, event_id, notification_kind,
    title, message, metadata, action_path, dedupe_key
  )
  SELECT
    member.user_id,
    NEW.player_id,
    v_event.team_id,
    v_event.id,
    'event_response',
    'Attendance response',
    concat(v_player_name, ' responded ', replace(NEW.response_status, '_', ' '), ' for ', v_event.title, '.'),
    jsonb_build_object(
      'playerName', v_player_name,
      'responseStatus', NEW.response_status,
      'eventTitle', v_event.title
    ),
    '/coach-dashboard/calendar',
    concat('event-response:', NEW.event_id::text, ':', NEW.player_id::text, ':', member.user_id::text)
  FROM public.team_members member
  WHERE member.team_id = v_event.team_id
    AND member.member_role IN ('head_coach', 'assistant_coach')
  ON CONFLICT (recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO UPDATE
    SET message = EXCLUDED.message,
        metadata = EXCLUDED.metadata,
        read_at = NULL,
        created_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS team_event_response_notification ON public.team_event_responses;
CREATE TRIGGER team_event_response_notification
  AFTER INSERT OR UPDATE OF response_status ON public.team_event_responses
  FOR EACH ROW EXECUTE FUNCTION public.notify_team_event_response();

REVOKE EXECUTE ON FUNCTION public.list_my_app_notifications(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_notification_counts(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_app_notification_read(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_all_app_notifications_read() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.send_team_notification(uuid, uuid[], text, text, text, uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.remind_team_event_nonresponders(uuid, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.notify_team_join_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_join_request_decision() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_team_event_created() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_team_event_response() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.list_my_app_notifications(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_notification_counts(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_app_notification_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_app_notifications_read() TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_team_notification(uuid, uuid[], text, text, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remind_team_event_nonresponders(uuid, text, text) TO authenticated;

COMMIT;
