/*
  Sprint 4 — extend player_development for programs, goals, streak snapshot, numeric level.
  XP events + achievements already UNIQUE for idempotent sync.
*/

ALTER TABLE player_development
  ADD COLUMN IF NOT EXISTS player_level_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS daily_goals jsonb,
  ADD COLUMN IF NOT EXISTS weekly_goals jsonb,
  ADD COLUMN IF NOT EXISTS active_program jsonb,
  ADD COLUMN IF NOT EXISTS completed_programs jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS streak_snapshot jsonb;

-- Coach cloud tables live in 20260807160000_coach_development_persistence.sql.
