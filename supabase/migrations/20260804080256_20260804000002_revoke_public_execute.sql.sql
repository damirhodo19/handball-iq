/*
# Fix: Revoke all EXECUTE from PUBLIC on SECURITY DEFINER functions

Postgres grants EXECUTE on all functions to PUBLIC by default.
REVOKE FROM anon, authenticated only removes the role-specific
grants but PUBLIC still allows access. This revokes from PUBLIC
and only the postgres superuser retains access (for internal use
by RLS policies and triggers).
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_coach() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_next_founding_member_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;