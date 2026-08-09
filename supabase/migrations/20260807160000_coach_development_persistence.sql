/*
  Sprint 4.1 — Coach progression cloud persistence + achievements.
  Separate from player_development to prevent cross-credit.
*/

CREATE TABLE IF NOT EXISTS coach_development (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp integer NOT NULL DEFAULT 0,
  coach_level integer NOT NULL DEFAULT 1,
  active_track jsonb,
  weekly_goals jsonb,
  streak_snapshot jsonb,
  challenge_attempts jsonb NOT NULL DEFAULT '[]',
  activity_events jsonb NOT NULL DEFAULT '[]',
  training_plans jsonb NOT NULL DEFAULT '[]',
  match_analyses jsonb NOT NULL DEFAULT '[]',
  daily_challenge_id text,
  daily_challenge_date text,
  daily_challenge_completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE coach_development ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_coach_development_user ON coach_development(user_id);

DROP TRIGGER IF EXISTS coach_development_updated_at ON coach_development;
CREATE TRIGGER coach_development_updated_at
  BEFORE UPDATE ON coach_development
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS coach_xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_key text NOT NULL,
  reason text NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  source text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_key)
);
ALTER TABLE coach_xp_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_coach_xp_events_user ON coach_xp_events(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS coach_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
ALTER TABLE coach_achievements ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_coach_achievements_user ON coach_achievements(user_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_development_own' AND tablename = 'coach_development') THEN
    CREATE POLICY coach_development_own ON coach_development FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_xp_events_own' AND tablename = 'coach_xp_events') THEN
    CREATE POLICY coach_xp_events_own ON coach_xp_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_achievements_own' AND tablename = 'coach_achievements') THEN
    CREATE POLICY coach_achievements_own ON coach_achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
