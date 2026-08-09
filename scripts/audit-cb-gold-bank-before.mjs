#!/usr/bin/env node
/**
 * One-shot Centre Back bank audit (pre gold-standard rebuild).
 * Mirrors LB/RB validator family-id / coverage / HR / perception methods.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

function getScenarioFamilyId(scenario) {
  const base = (scenario.title?.en ?? scenario.id).replace(/\s*\(\d+\)\s*$/, '').trim();
  return base
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip defence system names for semantic title clustering */
function semanticTitleKey(titleEn) {
  return (titleEn ?? '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .toLowerCase()
    .replace(/[—–]/g, ' ')
    .replace(/\b(6\s*:\s*0|6-0|5\s*:\s*1|5-1|3\s*:\s*2\s*:\s*1|3-2-1|3\s*:\s*3|3-3|4\s*:\s*2|4-2|1\s*:\s*5|1-5|5\s*\+\s*1|4\s*\+\s*2|man-to-man|open defen(?:ce|se)?|individual)\b/gi, '')
    .replace(/\bvs\b/gi, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const FORBIDDEN =
  /tuljan|brtva|\bosovin|novinar|\btisak\b|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|sporni šut|\bu hvatu\b|\bHvatate\b|\bPrimate\b|čovjek na čovjeka|dugopas|preko fronta|istaknuti branič|niska trojka|niske trojke|pucaj prirodnu liniju|pokojni branič|zaprljan|zujalic|krivotvor|Innenverteidiger/i;

const VI_FORM =
  /\b(morate|imate|smijete|napadate|držite|čitate|primite|Hvatate|Primate|Odmaknite|Napadnite|Napadate|Morate|Imate|Smijete|Pročitajte)\b|Vaš\s|vaš\s|\bvašim\b|\bVašim\b|\bvašeg\b|\bVašeg\b|\bvam se\b/;

const RAW_EN_IN_HR =
  /\b(gap|wingback|pick and roll|through ball|crosscourt|man-to-man|first wave|second wave|passive warning|left-hander|right-hander|half-space|strong side|weak side|feed|release|keeper|power-?play)\b/i;

const FOOTBALL =
  /\b(midfielder|striker|winger|fullback|centre-?back|center-?back|through ball|crosscourt|pick and roll|wingback)\b/i;

const MT_MARKERS =
  /Innenverteidiger|osnovna promjena|Osnovna |protiv 6:0|You are|the defence|the defense|Ballverschiebung|Grundlegende/i;

const DEF_SYSTEMS = {
  '6:0': /6:0|6-0/,
  '5:1': /5:1|5-1/,
  '3:2:1': /3:2:1|3-2-1/,
  '3:3': /3:3|3-3/,
  '4:2': /4:2|4-2/,
  '1:5': /1:5|1-5/,
  '5+1': /5\+1/,
  '4+2': /4\+2/,
  // Avoid false positive on HR "otvorene strane" (open side of attack)
  'open/individual': /man-to-man|open defen(?:ce|se)|individualn(?:a|e|i)?\s+obran|čovjek na čovjeka|otvoren(?:a|e|u)\s+obran/i,
};

const NUMERICAL = {
  '6v5': /6v5|6 na 5|6-on-5|igračem više|igrač više|player-up/i,
  // Exclude "short-handed defender" (describes opponent in 6v5)
  '5v6': /5v6|5 na 6|5-on-6|igračem manje|igrač manje|short-handed/i,
  '7v6': /7v6|7 na 6|7 against 6|second.?pivot|drugog pivota|two pivots|dva pivota/i,
  empty_goal: /empty goal|prazan gol|empty.?net|vratar (van|izvan)|goalkeeper (out|off)/i,
  second_pivot: /second.?pivot|drugog? pivota|drugi pivot/i,
  two_pivots: /two pivots|dva pivota|oba pivota/i,
};

const TRANSITION = {
  transition_attack: /first wave|polukontra|second wave|partially|tranzicij|kontranapad|fast break|brzi napad|brze prodore/i,
  transition_defence: /recover|povratak|deny|protect centr|prvi u povratku|first player back|transition defen|prijelazne obrane|Übergangsverteidigung/i,
};

const GAME_STATE = {
  lead_late: /lead|vodi|Vodite|ahead|winning|štiti vodstvo|Protecting a Lead/i,
  trail_late: /trail|gubi|Gubite|behind|losing|zaostaje|When Trailing/i,
  tie_late: /tie|Neriješeno|level|draw|\bEVEN\b/i,
  // True passive-play rule — not "passive holds" distractor wording
  passive: /passive play|passive warning|pasivn(?:a|e|i)?\s+(igra|upozoren)|znak pasiv/i,
  seconds_remaining: /\d+\s*seconds|\d+\s*sekund|final possession|Final Minutes|kasno|zadnjem|shot clock/i,
};

const THEMES = {
  pivot_cooperation: /pivot|kreisläufer|zatvor|seal/i,
  wing_cooperation: /wing|krilo|außen|Rechtsaußen|Linksaußen/i,
  crossing_or_parallel: /cross(?:ing)?|križanj|parallel|paralel/i,
  '7v6': /7v6|7 na 6|second.?pivot|drugog pivota/i,
  passive: /passive play|passive warning|pasivn(?:a|e|i)?\s+(igra|upozoren)|znak pasiv/i,
  end_game: /Final Minutes|final possession|kasno|18 sekund|14 sekund|90 sekund|\d+\s*seconds|konačnog posjeda/i,
  gk_reading: /goalkeeper|vratar|\bGK\b|keeper pattern|block arm|kut vratara|reading the (gk|goalkeeper)/i,
};

// RB-style perception regex (+ perception skillTag)
const perceptionRe =
  /čitaš|prvi signal|koji je signal|koji je prvi signal|gdje nastaje|što ti pokazuje|što ti (kut|položaj)|koji branič mora|koji se prostor|što se promijenilo|koju opciju|ne križaš|otvoriti sljedeća|što vratar|što ti kut/i;

const cb = bank.filter((s) => s.primaryPosition === 'Centre Back');

function hrBlob(s) {
  return [
    s.title?.hr,
    s.situation?.hr,
    s.question?.hr,
    s.explanation?.hr,
    ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr]),
  ]
    .filter(Boolean)
    .join('\n');
}

function enBlob(s) {
  return `${s.title?.en || ''} ${s.situation?.en || ''} ${s.question?.en || ''} ${s.explanation?.en || ''}`;
}

function allTextBlob(s) {
  return `${enBlob(s)} ${hrBlob(s)}`;
}

// Families
const families = new Map();
for (const s of cb) {
  const fid = getScenarioFamilyId(s);
  if (!families.has(fid)) families.set(fid, []);
  families.get(fid).push(s.id);
}
const cloneFamilies = [...families.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([familyId, ids]) => ({ familyId, ids, count: ids.length }));

// Exact duplicates
const fps = new Map();
const exactDuplicates = [];
for (const s of cb) {
  const fp = createHash('sha1')
    .update(`${s.title?.en}|${s.situation?.en}|${s.question?.en}`)
    .digest('hex')
    .slice(0, 12);
  if (fps.has(fp)) {
    exactDuplicates.push({ hash: fp, firstId: fps.get(fp), duplicateId: s.id });
  } else {
    fps.set(fp, s.id);
  }
}

// Semantic duplicates (titles after stripping defence systems)
const semMap = new Map();
for (const s of cb) {
  const key = semanticTitleKey(s.title?.en);
  if (!semMap.has(key)) semMap.set(key, []);
  semMap.get(key).push({ id: s.id, title: s.title?.en });
}
const semanticDuplicates = [...semMap.entries()]
  .filter(([, items]) => items.length > 1)
  .map(([key, items]) => ({ semanticKey: key, items }))
  .sort((a, b) => b.items.length - a.items.length);

const attack = cb.filter((s) => s.attackOrDefence === 'Attack').length;
const defence = cb.filter((s) => s.attackOrDefence === 'Defence').length;
const defencePct = Math.round((defence / (cb.length || 1)) * 1000) / 10;

const difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [d, cb.filter((s) => s.difficulty === d).length]),
);

const perceptionIds = cb
  .filter((s) => perceptionRe.test(s.question?.hr || '') || (s.skillTags || []).includes('perception'))
  .map((s) => s.id);
const perceptionCount = perceptionIds.length;
const perceptionPct = Math.round((perceptionCount / (cb.length || 1)) * 1000) / 10;

const blobAll = cb.map((s) => `${s.title?.en} ${s.situation?.en} ${s.situation?.hr} ${s.question?.hr}`).join('\n');

function coverageMap(defs, postFilter) {
  const out = {};
  for (const [name, re] of Object.entries(defs)) {
    let matching = cb.filter((s) => re.test(allTextBlob(s)));
    if (postFilter?.[name]) matching = matching.filter((s) => postFilter[name](s));
    const ids = matching.map((s) => s.id);
    out[name] = { present: ids.length > 0, count: ids.length, sampleIds: ids.slice(0, 5) };
  }
  return out;
}

const defensiveSystemCoverage = coverageMap(DEF_SYSTEMS);
const numericalCoverage = coverageMap(NUMERICAL, {
  // 6-on-5 family mentions "short-handed defender" — not true 5v6 attack
  '5v6': (s) => {
    const b = allTextBlob(s);
    if (/5v6|5 na 6|5-on-6|igračem manje|igrač manje/i.test(b)) return true;
    if (/short-handed/i.test(b) && !/short-handed defender/i.test(b)) return true;
    return false;
  },
});
const transitionCoverage = coverageMap(TRANSITION);
const gameStateCoverage = coverageMap(GAME_STATE);
const themeCoverage = coverageMap(THEMES);

// Also list present vs missing systems as requested
const systemsPresent = Object.entries(defensiveSystemCoverage)
  .filter(([, v]) => v.present)
  .map(([k]) => k);
const systemsMissing = Object.entries(defensiveSystemCoverage)
  .filter(([, v]) => !v.present)
  .map(([k]) => k);

// HR terminology problems
const hrProblems = [];
for (const s of cb) {
  const hr = hrBlob(s);
  const en = enBlob(s);
  const issues = [];
  const forb = hr.match(FORBIDDEN);
  if (forb) issues.push({ type: 'forbidden_hr', match: forb[0] });
  const vi = hr.match(VI_FORM);
  if (vi) issues.push({ type: 'vi_form', match: vi[0] });
  const rawEn = hr.match(RAW_EN_IN_HR);
  if (rawEn) issues.push({ type: 'raw_en_in_hr', match: rawEn[0] });
  const foot = `${hr}\n${en}`.match(FOOTBALL);
  if (foot) issues.push({ type: 'football_term', match: foot[0] });
  // DE "Innenverteidiger" in DE title is football CB — flag if in any locale
  if (/Innenverteidiger/i.test(`${s.title?.de || ''} ${s.title?.hr || ''} ${hr}`)) {
    issues.push({ type: 'football_de_title', match: 'Innenverteidiger' });
  }
  if (/Centre Back|Center Back|centre back/i.test(s.title?.hr || '')) {
    issues.push({ type: 'en_position_in_hr_title', match: s.title?.hr });
  }
  // Capitalization / MT smells in HR title
  if (/^[a-z]/.test(s.title?.hr || '')) {
    issues.push({ type: 'hr_title_lowercase_start', match: s.title?.hr });
  }
  if (MT_MARKERS.test(hr) || /Ballverschiebung|Grundlegende/.test(s.title?.de || '')) {
    issues.push({ type: 'mt_smell', match: (hr.match(MT_MARKERS) || [s.title?.de])[0] });
  }
  // Mixed ti/vi: formal imperative with informal
  const hasTi = /\b(primaš|imaš|čitaš|napadaš|držiš|što prvo|kada |kako )\b/i.test(hr);
  const hasVi = VI_FORM.test(hr);
  if (hasTi && hasVi) issues.push({ type: 'ti_vi_mix', match: 'both ti and vi forms' });

  if (issues.length) {
    hrProblems.push({ id: s.id, titleEn: s.title?.en, titleHr: s.title?.hr, issues });
  }
}

// Weak distractors / multiple equally correct — heuristic + curated qualitative
const weakAnswerSamples = [];
for (const s of cb) {
  const answers = s.answers || [];
  const opt = answers.find((a) => a.quality === 'optimal');
  const good = answers.find((a) => a.quality === 'good');
  const notes = [];
  if (!opt) notes.push('missing optimal');
  const opts = answers.filter((a) => a.quality === 'optimal');
  if (opts.length !== 1) notes.push(`optimal count ${opts.length}`);
  if (opt && good) {
    const o = (opt.text?.en || '').toLowerCase();
    const g = (good.text?.en || '').toLowerCase();
    const oWords = o.split(/\s+/).filter((w) => w.length > 4);
    const shared = oWords.filter((w) => g.includes(w)).length;
    if (shared >= 5) notes.push(`optimal/good share ${shared} long words — possibly equally correct`);
    // Both say "shift/move ball" or both are tempo-control platitudes
    if (/shift the ball|move the ball|structured|stay calm|best available/i.test(o) && /shift|move the ball|structure|quick attack|decisive pass/i.test(g)) {
      notes.push('optimal and good both plausible system answers — thin single-best cue');
    }
  }
  for (const a of answers) {
    const t = a.text?.en || '';
    if (/^always\b|^never\b|refuse to shoot|stop playing|argue with|do nothing|panic|protest the turnover/i.test(t)) {
      notes.push(`cartoon/weak distractor (${a.quality}): ${t.slice(0, 90)}`);
    }
    if ((a.quality === 'poor' || a.quality === 'risky') && t.length < 28) {
      notes.push(`short ${a.quality} distractor: ${t}`);
    }
  }
  const quals = answers.map((a) => a.quality);
  if (!quals.includes('good') || !quals.includes('risky') || !quals.includes('poor')) {
    notes.push(`missing quality ladder: ${quals.join(',')}`);
  }
  if (opt && /stay calm|call one clear structure|best available system|structured build-up/i.test(opt.text?.en || '')) {
    notes.push('vague/coaching-platitude optimal — weak cue specificity');
  }
  if (notes.length) {
    weakAnswerSamples.push({
      id: s.id,
      titleEn: s.title?.en,
      questionEn: s.question?.en,
      optimalEn: opt?.text?.en,
      goodEn: good?.text?.en,
      notes,
    });
  }
}

/** Deduped qualitative samples (one per family) for the audit narrative */
const qualitativeWeakSamples = [
  {
    id: 'scn_bank_202',
    titleEn: 'Centre Back — Basic Ball Shift vs 6:0',
    issue:
      'Optimal ("Shift the ball once…") and good ("Threaten a drive first… then shift") are both correct CB habits; situation lacks a cue that uniquely ranks one above the other.',
  },
  {
    id: 'scn_bank_205',
    titleEn: 'Centre Back — Building the Pivot Connection',
    issue:
      'Good ("Shoot if the fake makes both half-backs drop") can be equally correct when the cue is only "narrow lane into the seal"; no half-step timing cue forces pass-first.',
  },
  {
    id: 'scn_bank_206',
    titleEn: 'Centre Back — Tempo When Protecting a Lead',
    issue:
      'Optimal and good are both tempo-control coaching advice; "clear gaps" vs "clear break" are nearly interchangeable without a concrete read.',
  },
  {
    id: 'scn_bank_212',
    titleEn: 'Centre Back — Final Possession Execution',
    issue:
      'Optimal (take best system shot) vs good (one decisive pass then finish) are both correct final-possession standards; situation says both a playable gap AND eight seconds — either can be right.',
  },
  {
    id: 'scn_bank_213',
    titleEn: 'Centre Back — Calm Direction When Trailing',
    issue:
      'Optimal is a pure coaching platitude ("Stay calm, call one clear structure…") with no tactical cue; good is a more specific tempo choice and may be stronger.',
  },
  {
    id: 'scn_bank_210',
    titleEn: 'Centre Back — Organising Transition Defence',
    issue:
      'Poor ("Stop to protest the turnover…") is a cartoon distractor; optimal vs good (delay centre vs cut far-wing skip) both viable without a clearer first-threat cue.',
  },
];

// qualityScore distribution (stored field — not trusted)
const qsBuckets = {};
for (const s of cb) {
  const q = s.qualityScore ?? 'null';
  qsBuckets[q] = (qsBuckets[q] || 0) + 1;
}
const qualityScores = cb.map((s) => s.qualityScore).filter((n) => typeof n === 'number');
const qualityScoreDistribution = {
  note: 'Stored qualityScore field — NOT trusted; often inflated vs Rubric 2.0',
  buckets: qsBuckets,
  min: qualityScores.length ? Math.min(...qualityScores) : null,
  max: qualityScores.length ? Math.max(...qualityScores) : null,
  avg:
    qualityScores.length
      ? Math.round((qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length) * 10) / 10
      : null,
};

const allTitles = cb.map((s) => ({ id: s.id, titleEn: s.title?.en }));

const goldFamilyStructure = {
  source: 'scripts/scenario-bank/data/left-back-gold-families-a.mjs (+ RB adds handedness)',
  requiredFields: [
    'familyKey',
    'title (L10n: en/hr/de)',
    'difficulty',
    'pressureLevel',
    'attackOrDefence',
    'matchPhase',
    'minute',
    'score',
    'defensiveSystem (optional enum)',
    'skillTags',
    'perception (boolean)',
    'numerical',
    'gameState',
    'situation (L10n)',
    'question (L10n)',
    'answers (4x quality ladder optimal/good/risky/poor with text+feedback L10n)',
    'explanation (L10n)',
    'human { singleBestOk, cueSpecific, gameStateExplicit, rubricBias }',
  ],
  rbExtraFields: ['handedness: left|right|none'],
  familyIdMethod:
    "title.en strip trailing (N), lower, replace —/– with '-', collapse whitespace (validators + lib/platform/scenario-family.ts)",
};

// Sample a few scenarios for narrative weak-answer notes (first 8 with notes + 3 random high-score)
const weakSample = weakAnswerSamples.slice(0, 12);

const report = {
  auditedAt: new Date().toISOString(),
  position: 'Centre Back',
  totalCount: cb.length,
  trueUniqueFamilies: families.size,
  cloneFamilies,
  cloneFamilyCount: cloneFamilies.length,
  exactDuplicates,
  exactDuplicateCount: exactDuplicates.length,
  semanticDuplicates,
  semanticDuplicateClusterCount: semanticDuplicates.length,
  attackCount: attack,
  defenceCount: defence,
  defencePct,
  difficulty,
  perception: {
    count: perceptionCount,
    pct: perceptionPct,
    method: 'RB validator perception regex on question.hr OR skillTags includes perception',
    ids: perceptionIds,
  },
  defensiveSystemCoverage: {
    present: systemsPresent,
    missing: systemsMissing,
    detail: defensiveSystemCoverage,
  },
  numericalSituationCoverage: numericalCoverage,
  transitionCoverage,
  gameStateCoverage,
  themeCoverage: {
    pivot_cooperation: themeCoverage.pivot_cooperation,
    wing_cooperation: themeCoverage.wing_cooperation,
    crossing_or_parallel: themeCoverage.crossing_or_parallel,
    '7v6': themeCoverage['7v6'],
    passive: themeCoverage.passive,
    end_game: themeCoverage.end_game,
    gk_reading: themeCoverage.gk_reading,
  },
  hrTerminologyProblems: {
    scenariosWithIssues: hrProblems.length,
    sample: hrProblems.slice(0, 25),
    allIssueCounts: hrProblems.reduce((acc, row) => {
      for (const i of row.issues) acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {}),
    illustrativeExcerpts: [
      {
        id: 'scn_bank_203',
        problem: 'Football CB calque in HR title',
        text: 'Središnja stražnja strana — odabir otvorene strane (should be srednji vanjski)',
      },
      {
        id: 'scn_bank_205',
        problem: 'MT garbage + forbidden seal/feed terms',
        text: 'title: izgradnja zakretne veze; Q: Kako stvarate čistu hranu u brtvilu?; sit: pivot brtvi… kao playmakera',
      },
      {
        id: 'scn_bank_207',
        problem: 'tisak/press calque + vi-form hvatate',
        text: 'Razbijanje 5:1 prednjeg tiska; Njihov prednji branič napada vas dok hvatate vrh',
      },
      {
        id: 'scn_bank_209',
        problem: 'Football/MT: hitac, zakretne brtve, kratkim rukama',
        text: 'Kako brojčanu prednost pretvoriti u hitac?; Jedan branič s kratkim rukama…; zakretne brtve lijevo od sredine',
      },
      {
        id: 'scn_bank_210',
        problem: 'vi-forms throughout defence family',
        text: 'Vi ste najdublji igrač… Vaši suigrači… (should be ti/coach register)',
      },
      {
        id: 'scn_bank_211',
        problem: 'MT: stražnji dio / help slides',
        text: 'oslobođeni stražnji dio ima prozor… prije slajdova za pomoć',
      },
      {
        id: 'scn_bank_212',
        problem: 'MT: poleđina for backcourt player',
        text: 'Jedna poleđina ima razmak koji se može igrati',
      },
      {
        id: 'scn_bank_202',
        problem: 'DE football position + HR ti/vi mix',
        text: 'DE title Innenverteidiger; HR: Primate… čeka tvoju prvu akciju',
      },
      {
        id: 'scn_bank_204',
        problem: 'Untranslated English Compacta',
        text: 'Organiziranje Tempa protiv Compacta 6:0',
      },
      {
        id: 'scn_bank_213',
        problem: 'Odd HR title + mixed address',
        text: 'srednji vanjski dio — smiren smjer; Suigrači očekuju od vas…',
      },
    ],
  },
  weakAnswerOrAmbiguousSamples: {
    scenariosFlagged: weakAnswerSamples.length,
    heuristicSample: weakSample,
    qualitativeSample: qualitativeWeakSamples,
  },
  coverageNotes: {
    '5v6':
      'False positive risk: "short-handed defender" in 6-on-5 family. Corrected regex treats true 5v6 as missing.',
    'open/individual':
      'Earlier "otvoren" hits were "otvorene strane" (open side), not open/individual defence. Corrected to missing.',
    passive:
      'Earlier hits were "pasivna držanja" / "passive holds" in poor-answer feedback, not the passive-play rule. Corrected to missing.',
    gk_reading:
      'Tightened away from generic "blok/block" (screens). Remaining hits require GK/vratar language.',
  },
  qualityScoreDistribution,
  allTitles,
  goldFamilyStructure,
  packageScriptsRelated: {
    'build:left-back-gold-bank': 'node scripts/build-left-back-gold-bank.mjs',
    'validate:left-back-gold-bank': 'node scripts/validate-left-back-gold-bank.mjs',
    'build:right-back-gold-bank': 'node scripts/build-right-back-gold-bank.mjs',
    'validate:right-back-gold-bank': 'node scripts/validate-right-back-gold-bank.mjs',
    note: 'No CB gold build/validate scripts exist yet',
  },
};

const outPath = join(root, 'scripts/cb-gold-bank-audit-before.json');
writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify(
    {
      outPath,
      totalCount: report.totalCount,
      trueUniqueFamilies: report.trueUniqueFamilies,
      cloneFamilyCount: report.cloneFamilyCount,
      exactDuplicateCount: report.exactDuplicateCount,
      semanticDuplicateClusterCount: report.semanticDuplicateClusterCount,
      attack: report.attackCount,
      defence: report.defenceCount,
      defencePct: report.defencePct,
      difficulty: report.difficulty,
      perceptionPct: report.perception.pct,
      systemsPresent: report.defensiveSystemCoverage.present,
      systemsMissing: report.defensiveSystemCoverage.missing,
      hrIssues: report.hrTerminologyProblems.scenariosWithIssues,
      weakFlagged: report.weakAnswerOrAmbiguousSamples.scenariosFlagged,
      qualityScore: report.qualityScoreDistribution,
    },
    null,
    2,
  ),
);
