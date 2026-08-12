/* Private profile avatars with owner-only writes and team-scoped reads. */
BEGIN;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS avatar_team_read ON storage.objects;
CREATE POLICY avatar_team_read ON storage.objects FOR SELECT TO authenticated USING (
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
    OR public.is_admin()
  )
);
DROP POLICY IF EXISTS avatar_owner_insert ON storage.objects;
CREATE POLICY avatar_owner_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS avatar_owner_update ON storage.objects;
CREATE POLICY avatar_owner_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS avatar_owner_delete ON storage.objects;
CREATE POLICY avatar_owner_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE OR REPLACE FUNCTION public.list_team_member_avatars(p_team_id uuid)
RETURNS TABLE (user_id uuid, avatar_url text)
LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public AS $$
BEGIN
  IF NOT public.can_manage_team(p_team_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Team manager access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT member.user_id, profile.avatar_url
  FROM public.team_members member
  LEFT JOIN public.profiles profile ON profile.id = member.user_id
  WHERE member.team_id = p_team_id AND member.member_role = 'player';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.list_team_member_avatars(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_team_member_avatars(uuid) TO authenticated;
COMMIT;
