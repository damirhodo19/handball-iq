/*
  Cross-device active player position.

  Primary and secondary positions remain the profile source of truth. This
  preference only records which of those positions the player is currently
  training as, and is optional for full legacy compatibility.
*/

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS active_player_position text;

ALTER TABLE public.user_preferences
  DROP CONSTRAINT IF EXISTS user_preferences_active_player_position_check;

ALTER TABLE public.user_preferences
  ADD CONSTRAINT user_preferences_active_player_position_check
  CHECK (
    active_player_position IS NULL OR active_player_position IN (
      'Goalkeeper',
      'Left Wing',
      'Right Wing',
      'Left Back',
      'Centre Back',
      'Right Back',
      'Pivot'
    )
  );

ALTER TABLE public.player_development
  ADD COLUMN IF NOT EXISTS daily_challenges_by_position jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS weekly_programs_by_position jsonb NOT NULL DEFAULT '{}'::jsonb;
