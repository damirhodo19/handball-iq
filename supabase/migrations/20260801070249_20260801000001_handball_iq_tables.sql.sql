/*
# Handball IQ — Full Schema: Tables & Helpers

Creates all new tables, helper functions, alters profiles, and sets up triggers.
Policies that cross-reference tables are added in a follow-up migration to
avoid "relation does not exist" errors during creation.

## New Tables (9)
1. teams, 2. team_members, 3. scenarios, 4. session_results,
5. match_simulations, 6. match_day_preparations, 7. post_match_reflections,
8. assigned_sessions, 9. user_goals

## Modified Tables
- profiles: adds 12 new columns (first_name, last_name, role, etc.)
- Adds updated_at trigger, auto-create profile trigger
*/

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

CREATE OR REPLACE FUNCTION public.is_coach()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'coach', false);
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ALTER profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='first_name') THEN ALTER TABLE profiles ADD COLUMN first_name text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_name') THEN ALTER TABLE profiles ADD COLUMN last_name text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'player'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='primary_position') THEN ALTER TABLE profiles ADD COLUMN primary_position text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='secondary_position') THEN ALTER TABLE profiles ADD COLUMN secondary_position text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='birth_year') THEN ALTER TABLE profiles ADD COLUMN birth_year integer; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='age_group') THEN ALTER TABLE profiles ADD COLUMN age_group text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='club') THEN ALTER TABLE profiles ADD COLUMN club text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='team_id') THEN ALTER TABLE profiles ADD COLUMN team_id uuid; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='development_goal') THEN ALTER TABLE profiles ADD COLUMN development_goal text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='founding_member') THEN ALTER TABLE profiles ADD COLUMN founding_member boolean NOT NULL DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='founding_member_number') THEN ALTER TABLE profiles ADD COLUMN founding_member_number integer; END IF;
END $$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, role, onboarded) VALUES (NEW.id, 'player', false) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- teams
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, club_name text, country text, age_group text, playing_level text,
  invitation_code text UNIQUE,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_teams_invitation_code ON teams(invitation_code);

-- team_members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role text NOT NULL DEFAULT 'player',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- profiles team_id FK
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='profiles_team_id_fkey' AND table_name='profiles') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
  END IF;
END $$;

-- scenarios
CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, position text NOT NULL,
  secondary_positions text[] NOT NULL DEFAULT '{}',
  category text NOT NULL, difficulty text NOT NULL,
  age_group text NOT NULL DEFAULT 'All', playing_level text NOT NULL DEFAULT 'All',
  status text NOT NULL DEFAULT 'Draft', match_phase text NOT NULL DEFAULT 'First Half',
  minute integer NOT NULL DEFAULT 15, home_score integer, away_score integer,
  attack_or_defence text NOT NULL DEFAULT 'Defence', players_on_court text NOT NULL DEFAULT '7',
  defensive_system text NOT NULL DEFAULT '6-0',
  situation text NOT NULL, question text NOT NULL,
  answer_options jsonb NOT NULL DEFAULT '[]', recommended_answer integer NOT NULL DEFAULT 0,
  explanation text NOT NULL, learning_objective text NOT NULL,
  mental_skill text, tactical_skill text, common_mistake text, coach_note text,
  pressure_level text NOT NULL DEFAULT 'Moderate',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS scenarios_updated_at ON scenarios;
CREATE TRIGGER scenarios_updated_at BEFORE UPDATE ON scenarios FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE INDEX IF NOT EXISTS idx_scenarios_status ON scenarios(status);
CREATE INDEX IF NOT EXISTS idx_scenarios_position ON scenarios(position);
CREATE INDEX IF NOT EXISTS idx_scenarios_deleted_at ON scenarios(deleted_at);

-- session_results
CREATE TABLE IF NOT EXISTS session_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL, session_name text NOT NULL, position text,
  score integer NOT NULL DEFAULT 0, decision_score integer NOT NULL DEFAULT 0,
  mental_readiness integer NOT NULL DEFAULT 0, pressure_control integer NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0, answers jsonb NOT NULL DEFAULT '[]',
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE session_results ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_session_results_user ON session_results(user_id, completed_at);

-- match_simulations
CREATE TABLE IF NOT EXISTS match_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  position text NOT NULL, opponent text, difficulty text,
  final_home_score integer NOT NULL DEFAULT 0, final_away_score integer NOT NULL DEFAULT 0,
  overall_rating integer NOT NULL DEFAULT 0, decision_score integer NOT NULL DEFAULT 0,
  pressure_control integer NOT NULL DEFAULT 0, reading_score integer NOT NULL DEFAULT 0,
  consistency_score integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '[]', report jsonb NOT NULL DEFAULT '{}',
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE match_simulations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_match_simulations_user ON match_simulations(user_id, completed_at);

-- match_day_preparations
CREATE TABLE IF NOT EXISTS match_day_preparations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent text NOT NULL, match_type text, match_location text,
  expected_playing_time text, personal_goals text[] NOT NULL DEFAULT '{}',
  personal_statement text, mental_readiness integer NOT NULL DEFAULT 0,
  tactical_readiness integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE match_day_preparations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_match_day_prep_user ON match_day_preparations(user_id, completed_at);

-- post_match_reflections
CREATE TABLE IF NOT EXISTS post_match_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  preparation_id uuid REFERENCES match_day_preparations(id) ON DELETE SET NULL,
  prepared_rating integer NOT NULL DEFAULT 3, reset_rating integer NOT NULL DEFAULT 3,
  patience_rating integer NOT NULL DEFAULT 3,
  difficult_situation text, did_well text, improvement text, summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE post_match_reflections ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_reflections_user ON post_match_reflections(user_id, created_at);

-- assigned_sessions
CREATE TABLE IF NOT EXISTS assigned_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  session_type text NOT NULL, session_id text, message text,
  status text NOT NULL DEFAULT 'assigned', due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE assigned_sessions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_assigned_sessions_player ON assigned_sessions(player_id, status);
CREATE INDEX IF NOT EXISTS idx_assigned_sessions_coach ON assigned_sessions(coach_id);

-- user_goals
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL, target_value integer NOT NULL DEFAULT 100,
  current_value integer NOT NULL DEFAULT 0, category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id, status);

-- Founding members counter
CREATE OR REPLACE FUNCTION public.get_next_founding_member_number()
RETURNS integer LANGUAGE sql SECURITY DEFINER AS $$
  SELECT COALESCE(MAX(founding_member_number), 0) + 1
  FROM profiles WHERE founding_member = true AND founding_member_number IS NOT NULL;
$$;