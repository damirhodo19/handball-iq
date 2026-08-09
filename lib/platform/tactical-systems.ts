/**
 * Canonical defence / attack preference IDs for coach personalization.
 * Stored values are language-neutral IDs — never translated display strings.
 */

export type DefenseSystemId =
  | 'def_6_0'
  | 'def_5_1'
  | 'def_3_2_1'
  | 'def_3_3'
  | 'def_4_2'
  | 'def_5_plus_1'
  | 'def_4_plus_2'
  | 'def_man_to_man'
  | 'def_1_5'
  | 'def_open'
  | 'def_double_mark'
  | 'none';

export type AttackStyleId =
  | 'att_structured'
  | 'att_fast_break'
  | 'att_second_wave'
  | 'att_quick_centre'
  | 'att_crossing'
  | 'att_parallel'
  | 'att_second_pivot'
  | 'att_7v6'
  | 'att_empty_goal'
  | 'att_two_pivot'
  | 'att_wing_overload'
  | 'att_backcourt_shooting'
  | 'att_isolation'
  | 'att_pivot_cooperation'
  | 'att_numerical_superiority'
  | 'none';

/** Picker order (includes "No preference"). */
export const DEFENSE_SYSTEMS_V2: DefenseSystemId[] = [
  'def_6_0',
  'def_5_1',
  'def_3_2_1',
  'def_3_3',
  'def_4_2',
  'def_5_plus_1',
  'def_4_plus_2',
  'def_man_to_man',
  'def_1_5',
  'def_open',
  'def_double_mark',
  'none',
];

export const ATTACK_STYLES_V2: AttackStyleId[] = [
  'att_structured',
  'att_fast_break',
  'att_second_wave',
  'att_quick_centre',
  'att_crossing',
  'att_parallel',
  'att_second_pivot',
  'att_7v6',
  'att_empty_goal',
  'att_two_pivot',
  'att_wing_overload',
  'att_backcourt_shooting',
  'att_isolation',
  'att_pivot_cooperation',
  'att_numerical_superiority',
  'none',
];

export const DEFENSE_LABEL_KEYS: Record<DefenseSystemId, string> = {
  def_6_0: 'defense.def_6_0',
  def_5_1: 'defense.def_5_1',
  def_3_2_1: 'defense.def_3_2_1',
  def_3_3: 'defense.def_3_3',
  def_4_2: 'defense.def_4_2',
  def_5_plus_1: 'defense.def_5_plus_1',
  def_4_plus_2: 'defense.def_4_plus_2',
  def_man_to_man: 'defense.def_man_to_man',
  def_1_5: 'defense.def_1_5',
  def_open: 'defense.def_open',
  def_double_mark: 'defense.def_double_mark',
  none: 'defense.none',
};

export const ATTACK_LABEL_KEYS: Record<AttackStyleId, string> = {
  att_structured: 'attack.att_structured',
  att_fast_break: 'attack.att_fast_break',
  att_second_wave: 'attack.att_second_wave',
  att_quick_centre: 'attack.att_quick_centre',
  att_crossing: 'attack.att_crossing',
  att_parallel: 'attack.att_parallel',
  att_second_pivot: 'attack.att_second_pivot',
  att_7v6: 'attack.att_7v6',
  att_empty_goal: 'attack.att_empty_goal',
  att_two_pivot: 'attack.att_two_pivot',
  att_wing_overload: 'attack.att_wing_overload',
  att_backcourt_shooting: 'attack.att_backcourt_shooting',
  att_isolation: 'attack.att_isolation',
  att_pivot_cooperation: 'attack.att_pivot_cooperation',
  att_numerical_superiority: 'attack.att_numerical_superiority',
  none: 'attack.none',
};

/** Legacy display / colon / hyphen values → canonical defence ID. */
const DEFENSE_ALIASES: Record<string, DefenseSystemId> = {
  // canonical
  def_6_0: 'def_6_0',
  def_5_1: 'def_5_1',
  def_3_2_1: 'def_3_2_1',
  def_3_3: 'def_3_3',
  def_4_2: 'def_4_2',
  def_5_plus_1: 'def_5_plus_1',
  def_4_plus_2: 'def_4_plus_2',
  def_man_to_man: 'def_man_to_man',
  def_1_5: 'def_1_5',
  def_open: 'def_open',
  def_double_mark: 'def_double_mark',
  none: 'none',
  // legacy coach prefs
  '6:0': 'def_6_0',
  '5:1': 'def_5_1',
  '3:2:1': 'def_3_2_1',
  '3:3': 'def_3_3',
  Mixed: 'def_4_plus_2',
  mixed: 'def_4_plus_2',
  'Mixed defence': 'def_4_plus_2',
  'Mixed defense': 'def_4_plus_2',
  // admin / bank notation
  '6-0': 'def_6_0',
  '5-1': 'def_5_1',
  '3-2-1': 'def_3_2_1',
  '3-3': 'def_3_3',
  '4-2': 'def_4_2',
  'Man-to-Man': 'def_man_to_man',
  'man-to-man': 'def_man_to_man',
  'Man to Man': 'def_man_to_man',
  'Individual man-to-man': 'def_man_to_man',
  '5+1': 'def_5_plus_1',
  '4+2': 'def_4_plus_2',
  '1:5': 'def_1_5',
  '1-5': 'def_1_5',
  Open: 'def_open',
  'Open aggressive defence': 'def_open',
  'Open aggressive defense': 'def_open',
  'Double marking': 'def_double_mark',
  'Temporary double man marking': 'def_double_mark',
  // HR / DE legacy display strings occasionally stored pre-canonical
  'Čovjek na čovjeka': 'def_man_to_man',
  'Mann gegen Mann': 'def_man_to_man',
  Mješovito: 'def_4_plus_2',
  Gemischt: 'def_4_plus_2',
  '': 'none',
};

const ATTACK_ALIASES: Record<string, AttackStyleId> = {
  att_structured: 'att_structured',
  att_fast_break: 'att_fast_break',
  att_second_wave: 'att_second_wave',
  att_quick_centre: 'att_quick_centre',
  att_crossing: 'att_crossing',
  att_parallel: 'att_parallel',
  att_second_pivot: 'att_second_pivot',
  att_7v6: 'att_7v6',
  att_empty_goal: 'att_empty_goal',
  att_two_pivot: 'att_two_pivot',
  att_wing_overload: 'att_wing_overload',
  att_backcourt_shooting: 'att_backcourt_shooting',
  att_isolation: 'att_isolation',
  att_pivot_cooperation: 'att_pivot_cooperation',
  att_numerical_superiority: 'att_numerical_superiority',
  none: 'none',
  // legacy
  'Fast Break': 'att_fast_break',
  'Structured Attack': 'att_structured',
  'Structured 6v6 attack': 'att_structured',
  'Second Pivot': 'att_second_pivot',
  Crossing: 'att_crossing',
  'Crossing Game': 'att_crossing',
  'Second Wave': 'att_second_wave',
  'Quick Centre': 'att_quick_centre',
  'Quick Center': 'att_quick_centre',
  '7v6': 'att_7v6',
  'Empty Goal': 'att_empty_goal',
  'Empty Goal Attack': 'att_empty_goal',
  'Two Pivot': 'att_two_pivot',
  'Two Pivot Attack': 'att_two_pivot',
  'Parallel Movement': 'att_parallel',
  'Wing Overload': 'att_wing_overload',
  'Backcourt Shooting': 'att_backcourt_shooting',
  Isolation: 'att_isolation',
  '1v1 / Isolation': 'att_isolation',
  '1v1 Isolation': 'att_isolation',
  'Pivot Cooperation': 'att_pivot_cooperation',
  'Numerical Superiority': 'att_numerical_superiority',
  // HR / DE legacy
  Kontranapad: 'att_fast_break',
  Tempogegenstoß: 'att_fast_break',
  Kreuzspiel: 'att_crossing',
  'Igra križanja': 'att_crossing',
  '': 'none',
};

/** Keyword hints used to soft-bias challenges / Match Day / planner content. */
export function tacticalPreferenceKeywords(
  defenseId?: string | null,
  attackId?: string | null,
): string[] {
  const keys: string[] = [];
  const d = normalizeDefenseSystemId(defenseId);
  const a = normalizeAttackStyleId(attackId);
  switch (d) {
    case 'def_6_0':
      keys.push('6:0', '6-0', 'flat defence', 'flat defense');
      break;
    case 'def_5_1':
      keys.push('5:1', '5-1', 'forward defender', 'pressing');
      break;
    case 'def_3_2_1':
      keys.push('3:2:1', '3-2-1');
      break;
    case 'def_3_3':
      keys.push('3:3', '3-3');
      break;
    case 'def_4_2':
      keys.push('4:2', '4-2');
      break;
    case 'def_5_plus_1':
      keys.push('5+1', 'man marking', 'mixed');
      break;
    case 'def_4_plus_2':
      keys.push('4+2', 'mixed');
      break;
    case 'def_man_to_man':
      keys.push('man-to-man', 'man to man', 'individual');
      break;
    case 'def_1_5':
      keys.push('1:5', '1-5');
      break;
    case 'def_open':
      keys.push('open', 'aggressive defence', 'aggressive defense');
      break;
    case 'def_double_mark':
      keys.push('double', 'double mark', 'double marking');
      break;
    default:
      break;
  }
  switch (a) {
    case 'att_structured':
      keys.push('structured', '6v6', 'set attack');
      break;
    case 'att_fast_break':
      keys.push('fast break', 'counter', 'counter-attack', 'tempogegen');
      break;
    case 'att_second_wave':
      keys.push('second wave', 'second-wave');
      break;
    case 'att_quick_centre':
      keys.push('quick centre', 'quick center', 'anwurf');
      break;
    case 'att_crossing':
      keys.push('crossing', 'cross', 'kreuz');
      break;
    case 'att_parallel':
      keys.push('parallel');
      break;
    case 'att_second_pivot':
      keys.push('second pivot', 'zweite');
      break;
    case 'att_7v6':
      keys.push('7v6', '7 vs 6', '7:6');
      break;
    case 'att_empty_goal':
      keys.push('empty goal', 'leerem tor', 'praznim golom');
      break;
    case 'att_two_pivot':
      keys.push('two pivot', 'zwei-kreisläufer', 'dva pivota');
      break;
    case 'att_wing_overload':
      keys.push('wing overload', 'flügel', 'krila');
      break;
    case 'att_backcourt_shooting':
      keys.push('backcourt', 'long range', 'rückraum', 'šut vanjskih');
      break;
    case 'att_isolation':
      keys.push('1v1', 'isolation', 'one against one');
      break;
    case 'att_pivot_cooperation':
      keys.push('pivot', 'kreisläufer', 'playing with the pivot');
      break;
    case 'att_numerical_superiority':
      keys.push('numerical', 'superiority', 'überzahl', 'prednost', 'power play');
      break;
    default:
      break;
  }
  return keys;
}

/** Soft score (0+) — preference is a bias, never a hard filter. */
export function scoreTextForTacticalPrefs(
  text: string,
  defenseId?: string | null,
  attackId?: string | null,
): number {
  const hay = text.toLowerCase();
  let score = 0;
  for (const kw of tacticalPreferenceKeywords(defenseId, attackId)) {
    if (hay.includes(kw.toLowerCase())) score += 1;
  }
  return score;
}

export function isDefenseSystemId(value: string | null | undefined): value is DefenseSystemId {
  return !!value && (DEFENSE_SYSTEMS_V2 as string[]).includes(value);
}

export function isAttackStyleId(value: string | null | undefined): value is AttackStyleId {
  return !!value && (ATTACK_STYLES_V2 as string[]).includes(value);
}

/** Normalize any stored defence preference to a canonical ID (or null if unknown/empty). */
export function normalizeDefenseSystemId(
  value: string | null | undefined,
): DefenseSystemId | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return 'none';
  return DEFENSE_ALIASES[trimmed] ?? DEFENSE_ALIASES[trimmed.toLowerCase()] ?? null;
}

/** Normalize any stored attack preference to a canonical ID (or null if unknown/empty). */
export function normalizeAttackStyleId(
  value: string | null | undefined,
): AttackStyleId | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return 'none';
  return ATTACK_ALIASES[trimmed] ?? ATTACK_ALIASES[trimmed.toLowerCase()] ?? null;
}

export function defenseLabelKey(id: string | null | undefined): string {
  const n = normalizeDefenseSystemId(id);
  return n ? DEFENSE_LABEL_KEYS[n] : 'defense.none';
}

export function attackLabelKey(id: string | null | undefined): string {
  const n = normalizeAttackStyleId(id);
  return n ? ATTACK_LABEL_KEYS[n] : 'attack.none';
}

/** Short hint string for planner / engines (never use as DB id). */
export function defenseEngineHint(id: string | null | undefined): string {
  const n = normalizeDefenseSystemId(id);
  switch (n) {
    case 'def_6_0': return '6:0';
    case 'def_5_1': return '5:1';
    case 'def_3_2_1': return '3:2:1';
    case 'def_3_3': return '3:3';
    case 'def_4_2': return '4:2';
    case 'def_5_plus_1': return '5+1';
    case 'def_4_plus_2': return '4+2';
    case 'def_man_to_man': return 'man-to-man';
    case 'def_1_5': return '1:5';
    case 'def_open': return 'open';
    case 'def_double_mark': return 'double-mark';
    case 'none':
    default:
      return '6:0';
  }
}

export function attackEngineHint(id: string | null | undefined): string {
  const n = normalizeAttackStyleId(id);
  switch (n) {
    case 'att_structured': return 'Structured Attack';
    case 'att_fast_break': return 'Fast Break';
    case 'att_second_wave': return 'Second Wave';
    case 'att_quick_centre': return 'Quick Centre';
    case 'att_crossing': return 'Crossing';
    case 'att_parallel': return 'Parallel Movement';
    case 'att_second_pivot': return 'Second Pivot';
    case 'att_7v6': return '7v6';
    case 'att_empty_goal': return 'Empty Goal';
    case 'att_two_pivot': return 'Two Pivot';
    case 'att_wing_overload': return 'Wing Overload';
    case 'att_backcourt_shooting': return 'Backcourt Shooting';
    case 'att_isolation': return '1v1 Isolation';
    case 'att_pivot_cooperation': return 'Pivot Cooperation';
    case 'att_numerical_superiority': return 'Numerical Superiority';
    case 'none':
    default:
      return 'Structured Attack';
  }
}
