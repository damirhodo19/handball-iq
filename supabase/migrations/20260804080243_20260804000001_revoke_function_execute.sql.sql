/*
# Fix: Revoke EXECUTE on SECURITY DEFINER helper functions

The Supabase linter flagged that is_admin(), is_coach(),
get_next_founding_member_number(), and handle_new_user() are callable
by anon and authenticated roles via the REST API. These functions are
only meant to be used internally by RLS policies and triggers, not
called directly by clients.

This migration revokes EXECUTE from anon and authenticated for all
four functions. They will still work inside RLS policy predicates
and trigger bodies because those run with the function's
SECURITY DEFINER privilege.
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_coach() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_next_founding_member_number() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;