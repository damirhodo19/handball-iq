export interface GKScenario {
  id: number;
  half: 'First Half' | 'Second Half';
  time: string;
  score: string;
  situation: string;
  situation_hr?: string;
  question: string;
  question_hr?: string;
  options: string[];
  options_hr?: string[];
  correctIndex: number;
  explanation: string;
  explanation_hr?: string;
  metric: 'Patience' | 'Reading the Shooter' | 'Pressure Control';
}

export const GK_SCENARIOS: GKScenario[] = [
  {
    id: 1,
    half: 'First Half',
    time: '24:13',
    score: '11–10',
    situation:
      'The opponent attacks six against six. The right back has already scored twice with a high shot toward your left side. The defender is late and the shooter has space for a full jump shot.',
    situation_hr:
      'Protivnik napada šest protiv šest. Desni vanjski je već dvaput postigao gol visokim šutom prema vašoj lijevoj strani. Branič kasni i šuter ima prostor za pun skok šut.',
    question: 'What should be your primary focus?',
    question_hr: 'Što treba biti vaš primarni fokus?',
    options: [
      'Move early toward the left upper corner.',
      'Stay patient and read the shooter\'s arm and body position.',
      'Step aggressively to the six-metre line before the jump.',
      'Ignore the shooter and focus mainly on the pivot.',
    ],
    options_hr: [
      'Kreni rano prema lijevom gornjem kutu.',
      'Ostani strpljiv i pročitaj položaj ruke i tijela šutera.',
      'Agresivno izađi na šestometarsku crtu prije skoka.',
      'Zanemari šutera i fokusiraj se uglavnom na pivota.',
    ],
    correctIndex: 1,
    explanation:
      'Moving early gives the shooter time to change the shot. Staying patient allows the goalkeeper to read the final arm and body position.',
    explanation_hr:
      'Rano kretanje daje šuteru vremena da promijeni šut. Strpljivost omogućuje vrataru da pročita konačni položaj ruke i tijela.',
    metric: 'Reading the Shooter',
  },
  {
    id: 2,
    half: 'Second Half',
    time: '42:36',
    score: '20–19',
    situation:
      'Left wing receives the ball at a very narrow angle. He previously scored once at the near post and once with a lob.',
    situation_hr:
      'Lijevo krilo prima loptu pod vrlo malim kutom. Prije je jednom postigao gol bližom stativom i jednom lobanjem.',
    question: 'What should you prioritize?',
    question_hr: 'Što trebate prioritetno raditi?',
    options: [
      'Stand completely still on the goal line.',
      'Close the near post while staying balanced for the lob.',
      'Run directly toward the shooter.',
      'Move early toward the far post.',
    ],
    options_hr: [
      'Stoj potpuno mirno na gol-crti.',
      'Zatvori bližu stativu dok ostaješ uravnotežen za lob.',
      'Trči izravno prema šuteru.',
      'Kreni rano prema daljoj stativi.',
    ],
    correctIndex: 1,
    explanation:
      'The wing has shown two different finishes. Closing the near post while staying balanced covers the most likely angle and keeps you ready for the lob.',
    explanation_hr:
      'Krilo je pokazalo dvije različite završetke. Zatvaranje bliže stative uz uravnoteženost pokriva najvjerojatniji kut i ostavlja spremnim za lob.',
    metric: 'Reading the Shooter',
  },
  {
    id: 3,
    half: 'Second Half',
    time: '51:08',
    score: '25–25',
    situation:
      'Fast break. The attacker approaches alone from the centre and still has several metres before the six-metre line.',
    situation_hr:
      'Kontranapad. Napadač prilazi sam iz sredine i još uvijek ima nekoliko metara do šestometarske crte.',
    question: 'What is the best initial response?',
    question_hr: 'Koji je najbolji početni odgovor?',
    options: [
      'Stay deep inside the goal.',
      'Rush forward immediately without controlling your position.',
      'Advance under control, stay large and react late.',
      'Turn sideways before the attacker shoots.',
    ],
    options_hr: [
      'Ostani duboko unutar gola.',
      'Juriš naprijed odmah bez kontrole pozicije.',
      'Izađi pod kontrolom, ostani velik i reagiraj kasno.',
      'Okreni se bočno prije šuta napadača.',
    ],
    correctIndex: 2,
    explanation:
      'Advancing under control narrows the angle without committing. Staying large and reacting late forces the attacker to make the first decision.',
    explanation_hr:
      'Kontrolirani izlazak sužava kut bez prisanja. Ostati velik i reagirati kasno tjera napadača da donese prvu odluku.',
    metric: 'Patience',
  },
  {
    id: 4,
    half: 'Second Half',
    time: '56:41',
    score: '28–27',
    situation:
      'Seven-metre throw. The shooter previously used two low shots, but is now looking at the goalkeeper for a long time.',
    situation_hr:
      'Sedmerac. Šuter je prije koristio dva niska šuta, ali sada dugo gleda u vratara.',
    question: 'What is the best mental and tactical approach?',
    question_hr: 'Koji je najbolji mentalni i taktički pristup?',
    options: [
      'Choose a corner before the whistle and move early.',
      'Focus only on the previous two shots.',
      'Stay calm, hold your position and react to the final movement.',
      'Turn your back to reduce pressure.',
    ],
    options_hr: [
      'Odaberi kut prije zvižduka i kreni rano.',
      'Fokusiraj se samo na prethodna dva šuta.',
      'Ostani miran, drži poziciju i reagiraj na konačni pokret.',
      'Okreni leđa da smanjiš pritisak.',
    ],
    correctIndex: 2,
    explanation:
      'Previous shots are information, not certainty. Holding position and reacting to the final movement keeps every corner live.',
    explanation_hr:
      'Prethodni šutovi su informacija, a ne sigurnost. Držanje pozicije i reagiranje na konačni pokret ostavlja svaki kut otvoren.',
    metric: 'Pressure Control',
  },
  {
    id: 5,
    half: 'Second Half',
    time: '59:18',
    score: '30–30',
    situation:
      'The opponent plays seven against six. The pivot receives the ball under pressure at six metres, slightly off balance.',
    situation_hr:
      'Protivnik igra sedam protiv šest. Pivot prima loptu pod pritiskom na šest metara, blago izvan ravnoteže.',
    question: 'What should be your main focus?',
    question_hr: 'Što treba biti vaš glavni fokus?',
    options: [
      'Drop early before the pivot controls the ball.',
      'Stay upright, read the release and react late.',
      'Move toward the wing before the pivot shoots.',
      'Leave the goal and attack the pivot.',
    ],
    options_hr: [
      'Padni rano prije nego pivot kontrolira loptu.',
      'Ostani uspravan, pročitaj šut i reagiraj kasno.',
      'Kreni prema krilu prije šuta pivota.',
      'Napusti gol i napadni pivota.',
    ],
    correctIndex: 1,
    explanation:
      'The pivot is off balance, so the release will be slower. Staying upright and reacting late gives you the best chance to cover the finish.',
    explanation_hr:
      'Pivot je izvan ravnoteže, pa će šut biti sporiji. Ostati uspravan i reagirati kasno daje najbolju šansu za pokrivanje završetka.',
    metric: 'Pressure Control',
  },
];

export const SESSION_INFO = {
  title: 'Reading the Shooter',
  title_hr: 'Čitanje šutera',
  subtitle: 'Goalkeeper IQ',
  subtitle_hr: 'Vratarski IQ',
  sessionNumber: 'Session 01',
  sessionNumber_hr: 'Trening 01',
  description:
    'You will analyze five realistic match situations and choose the best goalkeeper response.',
  description_hr:
    'Analizirat ćete pet realnih situacija iz utakmice i odabrati najbolji vratarski odgovor.',
  structure: ['5 match scenarios', 'approximately 10 minutes', 'feedback after completion'],
  structure_hr: ['5 situacija iz utakmice', 'otprilike 10 minuta', 'povratna informacija nakon završetka'],
  instruction:
    'Do not guess quickly. Read the score, match time, attacker position and previous shooting behavior.',
  instruction_hr:
    'Ne nagađaj brzo. Pročitaj rezultat, vrijeme utakmice, poziciju napadača i prethodno ponašanje šutera.',
  duration: '10 min',
  difficulty: 'Intermediate',
};

export const SESSION_RESULTS = {
  strengths: [
    'Good recognition of shooting patterns',
    'Strong positioning in wing situations',
    'Calm decision-making during fast breaks',
  ],
  strengths_hr: [
    'Dobro prepoznavanje obrazaca šutanja',
    'Jaka pozicija u situacijama s krila',
    'Mirno donošenje odluka tijekom kontranapada',
  ],
  improve: [
    'Avoid committing too early',
    'Use previous shots as information, not as certainty',
    'Stay balanced under pressure',
  ],
  improve_hr: [
    'Izbjegavaj prisanje prevelikom brzinom',
    'Koristi prethodne šutove kao informaciju, a ne sigurnost',
    'Ostani uravnotežen pod pritiskom',
  ],
  recommendation:
    'Repeat this session in 48 hours and focus on delaying your first movement.',
  recommendation_hr:
    'Ponovi ovaj trening za 48 sati i fokusiraj se na odgađanje prvog pokreta.',
};

export function getMetricRating(metric: string, correctCount: number, total: number): string {
  const ratio = total > 0 ? correctCount / total : 0;
  if (ratio >= 0.8) return 'Strong';
  if (ratio >= 0.6) return 'Good';
  return 'Developing';
}
