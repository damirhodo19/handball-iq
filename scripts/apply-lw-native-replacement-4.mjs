#!/usr/bin/env node
/**
 * Replace LW pilot 945, 947, 949, 950 only.
 * Does not touch 941–944, 946, 948 or LB/RB/CB/RW.
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
const lockBefore = JSON.parse(readFileSync(join(root, 'scripts/.lw-native-lock-before.json'), 'utf8'));

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
  'scn_bank_946',
  'scn_bank_948',
];

const replacements = {
  scn_bank_945: {
    pilotIndex: 4,
    pilotId: 'lw_pilot_05',
    teachingArea: 'second_pivot_exit',
    familyKey: 'lw_second_pivot_release_to_width',
    title: {
      en: 'Left Wing — Release the Second Pivot and Recover Width When Left Back Loses the Drive',
      hr: 'Lijevo krilo — pusti drugi pivot i vrati širinu kad lijevi vanjski izgubi prodor',
      de: 'Linksaußen — den zweiten Kreisläufer freigeben und Breite zurückholen wenn der linke Rückraum den Durchbruch verliert',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 33,
    score: '17:16',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    skillTags: ['decisionMaking', 'spacing', 'teamplay', 'timing', 'perception'],
    primaryCue: 'LB loses forward path / doubled; first pivot still on left half; LW already deep as second pivot',
    situation: {
      en: 'You lead 17:16 at 33\' against 6:0. You have already entered from the left wing and stand as a second pivot on the left half of the six. Your first pivot is still fighting on that same left half. The left back was driving, but their half and wing now double him — his chest turns sideways and he has no forward path. There is no clean pass into the stacked left six. If you stay fighting there, three attackers occupy the same short space and the left side has no width left.',
      hr: 'Vodite 17:16 u 33. minuti protiv 6:0. Već si ušao s lijevog krila i stojiš kao drugi pivot na lijevoj polovici šestice. Prvi pivot još se bori na istoj lijevoj polovici. Lijevi vanjski je vukao, ali polubranitelj i krilo ga sada udvajaju — prsa mu se okreću u stranu i nema puta naprijed. Nema čistog pasa u zbijenu lijevu šesticu. Ako ostaneš tamo u borbi, trojica napadača drže isti mali prostor i lijeva strana više nema širinu.',
      de: 'Ihr führt 17:16 in Minute 33 gegen 6:0. Du bist schon vom Linksaußen eingelaufen und stehst als zweiter Kreisläufer auf der linken Sechs-Hälfte. Der erste Kreisläufer kämpft noch auf genau dieser linken Hälfte. Der linke Rückraum hat gezogen, aber Halber und Außen doppeln ihn jetzt — seine Brust dreht seitlich und er hat keinen Weg nach vorne. Es gibt keinen sauberen Pass in die verdichtete linke Sechs. Bleibst du dort im Kampf, belegen drei Angreifer denselben engen Raum und die linke Seite hat keine Breite mehr.',
    },
    question: {
      en: 'The left back has lost the drive and the left six is stacked — what is your first action?',
      hr: 'Lijevi vanjski je izgubio prodor i lijeva šestica je zbijena — što je tvoja prva akcija?',
      de: 'Der linke Rückraum hat den Durchbruch verloren und die linke Sechs ist verdichtet — was ist deine erste Aktion?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Sprint back out to width on the left sideline to reopen the stretch for the next action',
          hr: 'Sprintaj natrag u širinu uz lijevu aut-liniju da opet otvoriš rastegnutost za sljedeću akciju',
          de: 'Zurück an die linke Seitenlinie sprinten um die Dehnung für die nächste Aktion wieder zu öffnen',
        },
        feedback: {
          en: 'Correct — once the drive is dead and the six is stacked, your value is width again, not a third body inside.',
          hr: 'Točno — kad je prodor mrtav i šestica zbijena, tvoja je vrijednost opet širina, ne treće tijelo unutra.',
          de: 'Richtig — ist der Durchbruch tot und die Sechs verdichtet ist dein Wert wieder Breite nicht ein dritter Körper innen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Stay as second pivot only if the left back still has a free arm and a clear bounce-pass lane into you before contact',
          hr: 'Ostani drugi pivot samo ako lijevi vanjski još ima slobodnu ruku i čistu liniju za kratki pas u tebe prije kontakta',
          de: 'Als zweiter Kreisläufer nur bleiben wenn der linke Rückraum noch einen freien Arm und eine klare kurze Passlinie auf dich vor dem Kontakt hat',
        },
        feedback: {
          en: 'Valid with a live short pass; here he is doubled with no forward path.',
          hr: 'Valjano uz živi kratki pas; ovdje je udvojen bez puta naprijed.',
          de: 'Gültig bei lebendigem kurzen Pass; hier ist er gedoppelt ohne Weg nach vorne.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Keep wrestling on the six hoping the left back forces a pass into the crowd',
          hr: 'Nastavi se boriti na šestici nadajući se da će lijevi vanjski forsati pas u gužvu',
          de: 'Weiter auf der Sechs kämpfen in der Hoffnung der Rückraum forciert einen Pass in die Enge',
        },
        feedback: {
          en: 'Risky — you stay in a dead stack and leave the left side empty.',
          hr: 'Rizično — ostaješ u mrtvoj gužvi i ostavljaš lijevu stranu praznom.',
          de: 'Riskant — du bleibst in einer toten Enge und lässt die linke Seite leer.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drift into the middle to ask the centre back for a new high catch',
          hr: 'Odlutaj u sredinu da tražiš novi visoki prijem od srednjeg vanjskog',
          de: 'In die Mitte treiben und vom Rückraum Mitte einen neuen hohen Fang fordern',
        },
        feedback: {
          en: 'Poor — you abandon both the second-pivot exit and the left width job.',
          hr: 'Loše — napuštaš i izlazak iz drugog pivota i posao lijeve širine.',
          de: 'Schlecht — du verlässt sowohl den Exit aus dem zweiten Kreisläufer als auch die linke Breite.',
        },
      },
    ],
    explanation: {
      en: 'Cue: you are already second pivot; first pivot still left; LB doubled with no forward path. First action is recover width. Staying only works with a live short pass that is not there.',
      hr: 'Čitaj: već si drugi pivot; prvi pivot još lijevo; lijevi vanjski udvojen bez puta naprijed. Prva akcija je vratiti širinu. Ostati radi samo uz živi kratki pas kojeg nema.',
      de: 'Lesen: du bist schon zweiter Kreisläufer; erster noch links; Rückraum gedoppelt ohne Weg nach vorne. Erste Aktion: Breite zurück. Bleiben geht nur mit lebendigem kurzen Pass den es nicht gibt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A reopens width after a dead stacked drive; B needs a free-arm short pass that the situation removes.',
      hr: 'A ponovo otvara širinu nakon mrtvog zbijenog prodora; B treba kratki pas sa slobodnom rukom kojeg situacija briše.',
      de: 'A öffnet Breite nach totem verdichtetem Durchbruch; B braucht einen kurzen Pass mit freiem Arm den die Situation löscht.',
    },
    reviewer: {
      teachingObjective: 'Exit second-pivot stack and recover left width when LB drive dies',
      primaryCue: 'LB doubled / no forward path + first pivot still left + LW already deep',
      cloneRisk: 'Complements 948; not RW 918',
    },
  },

  scn_bank_947: {
    pilotIndex: 6,
    pilotId: 'lw_pilot_07',
    teachingArea: 'second_wave_left',
    familyKey: 'lw_sw_left_wd_late_one_more',
    title: {
      en: 'Left Wing — Second Wave: Take One More Left Action While Their Wing Defender Is Still Late',
      hr: 'Lijevo krilo — drugi val: odradi još jednu lijevu akciju dok njihov krilni branič još kasni',
      de: 'Linksaußen — zweite Welle: noch eine linke Aktion solange ihr Außenverteidiger noch spät ist',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Fast Break',
    minute: 22,
    score: '12:12',
    defensiveSystem: 'Mixed',
    perception: true,
    handedness: 'none',
    numerical: 'transition',
    skillTags: ['transition', 'timing', 'decisionMaking', 'perception', 'numerical:transition'],
    primaryCue: 'First wave dead middle/right; defence half-set; opposing left WD still >2m late from left corner',
    situation: {
      en: 'Tied 12:12 at 22\' after a steal. The first-wave 3v2 through the middle is gone — their recovering defenders have closed the centre. The attack is becoming a second wave. On the left, their wing defender is still more than two metres from your corner and turning late. The left back is free to receive one pass into the left channel. A full slow reset to nine metres would gift that defender the recovery he has not finished.',
      hr: 'Neriješeno je 12:12 u 22. minuti nakon oduzimanja. Prvi val 3v2 kroz sredinu je gotov — njihovi braniči u povratku zatvorili su centar. Napad prelazi u drugi val. Lijevo njihov krilni branič još je više od dva metra od tvog kuta i kasno se okreće. Lijevi vanjski je slobodan primiti jedno dodavanje u lijevi kanal. Spori potpuni reset na devet metara poklonio bi tom braniču povratak koji još nije završio.',
      de: 'Unentschieden 12:12 in Minute 22 nach einem Ballgewinn. Die erste Welle 3v2 durch die Mitte ist weg — ihre zurücklaufenden Verteidiger haben das Zentrum geschlossen. Der Angriff wird zur zweiten Welle. Links ist ihr Außenverteidiger noch mehr als zwei Meter von deiner Ecke entfernt und dreht spät. Der linke Rückraum ist frei einen Pass in den linken Kanal zu fangen. Ein langsamer kompletter Reset auf neun Meter schenkt diesem Verteidiger die Rückkehr die er noch nicht fertig hat.',
    },
    question: {
      en: 'The middle is closed but their left wing defender is still late — what do you do?',
      hr: 'Sredina je zatvorena, ali njihov lijevi krilni branič još kasni — što radiš?',
      de: 'Die Mitte ist zu aber ihr linker Außenverteidiger ist noch spät — was machst du?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay wide and demand the ball now for one more left-side advantage action before he recovers',
          hr: 'Ostani široko i traži loptu sada za još jednu prednost na lijevoj strani prije nego se vrati',
          de: 'Breit bleiben und den Ball jetzt fordern für noch eine linke Vorteilaktion bevor er zurück ist',
        },
        feedback: {
          en: 'Correct — second wave is not automatic reset while the left defender is still late.',
          hr: 'Točno — drugi val nije automatski reset dok lijevi branič još kasni.',
          de: 'Richtig — zweite Welle ist kein automatischer Reset solange der linke Verteidiger noch spät ist.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Accept a full positional reset only if that wing defender recovers inside two metres before the pass is released',
          hr: 'Prihvati potpuni pozicijski reset samo ako se taj krilni branič vrati unutar dva metra prije nego pas krene',
          de: 'Einen vollen Positionsreset nur akzeptieren wenn dieser Außenverteidiger vor der Passabgabe unter zwei Meter zurück ist',
        },
        feedback: {
          en: 'Right when the late defender arrives; here he is still outside two metres.',
          hr: 'Ispravno kad kasni branič stigne; ovdje je još izvan dva metra.',
          de: 'Richtig wenn der späte Verteidiger ankommt; hier ist er noch außerhalb zwei Meter.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Cut into the closed middle to ‘help’ restart the first-wave numbers that are already gone',
          hr: 'Sijeci u zatvorenu sredinu da ‘pomogneš’ vratiti brojeve prvog vala koji su već gotovi',
          de: 'In die geschlossene Mitte schneiden um die Zahlen der ersten Welle ‘zurückzuholen’ die schon weg sind',
        },
        feedback: {
          en: 'Risky — you run into the covered middle and abandon the live left advantage.',
          hr: 'Rizično — ulaziš u pokrivenu sredinu i napuštaš živu lijevu prednost.',
          de: 'Riskant — du läufst in die gedeckte Mitte und verlässt den lebenden linken Vorteil.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stop at halfway and wait for the coach to call a set play',
          hr: 'Stani na polovici i čekaj da trener najavi pozicijsku akciju',
          de: 'Auf halber Distanz stoppen und warten bis der Trainer eine Positionsaktion ruft',
        },
        feedback: {
          en: 'Poor — you resign a live second-wave left advantage.',
          hr: 'Loše — odustaješ od žive prednosti drugog vala lijevo.',
          de: 'Schlecht — du gibst einen lebenden Vorteil der zweiten Welle links auf.',
        },
      },
    ],
    explanation: {
      en: 'Cue: middle closed (first wave dead) but left WD still >2m late. Second wave means one more left action now, not an automatic full reset. Reset becomes good only after he recovers inside two metres.',
      hr: 'Čitaj: sredina zatvorena (prvi val gotov), ali lijevi krilni branič još >2 m kasni. Drugi val znači još jedna lijeva akcija sada, ne automatski potpuni reset. Reset je dobar tek kad se vrati unutar dva metra.',
      de: 'Lesen: Mitte zu (erste Welle tot) aber linker Außen noch >2 m spät. Zweite Welle heißt noch eine linke Aktion jetzt kein automatischer Vollreset. Reset erst wenn er unter zwei Meter zurück ist.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses the late left defender now; B waits for a recovery that has not finished.',
      hr: 'A koristi kasnog lijevog braniča sada; B čeka povratak koji nije završen.',
      de: 'A nutzt den späten linken Verteidiger jetzt; B wartet auf eine Rückkehr die nicht fertig ist.',
    },
    reviewer: {
      teachingObjective: 'Second wave: one more left action while WD still late',
      primaryCue: 'Middle closed + left WD >2m from corner',
      cloneRisk: 'Opposite of RW 877 stop-forcing',
    },
  },

  scn_bank_949: {
    pilotIndex: 8,
    pilotId: 'lw_pilot_09',
    teachingArea: 'set_defence_deny_entry',
    familyKey: 'lw_def_deny_backdoor_left',
    title: {
      en: 'Left Wing — Defence: Deny the Back-Door When You Are Tempted to Ball-Watch',
      hr: 'Lijevo krilo — obrana: spriječi ulazak iza leđa kad te vuče gledati loptu',
      de: 'Linksaußen — Abwehr: das Hinterlaufen verhindern wenn dich der Ballblick lockt',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 18,
    score: '9:9',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    skillTags: ['defence', 'perception', 'positioning', 'timing'],
    primaryCue: 'Opp RW starts back-door behind you while you turn head to opp RB drive',
    situation: {
      en: 'Tied 9:9 at 18\' in your 6:0. You defend the left-side wing. Their right back drives between you and your half defender. The ball is live in that drive, so your head wants to turn fully to the ball. At the same moment their right wing — the attacker on your side — drops the shoulder and starts a back-door cut behind your back toward the six. You still have contact distance to him if you keep a hand/chest feel; if you fully ball-watch, he arrives alone.',
      hr: 'Neriješeno je 9:9 u 18. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski vuče između tebe i tvog polubranitelja. Lopta je živa u tom prodoru, pa ti glava želi potpuno prema lopti. U istom trenutku njihovo desno krilo — napadač na tvojoj strani — spušta rame i kreće ulazak iza tvojih leđa prema šestici. Još imaš kontaktnu udaljenost ako držiš osjećaj rukom/prsima; ako potpuno gledaš loptu, stiže sam.',
      de: 'Unentschieden 9:9 in Minute 18 in eurer 6:0. Du verteidigst Linksaußen. Ihr rechter Rückraum zieht zwischen dir und deinem Halben. Der Ball lebt in diesem Durchbruch deshalb will dein Kopf voll zum Ball. Im selben Moment lässt ihr Rechtsaußen — der Angreifer auf deiner Seite — die Schulter fallen und startet Hinterlaufen hinter deinem Rücken zur Sechs. Du hast noch Kontaktdistanz wenn du Hand/Brust-Gefühl hältst; ballwatchst du voll kommt er allein an.',
    },
    question: {
      en: 'Their wing starts behind you while the drive pulls your eyes — what is first?',
      hr: 'Njihovo krilo kreće iza tebe dok prodor vuče pogled — što je prvo?',
      de: 'Ihr Flügel startet hinter dir während der Durchbruch deinen Blick zieht — was ist zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Keep contact feel on their wing and deny the back-door path — do not fully turn to the ball',
          hr: 'Drži kontaktni osjećaj na njihovom krilu i zatvori put ulaska iza leđa — ne okreći se potpuno na loptu',
          de: 'Kontaktgefühl am gegnerischen Flügel halten und den Hinterlaufen-Weg schließen — nicht voll zum Ball drehen',
        },
        feedback: {
          en: 'Correct — the runner behind you is your first responsibility when he starts the cut.',
          hr: 'Točno — trkač iza tebe tvoja je prva odgovornost kad krene rez.',
          de: 'Richtig — der Läufer hinter dir ist deine erste Verantwortung wenn er den Schnitt startet.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Release the wing and jump the ball only after your half clearly takes their wing by contact and call',
          hr: 'Pusti krilo i skoči na loptu samo ako tvoj polubranitelj jasno preuzme njihovo krilo kontaktom i glasom',
          de: 'Den Flügel erst freigeben und zum Ball springen wenn dein Halber ihren Flügel klar per Kontakt und Ruf übernimmt',
        },
        feedback: {
          en: 'Valid after a real takeover of the runner; that has not happened.',
          hr: 'Valjano nakon pravog preuzimanja trkača; to se nije dogodilo.',
          de: 'Gültig nach echter Übernahme des Läufers; das ist nicht passiert.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Fully turn and chase the right back’s ball because the drive looks more dangerous',
          hr: 'Potpuno se okreni i juri loptu desnog vanjskog jer prodor izgleda opasnije',
          de: 'Voll drehen und den Ball des rechten Rückraums jagen weil der Durchbruch gefährlicher wirkt',
        },
        feedback: {
          en: 'Risky — you gift the back-door finish behind you.',
          hr: 'Rizično — poklanjaš završnicu ulaskom iza leđa.',
          de: 'Riskant — du schenkst den Hinterlaufen-Abschluss hinter dir.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drop two metres toward the corner without contact and wait to see who receives',
          hr: 'Ispusti se dva metra prema kutu bez kontakta i čekaj tko će primiti',
          de: 'Zwei Meter zur Ecke ohne Kontakt fallen und warten wer fängt',
        },
        feedback: {
          en: 'Poor — you give the runner a free path and help nobody on the ball.',
          hr: 'Loše — daješ trkaču slobodan put i ne pomažeš nikome na lopti.',
          de: 'Schlecht — du gibst dem Läufer freien Weg und hilfst niemandem am Ball.',
        },
      },
    ],
    explanation: {
      en: 'Cue: opposing right wing starts back-door while the right-back drive pulls your eyes. First job is deny the runner with contact feel. Jumping the ball is only good after a teammate truly takes that runner.',
      hr: 'Čitaj: protivničko desno krilo kreće ulazak iza leđa dok prodor desnog vanjskog vuče pogled. Prvi je posao zatvoriti trkača kontaktom. Skočiti na loptu dobro je tek kad suigrač stvarno preuzme tog trkača.',
      de: 'Lesen: gegnerischer Rechtsaußen startet Hinterlaufen während der rechte Rückraum deinen Blick zieht. Erste Aufgabe: Läufer per Kontaktgefühl schließen. Zum Ball springen erst wenn ein Mitspieler diesen Läufer wirklich übernimmt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A stops the live back-door now; B needs a teammate takeover that is not stated.',
      hr: 'A zaustavlja živi ulazak iza leđa sada; B treba preuzimanje suigrača koje nije navedeno.',
      de: 'A stoppt das lebende Hinterlaufen jetzt; B braucht eine Mitspieler-Übernahme die nicht genannt ist.',
    },
    reviewer: {
      teachingObjective: 'Deny back-door on left wing when ball-watch temptation appears',
      primaryCue: 'Opp RW shoulder drop / cut behind + RB drive pulling eyes',
      cloneRisk: 'Not RW 880 handover lesson',
    },
  },

  scn_bank_950: {
    pilotIndex: 9,
    pilotId: 'lw_pilot_10',
    teachingArea: 'set_defence_recovery',
    familyKey: 'lw_def_recovery_to_wing_after_help',
    title: {
      en: 'Left Wing — Defence: Recover to the Wing When the Ball Reverses After Your Help',
      hr: 'Lijevo krilo — obrana: vrati se na krilo kad se lopta vrati nakon tvoje pomoći',
      de: 'Linksaußen — Abwehr: zum Flügel zurück wenn der Ball nach deiner Hilfe zurückkehrt',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 36,
    score: '18:18',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    skillTags: ['defence', 'perception', 'timing', 'decisionMaking'],
    primaryCue: 'Ball reverses toward opp right wing after your help step; skip lane opening; no handover',
    situation: {
      en: 'Tied 18:18 at 36\' in your 6:0. You defend left wing. Their right back drove, so you gave a controlled help step inside toward the ball. Now the ball is reversed — their centre back looks to the wide right wing on your side for a skip. That wing is still near the sideline. Your half has not taken the wing by handover. If you stay helping inside, the skip arrives before you recover.',
      hr: 'Neriješeno je 18:18 u 36. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski je vukao, pa si dao kontrolirani korak pomoći unutra prema lopti. Sada se lopta vraća — njihov srednji vanjski gleda široko desno krilo na tvojoj strani za dugački pas. To krilo još je uz aut-liniju. Tvoj polubranitelj nije preuzeo krilo preuzimanjem. Ako ostaneš pomagati unutra, dugački pas stiže prije nego se vratiš.',
      de: 'Unentschieden 18:18 in Minute 36 in eurer 6:0. Du verteidigst Linksaußen. Ihr rechter Rückraum hat gezogen deshalb gabst du einen kontrollierten Hilfeschritt nach innen zum Ball. Jetzt kommt der Ball zurück — ihr Rückraum Mitte schaut zum breiten Rechtsaußen auf deiner Seite für den Skip. Dieser Flügel steht noch an der Seitenlinie. Dein Halber hat den Flügel nicht per Übergabe übernommen. Bleibst du innen helfen kommt der Skip bevor du zurück bist.',
    },
    question: {
      en: 'The ball has reversed to the wide wing after your help — what is first?',
      hr: 'Lopta se vratila na široko krilo nakon tvoje pomoći — što je prvo?',
      de: 'Der Ball ist nach deiner Hilfe auf den breiten Flügel zurück — was ist zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Sprint recover to the wing and close the skip lane before the pass arrives',
          hr: 'Sprintom se vrati na krilo i zatvori liniju dugog pasa prije nego pas stigne',
          de: 'Per Sprint zum Flügel zurück und die Skip-Linie schließen bevor der Pass ankommt',
        },
        feedback: {
          en: 'Correct — after help, ball reverse makes recovery your first job when no handover exists.',
          hr: 'Točno — nakon pomoći, povrat lopte čini povratak tvojim prvim poslom dok nema preuzimanja.',
          de: 'Richtig — nach Hilfe macht Ballrückkehr die Rückkehr zu deinem ersten Job solange keine Übergabe da ist.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Stay helping inside only if your half has already stepped onto the wing lane and called that he owns the skip',
          hr: 'Ostani pomagati unutra samo ako je polubranitelj već stao na liniju prema krilu i javio da on drži dugački pas',
          de: 'Nur innen weiterhelfen wenn der Halbe schon auf der Flügellinie steht und ruft dass er den Skip hat',
        },
        feedback: {
          en: 'Valid with a real cover call; here the half has not taken the wing.',
          hr: 'Valjano uz pravo pokriće; ovdje polubranitelj nije preuzeo krilo.',
          de: 'Gültig bei echter Deckung; hier hat der Halbe den Flügel nicht übernommen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Stay inside because the original drive ‘still looks dangerous’ even though the ball has left',
          hr: 'Ostani unutra jer originalni prodor ‘još izgleda opasno’ iako je lopta otišla',
          de: 'Innen bleiben weil der ursprüngliche Durchbruch ‘noch gefährlich wirkt’ obwohl der Ball weg ist',
        },
        feedback: {
          en: 'Risky — you guard a ball that is gone and open the skip.',
          hr: 'Rizično — čuvaš loptu koja je otišla i otvaraš dugački pas.',
          de: 'Riskant — du bewachst einen Ball der weg ist und öffnest den Skip.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Walk back slowly and raise a hand to protest the earlier drive',
          hr: 'Polako se vrati i digni ruku da prosvjeduješ zbog ranijeg prodora',
          de: 'Langsam zurückgehen und die Hand heben um gegen den früheren Durchbruch zu protestieren',
        },
        feedback: {
          en: 'Poor — the skip does not wait for a protest.',
          hr: 'Loše — dugački pas ne čeka prosvjed.',
          de: 'Schlecht — der Skip wartet nicht auf einen Protest.',
        },
      },
    ],
    explanation: {
      en: 'Cue: you helped inside; ball reverses to the wide opposing wing; no handover. First action is sprint recovery to close the skip. Staying inside is only good if the half already owns that wing lane.',
      hr: 'Čitaj: pomogao si unutra; lopta se vraća na široko protivničko krilo; nema preuzimanja. Prva akcija je sprint-povratak da zatvoriš dugački pas. Ostati unutra dobro je samo ako polubranitelj već drži tu krilnu liniju.',
      de: 'Lesen: du hast innen geholfen; Ball zurück auf den breiten gegnerischen Flügel; keine Übergabe. Erste Aktion: Sprint-Rückkehr um den Skip zu schließen. Innen bleiben nur wenn der Halbe diese Flügellinie schon besitzt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A races the live skip after ball reverse; B needs a half cover call that is absent.',
      hr: 'A trči utrku s živim dugim pasom nakon povrata lopte; B treba javljanje polubranitelja kojeg nema.',
      de: 'A sprintet gegen den lebenden Skip nach Ballrückkehr; B braucht einen Halb-Ruf der fehlt.',
    },
    reviewer: {
      teachingObjective: 'Recover to wing after help when ball reverses — no handover',
      primaryCue: 'Ball reverse to wide wing + no half takeover',
      cloneRisk: 'Not 880/928/929',
    },
  },
};

// verify locked pilots unchanged before write
for (const id of LOCKED_IDS) {
  const s = bank.find((x) => x.id === id);
  const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (h !== lockBefore.pilots[id]) {
    throw new Error(`Locked pilot changed before apply: ${id}`);
  }
}

const changeLog = [];

for (const [id, r] of Object.entries(replacements)) {
  const idx = bank.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error(`Missing ${id}`);
  const old = bank[idx];
  const oldFamily = (old.skillTags || []).find((t) => String(t).startsWith('family:'));

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
    skillTags: [
      ...r.skillTags,
      ...(r.numerical && r.numerical !== '6v6' && !r.skillTags.some((t) => String(t).startsWith('numerical:'))
        ? [`numerical:${r.numerical}`]
        : []),
      `family:${r.familyKey}`,
      `pilot:${r.pilotId}`,
    ],
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
    primaryTacticalCue: r.primaryCue,
    situation: r.situation,
    question: r.question,
    answers: r.answers,
    explanation: r.explanation,
    whyCorrectOverSecondBest: r.whyCorrectOverSecondBest,
    reviewer: r.reviewer,
    surgicalStatus: 'NATIVE_REPLACED',
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
  });
}

// lock checks
for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(pos) !== lockBefore[k]) throw new Error(`LOCK HASH CHANGED ${k}`);
}
for (const id of LOCKED_IDS) {
  const s = bank.find((x) => x.id === id);
  const h = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
  if (h !== lockBefore.pilots[id]) throw new Error(`Locked pilot mutated: ${id}`);
}

const lw = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 50) throw new Error(`LW count ${lw} != 50`);

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(pilotPath, JSON.stringify(pilots, null, 2) + '\n');

const report = {
  status: 'PHASE_B_APPLIED',
  changeLog,
  lockOk: true,
  lwCount: lw,
};
writeFileSync(join(root, 'scripts/lw-native-replacement-4-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
