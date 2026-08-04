// ── Admin Storage Layer ───────────────────────────────────────────────────────
// Local-storage-backed scenario management for the Admin Panel.
// Designed to migrate to Supabase later — every type maps 1:1 to a table row.

import { HandballPosition, AgeGroup, PlayingLevel } from './positions';
import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export type ScenarioStatus = 'Published' | 'Draft' | 'Archived';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type MatchPhase = 'First Half' | 'Second Half' | 'Overtime' | 'Warmup';
export type AttackOrDefence = 'Attack' | 'Defence';
export type DefensiveSystem = '6-0' | '5-1' | '4-2' | '3-2-1' | 'Man-to-Man' | 'Mixed';
export type PressureLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface AdminScenario {
  id: string;
  title: string;
  position: HandballPosition | 'All';
  secondaryPositions: HandballPosition[];
  category: string;
  difficulty: Difficulty;
  ageGroup: AgeGroup | 'All';
  playingLevel: PlayingLevel | 'All';
  status: ScenarioStatus;
  matchPhase: MatchPhase;
  minute: number;
  score: string;
  attackOrDefence: AttackOrDefence;
  playersOnCourt: number;
  defensiveSystem: DefensiveSystem;
  situation: string;
  question: string;
  answerOptions: string[];
  recommendedAnswer: number;
  explanation: string;
  learningObjective: string;
  mentalSkill: string;
  tacticalSkill: string;
  commonMistake: string;
  coachNote: string;
  pressureLevel: PressureLevel;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deleted?: boolean;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  invalid: number;
  duplicates: number;
  errors: string[];
}

export interface ContentStats {
  total: number;
  active: number;
  archived: number;
  drafts: number;
  byPosition: Record<string, number>;
  byDifficulty: Record<string, number>;
  byCategory: Record<string, number>;
  recentlyCreated: AdminScenario[];
  recentlyEdited: AdminScenario[];
  publishedVsDraft: { published: number; draft: number; archived: number };
  averageDifficulty: string;
  warnings: string[];
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const SCENARIOS_KEY = 'hbiq_admin_scenarios';
const ADMIN_SESSION_KEY = 'hbiq_admin_session';
const MIGRATION_KEY = 'hbiq_admin_migrated_v1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
  } catch {}
  return fallback;
}

function setItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

function generateId(): string {
  return `scn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ── Migration ─────────────────────────────────────────────────────────────────
// One-time migration: seed default scenarios from the match engine templates
// if no admin scenarios exist yet. Marks migration complete so we never re-seed.

export function migrateOldScenarios(): void {
  const migrated = getItem<boolean>(MIGRATION_KEY, false);
  if (migrated) return;

  const existing = loadScenarios();
  if (existing.length > 0) {
    setItem(MIGRATION_KEY, true);
    return;
  }

  // Seed a handful of starter scenarios so the admin panel isn't empty.
  const seeded = createSeedScenarios();
  setItem(SCENARIOS_KEY, seeded);
  setItem(MIGRATION_KEY, true);
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export function loadScenarios(includeDeleted = false): AdminScenario[] {
  const all = getItem<AdminScenario[]>(SCENARIOS_KEY, []);
  return includeDeleted ? all : all.filter((s) => !s.deleted);
}

export function loadScenario(id: string): AdminScenario | null {
  return loadScenarios(true).find((s) => s.id === id) ?? null;
}

export function saveScenario(scenario: AdminScenario): void {
  const all = loadScenarios(true);
  const idx = all.findIndex((s) => s.id === scenario.id);
  if (idx >= 0) {
    all[idx] = scenario;
  } else {
    all.unshift(scenario);
  }
  setItem(SCENARIOS_KEY, all);
}

export function createScenario(partial: Partial<AdminScenario>): AdminScenario {
  const now = nowISO();
  const scenario: AdminScenario = {
    id: generateId(),
    title: partial.title ?? 'Untitled Scenario',
    position: partial.position ?? 'Goalkeeper',
    secondaryPositions: partial.secondaryPositions ?? [],
    category: partial.category ?? 'General',
    difficulty: partial.difficulty ?? 'Intermediate',
    ageGroup: partial.ageGroup ?? 'All',
    playingLevel: partial.playingLevel ?? 'All',
    status: partial.status ?? 'Draft',
    matchPhase: partial.matchPhase ?? 'First Half',
    minute: partial.minute ?? 15,
    score: partial.score ?? '12-11',
    attackOrDefence: partial.attackOrDefence ?? 'Defence',
    playersOnCourt: partial.playersOnCourt ?? 7,
    defensiveSystem: partial.defensiveSystem ?? '6-0',
    situation: partial.situation ?? '',
    question: partial.question ?? '',
    answerOptions: partial.answerOptions ?? ['', ''],
    recommendedAnswer: partial.recommendedAnswer ?? 0,
    explanation: partial.explanation ?? '',
    learningObjective: partial.learningObjective ?? '',
    mentalSkill: partial.mentalSkill ?? '',
    tacticalSkill: partial.tacticalSkill ?? '',
    commonMistake: partial.commonMistake ?? '',
    coachNote: partial.coachNote ?? '',
    pressureLevel: partial.pressureLevel ?? 'Moderate',
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin',
  };
  saveScenario(scenario);
  return scenario;
}

export function updateScenario(id: string, updates: Partial<AdminScenario>): AdminScenario | null {
  const all = loadScenarios(true);
  const idx = all.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  // Preserve createdAt, update updatedAt
  const updated: AdminScenario = {
    ...all[idx],
    ...updates,
    id: all[idx].id,
    createdAt: all[idx].createdAt,
    updatedAt: nowISO(),
  };
  all[idx] = updated;
  setItem(SCENARIOS_KEY, all);
  return updated;
}

export function duplicateScenario(id: string): AdminScenario | null {
  const original = loadScenario(id);
  if (!original) return null;
  const now = nowISO();
  const copy: AdminScenario = {
    ...original,
    id: generateId(),
    title: `${original.title} (Copy)`,
    status: 'Draft',
    createdAt: now,
    updatedAt: now,
  };
  saveScenario(copy);
  return copy;
}

export function archiveScenario(id: string): void {
  updateScenario(id, { status: 'Archived' });
}

export function unarchiveScenario(id: string): void {
  updateScenario(id, { status: 'Draft' });
}

export function deleteScenario(id: string): void {
  // Soft delete — keep the row but mark it deleted
  const all = loadScenarios(true);
  const idx = all.findIndex((s) => s.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], deleted: true, updatedAt: nowISO() };
  setItem(SCENARIOS_KEY, all);
}

export function permanentlyDeleteScenario(id: string): void {
  const all = loadScenarios(true).filter((s) => s.id !== id);
  setItem(SCENARIOS_KEY, all);
}

// ── Published scenarios for player app ────────────────────────────────────────

export function loadPublishedScenarios(): AdminScenario[] {
  return loadScenarios().filter((s) => s.status === 'Published');
}

export function loadPublishedScenariosForPosition(position: HandballPosition): AdminScenario[] {
  // Try Supabase first (async), but this sync function returns local fallback
  // The async version is in scenarioService.fetchPublishedScenariosForPosition
  return loadScenarios().filter(
    (s) => s.position === position || s.position === 'All' || s.secondaryPositions.includes(position)
  );
}

// Async version that fetches from Supabase with local fallback
export async function loadPublishedScenariosForPositionAsync(position: HandballPosition): Promise<AdminScenario[]> {
  try {
    const { fetchPublishedScenariosForPosition } = await import('@/services/scenarioService');
    const remote = await fetchPublishedScenariosForPosition(position);
    if (remote.length >= 3) return remote;
  } catch {}
  // Fallback to local
  return loadPublishedScenariosForPosition(position);
}

// ── Import / Export ───────────────────────────────────────────────────────────

export function exportScenarios(): string {
  const scenarios = loadScenarios();
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowISO(),
      scenarios,
    },
    null,
    2
  );
}

export function importScenarios(jsonString: string): ImportResult {
  const result: ImportResult = { imported: 0, skipped: 0, invalid: 0, duplicates: 0, errors: [] };

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    result.invalid = 1;
    result.errors.push('Invalid JSON format.');
    return result;
  }

  // Accept either an array or { scenarios: [...] }
  const list: any[] = Array.isArray(parsed) ? parsed : parsed.scenarios;
  if (!Array.isArray(list)) {
    result.invalid = 1;
    result.errors.push('No scenarios array found in the imported file.');
    return result;
  }

  const existing = loadScenarios(true);
  const existingIds = new Set(existing.map((s) => s.id));

  for (const raw of list) {
    // Validate minimum required fields
    if (!raw || typeof raw !== 'object') {
      result.invalid++;
      result.errors.push('Skipped an invalid entry (not an object).');
      continue;
    }
    if (!raw.title || typeof raw.title !== 'string') {
      result.invalid++;
      result.errors.push(`Skipped entry missing a valid title.`);
      continue;
    }
    if (!raw.question || typeof raw.question !== 'string') {
      result.skipped++;
      continue;
    }
    if (!Array.isArray(raw.answerOptions) || raw.answerOptions.length < 2) {
      result.skipped++;
      continue;
    }

    // Handle duplicate IDs
    let id = raw.id;
    if (id && existingIds.has(id)) {
      result.duplicates++;
      id = generateId();
    }
    if (!id) id = generateId();
    existingIds.add(id);

    const now = nowISO();
    const scenario: AdminScenario = {
      id,
      title: raw.title,
      position: raw.position ?? 'Goalkeeper',
      secondaryPositions: Array.isArray(raw.secondaryPositions) ? raw.secondaryPositions : [],
      category: raw.category ?? 'General',
      difficulty: raw.difficulty ?? 'Intermediate',
      ageGroup: raw.ageGroup ?? 'All',
      playingLevel: raw.playingLevel ?? 'All',
      status: raw.status === 'Published' ? 'Published' : raw.status === 'Archived' ? 'Archived' : 'Draft',
      matchPhase: raw.matchPhase ?? 'First Half',
      minute: typeof raw.minute === 'number' ? raw.minute : 15,
      score: raw.score ?? '12-11',
      attackOrDefence: raw.attackOrDefence === 'Attack' ? 'Attack' : 'Defence',
      playersOnCourt: typeof raw.playersOnCourt === 'number' ? raw.playersOnCourt : 7,
      defensiveSystem: raw.defensiveSystem ?? '6-0',
      situation: raw.situation ?? '',
      question: raw.question,
      answerOptions: raw.answerOptions.filter((a: any) => typeof a === 'string'),
      recommendedAnswer: typeof raw.recommendedAnswer === 'number' ? raw.recommendedAnswer : 0,
      explanation: raw.explanation ?? '',
      learningObjective: raw.learningObjective ?? '',
      mentalSkill: raw.mentalSkill ?? '',
      tacticalSkill: raw.tacticalSkill ?? '',
      commonMistake: raw.commonMistake ?? '',
      coachNote: raw.coachNote ?? '',
      pressureLevel: raw.pressureLevel ?? 'Moderate',
      createdAt: raw.createdAt ?? now,
      updatedAt: now,
      createdBy: raw.createdBy ?? 'import',
    };

    saveScenario(scenario);
    result.imported++;
  }

  return result;
}

// ── Statistics ────────────────────────────────────────────────────────────────

export function getContentStats(): ContentStats {
  const all = loadScenarios();
  const active = all.filter((s) => s.status === 'Published' || s.status === 'Draft');
  const archived = all.filter((s) => s.status === 'Archived');
  const drafts = all.filter((s) => s.status === 'Draft');
  const published = all.filter((s) => s.status === 'Published');

  const byPosition: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const s of all) {
    byPosition[s.position] = (byPosition[s.position] ?? 0) + 1;
    byDifficulty[s.difficulty] = (byDifficulty[s.difficulty] ?? 0) + 1;
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
  }

  const recentlyCreated = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentlyEdited = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  // Average difficulty
  const diffRank: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
  const avgDiff = all.length > 0
    ? all.reduce((s, sc) => s + (diffRank[sc.difficulty] ?? 2), 0) / all.length
    : 2;
  const avgLabel = avgDiff <= 1.5 ? 'Beginner' : avgDiff <= 2.5 ? 'Intermediate' : avgDiff <= 3.5 ? 'Advanced' : 'Expert';

  // Warnings — content gaps
  const warnings: string[] = [];
  const positions: string[] = ['Goalkeeper', 'Left Wing', 'Right Wing', 'Pivot', 'Centre Back', 'Left Back', 'Right Back'];
  for (const pos of positions) {
    const posScenarios = all.filter((s) => s.position === pos);
    if (posScenarios.length === 0) {
      warnings.push(`No scenarios for ${pos}`);
    }
    const profScenarios = posScenarios.filter((s) => s.playingLevel === 'Professional' || s.playingLevel === 'All');
    if (posScenarios.length > 0 && profScenarios.length === 0) {
      warnings.push(`No Professional-level ${pos} scenarios`);
    }
    const u14 = posScenarios.filter((s) => s.ageGroup === 'Under 14' || s.ageGroup === 'All');
    if (posScenarios.length > 0 && u14.length === 0) {
      warnings.push(`No Under 14 ${pos} scenarios`);
    }
  }

  return {
    total: all.length,
    active: active.length,
    archived: archived.length,
    drafts: drafts.length,
    byPosition,
    byDifficulty,
    byCategory,
    recentlyCreated,
    recentlyEdited,
    publishedVsDraft: { published: published.length, draft: drafts.length, archived: archived.length },
    averageDifficulty: avgLabel,
    warnings,
  };
}

// ── Admin session (mocked locally) ────────────────────────────────────────────

export function isAdminLoggedIn(): boolean {
  return getItem<boolean>(ADMIN_SESSION_KEY, false);
}

export function loginAdmin(password: string): boolean {
  // Mocked — accept a simple password for demo purposes
  if (password === 'admin' || password === 'handball') {
    setItem(ADMIN_SESSION_KEY, true);
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  setItem(ADMIN_SESSION_KEY, false);
}

// ── Validation ─────────────────────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateScenario(s: Partial<AdminScenario>): ValidationResult {
  const errors: string[] = [];

  if (!s.title || s.title.trim().length === 0) errors.push('Title is required.');
  if (!s.position) errors.push('Primary Position is required.');
  if (!s.category || s.category.trim().length === 0) errors.push('Category is required.');
  if (!s.difficulty) errors.push('Difficulty is required.');
  if (!s.situation || s.situation.trim().length === 0) errors.push('Situation Description is required.');
  if (!s.question || s.question.trim().length === 0) errors.push('Question is required.');

  const options = (s.answerOptions ?? []).filter((a) => a && a.trim().length > 0);
  if (options.length < 2) errors.push('At least two Answer Options are required.');

  if (s.recommendedAnswer === undefined || s.recommendedAnswer === null || s.recommendedAnswer < 0) {
    errors.push('Recommended Answer is required.');
  } else if (s.answerOptions && s.recommendedAnswer >= s.answerOptions.length) {
    errors.push('Recommended Answer is out of range.');
  }

  if (!s.explanation || s.explanation.trim().length === 0) errors.push('Explanation is required.');
  if (!s.learningObjective || s.learningObjective.trim().length === 0) errors.push('Learning Objective is required.');

  return { isValid: errors.length === 0, errors };
}

// ── Seed scenarios ─────────────────────────────────────────────────────────────

function createSeedScenarios(): AdminScenario[] {
  const now = nowISO();
  const seeds: Partial<AdminScenario>[] = [
    {
      title: 'Wing Shot Read',
      position: 'Goalkeeper',
      category: 'Wing Shots',
      difficulty: 'Intermediate',
      situation: 'The left wing receives a quick pass on the edge. They have a narrow angle but are one-on-one with you. The shot could go short or cross-court.',
      question: 'What is your best positioning response?',
      answerOptions: [
        'Stay centred, react to the shooter\'s shoulder',
        'Step forward to cut the angle',
        'Shift toward the short corner',
        'Drop deep on the goal line',
      ],
      recommendedAnswer: 0,
      explanation: 'At a narrow angle, staying centred gives you the best chance to react to the shot direction.',
      learningObjective: 'Read the shooter\'s shoulder to anticipate shot direction on wing finishes.',
      mentalSkill: 'Reading the Shooter',
      tacticalSkill: 'Angle Management',
      commonMistake: 'Committing to the short corner before the shooter releases the ball.',
      coachNote: 'Emphasise patience — the narrow angle already limits the shooter.',
      pressureLevel: 'Moderate',
      minute: 14,
      status: 'Published',
    },
    {
      title: '7m Throw Under Pressure',
      position: 'Goalkeeper',
      category: '7m Throws',
      difficulty: 'Advanced',
      situation: 'A 7m throw is awarded. The shooter is their top scorer, right-handed, and tends to go high-left. The arena goes quiet.',
      question: 'How do you approach this penalty?',
      answerOptions: [
        'Move slightly right, delay your dive',
        'Dive hard to the left side',
        'Stay centred and react',
        'Step off the line to distract',
      ],
      recommendedAnswer: 0,
      explanation: 'Shading their tendency while delaying gives you a read on the shot direction.',
      learningObjective: 'Use prior information about the shooter without over-committing.',
      mentalSkill: 'Pressure Control',
      tacticalSkill: '7m Technique',
      commonMistake: 'Diving early to the tendency side before the shooter releases.',
      coachNote: 'Remain calm — the pressure is on the shooter, not on you.',
      pressureLevel: 'Critical',
      minute: 28,
      status: 'Published',
    },
    {
      title: 'Reading 6:0 Defence',
      position: 'Centre Back',
      category: 'Reading 6:0 Defence',
      difficulty: 'Intermediate',
      situation: 'The defence is set in a flat 6:0. Your back players are ready to cross. The wing is open on the left side.',
      question: 'What is the best attacking decision?',
      answerOptions: [
        'Cross with the left back, then pass to the wing',
        'Shoot from 9m immediately',
        'Pass directly to the pivot',
        'Hold the ball and wait for movement',
      ],
      recommendedAnswer: 0,
      explanation: 'A crossing action against a flat 6:0 creates gaps and opens the wing for a clean shot.',
      learningObjective: 'Recognise a flat 6:0 defence and exploit the gaps it creates.',
      mentalSkill: 'Defence Reading',
      tacticalSkill: 'Crossing Action',
      commonMistake: 'Shooting immediately from 9m against a set flat defence.',
      coachNote: 'Encourage the crossing action before the final pass.',
      pressureLevel: 'Moderate',
      minute: 18,
      attackOrDefence: 'Attack',
      status: 'Published',
    },
    {
      title: 'Pivot Finishing at Six Metres',
      position: 'Pivot',
      category: 'Finishing at Six Metres',
      difficulty: 'Advanced',
      situation: 'You receive the ball at the 6m line with your back to goal. The defender is behind you. The goalkeeper is positioned centrally.',
      question: 'What is your best finishing option?',
      answerOptions: [
        'Spin and shoot low to the near post',
        'Spin and shoot high cross-court',
        'Pass back to the centre back',
        'Hold and wait for support',
      ],
      recommendedAnswer: 0,
      explanation: 'Pivots often shoot low on the spin — the near post is the highest-percentage finish.',
      learningObjective: 'Choose the highest-percentage finish from the pivot position.',
      mentalSkill: 'Composure',
      tacticalSkill: 'Finishing at Six Metres',
      commonMistake: 'Shooting high cross-court when the goalkeeper is centrally positioned.',
      coachNote: 'Practice the spin-and-shoot-low motion until it becomes automatic.',
      pressureLevel: 'High',
      minute: 22,
      attackOrDefence: 'Attack',
      status: 'Published',
    },
    {
      title: 'Wing Fast Break Timing',
      position: 'Left Wing',
      category: 'Fast Break Timing',
      difficulty: 'Intermediate',
      situation: 'Your team wins the ball. The centre back looks up immediately. You are on the left wing with space ahead.',
      question: 'When do you start your sprint?',
      answerOptions: [
        'Sprint immediately as soon as possession changes',
        'Wait for the centre back to pass, then sprint',
        'Jog forward and wait for the pass',
        'Hold position in case of a turnover',
      ],
      recommendedAnswer: 0,
      explanation: 'Starting the fast break immediately gives you a head start and forces the defence to react.',
      learningObjective: 'Time the fast break sprint to maximise the numerical advantage.',
      mentalSkill: 'Fast Break Timing',
      tacticalSkill: 'Fast Break',
      commonMistake: 'Waiting for the pass before starting the sprint.',
      coachNote: 'The sprint starts the break — not the pass.',
      pressureLevel: 'Low',
      minute: 5,
      attackOrDefence: 'Attack',
      status: 'Published',
    },
  ];

  return seeds.map((s) => ({
    id: generateId(),
    title: s.title!,
    position: s.position!,
    secondaryPositions: s.secondaryPositions ?? [],
    category: s.category!,
    difficulty: s.difficulty!,
    ageGroup: s.ageGroup ?? 'All',
    playingLevel: s.playingLevel ?? 'All',
    status: s.status ?? 'Draft',
    matchPhase: s.matchPhase ?? 'First Half',
    minute: s.minute ?? 15,
    score: s.score ?? '12-11',
    attackOrDefence: s.attackOrDefence ?? 'Defence',
    playersOnCourt: s.playersOnCourt ?? 7,
    defensiveSystem: s.defensiveSystem ?? '6-0',
    situation: s.situation!,
    question: s.question!,
    answerOptions: s.answerOptions!,
    recommendedAnswer: s.recommendedAnswer ?? 0,
    explanation: s.explanation!,
    learningObjective: s.learningObjective!,
    mentalSkill: s.mentalSkill ?? '',
    tacticalSkill: s.tacticalSkill ?? '',
    commonMistake: s.commonMistake ?? '',
    coachNote: s.coachNote ?? '',
    pressureLevel: s.pressureLevel ?? 'Moderate',
    createdAt: now,
    updatedAt: now,
    createdBy: 'seed',
  }));
}

// ── Supabase-synced CRUD ──────────────────────────────────────────────────────
// These functions save to both local storage and Supabase (if configured).
// They fall back to local-only if Supabase is not available.

function toDbRow(s: Partial<AdminScenario>): Record<string, any> {
  return {
    title: s.title,
    position: s.position ?? 'Goalkeeper',
    secondary_positions: s.secondaryPositions ?? [],
    category: s.category ?? 'General',
    difficulty: s.difficulty ?? 'Intermediate',
    age_group: s.ageGroup ?? 'All',
    playing_level: s.playingLevel ?? 'All',
    status: s.status ?? 'Draft',
    match_phase: s.matchPhase ?? 'First Half',
    minute: s.minute ?? 15,
    home_score: null,
    away_score: null,
    attack_or_defence: s.attackOrDefence ?? 'Defence',
    players_on_court: String(s.playersOnCourt ?? 7),
    defensive_system: s.defensiveSystem ?? '6-0',
    situation: s.situation ?? '',
    question: s.question ?? '',
    answer_options: s.answerOptions ?? [],
    recommended_answer: s.recommendedAnswer ?? 0,
    explanation: s.explanation ?? '',
    learning_objective: s.learningObjective ?? '',
    mental_skill: s.mentalSkill ?? null,
    tactical_skill: s.tacticalSkill ?? null,
    common_mistake: s.commonMistake ?? null,
    coach_note: s.coachNote ?? null,
    pressure_level: s.pressureLevel ?? 'Moderate',
  };
}

export async function createScenarioAsync(partial: Partial<AdminScenario>): Promise<{ error: string | null; scenario: AdminScenario | null }> {
  const local = createScenario(partial);
  if (!supabase) return { error: null, scenario: local };
  try {
    const { data, error } = await supabase.from('scenarios').insert(toDbRow(partial)).select('id').single();
    if (error) return { error: error.message, scenario: local };
    // Update local with the real Supabase ID
    if (data) {
      const updated = updateScenario(local.id, { id: data.id });
      return { error: null, scenario: updated ?? local };
    }
    return { error: null, scenario: local };
  } catch (e: any) {
    return { error: e.message, scenario: local };
  }
}

export async function updateScenarioAsync(id: string, updates: Partial<AdminScenario>): Promise<{ error: string | null }> {
  updateScenario(id, updates);
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.from('scenarios').update(toDbRow(updates)).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function archiveScenarioAsync(id: string): Promise<{ error: string | null }> {
  return updateScenarioAsync(id, { status: 'Archived' });
}

export async function deleteScenarioAsync(id: string): Promise<{ error: string | null }> {
  deleteScenario(id);
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.from('scenarios').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function duplicateScenarioAsync(id: string): Promise<{ error: string | null; scenario: AdminScenario | null }> {
  const local = duplicateScenario(id);
  if (!local) return { error: 'Scenario not found.', scenario: null };
  if (!supabase) return { error: null, scenario: local };
  return createScenarioAsync(local);
}

export async function loadScenariosAsync(): Promise<AdminScenario[]> {
  if (!supabase) return loadScenarios();
  try {
    const { data, error } = await supabase.from('scenarios').select('*').is('deleted_at', null).order('updated_at', { ascending: false });
    if (error || !data) return loadScenarios();
    return (data as any[]).map((s) => ({
      id: s.id,
      title: s.title,
      position: s.position,
      secondaryPositions: s.secondary_positions ?? [],
      category: s.category,
      difficulty: s.difficulty,
      ageGroup: s.age_group,
      playingLevel: s.playing_level,
      status: s.status,
      matchPhase: s.match_phase,
      minute: s.minute,
      score: s.home_score != null && s.away_score != null ? `${s.home_score}-${s.away_score}` : '12-11',
      attackOrDefence: s.attack_or_defence,
      playersOnCourt: parseInt(s.players_on_court) || 7,
      defensiveSystem: s.defensive_system,
      situation: s.situation,
      question: s.question,
      answerOptions: s.answer_options ?? [],
      recommendedAnswer: s.recommended_answer,
      explanation: s.explanation,
      learningObjective: s.learning_objective,
      mentalSkill: s.mental_skill ?? '',
      tacticalSkill: s.tactical_skill ?? '',
      commonMistake: s.common_mistake ?? '',
      coachNote: s.coach_note ?? '',
      pressureLevel: s.pressure_level,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      createdBy: s.created_by ?? 'admin',
    }));
  } catch {
    return loadScenarios();
  }
}
