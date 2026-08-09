#!/usr/bin/env node
/**
 * Native coach-voice rewrite for high-traffic / repeated HR scenario strings.
 * Does not touch correctId / scoring — only LocalizedText.hr fields.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(path, 'utf8'));

/** Exact title replacements (high-frequency archetypes). */
const TITLE_MAP = {
  'Šut s krila — uski kut': 'Šut s krila — uski kut',
  'Sedmerac — Tendencijsko čitanje': 'Sedmerac — čitanje navika',
  'Skok šut u stražnjem polju': 'Skok-šut vanjskog',
  'Hip šut — Body Cue': 'Šut iz kuka — signal tijela',
  'Shootout — Independent Reads': 'Raspuštanje — čisto čitanje',
  'pivot Bounce Pass — izvan ravnoteže': 'Pivot — odskočno dodavanje iz neravnoteže',
  'pivot — Bounce Pass Reception': 'Pivot — primanje odskočnog dodavanja',
  'Lijevo krilo — blizu cilja': 'Lijevo krilo — blizu gola',
  'Desno krilo — blizu cilja': 'Desno krilo — blizu gola',
  'Lijevo krilo — unakrsni blok': 'Lijevo krilo — križanje',
  'Desno krilo — unakrsni blok': 'Desno krilo — križanje',
  'Lijevo krilo — brzo mjerenje vremena prodora': 'Lijevo krilo — tempiranje kontranapada',
  'Desno krilo — brzo mjerenje vremena prodora': 'Desno krilo — tempiranje kontranapada',
  'Okret — Pozicioniranje od šest metara': 'Pivot — pozicija na šest metara',
  'pivot — Blokiranje vratara': 'Pivot — zaklanjanje vratara',
  'pivot — primanje pod pritiskom': 'Pivot — primanje pod pritiskom',
  'Obrana — pivot Pressure': 'Obrana — pritisak na pivota',
  'Obrana — Oporavak preskakanja': 'Obrana — oporavak nakon preuzimanja',
  'Obrana — Prijelazni set': 'Obrana — postavljanje u tranziciji',
  'Obrana — Last Minute Stand': 'Obrana — zadnja minuta',
  'Obrana — dvostruka timska odluka': 'Obrana — odluka o udvajanju',
  'kontranapad — vratar Outlet': 'Kontranapad — izlaz vratara',
  'igra s igračem više — Preopterećenje krila': 'Igrač više — opterećenje krila',
  'Kratka ruka — 5-na-6 preživljavanje': 'Igrač manje — preživljavanje 5 na 6',
  'Kratkoruki — uloga vratara': 'Igrač manje — uloga vratara',
  'Završetak utakmice — zaštita potencijalnog igrača': 'Završetak utakmice — čuvanje igrača više',
  'Završetak meča — odlučujuće spremanje': 'Završetak utakmice — odlučujući šut',
  'Donošenje odluka — strpljenje nasuprot agresiji': 'Odluka — strpljenje ili agresija',
  'Donošenje odluka — obrazac naspram čitanja': 'Odluka — navika ili čitanje',
  'Donošenje odluka — tempo u odnosu na brzinu': 'Odluka — tempo ili brzina',
  'Sedam protiv šest — Preopterećenje': '7 na 6 — preopterećenje',
  'Odvajanje — kontrolirano napredovanje': 'Izlazak — kontrolirano napredovanje',
  'Posljednja minuta — rezultat razine': 'Zadnja minuta — izjednačen rezultat',
  'Dvostruki zakretni blok': 'Dvostruki pivotov blok',
  'Središnja stražnja strana — zakretna veza': 'Srednji vanjski — veza s pivotom',
  'Okretanje — stvaranje prostora za leđa': 'Pivot — stvaranje prostora za vanjske',
  'Okret — Završetak na šest metara': 'Pivot — završetak na šest metara',
  'Zaokret — Spin Finish': 'Pivot — završetak okretom',
  'Zakretanje — Završetak od šest metara spojke': 'Pivot — završetak sa šest metara',
  'pivot — 7v6 Prazan teren': 'Pivot — 7 na 6, prazan teren',
  'pivot — dvostruka koordinacija pivota': 'Pivot — koordinacija dva pivota',
  'srednji vanjski — Čitanje 3-2-1': 'Srednji vanjski — čitanje 3:2:1',
  'Srednji vanjski — čitanje 5-1': 'Srednji vanjski — čitanje 5:1',
  'Obrana — 6-0 Pokrivanje krila': 'Obrana — pokrivanje krila u 6:0',
  'Obrana — 6-0 praćenje lopte': 'Obrana — praćenje lopte u 6:0',
  'Obrana — praćenje lopte 5-1': 'Obrana — praćenje lopte u 5:1',
  'Obrana — 5-1 krilna pokrivenost': 'Obrana — pokrivanje krila u 5:1',
  'Obrana — 3-2-1 praćenje lopte': 'Obrana — praćenje lopte u 3:2:1',
  'Obrana — 3-2-1 Pokrivanje krila': 'Obrana — pokrivanje krila u 3:2:1',
  'kontranapad — odluka 3-na-2': 'Kontranapad — odluka 3 na 2',
  'kontranapad — Izvođenje 2 na 1': 'Kontranapad — izvedba 2 na 1',
  'igra s igračem više — struktura 6-na-5': 'Igrač više — struktura 6 na 5',
  'Završetak utakmice — završni napad u zaostatku': 'Završetak utakmice — napad u zaostatku',
  'Blok iza leđa — Izvedba iz igre': 'Blok iza leđa — izvedba iz igre',
  'Kontranapad — 2-na-1': 'Kontranapad — 2 na 1',
};

const QUESTION_MAP = {
  'Koji je vaš najbolji odgovor na pozicioniranje?': 'Kako se najbolje pozicioniraš?',
  'Kakav je vaš pristup sedmercima?': 'Kakav je tvoj pristup sedmercu?',
  'Što je vaš primarni fokus?': 'Na što prvo gledaš?',
  'Kako biste trebali koristiti štap za rame?': 'Kako čitaš signal iz ramena?',
  'Kakav je vaš mentalni pristup ovom bacanju?': 'Kakav je tvoj mentalni pristup ovom šutu?',
  'Što bi trebao biti vaš glavni fokus?': 'Što je tvoj glavni fokus?',
  'Koja je vaša najbolja opcija završne obrade?': 'Koja je tvoja najbolja opcija završetka?',
  'Gdje biste trebali postaviti završnu obradu?': 'Gdje završavaš akciju?',
  'Kada biste trebali sprintati za Kontranapad?': 'Kada krećeš u kontranapad?',
  'Kada biste trebali sprintati za kontranapad?': 'Kada krećeš u kontranapad?',
  'Što je vaš obrambeni prioritet?': 'Što je tvoj obrambeni prioritet?',
  'Koja je vaša najbolja napadačka odluka?': 'Koja je tvoja najbolja napadačka odluka?',
  'Kako pobijediti svog braniča u izolaciji?': 'Kako pobjeđuješ braniča u izolaciji?',
  'Koja je svrha vaše akcije križanja?': 'Što je cilj tvog križanja?',
  'Kako se povezujete s pivotom?': 'Kako se povezuješ s pivotom?',
  'Kada biste trebali pustiti krilni pas?': 'Kada puštaš dodavanje na krilo?',
  'Kako vršite obrambeni pritisak u tranziciji?': 'Kako radiš pritisak u tranziciji?',
  'Kako prilagođavate odabir šuta?': 'Kako prilagođavaš odabir šuta?',
  'Kako napadate protiv 5-1?': 'Kako napadaš protiv 5:1?',
  'Koji je vaš prioritet u igri moći?': 'Što je prioritet kad imaš igrača više?',
  'Koja je najbolja odluka u ovoj kontrи?': 'Koja je najbolja odluka u ovom kontranapadu?',
  'Koja je najbolja odluka u ovoj kontri?': 'Koja je najbolja odluka u ovom kontranapadu?',
  'Gdje se trebate postaviti na liniji od šest metara?': 'Gdje se postavljaš na liniji šest metara?',
  'Kako učinkovito blokirati bez prekršaja?': 'Kako blokiraš čisto, bez prekršaja?',
  'Kako osiguravate loptu u kontaktu?': 'Kako čuvaš loptu u kontaktu?',
  'Kako braniti osovinsku brtvu?': 'Kako braniš blokadu pivota?',
  'Kako se oporavljate od preskakanja?': 'Kako se oporavljaš nakon preuzimanja?',
  'Kada pomažete, a kada oporavljate?': 'Kada ideš u pomoć, a kada se vraćaš?',
  'Kako postavljate obranu u tranziciji?': 'Kako postavljaš obranu u tranziciji?',
  'Kako izvodite 3-na-2?': 'Kako igraš 3 na 2?',
  'Kako spriječiti rez stražnjeg krila?': 'Kako spriječiti ulaz krila iza leđa?',
  'Kako se obrambena jedinica mijenja pri kretanju lopte?': 'Kako se obrana pomiče s loptom?',
  'Kako iskorištavate naprednog vratara?': 'Kako koristiš vratara koji je izašao?',
  'Kako čitate vratara prije nego završite?': 'Kako čitaš vratara prije završetka?',
  'Kako iskorištavate prednost igrača na krilu?': 'Kako koristiš igrača više na krilu?',
  'Najbolji izbor kreacije?': 'Koja je najbolja kreacija?',
  'Najbolja odluka pred krajem napada?': 'Koja je najbolja odluka pred krajem napada?',
  'Koji je profesionalni poziv?': 'Što je pravi poziv?',
  'Kako pobjeđuješ ovaj rani korak vratara?': 'Kako rješavaš rani izlazak vratara?',
};

/** Phrase-level cleanup across all HR strings. */
const PHRASE_FIXES = [
  [/završne obrade/gi, 'završetka'],
  [/završnu obradu/gi, 'završetak'],
  [/završna obrada/gi, 'završetak'],
  [/blizu cilja/gi, 'blizu gola'],
  [/štap za rame/gi, 'signal iz ramena'],
  [/osovinsku brtvu/gi, 'blokadu pivota'],
  [/osovinska brtva/gi, 'blokada pivota'],
  [/preskakanja/gi, 'preuzimanja'],
  [/preskakanje/gi, 'preuzimanje'],
  [/igri moći/gi, 'igri s igračem više'],
  [/kratka ruka/gi, 'igrač manje'],
  [/kratkoruki/gi, 'igrač manje'],
  [/rez stražnjeg krila/gi, 'ulaz krila iza leđa'],
  [/rez /gi, 'ulaz '],
  [/stražnjem polju/gi, 'vanjskom prostoru'],
  [/stražnji polje/gi, 'vanjski prostor'],
  [/Body Cue/g, 'signal tijela'],
  [/Spin Finish/g, 'završetak okretom'],
  [/Bounce Pass/g, 'odskočno dodavanje'],
  [/Outlet/g, 'izlaz'],
  [/Last Minute Stand/g, 'zadnja minuta'],
  [/Independent Reads/g, 'čisto čitanje'],
  [/Shootout/g, 'Raspuštanje'],
  [/Preopterećenje/g, 'Opterećenje'],
  [/preopterećenje/g, 'opterećenje'],
  [/Prazan teren/g, 'prazan teren'],
  [/vaš /g, 'tvoj '],
  [/Vaš /g, 'Tvoj '],
  [/vaša /g, 'tvoja '],
  [/Vaša /g, 'Tvoja '],
  [/vaše /g, 'tvoje '],
  [/Vaše /g, 'Tvoje '],
  [/vašem /g, 'tvom '],
  [/vašoj /g, 'tvojoj '],
  [/vašu /g, 'tvoju '],
  [/biste trebali/gi, 'trebaš'],
  [/trebate /gi, 'trebaš '],
  [/povezujete/gi, 'povezuješ'],
  [/prilagođavate/gi, 'prilagođavaš'],
  [/napadate/gi, 'napadaš'],
  [/vršite/gi, 'radiš'],
  [/iskorištavate/gi, 'koristiš'],
  [/čitate/gi, 'čitaš'],
  [/postavljate/gi, 'postavljaš'],
  [/izvodite/gi, 'igraš'],
  [/osiguravate/gi, 'čuvaš'],
  [/oporavljate/gi, 'oporavljaš'],
  [/pomažete/gi, 'ideš u pomoć'],
  [/Kako se oporavljaš od preuzimanja/g, 'Kako se oporavljaš nakon preuzimanja'],
  [/Skok šut/g, 'Skok-šut'],
  [/6-0/g, '6:0'],
  [/5-1/g, '5:1'],
  [/3-2-1/g, '3:2:1'],
  [/6-na-5/g, '6 na 5'],
  [/5-na-6/g, '5 na 6'],
  [/3-na-2/g, '3 na 2'],
  [/2-na-1/g, '2 na 1'],
  [/7v6/g, '7 na 6'],
  [/u ovoj kontri/gi, 'u ovom kontranapadu'],
  [/u ovoj kontrи/gi, 'u ovom kontranapadu'],
];

function rewriteHr(text) {
  if (!text || typeof text !== 'string') return text;
  let out = TITLE_MAP[text] ?? QUESTION_MAP[text] ?? text;
  for (const [re, rep] of PHRASE_FIXES) out = out.replace(re, rep);
  // Re-apply exact maps after phrase pass for titles/questions that partially matched
  if (TITLE_MAP[out]) out = TITLE_MAP[out];
  if (QUESTION_MAP[out]) out = QUESTION_MAP[out];
  return out;
}

function walk(obj) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(walk);
  if (obj && typeof obj === 'object') {
    const out = { ...obj };
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'hr' && typeof v === 'string') {
        out[k] = rewriteHr(v);
      } else if (typeof v === 'object' && v !== null) {
        out[k] = walk(v);
      }
    }
    return out;
  }
  return obj;
}

const before = JSON.stringify(bank);
const next = walk(bank);
writeFileSync(path, JSON.stringify(next, null, 2) + '\n');

let changed = 0;
function countDiff(a, b) {
  if (typeof a === 'string' && typeof b === 'string') {
    if (a !== b) changed++;
    return;
  }
  if (Array.isArray(a)) {
    for (let i = 0; i < a.length; i++) countDiff(a[i], b[i]);
    return;
  }
  if (a && typeof a === 'object') {
    for (const k of Object.keys(a)) countDiff(a[k], b[k]);
  }
}
countDiff(JSON.parse(before), next);
console.log(`HR coach-voice rewrite: ${changed} strings updated`);
