-- Document canonical defence / attack preference IDs on profiles.
-- Columns remain freeform text (no CHECK) so legacy values can be migrated in-app.
-- Application layer normalizes to def_* / att_* / none before upsert.

COMMENT ON COLUMN profiles.favorite_defense IS
  'Canonical defence system id: def_6_0|def_5_1|def_3_2_1|def_3_3|def_4_2|def_5_plus_1|def_4_plus_2|def_man_to_man|def_1_5|def_open|def_double_mark|none (legacy colon/labels accepted then normalized client-side)';

COMMENT ON COLUMN profiles.favorite_attack IS
  'Canonical attack style id: att_structured|att_fast_break|att_second_wave|att_quick_centre|att_crossing|att_parallel|att_second_pivot|att_7v6|att_empty_goal|att_two_pivot|att_wing_overload|att_backcourt_shooting|att_isolation|att_pivot_cooperation|att_numerical_superiority|none (legacy EN labels accepted then normalized client-side)';
