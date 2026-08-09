import { SupportedLanguage } from '@/locales';
import { scenarioTextDe, scenarioTextHr } from '@/locales/scenario-text';
import { translatePlayerType, translateSkill, TFunc } from '@/lib/translations';
import { SESSION_RESULTS } from '@/lib/scenarios';
import { SESSION_INFO } from '@/lib/scenarios';
import { getDailySession } from '@/lib/positions';
import type { HandballPosition } from '@/lib/positions';
import { loadProfile } from '@/lib/storage';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';

function pickLocalizedField<T extends string | string[]>(
  info: Record<string, unknown>,
  baseKey: string,
  lang: SupportedLanguage,
): T {
  if (lang === 'en') return info[baseKey] as T;
  const suffix = lang === 'hr' ? '_hr' : '_de';
  return (info[`${baseKey}${suffix}`] as T | undefined) ?? (info[baseKey] as T);
}

/**
 * Session intro copy must follow the player's position.
 * Never fall back to the legacy Goalkeeper SESSION_INFO title/subtitle for field players.
 */
export function getLocalizedSessionInfo(
  lang: SupportedLanguage,
  position?: HandballPosition | null,
) {
  const resolved =
    position !== undefined ? position : resolvePlayerPosition(loadProfile());
  const daily = getDailySession(resolved);

  if (daily && resolved && resolved !== 'Goalkeeper') {
    return {
      title: daily.title,
      subtitle: `${resolved} IQ`,
      sessionNumber: pickLocalizedField<string>(SESSION_INFO, 'sessionNumber', lang),
      description: daily.desc,
      structure: pickLocalizedField<string[]>(SESSION_INFO, 'structure', lang),
      instruction: pickLocalizedField<string>(SESSION_INFO, 'instruction', lang),
      duration: SESSION_INFO.duration,
      difficulty: SESSION_INFO.difficulty,
    };
  }

  if (daily && resolved === 'Goalkeeper') {
    return {
      title: pickLocalizedField<string>(SESSION_INFO, 'title', lang),
      subtitle: pickLocalizedField<string>(SESSION_INFO, 'subtitle', lang),
      sessionNumber: pickLocalizedField<string>(SESSION_INFO, 'sessionNumber', lang),
      description: pickLocalizedField<string>(SESSION_INFO, 'description', lang),
      structure: pickLocalizedField<string[]>(SESSION_INFO, 'structure', lang),
      instruction: pickLocalizedField<string>(SESSION_INFO, 'instruction', lang),
      duration: SESSION_INFO.duration,
      difficulty: SESSION_INFO.difficulty,
    };
  }

  // No position — generic player session (never Goalkeeper IQ)
  return {
    title: lang === 'hr' ? 'Trening odlučivanja' : lang === 'de' ? 'Entscheidungstraining' : 'Decision Training',
    subtitle: 'Handball IQ',
    sessionNumber: pickLocalizedField<string>(SESSION_INFO, 'sessionNumber', lang),
    description:
      lang === 'hr'
        ? 'Analizirat ćete pet realnih situacija iz utakmice i odabrati najbolji odgovor za svoju poziciju.'
        : lang === 'de'
          ? 'Du analysierst fünf realistische Spielsituationen und wählst die beste Reaktion für deine Position.'
          : 'You will analyze five realistic match situations and choose the best response for your position.',
    structure: pickLocalizedField<string[]>(SESSION_INFO, 'structure', lang),
    instruction: pickLocalizedField<string>(SESSION_INFO, 'instruction', lang),
    duration: SESSION_INFO.duration,
    difficulty: SESSION_INFO.difficulty,
  };
}

export function localizeContent(text: string, lang: SupportedLanguage, t?: TFunc): string {
  if (!text || lang === 'en') return text;

  if (t) {
    const asSkill = translateSkill(text, t);
    if (asSkill !== text) return asSkill;
    const asType = translatePlayerType(text, t);
    if (asType !== text) return asType;
  }

  const map = lang === 'hr' ? scenarioTextHr : scenarioTextDe;
  return map[text] ?? text;
}

export function localizeContentList(texts: string[], lang: SupportedLanguage, t?: TFunc): string[] {
  return texts.map((text) => localizeContent(text, lang, t));
}

export function getLocalizedSessionResults(lang: SupportedLanguage, position?: HandballPosition | null) {
  const resolved =
    position !== undefined ? position : resolvePlayerPosition(loadProfile());

  if (resolved && resolved !== 'Goalkeeper') {
    const generic = {
      strengths: [
        'Clear early decisions under pressure',
        'Good recognition of space and timing',
        'Calm choices in transition moments',
      ],
      strengths_hr: [
        'Jasne rane odluke pod pritiskom',
        'Dobro prepoznavanje prostora i tajminga',
        'Mirni izbori u tranzicijskim trenucima',
      ],
      strengths_de: [
        'Klare frühe Entscheidungen unter Druck',
        'Gute Wahrnehmung von Raum und Timing',
        'Ruhige Entscheidungen in Umschaltmomenten',
      ],
      improve: [
        'Scan before you commit',
        'Prefer the highest-percentage option',
        'Stay balanced when the defence recovers',
      ],
      improve_hr: [
        'Pregledaj prije nego što se odlučiš',
        'Biraj opciju s najvećim postotkom uspjeha',
        'Ostani uravnotežen kad se obrana vrati',
      ],
      improve_de: [
        'Scanne, bevor du dich festlegst',
        'Bevorzuge die Option mit der höchsten Erfolgsquote',
        'Bleib ausgeglichen, wenn die Abwehr nachrückt',
      ],
      recommendation:
        'Repeat this session in 48 hours and focus on one decision cue at a time.',
      recommendation_hr:
        'Ponovi ovaj trening za 48 sati i fokusiraj se na jedan signal za odluku.',
      recommendation_de:
        'Wiederhole diese Einheit in 48 Stunden und fokussiere dich auf ein Entscheidungssignal.',
    };
    if (lang === 'en') {
      return {
        strengths: generic.strengths,
        improve: generic.improve,
        recommendation: generic.recommendation,
      };
    }
    const suffix = lang === 'hr' ? '_hr' : '_de';
    return {
      strengths: generic[`strengths${suffix}` as keyof typeof generic] as string[],
      improve: generic[`improve${suffix}` as keyof typeof generic] as string[],
      recommendation: generic[`recommendation${suffix}` as keyof typeof generic] as string,
    };
  }

  if (lang === 'en') {
    return {
      strengths: SESSION_RESULTS.strengths,
      improve: SESSION_RESULTS.improve,
      recommendation: SESSION_RESULTS.recommendation,
    };
  }
  const suffix = lang === 'hr' ? '_hr' : '_de';
  const s = SESSION_RESULTS as typeof SESSION_RESULTS & {
    strengths_de?: string[];
    improve_de?: string[];
    recommendation_de?: string;
  };
  return {
    strengths: (s[`strengths${suffix}` as keyof typeof s] as string[] | undefined) ?? SESSION_RESULTS.strengths,
    improve: (s[`improve${suffix}` as keyof typeof s] as string[] | undefined) ?? SESSION_RESULTS.improve,
    recommendation:
      (s[`recommendation${suffix}` as keyof typeof s] as string | undefined) ?? SESSION_RESULTS.recommendation,
  };
}
