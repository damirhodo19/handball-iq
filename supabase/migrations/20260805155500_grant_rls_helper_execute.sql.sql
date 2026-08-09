/*
# Grant EXECUTE on RLS helper functions to authenticated

The recursion-fix helpers (is_team_coach, is_team_member, is_coach_of_user)
are SECURITY DEFINER and used only in RLS policy expressions. PostgreSQL
still requires the querying role to hold EXECUTE on functions referenced
in those expressions.

REVOKE FROM PUBLIC and anon remains — unauthenticated RPC access is blocked.
RLS policy definitions are unchanged.
*/

GRANT EXECUTE ON FUNCTION public.is_team_coach(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_coach_of_user(uuid) TO authenticated;
