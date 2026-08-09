-- Handball IQ 2.0 Sprint 1 — profile personalization columns

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IS NULL OR role IN ('player', 'coach', 'player_coach', 'admin'));

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS coach_type text,
  ADD COLUMN IF NOT EXISTS experience_band text,
  ADD COLUMN IF NOT EXISTS favorite_defense text,
  ADD COLUMN IF NOT EXISTS favorite_attack text,
  ADD COLUMN IF NOT EXISTS coach_development_goal text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS onboarding_version integer DEFAULT 0;

COMMENT ON COLUMN profiles.coach_type IS 'youth|senior|professional|goalkeeper|assistant|head (display labels mapped in app)';
COMMENT ON COLUMN profiles.experience_band IS '0-2|3-5|6-10|10+';
COMMENT ON COLUMN profiles.favorite_defense IS '6:0|5:1|3:2:1|3:3|Mixed';
COMMENT ON COLUMN profiles.favorite_attack IS 'Fast Break|Structured Attack|Second Pivot|Crossing';
COMMENT ON COLUMN profiles.coach_development_goal IS 'Tactics|Leadership|Player Development|Training Planning|Match Analysis|Complete Development';
COMMENT ON COLUMN profiles.theme IS 'light|dark|system';
COMMENT ON COLUMN profiles.onboarding_version IS '2 = Handball IQ 2.0 guided onboarding complete';

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  notifications_enabled boolean DEFAULT true,
  daily_reminder_time time,
  active_mode text CHECK (active_mode IS NULL OR active_mode IN ('player', 'coach')),
  onboarding_version int DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own preferences" ON user_preferences;
CREATE POLICY "own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
