/*
  Private coach workspace: manual roster, per-training attendance, and notes.
  This is intentionally separate from authenticated team_members so a coach can
  track players who do not yet have a Handball IQ account.
*/

CREATE TABLE IF NOT EXISTS public.coach_roster_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_key text NOT NULL DEFAULT 'default',
  display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 1 AND 120),
  position text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_roster_players_scope
  ON public.coach_roster_players(coach_id, team_key, display_name);

CREATE TABLE IF NOT EXISTS public.coach_attendance_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_key text NOT NULL DEFAULT 'default',
  roster_player_id uuid NOT NULL REFERENCES public.coach_roster_players(id) ON DELETE CASCADE,
  training_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coach_id, team_key, roster_player_id, training_date)
);

CREATE INDEX IF NOT EXISTS idx_coach_attendance_scope_date
  ON public.coach_attendance_entries(coach_id, team_key, training_date);

CREATE TABLE IF NOT EXISTS public.coach_workspace_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_key text NOT NULL DEFAULT 'default',
  roster_player_id uuid REFERENCES public.coach_roster_players(id) ON DELETE CASCADE,
  note_type text NOT NULL DEFAULT 'general'
    CHECK (note_type IN ('training', 'injury', 'mental', 'general')),
  content text NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_workspace_notes_scope
  ON public.coach_workspace_notes(coach_id, team_key, created_at DESC);

ALTER TABLE public.coach_roster_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_attendance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_workspace_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coach_roster_players_owner ON public.coach_roster_players;
CREATE POLICY coach_roster_players_owner ON public.coach_roster_players
  FOR ALL TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

DROP POLICY IF EXISTS coach_attendance_entries_owner ON public.coach_attendance_entries;
CREATE POLICY coach_attendance_entries_owner ON public.coach_attendance_entries
  FOR ALL TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (
    coach_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.coach_roster_players player
      WHERE player.id = roster_player_id
        AND player.coach_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS coach_workspace_notes_owner ON public.coach_workspace_notes;
CREATE POLICY coach_workspace_notes_owner ON public.coach_workspace_notes
  FOR ALL TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (
    coach_id = auth.uid()
    AND (
      roster_player_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.coach_roster_players player
        WHERE player.id = roster_player_id
          AND player.coach_id = auth.uid()
      )
    )
  );

REVOKE ALL ON public.coach_roster_players FROM anon;
REVOKE ALL ON public.coach_attendance_entries FROM anon;
REVOKE ALL ON public.coach_workspace_notes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_roster_players TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_attendance_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coach_workspace_notes TO authenticated;

DROP TRIGGER IF EXISTS coach_roster_players_updated_at ON public.coach_roster_players;
CREATE TRIGGER coach_roster_players_updated_at
  BEFORE UPDATE ON public.coach_roster_players
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS coach_attendance_entries_updated_at ON public.coach_attendance_entries;
CREATE TRIGGER coach_attendance_entries_updated_at
  BEFORE UPDATE ON public.coach_attendance_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS coach_workspace_notes_updated_at ON public.coach_workspace_notes;
CREATE TRIGGER coach_workspace_notes_updated_at
  BEFORE UPDATE ON public.coach_workspace_notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

