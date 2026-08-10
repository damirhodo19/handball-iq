#!/usr/bin/env node
/**
 * Replace scn_bank_948 content only — LW-native 6v5 stay-wide vs entry.
 * Does not touch LB/RB/CB/RW or other pilot IDs.
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

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const lockBefore = {
  LB: hashPos('Left Back'),
  RB: hashPos('Right Back'),
  CB: hashPos('Centre Back'),
  RW: hashPos('Right Wing'),
};

/**
 * GEOMETRY RECONSTRUCTION (coach notes — stored in report)
 *
 * Attack 6v5, left side:
 * 1. LW wide near left sideline / corner
 * 2. LB has ball at ~9m left channel, driving/holding against short defence
 * 3. Pivot on LEFT half of the six-metre line, body sealing the LEFT HALF defender
 *    (pivot still deep in the left corridor, fighting that seal — has NOT cleared toward middle)
 * 4. Pivot occupies: opposing left half defender
 * 5. Defender responsible for LW: opposing left wing defender (WD)
 * 6. Rotation: WD begins to narrow — takes a help step inside toward the LB/pivot overload;
 *    hips and chest turn inside (looks committed)
 * 7. Space that appears: visual gap behind WD toward six, looking like a back-door entry
 * 8. Why immediate entry is BAD: that gap is the same corridor the pivot still occupies;
 *    LW entry stacks onto the pivot’s back, kills the wide stretch that creates 6v5 value,
 *    and closes LB’s wide pass angle
 * 9. Exact cue for decision: WD looks open to cut AND pivot body still occupies left-half
 *    corridor → STAY WIDE. Entry becomes good only after pivot clears toward middle
 *    AND WD hips stay fully inside
 *
 * NOT taught: always stay wide in 6v5 / always enter when WD helps / seal ⇒ entry
 */

const geometry = {
  LW: 'wide left corner / sideline',
  LB: 'ball at nine metres, left channel',
  pivot: 'left half of six, sealing left half defender, still in left corridor',
  pivotOccupies: 'opposing left half defender',
  defenderOnLW: 'opposing left wing defender',
  rotatingDefender: 'wing defender narrows inside (hips/chest turn inside)',
  apparentSpace: 'gap behind WD toward six',
  whyEntryBadNow:
    'pivot still occupies that corridor; entry crowds pivot, removes width, closes LB wide pass',
  exactCue:
    'WD hips/chest inside (tempting cut) + pivot body still on left-half six corridor → stay wide',
  whenEntryBecomesGood: 'pivot clears toward middle AND WD remains fully inside',
};

const familyKey = 'lw_6v5_stay_wide_vs_entry_pivot';

const content = {
  title: {
    en: 'Left Wing — 6v5: Do Not Enter Onto Your Own Pivot When the Wing Defender Narrows',
    hr: 'Lijevo krilo — 6v5: ne ulazi na svog pivota kad krilni branič sužava',
    de: 'Linksaußen — 6v5: nicht auf den eigenen Kreisläufer einlaufen wenn der Außenverteidiger einrückt',
  },
  difficulty: 'Advanced',
  pressureLevel: 'High',
  attackOrDefence: 'Attack',
  matchPhase: 'Open Play',
  minute: 41,
  score: '20:19',
  defensiveSystem: 'Mixed',
  situation: {
    en: 'You lead 20:19 at 41\' in 6v5 after an exclusion. You start wide on the left wing. The left back has the ball at nine metres. Your pivot is on the left half of the six-metre line, sealing their left half defender and still fighting in that same left corridor — he has not cleared toward the middle. Their wing defender takes a help step inside toward the overload; his hips and chest turn away from the corner, so the space behind him toward the six looks empty. If you cut now, you run onto your own pivot’s back and erase the wide stretch the 6v5 is using.',
    hr: 'Vodite 20:19 u 41. minuti u 6v5 nakon isključenja. Stojiš široko na lijevom krilu. Lijevi vanjski ima loptu na devet metara. Tvoj pivot je na lijevoj polovici šestice, drži njihovog lijevog polubranitelja i još se bori u tom istom lijevom prostoru — nije se maknuo prema sredini. Njihov krilni branič ide korak pomoći unutra prema preopterećenju; bokovi i prsa mu se okreću od kuta, pa prostor iza njega prema šestici izgleda prazan. Ako sada siječeš, ulaziš na leđa vlastitom pivotu i brišeš širinu kojom 6v5 radi.',
    de: 'Ihr führt 20:19 in Minute 41 in Überzahl 6v5 nach einer Zeitstrafe. Du startest breit auf Linksaußen. Der linke Rückraum hat den Ball auf neun Metern. Dein Kreisläufer steht auf der linken Hälfte der Sechs, dichtet ihren linken Halben ab und kämpft noch in genau diesem linken Korridor — er ist nicht zur Mitte freigemacht. Ihr Außenverteidiger macht einen Hilfeschritt nach innen zur Überzahl; Hüfte und Brust drehen von der Ecke weg, daher wirkt der Raum hinter ihm zur Sechs leer. Schneidet du jetzt, läufst du auf den Rücken deines eigenen Kreisläufers und löschst die Breite mit der die 6v5 arbeitet.',
  },
  question: {
    en: 'The wing defender has turned inside and the cut looks free — what do you do first?',
    hr: 'Krilni branič se okrenuo unutra i rez izgleda slobodan — što radiš prvo?',
    de: 'Der Außenverteidiger ist nach innen gedreht und der Schnitt wirkt frei — was machst du zuerst?',
  },
  answers: [
    {
      quality: 'optimal',
      text: {
        en: 'Stay wide and ask for the ball — your pivot still occupies the left corridor you would enter',
        hr: 'Ostani široko i traži loptu — pivot još drži lijevi prostor u koji bi ušao',
        de: 'Breit bleiben und den Ball fordern — dein Kreisläufer belegt noch den linken Raum in den du einlaufen würdest',
      },
      feedback: {
        en: 'Correct — 6v5 does not mean enter. The cut is fake while your pivot is still in that corridor.',
        hr: 'Točno — 6v5 ne znači ulazak. Rez je lažan dok je tvoj pivot još u tom prostoru.',
        de: 'Richtig — 6v5 heißt nicht einlaufen. Der Schnitt ist falsch solange dein Kreisläufer noch in diesem Raum steht.',
      },
    },
    {
      quality: 'good',
      text: {
        en: 'Enter behind the wing defender only after the pivot clears toward the middle and leaves the cut lane free',
        hr: 'Uđi iza krilnog braniča tek kad se pivot makne prema sredini i ostavi rez slobodnim',
        de: 'Hinter dem Außenverteidiger einlaufen erst wenn der Kreisläufer zur Mitte freimacht und die Schnittbahn freilässt',
      },
      feedback: {
        en: 'Right when the pivot creates a real lane; here he is still sealed in the left corridor.',
        hr: 'Ispravno kad pivot stvarno otvori stazu; ovdje je još zatvoren u lijevom prostoru.',
        de: 'Richtig wenn der Kreisläufer eine echte Bahn öffnet; hier dichtet er noch im linken Raum ab.',
      },
    },
    {
      quality: 'risky',
      text: {
        en: 'Cut immediately into the space behind the helping wing defender while the pivot is still there',
        hr: 'Odmah sijeci u prostor iza krilnog braniča koji pomaže dok je pivot još tamo',
        de: 'Sofort in den Raum hinter dem helfenden Außenverteidiger schneiden während der Kreisläufer noch dort ist',
      },
      feedback: {
        en: 'Risky — you stack on your own pivot and kill the wide 6v5 stretch.',
        hr: 'Rizično — slažeš se na vlastitog pivota i gasiš široku 6v5 rastegnutost.',
        de: 'Riskant — du stapelst dich auf den eigenen Kreisläufer und löschst die breite 6v5-Dehnung.',
      },
    },
    {
      quality: 'poor',
      text: {
        en: 'Come up to the left back for a short hand-off in front of the defence and abandon the corner',
        hr: 'Dođi do lijevog vanjskog na kratku predaju ispred obrane i napusti kut',
        de: 'Zum linken Rückraum zur kurzen Übergabe vor der Abwehr kommen und die Ecke verlassen',
      },
      feedback: {
        en: 'Poor — you give away width without solving the stay-wide vs entry read.',
        hr: 'Loše — predaješ širinu bez rješavanja čitanja ostani široko ili uđi.',
        de: 'Schlecht — du verschenkst Breite ohne die Lese breit bleiben oder einlaufen zu lösen.',
      },
    },
  ],
  explanation: {
    en: 'Cue: wing defender hips/chest turn inside (cut looks free) but pivot is still sealed on the left half of six in that corridor. First decision is stay wide and keep the stretch. Entry is only good after the pivot clears toward the middle. 6v5 creates the overload; it does not order an automatic wing entry.',
    hr: 'Čitaj: bokovi/prsa krilnog braniča unutra (rez izgleda slobodan), ali pivot je još zatvoren na lijevoj polovici šestice u tom prostoru. Prva odluka je ostani široko i drži rastegnutost. Ulazak je dobar tek kad se pivot makne prema sredini. 6v5 stvara preopterećenje; ne naređuje automatski ulazak krila.',
    de: 'Lesen: Hüfte/Brust des Außenverteidigers nach innen (Schnitt wirkt frei), aber der Kreisläufer dichtet noch auf der linken Sechs-Hälfte in diesem Raum ab. Erste Entscheidung: breit bleiben und die Dehnung halten. Einlaufen ist erst gut wenn der Kreisläufer zur Mitte freimacht. 6v5 erzeugt die Überzahl; sie befiehlt keinen automatischen Flügeleinlauf.',
  },
  whyCorrectOverSecondBest: {
    en: 'A keeps width while the pivot still occupies the cut corridor; B enters only after that corridor is cleared.',
    hr: 'A drži širinu dok pivot još zauzima prostor za rez; B ulazi tek kad se taj prostor isprazni.',
    de: 'A hält Breite solange der Kreisläufer den Schnittraum noch belegt; B läuft erst ein wenn dieser Raum frei ist.',
  },
  perception: true,
  handedness: 'none',
  numerical: '6v5',
  reviewer: {
    teachingObjective:
      'In 6v5, read pivot corridor + WD narrowing before choosing stay-wide vs entry — not automatic entry',
    primaryCue: 'WD hips/chest inside + pivot still on left-half six corridor',
    whyOptimal: 'Stay wide; cut lane occupied by own pivot',
    whyGoodConditional: 'Enter only after pivot clears toward middle',
    whyRisky: 'Immediate cut stacks on pivot',
    whyPoor: 'Hand-off walk-up abandons width without solving the read',
    cloneRisk:
      'Distinct from RW 878 (finish when help >2m) and from LW 945 (6v6 entry-when-not); this is 6v5 + pivot corridor cue',
  },
  fingerprint: {
    objective: '6v5 stay wide vs entry from pivot corridor + WD narrow',
    cue: 'WD inside commit + pivot still left-half corridor',
    relationship: 'LW–pivot–WD–LB',
    structure: '6v5',
    decision: 'stay wide and ask',
    timing: 'before pivot clears',
    risk: 'crowd own pivot / kill stretch',
  },
};

const idx = bank.findIndex((s) => s.id === 'scn_bank_948');
if (idx < 0) throw new Error('scn_bank_948 missing');

const old = bank[idx];
bank[idx] = {
  ...old,
  id: 'scn_bank_948',
  title: content.title,
  category: 'Left Wing',
  primaryPosition: 'Left Wing',
  secondaryPositions: [],
  difficulty: content.difficulty,
  pressureLevel: content.pressureLevel,
  attackOrDefence: content.attackOrDefence,
  matchPhase: content.matchPhase,
  minute: content.minute,
  score: content.score,
  defensiveSystem: content.defensiveSystem,
  situation: content.situation,
  question: content.question,
  answers: content.answers,
  explanation: content.explanation,
  whyCorrectOverSecondBest: content.whyCorrectOverSecondBest,
  skillTags: [
    'decisionMaking',
    'spacing',
    'teamplay',
    'perception',
    'numericalAdvantage',
    'numerical:6v5',
    `family:${familyKey}`,
    'pilot:lw_pilot_08',
  ],
  qualityScore: old.qualityScore ?? 8.6,
};

const pIdx = pilots.findIndex((p) => p.pilotId === 'lw_pilot_08' || p.familyKey === 'lw_6v5_finish_help_late' || (pilots[7] && true));
const p = pilots[7];
if (!p) throw new Error('pilot index 7 missing');

Object.assign(p, {
  teachingArea: 'numerical_attack',
  familyKey,
  title: content.title,
  difficulty: content.difficulty,
  pressureLevel: content.pressureLevel,
  attackOrDefence: content.attackOrDefence,
  matchPhase: content.matchPhase,
  minute: content.minute,
  score: content.score,
  defensiveSystem: content.defensiveSystem,
  skillTags: ['decisionMaking', 'spacing', 'teamplay', 'perception', 'numericalAdvantage'],
  perception: true,
  handedness: 'none',
  numerical: '6v5',
  gameState: 'none',
  primaryTacticalCue: geometry.exactCue,
  fingerprint: content.fingerprint,
  situation: content.situation,
  question: content.question,
  answers: content.answers,
  explanation: content.explanation,
  whyCorrectOverSecondBest: content.whyCorrectOverSecondBest,
  reviewer: content.reviewer,
  surgicalStatus: 'REPLACED',
  duplicationNote:
    'Old finish-when-help->2m decision removed (duplicate of RW 878). New LW-native 6v5 stay-wide vs entry with pivot corridor cue.',
  geometry,
});

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const after = hashPos(k === 'LB' ? 'Left Back' : k === 'RB' ? 'Right Back' : k === 'CB' ? 'Centre Back' : 'Right Wing');
  if (after !== lockBefore[k]) throw new Error(`LOCK CHANGED ${k}`);
}

// ensure only 948 among pilots changed vs other IDs still present
for (const id of [
  'scn_bank_941',
  'scn_bank_942',
  'scn_bank_943',
  'scn_bank_944',
  'scn_bank_945',
  'scn_bank_946',
  'scn_bank_947',
  'scn_bank_949',
  'scn_bank_950',
]) {
  if (!bank.find((s) => s.id === id && s.primaryPosition === 'Left Wing')) {
    throw new Error(`Pilot missing after edit: ${id}`);
  }
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(pilotPath, JSON.stringify(pilots, null, 2) + '\n');

const report = {
  status: '948_REPLACED',
  id: 'scn_bank_948',
  oldFamilyKey: 'lw_6v5_finish_help_late',
  newFamilyKey: familyKey,
  geometry,
  teachingDecision: {
    optimal: 'Stay wide and ask — pivot still occupies entry corridor',
    good: 'Enter only after pivot clears toward middle',
    notTaught: ['always stay wide in 6v5', 'always enter when WD helps', 'seal automatically means entry'],
  },
  distinctFrom: {
    rw_878: 'RW 878 = free wing + help >2m ⇒ finish. New 948 = stay-wide vs entry from pivot corridor in 6v5.',
    lw_945: '945 is 6v6 when-not-enter during LB drive. 948 is 6v5 with pivot seal corridor + WD narrow.',
  },
  perception: true,
  handedness: 'none',
  difficulty: 'Advanced',
  lockOk: true,
};

writeFileSync(join(root, 'scripts/lw-948-replacement-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
