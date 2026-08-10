#!/usr/bin/env node
/**
 * Surgical human-coach polish for LW pilot scn_bank_941–950.
 * Does NOT touch LB/RB/CB/RW. Does NOT change IDs or familyKeys.
 * 948: marked REPLACE NEEDED — content left unchanged.
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

/** Full scenario field patches keyed by id. familyKey / id untouched. */
const patches = {
  scn_bank_941: {
    title: {
      en: 'Left Wing — Hold Width Before the Wing Defender Is Bound',
      hr: 'Lijevo krilo — drži širinu dok krilni branič nije vezan',
      de: 'Linksaußen — Breite halten bevor der Außenverteidiger gebunden ist',
    },
    situation: {
      en: 'Tied 6:6 at 11\' against a set 6:0. You are the left wing. You have drifted about two metres inside from the sideline because the left back has the ball at nine metres. Your wing defender is still between you and the goal, and the half defender is on the left back. Nobody has bound your wing defender yet. Coming closer to the left back now looks helpful, but it shortens the left side before the attack has stretched the defence.',
      hr: 'Neriješeno je 6:6 u 11. minuti protiv postavljene 6:0. Ti si lijevo krilo. Otišao si oko dva metra unutra od aut-linije jer lijevi vanjski ima loptu na devet metara. Tvoj krilni branič još je između tebe i gola, a polubranitelj je na lijevom vanjskom. Nitko još nije vezao tvog krilnog braniča. Prići bliže lijevom vanjskom sada izgleda korisno, ali sužava lijevu stranu prije nego je napad uopće rastegnuo obranu.',
      de: 'Unentschieden 6:6 in Minute 11 gegen eine stehende 6:0. Du bist Linksaußen. Du bist etwa zwei Meter von der Seitenlinie nach innen gerutscht, weil der linke Rückraum den Ball auf neun Metern hat. Dein Außenverteidiger steht noch zwischen dir und dem Tor, der Halbe am linken Rückraum. Niemand hat deinen Außenverteidiger gebunden. Näher an den Rückraum zu gehen wirkt jetzt hilfreich, verkürzt aber die linke Seite bevor der Angriff die Abwehr gestreckt hat.',
    },
    question: {
      en: 'Where should you stand before the left back binds the wing defender?',
      hr: 'Gdje trebaš stajati prije nego lijevi vanjski veže krilnog braniča?',
      de: 'Wo sollst du stehen bevor der linke Rückraum den Außenverteidiger bindet?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Get back wide to the sideline and stay there so the left side stays open for the left back',
          hr: 'Vrati se široko uz aut-liniju i ostani tamo da lijeva strana ostane otvorena za lijevog vanjskog',
          de: 'Wieder breit an die Seitenlinie und dort bleiben damit die linke Seite für den Rückraum offen bleibt',
        },
        feedback: {
          en: 'Correct — width first; coming inside early only helps the defence shorten your side.',
          hr: 'Točno — prvo širina; rano dolaziti unutra samo pomaže obrani da skráti tvoju stranu.',
          de: 'Richtig — zuerst Breite; früh nach innen zu kommen hilft nur der Abwehr deine Seite zu verkürzen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Take one step inside only after the left back has clearly bound the wing defender and calls you into the gap',
          hr: 'Uđi jedan korak unutra tek kad lijevi vanjski jasno veže krilnog braniča i zove te u prostor',
          de: 'Einen Schritt nach innen erst wenn der linke Rückraum den Außenverteidiger klar bindet und dich in den Raum ruft',
        },
        feedback: {
          en: 'Valid after a real bind and call; here nobody has bound the wing defender yet.',
          hr: 'Može nakon pravog veza i poziva; ovdje nitko još nije vezao krilnog braniča.',
          de: 'Geht nach echter Bindung und Ruf; hier ist der Außenverteidiger noch nicht gebunden.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Cut diagonally toward the left back now looking for a quick hand-off',
          hr: 'Sada sijeci dijagonalno prema lijevom vanjskom tražeći brzu predaju',
          de: 'Jetzt diagonal zum linken Rückraum schneiden und eine schnelle Übergabe suchen',
        },
        feedback: {
          en: 'Risky — you shorten the left side before the defence is stretched.',
          hr: 'Rizično — sužavaš lijevu stranu prije nego je obrana rastegnuta.',
          de: 'Riskant — du verkürzt die linke Seite bevor die Abwehr gestreckt ist.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Come two steps closer to the left back and show for a short pass in front of him while the wing defender is still free',
          hr: 'Dođi dva koraka bliže lijevom vanjskom i traži kratku loptu ispred njega dok je krilni branič još slobodan',
          de: 'Zwei Schritte näher zum linken Rückraum gehen und den kurzen Pass vor ihm fordern während der Außenverteidiger noch frei ist',
        },
        feedback: {
          en: 'Poor — a young wing often does this, but you occupy his driving space and kill the wide option too early.',
          hr: 'Loše — mlado krilo to često radi, ali zauzimaš mu prostor za prodor i prerano gasiš široku opciju.',
          de: 'Schlecht — junge Flügel machen das oft, aber du nimmst ihm den Durchbruchsraum und löschst die breite Option zu früh.',
        },
      },
    ],
    explanation: {
      en: 'Before any bind, the left wing’s first job is width. Standing already inside shortens the side the left back wants to attack. A later step inside can be right after a clear bind and call — not now.',
      hr: 'Prije bilo kakvog veza prvi posao lijevog krila je širina. Ako već stojiš unutra, lijevi vanjski gubi prostor koji želi napasti. Kasniji korak unutra može biti dobar nakon jasnog veza i poziva — ne sada.',
      de: 'Vor jeder Bindung ist die erste Aufgabe Breite. Stehst du schon innen, verliert der linke Rückraum den Raum den er angreifen will. Ein späterer Schritt nach innen kann nach klarer Bindung und Ruf richtig sein — nicht jetzt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A restores width while the defence is still set; B needs a bind and call that have not happened.',
      hr: 'A vraća širinu dok je obrana još postavljena; B treba vez i poziv koji se još nisu dogodili.',
      de: 'A stellt Breite wieder her solange die Abwehr noch steht; B braucht Bindung und Ruf die noch fehlen.',
    },
    perception: false,
    handedness: 'none',
    skillTags: ['positioning', 'spacing', 'decisionMaking', 'family:lw_width_hold_true_width', 'pilot:lw_pilot_01'],
  },

  scn_bank_942: {
    title: {
      en: 'Left Wing — Under 5:1, Stay Wide and Ask Now While Left Back Is Pressured',
      hr: 'Lijevo krilo — u 5:1 ostani široko i traži loptu dok je lijevi vanjski pod pritiskom',
      de: 'Linksaußen — in der 5:1 breit bleiben und den Ball jetzt fordern während der linke Rückraum unter Druck ist',
    },
    situation: {
      en: 'You lead 10:9 at 19\' against 5:1. The advanced defender jumps high onto your left back as he receives at nine metres. Your wing defender’s hips and both feet still face the left back; he has not turned to the corner. The pass from the left back to you along the sideline is open. If you leave the corner to enter now, the left back loses his only safe pass under that pressure.',
      hr: 'Vodite 10:9 u 19. minuti protiv 5:1. Istureni branič skače visoko na tvog lijevog vanjskog čim primi na devet metara. Bokovi i obje noge tvog krilnog braniča još gledaju lijevog vanjskog; nije se okrenuo prema kutu. Pas od lijevog vanjskog do tebe uz aut-liniju je otvoren. Ako sada napustiš kut i uđeš, lijevi vanjski gubi jedinu sigurnu loptu pod tim pritiskom.',
      de: 'Ihr führt 10:9 in Minute 19 gegen 5:1. Der vorgeschobene Verteidiger springt hoch auf deinen linken Rückraum sobald er auf neun Metern fängt. Hüfte und beide Füße deines Außenverteidigers zeigen noch zum linken Rückraum; er ist nicht zur Ecke gedreht. Der Pass vom Rückraum zu dir an der Seitenlinie ist offen. Verlässt du jetzt die Ecke und läufst ein, verliert der Rückraum unter diesem Druck seinen einzigen sicheren Pass.',
    },
    question: {
      en: 'How do you help the left back under the advanced defender?',
      hr: 'Kako pomažeš lijevom vanjskom pod isturenim braničem?',
      de: 'Wie hilfst du dem linken Rückraum unter dem vorgeschobenen Verteidiger?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay wide in the corner and ask for the ball now — while the wing defender still faces the left back, the pass can arrive clean',
          hr: 'Ostani široko u kutu i traži loptu sada — dok krilni branič još gleda lijevog vanjskog, pas može stići čisto',
          de: 'Breit in der Ecke bleiben und den Ball jetzt fordern — solange der Außenverteidiger noch zum Rückraum schaut, kommt der Pass sauber an',
        },
        feedback: {
          en: 'Correct — under 5:1 the wide pass is the first help; hips still on the left back mean that pass is available now.',
          hr: 'Točno — u 5:1 široki pas je prva pomoć; bokovi još na lijevom vanjskom znače da je taj pas sada tu.',
          de: 'Richtig — in der 5:1 ist der breite Pass die erste Hilfe; Hüften noch am Rückraum heißen: dieser Pass ist jetzt da.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Show for a return pass only if the left back has already beaten the advanced defender and turns toward you with a free arm',
          hr: 'Pokaži se za povratnu loptu samo ako je lijevi vanjski već prošao isturenog braniča i okreće se prema tebi sa slobodnom rukom',
          de: 'Nur für den Rückpass zeigen wenn der linke Rückraum den Vorgeschobenen schon geschlagen hat und sich mit freiem Arm zu dir dreht',
        },
        feedback: {
          en: 'Useful after the beat; here he is still under the first jump and needs the ball wide now.',
          hr: 'Korisno nakon prolaska; ovdje je još pod prvim skokom i treba loptu široko sada.',
          de: 'Nützlich nach dem Durchbruch; hier ist er noch unter dem ersten Sprung und braucht den Ball jetzt breit.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Start an entry behind the wing defender to open a cut while the left back is still pressured',
          hr: 'Kreći ulazak iza krilnog braniča da otvoriš rez dok je lijevi vanjski još pod pritiskom',
          de: 'Hinter dem Außenverteidiger einlaufen um einen Schnitt zu öffnen während der Rückraum noch unter Druck ist',
        },
        feedback: {
          en: 'Risky — you take away the pass he needs under 5:1 pressure.',
          hr: 'Rizično — skidaš mu pas koji mu treba pod pritiskom 5:1.',
          de: 'Riskant — du nimmst ihm den Pass weg den er unter 5:1-Druck braucht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drift into the half space and wait for a high ball from the centre back',
          hr: 'Odlutaj prema polubranitelju i čekaj visoku loptu od srednjeg vanjskog',
          de: 'Zum Halben treiben und auf einen hohen Ball vom Rückraum Mitte warten',
        },
        feedback: {
          en: 'Poor — you leave the left back who is under pressure right now.',
          hr: 'Loše — ostavljaš lijevog vanjskog koji je upravo pod pritiskom.',
          de: 'Schlecht — du lässt den linken Rückraum allein der gerade unter Druck steht.',
        },
      },
    ],
    explanation: {
      en: 'Cue: 5:1 pressure on the left back, wing-defender hips still on him, sideline pass open. Help him with width and an immediate ask. Entering now steals his only safe pass.',
      hr: 'Čitaj: pritisak 5:1 na lijevog vanjskog, bokovi krilnog braniča još na njemu, pas uz aut otvoren. Pomozi mu širinom i odmah traži loptu. Ulazak sada mu krade jedinu sigurnu loptu.',
      de: 'Lesen: 5:1-Druck auf den linken Rückraum, Hüften des Außenverteidigers noch auf ihm, Pass an der Seitenlinie offen. Hilf mit Breite und fordere den Ball sofort. Einlaufen jetzt raubt ihm den einzigen sicheren Pass.',
    },
    whyCorrectOverSecondBest: {
      en: 'A solves the live pressure with the open wide pass; B waits for a beat that has not happened yet.',
      hr: 'A rješava pritisak otvorenim širokim pasom; B čeka prolazak koji se još nije dogodio.',
      de: 'A löst den Druck mit dem offenen breiten Pass; B wartet auf einen Durchbruch der noch fehlt.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_943: {
    title: {
      en: 'Left Wing — Read the Wing Defender’s Feet Before Your First Move',
      hr: 'Lijevo krilo — pročitaj noge krilnog braniča prije prvog pokreta',
      de: 'Linksaußen — Füße des Außenverteidigers lesen bevor du die erste Bewegung machst',
    },
    situation: {
      en: 'Tied 13:13 at 24\' against 6:0. The ball is still on the far wing. You are wide on the left. Your wing defender’s feet already point inside toward the half, and his chest is opening toward the ball — he is preparing to help, not square to you. The left back is just arriving into the left nine-metre area. If you start a deep entry now, you run into traffic before the left back can use you.',
      hr: 'Neriješeno je 13:13 u 24. minuti protiv 6:0. Lopta je još na drugom krilu. Ti si široko lijevo. Noge tvog krilnog braniča već pokazuju unutra prema polubranitelju, a prsa se otvaraju prema lopti — sprema se pomagati, nije okrenut na tebe. Lijevi vanjski tek stiže na lijevu stranu na devet metara. Ako sada kreneš duboki ulazak, ulaziš u gužvu prije nego te lijevi vanjski može iskoristiti.',
      de: 'Unentschieden 13:13 in Minute 24 gegen 6:0. Der Ball ist noch auf dem anderen Flügel. Du stehst breit links. Die Füße deines Außenverteidigers zeigen schon nach innen zum Halben, die Brust öffnet sich zum Ball — er bereitet Hilfe vor und steht nicht zu dir. Der linke Rückraum kommt gerade auf die linke Neun-Meter-Seite. Startest du jetzt ein tiefes Einlaufen, läufst du in den Verkehr bevor der Rückraum dich nutzen kann.',
    },
    question: {
      en: 'What do his feet and chest tell you to do first?',
      hr: 'Što ti njegove noge i prsa govore da napraviš prvo?',
      de: 'Was sagen dir seine Füße und Brust als ersten Schritt?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Hold and stretch your width — keep him outside so the left back still has space on the left when the ball arrives',
          hr: 'Drži i rastegni širinu — drži ga vani da lijevi vanjski i dalje ima prostor lijevo kad lopta stigne',
          de: 'Breite halten und strecken — ihn außen halten damit der linke Rückraum links noch Raum hat wenn der Ball kommt',
        },
        feedback: {
          en: 'Correct — feet inside mean help is coming; keep the left side long instead of disappearing into it.',
          hr: 'Točno — noge unutra znače da ide pomoći; drži lijevu stranu otvorenom umjesto da nestaneš u njoj.',
          de: 'Richtig — Füße innen heißen er geht zur Hilfe; halte die linke Seite offen statt darin zu verschwinden.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Start the cut behind him only after the ball has reached the left back and the wing defender fully turns his head to the ball',
          hr: 'Kreći rez iza leđa tek kad lopta stigne lijevom vanjskom i krilni branič potpuno okrene glavu prema lopti',
          de: 'Den Schnitt hinter ihm erst starten wenn der Ball den linken Rückraum erreicht und der Außenverteidiger den Kopf voll zum Ball dreht',
        },
        feedback: {
          en: 'Good timing later; right now the ball is still far and the cut would be early.',
          hr: 'Dobar tajming kasnije; sada je lopta još daleko i rez bi bio ran.',
          de: 'Später gutes Timing; jetzt ist der Ball noch weit und der Schnitt wäre früh.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Sprint into a deep entry immediately because his feet already point inside',
          hr: 'Odmah sprintaj u duboki ulazak jer noge već pokazuju unutra',
          de: 'Sofort tief einlaufen weil die Füße schon nach innen zeigen',
        },
        feedback: {
          en: 'Risky — you read the help start but run into the crowded area before the left back can play.',
          hr: 'Rizično — vidiš da kreće pomoći, ali ulaziš u gužvu prije nego lijevi vanjski može igrati.',
          de: 'Riskant — du siehst den Hilfebeginn läufst aber in die Enge bevor der Rückraum spielen kann.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Come up to the left back for a hand-off while the ball is still on the far wing',
          hr: 'Dođi do lijevog vanjskog na predaju dok je lopta još na drugom krilu',
          de: 'Zum linken Rückraum zur Übergabe kommen während der Ball noch auf dem anderen Flügel ist',
        },
        feedback: {
          en: 'Poor — you leave width with no ball on your side yet.',
          hr: 'Loše — napuštaš širinu a lopta još nije na tvojoj strani.',
          de: 'Schlecht — du verlässt die Breite obwohl der Ball noch nicht auf deiner Seite ist.',
        },
      },
    ],
    explanation: {
      en: 'Cue: wing-defender feet inside and chest opening to the far ball before your left back receives. He is preparing to help. First move: hold and stretch width. The cut behind comes only after the ball and the head turn.',
      hr: 'Čitaj: noge krilnog braniča unutra i prsa otvorena prema lopti na drugom krilu prije nego lijevi vanjski primi. Sprema se pomagati. Prvi pokret: drži i rastegni širinu. Rez iza leđa dolazi tek nakon lopte i okretanja glave.',
      de: 'Lesen: Füße des Außenverteidigers innen und Brust zum Ball auf dem anderen Flügel offen bevor der linke Rückraum fängt. Er bereitet Hilfe vor. Erste Bewegung: Breite halten und strecken. Der Schnitt hinter ihm erst nach Ball und Kopfdrehung.',
    },
    whyCorrectOverSecondBest: {
      en: 'A matches the current cue (help preparation, ball still far); B is the later action after the ball reaches the left back.',
      hr: 'A odgovara sadašnjem čitanju (sprema pomoć, lopta još daleko); B je kasnija akcija kad lopta stigne lijevom vanjskom.',
      de: 'A passt zur aktuellen Lese (Hilfevorbereitung, Ball noch weit); B ist die spätere Aktion nach Ballankunft beim Rückraum.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_944: {
    title: {
      en: 'Left Wing — 3:2:1: Use the Take-Off When the Half Steps Out',
      hr: 'Lijevo krilo — 3:2:1: iskoristi odraz kad polubranitelj iskorači',
      de: 'Linksaußen — 3:2:1: Absprung nutzen wenn der Halbe heraustritt',
    },
    situation: {
      en: 'Tied 14:14 at 27\' against 3:2:1. Your left back attacks between the half defender and the wing defender. The half steps out onto him. The wing defender is pulled one full step toward that gap and has not recovered to the corner. You receive wide on the left with room to jump toward the middle of the six. The goalkeeper is still centred and has not moved a foot toward either post.',
      hr: 'Neriješeno je 14:14 u 27. minuti protiv 3:2:1. Tvoj lijevi vanjski napada između polubranitelja i krilnog braniča. Polubranitelj iskorači na njega. Krilni branič je povučen cijeli korak prema tom prostoru i nije se vratio u kut. Primaš široko lijevo i imaš mjesta za skok prema sredini šestice. Vratar je još u sredini i nije pomaknuo nogu prema nijednoj stativi.',
      de: 'Unentschieden 14:14 in Minute 27 gegen 3:2:1. Dein linker Rückraum greift zwischen Halbem und Außenverteidiger an. Der Halbe tritt auf ihn heraus. Der Außenverteidiger ist einen vollen Schritt zu diesem Raum gezogen und nicht in die Ecke zurück. Du fängst breit links und hast Platz zum Absprung zur Mitte der Sechs. Der Torhüter steht noch mittig und hat keinen Fuß zu einem Pfosten gesetzt.',
    },
    question: {
      en: 'The half has stepped out and the wing defender is still pulled inside — what is your first action?',
      hr: 'Polubranitelj je iskoračio, a krilni branič je još unutra — što je tvoja prva akcija?',
      de: 'Der Halbe ist herausgetreten und der Außenverteidiger ist noch innen — was ist deine erste Aktion?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Jump toward the middle now while he is still pulled inside — then finish from the goalkeeper’s next movement',
          hr: 'Skoči prema sredini sada dok je još unutra — zatim završi prema sljedećem pokretu vratara',
          de: 'Jetzt zur Mitte abspringen solange er noch innen ist — dann nach der nächsten Torhüterbewegung abschließen',
        },
        feedback: {
          en: 'Correct — use the temporary take-off before he recovers; the finish waits for the goalkeeper’s next move.',
          hr: 'Točno — iskoristi odraz dok se nije vratio; završnicu čekaš prema sljedećem pokretu vratara.',
          de: 'Richtig — Absprung nutzen bevor er zurückkommt; den Abschluss nach der nächsten Torhüterbewegung wählen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Soft pass to the pivot only if the wing defender recovers onto your jump line before you leave the ground',
          hr: 'Dodaj pivotu samo ako se krilni branič vrati na tvoj skok prije nego odeš u zrak',
          de: 'Weich auf den Kreisläufer nur wenn der Außenverteidiger vor dem Absprung auf deine Sprunglinie zurückkommt',
        },
        feedback: {
          en: 'Right if he closes your jump; here the lane is still free.',
          hr: 'Ispravno ako ti zatvori skok; ovdje je prostor još slobodan.',
          de: 'Richtig wenn er deinen Absprung schließt; hier ist der Raum noch frei.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Shoot standing from the extreme corner without using the jump toward the middle',
          hr: 'Šutiraj iz mjesta iz ekstremnog kuta bez skoka prema sredini',
          de: 'Vom Stand aus der extremen Ecke werfen ohne Absprung zur Mitte',
        },
        feedback: {
          en: 'Risky — you ignore the space the half step-out just created.',
          hr: 'Rizično — zanemaruješ prostor koji je iskoračenje polubranitelja upravo otvorilo.',
          de: 'Riskant — du ignorierst den Raum den der Halb-Austritt gerade öffnete.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Pass back to the left back into the half defender who has already stepped onto him',
          hr: 'Vrati loptu lijevom vanjskom u polubranitelja koji je već iskoračio na njega',
          de: 'Zurück auf den linken Rückraum in den Halben der schon auf ihn herausgetreten ist',
        },
        feedback: {
          en: 'Poor — you give the ball back into the pressure that created your chance.',
          hr: 'Loše — vraćaš loptu u pritisak koji ti je stvorio šansu.',
          de: 'Schlecht — du spielst den Ball zurück in den Druck der deine Chance erzeugte.',
        },
      },
    ],
    explanation: {
      en: 'In 3:2:1 the half step-out pulls the wing defender inside and opens a temporary jump toward the middle. First action is take off now. The goalkeeper is centred with no foot commit — choose the finish after his next movement, not from a fixed post rule. Pivot only if the jump closes.',
      hr: 'U 3:2:1 iskoračenje polubranitelja povuče krilnog braniča unutra i otvara privremeni skok prema sredini. Prva akcija je odraz sada. Vratar je u sredini bez pokreta noge — završnicu biraš nakon njegovog sljedećeg pokreta, ne po fiksnom pravilu stative. Pivot samo ako ti zatvore skok.',
      de: 'In der 3:2:1 zieht der Halb-Austritt den Außenverteidiger nach innen und öffnet einen kurzen Absprung zur Mitte. Erste Aktion: jetzt abspringen. Torhüter mittig ohne Fußbewegung — Abschluss nach seiner nächsten Bewegung nicht nach Pfostenregel. Kreisläufer nur wenn der Absprung schließt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses the open take-off while the wing defender is still inside; B waits for a recovery that has not reached your jump yet.',
      hr: 'A koristi otvoren odraz dok je krilni branič još unutra; B čeka povratak koji još nije stigao na tvoj skok.',
      de: 'A nutzt den offenen Absprung solange der Außenverteidiger noch innen ist; B wartet auf eine Rückkehr die deinen Absprung noch nicht erreicht.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_945: {
    // KEEP concept — light HR polish only
    title: {
      en: 'Left Wing — Do Not Enter While Left Back Still Needs the Wide Option',
      hr: 'Lijevo krilo — ne ulazi dok lijevi vanjski još treba široku opciju',
      de: 'Linksaußen — nicht einlaufen solange der linke Rückraum die breite Option noch braucht',
    },
    situation: {
      en: 'You lead 16:15 at 31\' against 6:0. The left back is driving between half and wing. Your wing defender takes one help step inside toward that drive — and the space behind him toward the six looks empty. At the same time your pivot is already sealed on the left half of the six, and the left back still has a clear driving lane if you stay wide as the outlet. An entry now would put three attackers into the same short space and erase the wide pass the drive needs.',
      hr: 'Vodite 16:15 u 31. minuti protiv 6:0. Lijevi vanjski vuče između polubranitelja i krila. Tvoj krilni branič ide jedan korak pomoći unutra prema tom prodoru — i prostor iza njega prema šestici izgleda prazan. Istodobno je tvoj pivot već zatvoren na lijevoj polovici šestice, a lijevi vanjski i dalje ima čist prodor ako ti ostaneš široko za loptu. Ulazak sada bi gurnuo trojicu napadača u isti mali prostor i obrisao široki pas koji prodor treba.',
      de: 'Ihr führt 16:15 in Minute 31 gegen 6:0. Der linke Rückraum zieht zwischen Halbem und Außen. Dein Außenverteidiger macht einen Hilfeschritt nach innen zu diesem Durchbruch — und der Raum hinter ihm zur Sechs wirkt leer. Gleichzeitig ist dein Kreisläufer schon auf der linken Sechs-Hälfte abgedichtet und der Rückraum hat weiter einen klaren Durchbruch wenn du als Passoption breit bleibst. Einlaufen jetzt würde drei Angreifer in denselben engen Raum drücken und den breiten Pass löschen den der Durchbruch braucht.',
    },
    question: {
      en: 'Why is the empty space behind the helping wing defender the wrong invitation?',
      hr: 'Zašto prazan prostor iza krilnog braniča koji pomaže nije dobar ulazak?',
      de: 'Warum ist der leere Raum hinter dem helfenden Außenverteidiger die falsche Einladung?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay wide — the left back is still driving and needs the wide pass; entering now crowds the same half as the pivot',
          hr: 'Ostani široko — lijevi vanjski još vuče i treba široki pas; ulazak sada gužva istu polovicu s pivotom',
          de: 'Breit bleiben — der linke Rückraum zieht noch und braucht den breiten Pass; Einlaufen jetzt verdichtet dieselbe Hälfte mit dem Kreisläufer',
        },
        feedback: {
          en: 'Correct — the ‘open’ cut is a trap while the drive and pivot already occupy that half.',
          hr: 'Točno — ‘otvoreni’ ulazak je zamka dok prodor i pivot već zauzimaju tu polovicu.',
          de: 'Richtig — der ‘offene’ Schnitt ist eine Falle während Durchbruch und Kreisläufer die Hälfte schon belegen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Enter only after the left back has released the ball or clearly lost the drive and the pivot has cleared toward the middle',
          hr: 'Uđi tek kad lijevi vanjski pusti loptu ili jasno izgubi prodor i pivot se makne prema sredini',
          de: 'Einlaufen erst wenn der linke Rückraum den Ball abspielt oder den Durchbruch klar verliert und der Kreisläufer zur Mitte freimacht',
        },
        feedback: {
          en: 'Valid later when that space is no longer the left back’s lane; not while he is still driving.',
          hr: 'Može kasnije kad taj prostor više nije njegov prodor; ne dok još vuče.',
          de: 'Später möglich wenn der Raum nicht mehr seine Durchbruchbahn ist; nicht während er noch zieht.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Cut behind the helping wing defender immediately because the six looks empty',
          hr: 'Odmah sijeci iza krilnog braniča koji pomaže jer šestica izgleda prazna',
          de: 'Sofort hinter dem helfenden Außenverteidiger schneiden weil die Sechs leer wirkt',
        },
        feedback: {
          en: 'Risky — you steal the left back’s width and stack on the pivot.',
          hr: 'Rizično — kradeš širinu lijevom vanjskom i slažeš se na pivota.',
          de: 'Riskant — du raubst dem Rückraum die Breite und stapelst dich auf den Kreisläufer.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Come up to nine metres for a return hand-off in front of the half defender',
          hr: 'Dođi na devet metara na povratnu predaju ispred polubranitelja',
          de: 'Auf neun Meter zur Rück-Übergabe vor dem Halben kommen',
        },
        feedback: {
          en: 'Poor — you leave the corner without helping the drive or keeping width.',
          hr: 'Loše — napuštaš kut bez pomoći prodoru i bez širine.',
          de: 'Schlecht — du verlässt die Ecke ohne dem Durchbruch zu helfen und ohne Breite.',
        },
      },
    ],
    explanation: {
      en: 'Cue: a help step makes an entry look free, but the left back is still driving and the pivot already occupies that half. Keeping width keeps the attack alive. Enter only after the drive ends or the pivot clears.',
      hr: 'Čitaj: korak pomoći čini ulazak vizualno slobodnim, ali lijevi vanjski još vuče a pivot već drži tu polovicu. Širina drži napad živim. Ulazi tek kad prodor završi ili se pivot makne.',
      de: 'Lesen: der Hilfeschritt lässt Einlaufen frei wirken aber der Rückraum zieht noch und der Kreisläufer belegt die Hälfte schon. Breite hält den Angriff lebendig. Einlaufen erst wenn der Durchbruch endet oder der Kreisläufer freimacht.',
    },
    whyCorrectOverSecondBest: {
      en: 'A protects the live drive and avoids stacking on the pivot; B is the later entry after that picture changes.',
      hr: 'A štiti živi prodor i izbjegava slaganje na pivota; B je kasniji ulazak nakon što se situacija promijeni.',
      de: 'A schützt den lebenden Durchbruch und vermeidet das Stapeln auf den Kreisläufer; B ist das spätere Einlaufen nach dem Bildwechsel.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_946: {
    title: {
      en: 'Left Wing — Do Not Automatic-Lob a Stepping Goalkeeper When Left Back Is Free',
      hr: 'Lijevo krilo — ne lobaj automatski vratara koji iskorači kad je lijevi vanjski slobodan',
      de: 'Linksaußen — keinen automatischen Lob auf den heraustretenden Torhüter wenn der linke Rückraum frei ist',
    },
    situation: {
      en: 'Tied 18:18 at 38\' against 6:0. You catch on the left wing with a playable angle. The goalkeeper steps out early toward you with both hands still high in front of his shoulders. Your wing defender is a half-step late recovering to you, so a hard finish into the goalkeeper’s body is available but dirty. At the same moment the left back is clearly free one pass inside under that recovering wing defender, with his arms ready and the lane open. The full picture — goalkeeper, late defender, free teammate — makes the inside pass cleaner than forcing a lob into high hands.',
      hr: 'Neriješeno je 18:18 u 38. minuti protiv 6:0. Primaš na lijevom krilu s kutom koji se može igrati. Vratar rano iskorači prema tebi, a obje ruke mu još stoje visoko ispred ramena. Tvoj krilni branič kasni pola koraka u povratku na tebe, pa je žestoki šut u tijelo moguć ali prljav. U istom trenutku lijevi vanjski je jasno slobodan na jedan pas unutra ispod tog vraćajućeg krilnog braniča, s rukama spremnim i otvorenim putem. Cijela situacija — vratar, kasni branič, slobodan suigrač — čini pas unutra čišćim od forsiranja loba u visoke ruke.',
      de: 'Unentschieden 18:18 in Minute 38 gegen 6:0. Du fängst auf Linksaußen mit spielbarem Winkel. Der Torhüter tritt früh zu dir heraus, beide Hände noch hoch vor den Schultern. Dein Außenverteidiger kommt einen halben Schritt zu spät zu dir zurück, daher wäre ein harter Wurf in den Körper möglich aber unsauber. Im selben Moment ist der linke Rückraum klar frei einen Pass innen unter diesem zurückkehrenden Außenverteidiger, Arme bereit und Weg offen. Das ganze Bild — Torhüter, später Verteidiger, freier Mitspieler — macht den Innenpass sauberer als einen Lob in hohe Hände zu erzwingen.',
    },
    question: {
      en: 'With the goalkeeper out, hands high, and the left back free inside — what is the cleanest first decision?',
      hr: 'Vratar je vani, ruke visoko, a lijevi vanjski slobodan unutra — koja je najčišća prva odluka?',
      de: 'Torhüter draußen, Hände hoch, linker Rückraum innen frei — was ist die sauberste erste Entscheidung?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Play the short pass inside to the free left back — that is cleaner than lobbing into high hands',
          hr: 'Dodaj kratko unutra slobodnom lijevom vanjskom — to je čišće od loba u visoke ruke',
          de: 'Kurz nach innen auf den freien linken Rückraum — sauberer als ein Lob in hohe Hände',
        },
        feedback: {
          en: 'Correct — the free teammate plus the late wing defender decide this, not the step-out alone.',
          hr: 'Točno — odlučuju slobodan suigrač i kasni krilni branič, ne iskoračaj sam.',
          de: 'Richtig — freier Mitspieler und später Außenverteidiger entscheiden das nicht der Austritt allein.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Lob only if both hands clearly drop and the left back is covered before you release',
          hr: 'Lobaj samo ako obje ruke jasno padnu i lijevi vanjski bude pokriven prije ispusta',
          de: 'Nur lobben wenn beide Hände klar fallen und der linke Rückraum vor der Abgabe gedeckt ist',
        },
        feedback: {
          en: 'That becomes right if the inside option disappears and the hands drop; here the left back is free and hands are still high.',
          hr: 'To postaje dobro ako unutarnja opcija nestane i ruke padnu; ovdje je lijevi vanjski slobodan a ruke još visoko.',
          de: 'Das wird richtig wenn die Innenoption weg ist und die Hände fallen; hier ist der Rückraum frei und die Hände noch hoch.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a hard shot into the stepping goalkeeper’s body',
          hr: 'Forsiraj žestoki šut u tijelo iskoračenog vratara',
          de: 'Harten Wurf in den Körper des heraustretenden Torhüters erzwingen',
        },
        feedback: {
          en: 'Risky — you play into the body he just brought closer while a free teammate is available.',
          hr: 'Rizično — igraš u tijelo koje je upravo približio dok imaš slobodnog suigrača.',
          de: 'Riskant — du wirfst in den Körper den er gerade näher gebracht hat obwohl ein freier Mitspieler da ist.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Pull back beyond nine metres and restart the whole positional attack',
          hr: 'Povuci se iza devet metara i ispočetka pokreni cijeli pozicijski napad',
          de: 'Hinter die Neun zurückziehen und den ganzen Positionsangriff neu starten',
        },
        feedback: {
          en: 'Poor — you waste a live chance with a free teammate inside.',
          hr: 'Loše — bacaš živu šansu sa slobodnim suigračem unutra.',
          de: 'Schlecht — du verschenkst eine lebendige Chance mit freiem Mitspieler innen.',
        },
      },
    ],
    explanation: {
      en: 'Do not automatic-lob just because the goalkeeper steps out. Here hands stay high, the wing defender is late, and the left back is clearly free with an open lane — so the short inside pass is the cleanest first decision. If the left back were covered, you would still have to solve the finish from the goalkeeper.',
      hr: 'Ne lobaj automatski samo zato što vratar iskorači. Ovdje ruke ostaju visoko, krilni branič kasni, a lijevi vanjski je jasno slobodan s otvorenim putem — zato je kratki pas unutra najčišća prva odluka. Da lijevi vanjski nije slobodan, i dalje bi rješavao završnicu prema vrataru.',
      de: 'Nicht automatisch lobben nur weil der Torhüter heraustritt. Hier bleiben die Hände hoch, der Außenverteidiger kommt spät und der linke Rückraum ist klar frei mit offenem Weg — deshalb ist der kurze Innenpass die sauberste erste Entscheidung. Wäre der Rückraum nicht frei müsstest du den Abschluss weiter über den Torhüter lösen.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses the free left back in the stated picture; B is the lob only after hands drop and that teammate is gone.',
      hr: 'A koristi slobodnog lijevog vanjskog u ovoj situaciji; B je lob tek kad ruke padnu i taj suigrač nestane.',
      de: 'A nutzt den freien linken Rückraum im genannten Bild; B ist der Lob erst wenn Hände fallen und dieser Mitspieler weg ist.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_947: {
    title: {
      en: 'Left Wing — First Wave 3v2: Hold Left Width While Middle Is Covered',
      hr: 'Lijevo krilo — prvi val 3v2: drži širinu lijevo dok je sredina pokrivena',
      de: 'Linksaußen — erste Welle 3v2: links Breite halten während die Mitte gedeckt ist',
    },
    situation: {
      en: 'Tied 9:9 at 17\' after a steal. You are the left wing in a first-wave 3v2. The centre back carries the ball through the middle. Your right-side teammate runs the far lane. One recovering defender has already taken a line that closes the middle pass and the middle shot. The second defender is still deeper, closer to the far wing than to you. The left lane to the six is open if you stay wide.',
      hr: 'Neriješeno je 9:9 u 17. minuti nakon oduzimanja. Ti si lijevo krilo u prvom valu 3v2. Srednji vanjski vodi loptu kroz sredinu. Suigrač s desne strane trči drugo krilo. Jedan branič u povratku već je zauzeo liniju koja zatvara dodavanje i šut kroz sredinu. Drugi branič je još dublje, bliže drugom krilu nego tebi. Lijevo do šestice imaš prostor ako ostaneš široko.',
      de: 'Unentschieden 9:9 in Minute 17 nach einem Ballgewinn. Du bist Linksaußen in der ersten Welle 3v2. Der Rückraum Mitte führt den Ball durch die Mitte. Dein rechter Mitspieler läuft den anderen Flügel. Ein zurücklaufender Verteidiger hat schon eine Linie die Mittelpass und Mittelwurf schließt. Der zweite Verteidiger ist noch tiefer näher am anderen Flügel als an dir. Links zur Sechs hast du Raum wenn du breit bleibst.',
    },
    question: {
      en: 'Where must you run while the recovering defender covers the middle?',
      hr: 'Gdje moraš trčati dok branič u povratku pokriva sredinu?',
      de: 'Wohin musst du laufen während der zurücklaufende Verteidiger die Mitte deckt?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay wide on the left all the way to six metres as the open pass option',
          hr: 'Ostani široko lijevo sve do šest metara kao otvorena opcija za pas',
          de: 'Links breit bis auf sechs Meter bleiben als offene Passoption',
        },
        feedback: {
          en: 'Correct — the middle is covered; your value is the wide left option, not another body in the middle.',
          hr: 'Točno — sredina je pokrivena; tvoja vrijednost je široka lijeva opcija, ne još jedno tijelo u sredini.',
          de: 'Richtig — die Mitte ist gedeckt; dein Wert ist die breite linke Option nicht ein weiterer Körper in der Mitte.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Bend slightly inside only if the second defender leaves your lane to join the middle cover and the ball carrier looks specifically to you',
          hr: 'Blago se savij unutra samo ako drugi branič napusti tebe da pojača sredinu i nositelj lopte traži baš tebe',
          de: 'Leicht nach innen nur wenn der zweite Verteidiger dich verlässt um die Mitte zu verstärken und der Ballträger dich gezielt sucht',
        },
        feedback: {
          en: 'Conditional when your lane is vacated; here the second defender is still nearer the far wing.',
          hr: 'Može kad te ostave; ovdje je drugi branič još bliže drugom krilu.',
          de: 'Geht wenn deine Seite geleert wird; hier ist der zweite Verteidiger noch näher am anderen Flügel.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Cut into the middle early to help the ball carrier against the covering defender',
          hr: 'Rano sijeci u sredinu da pomogneš nositelju lopte protiv braniča koji pokriva',
          de: 'Früh in die Mitte schneiden um dem Ballträger gegen den deckenden Verteidiger zu helfen',
        },
        feedback: {
          en: 'Risky — you run into the covered lane and erase the 3v2 width.',
          hr: 'Rizično — ulaziš u pokrivenu sredinu i brišeš širinu 3v2.',
          de: 'Riskant — du läufst in die gedeckte Mitte und löschst die 3v2-Breite.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stop at the nine-metre line and wait for a set attack to rebuild',
          hr: 'Zaustavi se na liniji od devet metara i čekaj da se opet složi pozicijski napad',
          de: 'An der Neun-Meter-Linie stoppen und auf den Neuaufbau des Positionsangriffs warten',
        },
        feedback: {
          en: 'Poor — you resign a live first-wave advantage.',
          hr: 'Loše — odustaješ od žive prednosti prvog vala.',
          de: 'Schlecht — du gibst einen lebenden Vorteil der ersten Welle auf.',
        },
      },
    ],
    explanation: {
      en: 'Cue: recovering defender already closes middle. In a 3v2 the left wing’s job is to keep the left side open to six. Cutting middle is the wrong read of the numbers.',
      hr: 'Čitaj: branič u povratku već zatvara sredinu. U 3v2 posao lijevog krila je držati lijevu stranu otvorenom do šestice. Sijecanje u sredinu je krivo čitanje brojeva.',
      de: 'Lesen: zurücklaufender Verteidiger schließt die Mitte schon. Im 3v2 ist die Aufgabe des Linksaußen die linke Seite bis zur Sechs offen zu halten. In die Mitte schneiden ist die falsche Zahlenlese.',
    },
    whyCorrectOverSecondBest: {
      en: 'A keeps the open left option against a covered middle; B needs the second defender to leave you first.',
      hr: 'A čuva otvorenu lijevu opciju protiv pokrivene sredine; B prvo treba da te drugi branič napusti.',
      de: 'A hält die offene linke Option gegen gedeckte Mitte; B braucht zuerst dass der zweite Verteidiger dich verlässt.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_949: {
    title: {
      en: 'Left Wing — Defence in 6:0: Controlled Help Without Leaving the Wing Pass',
      hr: 'Lijevo krilo — obrana u 6:0: kontrolirana pomoć bez napuštanja pasa na krilo',
      de: 'Linksaußen — Abwehr in der 6:0: kontrollierte Hilfe ohne den Flügelpass zu verlassen',
    },
    situation: {
      en: 'Tied 8:8 at 15\' in your team’s 6:0. You defend the left-side wing. Agreed team rule for this match: the half defender takes the ball carrier; you protect the pass to the opposing wing on your side until there is a clear handover call. Their right back has the ball at nine metres and threatens a drive between you and your half defender. Their right wing is still wide near the sideline as a live pass threat. Your half has not called handover yet.',
      hr: 'Neriješeno je 8:8 u 15. minuti u vašoj 6:0. Braniš lijevo krilo. Dogovoreno pravilo ekipe za ovu utakmicu: polubranitelj preuzima nositelja lopte; ti čuvaš pas na protivničko krilo na svojoj strani dok nema jasnog poziva za preuzimanje. Njihov desni vanjski ima loptu na devet metara i prijeti prodorom između tebe i tvog polubranitelja. Njihovo desno krilo još je široko uz aut-liniju kao živa prijetnja pasom. Tvoj polubranitelj još nije javio preuzimanje.',
      de: 'Unentschieden 8:8 in Minute 15 in eurer 6:0. Du verteidigst Linksaußen. Vereinbarte Teamregel für dieses Spiel: der Halbe übernimmt den Ballträger; du schützt den Pass auf den gegnerischen Flügel auf deiner Seite bis es einen klaren Übergabe-Ruf gibt. Ihr rechter Rückraum hat den Ball auf neun Metern und droht mit Durchbruch zwischen dir und deinem Halben. Ihr Rechtsaußen steht noch breit an der Seitenlinie als lebendige Passgefahr. Dein Halber hat die Übergabe noch nicht gerufen.',
    },
    question: {
      en: 'How do you help inside without breaking the agreed wing responsibility?',
      hr: 'Kako pomažeš unutra bez kršenja dogovorene odgovornosti na krilu?',
      de: 'Wie hilfst du nach innen ohne die vereinbarte Flügelverantwortung zu brechen?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Give a controlled half-step inside with your chest still on the pass to their right wing — wait for the half’s handover call before you leave',
          hr: 'Daj kontrolirani pola koraka unutra, a prsima i dalje zatvaraj pas na njihovo desno krilo — čekaj poziv polubranitelja prije nego odeš',
          de: 'Kontrollierten Halbschritt nach innen, Brust weiter auf dem Pass zu ihrem Rechtsaußen — auf den Ruf des Halben warten bevor du gehst',
        },
        feedback: {
          en: 'Correct — help is a short step, not a full leave, until handover is called.',
          hr: 'Točno — pomoć je kratki korak, ne potpuni odlazak, dok preuzimanje nije javljeno.',
          de: 'Richtig — Hilfe ist ein kurzer Schritt kein volles Verlassen bis die Übergabe gerufen ist.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Fully jump to their right back only after the half clearly calls handover and steps onto the wing pass',
          hr: 'Potpuno skoči na njihovog desnog vanjskog tek kad polubranitelj jasno javi preuzimanje i stane na pas prema krilu',
          de: 'Voll auf ihren rechten Rückraum erst wenn der Halbe klar Übergabe ruft und auf den Flügelpass tritt',
        },
        feedback: {
          en: 'Right after a real handover; that call has not come yet.',
          hr: 'Ispravno nakon pravog preuzimanja; taj poziv još nije stigao.',
          de: 'Richtig nach echter Übergabe; der Ruf fehlt noch.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Fully leave the wing now to double their right back because the drive looks dangerous',
          hr: 'Sada potpuno napusti krilo da udvojiš njihovog desnog vanjskog jer prodor izgleda opasno',
          de: 'Den Flügel jetzt voll verlassen um ihren rechten Rückraum zu doppeln weil der Durchbruch gefährlich wirkt',
        },
        feedback: {
          en: 'Risky — their right wing is still live and no handover was called.',
          hr: 'Rizično — njihovo desno krilo još je živo a preuzimanje nije javljeno.',
          de: 'Riskant — ihr Rechtsaußen lebt noch und keine Übergabe wurde gerufen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stay glued to the sideline with no help step while their right back attacks your half',
          hr: 'Ostani zalijepljen za aut-liniju bez koraka pomoći dok njihov desni vanjski napada tvog polubranitelja',
          de: 'An der Seitenlinie kleben ohne Hilfeschritt während ihr rechter Rückraum deinen Halben angreift',
        },
        feedback: {
          en: 'Poor — zero help ignores the inside threat your half is facing.',
          hr: 'Loše — bez ikakve pomoći ostavljaš polubranitelja samog na prodoru.',
          de: 'Schlecht — ohne jede Hilfe lässt du den Halben allein gegen den Durchbruch.',
        },
      },
    ],
    explanation: {
      en: 'Geometry: left-wing defender faces opposing right back and right wing. Team rule stated: half takes the ball carrier; wing protects the wing pass until handover. Optimal help is a controlled half-step with chest still on that pass. Full abandon and zero help are both wrong.',
      hr: 'Geometrija: branič na lijevom krilu gleda protivničkog desnog vanjskog i desno krilo. Pravilo ekipe: polubranitelj preuzima nositelja; krilo čuva pas na krilo do preuzimanja. Optimalna pomoć je kontrolirani pola koraka s prsima još na tom pasu. Potpuni odlazak i nulta pomoć su oboje krivi.',
      de: 'Geometrie: Linksaußen-Verteidiger sieht gegnerischen rechten Rückraum und Rechtsaußen. Teamregel: Halber übernimmt den Ballträger; Flügel schützt den Flügelpass bis zur Übergabe. Optimale Hilfe ist ein kontrollierter Halbschritt mit Brust noch auf diesem Pass. Volles Verlassen und null Hilfe sind beides falsch.',
    },
    whyCorrectOverSecondBest: {
      en: 'A helps without leaving before the handover call; B is the full jump only after that call arrives.',
      hr: 'A pomaže bez odlaska prije poziva za preuzimanje; B je puni skok tek nakon što taj poziv stigne.',
      de: 'A hilft ohne vor dem Übergabe-Ruf zu gehen; B ist der volle Sprung erst nach diesem Ruf.',
    },
    perception: true,
    handedness: 'none',
  },

  scn_bank_950: {
    title: {
      en: 'Left Wing — Transition Defence in 3v2: Cut Your Own-Side Pass First',
      hr: 'Lijevo krilo — obrana u kontri 3v2: prvo zatvori pas na svojoj strani',
      de: 'Linksaußen — Umschaltverteidigung im 3v2: zuerst den Pass auf deiner Seite schließen',
    },
    situation: {
      en: 'Tied 21:21 at 44\' after your attack turns the ball over. The opponents break 3v2. The ball carrier is advancing middle-left. One opponent sprints the left sideline — your former wing side. Your nearest teammate is already sprinting across to cover the long pass to the far wing. Nobody is between the ball and the left-lane runner except you. If you chase the far wing yourself, the direct pass into your empty left lane is the higher immediate danger.',
      hr: 'Neriješeno je 21:21 u 44. minuti nakon što napad izgubi loptu. Protivnici kreću 3v2. Nositelj lopte ide sredina-lijevo. Jedan protivnik sprinta uz lijevu aut-liniju — tvoja bivša krilna strana. Najbliži suigrač već sprinta ukoso da zatvori dugački pas na drugo krilo. Između lopte i trkača lijevo nema nikoga osim tebe. Ako sam odeš na drugo krilo, direktan pas u tvoju praznu lijevu stranu veća je trenutačna opasnost.',
      de: 'Unentschieden 21:21 in Minute 44 nachdem euer Angriff den Ball verliert. Die Gegner starten 3v2. Der Ballträger kommt Mitte-links. Ein Gegner sprintet an der linken Seitenlinie — deine frühere Flügelseite. Dein nächster Mitspieler sprintet schon quer um den langen Pass auf den anderen Flügel zu schließen. Zwischen Ball und dem Läufer links ist außer dir niemand. Gehst du selbst auf den anderen Flügel ist der direkte Pass in deine leere linke Seite die größere Sofortgefahr.',
    },
    question: {
      en: 'Which danger is yours in the first sprint?',
      hr: 'Koja opasnost je tvoja u prvom sprintu?',
      de: 'Welche Gefahr gehört in den ersten Sprint zu dir?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Sprint to cut the pass into the left sideline — your teammate already covers the far wing',
          hr: 'Sprintaj zatvoriti pas uz lijevu aut-liniju — suigrač već pokriva drugo krilo',
          de: 'Sprinten um den Pass an der linken Seitenlinie zu schließen — dein Mitspieler deckt schon den anderen Flügel',
        },
        feedback: {
          en: 'Correct — with the far wing covered, your job is the open pass on your side.',
          hr: 'Točno — dok je drugo krilo pokriveno, tvoj je posao otvoreni pas na tvojoj strani.',
          de: 'Richtig — ist der andere Flügel gedeckt ist dein Job der offene Pass auf deiner Seite.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Switch to the far wing only if your teammate slips or stops and the ball carrier clearly looks far before releasing',
          hr: 'Prebaci se na drugo krilo samo ako suigrač posrne ili stane i nositelj lopte jasno gleda tamo prije ispusta',
          de: 'Nur auf den anderen Flügel wechseln wenn dein Mitspieler strauchelt oder stoppt und der Ballträger vor der Abgabe klar dorthin schaut',
        },
        feedback: {
          en: 'Valid if far cover collapses; here your teammate is already sprinting that job.',
          hr: 'Može ako pokriće na drugom krilu padne; ovdje suigrač već radi taj posao.',
          de: 'Geht wenn die weite Deckung kippt; hier macht dein Mitspieler diesen Job schon.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Chase the far wing yourself because long passes hurt more, even though a teammate is already there',
          hr: 'Sam juri drugo krilo jer dugački pasevi više bole, iako je suigrač već tamo',
          de: 'Den anderen Flügel selbst jagen weil lange Pässe mehr wehtun obwohl ein Mitspieler schon dort ist',
        },
        feedback: {
          en: 'Risky — you leave the direct left-side pass open.',
          hr: 'Rizično — ostavljaš otvoren direktan pas na lijevoj strani.',
          de: 'Riskant — du lässt den direkten Pass auf der linken Seite offen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stop and raise a hand to signal the mistake instead of sprinting a lane',
          hr: 'Stani i digni ruku da pokažeš grešku umjesto da sprintaš zatvoriti pas',
          de: 'Stehen bleiben und die Hand heben um den Fehler zu zeigen statt eine Bahn zu sprinten',
        },
        feedback: {
          en: 'Poor — a signal without a body on a pass does not stop the 3v2.',
          hr: 'Loše — gest bez tijela na pasu ne zaustavlja 3v2.',
          de: 'Schlecht — ein Zeichen ohne Körper am Pass stoppt das 3v2 nicht.',
        },
      },
    ],
    explanation: {
      en: 'Teammate map decides priority: far wing already covered, own-side left lane open, ball middle-left. Your first sprint cuts the nearer dangerous pass. Chasing the far wing duplicates covered work and opens a goal.',
      hr: 'Gdje su suigrači odlučuje prioritet: drugo krilo već pokriveno, lijeva strana otvorena, lopta sredina-lijevo. Prvi sprint zatvara bliži opasni pas. Ići na drugo krilo udvostručuje pokriven posao i otvara gol.',
      de: 'Mitspieler-Position entscheidet die Priorität: anderer Flügel schon gedeckt, eigene linke Seite offen, Ball Mitte-links. Erster Sprint schließt den näheren gefährlichen Pass. Auf den anderen Flügel gehen verdoppelt gedeckte Arbeit und öffnet ein Tor.',
    },
    whyCorrectOverSecondBest: {
      en: 'A matches the stated teammate map; B switches far only if that cover fails.',
      hr: 'A odgovara rasporedu suigrača; B ide na drugo krilo samo ako to pokriće padne.',
      de: 'A passt zur genannten Mitspieler-Verteilung; B wechselt weit nur wenn diese Deckung kippt.',
    },
    perception: true,
    handedness: 'none',
  },
};

// Fix accidental combining accent in 941 feedback
patches.scn_bank_941.answers[0].feedback.hr = patches.scn_bank_941.answers[0].feedback.hr.replace(
  'skráti',
  'skrati',
);

const changeLog = [];
const ID_TO_PILOT = {
  scn_bank_941: 0,
  scn_bank_942: 1,
  scn_bank_943: 2,
  scn_bank_944: 3,
  scn_bank_945: 4,
  scn_bank_946: 5,
  scn_bank_947: 6,
  scn_bank_948: 7,
  scn_bank_949: 8,
  scn_bank_950: 9,
};

for (const [id, patch] of Object.entries(patches)) {
  const idx = bank.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error(`Missing ${id}`);
  const s = bank[idx];
  const before = JSON.stringify(s);

  s.title = patch.title;
  s.situation = patch.situation;
  s.question = patch.question;
  s.answers = patch.answers;
  s.explanation = patch.explanation;
  s.whyCorrectOverSecondBest = patch.whyCorrectOverSecondBest;

  // rebuild skill tags preserving family/pilot/numerical markers
  const familyTag = (s.skillTags || []).find((t) => String(t).startsWith('family:'));
  const pilotTag = (s.skillTags || []).find((t) => String(t).startsWith('pilot:'));
  const numericalTag = (s.skillTags || []).find((t) => String(t).startsWith('numerical:'));
  const base = (patch.skillTags || s.skillTags || []).filter(
    (t) =>
      !String(t).startsWith('family:') &&
      !String(t).startsWith('pilot:') &&
      !String(t).startsWith('numerical:') &&
      t !== 'perception' &&
      !String(t).startsWith('handedness:'),
  );
  const tags = [...base];
  if (patch.perception) tags.push('perception');
  if (patch.handedness && patch.handedness !== 'none') tags.push(`handedness:${patch.handedness}`);
  if (numericalTag) tags.push(numericalTag);
  if (familyTag) tags.push(familyTag);
  if (pilotTag) tags.push(pilotTag);
  s.skillTags = [...new Set(tags)];

  bank[idx] = s;

  // sync pilot source JSON
  const pIdx = ID_TO_PILOT[id];
  const p = pilots[pIdx];
  Object.assign(p, {
    title: patch.title,
    situation: patch.situation,
    question: patch.question,
    answers: patch.answers,
    explanation: patch.explanation,
    whyCorrectOverSecondBest: patch.whyCorrectOverSecondBest,
    perception: patch.perception,
    handedness: patch.handedness || 'none',
  });
  if (patch.perception && !(p.skillTags || []).includes('perception')) {
    p.skillTags = [...(p.skillTags || []), 'perception'];
  }
  if (!patch.perception) {
    p.skillTags = (p.skillTags || []).filter((t) => t !== 'perception');
  }

  changeLog.push({
    id,
    familyKey: p.familyKey,
    changed: before !== JSON.stringify(s),
    perception: patch.perception,
    handedness: patch.handedness || 'none',
  });
}

// 948 unchanged — annotate pilot source
pilots[7].surgicalStatus = 'REPLACE_NEEDED';
pilots[7].duplicationNote =
  'Semantic duplicate of RW scn_bank_878 teaching decision: free wing + help >2m ⇒ finish now. Pivot-incomplete fork is not a distinct enough LW-native decision. Do not generate replacement in this pass.';

const afterLock = {
  LB: hashPos('Left Back'),
  RB: hashPos('Right Back'),
  CB: hashPos('Centre Back'),
  RW: hashPos('Right Wing'),
};
for (const k of ['LB', 'RB', 'CB', 'RW']) {
  if (afterLock[k] !== lockBefore[k]) throw new Error(`LOCKED HASH CHANGED: ${k}`);
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(pilotPath, JSON.stringify(pilots, null, 2) + '\n');

const report = {
  status: 'SURGICAL_PASS_APPLIED',
  changed: changeLog.filter((c) => c.changed).map((c) => c.id),
  unchanged: ['scn_bank_948'],
  replaceNeeded: [
    {
      id: 'scn_bank_948',
      verdict: 'REPLACE NEEDED',
      reason:
        'Teaching decision matches RW scn_bank_878: free wing, help still >2m from take-off, finish now. Side reversal + incomplete pivot seal is not a sufficient LW-native fork. Missing LW-specific concept e.g. 6v5 feed-vs-finish when pivot IS sealed on left half, or take-off covered while 6v5.',
    },
  ],
  geometry949: {
    verdict: 'CORRECTED',
    before: 'Wrong: left-wing defender vs opposing left back / left-side wing labels',
    after:
      'Left-wing defender faces opposing right back (ball) and opposing right wing (wide pass threat); half takes ball carrier; wing protects wing pass until handover — mirrors RW 880 orientation correctly mirrored for left side',
  },
  lockOk: true,
  lockHashes: afterLock,
};

writeFileSync(join(root, 'scripts/lw-pilot-surgical-pass-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
