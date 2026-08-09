import type { BankScenario } from '@/content/scenario-bank/types';
import type { HandballPosition } from '@/lib/positions';

export interface ScenarioSemanticFingerprint {
  scenarioFamilyId: string;
  position: string;
  formation: string;
  phase: string;
  decisionType: string;
  tacticalObjective: string;
  correctActionArchetype: string;
  category: string;
  difficulty: string;
  attackOrDefence: string;
}

/** Strip trailing (2)/(3) archetype clones from titles. */
export function canonicalTitleBase(titleEn: string): string {
  return (titleEn ?? '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

/**
 * Canonical scenario family id — meaning-level identity for session diversity.
 * Title base is the bank's archetype key (e.g. "Left Back — Playing With Pivot").
 */
export function getScenarioFamilyId(scenario: BankScenario): string {
  const base = canonicalTitleBase(scenario.title?.en ?? scenario.id);
  return base
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function formationFromText(text: string): string | null {
  const patterns: [RegExp, string][] = [
    [/3\s*:\s*2\s*:\s*1|3-2-1/, '3-2-1'],
    [/5\s*\+\s*1/, '5+1'],
    [/4\s*\+\s*2/, '4+2'],
    [/1\s*:\s*5|1-5/, '1-5'],
    [/5\s*:\s*1|5-1/, '5-1'],
    [/6\s*:\s*0|6-0/, '6-0'],
    [/3\s*:\s*3|3-3/, '3-3'],
    [/4\s*:\s*2|4-2/, '4-2'],
    [/man[- ]to[- ]man|open defen/, 'man-to-man'],
  ];
  for (const [re, id] of patterns) {
    if (re.test(text)) return id;
  }
  return null;
}

export function extractFormation(scenario: BankScenario): string {
  if (scenario.defensiveSystem) return String(scenario.defensiveSystem).toLowerCase();
  // Prefer title (archetype) over situation minute-clones that may disagree
  return (
    formationFromText((scenario.title?.en ?? '').toLowerCase()) ??
    formationFromText((scenario.situation?.en ?? '').toLowerCase()) ??
    'unknown'
  );
}

/** Decision archetype from title suffix after em/en dash, else first skill tag. */
export function getDecisionArchetype(scenario: BankScenario): string {
  const title = canonicalTitleBase(scenario.title?.en ?? '');
  // Only split on em/en dash — ASCII hyphens are part of formations (6-0, 5-1)
  const parts = title.split(/\s*[—–]\s*/);
  const archetype = (parts.length > 1 ? parts.slice(1).join(' — ') : title)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (archetype) return archetype;
  return (scenario.skillTags?.[0] ?? scenario.category ?? 'decision').toLowerCase();
}

export function getCorrectActionArchetype(scenario: BankScenario): string {
  const optimal = scenario.answers?.find((a) => a.quality === 'optimal');
  const text = (optimal?.text?.en ?? '').toLowerCase();
  if (!text) return 'unknown';
  if (/pass.*pivot|feed.*pivot|to the pivot|pivot/.test(text) && /pass|feed|release/.test(text)) {
    return 'pass-pivot';
  }
  if (/wing/.test(text) && /pass|feed|release/.test(text)) return 'pass-wing';
  if (/shot|shoot|jump shot|release the ball/.test(text)) return 'shoot';
  if (/cross/.test(text)) return 'cross';
  if (/1v1|beat|drive|breakthrough/.test(text)) return '1v1';
  if (/hold|reset|patience|scan/.test(text)) return 'hold-scan';
  if (/defend|block|recover|track/.test(text)) return 'defend';
  return text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 6)
    .join('-');
}

export function buildSemanticFingerprint(scenario: BankScenario): ScenarioSemanticFingerprint {
  return {
    scenarioFamilyId: getScenarioFamilyId(scenario),
    position: String(scenario.primaryPosition ?? ''),
    formation: extractFormation(scenario),
    phase: String(scenario.matchPhase ?? 'open'),
    decisionType: getDecisionArchetype(scenario),
    tacticalObjective: (scenario.skillTags ?? []).slice(0, 2).join('+') || scenario.category,
    correctActionArchetype: getCorrectActionArchetype(scenario),
    category: scenario.category,
    difficulty: scenario.difficulty,
    attackOrDefence: scenario.attackOrDefence,
  };
}

export function logScenarioSelectionDiagnostics(
  scenarios: BankScenario[],
  label = 'session',
): void {
  if (typeof __DEV__ !== 'undefined' && !__DEV__) return;
  console.log(`[session-diversity] ${label} n=${scenarios.length}`);
  for (const s of scenarios) {
    const fp = buildSemanticFingerprint(s);
    const optimal = s.answers?.find((a) => a.quality === 'optimal');
    console.log({
      id: s.id,
      title: s.title?.en,
      question: s.question?.en,
      category: s.category,
      subCategory: fp.decisionType,
      positionTags: [s.primaryPosition, ...(s.secondaryPositions ?? [])],
      goalTags: s.skillTags ?? [],
      difficulty: s.difficulty,
      correctAnswer: optimal?.text?.en,
      decisionArchetype: fp.decisionType,
      formation: fp.formation,
      scenarioFamilyId: fp.scenarioFamilyId,
      situationSignature: (s.situation?.en ?? '').slice(0, 120),
    });
  }
}

function softDiversityPenalty(
  s: BankScenario,
  picked: BankScenario[],
  counts: {
    difficulty: Map<string, number>;
    phase: Map<string, number>;
    formation: Map<string, number>;
    skill: Map<string, number>;
  },
): number {
  let penalty = 0;
  if ((counts.difficulty.get(s.difficulty) ?? 0) >= 2) penalty += 2;
  if ((counts.phase.get(String(s.matchPhase)) ?? 0) >= 2) penalty += 1;
  if ((counts.formation.get(extractFormation(s)) ?? 0) >= 2) penalty += 2;
  const skill = s.skillTags?.[0] ?? s.category;
  if ((counts.skill.get(skill) ?? 0) >= 2) penalty += 1;
  if (picked.length > 0) {
    const prev = picked[picked.length - 1];
    if (prev.category === s.category) penalty += 1;
  }
  return penalty;
}

/**
 * Pick a diverse session without semantic replacement.
 * Rules:
 * - max 1 per scenarioFamilyId
 * - max 1 per bank id
 * - no Goalkeeper primary for non-GK positions
 * - avoid consecutive same formation + same decision archetype
 * - ≤2 from same tactical category in a short session (≤5)
 * - prefer position-specific rows already ranked higher by caller
 * - soften repeats of difficulty / phase / formation / skill
 * - shorten session rather than pad with near-duplicates
 */
export function pickDiverseSessionScenarios(
  ranked: BankScenario[],
  count: number,
  position: HandballPosition,
): BankScenario[] {
  const maxPerCategory = count <= 5 ? 2 : Math.max(2, Math.ceil(count * 0.4));
  const seenIds = new Set<string>();
  const seenFamilies = new Set<string>();
  const categoryCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const phaseCounts = new Map<string, number>();
  const formationCounts = new Map<string, number>();
  const skillCounts = new Map<string, number>();
  const picked: BankScenario[] = [];

  const primary = ranked.filter((s) => s.primaryPosition === position);
  const secondary = ranked.filter((s) => s.primaryPosition !== position);
  const ordered = [...primary, ...secondary];

  const tryPick = (allowSoftRepeats: boolean) => {
    for (const s of ordered) {
      if (picked.length >= count) break;
      if (!s?.id || seenIds.has(s.id)) continue;
      if (s.primaryPosition === 'Goalkeeper' && position !== 'Goalkeeper') continue;

      const family = getScenarioFamilyId(s);
      if (seenFamilies.has(family)) continue;

      const cat = s.category;
      // Position banks use category === position (e.g. "Right Back"). Do not
      // starve 5-question sessions by capping that category at 2.
      const positionCategoryCap =
        cat === position || s.primaryPosition === position ? count : maxPerCategory;
      if ((categoryCounts.get(cat) ?? 0) >= positionCategoryCap) continue;

      if (picked.length > 0) {
        const prev = picked[picked.length - 1];
        if (
          extractFormation(prev) === extractFormation(s) &&
          getDecisionArchetype(prev) === getDecisionArchetype(s)
        ) {
          continue;
        }
      }

      if (!allowSoftRepeats) {
        const penalty = softDiversityPenalty(s, picked, {
          difficulty: difficultyCounts,
          phase: phaseCounts,
          formation: formationCounts,
          skill: skillCounts,
        });
        // Defer high-penalty clones when we still have room to find better options later
        if (penalty >= 3 && picked.length < count - 1) continue;
      }

      seenIds.add(s.id);
      seenFamilies.add(family);
      categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
      difficultyCounts.set(s.difficulty, (difficultyCounts.get(s.difficulty) ?? 0) + 1);
      phaseCounts.set(String(s.matchPhase), (phaseCounts.get(String(s.matchPhase)) ?? 0) + 1);
      formationCounts.set(extractFormation(s), (formationCounts.get(extractFormation(s)) ?? 0) + 1);
      const skill = s.skillTags?.[0] ?? s.category;
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
      picked.push(s);
    }
  };

  tryPick(false);
  if (picked.length < count) tryPick(true);

  return picked;
}
