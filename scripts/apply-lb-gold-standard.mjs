#!/usr/bin/env node
/**
 * Left Back gold-standard content pass — patches reviewed scenarios + adds 2 missing families.
 * Does NOT regenerate the full bank.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(path, 'utf8'));

function L(en, hr, de) {
  return { en, hr, de };
}

function answers(rows) {
  return rows.map(([quality, en, hr, de, fbEn, fbHr, fbDe]) => ({
    text: L(en, hr, de),
    quality,
    feedback: L(fbEn, fbHr, fbDe),
  }));
}

/** @type {Record<string, object>} */
const PATCHES = {
  scn_bank_156: {
    title: L(
      'Left Back — Basic Gap Between Defenders',
      'Lijevi vanjski — osnovni prostor između braniča',
      'Linker Rückraum — grundlegende Lücke zwischen Verteidigern',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'Low',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 28,
    score: '22–21',
    defensiveSystem: '6-0',
    situation: L(
      'You catch at nine metres against a set 6:0 at 28\'. You lead 22–21. Your defender is a half-step late. The gap between the left half and the centre defender is open for one stride. The left wing is covered.',
      'Primaš loptu na devet metara protiv postavljene obrane 6:0 u 28. minuti. Vodite 22–21. Tvoj branič kasni pola koraka. Između lijevog polubranitelja i srednjeg braniča otvoren je prostor za jedan korak. Lijevo krilo je pokriveno.',
      'Du bekommst den Ball auf neun Metern gegen eine stehende 6:0 in Minute 28. Ihr führt 22–21. Dein Verteidiger ist einen halben Schritt spät. Zwischen linkem Halbverteidiger und Mitte ist eine Schrittlücke offen. Der Linksaußen ist zugestellt.',
    ),
    question: L(
      'What do you attack first when that gap appears?',
      'Što prvo napadaš kad se taj prostor otvori?',
      'Was greifst du zuerst an, wenn diese Lücke entsteht?',
    ),
    answers: answers([
      [
        'optimal',
        'Drive or jump shot into the open gap before the late defender recovers',
        'Prodor ili skok-šut u otvoreni prostor prije nego što se zakašnjeli branič vrati',
        'Durchbruch oder Sprungwurf in die offene Lücke, bevor der späte Verteidiger zurück ist',
        'Correct — the late defender gives one clean window; take it before the 6:0 resets.',
        'Točno — zakašnjeli branič daje jedan čist prozor; iskoristi ga prije nego se 6:0 zatvori.',
        'Richtig — der späte Verteidiger schenkt ein Fenster; nutze es, bevor die 6:0 schließt.',
      ],
      [
        'good',
        'Hold at nine metres and wait for the left wing to become free',
        'Ostani na devet metara i čekaj da se lijevo krilo oslobodi',
        'Auf neun Metern halten und warten, bis der Linksaußen frei wird',
        'Good — patient, but the wing is already covered so the open value is the gap.',
        'Dobro — strpljivo, ali krilo je već pokriveno; otvorena vrijednost je prostor u sredini.',
        'Gut — geduldig, aber der Außen ist zugestellt; der Wert liegt in der Lücke.',
      ],
      [
        'risky',
        'Pass sideways to the centre back without threatening the gap',
        'Dodaj bočno na srednjeg vanjskog bez prijetnje u prostor',
        'Seitlich zum Rückraum Mitte passen, ohne die Lücke zu bedrohen',
        'Risky — an empty side pass lets the late defender recover into structure.',
        'Rizično — prazno bočno dodavanje daje zakašnjelom braniču vrijeme za povratak.',
        'Riskant — der leere Seitpass gibt dem späten Verteidiger Zeit zurückzukehren.',
      ],
      [
        'poor',
        'Force a long pass to the covered left wing under pressure',
        'Pod pritiskom forsiraj dugo dodavanje na pokriveno lijevo krilo',
        'Unter Druck den langen Pass auf den zugestellten Linksaußen erzwingen',
        'Poor — forcing the covered wing turns a created gap into a turnover risk.',
        'Loše — forsiranje pokrivenog krila pretvara stvoreni prostor u rizik gubitka lopte.',
        'Schlecht — der zugestellte Außen macht aus der geschaffenen Lücke ein Ballverlust-Risiko.',
      ],
    ]),
    explanation: L(
      'Your defender is late — that is the cue. Attack the gap with a drive or jump shot before he recovers. Waiting for a covered wing or an empty side pass gives the 6:0 time to close the space you already created.',
      'Tvoj branič kasni — to je signal. Napadni prostor prodorom ili skok-šutom prije nego se vrati. Čekanje pokrivenog krila ili prazno bočno dodavanje daje obrani 6:0 vrijeme da zatvori prostor koji si već stvorio.',
      'Dein Verteidiger ist spät — das ist das Signal. Greife die Lücke mit Durchbruch oder Sprungwurf an, bevor er zurück ist. Warten auf den zugestellten Außen oder leerer Seitpass gibt der 6:0 Zeit, den Raum zu schließen.',
    ),
    skillTags: ['defensiveReading', 'shotReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_158: {
    title: L(
      'Left Back — Block Line vs Sealed Pivot',
      'Lijevi vanjski — linija bloka protiv zatvorenog pivota',
      'Linker Rückraum — Blocklinie gegen abgedichteten Kreisläufer',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 51,
    score: '28–27',
    defensiveSystem: '6-0',
    situation: L(
      'You receive at nine metres against a compact 6:0 at 51\'. Score 28–27 for you. The pivot has already sealed the right defender and is asking for the ball behind him. Two defenders raise a block line into your shooting lane. The left wing is covered.',
      'Primaš na devet metara protiv zbijene obrane 6:0 u 51. minuti. Vodite 28–27. Pivot je već zatvorio desnog braniča i traži loptu iza njega. Dva braniča dižu liniju bloka u tvoju liniju šuta. Lijevo krilo je pokriveno.',
      'Du bekommst auf neun Metern gegen kompakte 6:0 in Minute 51. Ihr führt 28–27. Der Kreisläufer hat den rechten Verteidiger bereits abgedichtet und fordert den Ball hinter ihm. Zwei Verteidiger heben eine Blocklinie in deine Wurfbahn. Der Linksaußen ist zugestellt.',
    ),
    question: L(
      'What do you read first before you shoot or pass?',
      'Što prvo čitaš prije šuta ili dodavanja?',
      'Was liest du zuerst, bevor du wirfst oder passt?',
    ),
    answers: answers([
      [
        'optimal',
        'Fix the raised arms with a short drive fake, then feed the sealed pivot behind the block',
        'Fiksiraj podignute ruke kratkom fintom prodora, zatim odigraj na pivota iza bloka',
        'Die hochgestellten Arme mit kurzer Durchbruchfinte binden, dann zum abgedichteten Kreisläufer hinter dem Block spielen',
        'Correct — the seal is already won; the fake opens the feed lane behind the block.',
        'Točno — zatvaranje pivota je već dobiveno; finta otvara liniju dodavanja iza bloka.',
        'Richtig — die Abdichtung ist schon gewonnen; die Finte öffnet die Passspur hinter dem Block.',
      ],
      [
        'good',
        'If the top arm drops too deep on the fake, shoot the freed near corner',
        'Ako se gornja ruka na finti spusti preduboko, šutiraj u oslobođeni bliži kut',
        'Wenn der obere Arm bei der Finte zu tief fällt, den freigewordenen nahen Winkel werfen',
        'Good — valid only if the fake creates a clean corner; the pivot seal is the higher-value first read.',
        'Dobro — vrijedi samo ako finta stvori čist kut; zatvoreni pivot je prva, jača opcija.',
        'Gut — nur wenn die Finte eine klare Ecke öffnet; der Kreisläufer ist die stärkere Erste-Wahl.',
      ],
      [
        'risky',
        'Force a power jump shot straight through the raised block line',
        'Forsiraj snagu skok-šuta ravno kroz podignutu liniju bloka',
        'Einen harten Sprungwurf frontal durch die hochgestellte Blocklinie erzwingen',
        'Risky — shooting into a set block wall gives easy saves and second balls.',
        'Rizično — šut u postavljeni blok daje lake obrane i druge lopte.',
        'Riskant — Wurf in die stehende Blockwand bringt leichte Paraden und zweite Bälle.',
      ],
      [
        'poor',
        'Force the pass to the covered left wing under pressure',
        'Pod pritiskom forsiraj dodavanje na pokriveno lijevo krilo',
        'Unter Druck den Pass auf den zugestellten Linksaußen erzwingen',
        'Poor — the wing is covered; that pass turns control into a turnover.',
        'Loše — krilo je pokriveno; to dodavanje pretvara kontrolu u izgubljenu loptu.',
        'Schlecht — der Außen ist zugestellt; dieser Pass macht aus Kontrolle einen Ballverlust.',
      ],
    ]),
    explanation: L(
      'The cue is the already-sealed pivot plus a raised block in your shot lane. First fix the arms with a short fake, then feed the pivot behind the block. A corner shot is only second-best if the fake drops an arm. Power through the block or forcing the covered wing wastes the seal.',
      'Signal je već zatvoreni pivot i podignuti blok u liniji šuta. Prvo fiksiraj ruke kratkom fintom, zatim odigraj na pivota iza bloka. Šut u kut je druga opcija samo ako finta spusti ruku. Šut kroz blok ili forsiranje pokrivenog krila baca vrijednost zatvaranja.',
      'Das Signal ist der bereits abgedichtete Kreisläufer plus Block in der Wurfbahn. Zuerst Arme mit kurzer Finte binden, dann hinter den Block spielen. Der Eckenwurf ist nur zweite Wahl, wenn die Finte einen Arm senkt.',
    ),
    skillTags: ['shotReading', 'screening'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_162: {
    title: L(
      'Left Back — Open Side vs Aggressive 5:1',
      'Lijevi vanjski — otvorena strana protiv agresivne 5:1',
      'Linker Rückraum — offene Seite gegen aggressive 5:1',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 51,
    score: '22–21',
    defensiveSystem: '5-1',
    situation: L(
      'Hamburg play an aggressive 5:1 at 51\'. Score 22–21 for you. Their front defender has fully stepped out onto the centre back and is not recovering. You are free on the left at nine metres. The left wing holds width. Help from the left half is one full stride late.',
      'Hamburg igra agresivnu obranu 5:1 u 51. minuti. Vodite 22–21. Njihov prednji branič potpuno je izašao na srednjeg vanjskog i ne vraća se. Ti si slobodan lijevo na devet metara. Lijevo krilo drži širinu. Pomoć s lijevog polubranitelja kasni cijeli korak.',
      'Hamburg spielt aggressive 5:1 in Minute 51. Ihr führt 22–21. Der vordere Verteidiger ist voll auf den Rückraum Mitte herausgetreten und kommt nicht zurück. Du bist links auf neun Metern frei. Der Linksaußen hält Breite. Hilfe vom linken Halben ist einen ganzen Schritt spät.',
    ),
    question: L(
      'Where is the first advantage when the press commits?',
      'Gdje je prva prednost kad prednji branič izađe?',
      'Wo entsteht der erste Vorteil, wenn der Pressing-Spieler herauskommt?',
    ),
    answers: answers([
      [
        'optimal',
        'Receive early on the open side and attack the isolated 1v1 before help arrives',
        'Rano primi na otvorenoj strani i napadni izoliraniu igru 1 na 1 prije dolaska pomoći',
        'Früh auf der offenen Seite anspielen und das isolierte 1 gegen 1 angreifen, bevor Hilfe kommt',
        'Correct — ball speed to the free back punishes the centre commitment.',
        'Točno — brza lopta na slobodnog vanjskog kažnjava izlazak u sredinu.',
        'Richtig — Balltempo auf den freien Rückraum bestraft das Herausrücken in die Mitte.',
      ],
      [
        'good',
        'One more full swing to the right wing before you attack',
        'Još jedan puni transfer na desno krilo prije napada',
        'Noch einmal voll auf den Rechtsaußen schwingen, bevor du angreifst',
        'Good — can improve the angle, but often burns the temporary overload on your side.',
        'Dobro — može popraviti kut, ali često potroši privremeni višak na tvojoj strani.',
        'Gut — kann den Winkel verbessern, verbrennt aber oft die kurze Überzahl auf deiner Seite.',
      ],
      [
        'risky',
        'Hold the ball at nine metres and wait for the front man to drop back',
        'Drži loptu na devet metara i čekaj da se prednji branič vrati',
        'Den Ball auf neun Metern halten und warten, bis der Vordermann zurückfällt',
        'Risky — holding lets the 5:1 re-form and removes the open-side gift.',
        'Rizično — držanje daje 5:1 vrijeme da se ponovo zatvori i gubiš otvorenu stranu.',
        'Riskant — Halten lässt die 5:1 neu formieren und nimmt die offene Seite.',
      ],
      [
        'poor',
        'Shoot deep from behind the centre press without engaging the open side',
        'Šutiraj iz dubine iza središnjeg pritiska bez ulaska u otvorenu stranu',
        'Aus der Tiefe hinter dem Zentrumspress werfen, ohne die offene Seite zu nutzen',
        'Poor — a contested deep shot ignores the free 1v1 you already have.',
        'Loše — sporni duboki šut ignorira slobodnu igru 1 na 1 koju već imaš.',
        'Schlecht — der umkämpfte Weitwurf ignoriert das freie 1 gegen 1.',
      ],
    ]),
    explanation: L(
      'The front defender of the 5:1 has fully stepped onto the centre back. That opens your side for 1v1. Attack immediately before help slides across. Another full swing or holding the ball gives the defence time to close the space again.',
      'Prednji igrač obrane 5:1 potpuno je izašao na srednjeg vanjskog. Time se na tvojoj strani otvara prostor za igru jedan na jedan. Napadni odmah dok se obrana još nije pomaknula prema lopti. Ako zadržiš loptu ili je vratiš preko sredine, obrana dobiva vrijeme za ponovno zatvaranje prostora.',
      'Der vordere 5:1-Verteidiger ist voll auf den Rückraum Mitte heraus. Das öffnet deine Seite für 1 gegen 1. Greife sofort an, bevor Hilfe nachrückt. Ein weiterer Swing oder Halten gibt der Abwehr Zeit, den Raum wieder zu schließen.',
    ),
    skillTags: ['defensiveReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_363: {
    title: L(
      'Defence — 3:2:1 Close-Out Control',
      'Obrana — zatvaranje u 3:2:1',
      'Abwehr — Close-out in der 3:2:1',
    ),
    // preserve category/primaryPosition/secondaryPositions from bank
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 9,
    score: '22–21',
    defensiveSystem: '3-2-1',
    situation: L(
      'In a 3:2:1 at 9\', score 22–21 against you. The ball swings to the left back at nine metres. You are the recovering high defender. Inside help is still one stride late — if you arrive out of control, he has a clean shot or draws a suspension.',
      'U obrani 3:2:1 u 9. minuti gubite 21–22. Lopta ide na lijevog vanjskog na devet metara. Ti si visoki branič u povratku. Unutarnja pomoć još kasni cijeli korak — ako dođeš bez kontrole, ima čist šut ili iznuđuje isključenje.',
      'In der 3:2:1 in Minute 9 steht es 21–22 gegen euch. Der Ball geht zum linken Rückraum auf neun Metern. Du bist der hohe Verteidiger auf dem Rückweg. Innere Hilfe ist noch einen Schritt spät — kommst du unkontrolliert, hat er einen klaren Wurf oder erzwingt eine Zeitstrafe.',
    ),
    question: L(
      'How do you close out so the shot stays contested without fouling?',
      'Kako zatvaraš prostor da šut ostane sporni, a da ne napraviš prekršaj?',
      'Wie schließt du zu, damit der Wurf umkämpft bleibt, ohne zu foulen?',
    ),
    answers: answers([
      [
        'optimal',
        'Arrive on balance with hands high; force a contested release or a pass',
        'Dođi u ravnoteži, ruke gore; natjeraj ga na sporni šut ili dodavanje',
        'Ausbalanciert ankommen, Hände hoch; erzwinge umkämpften Wurf oder Pass',
        'Correct — balance plus high hands contests the shot without diving into a foul.',
        'Točno — ravnoteža i dignute ruke čine šut spornim bez letećeg prekršaja.',
        'Richtig — Balance und hohe Hände machen den Wurf schwer, ohne in ein Foul zu fliegen.',
      ],
      [
        'good',
        'Close under control and show the sideline, accepting a tougher angle shot',
        'Zatvori pod kontrolom i pokaži mu bočnu liniju, prihvati teži kut šuta',
        'Kontrolliert schließen und die Seitenlinie zeigen, einen schwierigeren Winkel akzeptieren',
        'Good — safe angle work, but without high hands the shot stays too clean.',
        'Dobro — siguran rad na kutu, ali bez dignutih ruku šut ostaje predobar.',
        'Gut — sichere Winkelarbeit, aber ohne hohe Hände bleibt die Abgabe zu sauber.',
      ],
      [
        'risky',
        'Sprint flat-out and jump at his shooting arm hoping to block',
        'Trči punom brzinom i skoči na ruku u šutu u nadi da blokiraš',
        'Voll sprinten und an den Wurfarm springen in der Hoffnung zu blocken',
        'Risky — flying close-outs create fouls or leave you flat for the next action.',
        'Rizično — leteće zatvaranje često znači prekršaj ili gubitak pozicije za sljedeću akciju.',
        'Riskant — fliegende Close-outs erzeugen Fouls oder lassen dich für die nächste Aktion stehen.',
      ],
      [
        'poor',
        'Stop short at eleven metres and give him a free nine-metre shot',
        'Stani kratko na jedanaest metara i pokloni mu slobodan šut s devet',
        'Auf elf Metern abbremsen und ihm den freien Neun-Meter-Wurf schenken',
        'Poor — conceding a free nine-metre shot breaks the 3:2:1 idea.',
        'Loše — pokloniti slobodan šut s devet metara ruši smisao 3:2:1.',
        'Schlecht — einen freien Neun-Meter zu schenken zerstört die 3:2:1-Idee.',
      ],
    ]),
    explanation: L(
      'Help is late — that is the cue. You must contest alone: arrive on balance, hands high, force a hard release or a pass. Jumping at the arm risks a suspension; stopping short gifts a clean shot. Funneling to help that has not arrived is not available yet.',
      'Pomoć kasni — to je signal. Moraš zatvoriti sam: dođi u ravnoteži, ruke gore, natjeraj težak šut ili dodavanje. Skok na ruku riskira isključenje; rano stajanje poklanja čist šut. Usmjeravanje prema pomoći koja još nije stigla nije opcija.',
      'Hilfe ist spät — das ist das Signal. Du musst allein zustellen: ausbalanciert, Hände hoch, schweren Wurf oder Pass erzwingen. Der Sprung an den Arm riskiert Zeitstrafe; frühes Stehenbleiben schenkt den klaren Wurf.',
    ),
    skillTags: ['defensiveReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_159: {
    title: L(
      'Left Back — Feeding the Sealed Pivot',
      'Lijevi vanjski — suradnja s pivotom nakon zatvaranja',
      'Linker Rückraum — Zusammenspiel mit abgedichtetem Kreisläufer',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 9,
    score: '22–21',
    situation: L(
      'At 9\', score 22–21 for you. The pivot seals the right defender at six metres and holds the seal. You have the ball at nine metres. Your own defender stands between you and the pivot with hands high in the passing lane.',
      'U 9. minuti vodite 22–21. Pivot zatvara desnog braniča na šest metara i drži kontakt. Ti imaš loptu na devet metara. Tvoj branič stoji između tebe i pivota s rukama gore u liniji dodavanja.',
      'In Minute 9 führt ihr 22–21. Der Kreisläufer dichtet den rechten Verteidiger auf sechs Metern ab und hält den Kontakt. Du hast den Ball auf neun Metern. Dein Verteidiger steht zwischen dir und dem Kreisläufer mit hohen Händen in der Passspur.',
    ),
    question: L(
      'How do you open the passing lane into the seal?',
      'Kako otvaraš liniju dodavanja prema pivotu?',
      'Wie öffnest du die Passspur zum Kreisläufer?',
    ),
    answers: answers([
      [
        'optimal',
        'Short drive fake to move the high hands, then pass into the space the pivot owns',
        'Kratka finta prodora da pomakneš digne ruke, zatim dodaj u prostor koji pivot drži',
        'Kurze Durchbruchfinte, um die hohen Hände zu bewegen, dann in den Raum des Kreisläufers passen',
        'Correct — the fake shifts the defender and opens the feed behind the seal.',
        'Točno — finta pomiče braniča i otvara dodavanje iza zatvaranja.',
        'Richtig — die Finte verschiebt den Verteidiger und öffnet den Pass hinter der Abdichtung.',
      ],
      [
        'good',
        'Jump shot if the defender drops too deep on the fake and leaves a clean lane',
        'Skok-šut ako branič na finti padne preduboko i ostavi čist prostor',
        'Sprungwurf, wenn der Verteidiger bei der Finte zu tief fällt und eine klare Bahn lässt',
        'Good — valid when the fake opens a shot; the sealed pivot remains the first priority.',
        'Dobro — vrijedi kad finta otvori šut; zatvoreni pivot i dalje je prvi prioritet.',
        'Gut — gültig, wenn die Finte den Wurf öffnet; der Kreisläufer bleibt erste Priorität.',
      ],
      [
        'risky',
        'Straight-line pass through the defender’s raised hands',
        'Dodavanje ravnom linijom kroz podignute ruke braniča',
        'Pass in gerader Linie durch die hochgestellten Hände',
        'Risky — alert half-backs cut those direct feeds easily.',
        'Rizično — budni polubranitelji takva izravna dodavanja lako presijecaju.',
        'Riskant — aufmerksame Halbe schneiden solche Direktpässe leicht ab.',
      ],
      [
        'poor',
        'Wave the pivot outside nine metres to receive facing up',
        'Pozovi pivota van na devet metara da primi okrenut prema tebi',
        'Den Kreisläufer vor die Neun-Meter-Linie herauswinken',
        'Poor — pivots create value inside; pulling them out kills the seal.',
        'Loše — pivot stvara vrijednost unutra; izvlačenje van ubija zatvaranje.',
        'Schlecht — Kreisläufer wirken innen; Herausziehen zerstört die Abdichtung.',
      ],
    ]),
    explanation: L(
      'High hands in the lane are the cue. A short drive fake moves that defender, then the pass hits the space the pivot already sealed. A direct pass through the hands is intercepted. Pulling the pivot out wastes the seal.',
      'Digne ruke u liniji dodavanja su signal. Kratka finta prodora pomiče braniča, zatim dodavanje ide u prostor koji je pivot već zatvorio. Izravno dodavanje kroz ruke se presiječe. Izvlačenje pivota van baca zatvaranje.',
      'Hohe Hände in der Passspur sind das Signal. Kurze Durchbruchfinte bewegt den Verteidiger, dann trifft der Pass den bereits abgedichteten Raum. Der Direktpass durch die Hände wird abgefangen.',
    ),
    skillTags: ['screening'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_164: {
    title: L(
      'Left Back — First Recoverer on the Break',
      'Lijevi vanjski — prvi u povratku u obranu',
      'Linker Rückraum — erster Rückläufer im Gegenstoß',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 9,
    score: '28–27',
    situation: L(
      'Zagreb win the ball and counter at 9\'. You trail 27–28. You are the first back recovering. Their ball carrier attacks straight at you at speed. Your teammate already covers the far wing — the skip lane is closed. If you dive or stop, he finishes alone.',
      'Zagreb osvaja loptu i ide u kontranapad u 9. minuti. Gubite 27–28. Ti si prvi u povratku u obranu. Njihov napadač s loptom ide ravno na tebe velikom brzinom. Tvoj suigrač već pokriva daleko krilo — linija dugog dodavanja je zatvorena. Ako skočiš u prekršaj ili staneš, on ide sam na vratara.',
      'Zagreb erobert den Ball und kontert in Minute 9. Ihr liegt 27–28 zurück. Du bist der erste Rückläufer. Ihr Ballführer kommt frontal mit Tempo auf dich. Dein Mitspieler deckt bereits den entfernten Außen — die lange Passspur ist zu. Wenn du springst oder stehen bleibst, geht er allein auf den Torwart.',
    ),
    question: L(
      'How do you delay without gifting a clean break?',
      'Kako usporavaš napad bez da pokloniš čist kontranapad?',
      'Wie verzögerst du, ohne einen sauberen Gegenstoß zu schenken?',
    ),
    answers: answers([
      [
        'optimal',
        'Angle your run to push the carrier wide and delay without fouling',
        'Kosom putanjom gurni vodiča lopte u širinu i uspori ga bez prekršaja',
        'Laufweg schräg ansetzen, den Ballführer nach außen drücken und ohne Foul verzögern',
        'Correct — with the skip closed, angling the carrier buys time for the 6:0 to set.',
        'Točno — dok je dugo dodavanje zatvoreno, usmjeravanje u širinu kupuje vrijeme za 6:0.',
        'Richtig — ist der lange Pass zu, drängt das Nach-außen-Stellen Zeit für die 6:0 heraus.',
      ],
      [
        'good',
        'Sprint first to the far wing, then recover to the ball',
        'Prvo sprintaj prema dalekom krilu, zatim se vraćaj na loptu',
        'Zuerst zum entfernten Außen sprinten, dann zurück zum Ball',
        'Good idea in general, but here the far wing is already covered — you abandon the carrier.',
        'Općenito dobra ideja, ali ovdje je daleko krilo već pokriveno — napuštaš vodiča lopte.',
        'Grundsätzlich gut, aber hier ist der Außen schon gedeckt — du verlässt den Ballführer.',
      ],
      [
        'risky',
        'Dive into a tackle from behind on the ball carrier',
        'Idi u start odostraga na vodiča lopte',
        'Von hinten in den Ballführer hineingehen',
        'Risky — contact from behind often means a suspension and a clear chance.',
        'Rizično — kontakt odostraga često znači isključenje i čistu priliku.',
        'Riskant — Kontakt von hinten bedeutet oft Zeitstrafe und klare Chance.',
      ],
      [
        'poor',
        'Stop at halfway and leave the 1v1 to the goalkeeper',
        'Stani na sredini terena i ostavi vrataru igru 1 na 1',
        'Auf Höhe der Mittellinie stehen bleiben und dem Torwart das 1 gegen 1 überlassen',
        'Poor — backs must delay transition; leaving the carrier free concedes the break.',
        'Loše — vanjski moraju usporiti tranziciju; slobodan vodič lopte znači gol iz kontranapada.',
        'Schlecht — Rückraum muss verzögern; freier Ballführer bedeutet Tempogegenstoß-Tor.',
      ],
    ]),
    explanation: L(
      'The cue is that the far wing is already covered. Your job is the ball carrier: angle him wide and delay without fouling so the 6:0 can set. Sprinting to a covered wing abandons the carrier; diving from behind risks a suspension.',
      'Signal je da je daleko krilo već pokriveno. Tvoj je posao vodič lopte: usmjeri ga u širinu i uspori bez prekršaja dok se ne postavi 6:0. Sprint na već pokriveno krilo napušta vodiča; start odostraga riskira isključenje.',
      'Das Signal: der entfernte Außen ist schon gedeckt. Dein Job ist der Ballführer — nach außen drängen und verzögern, bis die 6:0 steht. Sprint zum gedeckten Außen verlässt ihn; Attacke von hinten riskiert Zeitstrafe.',
    ),
    skillTags: ['fastBreakTiming', 'defensiveReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_161: {
    title: L(
      'Left Back — Crossing After Late Switch',
      'Lijevi vanjski — križanje nakon kasnog preuzimanja',
      'Linker Rückraum — Kreuzen nach spätem Übernehmen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 28,
    score: '28–27',
    situation: L(
      'You and the centre back run a crossing action at 28\'. Score 28–27 for you. The defence switches late. You receive on the right side at nine metres. The switched defender still has his back partly toward you and is turning. Help from the middle has not closed the gap yet.',
      'Ti i srednji vanjski izvodite križanje u 28. minuti. Vodite 28–27. Obrana kasno radi preuzimanje. Primaš na desnoj strani na devet metara. Preuzeti branič još je djelomično leđima prema tebi i tek se okreće. Pomoć iz sredine još nije zatvorila prostor.',
      'Du und Rückraum Mitte kreuzt in Minute 28. Ihr führt 28–27. Die Abwehr übernimmt spät. Du bekommst rechts auf neun Metern. Der übernommene Verteidiger steht dir noch teilweise mit dem Rücken zu und dreht sich erst. Hilfe aus der Mitte hat die Lücke noch nicht geschlossen.',
    ),
    question: L(
      'When must you attack after the cross lands?',
      'Kada moraš napasti nakon što križanje sleti?',
      'Wann musst du nach dem Kreuzen angreifen?',
    ),
    answers: answers([
      [
        'optimal',
        'Attack immediately on the catch before the switched defender squares up',
        'Napadni odmah u hvatu prije nego se preuzeti branič postavi frontalno',
        'Sofort nach dem Fang angreifen, bevor der übernommene Verteidiger frontal steht',
        'Correct — the value of the cross is the unfinished switch; delay kills it.',
        'Točno — vrijednost križanja je nedovršeno preuzimanje; čekanje to ubija.',
        'Richtig — der Wert des Kreuzens ist die unfertige Übernahme; Warten zerstört ihn.',
      ],
      [
        'good',
        'One freeze fake, then decide shot or pass',
        'Jedna finta za zaustavljanje, zatim odluka šut ili dodavanje',
        'Eine Freeze-Finte, dann Entscheidung Wurf oder Pass',
        'Good as a general tool, but here the extra fake gives him time to square up.',
        'Dobro kao opći alat, ali ovdje dodatna finta daje mu vrijeme da se postavi.',
        'Gut als Mittel, aber hier gibt die Extrafinte ihm Zeit, sich zu stellen.',
      ],
      [
        'risky',
        'Hold and wait for the pivot to reseal after the switch',
        'Drži i čekaj da pivot ponovo zatvori nakon preuzimanja',
        'Halten und warten, bis der Kreisläufer nach der Übernahme neu abdichtet',
        'Risky — holding lets the switched defender and help recover structure.',
        'Rizično — držanje daje preuzetom braniču i pomoći vrijeme za zatvaranje.',
        'Riskant — Halten gibt Übernehmer und Hilfe Zeit zur Neuordnung.',
      ],
      [
        'poor',
        'Pass back to the original side without threatening the gap',
        'Vrati loptu na početnu stranu bez prijetnje u prostor',
        'Den Ball auf die Ausgangsseite zurückpassen, ohne die Lücke zu bedrohen',
        'Poor — the cross loses all value without an attack after the catch.',
        'Loše — križanje gubi svu vrijednost bez napada nakon hvata.',
        'Schlecht — ohne Angriff nach dem Fang verliert das Kreuzen jeden Wert.',
      ],
    ]),
    explanation: L(
      'The cue is the defender still turning and help not yet closed. Attack on the catch. An extra fake is usually useful, but here it gifts the time he needs to face you. Holding or passing back resets the defence.',
      'Signal je branič koji se još okreće i pomoć koja nije zatvorila prostor. Napadni u hvatu. Dodatna finta inače pomaže, ali ovdje mu poklanja vrijeme da se postavi. Držanje ili povratak lopte resetira obranu.',
      'Signal: Verteidiger dreht noch, Hilfe ist nicht zu. Angriff direkt nach dem Fang. Extrafinte hilft sonst, schenkt ihm hier aber Zeit. Halten oder Zurückpassen setzt die Abwehr zurück.',
    ),
    skillTags: ['pressureDecisions', 'defensiveReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_163: {
    title: L(
      'Left Back — Player-Up Gap Before Rotation',
      'Lijevi vanjski — prostor u igraču više prije rotacije',
      'Linker Rückraum — Überzahl-Lücke vor der Rotation',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 9,
    score: '14–13',
    situation: L(
      'Your team plays 6-on-5 at 9\'. You lead 14–13. You receive at nine metres. One short-handed defender is rotating late from the middle. The pivot seals the near man. The left wing is open one pass wide. The gap exists only until the rotator arrives.',
      'Vaš tim igra s igračem više (6 na 5) u 9. minuti. Vodite 14–13. Primaš na devet metara. Jedan branič u igraču manje kasno rotira iz sredine. Pivot zatvara bližeg braniča. Lijevo krilo je otvoreno jedno dodavanje u širinu. Prostor postoji samo dok rotator ne stigne.',
      'Euer Team spielt Überzahl 6 gegen 5 in Minute 9. Ihr führt 14–13. Du bekommst auf neun Metern. Ein Unterzahl-Verteidiger rotiert spät aus der Mitte. Der Kreisläufer dichtet den nahen Mann ab. Der Linksaußen ist einen Pass breit offen. Die Lücke existiert nur bis der Rotierer da ist.',
    ),
    question: L(
      'What do you punish before the late rotator arrives?',
      'Što kažnjavaš prije nego što stigne kasni rotator?',
      'Was bestrafst du, bevor der späte Rotierer ankommt?',
    ),
    answers: answers([
      [
        'optimal',
        'Attack the open gap now — finish, feed the seal, or hit the open wing',
        'Odmah napadni otvoreni prostor — završi, odigraj na pivota ili na otvoreno krilo',
        'Die offene Lücke sofort angreifen — abschließen, zum Kreisläufer oder auf den freien Außen',
        'Correct — numerical advantage is temporary; speed beats waiting for perfection.',
        'Točno — igrač više je privremen; brzina pobjeđuje čekanje savršene slike.',
        'Richtig — Überzahl ist zeitlich begrenzt; Tempo schlägt Warten auf Perfektion.',
      ],
      [
        'good',
        'One more full perimeter swing looking for a prettier angle',
        'Još jedan puni obilazak perimetra u potrazi za ljepšim kutom',
        'Noch eine volle Perimeterkreisung für einen schöneren Winkel',
        'Good — can improve the shot, but often lets the defence recover to 6:0.',
        'Dobro — može popraviti šut, ali često vrati obranu u 6:0.',
        'Gut — kann den Wurf verbessern, holt die Abwehr aber oft in die 6:0 zurück.',
      ],
      [
        'risky',
        'Hold at nine metres until the pivot seals even deeper',
        'Drži na devet metara dok pivot ne zatvori još dublje',
        'Auf neun Metern halten, bis der Kreisläufer noch tiefer abdichtet',
        'Risky — holding invites the short-handed unit to rebuild structure.',
        'Rizično — držanje poziva obranu u igraču manje da ponovo zatvori oblik.',
        'Riskant — Halten lädt die Unterzahl-Abwehr ein, die Form neu zu bauen.',
      ],
      [
        'poor',
        'Dribble along the nine-metre line only to protect possession',
        'Vodi loptu uz liniju devet metara samo da čuvaš posjed',
        'Entlang der Neun-Meter-Linie dribbeln, nur um den Ball zu schützen',
        'Poor — player-up is for scoring pressure, not empty clock work.',
        'Loše — igrač više služi za pritisak na gol, ne za prazno čuvanje lopte.',
        'Schlecht — Überzahl ist für Druck aufs Tor, nicht zum Totspielen.',
      ],
    ]),
    explanation: L(
      'The cue is the late rotator. Attack the gap now with finish, pivot feed, or wing pass before 6:0 returns. Another full swing can wait for a prettier angle but often wastes the advantage. Holding or empty dribbling gives the defence the recovery they need.',
      'Signal je kasni rotator. Napadni prostor odmah šutom, dodavanjem na pivota ili na krilo prije nego se vrati 6:0. Još jedan obilazak može tražiti ljepši kut, ali često potroši prednost. Držanje ili prazno vođenje lopte daje obrani potreban povratak.',
      'Signal ist der späte Rotierer. Sofort Lücke bestrafen — Wurf, Kreisläufer oder Außen — bevor die 6:0 zurück ist. Ein weiterer Swing kann schöner sein, verbrennt aber oft den Vorteil.',
    ),
    skillTags: ['pressureDecisions'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_166: {
    title: L(
      'Left Back — Late Possession Decision',
      'Lijevi vanjski — odluka u zadnjem napadu',
      'Linker Rückraum — Entscheidung im letzten Angriff',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 59,
    score: '22–23',
    situation: L(
      'You trail 22–23 with 18 seconds left. This is likely your final possession. Passive play has not been announced. You are the left back with the ball at nine metres. A clean gap is open between left half and centre. The left wing is only half-covered. Coach wants a clean decision, not chaos.',
      'Gubite 22–23. Ostalo je 18 sekundi. Ovo je vjerojatno zadnji napad. Pasivna igra nije najavljena. Ti si lijevi vanjski s loptom na devet metara. Čist prostor je otvoren između lijevog polubranitelja i sredine. Lijevo krilo je samo polupokriveno. Trener traži čistu odluku, ne kaos.',
      'Ihr liegt 22–23 zurück. Noch 18 Sekunden. Das ist wahrscheinlich euer letzter Angriff. Passives Spiel wurde nicht angezeigt. Du bist linker Rückraum mit Ball auf neun Metern. Eine klare Lücke ist zwischen linkem Halben und Mitte offen. Der Linksaußen ist nur halb zugestellt. Der Trainer will eine saubere Entscheidung, kein Chaos.',
    ),
    question: L(
      'What does the game state demand right now?',
      'Što traži rezultat i vrijeme u ovom trenutku?',
      'Was verlangen Spielstand und Zeit jetzt?',
    ),
    answers: answers([
      [
        'optimal',
        'Take the clean gap shot now — highest-percentage action while time remains',
        'Uzmi čist šut iz prostora sada — akcija s najvećim postotkom dok još ima vremena',
        'Die klare Lücke jetzt werfen — höchste Quote, solange Zeit bleibt',
        'Correct — trailing with one possession: the open gap is the highest-percentage finish now.',
        'Točno — gubiš s jednim napadom: otvoreni prostor je sada najčišći završetak.',
        'Richtig — Rückstand, ein Angriff: die offene Lücke ist jetzt der sauberste Abschluss.',
      ],
      [
        'good',
        'One decisive pass to the half-covered wing only if he is truly freer than your gap',
        'Jedno odlučujuće dodavanje na polupokriveno krilo samo ako je stvarno slobodniji od tvog prostora',
        'Ein entscheidender Pass auf den halb freien Außen nur wenn er wirklich freier ist als deine Lücke',
        'Good — only if the wing is clearly freer; otherwise you trade a clean gap for a harder catch.',
        'Dobro — samo ako je krilo jasno slobodnije; inače mijenjaš čist prostor za teži hvat.',
        'Gut — nur wenn der Außen klar freier ist; sonst tauschst du klare Lücke gegen schweren Fang.',
      ],
      [
        'risky',
        'Hold until five seconds then force a deep contested jumper',
        'Drži do pet sekundi, zatim forsiraj duboki sporni skok-šut',
        'Bis fünf Sekunden halten, dann einen tiefen umkämpften Sprungwurf erzwingen',
        'Risky — empty holding burns the open gap and forces a worse shot under pressure.',
        'Rizično — prazno držanje troši otvoreni prostor i forsira lošiji šut pod pritiskom.',
        'Riskant — leeres Halten verbrennt die Lücke und erzwingt den schlechteren Druckwurf.',
      ],
      [
        'poor',
        'Manufacture contact hoping the referee awards a seven-metre',
        'Traži kontakt u nadi da sudac dosudi sedmerac',
        'Kontakt suchen in der Hoffnung auf Siebenmeter',
        'Poor — fishing for a seven-metre is low percentage and risks a turnover with no time left.',
        'Loše — iznuđivanje sedmerca ima mali postotak i riskira gubitak lopte bez vremena.',
        'Schlecht — auf Siebenmeter zu spekulieren ist wenig Prozent und riskiert Ballverlust ohne Zeit.',
      ],
    ]),
    explanation: L(
      'You trail by one with 18 seconds and likely one possession. The cue is the clean gap already open — take that shot. A pass to the wing is second-best only if he is truly freer. Holding to five seconds or hunting a seven-metre turns a clear chance into chaos.',
      'Gubiš jedan gol, ostalo je 18 sekundi i vjerojatno jedan napad. Signal je već otvoren čist prostor — uzmi taj šut. Dodavanje na krilo je druga opcija samo ako je stvarno slobodniji. Držanje do pet sekundi ili lov na sedmerac pretvara čistu priliku u kaos.',
      'Ein Tor Rückstand, 18 Sekunden, wahrscheinlich ein Angriff. Signal ist die schon offene Lücke — wirf. Pass auf den Außen nur wenn er wirklich freier ist. Halten bis fünf oder auf Siebenmeter spekulieren macht aus klarer Chance Chaos.',
    ),
    skillTags: ['pressureDecisions', 'shotReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },

  scn_bank_165: {
    title: L(
      'Left Back — Breaking the Goalkeeper Pattern',
      'Lijevi vanjski — promjena šuta nakon čitanja vratara',
      'Linker Rückraum — Wurf ändern nach Torwart-Muster',
    ),
    difficulty: 'Expert',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 28,
    score: '22–21',
    defensiveSystem: '6-0',
    situation: L(
      'You receive at ten metres at 28\' against a set 6:0. Score 22–21 for you. The goalkeeper has saved your last two shots to the same high corner and is already set for that same shot. The pivot is lightly covered; the near wing is closed.',
      'Primaš na deset metara u 28. minuti protiv postavljene 6:0. Prednost je 22–21. Vratar je obranio tvoja zadnja dva šuta u isti visoki kut i već stoji spreman na isti šut. Pivot je slabo pokriven; bliže krilo je zatvoreno.',
      'Du bekommst auf zehn Metern in Minute 28 gegen stehende 6:0. Ihr führt 22–21. Der Torwart hat deine letzten beiden Würfe in dieselbe hohe Ecke gehalten und steht schon auf denselben Wurf. Der Kreisläufer ist leicht zugestellt; der nahe Außen ist zu.',
    ),
    question: L(
      'How do you change the threat without abandoning the shot?',
      'Kako mijenjaš prijetnju, a da ne odustaneš od šuta?',
      'Wie änderst du die Gefahr, ohne auf den Wurf zu verzichten?',
    ),
    answers: answers([
      [
        'optimal',
        'Pass fake, then shoot a different height or the opposite corner',
        'Finta dodavanja, zatim šut u drugu visinu ili suprotni kut',
        'Passfinte, dann Wurf in andere Höhe oder die Gegenecke',
        'Correct — change shot type or height; more power into the same window loses.',
        'Točno — promijeni vrstu ili visinu šuta; više snage u isti prozor gubi.',
        'Richtig — Wurfart oder Höhe ändern; mehr Power ins gleiche Fenster verliert.',
      ],
      [
        'good',
        'Feed the pivot if his preparation leaves the inside lane soft',
        'Odigraj na pivota ako njegova priprema ostavlja mekan unutarnji prolaz',
        'Zum Kreisläufer spielen, wenn seine Vorbereitung die Innenbahn weich lässt',
        'Good — valid when his set opens the inside; changing the shot remains the first read.',
        'Dobro — vrijedi kad njegova priprema otvori unutra; promjena šuta i dalje je prvo čitanje.',
        'Gut — wenn seine Vorbereitung innen öffnet; die Wurfänderung bleibt erste Lesart.',
      ],
      [
        'risky',
        'Shoot harder into the same high corner he already owns',
        'Šutiraj jače u isti visoki kut koji već čita',
        'Härter in dieselbe hohe Ecke werfen, die er schon liest',
        'Risky — he is prepared for that exact window.',
        'Rizično — spreman je baš na taj prozor.',
        'Riskant — genau dieses Fenster erwartet er.',
      ],
      [
        'poor',
        'Force a long pass to the covered near wing under pressure',
        'Pod pritiskom forsiraj dugo dodavanje na pokriveno bliže krilo',
        'Unter Druck den langen Pass auf den zugestellten nahen Außen erzwingen',
        'Poor — turning a prepared shot duel into a covered long pass wastes the possession.',
        'Loše — pretvaranje pripremljenog duela s vratarem u pokriveno dugo dodavanje baca napad.',
        'Schlecht — aus vorbereitetem Torwart-Duell einen zugestellten langen Pass zu machen verschenkt den Angriff.',
      ],
    ]),
    explanation: L(
      'The cue is the goalkeeper already set for your favourite high corner. Change the shot — pass fake into another height or the far corner. Feeding the pivot is second if his set opens inside. More power to the same corner or a covered long pass ignores the read.',
      'Signal je da vratar već stoji spreman na tvoj omiljeni visoki kut. Promijeni šut — finta dodavanja u drugu visinu ili daleki kut. Odigravanje na pivota je druga opcija ako njegova priprema otvori unutra. Više snage u isti kut ili pokriveno dugo dodavanje ignorira čitanje.',
      'Signal: der Torwart steht schon auf deine Lieblingsecke. Wurf ändern — Passfinte in andere Höhe oder weite Ecke. Kreisläufer ist zweite Wahl, wenn innen weich wird.',
    ),
    skillTags: ['shotReading', 'angleSelection'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },
};

const NEW_SCENARIOS = [
  {
    id: 'scn_bank_657',
    title: L(
      'Left Back — Space Behind 3:2:1 First Line',
      'Lijevi vanjski — prostor iza prve linije u 3:2:1',
      'Linker Rückraum — Raum hinter der ersten Linie in der 3:2:1',
    ),
    category: 'Left Back',
    primaryPosition: 'Left Back',
    secondaryPositions: [],
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 28,
    score: '19–18',
    defensiveSystem: '3-2-1',
    situation: L(
      'Opponent defends 3:2:1 at 28\'. You lead 19–18. Their high outside defender steps toward you at nine metres. Behind him, between the second line and the pivot lane, a lane opens for one pass. The centre back is moving toward you for a short exchange. The pivot sits between the two low defenders, not yet sealed.',
      'Protivnik brani 3:2:1 u 28. minuti. Vodite 19–18. Njihov visoki vanjski branič izlazi na tebe na devet metara. Iza njega, između druge linije i linije pivota, otvara se prolaz za jedno dodavanje. Srednji vanjski ide prema tebi za kratku razmjenu. Pivot stoji između dva donja braniča, još nije zatvorio.',
      'Gegner verteidigt 3:2:1 in Minute 28. Ihr führt 19–18. Ihr hoher äußerer Verteidiger tritt auf neun Metern auf dich heraus. Hinter ihm öffnet sich zwischen zweiter Linie und Kreisläuferbahn eine Passgasse. Rückraum Mitte kommt zum kurzen Austausch. Der Kreisläufer steht zwischen den beiden unteren Verteidigern, noch ohne Abdichtung.',
    ),
    question: L(
      'What do you read first when the high defender steps out?',
      'Što prvo čitaš kad visoki branič izađe na tebe?',
      'Was liest du zuerst, wenn der hohe Verteidiger heraustritt?',
    ),
    answers: answers([
      [
        'optimal',
        'Fix the stepping defender, then play behind him into the second-line gap or to the arriving centre back',
        'Fiksiraj izašlog braniča, zatim odigraj iza njega u prostor druge linije ili na dolazećeg srednjeg vanjskog',
        'Den heraustretenden Verteidiger binden, dann hinter ihn in die zweite Linie oder auf den kommenden Rückraum Mitte spielen',
        'Correct — the step creates space behind; fixing him then playing through beats a blind shot.',
        'Točno — izlazak stvara prostor iza; fiksacija pa proigravanje bije slijepi šut.',
        'Richtig — das Herausrücken schafft Raum dahinter; Binden und Durchspielen schlägt Blindwurf.',
      ],
      [
        'good',
        'If he overcommits, breakthrough past his hip before the second line slides',
        'Ako preduboko izađe, prodri kroz bok prije nego druga linija dođe u pomoć',
        'Wenn er zu tief herauskommt, am Hüft vorbeigehen, bevor die zweite Linie hilft',
        'Good — valid on a heavy overcommit; first read remains the space behind the step.',
        'Dobro — vrijedi kod jakog pretjeranog izlaska; prvo čitanje i dalje je prostor iza koraka.',
        'Gut — bei starkem Übercommit gültig; erste Lesart bleibt der Raum hinter dem Schritt.',
      ],
      [
        'risky',
        'Shoot immediately over the stepping defender without fixing him',
        'Odmah šutiraj preko izašlog braniča bez fiksacije',
        'Sofort über den heraustretenden Verteidiger werfen, ohne ihn zu binden',
        'Risky — without a fix the second line and goalkeeper are set for an early shot.',
        'Rizično — bez fiksacije druga linija i vratar čekaju rani šut.',
        'Riskant — ohne Binden warten zweite Linie und Torwart auf den frühen Wurf.',
      ],
      [
        'poor',
        'Ignore the step and swing the ball back to the far wing immediately',
        'Ignoriraj izlazak i odmah vrati loptu na daleko krilo',
        'Das Herausrücken ignorieren und den Ball sofort auf den entfernten Außen zurückschwingen',
        'Poor — you throw away the space the high defender just gifted behind him.',
        'Loše — bacaš prostor koji ti je visoki branič upravo poklonio iza sebe.',
        'Schlecht — du verschenkst den Raum, den der hohe Verteidiger gerade hinter sich öffnet.',
      ],
    ]),
    explanation: L(
      'In 3:2:1 the cue is the high defender stepping out. Do not just shoot over him. Fix him first, then play the gap behind into the second line or the arriving centre back. A breakthrough is second if he overcommits. Ignoring the step wastes the structural advantage.',
      'U 3:2:1 signal je izlazak visokog braniča. Nemoj samo šutirati preko njega. Prvo ga fiksiraj, zatim proigraj prostor iza njega u drugu liniju ili na dolazećeg srednjeg vanjskog. Prodor je druga opcija ako pretjera s izlaskom. Ignoriranje izlaska baca strukturnu prednost.',
      'In der 3:2:1 ist das Signal das Herausrücken des Hohen. Nicht einfach drüber werfen. Zuerst binden, dann den Raum dahinter bespielen. Durchbruch nur bei klarem Übercommit.',
    ),
    qualityScore: 9,
    skillTags: ['defensiveReading', 'shotReading'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },
  {
    id: 'scn_bank_658',
    title: L(
      'Left Back — Second Pivot Entry in 7v6',
      'Lijevi vanjski — ulazak drugog pivota u 7 na 6',
      'Linker Rückraum — Einlaufen des zweiten Kreisläufers im 7 gegen 6',
    ),
    category: 'Left Back',
    primaryPosition: 'Left Back',
    secondaryPositions: [],
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 51,
    score: '26–26',
    situation: L(
      'Tied 26–26 at 51\'. Your team plays 7v6 with an empty goal. You have the ball at nine metres on the left. The first pivot seals the near defender. A teammate starts the second-pivot run into the middle six-metre lane. Two defenders collapse toward the first pivot. The left wing is open but one long pass away. A turnover is an empty-goal counter the other way.',
      'Neriješeno 26–26 u 51. minuti. Vaš tim igra 7 na 6 s praznim golom. Ti imaš loptu na devet metara lijevo. Prvi pivot zatvara bližeg braniča. Suigrač kreće u ulazak drugog pivota u sredinu na šest metara. Dva braniča padaju prema prvom pivotu. Lijevo krilo je otvoreno, ali jedno dugo dodavanje daleko. Izgubljena lopta znači kontranapad na prazan gol.',
      'Unentschieden 26–26 in Minute 51. Euer Team spielt 7 gegen 6 mit leerem Tor. Du hast links auf neun Metern den Ball. Der erste Kreisläufer dichtet den Nahverteidiger ab. Ein Mitspieler startet als zweiter Kreisläufer in die mittlere Sechs-Meter-Bahn. Zwei Verteidiger klappen auf den ersten Kreisläufer. Der Linksaußen ist frei, aber einen langen Pass entfernt. Ballverlust bedeutet Gegenstoß aufs leere Tor.',
    ),
    question: L(
      'What do you punish when two defenders collapse on the first pivot?',
      'Što kažnjavaš kad se dva braniča sruše na prvog pivota?',
      'Was bestrafst du, wenn zwei Verteidiger auf den ersten Kreisläufer klappen?',
    ),
    answers: answers([
      [
        'optimal',
        'Fix the collapsing pair, then release early to the second pivot in the open middle lane',
        'Fiksiraj par koji pada, zatim rano odigraj na drugog pivota u otvorenu sredinu',
        'Das zusammenklappende Paar binden, dann früh auf den zweiten Kreisläufer in die offene Mitte spielen',
        'Correct — two on the first pivot frees the second-pivot lane; early release beats waiting.',
        'Točno — dva na prvom pivotu oslobađaju liniju drugog pivota; rano dodavanje bije čekanje.',
        'Richtig — zwei auf dem ersten Kreisläufer öffnen die Bahn des Zweiten; frühes Abspiel schlägt Warten.',
      ],
      [
        'good',
        'If the second-pivot lane closes, hit the open wing before the defence recovers width',
        'Ako se linija drugog pivota zatvori, odigraj na otvoreno krilo prije nego obrana vrati širinu',
        'Wenn die Bahn des zweiten Kreisläufers zu ist, auf den freien Außen spielen, bevor Breite zurückkommt',
        'Good — the wing is the safety valve; second pivot remains the first punishment of the collapse.',
        'Dobro — krilo je sigurnosni ventil; drugi pivot ostaje prva kazna za urušavanje.',
        'Gut — der Außen ist Sicherheitsventil; der zweite Kreisläufer bleibt erste Bestrafung des Klappens.',
      ],
      [
        'risky',
        'Force a tight bounce into the first pivot through both collapsing defenders',
        'Forsiraj usko odskočno dodavanje na prvog pivota kroz oba braniča koji padaju',
        'Einen engen Bounce auf den ersten Kreisläufer durch beide klappenden Verteidiger erzwingen',
        'Risky — two defenders on one pivot makes that feed the highest turnover risk with empty goal.',
        'Rizično — dva braniča na jednom pivotu čine to dodavanje najopasnijim gubitkom uz prazan gol.',
        'Riskant — zwei Verteidiger auf einem Kreisläufer machen diesen Pass zum höchsten Verlustrisiko bei leerem Tor.',
      ],
      [
        'poor',
        'Hold and dribble laterally until the shot clock is nearly empty',
        'Drži i vodi loptu bočno dok sat za napad skoro ne istekne',
        'Halten und seitlich dribbeln, bis die Angriffszeit fast leer ist',
        'Poor — with empty goal behind you, slow play raises turnover disaster without punishing the collapse.',
        'Loše — s praznim golom iza sebe spora igra diže rizik katastrofe bez kazne urušavanja.',
        'Schlecht — bei leerem Tor erhöht langsames Spiel das Desaster-Risiko, ohne das Klappen zu bestrafen.',
      ],
    ]),
    explanation: L(
      'In 7v6 the cue is two defenders collapsing on the first pivot. That frees the second-pivot lane — fix, then release early. The open wing is the backup if that lane closes. Forcing the crowded first pivot or slow dribbling risks an empty-goal counter.',
      'U 7 na 6 signal je urušavanje dva braniča na prvog pivota. To otvara liniju drugog pivota — fiksiraj, zatim rano odigraj. Otvoreno krilo je rezerva ako se ta linija zatvori. Forsiranje zbijenog prvog pivota ili sporo vođenje riskira kontranapad na prazan gol.',
      'Im 7 gegen 6 ist das Signal das Klappen zweier Verteidiger auf den ersten Kreisläufer. Das öffnet die Bahn des Zweiten — binden, früh abspielen. Freier Außen ist Plan B. Enger Pass auf den Ersten oder langsames Dribbling riskiert Gegenstoß aufs leere Tor.',
    ),
    qualityScore: 9,
    skillTags: ['pressureDecisions', 'screening'],
    _human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true },
  },
];

function polishHr(text) {
  return text
    .replace(/Vodite (\d+[–-]\d+)\./g, 'Prednost je $1.')
    .replace(/Gubite (\d+[–-]\d+)\./g, 'Zaostatak je $1.')
    .replace(/gubite (\d+[–-]\d+)/gi, 'zaostatak je $1')
    .replace(/Vaš tim /g, 'Tvoj tim ')
    .replace(/vaš tim /g, 'tvoj tim ')
    .replace(/izoliraniu/g, 'izoliranu')
    .replace(/digne ruke/g, 'dignute ruke')
    .replace(/Digne ruke/g, 'Dignute ruke');
}

for (const id of Object.keys(PATCHES)) {
  const p = PATCHES[id];
  p.situation.hr = polishHr(p.situation.hr);
  p.question.hr = polishHr(p.question.hr);
  p.explanation.hr = polishHr(p.explanation.hr);
  for (const a of p.answers) {
    a.text.hr = polishHr(a.text.hr);
    a.feedback.hr = polishHr(a.feedback.hr);
  }
}
for (const s of NEW_SCENARIOS) {
  s.situation.hr = polishHr(s.situation.hr);
  s.question.hr = polishHr(s.question.hr);
  s.explanation.hr = polishHr(s.explanation.hr);
  for (const a of s.answers) {
    a.text.hr = polishHr(a.text.hr);
    a.feedback.hr = polishHr(a.feedback.hr);
  }
}

let updated = 0;
for (const [id, patch] of Object.entries(PATCHES)) {
  const idx = bank.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error(`Missing ${id}`);
  const human = patch._human;
  delete patch._human;
  const next = { ...bank[idx], ...patch, id };
  const scored = scoreRubricV2(next, human);
  next.qualityScore = Math.round(scored.overall);
  next._rubricV2 = scored;
  bank[idx] = next;
  updated++;
  console.log(`patched ${id} → v2=${scored.overall} gold=${scored.passGold}`);
}

for (const raw of NEW_SCENARIOS) {
  const human = raw._human;
  delete raw._human;
  const scored = scoreRubricV2(raw, human);
  raw.qualityScore = Math.round(scored.overall);
  raw._rubricV2 = scored;
  if (bank.some((s) => s.id === raw.id)) throw new Error(`ID exists ${raw.id}`);
  bank.push(raw);
  console.log(`added ${raw.id} → v2=${scored.overall} gold=${scored.passGold}`);
}

// Strip _rubricV2 from persisted bank (keep qualityScore only) — actually keep for report file
const report = bank
  .filter((s) => PATCHES[s.id] || NEW_SCENARIOS.some((n) => n.id === s.id) || s._rubricV2)
  .map((s) => ({
    id: s.id,
    title: s.title?.hr || s.title?.en,
    qualityScore: s.qualityScore,
    rubricV2: s._rubricV2,
  }));

for (const s of bank) delete s._rubricV2;

writeFileSync(path, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(join(root, 'scripts/lb-gold-standard-report.json'), JSON.stringify({ updated, added: NEW_SCENARIOS.length, report }, null, 2) + '\n');
console.log(`Done. Bank size ${bank.length}. Report → scripts/lb-gold-standard-report.json`);
