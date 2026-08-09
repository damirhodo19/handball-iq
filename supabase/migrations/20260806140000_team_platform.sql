/*
  Team & Coach Platform — clubs, teams, invitations, notes, calendar, permissions.
*/

-- ─── Clubs ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  league text,
  season text,
  logo_url text,
  description text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_clubs_owner ON clubs(owner_id);

-- ─── Club members (platform roles) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'player'
    CHECK (role IN ('admin', 'club_owner', 'head_coach', 'assistant_coach', 'player')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, user_id)
);
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_club_members_club ON club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);

-- ─── Extend teams ────────────────────────────────────────────────────────────
ALTER TABLE teams ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES clubs(id) ON DELETE SET NULL;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_category text;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS season text;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS description text;
CREATE INDEX IF NOT EXISTS idx_teams_club ON teams(club_id);

-- Expand member_role values on team_members
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_member_role_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_member_role_check
  CHECK (member_role IN ('player', 'head_coach', 'assistant_coach'));

-- ─── Team invitations ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  invite_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);

-- ─── Coach notes (private per player) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coach_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type text NOT NULL DEFAULT 'training'
    CHECK (note_type IN ('training', 'injury', 'mental', 'general')),
  content text NOT NULL,
  is_private boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE coach_notes ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_coach_notes_player ON coach_notes(player_id, team_id);

-- ─── Team calendar ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('training', 'match', 'assigned_session', 'completed_session', 'recovery')),
  event_date date NOT NULL,
  title text NOT NULL,
  description text,
  player_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assignment_id uuid,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE team_calendar_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_team_calendar_team_date ON team_calendar_events(team_id, event_date);

-- ─── Team attendance ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'excused')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, player_id, event_date)
);
ALTER TABLE team_attendance ENABLE ROW LEVEL SECURITY;

-- ─── Extend assigned_sessions ─────────────────────────────────────────────────
ALTER TABLE assigned_sessions ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE assigned_sessions ADD COLUMN IF NOT EXISTS difficulty text;
ALTER TABLE assigned_sessions ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE assigned_sessions ADD COLUMN IF NOT EXISTS scenario_count integer DEFAULT 5;
ALTER TABLE assigned_sessions ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- ─── RLS helper functions ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_club_member(p_club_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = p_club_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_club_coach(p_club_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = p_club_id AND user_id = p_user_id
      AND role IN ('admin', 'club_owner', 'head_coach', 'assistant_coach')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_club_owner_or_admin(p_club_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = p_club_id AND user_id = p_user_id
      AND role IN ('admin', 'club_owner')
  )
  OR EXISTS (SELECT 1 FROM clubs WHERE id = p_club_id AND owner_id = p_user_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_team(p_team_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = p_team_id AND t.created_by = p_user_id
  )
  OR EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = p_team_id AND tm.user_id = p_user_id
      AND tm.member_role IN ('head_coach', 'assistant_coach')
  )
  OR EXISTS (
    SELECT 1 FROM teams t
    JOIN club_members cm ON cm.club_id = t.club_id
    WHERE t.id = p_team_id AND cm.user_id = p_user_id
      AND cm.role IN ('admin', 'club_owner', 'head_coach')
  );
$$;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  -- Clubs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'clubs_select_member' AND tablename = 'clubs') THEN
    CREATE POLICY clubs_select_member ON clubs FOR SELECT
      USING (owner_id = auth.uid() OR is_club_member(id));
    CREATE POLICY clubs_insert_owner ON clubs FOR INSERT
      WITH CHECK (owner_id = auth.uid());
    CREATE POLICY clubs_update_owner ON clubs FOR UPDATE
      USING (is_club_owner_or_admin(id));
    CREATE POLICY clubs_delete_owner ON clubs FOR DELETE
      USING (owner_id = auth.uid());
  END IF;

  -- Club members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'club_members_select' AND tablename = 'club_members') THEN
    CREATE POLICY club_members_select ON club_members FOR SELECT
      USING (is_club_member(club_id));
    CREATE POLICY club_members_manage ON club_members FOR ALL
      USING (is_club_owner_or_admin(club_id))
      WITH CHECK (is_club_owner_or_admin(club_id));
  END IF;

  -- Team invitations
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_invitations_coach' AND tablename = 'team_invitations') THEN
    CREATE POLICY team_invitations_coach ON team_invitations FOR ALL
      USING (can_manage_team(team_id))
      WITH CHECK (can_manage_team(team_id));
    CREATE POLICY team_invitations_accept ON team_invitations FOR SELECT
      USING (true);
  END IF;

  -- Coach notes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_notes_coach' AND tablename = 'coach_notes') THEN
    CREATE POLICY coach_notes_coach ON coach_notes FOR ALL
      USING (coach_id = auth.uid() OR can_manage_team(team_id))
      WITH CHECK (coach_id = auth.uid());
  END IF;

  -- Calendar
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_calendar_member' AND tablename = 'team_calendar_events') THEN
    CREATE POLICY team_calendar_member ON team_calendar_events FOR SELECT
      USING (is_team_member(team_id) OR can_manage_team(team_id));
    CREATE POLICY team_calendar_coach ON team_calendar_events FOR ALL
      USING (can_manage_team(team_id))
      WITH CHECK (can_manage_team(team_id));
  END IF;

  -- Attendance
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_attendance_member' AND tablename = 'team_attendance') THEN
    CREATE POLICY team_attendance_member ON team_attendance FOR SELECT
      USING (is_team_member(team_id) OR can_manage_team(team_id));
    CREATE POLICY team_attendance_coach ON team_attendance FOR ALL
      USING (can_manage_team(team_id))
      WITH CHECK (can_manage_team(team_id));
  END IF;
END $$;

DROP TRIGGER IF EXISTS clubs_updated_at ON clubs;
CREATE TRIGGER clubs_updated_at
  BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS coach_notes_updated_at ON coach_notes;
CREATE TRIGGER coach_notes_updated_at
  BEFORE UPDATE ON coach_notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
