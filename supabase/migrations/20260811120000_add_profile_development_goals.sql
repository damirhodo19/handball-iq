ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS development_goals text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coach_development_goals text[];

UPDATE public.profiles
SET development_goals = ARRAY[development_goal]
WHERE development_goal IS NOT NULL
  AND (development_goals IS NULL OR cardinality(development_goals) = 0);

UPDATE public.profiles
SET coach_development_goals = ARRAY[coach_development_goal]
WHERE coach_development_goal IS NOT NULL
  AND (coach_development_goals IS NULL OR cardinality(coach_development_goals) = 0);

COMMENT ON COLUMN public.profiles.development_goals IS
  'Ordered player development goals (1 to 3). development_goal remains the primary backwards-compatible value.';
COMMENT ON COLUMN public.profiles.coach_development_goals IS
  'Ordered coach development goals (1 to 3). coach_development_goal remains the primary backwards-compatible value.';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_development_goals_count;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_development_goals_count
  CHECK (development_goals IS NULL OR cardinality(development_goals) BETWEEN 1 AND 3);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_coach_development_goals_count;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_coach_development_goals_count
  CHECK (coach_development_goals IS NULL OR cardinality(coach_development_goals) BETWEEN 1 AND 3);
