/*
  Admin user management.

  Auth emails and account state remain inaccessible through normal table APIs.
  Approved administrators can list users and perform two narrowly-scoped actions
  through SECURITY DEFINER functions. Every mutation is written to an audit log.
*/

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admin_audit_log FROM PUBLIC, anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at
  ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target
  ON public.admin_audit_log(target_user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  display_name text,
  role text,
  primary_position text,
  secondary_position text,
  development_goals text[],
  coach_development_goals text[],
  onboarded boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  last_active_date date,
  blocked boolean,
  is_admin boolean
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
    users.id AS user_id,
    users.email::text,
    profiles.first_name,
    profiles.last_name,
    profiles.display_name,
    COALESCE(profiles.role, 'player')::text AS role,
    profiles.primary_position,
    profiles.secondary_position,
    COALESCE(
      profiles.development_goals,
      CASE WHEN profiles.development_goal IS NOT NULL
        THEN ARRAY[profiles.development_goal]
        ELSE ARRAY[]::text[]
      END
    ) AS development_goals,
    COALESCE(
      profiles.coach_development_goals,
      CASE WHEN profiles.coach_development_goal IS NOT NULL
        THEN ARRAY[profiles.coach_development_goal]
        ELSE ARRAY[]::text[]
      END
    ) AS coach_development_goals,
    COALESCE(profiles.onboarded, false) AS onboarded,
    users.created_at,
    users.last_sign_in_at,
    profiles.last_active_date,
    users.banned_until IS NOT NULL AND users.banned_until > now() AS blocked,
    COALESCE((users.raw_app_meta_data ->> 'role') = 'admin', false)
      OR EXISTS (
        SELECT 1
        FROM public.admin_accounts account
        WHERE account.email = lower(COALESCE(users.email, ''))
          AND account.active = true
      ) AS is_admin
  FROM auth.users users
  LEFT JOIN public.profiles profiles ON profiles.id = users.id
  ORDER BY users.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  target_user_id uuid,
  next_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  previous_role text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  IF next_role NOT IN ('player', 'coach', 'player_coach') THEN
    RAISE EXCEPTION 'Unsupported role' USING ERRCODE = '22023';
  END IF;

  SELECT role INTO previous_role
  FROM public.profiles
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles
  SET role = next_role,
      updated_at = now()
  WHERE id = target_user_id;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (
    auth.uid(),
    'user_role_changed',
    target_user_id,
    jsonb_build_object('previous_role', previous_role, 'next_role', next_role)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_blocked(
  target_user_id uuid,
  should_block boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot block your own account' USING ERRCODE = '22023';
  END IF;

  SELECT lower(email) INTO target_email
  FROM auth.users
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0002';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.admin_accounts
    WHERE email = target_email AND active = true
  ) THEN
    RAISE EXCEPTION 'Administrator accounts cannot be blocked here' USING ERRCODE = '22023';
  END IF;

  UPDATE auth.users
  SET banned_until = CASE
        WHEN should_block THEN now() + interval '100 years'
        ELSE NULL
      END,
      updated_at = now()
  WHERE id = target_user_id;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (
    auth.uid(),
    CASE WHEN should_block THEN 'user_blocked' ELSE 'user_unblocked' END,
    target_user_id,
    jsonb_build_object('email', target_email)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_user_blocked(uuid, boolean) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_blocked(uuid, boolean) TO authenticated;

COMMIT;
