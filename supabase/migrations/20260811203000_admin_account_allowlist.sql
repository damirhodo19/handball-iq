/*
  Secure in-app administrator access.

  Admin membership is stored server-side and resolved from the verified email
  claim in the Supabase session. The allowlist itself is never readable from
  the client. Existing app_metadata role=admin accounts remain compatible.
*/

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_accounts (
  email text PRIMARY KEY,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_accounts_normalized_email
    CHECK (email = lower(btrim(email)))
);

ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- No client policies: this table is managed only through trusted SQL/admin tools.
REVOKE ALL ON TABLE public.admin_accounts FROM PUBLIC, anon, authenticated;

INSERT INTO public.admin_accounts (email, active)
VALUES ('damirhodo@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET active = EXCLUDED.active;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    OR EXISTS (
      SELECT 1
      FROM public.admin_accounts account
      WHERE account.email = lower(COALESCE(auth.jwt() ->> 'email', ''))
        AND account.active = true
    );
$$;

-- The app can ask only whether its own verified session is an administrator.
-- It cannot read or enumerate the allowlist.
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.is_admin();
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;

COMMIT;
