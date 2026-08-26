ALTER TABLE scenarios
  ADD COLUMN IF NOT EXISTS title_de text,
  ADD COLUMN IF NOT EXISTS situation_de text,
  ADD COLUMN IF NOT EXISTS question_de text,
  ADD COLUMN IF NOT EXISTS answer_options_de text[],
  ADD COLUMN IF NOT EXISTS explanation_de text,
  ADD COLUMN IF NOT EXISTS learning_objective_de text,
  ADD COLUMN IF NOT EXISTS common_mistake_de text,
  ADD COLUMN IF NOT EXISTS coach_note_de text;
