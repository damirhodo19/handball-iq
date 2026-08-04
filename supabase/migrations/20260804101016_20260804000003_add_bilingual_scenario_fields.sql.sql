/*
# Add bilingual (English/Croatian) fields to scenarios table

## Purpose
This migration adds Croatian-language columns to the `scenarios` table to support
the bilingual (English/Croatian) translation system. All existing English content
remains untouched — the new columns are nullable and default to NULL.

## New Columns on `scenarios`
- `title_hr` (text, nullable) — Croatian title
- `situation_hr` (text, nullable) — Croatian situation description
- `question_hr` (text, nullable) — Croatian question
- `answer_options_hr` (text[], nullable) — Croatian answer options
- `explanation_hr` (text, nullable) — Croatian explanation
- `learning_objective_hr` (text, nullable) — Croatian learning objective
- `common_mistake_hr` (text, nullable) — Croatian common mistake
- `coach_note_hr` (text, nullable) — Croatian coach note

## Compatibility
- All new columns are nullable, so existing rows remain valid.
- The application falls back to English when Croatian content is NULL.
- No existing column is modified or removed.

## Security
- No changes to RLS policies — existing policies remain in effect.
- No new tables created.
*/

ALTER TABLE scenarios
  ADD COLUMN IF NOT EXISTS title_hr text,
  ADD COLUMN IF NOT EXISTS situation_hr text,
  ADD COLUMN IF NOT EXISTS question_hr text,
  ADD COLUMN IF NOT EXISTS answer_options_hr text[],
  ADD COLUMN IF NOT EXISTS explanation_hr text,
  ADD COLUMN IF NOT EXISTS learning_objective_hr text,
  ADD COLUMN IF NOT EXISTS common_mistake_hr text,
  ADD COLUMN IF NOT EXISTS coach_note_hr text;
