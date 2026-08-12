/*
  Storage upserts evaluate both the owner write policy and the read policy.
  Use the client-safe admin wrapper in the read policy because direct execute
  access to is_admin() is intentionally revoked from authenticated users.
*/
BEGIN;

DROP POLICY IF EXISTS avatar_team_read ON storage.objects;
CREATE POLICY avatar_team_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1
        FROM public.team_members target
        JOIN public.team_members viewer ON viewer.team_id = target.team_id
        WHERE target.user_id::text = (storage.foldername(name))[1]
          AND viewer.user_id = auth.uid()
      )
      OR public.current_user_is_admin()
    )
  );

COMMIT;
