import { getGKScenariosFromBank } from '@/lib/scenario-bank';

export interface GKScenario {
  id: number;
  /** Canonical bank / admin scenario id — used for session uniqueness */
  bankId?: string;
  half: 'First Half' | 'Second Half';
  time: string;
  score: string;
  situation: string;
  situation_hr?: string;
  situation_de?: string;
  question: string;
  question_hr?: string;
  question_de?: string;
  options: string[];
  options_hr?: string[];
  options_de?: string[];
  correctIndex: number;
  explanation: string;
  explanation_hr?: string;
  explanation_de?: string;
  /** Position skill id or legacy GK metric label */
  metric: string;
}

export const GK_SCENARIOS: GKScenario[] = getGKScenariosFromBank(5);

export const SESSION_INFO = {
  title: 'Reading the Shooter',
  title_hr: 'Čitanje šutera',
  title_de: 'Den Werfer lesen',
  subtitle: 'Goalkeeper IQ',
  subtitle_hr: 'Vratarski IQ',
  subtitle_de: 'Torwart-IQ',
  sessionNumber: 'Session 01',
  sessionNumber_hr: 'Trening 01',
  sessionNumber_de: 'Einheit 01',
  description:
    'You will analyze five realistic match situations and choose the best goalkeeper response.',
  description_hr:
    'Analizirat ćete pet realnih situacija iz utakmice i odabrati najbolji vratarski odgovor.',
  description_de:
    'Du analysierst fünf realistische Spielsituationen und wählst die beste Torwart-Reaktion.',
  structure: ['5 match scenarios', 'approximately 10 minutes', 'feedback after completion'],
  structure_hr: ['5 situacija iz utakmice', 'otprilike 10 minuta', 'povratna informacija nakon završetka'],
  structure_de: ['5 Spielszenarien', 'ca. 10 Minuten', 'Feedback nach Abschluss'],
  instruction:
    'Do not guess quickly. Read the score, match time, attacker position and previous shooting behavior.',
  instruction_hr:
    'Ne nagađaj brzo. Pročitaj rezultat, vrijeme utakmice, poziciju napadača i prethodno ponašanje šutera.',
  instruction_de:
    'Rate nicht zu schnell. Lies den Spielstand, die Spielzeit, die Position des Angreifers und sein bisheriges Wurfverhalten.',
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
  strengths_de: [
    'Gute Erkennung von Wurfmustern',
    'Starke Positionierung bei Flügel-Situationen',
    'Ruhige Entscheidungsfindung bei Tempogegenstößen',
  ],
  improve_de: [
    'Vermeide zu frühes Heraustreten',
    'Nutze frühere Würfe als Information, nicht als Gewissheit',
    'Bleib unter Druck ausgeglichen',
  ],
  recommendation_de:
    'Wiederhole diese Einheit in 48 Stunden und konzentriere dich darauf, deine erste Bewegung zu verzögern.',
};

export function getMetricRating(metric: string, correctCount: number, total: number): string {
  const ratio = total > 0 ? correctCount / total : 0;
  if (ratio >= 0.8) return 'Strong';
  if (ratio >= 0.6) return 'Good';
  return 'Developing';
}
