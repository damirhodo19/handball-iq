# Goalkeeper Gold — završnih 25, hrvatski pregled

**25 scenarija**

## 1. Vratar — kod završnog slobodnog bacanja prvo organiziraj blok, zatim liniju pogleda

- Family: `gk_direct_free_throw_wall`

**Situacija:** Vrijeme je isteklo pri 30:30, a suparnik ima izravno slobodno bacanje iz sredine. Tvoji su braniči na dopuštenoj udaljenosti, ali oba krajnja igrača u bloku gledaju prema unutra i širina bloka još nije dogovorena.

**Pitanje:** Što mora biti dogovoreno prije tvog završnog postavljanja?

A. **optimal** — Dogovori širinu bloka i tko zatvara putanju uz svako vanjsko rame, primi potvrdu, zatim se postavi prema konačnim otvorima
   - Točno — oblik bloka mora biti stabilan prije nego što tvoja linija pogleda postane pouzdana.
B. **good** — Vrati se prema sredini ako se blok promijeni nakon prvog poziva
   - Dobro — promijenjen blok poništava početne otvore.
C. **risky** — Odaberi jedan vidljiv otvor dok odgovornost krajnjih igrača još nije jasna
   - Rizično — blok se može pomaknuti i pri izbačaju otvoriti drugu putanju.
D. **poor** — Stani duboko u sredinu i ostavi obje vanjske putanje bez odgovornosti
   - Loše — ni blok ni vratar ne preuzimaju putanje oko bloka.

**Objašnjenje:** Kod završnog slobodnog bacanja komunikacija najprije oblikuje blok. Položaj vratara zatim prati potvrđenu širinu, dogovor uz vanjska ramena i vidljive otvore za izbačaj.

**Zašto A prije B:** A dovršava blok koji sada nije organiziran; B vrijedi samo ako se potvrđeni blok naknadno promijeni.

## 2. Vratar — iza obrane 3-2-1 kontroliraj prostor iza visokih braniča

- Family: `gk_321_lob_space_depth`

**Situacija:** Gubite 11:12 u 23. minuti u obrani 3-2-1. Prednji središnji branič pritišće na deset metara. Igrač s loptom, još na dvanaest metara i bez izravne pozicije za šut, podiže mekano dodavanje u prazan prostor iza njega. Primatelj je udaljen dva koraka.

**Pitanje:** Kako koristiš dubinu položaja iza visoke obrane?

A. **optimal** — Izađi unutar vratareva prostora prema lopti i osiguraj je prije dolaska primatelja
   - Točno — putanja dodavanja, udaljenost i prazan prostor daju ti jasnu prednost do lopte.
B. **good** — Zadrži dubinu ako je dodavanje dovoljno brzo da primatelj prvi stigne do lopte
   - Dobro — ne ulazi u mogući sudar kada nemaš prednost do lopte.
C. **risky** — Ostani na gol-liniji iako lopta pada u prazan prostor
   - Rizično — primatelju daješ vrijeme za kontroliran završetak iz blizine.
D. **poor** — Izađi prema primatelju umjesto prema mjestu pada lopte
   - Loše — napuštaš putanju lopte i povećavaš opasnost od nedopuštenog kontakta.

**Objašnjenje:** Visoka obrana ostavlja prostor iza sebe. Vratar ga kontrolira kada putanja i udaljenost jasno daju prednost vrataru, ali ostaje u položaju ako napadač prvi stiže.

**Zašto A prije B:** A odgovara mekanom dodavanju i primatelju udaljenom dva koraka; B vrijedi za brže dodavanje pri kojem napadač prvi stiže.

## 3. Vratar — iza obrane 3-3 iskoristi dugi put prodora za pravodobno postavljanje

- Family: `gk_33_breakthrough_depth`

**Situacija:** Neriješeno je 15:15 u 31. minuti u obrani 3-3. Srednji vanjski prolazi pored prednjeg braniča na deset metara. Kontrolira loptu, ali trebaju mu još dva koraka do završetka. Ostali braniči nisu u njegovoj izravnoj liniji.

**Pitanje:** Kako koristiš dodatnu udaljenost do završetka?

A. **optimal** — Rano napravi jedan kontroliran korak naprijed, zatim se zaustavi prije njegova završnog koraka za šut
   - Točno — smanjuješ vidljivi gol i ostaješ stabilan za reakciju.
B. **good** — Zadrži trenutačnu dubinu ako se branič vrati u liniju šuta
   - Dobro — povratak braniča mijenja potrebu za izlaskom.
C. **risky** — Čekaj na gol-liniji dok napadač ne stigne na šest metara
   - Rizično — ne koristiš vrijeme za smanjenje njegova kuta.
D. **poor** — Nastavi izlaziti kroz njegov završni korak i izbačaj
   - Loše — kretanje u trenutku izbačaja oduzima ti ravnotežu za reakciju.

**Objašnjenje:** Otvorena obrana 3-3 vrataru ranije otkriva prodor. Iskoristi vrijeme za jedan kontroliran korak naprijed, a ne za neprekidno istrčavanje.

**Zašto A prije B:** A odgovara čistom koridoru i dvama preostalim koracima; B vrijedi samo ako se obrambeni pritisak vrati.

## 4. Vratar — u obrani 4-2 pozovi predaju bloka prije nego što ti zakloni pogled

- Family: `gk_42_screen_handover`

**Situacija:** Gubite 17:18 u 35. minuti u obrani 4-2. Tijekom promjene strane pivot prenosi blok s lijevog polubranitelja u desni središnji koridor. Desni branič prati dodavanje i nije vidio blok koji ulazi u tvoju buduću liniju pogleda.

**Pitanje:** Što predaju čini korisnom prije razvoja šuta?

A. **optimal** — Označi blok u kretanju i desnog braniča koji ga mora preuzeti prije dolaska lopte
   - Točno — branič preuzima odgovornost prije nego što blok ukloni tvoj pogled.
B. **good** — Ponavljaj poziv dok desni branič ne potvrdi kontakt
   - Dobro — potvrda dovršava predaju.
C. **risky** — Pozovi samo smjer promjene strane lopte
   - Rizično — blok i dalje nema novog čuvara.
D. **poor** — Čekaj da blok stigne u liniju šuta pa tek tada označi braniča koji ga preuzima
   - Loše — poziv dolazi tek nakon što su pogled i obrambena predaja već narušeni.

**Objašnjenje:** U obrani 4-2 blokovi prelaze iz jedne odgovornosti u drugu. Vratar vidi cijelo kretanje i treba označiti i blok i braniča koji ga preuzima.

**Zašto A prije B:** A sada dodjeljuje novu odgovornost; B slijedi dok preuzimanje ne bude potvrđeno.

## 5. Vratar — iza otvorene obrane izađi na loptu samo kada sigurno stižeš prvi

- Family: `gk_open_defence_sweep_position`

**Situacija:** Neriješeno je 20:20 u 40. minuti u otvorenoj obrani 3-3. Dodavanje kroz sredinu ostaje slobodno neposredno izvan crte vratareva prostora. Imaš čist put i stižeš u dva koraka; najbližem napadaču trebaju barem još tri i nije na putanji sudara.

**Pitanje:** Kada je izlazak na slobodnu loptu opravdan?

A. **optimal** — Izađi iz vratareva prostora bez lopte, prvi odigraj slobodnu loptu i sigurno je usmjeri dalje
   - Točno — imaš jasnu prednost do lopte i nema opasnosti od sudara.
B. **good** — Ostani u prostoru ako napadač ubrza i može istodobno stići do lopte
   - Dobro — istodoban dolazak uklanja siguran trenutak za izlazak.
C. **risky** — Čekaj na gol-liniji iako sigurno prvi stižeš do slobodne lopte
   - Rizično — napadač može uzeti loptu i stvoriti završetak iz blizine.
D. **poor** — Kreni na putanju napadača umjesto na loptu
   - Loše — vratar mora igrati loptu bez ugrožavanja napadača.

**Objašnjenje:** Izlazak iza otvorene obrane odluka je prema lopti, a ne prema sudaru. Izađi samo uz jasnu prednost do lopte i sigurnu putanju.

**Zašto A prije B:** A odgovara jasnoj prednosti do lopte; B vrijedi ako ubrzanje napadača ukloni tu prednost.

## 6. Vratar — nakon kontakta u bloku prvo vrati pogled na loptu

- Family: `gk_block_contact_visibility`

**Situacija:** Gubite 13:14 u 27. minuti. Desni vanjski skače u dopušten kontakt s blokom na devet metara. Lopta ostaje pod kontrolom iznad ramena, ali trup središnjeg braniča nakratko skriva ruku izbačaja. Šut je i dalje moguć.

**Pitanje:** Koja je prva prilagodba vratara?

A. **optimal** — Malim pomakom stopala i glave ponovno pronađi loptu, uz zadržanu ravnotežu
   - Točno — ponovno pronalaženje lopte koja je još pod kontrolom šutera prethodi odluci o kutu.
B. **good** — Ostani na postojećoj liniji ako branič odmah oslobodi pogled na izbačaj
   - Dobro — nakon povratka pogleda nije potreban dodatni pomak.
C. **risky** — Pretpostavi da će kontakt usmjeriti loptu u dalji kut
   - Rizično — kontakt nije uklonio kontrolu lopte ni drugu mogućnost završetka.
D. **poor** — Ostani nepomičan iza istog dijela bloka i čekaj da se lopta ponovno pojavi
   - Loše — čekanjem zadržavaš slijepu točku umjesto da aktivno vratiš pogled na loptu.

**Objašnjenje:** Kontakt s blokom može promijeniti zaklanjanje bez uklanjanja šuta. Najmanjim stabilnim pomakom ponovno pronađi loptu, zatim čitaj izbačaj.

**Zašto A prije B:** A odgovara trenutačno skrivenoj ruci izbačaja; B vrijedi tek nakon što branič oslobodi pogled.

## 7. Vratar — nakon odbijanja brani novu putanju lopte

- Family: `gk_deflection_read`

**Situacija:** Neriješeno je 23:23 u 46. minuti. Šut vanjskog igrača kreće prema tvom visokom daljem kutu. Vidljivo dodiruje vanjsku ruku bloka, gubi brzinu i pada prema sredini. Prenio si težinu na nogu za odraz prema početnom kutu, ali još nisi napustio pod.

**Pitanje:** Kako reagiraš na promijenjenu putanju?

A. **optimal** — Prekini puni odraz prema kutu, postavi ruke na novu središnju putanju i ostani iznad stopala
   - Točno — odbijena lopta, a ne početni šut, sada je cilj obrane.
B. **good** — Dovrši početni pokret prema kutu samo ako dodir ne promijeni putanju
   - Dobro — dodir bez promjene putanje ne zahtijeva novu obranu.
C. **risky** — Nastavi puni pokret prema početnom daljem kutu i nakon što vidiš pad prema sredini
   - Rizično — tijelo napušta novu putanju lopte.
D. **poor** — Povuci obje ruke uz tijelo i osloni se samo na trup za obranu padajuće lopte
   - Loše — nova je putanja vidljiva i zahtijeva aktivan pokret ruku.

**Objašnjenje:** Dodir bloka može poništiti početni plan obrane. Ostani prilagodljiv dok putanja ne postane jasna i usmjeri najbliži dio tijela prema novoj lopti.

**Zašto A prije B:** A odgovara vidljivom padu prema sredini; B vrijedi samo za dodir koji ne mijenja putanju.

## 8. Vratar — kod predaje pivota označi oba igrača

- Family: `gk_pivot_handover_call`

**Situacija:** Vodite 15:14 u 30. minuti. Dok lopta ide slijeva nadesno, pivot se iza središnjeg para kreće u suprotnom smjeru. Lijevi središnji branič ga predaje, a desni još prati loptu.

**Pitanje:** Kako predaju činiš nedvosmislenom?

A. **optimal** — Pozovi braniča koji predaje, braniča koji preuzima i pivota dok novi kontakt ne bude potvrđen
   - Točno — poziv označava opasnost u kretanju i obje odgovornosti.
B. **good** — Nakon potvrde braniča koji predaje ponavljaj samo ime braniča koji preuzima
   - Dobro — pažnja se tada usmjerava na dovršavanje novog kontakta.
C. **risky** — Pozovi samo smjer u kojem se pivot kreće
   - Rizično — smjer ne određuje novog čuvara.
D. **poor** — Pretpostavi da će branič koji preuzima sam vidjeti pivota
   - Loše — njegova je pažnja trenutačno na lopti.

**Objašnjenje:** Poziv kod predaje treba opisati odgovornost, a ne samo kretanje. Označi braniča koji predaje i onoga koji preuzima dok kontakt ne potvrdi prijenos.

**Zašto A prije B:** A pokreće trenutačno nepotvrđenu predaju; B postaje dovoljan nakon potvrde strane koja predaje.

## 9. Vratar — upozori braniča slabije strane prije dolaska promjene strane

- Family: `gk_weak_side_wing_early_call`

**Situacija:** Gubite 18:19 u 37. minuti. Lopta je lijevo. Na slabijoj strani desno krilo ostaje visoko i široko, dok se tvoj krilni branič suzio prema pivotu i gleda prema unutra. Srednji vanjski priprema brzu promjenu strane.

**Pitanje:** Što rani poziv mora postići?

A. **optimal** — Označi krilo slabije strane i njegova braniča prije promjene strane, zatim potvrdi braničev povratak prema van
   - Točno — branič dobiva informaciju prije nego dodavanje uđe na njegovu slijepu stranu.
B. **good** — Skrati poziv ako se branič već okrenuo i pronašao krilo
   - Dobro — vizualna potvrda smanjuje potrebu za ponavljanjem cijelog poziva.
C. **risky** — Čekaj da krilo primi promjenu strane prije poziva
   - Rizično — branič se vraća tek nakon otvaranja kuta za šut.
D. **poor** — Pozovi samo stranu lopte i ne označi krilo na slabijoj strani
   - Loše — skrivena opasnost ne dobiva čuvara.

**Objašnjenje:** Vratar vidi i loptu i raspored na slabijoj strani. Rani poziv s imenima daje krilnom braniču vrijeme za povratak u širinu prije dolaska lopte.

**Zašto A prije B:** A odgovara braniču koji još gleda unutra; B vrijedi nakon što je već pronašao krilo.

## 10. Vratar — nakon izgubljene lopte prvo organiziraj sredinu

- Family: `gk_transition_middle_organise`

**Situacija:** Neriješeno je 22:22 u 45. minuti. Tvoja momčad gubi loptu blizu središnje crte. Suparnik je kontrolira u sredini, jedan igrač napada izravni središnji koridor, a dva trkača šire se prema krilima. Tvoji se braniči vraćaju različitim brzinama.

**Pitanje:** Koji je prvi koristan organizacijski poziv?

A. **optimal** — Pozovi zatvaranje sredine i imenuj najbližeg braniča odgovornog za izravnog trkača
   - Točno — najkraća putanja prema golu prva dobiva odgovornog braniča.
B. **good** — Zatim odredi tko preuzima trkače u širini, nakon potvrde da je sredina zatvorena
   - Dobro — odgovornost za širinu slijedi nakon prvog središnjeg prioriteta.
C. **risky** — Označi oba široka trkača prije nego itko preuzme sredinu
   - Rizično — izravni trkač ostaje na najkraćoj putanji.
D. **poor** — Daj opće upozorenje bez imenovanja braniča ili koridora
   - Loše — hitnost bez odgovornosti ne organizira povratak.

**Objašnjenje:** U tranziciji komunikacija prati opasnost za gol: prvo središnja lopta i izravni trkač, zatim široki igrači. Imena pretvaraju upozorenja u odgovornosti.

**Zašto A prije B:** A rješava trenutačno nepokriven središnji put; B je sljedeći poziv nakon potvrde sredine.

## 11. Vratar — s igračem manje prvo zaštiti sredinu, zatim širinu

- Family: `gk_5v6_compact_priority`

**Situacija:** Gubite 24:25 u 50. minuti i branite pet na šest. Napad drži oba krila široko, a pivota u sredini. Dvojica središnjih braniča počinju se razdvajati prema krilima, pa pivot ostaje bez kontakta i otvara se izravna središnja linija dodavanja.

**Pitanje:** Što vratar prvo mora vratiti?

A. **optimal** — Pozovi središnje braniče da se zbiju prema pivotu i središnjoj liniji dodavanja
   - Točno — prvo se kontrolira najbliži i najopasniji završetak.
B. **good** — Zatim se zajedno pomaknite prema strani lopte, uz zadržanu središnju pomoć sa slabije strane
   - Dobro — širina se brani bez ponovnog otvaranja sredine.
C. **risky** — Pošalji oba središnja braniča potpuno prema dvama krilima
   - Rizično — pivot i središnje dodavanje ostaju bez pritiska.
D. **poor** — Ostavi svakog braniča izoliranog bez zajedničkog prioriteta kompaktnosti
   - Loše — brojčani manjak pretvara se u niz nepovoljnih situacija jedan na jedan.

**Objašnjenje:** Pet braniča ne može zatvoriti svako dodavanje. Najprije zaštiti sredinu i pivota, zatim se kao cjelina pomiči prema širini uz zadržanu pomoć.

**Zašto A prije B:** A popravlja trenutačno otvorenu središnju opasnost; B je sljedeći zajednički pomak nakon povratka kompaktnosti.

## 12. Vratar — nakon izgubljene lopte dovrši zamjenu prije ulaska

- Family: `gk_empty_goal_substitution_call`

**Situacija:** Neriješeno je 27:27 u 54. minuti. Tvoja momčad napada sedam na šest bez vratara i gubi loptu. Spreman si kod linije za zamjene, ali dodatni igrač još je dva koraka unutar terena, a suparnik kontrolira loptu.

**Pitanje:** Kako povratak činiš brzim i dopuštenim?

A. **optimal** — Pozovi igrača koji izlazi imenom, pogledom potvrdi da je prešao liniju, zatim uđi kroz prostor za zamjene
   - Točno — jasna komunikacija čuva i brzinu i pravilan redoslijed zamjene.
B. **good** — Ostani spreman i ponovi poziv ako igrač odmah ne reagira
   - Dobro — zadržavaš hitnost bez preranog ulaska.
C. **risky** — Zakorači na teren dok dodatni igrač još izlazi
   - Rizično — preklapanje može dovesti do nepravilne zamjene.
D. **poor** — Šutke čekaj i pretpostavi da će netko drugi organizirati izlazak
   - Loše — prazan gol ostaje izložen bez jasno zadane radnje.

**Objašnjenje:** Nakon izgubljene lopte pri igri bez vratara vratar preuzima komunikaciju zamjene: imenuje igrača koji izlazi, potvrđuje prelazak linije, zatim ulazi.

**Zašto A prije B:** A dovršava trenutačno nezavršen izlazak; B je nastavak ako prvi poziv nije uspio.

## 13. Vratar — osiguraj obranu prije početka dodavanja

- Family: `gk_save_secure_before_outlet`

**Situacija:** Vodite 9:8 u 18. minuti. Snažan niski šut zaustavljaš između bedra i podlaktice, ali lopta se još pomiče. Lijevo krilo već je krenulo u prvi val i djeluje slobodno. Jednim sigurnim pokretom ruku možeš potpuno kontrolirati loptu.

**Pitanje:** Što prethodi dodavanju u kontranapad?

A. **optimal** — Potpuno osiguraj loptu objema rukama, zatim podigni pogled i potvrdi liniju dodavanja
   - Točno — posjed mora biti siguran prije početka tranzicije.
B. **good** — Brzo dodaj ako lopta postane sigurna, a koridor prema krilu ostane otvoren
   - Dobro — brzina slijedi nakon kontrole i potvrđenog koridora.
C. **risky** — Započni pokret dodavanja dok je lopta još stisnuta i pomiče se
   - Rizično — dodavanje može odmah postati izgubljena lopta.
D. **poor** — Jednom rukom gurni nesigurnu loptu prema krilu u trku
   - Loše — ne kontroliraš ni posjed ni smjer dodavanja.

**Objašnjenje:** Najbrže korisno dodavanje počinje nakon osigurane obrane. Jedan dodatni pokret kontrole brži je od gubitka lopte i neposrednog povratnog napada.

**Zašto A prije B:** A odgovara lopti koja se još pomiče; B počinje tek nakon potvrde kontrole i otvorenog koridora.

## 14. Vratar — kada je prvi val zatvoren, pronađi sredinu drugog vala

- Family: `gk_second_wave_centre_outlet`

**Situacija:** Neriješeno je 16:16 u 32. minuti. Čisto hvataš šut. Oba krila rano su krenula, ali njihovi su ih braniči ispratili. Tvoj srednji vanjski ulazi u otvoreni središnji koridor iza prve linije suparničkog povratka, s pripremljenim rukama i bez suparnika u liniji dodavanja.

**Pitanje:** Koje dodavanje zadržava tranziciju?

A. **optimal** — Čvrsto dodaj u putanju srednjeg vanjskog u otvorenom središnjem koridoru
   - Točno — drugi val prima loptu u brzini i sa središnjim mogućnostima nastavka.
B. **good** — Zadrži loptu ako branič koji se vraća zatvori sredinu prije izbačaja
   - Dobro — ne forsiraj dobru ideju kroz zatvoren koridor.
C. **risky** — Forsiraj dugo dodavanje prema krilu koje je branič već ispratio
   - Rizično — branič može omesti prijem ili presjeći dodavanje.
D. **poor** — Čekaj da se cijela obrana postavi prije dodavanja srednjem vanjskom
   - Loše — potvrđena prednost drugog vala nestaje.

**Objašnjenje:** Distribucija prelazi iz prvog u drugi val; ne završava kada su krila zatvorena. Središnji trkač sljedeća je potvrđena prednost.

**Zašto A prije B:** A koristi trenutačno otvorenu sredinu; B vrijedi samo ako se koridor zatvori prije dodavanja.

## 15. Vratar — protiv protupresinga dodaj iza prvog igrača pritiska

- Family: `gk_outlet_against_counterpress`

**Situacija:** Gubite 19:20 u 39. minuti. Nakon tvoje obrane dva suparnika ostaju visoko i zatvaraju oba dodavanja prema krilima. Tvoj srednji vanjski spušta se prema tebi u kratak središnji prostor iza prvog igrača pritiska, pokazuje obje ruke i ima čistu liniju dodavanja.

**Pitanje:** Kako izlaziš iz prve linije pritiska?

A. **optimal** — Odigraj čvrsto kratko dodavanje srednjem vanjskom iza prvog igrača pritiska, zatim podrži sljedeće dodavanje
   - Točno — kratki primatelj uklanja prvi pritisak bez rizičnog dodavanja prema zatvorenom krilu.
B. **good** — Zadrži posjed ako se središnji igrač pritiska povuče i zatvori primatelja
   - Dobro — izlazak iz pritiska mora koristiti koridor koji je ostao otvoren.
C. **risky** — Baci dugo prema krilu koje je već zatvoreno uz uzdužnu liniju
   - Rizično — primatelj ima malo prostora i pritisak iz dvaju smjerova.
D. **poor** — Pošalji sporo visoko dodavanje preko prvog igrača pritiska
   - Loše — dugo vrijeme leta dopušta drugom igraču pritiska da napadne primatelja.

**Objašnjenje:** Protiv protupresinga vratar traži slobodnog igrača iza prve linije pritiska. Čvrsto kratko dodavanje sigurnije je i brže od forsiranja dugog dodavanja prema pokrivenom igraču.

**Zašto A prije B:** A koristi trenutačno slobodan središnji prostor; B vrijedi samo ako ga igrač pritiska zatvori prije izbačaja.

## 16. Vratar — nakon primljenog gola brzo predaj loptu izvođaču početnog bacanja

- Family: `gk_quick_centre_after_goal`

**Situacija:** Gubite 16:18 u 34. minuti nakon primljenog gola. U natjecanju se početno bacanje izvodi iz prostora za početno bacanje. Dogovoreni izvođač već ulazi u taj prostor s pripremljenim rukama, a središnja linija dodavanja iz tvog gola je čista.

**Pitanje:** Kako podržavaš brzo početno bacanje?

A. **optimal** — Odmah uzmi loptu i čvrsto je dodaj u visini prsa dogovorenom izvođaču
   - Točno — izvođač prima kontroliranu loptu bez gubitka vremena za nastavak.
B. **good** — Upotrijebi sigurnije kraće dodavanje ako suparnik uđe u izravni središnji koridor
   - Dobro — brzina vrijedi samo kroz koridor koji je ostao otvoren.
C. **risky** — Polako zakotrljaj loptu i prisili izvođača da je čeka
   - Rizično — nastavak gubi pravodobnost, a obrana se može organizirati.
D. **poor** — Baci prema sredini prije nego što potvrdiš dogovorenog primatelja
   - Loše — i brzo početno bacanje zahtijeva jasnog primatelja.

**Objašnjenje:** Nakon gola vratar podržava tranziciju tako što brzo uzima loptu i kontrolirano je predaje dogovorenom izvođaču. Brzo ne znači bez jasnog primatelja.

**Zašto A prije B:** A odgovara trenutačno čistom središnjem koridoru; B vrijedi samo ako ga suparnik zatvori.

## 17. Vratar — prazan gol napadni samo kroz potpuno potvrđenu putanju

- Family: `gk_empty_goal_long_throw`

**Situacija:** Gubite 23:24 u 47. minuti. Čisto hvataš šut dok suparnik igra bez vratara. Njihov je gol potpuno vidljiv. Svi igrači koji se vraćaju izvan su izravne središnje putanje, a tvoja su stopala u ravnoteži.

**Pitanje:** Kada je izravno dugo bacanje najbolji izbor?

A. **optimal** — Postavi stopala, posljednji put potvrdi putanju i baci izravno prema sredini praznog gola
   - Točno — siguran posjed, ravnoteža i potpuno otvorena putanja opravdavaju izravni pokušaj.
B. **good** — Odustani od bacanja ako igrač prije izbačaja uđe u putanju
   - Dobro — odluka mora ostati valjana sve dok lopta ne napusti ruku.
C. **risky** — Baci bez ravnoteže samo zato što je gol prazan
   - Rizično — neprecizan promašaj predaje posjed i narušava tranziciju.
D. **poor** — Izbaci loptu preko igrača koji se vratio u središnju putanju
   - Loše — prethodno otvorena putanja sada nosi opasnost presijecanja.

**Objašnjenje:** Prazan gol prilika je samo kada su potvrđeni posjed, ravnoteža, vidljivost i putanja lopte. Svaki kasni ulazak igrača poništava pokušaj.

**Zašto A prije B:** A odgovara trenutačno neometanom golu; B je obvezna reakcija ako se putanja promijeni.

## 18. Vratar — pri vodstvu u završnici sigurnim dodavanjem pokreni kontrolirani posjed

- Family: `gk_clock_control_distribution`

**Situacija:** Vodite 28:27 četrdeset sekundi prije kraja i hvataš šut. Nijedan suigrač nema jasnu prednost za kontranapad. Lijevi polubranitelj okreće se prema tebi nepokriven na osam metara s pripremljenim rukama, dok se suparnici vraćaju.

**Pitanje:** Kako obranu pretvaraš u korisnu kontrolu vremena?

A. **optimal** — Pravodobno odigraj sigurno kratko dodavanje i pozovi momčad u kontrolirani posjed
   - Točno — zadržavaš posjed bez nepotrebnog rizika u tranziciji.
B. **good** — Brže dodaj naprijed samo ako se prije izbačaja pojavi potvrđena brojčana prednost
   - Dobro — stvarna prednost može opravdati promjenu tempa.
C. **risky** — Forsiraj dugo dodavanje jer bi novi pogodak odlučio utakmicu
   - Rizično — rezultat više nagrađuje posjed nego nepotvrđenu priliku.
D. **poor** — Odugovlači nastavak u vratarevu prostoru umjesto da koristiš otvoreno kratko dodavanje
   - Loše — vrijeme se kontrolira dopuštenim momčadskim posjedom, a ne odugovlačenjem.

**Objašnjenje:** Distribucija u završnici prati rezultat i stvarnu prednost. Ako nema kontranapada, odigraj sigurno dodavanje i prepusti momčadi kontrolu posjeda.

**Zašto A prije B:** A odgovara trenutačno sigurnom primatelju i izostanku kontranapada; B vrijedi samo ako se pojavi stvarna prednost.

## 19. Vratar — odustani od dodavanja kada se koridor zatvori prije izbačaja

- Family: `gk_bad_outlet_abort`

**Situacija:** Gubite 12:13 u 25. minuti. Nakon osigurane obrane pripremaš dugo dodavanje desnom krilu. Prije nego lopta napusti ruku, branič utrčava u koridor i okreće se prema dodavanju. Srednji vanjski slobodan je na kratkom dodavanju.

**Pitanje:** Koja je ispravna kasna promjena odluke?

A. **optimal** — Prekini pokret dugog dodavanja, ponovno postavi stopala i odigraj sigurnog kratkog primatelja
   - Točno — koridor se promijenio prije izbačaja pa se mora promijeniti i odluka.
B. **good** — Zadrži dugo dodavanje samo ako branič ponovno napusti koridor prije izbačaja
   - Dobro — početna prednost mora se vidljivo vratiti.
C. **risky** — Izvedi početno dodavanje samo zato što je pokret već započeo
   - Rizično — držiš se započetog pokreta i zanemaruješ novu taktičku informaciju.
D. **poor** — Promijeni smjer u istom nestabilnom pokretu dodavanja
   - Loše — i siguran novi primatelj zahtijeva ponovno postavljanje radi preciznosti.

**Objašnjenje:** Odluka o dodavanju otvorena je sve do izbačaja. Ako branič zatvori koridor, kontrolirano odustani, vrati ravnotežu i koristi sljedeću potvrđenu mogućnost.

**Zašto A prije B:** A odgovara trenutačno zatvorenom koridoru i slobodnom kratkom primatelju; B vrijedi samo ako se koridor vidljivo ponovno otvori.

## 20. Vratar — nakon primljenog gola resetiraj se jednim udahom i jednom obrambenom porukom

- Family: `gk_reset_after_concede`

**Situacija:** Gubite 9:11 u 20. minuti. Posljednji pogodak primili ste jer ste ti i središnji branič pokrili istu stranu bez potvrde bloka. Suparnik brzo nastavlja, a isti obrambeni par mora organizirati sljedeći napad.

**Pitanje:** Koji je najbrži koristan reset?

A. **optimal** — Jednom kontrolirano udahni, izgovori dogovor za potvrdu bloka i vrati pogled na loptu
   - Točno — reset pomaže smiriti emocije i ispravlja jedan važan postupak.
B. **good** — Ponovi dogovor kada odgovornost za sljedeći blok postane vidljiva
   - Dobro — ispravak se prenosi u sljedeću stvarnu akciju.
C. **risky** — U glavi ponavljaj svaki detalj primljenog šuta dok sljedeći napad počinje
   - Rizično — analiza odvlači pažnju od trenutačne lopte.
D. **poor** — Zadaj nekoliko novih obrambenih uputa nepovezanih s neuspjelom potvrdom bloka
   - Loše — dodatne informacije skrivaju jedini ispravak koji obrani treba.

**Objašnjenje:** Reset treba biti kratak i konkretan: smiri tijelo, imenuj proces koji možeš ispraviti i vrati se na trenutačnu loptu.

**Zašto A prije B:** A je potreban odmah prije nastavka; B vrijedi kada se sljedeća situacija bloka stvarno razvije.

## 21. Vratar — nakon svoje pogreške ispravi jednu radnju bez pretjerane reakcije

- Family: `gk_reset_after_error`

**Situacija:** Gubite 20:22 u 41. minuti. Tvoje prethodno ishitreno dugo dodavanje bilo je presječeno i završilo je pogotkom. U sljedećem napadu sigurno hvataš šut. Krila su sada pokrivena, a srednji vanjski slobodan je za kratko dodavanje.

**Pitanje:** Kako reagiraš bez dopuštanja da pogreška upravlja sljedećom odlukom?

A. **optimal** — Primijeni poruku „kontrola, pogled, dodavanje” i odigraj potvrđeno kratko dodavanje
   - Točno — jedan jasan ispravak u postupku usmjerava odluku prema stvarnim informacijama.
B. **good** — Kasnije ponovno odigraj dugo dodavanje samo kada su kontrola i koridor jasno potvrđeni
   - Dobro — ne odbacuješ vještinu, nego ponovno tražiš njezine uvjete.
C. **risky** — U sljedećim posjedima koristi samo kratka dodavanja, čak i ako se otvori čist dugi koridor
   - Rizično — strah od stare pogreške uklanja buduće potvrđene prednosti.
D. **poor** — Odmah pokušaj novo dugo bacanje kako bi poništio prethodnu pogrešku
   - Loše — emocionalno nadoknađivanje zanemaruje trenutačno zatvorene koridore.

**Objašnjenje:** Oporavak nakon pogreške znači ispraviti neuspjeli proces, a zadržati buduće mogućnosti. Sljedeća odluka i dalje pripada trenutačnoj situaciji na terenu.

**Zašto A prije B:** A odgovara trenutačno sigurnom kratkom dodavanju; B je kasniji povratak dugoj mogućnosti kada postoje njezini uvjeti.

## 22. Vratar — pri vodstvu u završnoj minuti dopusti da šut otkrije smjer

- Family: `gk_final_minute_lead_patience`

**Situacija:** Vodite 29:28 osamnaest sekundi prije kraja. Znak pasivne igre prisiljava suparnika na šut s deset metara preko organiziranog bloka. Šuter je u ravnoteži, ali ruka i lopta još ne pokazuju nijedan kut.

**Pitanje:** Što najbolje štiti vodstvo prije izbačaja?

A. **optimal** — Ostani u ravnoteži iza bloka i reagiraj kada izbačaj otkrije putanju
   - Točno — udaljenost i blok već ti daju vrijeme bez ranog pogađanja.
B. **good** — Pomakni se prema suprotnoj strani ako blok jasno zatvori jednu liniju
   - Dobro — potvrđeni blok mijenja prostor koji preuzimaš.
C. **risky** — Rano odaberi kut jer bi jedna obrana odlučila utakmicu
   - Rizično — šuter još može koristiti drugi kut.
D. **poor** — Napravi još dva koraka naprijed tijekom izbačaja kako bi se pripremio za odbijenu loptu
   - Loše — priprema za odbijenu loptu ne može zamijeniti stabilan položaj za prvu obranu.

**Objašnjenje:** Vodstvo u završnici povećava vrijednost kontrolirane obrane, a ne ranog pogađanja. Iskoristi vrijeme koje daju udaljenost i organizirani blok.

**Zašto A prije B:** A odgovara izbačaju koji se još ne može pročitati; B vrijedi tek nakon što blok jasno ukloni jednu liniju.

## 23. Vratar — nakon time-outa prenesi na teren jedan jasan obrambeni dogovor

- Family: `gk_timeout_defence_call`

**Situacija:** Neriješeno je 27:27 u 58. minuti. Tijekom time-outa momčad se dogovorila da središnji branič zatvara stranu šuterske ruke lijevog vanjskog, a polubranitelj preuzima pivota. Igrači se vraćaju na teren, ali nijedan branič još nije glasno potvrdio dogovor.

**Pitanje:** Što vratar treba komunicirati prije početka akcije?

A. **optimal** — Ponovi stranu bloka i čuvara pivota po imenu, zatim primi obje potvrde
   - Točno — plan s time-outa postaje aktivan dogovor na terenu.
B. **good** — Vrati se u neutralan položaj ako napad započne drukčije od očekivane akcije
   - Dobro — plan usmjerava, ali ne poništava nove informacije na terenu.
C. **risky** — Dodaj nekoliko novih mogućnosti dok igrači zauzimaju položaje
   - Rizično — dodatni detalji mogu oslabiti pamćenje dogovorenog prioriteta.
D. **poor** — Pretpostavi da tišina znači da svi pamte plan s time-outa
   - Loše — nepotvrđeni dogovor može pasti pri prvom pokretu.

**Objašnjenje:** Time-out treba svesti informacije na jedan upotrebljiv dogovor. Vratar ga aktivira imenima i potvrdom, zatim se vraća trenutačnim signalima na terenu.

**Zašto A prije B:** A aktivira trenutačno nepotvrđeni plan; B vrijedi samo ako ga stvarni napad opovrgne.

## 24. Vratar — zamjenu za sedmerac dovrši prije nego što je izvođač spreman

- Family: `gk_substitution_readiness`

**Situacija:** Gubite 27:28 u 56. minuti. Nakon odluke o sedmercu slijedi time-out. Vratar specijalist može dovršiti zamjenu prije nego izvođač stane spreman s loptom. Snimka pokazuje jednu pouzdanu stanku u pripremi ovog izvođača, ali ne i pouzdan obrazac smjera.

**Pitanje:** Kako vratar koji ulazi postaje spreman bez žurbe?

A. **optimal** — Dovrši zamjenu na vrijeme, postavi uvježbani dopušteni početni položaj i zadrži samo potvrđenu stanku u pripremi
   - Točno — osigurani su pravilan ulazak, položaj tijela i jedna korisna informacija.
B. **good** — Ostani neutralan ako izvođač promijeni poznatu stanku u pripremi
   - Dobro — promijenjeno ponašanje poništava staru informaciju.
C. **risky** — Uđi kasno i odaberi kut dok se još postavljaš
   - Rizično — ishitrena priprema ugrožava pravilan ulazak i ravnotežu.
D. **poor** — Pokušaj zamjenu nakon što je izvođač već spreman s loptom
   - Loše — dopušteni trenutak za zamjenu već je prošao.

**Objašnjenje:** Zamjena specijalista pomaže samo ako je dovršena u dopuštenom trenutku i praćena jednostavnom pripremom. Dovoljan je jedan potvrđen signal; trenutačni izbačaj ostaje presudan.

**Zašto A prije B:** A odgovara otvorenom trenutku za zamjenu i nepromijenjenom signalu; B vrijedi samo ako izvođač promijeni rutinu.

## 25. Vratar — u završnici usmjeri odbijenu loptu dalje od druge prilike

- Family: `gk_rebound_endgame_control`

**Situacija:** Vodite 30:29 sedam sekundi prije kraja. Niski šut dolazi desno, malo izvan dosega za sigurno hvatanje. Dva napadača ulaze u središnji prostor za odbijenu loptu, dok je prostor izvan desne vratnice prema uzdužnoj liniji slobodan.

**Pitanje:** Kako kontroliraš obranu kada hvatanje nije moguće?

A. **optimal** — Čvrstom vanjskom rukom usmjeri loptu pokraj vratnice prema slobodnom prostoru uz uzdužnu liniju
   - Točno — obrana uklanja i šut i središnju drugu priliku.
B. **good** — Hvataj loptu samo ako joj brzina dovoljno padne za siguran prihvat objema rukama
   - Dobro — siguran posjed bolji je kada je stvarno dostupan.
C. **risky** — Meko odbij loptu natrag u središnji prostor za odbijanje
   - Rizično — oba napadača već ulaze u taj prostor.
D. **poor** — Pokušaj zadržati zahtjevnu loptu jednom rukom umjesto da je usmjeriš izvan gola
   - Loše — nesigurno hvatanje može stvoriti upravo odbijenu loptu koju moraš izbjeći.

**Objašnjenje:** Kontrola u završnici znači odabrati najsigurnije sljedeće mjesto lopte. Kada hvatanje nije moguće, čvrsto odbijanje u potvrđeno prazan prostor predstavlja kontroliranu obranu.

**Zašto A prije B:** A odgovara trenutačnoj brzini i zauzetoj sredini; B postaje bolji samo ako lopta dovoljno uspori za sigurno hvatanje.
