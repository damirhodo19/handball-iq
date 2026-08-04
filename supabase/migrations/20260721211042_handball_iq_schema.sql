/*
# Handball IQ — Core Database Schema

## Overview
Creates the full data model for the Handball IQ platform: a multi-user app where
authenticated players train decision-making, prepare mentally for matches, and
review their performance. Every table is owner-scoped to the authenticated user
via `user_id uuid NOT NULL DEFAULT auth.uid()` and protected with RLS.

## New Tables

1. `profiles`
   - One row per authenticated user, created on first sign-in.
   - `id` uuid PK, references `auth.users(id)` ON DELETE CASCADE.
   - Onboarding fields: `age`, `position`, `dominant_hand`, `playing_level`, `country`.
   - `handball_iq_score` integer (0-100) — the player's overall Decision Score.
   - `streak` integer — current daily streak count.
   - `last_active_date` date — for streak calculation.
   - `total_points` integer — cumulative training points.
   - `onboarded` boolean — whether onboarding is complete.

2. `training_scenarios`
   - Library of realistic handball decision-making situations (seeded, shared).
   - `id`, `scenario` text, `difficulty` (easy/medium/hard/expert),
     `defense_formation` text, `options` jsonb (4 options), `correct_index` int,
     `explanation` text, `points` int, `category` text.

3. `training_attempts`
   - A player's attempt at a scenario.
   - `user_id`, `scenario_id`, `chosen_index`, `is_correct`, `reaction_ms`,
     `points_earned`, `answered_at`.

4. `match_preparations`
   - A player's pre-match mental prep session.
   - `user_id`, `opponent` text, `match_date` timestamptz, `mental_prep_done`,
     `visualization_done`, `breathing_done`, `focus_done`, `tactical_reminders` jsonb,
     `completed_at`.

5. `post_match_reviews`
   - Player's reflection after a match.
   - `user_id`, `opponent`, `match_date`, `decision_making` (1-5),
     `focus` (1-5), `confidence` (1-5), `mistakes` text, `mental_state` text,
     `notes` text, `created_at`.

6. `daily_progress`
   - Aggregated daily metrics for charts.
   - `user_id`, `date` date, `scenarios_completed` int, `points_earned` int,
     `accuracy` numeric, `avg_reaction_ms` int.

## Security
- RLS enabled on every table.
- `training_scenarios` is shared/read-only to all authenticated users (SELECT only).
- All other tables are owner-scoped via `auth.uid() = user_id` with 4 CRUD policies each.
- Owner columns default to `auth.uid()` so client inserts omitting `user_id` succeed.
*/

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age integer,
  position text,
  dominant_hand text,
  playing_level text,
  country text,
  handball_iq_score integer NOT NULL DEFAULT 50,
  streak integer NOT NULL DEFAULT 0,
  last_active_date date DEFAULT CURRENT_DATE,
  total_points integer NOT NULL DEFAULT 0,
  onboarded boolean NOT NULL DEFAULT false,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- =========================================================
-- training_scenarios (shared library)
-- =========================================================
CREATE TABLE IF NOT EXISTS training_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy','medium','hard','expert')),
  defense_formation text,
  category text NOT NULL DEFAULT 'decision',
  options jsonb NOT NULL,
  correct_index integer NOT NULL,
  explanation text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE training_scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_scenarios" ON training_scenarios;
CREATE POLICY "read_scenarios" ON training_scenarios FOR SELECT
  TO authenticated USING (true);

-- =========================================================
-- training_attempts
-- =========================================================
CREATE TABLE IF NOT EXISTS training_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id uuid NOT NULL REFERENCES training_scenarios(id) ON DELETE CASCADE,
  chosen_index integer NOT NULL,
  is_correct boolean NOT NULL,
  reaction_ms integer NOT NULL,
  points_earned integer NOT NULL DEFAULT 0,
  answered_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE training_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON training_attempts;
CREATE POLICY "select_own_attempts" ON training_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON training_attempts;
CREATE POLICY "insert_own_attempts" ON training_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_attempts" ON training_attempts;
CREATE POLICY "update_own_attempts" ON training_attempts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attempts" ON training_attempts;
CREATE POLICY "delete_own_attempts" ON training_attempts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- match_preparations
-- =========================================================
CREATE TABLE IF NOT EXISTS match_preparations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent text NOT NULL,
  match_date timestamptz NOT NULL,
  mental_prep_done boolean NOT NULL DEFAULT false,
  visualization_done boolean NOT NULL DEFAULT false,
  breathing_done boolean NOT NULL DEFAULT false,
  focus_done boolean NOT NULL DEFAULT false,
  tactical_reminders jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE match_preparations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_match_prep" ON match_preparations;
CREATE POLICY "select_own_match_prep" ON match_preparations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_match_prep" ON match_preparations;
CREATE POLICY "insert_own_match_prep" ON match_preparations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_match_prep" ON match_preparations;
CREATE POLICY "update_own_match_prep" ON match_preparations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_match_prep" ON match_preparations;
CREATE POLICY "delete_own_match_prep" ON match_preparations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- post_match_reviews
-- =========================================================
CREATE TABLE IF NOT EXISTS post_match_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent text NOT NULL,
  match_date timestamptz NOT NULL,
  decision_making integer NOT NULL DEFAULT 3 CHECK (decision_making BETWEEN 1 AND 5),
  focus integer NOT NULL DEFAULT 3 CHECK (focus BETWEEN 1 AND 5),
  confidence integer NOT NULL DEFAULT 3 CHECK (confidence BETWEEN 1 AND 5),
  mistakes text,
  mental_state text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE post_match_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reviews" ON post_match_reviews;
CREATE POLICY "select_own_reviews" ON post_match_reviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reviews" ON post_match_reviews;
CREATE POLICY "insert_own_reviews" ON post_match_reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON post_match_reviews;
CREATE POLICY "update_own_reviews" ON post_match_reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON post_match_reviews;
CREATE POLICY "delete_own_reviews" ON post_match_reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- daily_progress
-- =========================================================
CREATE TABLE IF NOT EXISTS daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  scenarios_completed integer NOT NULL DEFAULT 0,
  points_earned integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  avg_reaction_ms integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON daily_progress;
CREATE POLICY "select_own_progress" ON daily_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON daily_progress;
CREATE POLICY "insert_own_progress" ON daily_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON daily_progress;
CREATE POLICY "update_own_progress" ON daily_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON daily_progress;
CREATE POLICY "delete_own_progress" ON daily_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_training_attempts_user ON training_attempts(user_id, answered_at);
CREATE INDEX IF NOT EXISTS idx_match_prep_user ON match_preparations(user_id, match_date);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON post_match_reviews(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user ON daily_progress(user_id, date);

-- =========================================================
-- Seed training scenarios
-- =========================================================
INSERT INTO training_scenarios (scenario, difficulty, defense_formation, category, options, correct_index, explanation, points) VALUES
('You are playing against a 5:1 defence. The pivot blocks defender number two. The wing is open. What is your decision?', 'medium', '5:1', 'attack', '["Pass to the open wing for a clear shot","Shoot directly from the back position","Pass to the pivot who is tightly marked","Dribble through the gap alone"]'::jsonb, 0, 'With the wing open and the pivot tightly marked, the highest-percentage play is to move the ball to the wing for an uncontested shot. Shooting from the back against an established 5:1 is low-percentage, and forcing it to a marked pivot or dribbling into traffic invites turnovers.', 15),
('Against a 6:0 wall, the defenders are compact and the gap between defenders 3 and 4 is small but open. You are the left back. What do you do?', 'hard', '6:0', 'attack', '["Drive into the gap between 3 and 4 to collapse the defence, then pass to pivot","Shoot a jump shot over the wall immediately","Pass immediately to the right back","Hold the ball and wait for movement"]'::jsonb, 0, 'A 6:0 wall is designed to deny direct shots. The correct read is to attack the seam between 3 and 4 to force the defence to collapse, which opens the pivot or the wing. A jump shot over a compact wall is low-percentage, and holding the ball lets the defence reset.', 20),
('You are a wing attacker. The defender steps up aggressively as you receive the ball on the wing. The pivot is open at the line. What is the best decision?', 'medium', 'man-to-man', 'attack', '["Pass to the open pivot at the line","Try to beat the defender 1v1 on the outside","Shoot from a tight angle immediately","Pass back to the back court"]'::jsonb, 0, 'When the defender over-commits on the wing, the pivot at the line is left unmarked. Feeding the pivot is the highest-percentage scoring play. Going 1v1 against an aggressive defender is risky, and a tight-angle wing shot is low-percentage.', 15),
('Your team is defending a fast break. You are the only defender between the attacker and the goal. The attacker is right-handed and approaching from the right side. How do you position yourself?', 'easy', 'fast break', 'defense', '["Force the attacker to their left (weak) side","Give the attacker the right side freely","Stand still at the goal line","Commit to a tackle immediately"]'::jsonb, 0, 'Forcing a right-handed attacker to their left (weak) hand dramatically reduces shooting accuracy on a fast break. Giving them their strong side, standing still, or committing too early all create easy scoring chances.', 10),
('It is the last 30 seconds and your team is down by 1. You have the ball on the left back position. The defence is playing 5:1. What is the best decision?', 'expert', '5:1', 'clutch', '["Be patient, move the defence, and look for the best shot","Shoot immediately from distance","Drive alone into the defence","Pass to anyone quickly"]'::jsonb, 0, 'In a clutch situation down by 1 with 30 seconds left, the priority is to generate the highest-percentage shot possible. Patience forces the defence to move and creates a better opening. A rushed shot, solo drive, or untargeted pass wastes the possession.', 25),
('The goalkeeper has saved your last 3 shots from the back. You are open at the 9m line. What do you do?', 'medium', 'goalkeeper', 'attack', '["Pass to a teammate in a better position","Shoot again from the same spot","Shoot harder than before","Dribble closer to the goal first"]'::jsonb, 0, 'A goalkeeper in a rhythm against your back shots is a low-percentage target. The smart read is to move the ball to a teammate with a better angle or to a different shooting position. Repeating a failing shot or simply shooting harder ignores the goalkeeper''s confidence.', 15),
('You are defending against a pivot who is constantly setting screens. Your teammate gets screened. What should you do?', 'hard', 'defense', 'defense', '["Switch assignments with your teammate briefly","Stay on your player and ignore the screen","Chase your player through the screen","Call for a substitution"]'::jsonb, 0, 'A well-timed switch neutralizes the screen and prevents an open shot. Staying on your player or chasing through the screen both create an open lane. Calling a substitution disrupts your defence unnecessarily.', 20),
('You are the centre back. The defence shifts heavily to the right side, leaving the left wing isolated 1v1. What is your decision?', 'easy', 'shift', 'attack', '["Quickly pass to the isolated left wing","Shoot from centre","Pass to the right back who is well covered","Hold the ball and observe"]'::jsonb, 0, 'When the defence over-shifts to one side, the isolated player on the weak side has a numerical advantage. A quick pass to the left wing exploits the 1v1. Shooting from centre against a shifted defence or passing to the covered side ignores the opening.', 10),
('Your team is on a power play (man-up). The defence is playing 3:2. Where is the overload best exploited?', 'medium', '3:2', 'attack', '["Move the ball quickly to overload the 2 side","Shoot from the 3 side","Drive into the 3 side","Pass to the pivot in the middle"]'::jsonb, 0, 'Against a 3:2 man-down defence, the 2-player side is numerically overloaded. Quick ball movement to that side creates a clear shot. Attacking the 3 side plays into the defence''s strength, and forcing the pivot through the middle is congested.', 15),
('You are a right wing. The defender is playing you very tight, body-to-body. The fast break is on. What is the best move?', 'hard', 'fast break', 'attack', '["Make a sharp inward cut to receive the ball in the gap","Run straight down the wing as usual","Stop and let the play reset","Call for the ball at the 9m line"]'::jsonb, 0, 'A tight wing defender on a fast break can be beaten with a sharp inward cut into the gap, creating a scoring lane. Running the standard wing line plays into the defender''s position. Stopping kills the break, and calling at 9m is too deep for a wing.', 20)
ON CONFLICT DO NOTHING;
