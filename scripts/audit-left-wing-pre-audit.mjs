#!/usr/bin/env node
/**
 * LEFT WING PRE-AUDIT ONLY
 * Read-only. Does not modify content/scenario-bank/scenarios.json.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bankRaw = readFileSync(bankPath, 'utf8');
const bankHashBefore = createHash('sha256').update(bankRaw).digest('hex');
const bank = JSON.parse(bankRaw);

const lw = bank.filter((s) => s.primaryPosition === 'Left Wing');
const lb = bank.filter((s) => s.primaryPosition === 'Left Back');
const rb = bank.filter((s) => s.primaryPosition === 'Right Back');
const cb = bank.filter((s) => s.primaryPosition === 'Centre Back');
const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');

function baseTitle(s) {
  return (s.title?.en || s.id).replace(/\s*\(\d+\)\s*$/, '').trim();
}
function familyKeyFromTitle(title) {
  return (
    'lw_' +
    title
      .toLowerCase()
      .replace(/^left wing\s*—\s*/i, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
  );
}

const VI_FORM =
  /\b(Primate|Hvatate|završavate|morate|imate|smijete|napadate|držite|Vozite|Držite|Sprintajte|Zaustavite|Povucite|Hvatate|Ispustite)\b|(?:^|[^A-Za-zČĆŽŠĐčćžšđ])(Vaš|vaš)(?=\s)|vašeg|Vašeg|vam se\b/;

const FORBIDDEN_OR_AWKWARD =
  /set 6:0|power-?play|keeper|resetiranje|lob lane|Near-Post|Far-Post|Outlet|utičnic|preskok|završni sloj|krivotvoren|oporavljao|pokojnog|zabrtvi|bližnjeg|odskočno|poluzaštit|dalekometn|ispust|sjene|sjenila|Kiel|Zagreb|vozite unutra|hvatate|primate/i;

const FOOTBALL_BBALL = /\b(driblati|utičnic|ispust|poluzaštit|drive|resetiranje napada)\b/i;

function collectHr(s) {
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

function quoteMatches(text, re) {
  const out = [];
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m;
  while ((m = r.exec(text)) && out.length < 12) out.push(m[0]);
  return [...new Set(out)];
}

/** Manual coach evaluations keyed by representative family title */
const FAMILY_AUDIT = {
  'Left Wing — Basic Near-Post Read': {
    teachingObjective: 'GK drifts far → finish near post',
    realism: 'BORDERLINE — thin cue (“half step toward far post”) with no take-off geometry',
    lwSpecific: 'WEAK — generic wing GK post read; could be RW with posts swapped',
    geometry: 'QUESTIONABLE — no sideline/take-off/body orientation; “near/far” from LW not reconstructed',
    gkLogic: 'SIMPLISTIC — far drift ⇒ always near post',
    abQuality: 'WEAK — B lob without dropped-hands cue; C/D cartoon',
    questionQuality: 'OK but shallow',
    difficultyAssessed: 'Beginner',
    difficultyLabelOk: true,
    perceptionShouldBe: false,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 9,
    mainRisk: 'Machine HR + simplistic GK formula + clone padding',
    hrQuotes: [
      'Primate na lijevom krilu',
      'Što prvo završavate?',
      'pomicanje daljeg stupića ostavlja otvorenim blizu stupića',
      'vašeg pokojnog braniča',
      'Vozite unutra prema sredini',
    ],
  },
  'Left Wing — Far-Post Under Centred Keeper': {
    teachingObjective: 'Centred GK → far-post finish before recovering defender',
    realism: 'BORDERLINE — “catch a jump on LW” unclear; defender recovery one step',
    lwSpecific: 'WEAK — generic wing finish side choice',
    geometry: 'QUESTIONABLE — “vratar ostaje na sredini od šest metara”; “završni sloj”; take-off not stated',
    gkLogic: 'SIMPLISTIC — centred keeper ⇒ automatic far post',
    abQuality: 'WEAK — B near-post vs centred GK poorly motivated',
    questionQuality: 'BAD — “Gdje postavljaš završni sloj” is not coach language',
    difficultyAssessed: 'Beginner/Intermediate',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 9,
    mainRisk: 'Broken HR terminology + automatic far-post rule',
    hrQuotes: [
      'hvatate preskok na lijevom krilu',
      'Gdje postavljaš završni sloj',
      'lijevi bočni branič',
      'Snaga u bližu stativu igra na njihovoj snazi',
    ],
  },
  'Left Wing — Lob vs Stepping Keeper': {
    teachingObjective: 'GK steps out early → lob',
    realism: 'QUESTIONABLE — “Kiel plays high” club sticker; geometry thin',
    lwSpecific: 'WEAK — generic wing lob vs advancing GK',
    geometry: 'QUESTIONABLE — narrow angle asserted without take-off path',
    gkLogic: 'SIMPLISTIC — step out ⇒ automatic lob; “lob lane” English calque in HR explanation',
    abQuality: 'MEDIOCRE',
    questionQuality: 'OK',
    difficultyAssessed: 'Intermediate',
    difficultyLabelOk: false,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 9,
    mainRisk: 'Club name + automatic lob formula + HR corruption',
    hrQuotes: ['Kiel igra visoko', 'lob lane preko bližeg ramena', 'Snažan snažan šut', 'Povucite se izvan'],
  },
  'Left Wing — Fast-Break Arrival Timing': {
    teachingObjective: 'Sprint on outlet so you arrive at 6m with the catch',
    realism: 'BORDERLINE — “right back releases long outlet” but LW lane not fully drawn',
    lwSpecific: 'PARTIAL — transition timing is wing-relevant but not left-native',
    geometry: 'THIN — one recovering defender between player and 6m; lane unclear',
    gkLogic: 'N/A',
    abQuality: 'OK concept; distractors weak',
    questionQuality: 'BAD HR — “Kada započinjete sprint tako da cilj ostane?”',
    difficultyAssessed: 'Intermediate',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'BORDERLINE',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'Machine HR; incomplete first-wave geometry; not LB-cooperation native',
    hrQuotes: [
      'Desna poleđina oslobađa dugački otvor',
      'Sprintajte na izlazu',
      'prije nego što se ispust pusti',
      'cilj ostane',
    ],
  },
  'Left Wing — Back-Door vs Ball-Watching 6:0': {
    teachingObjective: 'Ball-watching wing defender → cut behind to 6m',
    realism: 'PLAUSIBLE idea; wording broken',
    lwSpecific: 'YES potential — entry timing / when to leave width',
    geometry: 'PARTIAL — defender head to ball and pinches; LB about to receive stated',
    gkLogic: 'N/A',
    abQuality: 'OK structure (cut vs hold width)',
    questionQuality: 'BAD — “opciju najveće vrijednosti” academic',
    difficultyAssessed: 'Advanced',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'BORDERLINE',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'Useful family buried under machine translation',
    hrQuotes: [
      'Sjecanje iza braniča',
      'ulaz iza leđa srezana na šest metara',
      'opciju najveće vrijednosti',
      'poluzaštitnu stazu',
    ],
  },
  'Left Wing — Power-Play Wing Overload': {
    teachingObjective: '6v5 late rotation → finish or feed sealed pivot',
    realism: 'PLAUSIBLE numerical idea',
    lwSpecific: 'PARTIAL — wing overload in 6v5 is real but cues thin',
    geometry: 'THIN — “rotates one player late from middle”; pivot seal vague',
    gkLogic: 'N/A',
    abQuality: 'OK',
    questionQuality: 'OK concept / bad HR',
    difficultyAssessed: 'Advanced',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'BORDERLINE',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'HR nonsense (“bližnjeg”, “zabrtvi”, “Zaradiš napad”); power-play English framing',
    hrQuotes: [
      'rotira jednog igrača kasno iz sredine',
      'Pivot zatvara bližnjeg braniča',
      'dok osovina ne zabrtvi dublje',
      'Zaradiš napad ili nahranite zapečaćenog Pivota',
      'Driblati uz bočnu liniju',
    ],
  },
  'Left Wing — Tied Game Wing Finish': {
    teachingObjective: 'Late pressure finish with one GK read',
    realism: 'WEAK — score says 22–21 but title “tied”; coach signals calm finish',
    lwSpecific: 'WEAK — generic late finish; hand “right-hand bias” sticker',
    geometry: 'THIN — playable angle asserted',
    gkLogic: 'QUESTIONABLE — shade strong side ⇒ opposite / change height without concrete feet/arms',
    abQuality: 'WEAK',
    questionQuality: 'OK',
    difficultyAssessed: 'Intermediate/Advanced',
    difficultyLabelOk: false,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'REMOVE / MERGE',
    risk: 9,
    mainRisk: 'Expert label from clock; contradictory score/title; fake hand shade',
    hrQuotes: [
      'zasjenjuje tvoju snažnu sklonost ka desnoj ruci',
      'Trener signalizira mirnu završnicu, a ne junaštvo',
      'zaradiš slabu stranu',
      'sjene tvoju jaku stranu',
    ],
  },
  'Left Wing — Keeper First-Step Read': {
    teachingObjective: 'Fake → read GK first step → finish abandoned corner',
    realism: 'BORDERLINE textbook',
    lwSpecific: 'WEAK — generic wing GK timing drill',
    geometry: 'THIN',
    gkLogic: 'SIMPLISTIC — upright keeper + one fake formula',
    abQuality: 'MEDIOCRE',
    questionQuality: 'BAD HR — “čuvara”, “krivotvorenje”, “puštanja”',
    difficultyAssessed: 'Intermediate',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'Football/keeper vocabulary; formulaic GK read',
    hrQuotes: [
      'Koje informacije uzimate od čuvara prije puštanja?',
      'Jedno kratko krivotvorenje',
      'zaradiš napušteni kut',
      'Visoki uspravni čuvari',
    ],
  },
  'Left Wing — Transition Cover Priority': {
    teachingObjective: 'After LW turnover, cut far-wing skip lane first',
    realism: 'QUESTIONABLE — “Zagreb outlet to right wing”; responsibility may be wrong without teammate positions',
    lwSpecific: 'PARTIAL — transition defence from left side, but universal rule without  geometry of partners',
    geometry: 'INCOMPLETE — no second defender location; far-wing skip asserted',
    gkLogic: 'N/A',
    abQuality: 'B stay on own wing is a real alternative — A not proven without teammate map',
    questionQuality: 'OK',
    difficultyAssessed: 'Advanced',
    difficultyLabelOk: true,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 9,
    mainRisk: 'Club sticker + incomplete  transition geometry; only defence family in bank',
    hrQuotes: [
      'Zagrebački ispust odmah na desno krilo',
      'presjekli stazu za preuzimanje dalekog krila',
      'pritisnite najbližu utičnicu',
      'signalizirate grešku',
    ],
  },
  'Left Wing — Extreme-Angle Finish': {
    teachingObjective: 'Extreme angle + GK shades strong hand → low near-post skim',
    realism: 'BORDERLINE',
    lwSpecific: 'PARTIAL — extreme wing angle is position-relevant',
    geometry: 'THIN — “sliver of goal”; help one step from block',
    gkLogic: 'QUESTIONABLE — right-hander shade ⇒ low near skim as fixed technique',
    abQuality: 'WEAK distractors',
    questionQuality: 'OK',
    difficultyAssessed: 'Advanced',
    difficultyLabelOk: false,
    perceptionShouldBe: true,
    perceptionActual: false,
    coachTest: 'BORDERLINE',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'Expert from angle adjective; hand→shot formula; weak HR',
    hrQuotes: [
      'dešnjak koji završava i zasjeni to oslobađanje',
      'Nisko pri stupu preletite po podu',
      'pokrivenog polubranika',
      'Centralna moć je dar čuvaru',
    ],
  },
  'Left Wing — Simple Width Principle': {
    teachingObjective: 'Hold true width on sideline in 6:0',
    realism: 'YES — basic but real',
    lwSpecific: 'YES — width principle is wing-native (not left-exclusive)',
    geometry: 'OK for Beginner — standing 1m inside sideline',
    gkLogic: 'N/A',
    abQuality: 'OK (hold width vs early cut)',
    questionQuality: 'OK',
    difficultyAssessed: 'Beginner',
    difficultyLabelOk: true,
    perceptionShouldBe: false,
    perceptionActual: false,
    coachTest: 'BORDERLINE',
    recommendation: 'POLISH',
    risk: 6,
    mainRisk: 'HR still machine-like; only thin positional teaching family that is salvageable',
    hrQuotes: ['Držite pravu širinu', 'krenite prečicom', 'Spustite do pola', 'dugo ispuštanje'],
  },
};

// Build family clusters
const clusters = new Map();
for (const s of lw) {
  const title = baseTitle(s);
  if (!clusters.has(title)) clusters.set(title, []);
  clusters.get(title).push(s);
}

const trueFamilies = [...clusters.keys()].map((title) => {
  const members = clusters.get(title);
  const audit = FAMILY_AUDIT[title] || {
    teachingObjective: 'UNKNOWN',
    coachTest: 'NO',
    recommendation: 'TACTICAL REWRITE',
    risk: 8,
    mainRisk: 'Unmapped family',
    hrQuotes: [],
  };
  return {
    familyKey: familyKeyFromTitle(title),
    titleEn: title,
    count: members.length,
    ids: members.map((m) => m.id),
    clonePadding: members.length > 1,
    representativeId: members[0].id,
    attackOrDefence: members[0].attackOrDefence,
    labeledDifficulty: members[0].difficulty,
    ...audit,
  };
});

const cloneFamilyCount = trueFamilies.filter((f) => f.count > 1).length;
const trueFamilyCount = trueFamilies.length;

// Tag / coverage scans across all 40
function tagHas(s, re) {
  return (s.skillTags || []).some((t) => re.test(String(t)));
}
function blob(s) {
  return JSON.stringify(s);
}

const perceptionTagged = lw.filter((s) => tagHas(s, /^perception$/i) || (s.skillTags || []).includes('perception'));
const handednessTagged = lw.filter((s) => (s.skillTags || []).some((t) => String(t).startsWith('handedness:')));
const handednessInText = lw.filter((s) => /left-?hand|right-?hand|ljevoruk|desnoruk|desnoj ruci|dešnjak|Linkshänder|Rechtshänder/i.test(blob(s)));

const defence = lw.filter((s) => s.attackOrDefence === 'Defence');
const attack = lw.filter((s) => s.attackOrDefence === 'Attack');

const difficulty = Object.fromEntries(
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [d, lw.filter((s) => s.difficulty === d).length]),
);

const systems = {};
for (const s of lw) {
  const key = s.defensiveSystem || 'UNSPECIFIED';
  systems[key] = (systems[key] || 0) + 1;
}

function coverageFlag(familyPred, quality) {
  const hits = trueFamilies.filter(familyPred);
  if (!hits.length) return { status: 'MISSING', families: [], ids: [] };
  const statuses = hits.map((h) => {
    if (h.recommendation === 'REMOVE / MERGE') return 'DUPLICATED';
    if (h.coachTest === 'NO' || h.geometry === 'QUESTIONABLE' || h.geometry === 'INCOMPLETE') return 'TACTICALLY QUESTIONABLE';
    if ((h.hrQuotes || []).length >= 3) return 'LANGUAGE QUESTIONABLE';
    if (h.count >= 3) return 'DUPLICATED';
    if (h.coachTest === 'BORDERLINE' || quality === 'thin') return 'THIN';
    return 'GOOD COVERAGE';
  });
  // worst status wins
  const order = [
    'MISSING',
    'TACTICALLY QUESTIONABLE',
    'LANGUAGE QUESTIONABLE',
    'DUPLICATED',
    'THIN',
    'GOOD COVERAGE',
  ];
  const status = statuses.sort((a, b) => order.indexOf(a) - order.indexOf(b))[0];
  return { status, families: hits.map((h) => h.familyKey), ids: hits.flatMap((h) => h.ids) };
}

const cov = {
  '6:0': coverageFlag((f) => /6:0|width|back-door|near-post|far-post|simple width/i.test(f.titleEn)),
  '5:1': { status: 'MISSING', families: [], ids: [] },
  '3:2:1': { status: 'MISSING', families: [], ids: [] },
  '3:3': { status: 'MISSING', families: [], ids: [] },
  '4:2': { status: 'MISSING', families: [], ids: [] },
  '1:5': { status: 'MISSING', families: [], ids: [] },
  '5+1': { status: 'MISSING', families: [], ids: [] },
  '4+2': { status: 'MISSING', families: [], ids: [] },
  'open / individual defence': { status: 'MISSING', families: [], ids: [] },
  '1v1': { status: 'MISSING', families: [], ids: [] },
  'Left Back cooperation': coverageFlag(
    (f) => /left back|lijevom vanjskom|Fast-Break|Back-Door/i.test(f.titleEn + f.teachingObjective),
    'thin',
  ),
  'pivot cooperation': coverageFlag((f) => /pivot|Power-Play/i.test(f.titleEn), 'thin'),
  'entry timing': coverageFlag((f) => /Back-Door|entry/i.test(f.titleEn)),
  'when NOT to enter': { status: 'MISSING', families: [], ids: [] },
  'take off geometry': { status: 'MISSING', families: [], ids: [] },
  'wing defender hip read': { status: 'MISSING', families: [], ids: [] },
  'goalkeeper near-post movement': coverageFlag((f) => /Near-Post|near-post/i.test(f.titleEn)),
  'goalkeeper depth': { status: 'MISSING', families: [], ids: [] },
  'goalkeeper step-out': coverageFlag((f) => /Lob vs Stepping|step/i.test(f.titleEn)),
  'goalkeeper patience / late finish': coverageFlag((f) => /First-Step|Tied Game/i.test(f.titleEn), 'thin'),
  'first wave 2v1': { status: 'MISSING', families: [], ids: [] },
  'first wave 3v2': { status: 'MISSING', families: [], ids: [] },
  'second wave': { status: 'MISSING', families: [], ids: [] },
  'partially set defence': { status: 'MISSING', families: [], ids: [] },
  '6v5': coverageFlag((f) => /Power-Play/i.test(f.titleEn)),
  '5v6': { status: 'MISSING', families: [], ids: [] },
  '7v6': { status: 'MISSING', families: [], ids: [] },
  'own empty goal': { status: 'MISSING', families: [], ids: [] },
  'opponent empty goal': { status: 'MISSING', families: [], ids: [] },
  'after exclusion': coverageFlag((f) => /Power-Play/i.test(f.titleEn)),
  'passive play': { status: 'MISSING', families: [], ids: [] },
  'lead late': { status: 'MISSING', families: [], ids: [] },
  'trail late': { status: 'MISSING', families: [], ids: [] },
  'tie final possession': coverageFlag((f) => /Tied Game/i.test(f.titleEn)),
  'transition defence': coverageFlag((f) => /Transition Cover/i.test(f.titleEn)),
  'set defence responsibility': { status: 'MISSING', families: [], ids: [] },
  handover: { status: 'MISSING', families: [], ids: [] },
  'inside help': { status: 'MISSING', families: [], ids: [] },
  'recovery to wing': { status: 'MISSING', families: [], ids: [] },
  'first wave attack timing': coverageFlag((f) => /Fast-Break Arrival/i.test(f.titleEn), 'thin'),
  'positional width': coverageFlag((f) => /Simple Width/i.test(f.titleEn)),
  'extreme angle finish': coverageFlag((f) => /Extreme-Angle/i.test(f.titleEn), 'thin'),
};

// Language scan all 40
const languageFlags = lw.map((s) => {
  const hr = collectHr(s);
  return {
    id: s.id,
    title: s.title?.en,
    viForm: quoteMatches(hr, VI_FORM),
    awkward: quoteMatches(hr, FORBIDDEN_OR_AWKWARD),
    footballBasketball: quoteMatches(hr, FOOTBALL_BBALL),
    mixedEnInHr: quoteMatches(hr, /\b(set|keeper|lob lane|power-?play|Near-Post|reset)\b/i),
  };
});

const scenariosWithVi = languageFlags.filter((x) => x.viForm.length).length;
const scenariosWithAwkward = languageFlags.filter((x) => x.awkward.length || x.footballBasketball.length).length;

// Select 15 human review — 11 family reps + 4 highest-risk extras showing clone stickers / worst text
const reviewIds = [
  'scn_bank_074', // near-post
  'scn_bank_075', // far-post
  'scn_bank_076', // lob + Kiel
  'scn_bank_077', // fast break
  'scn_bank_078', // back door
  'scn_bank_079', // 6v5
  'scn_bank_080', // tied/expert hand
  'scn_bank_081', // first-step
  'scn_bank_082', // transition + Zagreb
  'scn_bank_083', // extreme angle
  'scn_bank_084', // width (best of bad)
  'scn_bank_096', // near-post clone absurd score@minute
  'scn_bank_091', // tied clone
  'scn_bank_104', // defence clone
  'scn_bank_112', // 6v5 clone
];

const byId = Object.fromEntries(lw.map((s) => [s.id, s]));
const familyById = {};
for (const f of trueFamilies) for (const id of f.ids) familyById[id] = f;

const humanReview15 = reviewIds.map((id) => {
  const s = byId[id];
  const f = familyById[id];
  const lang = languageFlags.find((x) => x.id === id);
  return {
    id,
    familyKey: f.familyKey,
    titleEn: s.title.en,
    difficulty: s.difficulty,
    assessedDifficulty: f.difficultyAssessed,
    attackOrDefence: s.attackOrDefence,
    handedness: (s.skillTags || []).find((t) => String(t).startsWith('handedness:')) || 'none',
    handednessInText: /desnoj ruci|dešnjak|right-hand|left-hand/i.test(blob(s)),
    perception: (s.skillTags || []).includes('perception'),
    perceptionShouldBe: f.perceptionShouldBe,
    risk: f.risk,
    mainRisk: f.mainRisk,
    hrLanguageConcerns: [...(lang?.viForm || []), ...(lang?.awkward || []), ...(f.hrQuotes || [])].slice(0, 10),
    geometryConcerns: f.geometry,
    aVsBConcern: f.abQuality,
    difficultyConcern: f.difficultyLabelOk
      ? 'label roughly ok'
      : `labeled ${s.difficulty} but assessed ${f.difficultyAssessed}`,
    perceptionConcern: f.perceptionShouldBe
      ? 'should likely be perception but untagged / or cue too thin'
      : 'ordinary context — perception false is ok',
    duplicationConcern: f.count > 1 ? `${f.count}-way clone family (score/minute stickers)` : 'unique title',
    coachTest: f.coachTest,
    recommendation: f.recommendation,
    teachingObjective: f.teachingObjective,
    complete: {
      en: {
        title: s.title.en,
        situation: s.situation.en,
        question: s.question.en,
        answers: s.answers,
        explanation: s.explanation?.en,
      },
      hr: {
        title: s.title.hr,
        situation: s.situation.hr,
        question: s.question.hr,
        answers: s.answers,
        explanation: s.explanation?.hr,
      },
      de: {
        title: s.title.de,
        situation: s.situation.de,
        question: s.question.de,
        answers: s.answers,
        explanation: s.explanation?.de,
      },
    },
  };
});

// Counts for report
const gkFamilies = trueFamilies.filter((f) => /Near-Post|Far-Post|Lob|Keeper|First-Step|Extreme-Angle|Tied Game/i.test(f.titleEn));
const entryFamilies = trueFamilies.filter((f) => /Back-Door/i.test(f.titleEn));
const pivotFamilies = trueFamilies.filter((f) => /Power-Play|pivot/i.test(f.titleEn + f.teachingObjective));
const lbCoopFamilies = trueFamilies.filter((f) => /Fast-Break|Back-Door|Left Back|lijev/i.test(f.titleEn));
const transitionFamilies = trueFamilies.filter((f) => /Fast-Break|Transition/i.test(f.titleEn));
const numericalFamilies = trueFamilies.filter((f) => /Power-Play|6v5|6 na 5/i.test(f.titleEn));
const gameStateFamilies = trueFamilies.filter((f) => /Tied Game|90 sekundi|final/i.test(f.titleEn));
const emptyGoalFamilies = [];
const passiveFamilies = [];
const endGameFamilies = trueFamilies.filter((f) => /Tied Game|90|final/i.test(f.titleEn));

const verdict = 'CURRENT LW BANK NEEDS GOLD REBUILD';

const report = {
  generatedAt: new Date().toISOString(),
  mode: 'PRE_AUDIT_ONLY',
  bankHashSha256: bankHashBefore,
  checkpoint: { commit: '26f5999', tag: 'rw-gold-approved-2026-08-09' },
  lockCheck: {
    leftBackCount: lb.length,
    rightBackCount: rb.length,
    centreBackCount: cb.length,
    rightWingCount: rw.length,
    leftWingCount: lw.length,
    scenariosJsonModifiedByAudit: false,
  },
  verdict,
  verdictReason: [
    'Only ~11 true teaching families under 40 IDs — rest is score/minute clone padding.',
    'Croatian is systematically machine-translated (vi-form, calques, football/basketball leaks, club names).',
    'Coverage of real LW decision space is mostly MISSING vs a gold architecture (hips, take-off geometry, when-not-to-enter, 5v6/7v6, empty goal, passive, set defence, systems beyond unspecified 6:0).',
    'GK logic is formulaic; Expert labels are clock/adjective driven.',
    'Defence has a single thin cloned family.',
    'Not salvageable by polish alone — needs position-native gold rebuild after RW-quality process (not RW mirror).',
  ],
  counts: {
    primaryLeftWing: lw.length,
    trueTeachingFamilies: trueFamilyCount,
    cloneFamilies: cloneFamilyCount,
    attack: attack.length,
    defence: defence.length,
    attackPct: Math.round((attack.length / lw.length) * 1000) / 10,
    defencePct: Math.round((defence.length / lw.length) * 1000) / 10,
    difficulty,
    perceptionTagged: perceptionTagged.length,
    perceptionPct: Math.round((perceptionTagged.length / lw.length) * 1000) / 10,
    handednessTagged: handednessTagged.length,
    handednessTaggedIds: handednessTagged.map((s) => s.id),
    handednessMentionedInTextIds: handednessInText.map((s) => s.id),
    defensiveSystemCoverage: systems,
    numericalFamilyCount: numericalFamilies.length,
    transitionFamilyCount: transitionFamilies.length,
    goalkeeperFamilyCount: gkFamilies.length,
    entryFamilyCount: entryFamilies.length,
    pivotCooperationFamilyCount: pivotFamilies.length,
    leftBackCooperationFamilyCount: lbCoopFamilies.length,
    gameStateFamilyCount: gameStateFamilies.length,
    emptyGoalFamilyCount: emptyGoalFamilies.length,
    passiveFamilyCount: passiveFamilies.length,
    endGameFamilyCount: endGameFamilies.length,
    scenariosWithViFormHr: scenariosWithVi,
    scenariosWithAwkwardHr: scenariosWithAwkward,
  },
  trueFamilies,
  coverageMatrix: cov,
  humanReviewSelectionRule:
    '11 unique-family representatives + 4 high-risk clones (absurd sticker / defence / numerical / late-game)',
  existingInfrastructure: {
    lwGoldTaxonomy: false,
    lwGoldParts: false,
    lwGoldValidator: false,
    lwGoldBuildScript: false,
    categoryTargetInTypesTs: 60,
    note: 'No LW gold pipeline exists. CATEGORY_TARGETS["Left Wing"]=60 is aspirational only.',
  },
};

writeFileSync(join(root, 'scripts/lw-pre-audit-report.json'), JSON.stringify(report, null, 2) + '\n');

const matrixRows = Object.entries(cov).map(([topic, info]) => ({
  topic,
  status: info.status,
  familyKeys: info.families || [],
  scenarioIds: info.ids || [],
}));
writeFileSync(join(root, 'scripts/lw-pre-audit-coverage-matrix.json'), JSON.stringify(matrixRows, null, 2) + '\n');

writeFileSync(
  join(root, 'scripts/lw-pre-audit-human-review-15.json'),
  JSON.stringify(
    {
      generatedAt: report.generatedAt,
      count: humanReview15.length,
      scenarios: humanReview15,
    },
    null,
    2,
  ) + '\n',
);

// Markdown report
const md = [];
md.push('# Left Wing Pre-Audit Report');
md.push('');
md.push(`Generated: ${report.generatedAt}`);
md.push('');
md.push(`**Verdict: ${verdict}**`);
md.push('');
md.push('## Lock check');
md.push('');
md.push(`- Commit context: ${report.checkpoint.commit} / ${report.checkpoint.tag}`);
md.push(`- LB ${lb.length} · RB ${rb.length} · CB ${cb.length} · RW ${rw.length} · LW ${lw.length}`);
md.push(`- scenarios.json SHA-256: \`${bankHashBefore}\``);
md.push(`- Audit modified bank: **no**`);
md.push('');
md.push('## Headline counts');
md.push('');
md.push(`| Metric | Value |`);
md.push(`|---|---|`);
md.push(`| Primary LW scenarios | ${lw.length} |`);
md.push(`| True teaching families | ${trueFamilyCount} |`);
md.push(`| Clone families | ${cloneFamilyCount} |`);
md.push(`| Attack | ${attack.length} (${report.counts.attackPct}%) |`);
md.push(`| Defence | ${defence.length} (${report.counts.defencePct}%) |`);
md.push(`| Perception tagged | ${perceptionTagged.length} (${report.counts.perceptionPct}%) |`);
md.push(`| Handedness tagged | ${handednessTagged.length} |`);
md.push(`| Handedness in text IDs | ${handednessInText.map((s) => s.id).join(', ') || 'none'} |`);
md.push(`| Difficulty | B${difficulty.Beginner} / I${difficulty.Intermediate} / A${difficulty.Advanced} / E${difficulty.Expert} |`);
md.push(`| Defensive systems | ${JSON.stringify(systems)} |`);
md.push(`| GK-ish families | ${gkFamilies.length} |`);
md.push(`| Entry families | ${entryFamilies.length} |`);
md.push(`| Pivot coop families | ${pivotFamilies.length} |`);
md.push(`| LB coop families | ${lbCoopFamilies.length} |`);
md.push(`| Transition families | ${transitionFamilies.length} |`);
md.push(`| Numerical families | ${numericalFamilies.length} |`);
md.push(`| Game-state families | ${gameStateFamilies.length} |`);
md.push(`| Empty-goal families | 0 |`);
md.push(`| Passive families | 0 |`);
md.push(`| End-game families | ${endGameFamilies.length} |`);
md.push(`| HR vi-form scenarios | ${scenariosWithVi}/${lw.length} |`);
md.push(`| HR awkward/corrupt scenarios | ${scenariosWithAwkward}/${lw.length} |`);
md.push('');
md.push('## Verdict reasons');
md.push('');
for (const r of report.verdictReason) md.push(`- ${r}`);
md.push('');
md.push('## True families (11) under 40 IDs');
md.push('');
for (const f of trueFamilies) {
  md.push(`### ${f.familyKey} ×${f.count}`);
  md.push('');
  md.push(`- Title: ${f.titleEn}`);
  md.push(`- IDs: ${f.ids.join(', ')}`);
  md.push(`- Teaching: ${f.teachingObjective}`);
  md.push(`- Coach test: **${f.coachTest}**`);
  md.push(`- Recommendation: **${f.recommendation}** (do not execute)`);
  md.push(`- Risk: ${f.risk}/10 — ${f.mainRisk}`);
  md.push(`- Geometry: ${f.geometry}`);
  md.push(`- GK logic: ${f.gkLogic}`);
  md.push(`- A/B: ${f.abQuality}`);
  if (f.hrQuotes?.length) {
    md.push('- Suspicious HR quotes:');
    for (const q of f.hrQuotes) md.push(`  - \`${q}\``);
  }
  md.push('');
}
md.push('## Coverage matrix');
md.push('');
md.push('| Topic | Status |');
md.push('|---|---|');
for (const row of matrixRows) md.push(`| ${row.topic} | ${row.status} |`);
md.push('');
md.push('## 15 human-review priorities');
md.push('');
for (const sc of humanReview15) {
  md.push(`### ${sc.id} — ${sc.titleEn}`);
  md.push('');
  md.push(`- familyKey: \`${sc.familyKey}\``);
  md.push(`- ${sc.difficulty} / ${sc.attackOrDefence} · handedness=${sc.handedness} · perception=${sc.perception}`);
  md.push(`- risk **${sc.risk}/10** — ${sc.mainRisk}`);
  md.push(`- coach test: **${sc.coachTest}** · recommendation: **${sc.recommendation}**`);
  md.push(`- HR concerns: ${sc.hrLanguageConcerns.slice(0, 5).map((x) => `\`${x}\``).join('; ')}`);
  md.push(`- geometry: ${sc.geometryConcerns}`);
  md.push(`- A vs B: ${sc.aVsBConcern}`);
  md.push(`- difficulty: ${sc.difficultyConcern}`);
  md.push(`- duplication: ${sc.duplicationConcern}`);
  md.push('');
  md.push('**HR situation:** ' + sc.complete.hr.situation);
  md.push('');
  md.push('**HR question:** ' + sc.complete.hr.question);
  md.push('');
  for (const a of sc.complete.hr.answers) {
    md.push(`- **${a.quality}:** ${a.text.hr}`);
  }
  md.push('');
}
md.push('## Architecture note vs RW Gold');
md.push('');
md.push('RW Gold is a quality-architecture reference only (native position logic, geometry, A/B integrity, natural HR, honest tags).');
md.push('This audit does **not** recommend mirroring RW tactics side-to-side.');
md.push('LW eventually needs its own left-corner / LB-cooperation native gold bank.');
md.push('');
md.push('## STOP');
md.push('');
md.push('No scenarios rewritten. No deploy. No LW gold build started.');

writeFileSync(join(root, 'scripts/lw-pre-audit-report.md'), md.join('\n') + '\n');

// Verify bank unchanged
const bankHashAfter = createHash('sha256').update(readFileSync(bankPath, 'utf8')).digest('hex');
if (bankHashAfter !== bankHashBefore) {
  console.error('FATAL: scenarios.json changed during audit');
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: 'PRE_AUDIT_COMPLETE',
      verdict,
      primaryLW: lw.length,
      trueFamilies: trueFamilyCount,
      cloneFamilies: cloneFamilyCount,
      attack: attack.length,
      defence: defence.length,
      perceptionPct: report.counts.perceptionPct,
      bankHashUnchanged: true,
      lockCounts: report.lockCheck,
      outputs: [
        'scripts/lw-pre-audit-report.json',
        'scripts/lw-pre-audit-report.md',
        'scripts/lw-pre-audit-coverage-matrix.json',
        'scripts/lw-pre-audit-human-review-15.json',
      ],
    },
    null,
    2,
  ),
);
