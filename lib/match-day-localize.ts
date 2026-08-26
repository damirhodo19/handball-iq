import type { SupportedLanguage } from '@/locales';
import { localizeContent } from '@/lib/content-localize';
import { translatePersonalGoal, type TFunc } from '@/lib/translations';

type LocalizedPair = { hr: string; de: string };

const MATCH_DAY_COPY: Record<string, LocalizedPair> = {
  'Stay patient before moving.': { hr: 'Ostani strpljiv prije pokreta.', de: 'Bleib geduldig, bevor du dich bewegst.' },
  'Use previous shots as information, not certainty.': { hr: 'Koristi prethodne šuteve kao informaciju, a ne kao sigurnost.', de: 'Nutze frühere Würfe als Information, nicht als Gewissheit.' },
  'Reset immediately after every action.': { hr: 'Odmah se resetiraj nakon svake akcije.', de: 'Fokussiere dich nach jeder Aktion sofort neu.' },
  'Scan the defence before receiving the ball.': { hr: 'Pregledaj obranu prije primanja lopte.', de: 'Erfasse die Abwehr, bevor du den Ball annimmst.' },
  'Control the tempo — do not rush the first pass.': { hr: 'Kontroliraj tempo i ne žuri s prvim dodavanjem.', de: 'Kontrolliere das Tempo und überstürze den ersten Pass nicht.' },
  'Communicate the attacking plan before each phase.': { hr: 'Komuniciraj plan napada prije svake faze.', de: 'Kommuniziere den Angriffsplan vor jeder Phase.' },
  'Attack the space before choosing the final action.': { hr: 'Napadni prostor prije odabira završne akcije.', de: 'Greife den Raum an, bevor du die Abschlussaktion wählst.' },
  "Read the defender's stance before committing to the drive.": { hr: 'Pročitaj stav braniča prije ulaska u prodor.', de: 'Lies die Stellung des Abwehrspielers, bevor du in den Durchbruch gehst.' },
  'Time the wing pass — do not force it into coverage.': { hr: 'Tempiraj dodavanje krilu i ne forsiraj ga kroz pokrivenu zonu.', de: 'Passe im richtigen Moment zum Flügel und erzwinge keinen Pass in die Deckung.' },
  'Draw the defender before passing to the pivot.': { hr: 'Privuci braniča prije dodavanja pivotu.', de: 'Binde den Abwehrspieler, bevor du zum Kreis passt.' },
  'Start the fast break immediately after possession changes.': { hr: 'Pokreni kontru odmah nakon promjene posjeda.', de: 'Starte den Gegenstoß sofort nach dem Ballgewinn.' },
  'Read the goalkeeper before choosing near post, far post or lob.': { hr: 'Pročitaj vratara prije odabira bližeg kuta, daljeg kuta ili loba.', de: 'Lies den Torwart, bevor du kurzen Winkel, langen Winkel oder Heber wählst.' },
  'Stay patient on narrow angles — the goalkeeper has less goal to cover.': { hr: 'Ostani strpljiv iz uskog kuta jer vratar pokriva manju površinu gola.', de: 'Bleib bei engem Winkel geduldig, da der Torwart weniger Torfläche abdecken muss.' },
  'Time your sprint — do not arrive too early or too late.': { hr: 'Tempiraj sprint kako ne bi stigao prerano ni prekasno.', de: 'Passe deinen Sprint so ab, dass du weder zu früh noch zu spät ankommst.' },
  'Create space before asking for the ball.': { hr: 'Stvori prostor prije traženja lopte.', de: 'Schaffe Raum, bevor du den Ball forderst.' },
  'Read the defensive rotation before changing position.': { hr: 'Pročitaj rotaciju obrane prije promjene pozicije.', de: 'Lies die Abwehrrotation, bevor du deine Position wechselst.' },
  'Stay ready for contact — protect the ball on reception.': { hr: 'Budi spreman na kontakt i zaštiti loptu pri primanju.', de: 'Sei auf Kontakt vorbereitet und schütze den Ball bei der Annahme.' },
  'Scan before you receive.': { hr: 'Pregledaj situaciju prije primanja lopte.', de: 'Erfasse die Situation, bevor du den Ball annimmst.' },
  'Commit to the highest-percentage action.': { hr: 'Odlučno izvedi akciju s najvećom vjerojatnošću uspjeha.', de: 'Führe die Aktion mit der höchsten Erfolgswahrscheinlichkeit entschlossen aus.' },
  'Reset immediately after every possession.': { hr: 'Odmah se resetiraj nakon svakog posjeda.', de: 'Fokussiere dich nach jedem Ballbesitz sofort neu.' },
  'Stay present on the next action': { hr: 'Ostani usredotočen na sljedeću akciju', de: 'Konzentriere dich auf die nächste Aktion' },
  'First Possession': { hr: 'Prvi posjed', de: 'Erster Ballbesitz' },
  'After a Mistake': { hr: 'Nakon pogreške', de: 'Nach einem Fehler' },
  'Decisive Moment': { hr: 'Odlučujući trenutak', de: 'Entscheidender Moment' },
  'Focus Cue 1': { hr: 'Fokus 1', de: 'Fokus 1' },
  'Focus Cue 2': { hr: 'Fokus 2', de: 'Fokus 2' },
  'Focus Cue 3': { hr: 'Fokus 3', de: 'Fokus 3' },
  'Imagine receiving the ball in the first organised attack. Scan the defence, choose your space, and commit to the highest-percentage decision for your position. Feel calm control before the action.': {
    hr: 'Zamisli primanje lopte u prvom organiziranom napadu. Pregledaj obranu, odaberi prostor i odlučno izvedi odluku s najvećom vjerojatnošću uspjeha za svoju poziciju. Osjeti mirnu kontrolu prije akcije.',
    de: 'Stell dir vor, wie du im ersten geordneten Angriff den Ball annimmst. Erfasse die Abwehr, wähle deinen Raum und führe die erfolgversprechendste Entscheidung für deine Position entschlossen aus. Spüre die ruhige Kontrolle vor der Aktion.',
  },
  'Imagine a turnover or missed chance. Reset immediately — one breath, clear communication, and the next defensive or attacking action. The previous play is gone. Your focus is entirely forward.': {
    hr: 'Zamisli izgubljenu loptu ili propuštenu priliku. Odmah se resetiraj jednim udahom, jasnom komunikacijom i sljedećom obrambenom ili napadačkom akcijom. Prethodna je akcija završena. Fokus je potpuno usmjeren naprijed.',
    de: 'Stell dir einen Ballverlust oder eine vergebene Chance vor. Fokussiere dich sofort neu mit einem Atemzug, klarer Kommunikation und der nächsten Abwehraktion oder Angriffsaktion. Die vorige Aktion ist vorbei. Dein Fokus ist vollständig nach vorn gerichtet.',
  },
  'Imagine a late, tight scoreline with the ball in your area of responsibility. Read the situation, trust your preparation, and execute the best available decision under pressure.': {
    hr: 'Zamisli neizvjestan rezultat u završnici i loptu u svojoj zoni odgovornosti. Pročitaj situaciju, vjeruj pripremi i pod pritiskom izvedi najbolju dostupnu odluku.',
    de: 'Stell dir einen knappen Spielstand in der Schlussphase vor, während der Ball in deinen Verantwortungsbereich kommt. Lies die Situation, vertraue deiner Vorbereitung und führe unter Druck die beste verfügbare Entscheidung aus.',
  },
};

const DEFENSE_HINTS: Record<string, LocalizedPair> = {
  'man-to-man': { hr: 'individualno čuvanje', de: 'Mann gegen Mann' },
  open: { hr: 'otvorena obrana', de: 'offene Abwehr' },
  'double-mark': { hr: 'udvajanje', de: 'Doppeldeckung' },
};

const ATTACK_HINTS: Record<string, LocalizedPair> = {
  'Structured Attack': { hr: 'organizirani napad', de: 'strukturierter Angriff' },
  'Fast Break': { hr: 'kontra', de: 'Gegenstoß' },
  'Second Wave': { hr: 'drugi val', de: 'zweite Welle' },
  'Quick Centre': { hr: 'brzi centar', de: 'schnelle Mitte' },
  Crossing: { hr: 'križanje', de: 'Kreuzen' },
  'Parallel Movement': { hr: 'paralelno kretanje', de: 'Parallelbewegung' },
  'Second Pivot': { hr: 'drugi pivot', de: 'zweiter Kreisläufer' },
  'Empty Goal': { hr: 'prazan gol', de: 'leeres Tor' },
  'Two Pivot': { hr: 'dva pivota', de: 'zwei Kreisläufer' },
  'Wing Overload': { hr: 'preopterećenje krila', de: 'Überzahl am Flügel' },
  'Backcourt Shooting': { hr: 'šut vanjske linije', de: 'Rückraumwurf' },
  '1v1 Isolation': { hr: 'izolacija jedan na jedan', de: 'Isolation im Eins gegen Eins' },
  'Pivot Cooperation': { hr: 'suradnja s pivotom', de: 'Zusammenspiel mit dem Kreis' },
  'Numerical Superiority': { hr: 'brojčana nadmoć', de: 'Überzahl' },
};

function pick(pair: LocalizedPair, lang: SupportedLanguage): string {
  return lang === 'hr' ? pair.hr : pair.de;
}

export function localizeMatchDayText(
  text: string,
  lang: SupportedLanguage,
  t: TFunc,
): string {
  if (!text || lang === 'en') return text;
  const direct = MATCH_DAY_COPY[text];
  if (direct) return pick(direct, lang);

  if (text.startsWith('Focus: ')) {
    const goal = translatePersonalGoal(text.slice(7), t);
    return lang === 'hr' ? `Fokus: ${goal}` : `Fokus: ${goal}`;
  }
  if (text.startsWith('Read opponent shape vs ')) {
    const raw = text.slice('Read opponent shape vs '.length).replace(/\.$/, '');
    const hint = DEFENSE_HINTS[raw] ? pick(DEFENSE_HINTS[raw], lang) : raw;
    return lang === 'hr'
      ? `Pročitaj oblik protivničke obrane protiv sustava ${hint}.`
      : `Lies die gegnerische Abwehrformation gegen ${hint}.`;
  }
  if (text.startsWith('Attack theme: ')) {
    const raw = text.slice('Attack theme: '.length);
    const hint = ATTACK_HINTS[raw] ? pick(ATTACK_HINTS[raw], lang) : raw;
    return lang === 'hr' ? `Tema napada: ${hint}` : `Angriffsthema: ${hint}`;
  }

  return localizeContent(text, lang, t);
}
