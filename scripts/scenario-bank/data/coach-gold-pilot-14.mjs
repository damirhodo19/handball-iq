import { defineCoachGoldScenario as S, L, O, G, R, P } from './coach-gold-source-helpers.mjs';

export const COACH_GOLD_PILOT_14 = [
  S({
    familyKey: 'timeout_trailing_vs_5_1_first_pass_trap',
    situation: L(
      'At 55:40 you trail 26–28. The advanced defender in a 5:1 has intercepted the centre-back-to-left-back pass twice, and your attack has stopped moving.',
      'U 55:40 gubite 26:28. Istureni branič u 5:1 dvaput je presjekao dodavanje srednjeg prema lijevom vanjskom, a vaš se napad prestao kretati.',
      'Bei 55:40 liegt ihr 26:28 zurück. Der Vorgezogene im 5:1 hat zweimal den Pass von Rückraummitte zu Rückraum links abgefangen; euer Angriff steht.',
    ),
    question: L('What must the timeout establish?', 'Što mora donijeti minuta odmora?', 'Was muss die Auszeit festlegen?'),
    answers: [
      O('Use the pivot behind the advanced defender as the safe first option, attack the freed opposite side, and name the first two players responsible for retreat', 'Postavi pivota iza isturenoga kao prvo sigurno rješenje, napadni oslobođenu suprotnu stranu i odredi prva dva igrača za povratak', 'Kreisläufer hinter dem Vorgezogenen als erste sichere Option nutzen, die freie Gegenseite angreifen und die ersten zwei Rückzugsspieler benennen', 'It solves the first-pass trap and protects the next transition.', 'Rješava zamku na prvom dodavanju i štiti sljedeći povratak.', 'Löst die Falle beim ersten Pass und sichert den Rückzug.'),
      G('Send the wing behind the advanced defender on the next attack, without changing the rest of the structure', 'U sljedećem napadu pošalji krilo iza isturenoga, bez promjene ostatka strukture', 'Im nächsten Angriff den Flügel hinter dem Vorgezogenen einlaufen lassen, ohne die restliche Struktur zu ändern', 'This can free the first pass, but the team still lacks a retreat assignment.', 'Može osloboditi prvo dodavanje, ali povratne uloge ostaju nejasne.', 'Kann den ersten Pass öffnen, lässt aber den Rückzug ungeklärt.'),
      R('Install a new three-crossing combination during the timeout', 'Tijekom minute odmora uvedi novu kombinaciju s tri križanja', 'In der Auszeit eine neue Kombination mit drei Kreuzungen einführen', 'A new multi-step pattern is difficult to execute under late pressure.', 'Nova višedijelna akcija teško se izvodi pod završnim pritiskom.', 'Eine neue mehrteilige Folge ist unter Schlussdruck schwer ausführbar.'),
      P('Tell the left back to stop losing the ball and repeat the same first pass', 'Reci lijevom vanjskom da prestane gubiti loptu i ponovi isto prvo dodavanje', 'Rückraum links auffordern, den Ball nicht mehr zu verlieren, und denselben ersten Pass wiederholen', 'It blames the receiver and leaves the interception cue unchanged.', 'Okrivljuje primatelja, a ne mijenja uvjet koji obrana čita.', 'Gibt dem Empfänger die Schuld und verändert den gelesenen Pass nicht.'),
    ],
    explanation: L('A late timeout needs one executable answer to the visible trap and one clear safeguard after the shot.', 'Kasna minuta odmora treba dati jedno izvedivo rješenje za vidljivu zamku i jasnu zaštitu nakon završetka napada.', 'Eine späte Auszeit braucht eine ausführbare Antwort auf die erkennbare Falle und eine klare Absicherung nach dem Abschluss.'),
  }),
  S({
    familyKey: 'timeout_stop_7v6_double_pivot_run',
    situation: L(
      'With 6:10 left and the score tied, the opponent has scored three straight 7v6 goals by feeding the second pivot between your two central defenders.',
      'Šest minuta prije kraja rezultat je izjednačen, a protivnik je u igri 7 na 6 triput zaredom pronašao drugog pivota između vaša dva središnja braniča.',
      'Bei Gleichstand und 6:10 Restzeit hat der Gegner im 7 gegen 6 dreimal in Folge den zweiten Kreisläufer zwischen euren beiden Innenblockspielern gefunden.',
    ),
    question: L('Which timeout instruction is most useful?', 'Koja je uputa na minuti odmora najkorisnija?', 'Welche Auszeit-Anweisung hilft am meisten?'),
    answers: [
      O('Keep the central pair connected, assign each pivot before the pass, and have the nearest half-defender pressure the passer without abandoning the far wing', 'Zadrži povezan središnji par, prije dodavanja jasno odredi tko čuva kojeg pivota, a najbliži polubranitelj neka pritisne dodavača bez napuštanja dalekog krila', 'Innenblock verbunden halten, beide Kreisläufer vor dem Pass klar zuordnen und den Passgeber mit dem nahen Halbverteidiger stören, ohne den fernen Flügel aufzugeben', 'Every defender receives a precise responsibility in the route that is beating you.', 'Svaki branič dobiva jasnu odgovornost u akciji kojom vas protivnik kažnjava.', 'Jeder Verteidiger erhält eine klare Aufgabe gegen den erfolgreichen Angriffsweg.'),
      G('Stay in 6:0 and hand the second pivot over earlier between the central defenders', 'Ostani u 6:0 i ranije predaj drugog pivota između središnjih braniča', 'Im 6:0 bleiben und den zweiten Kreisläufer früher zwischen den Innenblockspielern übergeben', 'Earlier handover helps, but the passer still operates without pressure.', 'Ranija predaja pomaže, ali dodavač i dalje ostaje bez pritiska.', 'Die frühere Übergabe hilft, der Passgeber bleibt jedoch ungestört.'),
      R('Send both central defenders high as soon as the centre back receives', 'Pošalji oba središnja braniča visoko čim srednji vanjski primi loptu', 'Beide Innenblockspieler hochschicken, sobald Rückraummitte den Ball erhält', 'Both pivots can then seal the empty centre.', 'Oba pivota tada mogu zatvoriti prazan središnji prostor.', 'Beide Kreisläufer können dann die leere Mitte sperren.'),
      P('Keep the same assignments and demand that the goalkeeper save the next close-range shot', 'Zadrži iste uloge i traži od vratara da obrani sljedeći šut iz blizine', 'Gleiche Zuordnung beibehalten und vom Torwart die nächste Nahwurf-Parade verlangen', 'The defence is conceding an unopposed pivot finish before the goalkeeper can influence it.', 'Obrana dopušta čist šut pivota prije nego što vratar može utjecati.', 'Die Abwehr erlaubt einen freien Kreisläuferwurf, bevor der Torwart eingreifen kann.'),
    ],
    explanation: L('Against 7v6, the timeout must define pivot ownership, ball pressure, and far-wing protection as one connected rule.', 'Protiv igre 7 na 6 minuta odmora mora povezati podjelu pivota, pritisak na loptu i zaštitu dalekog krila.', 'Gegen 7 gegen 6 muss die Auszeit Kreisläufer-Zuordnung, Balldruck und Schutz des fernen Flügels in einer Regel verbinden.'),
  }),
  S({
    familyKey: 'defence_block_goalkeeper_long_range_cooperation',
    situation: L(
      'The opponent left back has scored four times from nine metres. Your central block jumps late and opens both sides, while the goalkeeper stays centred.',
      'Protivnički lijevi vanjski zabio je četiri puta s devet metara. Vaš središnji blok kasni u izlasku i otvara obje strane, dok vratar ostaje u sredini.',
      'Der gegnerische Rückraum links hat viermal aus neun Metern getroffen. Euer Innenblock kommt spät und öffnet beide Seiten, der Torwart bleibt mittig.',
    ),
    question: L('What adjustment creates real block–goalkeeper cooperation?', 'Koja prilagodba stvara stvarnu suradnju bloka i vratara?', 'Welche Anpassung schafft echte Block-Torwart-Zusammenarbeit?'),
    answers: [
      O('The nearest defender closes early and the block removes the agreed near side; the goalkeeper sets for the far-side lane', 'Najbliži branič izlazi ranije, blok zatvara dogovorenu bližu stranu, a vratar se postavlja za dalju putanju', 'Der nächste Verteidiger tritt früher heraus, der Block nimmt die vereinbarte kurze Seite, der Torwart stellt sich auf die lange Wurfbahn ein', 'The block and goalkeeper divide the goal instead of reacting to the same lane.', 'Blok i vratar dijele prostor vrata umjesto da obojica reagiraju na istu putanju.', 'Block und Torwart teilen das Tor, statt auf dieselbe Wurfbahn zu reagieren.'),
      G('Move the goalkeeper half a step toward the shooter before release', 'Pomakni vratara pola koraka prema šuteru prije izbačaja', 'Torwart vor der Ballabgabe einen halben Schritt zum Werfer verschieben', 'The angle improves, but the late split block still gives the shooter two exits.', 'Kut je bolji, ali razdvojeni blok i dalje šuteru ostavlja obje strane.', 'Der Winkel wird besser, doch der geteilte Block lässt zwei Wurfwege.'),
      R('Have both blockers jump at every arm fake', 'Neka oba braniča u bloku skaču na svaku varku rukom', 'Beide Blockspieler sollen auf jede Armfinte springen', 'The shooter can wait for the block to descend or pass through the opened centre.', 'Šuter može pričekati spuštanje bloka ili dodati kroz otvorenu sredinu.', 'Der Werfer kann den sinkenden Block abwarten oder durch die offene Mitte passen.'),
      P('Let the goalkeeper choose a corner without a block agreement', 'Prepusti vrataru da bira kut bez dogovora s blokom', 'Torwart ohne Blockabstimmung eine Ecke wählen lassen', 'Guessing does not correct the repeated structural error.', 'Pogađanje ne ispravlja ponavljajuću strukturnu pogrešku.', 'Raten korrigiert den wiederkehrenden Strukturfehler nicht.'),
    ],
    explanation: L('Long-range defence improves when the block removes one defined lane and the goalkeeper owns the other.', 'Obrana šuta izvana napreduje kada blok zatvara jednu dogovorenu putanju, a vratar preuzima drugu.', 'Die Abwehr gegen Distanzwürfe wird besser, wenn der Block eine vereinbarte Bahn nimmt und der Torwart die andere.'),
  }),
  S({
    familyKey: 'defence_7v6_weak_side_wing_protection',
    situation: L(
      'In 7v6 the opponent places two pivots centrally. Your far wing defender keeps stepping inside, and the centre back skips the ball to an unmarked wing.',
      'U igri 7 na 6 protivnik postavlja dva pivota u sredini. Vaš branič na dalekom krilu stalno ulazi prema sredini, pa srednji vanjski dugim dodavanjem pronalazi slobodno krilo.',
      'Im 7 gegen 6 stehen zwei Kreisläufer zentral. Euer ferner Außenverteidiger rückt ständig ein, sodass Rückraummitte den freien Flügel mit einem Überspiel erreicht.',
    ),
    question: L('How should the defence correct the weak side?', 'Kako obrana treba ispraviti daleku stranu?', 'Wie korrigiert die Abwehr die ballferne Seite?'),
    answers: [
      O('Keep the far wing defender outside, split the two pivots between the central pair, and bring help from the near half-space only after the ball moves to that side', 'Zadrži braniča na dalekom krilu izvana, podijeli dva pivota između središnjeg para, a pomoć iz bližeg poluprostora uključi tek kada lopta krene na tu stranu', 'Fernen Außenverteidiger außen halten, beide Kreisläufer dem Innenblock zuordnen und Hilfe aus dem nahen Halbraum erst bringen, wenn der Ball dorthin gespielt wird', 'It protects the direct skip while keeping central ownership intact.', 'Štiti izravno dugo dodavanje, a središnje uloge ostaju jasne.', 'Schützt den Überspielpass und hält die zentralen Zuordnungen klar.'),
      G('Tell the central pair to hand the second pivot over earlier', 'Traži od središnjeg para da ranije preda drugog pivota', 'Innenblock soll den zweiten Kreisläufer früher übergeben', 'This improves the centre but does not stop the far wing defender from leaving early.', 'Poboljšava sredinu, ali ne sprječava prerani ulazak dalekog krilnog braniča.', 'Verbessert die Mitte, verhindert aber nicht das frühe Einrücken außen.'),
      R('Have the far wing defender jump the centre-back pass before it leaves the hand', 'Neka branič s dalekog krila krene presjeći dodavanje prije nego što lopta napusti ruku srednjega', 'Fernen Außenverteidiger schon vor der Ballabgabe auf den Pass von Rückraummitte springen lassen', 'An early gamble exposes both the wing and the passing lane behind the defender.', 'Rano kockanje otvara i krilo i prostor iza braniča.', 'Das frühe Risiko öffnet Flügel und Raum hinter dem Verteidiger.'),
      P('Collapse all six defenders around the two pivots', 'Skupi svih šest braniča oko dva pivota', 'Alle sechs Verteidiger um die beiden Kreisläufer zusammenziehen', 'The attack receives uncontested wing finishes on both sides.', 'Napad dobiva neometane završnice s oba krila.', 'Der Angriff erhält auf beiden Flügeln freie Abschlüsse.'),
    ],
    explanation: L('Weak-side protection in 7v6 starts with clear central ownership; the far wing cannot be the first helper.', 'Zaštita daleke strane u igri 7 na 6 počinje jasnom podjelom u sredini; daleki krilni branič ne smije prvi pomagati.', 'Ballferner Schutz im 7 gegen 6 beginnt mit klarer zentraler Zuordnung; der ferne Außenverteidiger darf nicht zuerst helfen.'),
  }),
  S({
    familyKey: 'substitution_attack_defence_late_exchange',
    situation: L(
      'You lead 30–29 with 1:20 left. Your attacking specialist finishes the play, but the defensive substitute is still at the line as the opponent prepares a quick throw-off.',
      'Vodite 30:29, a do kraja je 1:20. Napadački specijalist završava akciju, ali obrambeni igrač još je kod prostora za zamjenu dok protivnik priprema brzo početno bacanje.',
      'Ihr führt 30:29 bei 1:20 Restzeit. Der Angriffsspezialist schließt ab, der Abwehrspieler steht noch im Wechselraum, während der Gegner den schnellen Anwurf vorbereitet.',
    ),
    question: L('What is the correct substitution decision?', 'Koja je ispravna odluka o zamjeni?', 'Welche Wechselentscheidung ist richtig?'),
    answers: [
      O('If the exchange is not clearly complete before the restart, keep the attacker on, sprint him to the assigned defensive lane, and wait for the next safe window', 'Ako zamjena nije sigurno završena prije nastavka, ostavi napadača u igri, pošalji ga u dogovoreni obrambeni prostor i pričekaj sljedeću sigurnu priliku', 'Ist der Wechsel vor dem Anwurf nicht sicher abgeschlossen, bleibt der Angreifer auf dem Feld, sprintet in den vereinbarten Abwehrraum und wartet auf das nächste sichere Fenster', 'It protects the centre and avoids a rushed or illegal exchange.', 'Štiti sredinu i izbjegava zakašnjelu ili neispravnu zamjenu.', 'Schützt die Mitte und vermeidet einen verspäteten oder fehlerhaften Wechsel.'),
      G('Complete the exchange only if the outgoing player is already at the substitution line and the route is clear', 'Dovrši zamjenu samo ako je izlazni igrač već kod crte za zamjenu i put je potpuno slobodan', 'Wechsel nur abschließen, wenn der auswechselnde Spieler bereits an der Wechsellinie und der Weg frei ist', 'This is safe, but it requires both players to recognize the same moment under pressure.', 'Sigurno je, ali traži da oba igrača pod pritiskom prepoznaju isti trenutak.', 'Ist sicher, verlangt unter Druck aber, dass beide Spieler denselben Moment erkennen.'),
      R('Force the planned exchange even if the opponent has already restarted', 'Provedi planiranu zamjenu iako je protivnik već nastavio igru', 'Geplanten Wechsel erzwingen, obwohl der Gegner bereits fortgesetzt hat', 'The centre can be empty during the most dangerous transition moment.', 'Sredina može ostati prazna u najopasnijem trenutku tranzicije.', 'Die Mitte kann im gefährlichsten Umschaltmoment leer bleiben.'),
      P('Send the defender on before the attacker reaches the substitution line', 'Pošalji obrambenog igrača u teren prije nego što napadač dođe do crte za zamjenu', 'Abwehrspieler aufs Feld schicken, bevor der Angreifer die Wechselzone erreicht', 'That creates a faulty substitution and can lead to a suspension.', 'To stvara pogrešnu zamjenu i može donijeti isključenje.', 'Das verursacht einen Wechselfehler und kann eine Zeitstrafe bringen.'),
    ],
    explanation: L('Late attack–defence exchanges are secondary to protecting the first defensive lane and completing a legal substitution.', 'Kasna izmjena napad–obrana manje je važna od zaštite prvoga obrambenog prostora i pravilno izvedene zamjene.', 'Späte Angriff-Abwehr-Wechsel sind dem Schutz des ersten Abwehrraums und einem regelgerechten Wechsel untergeordnet.'),
  }),
  S({
    familyKey: 'substitution_youth_learning_error',
    situation: L(
      'A U15 centre back has twice seen the correct weak-side pass but released it late, causing two turnovers. The player now avoids looking across the court.',
      'Srednji vanjski u U15 dvaput je vidio ispravno dodavanje na daleku stranu, ali ga je odigrao prekasno i izgubio loptu. Sada više ni ne gleda preko igrališta.',
      'Ein U15-Rückraummitte hat zweimal den richtigen ballfernen Pass gesehen, aber zu spät gespielt und den Ball verloren. Jetzt schaut der Spieler nicht mehr quer über das Feld.',
    ),
    question: L('How should you use the next substitution?', 'Kako treba iskoristiti sljedeću zamjenu?', 'Wie sollte der nächste Wechsel genutzt werden?'),
    answers: [
      O('Give one cue — scan before the catch — allow one planned possession, then substitute and reinforce whether the read was early', 'Daj jednu uputu — pogled prije primanja — ostavi ga za jedan dogovoreni napad, zatim ga zamijeni i potvrdi je li prostor pročitao na vrijeme', 'Eine Anweisung geben — vor dem Fangen schauen — einen geplanten Angriff lassen, dann wechseln und die frühe Wahrnehmung bestätigen', 'The player gets a focused learning repetition without carrying the whole match burden.', 'Igrač dobiva usmjereno ponavljanje bez tereta da mora odmah riješiti cijelu utakmicu.', 'Der Spieler erhält eine gezielte Lernwiederholung ohne die gesamte Spielbelastung zu tragen.'),
      G('Substitute now, explain the timing privately, and return the player later with the same single task', 'Zamijeni ga sada, nasamo objasni trenutak dodavanja i kasnije ga vrati s istim jednim zadatkom', 'Jetzt wechseln, das Passtiming persönlich erklären und später mit derselben Einzelaufgabe zurückbringen', 'This protects the team and can still teach, but it removes the immediate corrective repetition.', 'Štiti ekipu i još može poučiti, ali uklanja neposredno popravno ponavljanje.', 'Schützt das Team und kann lehren, nimmt aber die direkte Korrekturwiederholung.'),
      R('Leave the player on without instruction so confidence is not disturbed', 'Ostavi ga u igri bez upute kako mu ne bi narušio samopouzdanje', 'Ohne Anweisung weiterspielen lassen, um das Selbstvertrauen nicht zu stören', 'Without a concrete task, avoidance can become the new decision habit.', 'Bez jasnog zadatka izbjegavanje može postati nova navika odlučivanja.', 'Ohne klare Aufgabe kann Vermeidung zur neuen Entscheidungsgewohnheit werden.'),
      P('Remove the player for the rest of the match and discuss both turnovers in front of the team', 'Izvadi ga do kraja utakmice i pred ekipom analiziraj oba gubitka lopte', 'Für den Rest des Spiels herausnehmen und beide Ballverluste vor dem Team besprechen', 'Public punishment teaches fear of the pass rather than earlier scanning.', 'Javna kazna uči strahu od dodavanja, a ne ranijem pregledu igre.', 'Öffentliche Bestrafung lehrt Angst vor dem Pass statt früher Wahrnehmung.'),
    ],
    explanation: L('Youth substitutions should manage match risk while preserving one clear learning objective.', 'Zamjena mladog igrača treba smanjiti rizik za ekipu i istodobno sačuvati jedan jasan cilj učenja.', 'Jugendwechsel sollen das Spielrisiko steuern und zugleich ein klares Lernziel erhalten.'),
  }),
  S({
    familyKey: 'training_transition_defence_after_missed_shot',
    situation: L(
      'You have 75 minutes with 14 players. Video shows that after a missed backcourt shot, all three first-line attackers watch the ball and the opponent runs through the centre.',
      'Imaš 75 minuta i 14 igrača. Snimka pokazuje da nakon promašenog šuta izvana sva tri igrača prve linije gledaju loptu, a protivnik trči kroz sredinu.',
      'Du hast 75 Minuten mit 14 Spielern. Das Video zeigt: Nach einem Fehlwurf aus dem Rückraum schauen alle drei Spieler der ersten Linie zum Ball, der Gegner läuft durch die Mitte.',
    ),
    question: L('Which training structure best transfers to the match?', 'Koja struktura treninga najbolje prenosi rješenje u utakmicu?', 'Welche Trainingsstruktur überträgt die Lösung am besten ins Spiel?'),
    answers: [
      O('Brief activation, a 3v2 retreat drill triggered by a shot, then a conditioned 6v6 game that rewards the first player protecting the centre', 'Kratka aktivacija, vježba povratka 3 na 2 koja počinje šutom, zatim uvjetovana igra 6 na 6 koja nagrađuje prvog igrača u zaštiti sredine', 'Kurze Aktivierung, eine durch den Wurf ausgelöste 3-gegen-2-Rückzugsübung, danach ein 6 gegen 6 mit Belohnung für den ersten Schutz der Mitte', 'The same visual trigger and first responsibility appear from simple practice to full play.', 'Isti vidljivi okidač i prva odgovornost prenose se od jednostavne vježbe do cijele igre.', 'Derselbe sichtbare Auslöser und die erste Aufgabe reichen von der einfachen Übung bis zum Spiel.'),
      G('Run repeated 3v2 transition defence for most of the session', 'Veći dio treninga ponavljaj tranzicijsku obranu 3 na 2', 'Den größten Teil der Einheit wiederholt 3 gegen 2 im Rückzug spielen', 'It gives repetitions, but transfer to full team spacing remains untested.', 'Daje ponavljanja, ali prijenos na raspored cijele ekipe ostaje neprovjeren.', 'Bringt Wiederholungen, prüft aber nicht den Transfer in die Mannschaftsordnung.'),
      R('Use only six-second sprint intervals, then explain the retreat roles at the end', 'Radi samo sprinteve od šest sekundi, a uloge u povratku objasni na kraju', 'Nur Sechs-Sekunden-Sprints durchführen und die Rückzugsrollen am Ende erklären', 'Running speed improves, but the players still do not practise the shot-to-retreat decision.', 'Brzina trčanja može napredovati, ali igrači ne vježbaju odluku nakon šuta.', 'Die Laufgeschwindigkeit kann steigen, die Entscheidung nach dem Wurf wird aber nicht trainiert.'),
      P('Spend the session on stationary shooting because missed shots caused the problem', 'Provedi trening u šutu bez obrane jer su promašaji uzrokovali problem', 'Die Einheit mit Würfen ohne Abwehr verbringen, weil Fehlwürfe das Problem ausgelöst haben', 'Even good shots can be saved or blocked; the missing behaviour is the immediate retreat.', 'I dobar šut može biti obranjen ili blokiran; nedostaje trenutačni povratak.', 'Auch gute Würfe können gehalten oder geblockt werden; es fehlt der sofortige Rückzug.'),
    ],
    explanation: L('A training plan should reproduce the match trigger, teach the first role, and then test it in full play.', 'Plan treninga treba ponoviti okidač iz utakmice, naučiti prvu ulogu i zatim je provjeriti u cijeloj igri.', 'Ein Trainingsplan soll den Spielauslöser nachbilden, die erste Aufgabe lehren und sie anschließend im freien Spiel prüfen.'),
  }),
  S({
    familyKey: 'training_match_in_48_hours_freshness',
    situation: L(
      'The next match is in 48 hours after a dense week. Players move slowly, but the opponent’s 5:1 requires one prepared first-pass solution. You have 70 minutes.',
      'Sljedeća utakmica je za 48 sati nakon zgusnutog tjedna. Igrači se kreću usporeno, ali protivnički 5:1 traži jedno pripremljeno rješenje za prvo dodavanje. Imaš 70 minuta.',
      'Das nächste Spiel ist nach einer dichten Woche in 48 Stunden. Die Spieler wirken langsam, doch gegen das gegnerische 5:1 braucht ihr eine vorbereitete Lösung für den ersten Pass. Du hast 70 Minuten.',
    ),
    question: L('What should today’s session prioritize?', 'Čemu današnji trening treba dati prednost?', 'Was hat heute Vorrang?'),
    answers: [
      O('Short activation, rehearse the first-pass solution at controlled intensity, test it in brief 6v6 blocks, and finish with set throws', 'Kratka aktivacija, uvježbavanje rješenja za prvo dodavanje kontroliranim intenzitetom, kratki blokovi 6 na 6 i završetak prekidima', 'Kurze Aktivierung, Lösung für den ersten Pass bei kontrollierter Intensität einüben, in kurzen 6-gegen-6-Blöcken prüfen und mit Standards abschließen', 'It preserves freshness while securing the one decision needed for the match.', 'Čuva svježinu i učvršćuje jednu odluku potrebnu za utakmicu.', 'Erhält die Frische und sichert die eine nötige Spielentscheidung.'),
      G('Use a short tactical walk-through and end after 45 minutes', 'Prođi taktičko rješenje smanjenim intenzitetom i završi nakon 45 minuta', 'Taktische Lösung in reduziertem Tempo durchgehen und nach 45 Minuten beenden', 'The load is appropriate, but the solution receives little live pressure.', 'Opterećenje je primjereno, ali rješenje dobiva malo stvarnog pritiska.', 'Die Belastung passt, doch die Lösung erhält wenig echten Druck.'),
      R('Install a new 5:1 defence and condition heavily in the same session', 'Na istom treningu uvedi novu obranu 5:1 i provedi zahtjevan kondicijski blok', 'In derselben Einheit eine neue 5:1-Abwehr einführen und intensiv konditionieren', 'New information and heavy load compete with match readiness.', 'Nove informacije i veliko opterećenje ugrožavaju spremnost za utakmicu.', 'Neue Informationen und hohe Belastung gefährden die Spielbereitschaft.'),
      P('Run a full-intensity 70-minute practice match to make the team feel sharp', 'Odigraj 70 minuta trening-utakmice punim intenzitetom kako bi se ekipa osjećala oštro', 'Ein 70-minütiges Trainingsspiel mit voller Intensität durchführen, damit sich die Mannschaft scharf fühlt', 'It adds unnecessary fatigue and does not isolate the required first-pass decision.', 'Dodaje nepotreban umor i ne izdvaja potrebnu odluku prvog dodavanja.', 'Erzeugt unnötige Ermüdung und isoliert die nötige Erstpassentscheidung nicht.'),
    ],
    explanation: L('Forty-eight hours before a match, clarity and controlled exposure matter more than volume.', 'Četrdeset osam sati prije utakmice jasnoća i kontrolirano opterećenje važniji su od količine rada.', 'Achtundvierzig Stunden vor dem Spiel sind Klarheit und kontrollierte Belastung wichtiger als Umfang.'),
  }),
  S({
    familyKey: 'development_pivot_receive_under_contact',
    situation: L(
      'A U16 pivot reaches the correct space but turns the chest away from contact and loses low passes when the defender fronts from the side.',
      'Pivot u U16 dolazi u pravi prostor, ali okreće prsa od kontakta i gubi niska dodavanja kada mu branič bočno uđe ispred putanje lopte.',
      'Ein U16-Kreisläufer erreicht den richtigen Raum, dreht aber die Brust vom Kontakt weg und verliert tiefe Pässe, wenn der Verteidiger seitlich vor ihm arbeitet.',
    ),
    question: L('What is the best first development step?', 'Koji je najbolji prvi razvojni korak?', 'Was ist der beste erste Entwicklungsschritt?'),
    answers: [
      O('Teach a wide base and chest toward the ball, then give repeated low feeds with controlled side contact before adding the finish', 'Postavi stopala šire i prsa prema lopti, zatim ponavljaj niska dodavanja uz kontrolirani bočni kontakt prije nego što dodaš završnicu', 'Breiten Stand und Brust zum Ball lehren, dann tiefe Zuspiele mit kontrolliertem Seitenkontakt wiederholen, bevor der Abschluss folgt', 'It isolates the body position that protects the catch before increasing complexity.', 'Izdvaja položaj tijela koji štiti primanje prije povećanja složenosti.', 'Isoliert die Körperposition, die den Fang schützt, bevor die Aufgabe komplexer wird.'),
      G('Start with uncontested low catches, then add a passive defender', 'Počni niskim primanjima bez obrane, zatim dodaj pasivnog braniča', 'Mit freien tiefen Fängen beginnen, dann einen passiven Verteidiger hinzufügen', 'Useful for confidence, but the key side-contact problem appears later.', 'Korisno je za sigurnost, ali se ključni problem bočnog kontakta pojavljuje tek poslije.', 'Hilft der Sicherheit, das zentrale Seitenkontaktproblem kommt jedoch erst später.'),
      R('Move the player to wing until catching confidence improves', 'Premjesti igrača na krilo dok mu se sigurnost primanja ne popravi', 'Spieler auf den Flügel versetzen, bis die Fangsicherheit steigt', 'The new role removes the exact contact skill the pivot needs to learn.', 'Nova uloga uklanja upravo kontakt koji pivot treba naučiti svladati.', 'Die neue Rolle entfernt genau den Kontakt, den der Kreisläufer lernen muss.'),
      P('Increase pass speed and tell the player to hold the ball more firmly', 'Povećaj brzinu dodavanja i reci igraču da jače drži loptu', 'Passgeschwindigkeit erhöhen und den Spieler auffordern, den Ball fester zu halten', 'More speed magnifies the body-position error without teaching a solution.', 'Veća brzina pojačava pogrešku položaja tijela bez poučavanja rješenja.', 'Mehr Tempo vergrößert den Körperpositionsfehler, ohne eine Lösung zu lehren.'),
    ],
    explanation: L('Pivot receiving under contact starts with stable feet, visible hands, and the chest protecting the ball line.', 'Primanje pivota pod kontaktom počinje stabilnim osloncem, vidljivim rukama i prsima koja štite putanju lopte.', 'Fangen unter Kontakt beginnt mit stabilem Stand, sichtbaren Händen und einer Brustposition, die die Ballbahn schützt.'),
  }),
  S({
    familyKey: 'development_goalkeeper_wing_angle',
    situation: L(
      'Your goalkeeper saves well from nine metres but concedes four wing shots by stepping toward the post before the shooter leaves the floor.',
      'Vaš vratar dobro brani šuteve s devet metara, ali prima četiri pogotka s krila jer kreće prema stativi prije nego što se šuter odrazi.',
      'Euer Torwart hält gut aus neun Metern, kassiert aber vier Flügelwürfe, weil er schon vor dem Absprung des Werfers zum Pfosten zieht.',
    ),
    question: L('Which coaching intervention is most precise?', 'Koja je trenerska intervencija najpreciznija?', 'Welche Trainermaßnahme ist am präzisesten?'),
    answers: [
      O('Keep the starting line until take-off, read the airborne body and ball height, then make one committed movement', 'Zadrži početnu liniju do odraza, pročitaj tijelo u zraku i visinu lopte, zatim napravi jedan odlučan pokret', 'Ausgangslinie bis zum Absprung halten, Körper in der Luft und Ballhöhe lesen, dann eine entschlossene Bewegung ausführen', 'It delays commitment until the shooter reveals usable information.', 'Odgađa odluku dok šuter ne pokaže korisnu informaciju.', 'Verzögert die Festlegung, bis der Werfer verwertbare Informationen zeigt.'),
      G('Begin half a step farther from the post and keep the same reading sequence', 'Počni pola koraka dalje od stative i zadrži isti redoslijed čitanja', 'Einen halben Schritt weiter vom Pfosten beginnen und dieselbe Lesefolge beibehalten', 'The position may help, but early commitment can still reopen the angle.', 'Položaj može pomoći, ali prerana odluka ponovno otvara kut.', 'Die Position kann helfen, doch frühe Festlegung öffnet den Winkel erneut.'),
      R('Alternate the starting position on every wing shot so the shooter cannot predict it', 'Mijenjaj početni položaj pri svakom šutu s krila kako ga šuter ne bi predvidio', 'Bei jedem Flügelwurf die Ausgangsposition wechseln, damit der Werfer sie nicht vorhersieht', 'Variation without a stable read makes the goalkeeper less repeatable.', 'Promjena bez stabilnog čitanja čini vratara manje pouzdanim.', 'Variation ohne stabiles Lesen macht den Torwart weniger wiederholbar.'),
      P('Ask the goalkeeper to choose the corner in advance from where this shooter usually scores', 'Traži od vratara da unaprijed odabere kut prema tome gdje taj šuter obično zabija', 'Torwart soll die Ecke im Voraus danach wählen, wo dieser Werfer gewöhnlich trifft', 'Past tendency cannot replace the live take-off and ball cues.', 'Ranija navika šutera ne može zamijeniti čitanje odraza i položaja lopte.', 'Eine frühere Tendenz ersetzt nicht die Hinweise aus Absprung und Ballposition.'),
    ],
    explanation: L('Wing-shot development should train the goalkeeper to hold the angle and commit from live information, not from an early guess.', 'Razvoj obrane krilnog šuta treba učiti vratara da zadrži kut i reagira na ono što vidi u trenutku šuta, a ne da prerano pogađa.', 'Die Entwicklung gegen Flügelwürfe soll das Halten des Winkels und die Reaktion auf aktuelle Informationen lehren, nicht frühes Raten.'),
  }),
  S({
    familyKey: 'analysis_defence_switch_trigger',
    situation: L(
      'Across three matches, the opponent starts in 5:1 after scoring but drops into 6:0 after a save or technical error. You have 90 seconds for the pre-match briefing.',
      'U tri utakmice protivnik nakon postignutog pogotka postavlja 5:1, a nakon obrane vratara ili tehničke pogreške povlači se u 6:0. Za uputu prije utakmice imaš 90 sekundi.',
      'In drei Spielen stellt der Gegner nach eigenem Tor auf 5:1, nach Parade oder technischem Fehler fällt er ins 6:0 zurück. Du hast 90 Sekunden für die Spielbesprechung.',
    ),
    question: L('What should the briefing contain?', 'Što treba sadržavati uputa?', 'Was gehört in die Besprechung?'),
    answers: [
      O('Name the trigger, give one first-pass solution against 5:1, and one spacing rule against 6:0', 'Imenuj okidač, daj jedno rješenje prvog dodavanja protiv 5:1 i jedno pravilo rasporeda protiv 6:0', 'Auslöser benennen, eine Erstpasslösung gegen 5:1 und eine Abstandsregel gegen 6:0 geben', 'Players can identify the defence before the first pass and apply a prepared rule.', 'Igrači mogu prepoznati obranu prije prvog dodavanja i primijeniti pripremljeno pravilo.', 'Die Spieler erkennen die Abwehr vor dem ersten Pass und wenden eine vorbereitete Regel an.'),
      G('Prepare one set play for each defence without naming when the switch occurs', 'Pripremi jednu akciju za svaku obranu, ali bez objašnjenja kada se obrana mijenja', 'Je eine Aktion gegen beide Abwehrformen vorbereiten, ohne den Wechselzeitpunkt zu benennen', 'The actions help only if players recognize which one is active.', 'Akcije pomažu samo ako igrači prepoznaju koju trebaju koristiti.', 'Die Aktionen helfen nur, wenn die Spieler erkennen, welche gerade gilt.'),
      R('List every observed defender tendency from the three videos', 'Nabroji svaku uočenu naviku braniča iz sve tri snimke', 'Jede beobachtete Verteidigergewohnheit aus allen drei Videos aufzählen', 'Too much detail hides the reliable team-level trigger.', 'Previše detalja skriva pouzdan okidač na razini cijele ekipe.', 'Zu viele Details verdecken den verlässlichen Mannschaftsauslöser.'),
      P('Describe the opponent simply as aggressive and let the players adapt', 'Opiši protivnika samo kao agresivnog i prepusti igračima prilagodbu', 'Gegner nur als aggressiv beschreiben und die Spieler selbst anpassen lassen', 'The description gives no observable rule for the first decision.', 'Opis ne daje vidljivo pravilo za prvu odluku.', 'Die Beschreibung liefert keine beobachtbare Regel für die erste Entscheidung.'),
    ],
    explanation: L('Useful opponent analysis converts a repeated trigger into one immediate action for each expected structure.', 'Korisna analiza protivnika pretvara ponavljajući okidač u jednu trenutačnu radnju za svaku očekivanu strukturu.', 'Nützliche Gegneranalyse übersetzt einen wiederkehrenden Auslöser in eine sofortige Handlung für jede erwartete Struktur.'),
  }),
  S({
    familyKey: 'analysis_left_handed_right_back_pattern',
    situation: L(
      'The opponent’s left-handed right back scores mainly after a parallel run with the centre back. The shot comes when your left half-defender turns the chest toward the pivot.',
      'Protivnički ljevoruki desni vanjski najčešće zabija nakon paralelnog kretanja sa srednjim vanjskim. Šut dolazi kada vaš lijevi polubranitelj okrene prsa prema pivotu.',
      'Der linkshändige Rückraum rechts trifft meist nach parallelem Lauf mit Rückraummitte. Der Wurf kommt, sobald euer linker Halbverteidiger die Brust zum Kreisläufer dreht.',
    ),
    question: L('What is the most useful analytical conclusion?', 'Koji je najkorisniji zaključak analize?', 'Welche Analysefolgerung ist am nützlichsten?'),
    answers: [
      O('The trigger is the half-defender’s inward turn: keep the chest on the back, pass pivot responsibility inside, and contest before the left-hand release', 'Okidač je unutarnje okretanje polubranitelja: zadrži prsa prema vanjskom, predaj pivota središnjem braniču i izađi prije izbačaja lijevom rukom', 'Auslöser ist das Einwärtsdrehen des Halbverteidigers: Brust zum Rückraum halten, Kreisläufer innen übergeben und vor der linkshändigen Abgabe stören', 'It links the repeated scoring action to one visible defensive error and one response.', 'Povezuje ponavljajuću akciju s jednom vidljivom obrambenom pogreškom i odgovorom.', 'Verbindet die wiederkehrende Toraktion mit einem sichtbaren Abwehrfehler und einer Antwort.'),
      G('Tell the goalkeeper that the shooter prefers the far corner after the parallel run', 'Reci vrataru da šuter nakon paralelnog kretanja najčešće gađa dalji kut', 'Torwart mitteilen, dass der Werfer nach dem parallelen Lauf die lange Ecke bevorzugt', 'The tendency can help, but the defence still allows an uncontested release.', 'Navika može pomoći, ali obrana i dalje dopušta neometan izbačaj.', 'Die Tendenz kann helfen, doch die Abwehr erlaubt weiter eine freie Abgabe.'),
      R('Change the entire defence to man-to-man coverage on the right back', 'Promijeni cijelu obranu u igru čovjek-na-čovjeka na desnom vanjskom', 'Gesamte Abwehr auf Manndeckung gegen Rückraum rechts umstellen', 'A full structural change is larger than the identified half-defender error.', 'Potpuna promjena sustava veća je od utvrđene pogreške polubranitelja.', 'Eine vollständige Systemänderung ist größer als der erkannte Fehler des Halbverteidigers.'),
      P('Treat the action like the same movement by a right-handed right back', 'Tretiraj akciju jednako kao kretanje desnorukog desnog vanjskog', 'Aktion genauso behandeln wie bei einem rechtshändigen Rückraum rechts', 'The release side and angle are central to why the current body orientation fails.', 'Strana izbačaja i kut ključni su zašto sadašnji položaj tijela ne uspijeva.', 'Abgabeseite und Winkel erklären gerade, warum die aktuelle Körperstellung scheitert.'),
    ],
    explanation: L('Opponent analysis is valuable when it identifies the repeatable cue that precedes the action, not only the final shot location.', 'Analiza protivnika vrijedi kada prepozna ponovljivi znak prije akcije, a ne samo mjesto završnog šuta.', 'Gegneranalyse ist wertvoll, wenn sie den wiederkehrenden Hinweis vor der Aktion erkennt, nicht nur die spätere Wurfposition.'),
  }),
  S({
    familyKey: 'leadership_bench_argument',
    situation: L(
      'Two starters argue loudly on the bench after a substitution. One blames the other for a missed switch, and younger players are watching.',
      'Dva igrača početne postave glasno se svađaju na klupi nakon zamjene. Međusobno se okrivljuju za propušteno preuzimanje, a mlađi igrači sve gledaju.',
      'Zwei Stammspieler streiten nach einem Wechsel laut auf der Bank. Einer gibt dem anderen die Schuld für eine verpasste Übergabe, jüngere Spieler schauen zu.',
    ),
    question: L('What is the best immediate leadership response?', 'Koji je najbolji neposredni odgovor trenera?', 'Was ist die beste unmittelbare Führungsreaktion?'),
    answers: [
      O('Stop the argument, restate the bench standard in one sentence, separate the players, and schedule a private tactical review after the match', 'Zaustavi svađu, jednom rečenicom ponovi pravilo ponašanja na klupi, razdvoji igrače i dogovori nasamo taktički razgovor nakon utakmice', 'Streit stoppen, den Bankstandard in einem Satz benennen, Spieler trennen und nach dem Spiel eine persönliche taktische Klärung ansetzen', 'It protects the team publicly and reserves the detailed disagreement for a calmer setting.', 'Javno štiti ekipu, a detaljan spor ostavlja za mirniji razgovor.', 'Schützt die Mannschaft öffentlich und verlegt die Detailklärung in einen ruhigeren Rahmen.'),
      G('Separate the players now and address the standard with each one individually at half-time', 'Sada razdvoji igrače i na poluvremenu svakome pojedinačno objasni pravilo ponašanja', 'Spieler jetzt trennen und den Standard in der Halbzeit mit jedem einzeln klären', 'The conflict stops, but the rest of the bench does not hear the shared standard.', 'Sukob prestaje, ali ostatak klupe ne čuje zajedničko pravilo.', 'Der Streit endet, doch die Bank hört den gemeinsamen Standard nicht.'),
      R('Let the captain decide which player is right so play can continue', 'Prepusti kapetanu da odluči koji je igrač u pravu kako bi se igra nastavila', 'Kapitän entscheiden lassen, welcher Spieler recht hat, damit das Spiel weitergeht', 'It turns a behaviour standard into a public contest over status.', 'Pretvara pravilo ponašanja u javno nadmetanje za status.', 'Macht aus einem Verhaltensstandard einen öffentlichen Statuskampf.'),
      P('Join the tactical argument and correct one player in front of the whole bench', 'Uključi se u taktičku svađu i pred cijelom klupom ispravljaj jednog igrača', 'In den Taktikstreit einsteigen und einen Spieler vor der gesamten Bank korrigieren', 'The coach escalates the spectacle instead of restoring the team standard.', 'Trener pojačava predstavu umjesto da vrati pravilo ekipe.', 'Der Trainer verschärft die Szene, statt den Mannschaftsstandard wiederherzustellen.'),
    ],
    explanation: L('Leadership under match pressure protects the shared standard immediately and resolves personal or tactical conflict in private.', 'Vodstvo pod pritiskom utakmice odmah štiti zajedničko pravilo, a osobni ili taktički sukob rješava nasamo.', 'Führung unter Spieldruck schützt sofort den gemeinsamen Standard und klärt persönliche oder taktische Konflikte vertraulich.'),
  }),
  S({
    familyKey: 'leadership_align_assistant_message',
    situation: L(
      'During a timeout, the assistant tells the left back to attack immediately while the head coach asks the team to hold the ball for the final shot. Players look between both coaches.',
      'Tijekom minute odmora pomoćni trener traži od lijevog vanjskog da odmah napadne, dok glavni trener traži da ekipa čuva loptu za posljednji šut. Igrači gledaju čas jednoga, čas drugoga.',
      'Während der Auszeit fordert der Assistenztrainer Rückraum links zum sofortigen Angriff auf, während der Cheftrainer den letzten Wurf ausspielen lassen will. Die Spieler schauen zwischen beiden Trainern hin und her.',
    ),
    question: L('How should the coaching staff respond?', 'Kako treba reagirati stručni stožer?', 'Wie sollte das Trainerteam reagieren?'),
    answers: [
      O('The head coach names the final decision immediately; the assistant reinforces it, and both review the disagreement privately after the match', 'Glavni trener odmah jasno kaže konačnu odluku, pomoćni je potvrdi, a neslaganje poslije utakmice razjasne nasamo', 'Cheftrainer nennt sofort die endgültige Entscheidung, der Assistent verstärkt sie, und beide klären die Abweichung nach dem Spiel vertraulich', 'Players receive one message now without silencing later staff learning.', 'Igrači odmah dobivaju jednu poruku, a stožer poslije može učiti iz neslaganja.', 'Die Spieler erhalten jetzt eine Botschaft, ohne die spätere gemeinsame Auswertung zu verhindern.'),
      G('The assistant steps back and lets the head coach finish, then asks for a short clarification before the next timeout', 'Pomoćni trener se povuče i pusti glavnog da završi, zatim prije sljedeće minute odmora zatraži kratko pojašnjenje', 'Assistent tritt zurück, lässt den Cheftrainer abschließen und bittet vor der nächsten Auszeit um kurze Klärung', 'This restores one voice, though the players do not hear explicit alignment.', 'Vraća jednu poruku, ali igrači ne čuju izričitu potvrdu zajedništva.', 'Stellt eine Stimme her, doch die Spieler hören keine ausdrückliche Abstimmung.'),
      R('Pause the timeout so both coaches can debate which option is tactically stronger', 'Zaustavi uputu kako bi oba trenera raspravila koja je mogućnost taktički bolja', 'Auszeit unterbrechen, damit beide Trainer diskutieren, welche Option taktisch besser ist', 'The team loses time and confidence while the staff solves its own process.', 'Ekipa gubi vrijeme i sigurnost dok stožer rješava vlastiti postupak.', 'Die Mannschaft verliert Zeit und Sicherheit, während der Stab seinen Prozess klärt.'),
      P('Have each coach instruct a different side of the attack and let the players choose', 'Neka svaki trener vodi jednu stranu napada, a igrači neka sami izaberu uputu', 'Jeder Trainer weist eine Angriffsseite an, die Spieler sollen selbst wählen', 'Competing commands make the final possession slower and less accountable.', 'Suprotne upute usporavaju posljednji napad i brišu odgovornost.', 'Widersprüchliche Anweisungen verlangsamen den letzten Angriff und verwischen Verantwortung.'),
    ],
    explanation: L('A coaching staff can disagree, but players need one accountable decision in the moment and a private staff review later.', 'Stručni stožer može imati različita mišljenja, ali igrači u tom trenutku trebaju jednu jasnu odluku, a stožer poslije razgovor nasamo.', 'Ein Trainerteam darf unterschiedlicher Meinung sein, doch die Spieler brauchen im Moment eine verantwortete Entscheidung und der Stab später eine vertrauliche Klärung.'),
  }),
];
