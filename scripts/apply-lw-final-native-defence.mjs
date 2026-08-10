#!/usr/bin/env node
/**
 * FINAL LW pilot native defence pass.
 * Replace ONLY scn_bank_949 and scn_bank_950.
 * Does not touch 941–948 or LB/RB/CB/RW.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const pilotPath = join(root, 'scripts/scenario-bank/data/lw-pilot-10.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const pilots = JSON.parse(readFileSync(pilotPath, 'utf8'));
const lockBefore = JSON.parse(readFileSync(join(root, 'scripts/.lw-final-def-lock-before.json'), 'utf8'));

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const LOCKED_IDS = [
  'scn_bank_941',
  'scn_bank_942',
  'scn_bank_943',
  'scn_bank_944',
  'scn_bank_945',
  'scn_bank_946',
  'scn_bank_947',
  'scn_bank_948',
];

const replacements = {
  scn_bank_949: {
    pilotIndex: 8,
    pilotId: 'lw_pilot_09',
    teachingArea: 'transition_defence_from_second_pivot',
    familyKey: 'lw_def_recover_wing_from_second_pivot_turnover',
    title: {
      en: 'Left Wing — Defence: After Second-Pivot Turnover, Recover the Wing Lane First',
      hr: 'Lijevo krilo — obrana: nakon gubitka lopte iz drugog pivota prvo vrati krilnu liniju',
      de: 'Linksaußen — Abwehr: nach Ballverlust aus dem zweiten Kreisläufer zuerst die Flügellinie zurück',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 34,
    score: '16:16',
    defensiveSystem: 'Mixed',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'transition', 'timing', 'decisionMaking', 'perception'],
    primaryCue:
      'Ball lost while still second pivot on left six; opp right wing already sprinting into empty left wing lane',
    fingerprint: {
      objective: 'recover defensive wing lane from offensive second-pivot start after turnover',
      cue: 'turnover near left 9m; opp RW sprinting into empty left wing; LW still on left six',
      relationship: 'LW–LB late–first pivot–opp RW outlet',
      structure: 'transition after left second-pivot attack',
      decision: 'sprint out to wing outlet first',
      timing: 'immediate first recovery sprint',
      risk: 'chase middle ball or stay wrestling on six',
    },
    situation: {
      en: "Tied 16:16 at 34'. You entered from left wing and are still standing as a second pivot on the left half of the six. Your first pivot is next to you. The left back’s pass is stolen near the left nine metres. Their right wing — the attacker on your side — is already sprinting into the empty left wing lane. You are still inside on the six. If you stay wrestling there or chase the ball in the middle, their first outlet is open down your wing.",
      hr: 'Neriješeno je 16:16 u 34. minuti. Ušao si s lijevog krila i još stojiš kao drugi pivot na lijevoj polovici šestice. Prvi pivot je pokraj tebe. Pas lijevog vanjskog ukraden je oko lijevih devet metara. Njihovo desno krilo — napadač na tvojoj strani — već sprinta u praznu lijevu krilnu liniju. Ti si još unutra na šestici. Ako ostaneš u borbi ili juriš loptu u sredini, njihov prvi izlaz otvoren je niz tvoje krilo.',
      de: 'Unentschieden 16:16 in Minute 34. Du bist vom Linksaußen eingelaufen und stehst noch als zweiter Kreisläufer auf der linken Sechs-Hälfte. Der erste Kreisläufer steht neben dir. Der Pass des linken Rückraums wird bei neun Metern links abgefangen. Ihr Rechtsaußen — der Angreifer auf deiner Seite — sprintet schon in die leere linke Flügellinie. Du bist noch innen auf der Sechs. Bleibst du im Kampf oder jagst den Ball in der Mitte ist ihr erster Outlet über deinen Flügel offen.',
    },
    question: {
      en: 'The ball is gone and their wing is already filling your empty lane — what is first?',
      hr: 'Lopta je nestala i njihovo krilo već puni tvoju praznu liniju — što je prvo?',
      de: 'Der Ball ist weg und ihr Flügel füllt schon deine leere Linie — was ist zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Sprint out to the left wing lane and close their first outlet before the pass arrives',
          hr: 'Sprintaj van u lijevu krilnu liniju i zatvori njihov prvi izlaz prije nego pas stigne',
          de: 'Nach außen in die linke Flügellinie sprinten und ihren ersten Outlet schließen bevor der Pass ankommt',
        },
        feedback: {
          en: 'Correct — after a second-pivot turnover your first job is to reopen the wing lane you left.',
          hr: 'Točno — nakon gubitka lopte iz drugog pivota prvi je posao ponovo zatvoriti krilnu liniju koju si napustio.',
          de: 'Richtig — nach Ballverlust aus dem zweiten Kreisläufer ist dein erster Job die Flügellinie wieder zu schließen die du verlassen hast.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Stay one beat inside only if a teammate already fills the wing lane by body and clear call',
          hr: 'Ostani jedan trenutak unutra samo ako suigrač već drži krilnu liniju tijelom i jasnim glasom',
          de: 'Nur einen Moment innen bleiben wenn ein Mitspieler die Flügellinie schon mit Körper und klarem Ruf besetzt',
        },
        feedback: {
          en: 'Valid with real wing cover; here nobody has taken that lane yet.',
          hr: 'Valjano uz pravo pokriće krila; ovdje tu liniju još nitko nije preuzeo.',
          de: 'Gültig bei echter Flügeldeckung; hier hat diese Linie noch niemand übernommen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Chase the ball carrier through the middle because the steal looks more urgent',
          hr: 'Juri vodiča lopte kroz sredinu jer krađa izgleda hitnije',
          de: 'Den Ballführer durch die Mitte jagen weil der Ballgewinn dringender wirkt',
        },
        feedback: {
          en: 'Risky — you leave the nearest outlet free on the wing you abandoned.',
          hr: 'Rizično — ostavljaš najbliži izlaz slobodnim na krilu koje si napustio.',
          de: 'Riskant — du lässt den nächsten Outlet auf dem Flügel frei den du verlassen hast.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Keep wrestling on the six as if the attack is still alive',
          hr: 'Nastavi se boriti na šestici kao da je napad još živ',
          de: 'Weiter auf der Sechs kämpfen als wäre der Angriff noch lebendig',
        },
        feedback: {
          en: 'Poor — the attack is over; staying inside gifts the wing outlet.',
          hr: 'Loše — napad je gotov; ostajanje unutra poklanja krilni izlaz.',
          de: 'Schlecht — der Angriff ist vorbei; innen bleiben schenkt den Flügel-Outlet.',
        },
      },
    ],
    explanation: {
      en: 'Cue: you are still second pivot when the ball is lost, and their right wing is already filling the empty left wing lane. First action is sprint out to close that outlet. Staying inside is only good if a teammate already owns the wing.',
      hr: 'Čitaj: još si drugi pivot kad lopta ode, a njihovo desno krilo već puni praznu lijevu krilnu liniju. Prva akcija je sprint van da zatvoriš taj izlaz. Ostati unutra dobro je samo ako suigrač već drži krilo.',
      de: 'Lesen: du bist noch zweiter Kreisläufer wenn der Ball weg ist und ihr Rechtsaußen füllt schon die leere linke Flügellinie. Erste Aktion: nach außen sprinten und diesen Outlet schließen. Innen bleiben nur wenn ein Mitspieler den Flügel schon besitzt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A closes the live same-side outlet from the wrong starting spot; B needs a teammate already on that wing.',
      hr: 'A zatvara živi izlaz na istoj strani s krivog startnog mjesta; B treba suigrača koji je već na tom krilu.',
      de: 'A schließt den lebenden gleichen-Seiten-Outlet von der falschen Startposition; B braucht einen Mitspieler der schon auf diesem Flügel ist.',
    },
    reviewer: {
      teachingObjective:
        'After turnover while still second pivot, recover the abandoned left wing lane before chasing middle ball',
      primaryCue: 'Turnover + opp RW into empty left wing + LW still on six',
      cloneRisk: 'Not RW 930/927 — those start from normal recovery, not second-pivot',
    },
  },
  scn_bank_950: {
    pilotIndex: 9,
    pilotId: 'lw_pilot_10',
    teachingArea: 'empty_own_defence_from_second_pivot',
    familyKey: 'lw_def_empty_own_fill_from_second_pivot_turnover',
    title: {
      en: 'Left Wing — Defence: After Second-Pivot Turnover With Empty Own Goal, Fill the Goal Lane First',
      hr: 'Lijevo krilo — obrana: nakon gubitka lopte iz drugog pivota s praznim vlastitim golom prvo zatvori liniju na gol',
      de: 'Linksaußen — Abwehr: nach Ballverlust aus dem zweiten Kreisläufer bei eigenem leerem Tor zuerst die Torlinie füllen',
    },
    difficulty: 'Expert',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 47,
    score: '22:22',
    defensiveSystem: 'Mixed',
    perception: true,
    handedness: 'none',
    numerical: '7v6',
    gameState: 'empty_goal_own',
    skillTags: ['defence', 'transition', 'decisionMaking', 'timing', 'perception'],
    primaryCue:
      'Own GK out; turnover while LW still second pivot; ball carrier looks at empty goal; teammate nearer to wing than you are to empty-goal cover if you leave',
    fingerprint: {
      objective: 'empty-own first cover from second-pivot start after turnover',
      cue: 'empty own live; CB/ball looking at goal; LW nearest on six; wing secondary',
      relationship: 'LW inside–empty goal–ball carrier–teammate near wing',
      structure: '7v6 empty-own attack → sudden defence',
      decision: 'fill empty-goal lane before wing sprint',
      timing: 'immediate body between ball and empty goal',
      risk: 'automatic wing recovery leaves empty goal open',
    },
    situation: {
      en: "Tied 22:22 at 47' with your goalkeeper out as a court player. You have entered from left wing and stand as a second pivot on the left half of the six. The ball is turned over. Their centre back has it around thirteen metres and his chest already opens toward your empty goal. Their right wing is also wide on your side, but your left back is closer to that wing than you are to the empty-goal lane if you leave the six. A shot at the empty goal can land before a wing pass develops.",
      hr: 'Neriješeno je 22:22 u 47. minuti, a vaš je vratar vani kao igrač. Ušao si s lijevog krila i stojiš kao drugi pivot na lijevoj polovici šestice. Lopta je izgubljena. Njihov srednji vanjski ima je oko trinaest metara i prsa mu se već otvaraju prema vašem praznom golu. Njihovo desno krilo također je široko na tvojoj strani, ali je tvoj lijevi vanjski bliži tom krilu nego ti liniji pred praznim golom ako napustiš šesticu. Šut na prazan gol može pasti prije nego se razvije pas na krilo.',
      de: 'Unentschieden 22:22 in Minute 47 und euer Torhüter ist als Feldspieler draußen. Du bist vom Linksaußen eingelaufen und stehst als zweiter Kreisläufer auf der linken Sechs-Hälfte. Der Ball geht verloren. Ihr Rückraum Mitte hat ihn bei etwa dreizehn Metern und die Brust öffnet schon zu eurem leeren Tor. Ihr Rechtsaußen steht auch breit auf deiner Seite aber dein linker Rückraum ist näher an diesem Flügel als du an der Linie vor dem leeren Tor wenn du die Sechs verlässt. Ein Wurf aufs leere Tor kann landen bevor ein Flügelpass entsteht.',
    },
    question: {
      en: 'Empty own goal is live and you are still inside — what is first?',
      hr: 'Prazan vlastiti gol je živ a ti si još unutra — što je prvo?',
      de: 'Das eigene leere Tor ist lebendig und du bist noch innen — was ist zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Sprint between the ball and the empty goal now and force a later pass decision',
          hr: 'Sprintaj sada između lopte i praznog gola i natjeraj kasniju odluku o pasu',
          de: 'Jetzt zwischen Ball und leerem Tor sprinten und eine spätere Passentscheidung erzwingen',
        },
        feedback: {
          en: 'Correct — from the second-pivot spot you are the nearest body who can close the empty goal.',
          hr: 'Točno — s mjesta drugog pivota ti si najbliže tijelo koje može zatvoriti prazan gol.',
          de: 'Richtig — von der Position des zweiten Kreisläufers bist du der nächste Körper der das leere Tor schließen kann.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Sprint to the wing only if a teammate already fills the empty-goal lane and calls that cover',
          hr: 'Sprintaj na krilo samo ako suigrač već zatvara liniju pred praznim golom i javlja to pokriće',
          de: 'Nur zum Flügel sprinten wenn ein Mitspieler die Linie vor dem leeren Tor schon füllt und diese Deckung ruft',
        },
        feedback: {
          en: 'Valid after real empty-goal cover; that cover is not stated here.',
          hr: 'Valjano nakon pravog pokrića praznog gola; to pokriće ovdje nije navedeno.',
          de: 'Gültig nach echter Deckung des leeren Tors; diese Deckung ist hier nicht genannt.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Automatic sprint to the wing because that is your normal defensive job',
          hr: 'Automatski sprint na krilo jer je to tvoj uobičajeni obrambeni posao',
          de: 'Automatisch zum Flügel sprinten weil das dein normaler Abwehrjob ist',
        },
        feedback: {
          en: 'Risky — your normal wing job can wait one beat; the empty goal cannot.',
          hr: 'Rizično — uobičajeni krilni posao može čekati trenutak; prazan gol ne može.',
          de: 'Riskant — dein normaler Flügeljob kann einen Moment warten; das leere Tor nicht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stay on the six and protest the turnover with a raised hand',
          hr: 'Ostani na šestici i prosvjeduj zbog gubitka lopte dignutom rukom',
          de: 'Auf der Sechs bleiben und den Ballverlust mit erhobener Hand protestieren',
        },
        feedback: {
          en: 'Poor — an empty goal does not wait for a protest.',
          hr: 'Loše — prazan gol ne čeka prosvjed.',
          de: 'Schlecht — ein leeres Tor wartet nicht auf einen Protest.',
        },
      },
    ],
    explanation: {
      en: 'Cue: own goalkeeper is out, you are still second pivot, and the ball carrier already looks at the empty goal. First action is fill that lane. Wing recovery is only good after a teammate truly covers the empty goal.',
      hr: 'Čitaj: vlastiti je vratar vani, ti si još drugi pivot, a vodič lopte već gleda prazan gol. Prva akcija je zatvoriti tu liniju. Povratak na krilo dobar je tek kad suigrač stvarno pokrije prazan gol.',
      de: 'Lesen: eigener Torhüter ist draußen, du bist noch zweiter Kreisläufer und der Ballführer schaut schon aufs leere Tor. Erste Aktion: diese Linie füllen. Flügel-Rückkehr erst wenn ein Mitspieler das leere Tor wirklich deckt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A closes the live empty goal from the nearest inside start; B needs empty-goal cover that is not there.',
      hr: 'A zatvara živi prazan gol s najbližeg unutarnjeg starta; B treba pokriće praznog gola kojeg nema.',
      de: 'A schließt das lebende leere Tor vom nächsten Innenstart; B braucht eine Deckung des leeren Tors die fehlt.',
    },
    reviewer: {
      teachingObjective:
        'After second-pivot turnover with empty own goal, fill the goal lane before automatic wing recovery',
      primaryCue: 'Empty own + ball looking at goal + LW nearest from second pivot',
      cloneRisk: 'No RW empty-own defence twin; not 931 (no empty-own / not second-pivot)',
    },
  },
};

for (const id of LOCKED_IDS) {
  const s = bank.find((x) => x.id === id);
  const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (h !== lockBefore.seeds[id]) {
    throw new Error(`Locked pilot changed before apply: ${id}`);
  }
}

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(pos) !== lockBefore[k]) {
    throw new Error(`LOCK HASH CHANGED BEFORE APPLY: ${k}`);
  }
}

const changeLog = [];

for (const [id, r] of Object.entries(replacements)) {
  const idx = bank.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error(`Missing ${id}`);
  const old = bank[idx];
  const oldFamily = (old.skillTags || []).find((t) => String(t).startsWith('family:'));

  const skillTags = [
    ...r.skillTags,
    ...(r.numerical && r.numerical !== '6v6' && !r.skillTags.some((t) => String(t).startsWith('numerical:'))
      ? [`numerical:${r.numerical}`]
      : []),
    ...(r.gameState && r.gameState !== 'none' ? [`gameState:${r.gameState}`] : []),
    `family:${r.familyKey}`,
    `pilot:${r.pilotId}`,
  ];

  bank[idx] = {
    ...old,
    id,
    title: r.title,
    category: 'Left Wing',
    primaryPosition: 'Left Wing',
    secondaryPositions: [],
    difficulty: r.difficulty,
    pressureLevel: r.pressureLevel,
    attackOrDefence: r.attackOrDefence,
    matchPhase: r.matchPhase,
    minute: r.minute,
    score: r.score,
    defensiveSystem: r.defensiveSystem,
    situation: r.situation,
    question: r.question,
    answers: r.answers,
    explanation: r.explanation,
    whyCorrectOverSecondBest: r.whyCorrectOverSecondBest,
    skillTags,
    qualityScore: old.qualityScore ?? 8.6,
  };

  const p = pilots[r.pilotIndex];
  Object.assign(p, {
    teachingArea: r.teachingArea,
    familyKey: r.familyKey,
    title: r.title,
    difficulty: r.difficulty,
    pressureLevel: r.pressureLevel,
    attackOrDefence: r.attackOrDefence,
    matchPhase: r.matchPhase,
    minute: r.minute,
    score: r.score,
    defensiveSystem: r.defensiveSystem,
    skillTags: r.skillTags.filter((t) => t !== 'perception'),
    perception: r.perception,
    handedness: r.handedness,
    numerical: r.numerical,
    gameState: r.gameState,
    primaryTacticalCue: r.primaryCue,
    fingerprint: r.fingerprint,
    situation: r.situation,
    question: r.question,
    answers: r.answers,
    explanation: r.explanation,
    whyCorrectOverSecondBest: r.whyCorrectOverSecondBest,
    reviewer: r.reviewer,
    surgicalStatus: 'NATIVE_REPLACED_FINAL_DEFENCE',
  });
  if (r.perception && !p.skillTags.includes('perception')) p.skillTags.push('perception');

  changeLog.push({
    id,
    oldFamilyKey: oldFamily?.replace('family:', ''),
    newFamilyKey: r.familyKey,
    teachingArea: r.teachingArea,
    attackOrDefence: r.attackOrDefence,
    difficulty: r.difficulty,
    perception: r.perception,
    handedness: r.handedness,
    defensiveSystem: r.defensiveSystem,
    numerical: r.numerical,
    gameState: r.gameState,
  });
}

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(pos) !== lockBefore[k]) throw new Error(`LOCK HASH CHANGED ${k}`);
}
for (const id of LOCKED_IDS) {
  const s = bank.find((x) => x.id === id);
  const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (h !== lockBefore.seeds[id]) throw new Error(`Locked pilot mutated: ${id}`);
}

const lw = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 50) throw new Error(`LW count ${lw} != 50`);

const pilotIds = bank.filter((s) => {
  const n = Number(String(s.id).replace(/\D/g, ''));
  return s.primaryPosition === 'Left Wing' && n >= 941 && n <= 950;
});
if (pilotIds.length !== 10) throw new Error(`Pilot count ${pilotIds.length} != 10`);

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(pilotPath, JSON.stringify(pilots, null, 2) + '\n');

const report = {
  status: 'PHASE_B_APPLIED',
  changeLog,
  lockOk: true,
  lwCount: lw,
  pilotCount: pilotIds.length,
};
writeFileSync(join(root, 'scripts/lw-final-native-defence-apply.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
