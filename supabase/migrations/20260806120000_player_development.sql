/*
  Player Development System — Supabase tables for XP, achievements, and statistics sync.
*/

CREATE TABLE IF NOT EXISTS player_development (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp integer NOT NULL DEFAULT 0,
  player_level text NOT NULL DEFAULT 'Beginner',
  decision_events jsonb NOT NULL DEFAULT '[]',
  daily_challenge jsonb,
  weekly_program jsonb,
  statistics jsonb NOT NULL DEFAULT '{}',
  notification_prefs jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE player_development ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_player_development_user ON player_development(user_id);

DROP TRIGGER IF EXISTS player_development_updated_at ON player_development;
CREATE TRIGGER player_development_updated_at
  BEFORE UPDATE ON player_development
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS xp_events (
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
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS player_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_player_achievements_user ON player_achievements(user_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'player_development_own' AND tablename = 'player_development') THEN
    CREATE POLICY player_development_own ON player_development FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'xp_events_own' AND tablename = 'xp_events') THEN
    CREATE POLICY xp_events_own ON xp_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'player_achievements_own' AND tablename = 'player_achievements') THEN
    CREATE POLICY player_achievements_own ON player_achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
