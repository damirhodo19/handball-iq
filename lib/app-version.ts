import Constants from 'expo-constants';

/** Marketing / store version (independent of build number). */
export const APP_VERSION =
  Constants.expoConfig?.version ??
  (Constants.manifest as { version?: string } | null)?.version ??
  '0.9.0';

/** Native build counter — iOS CFBundleVersion / Android versionCode when available. */
export const APP_BUILD =
  Constants.expoConfig?.ios?.buildNumber ??
  (Constants.expoConfig?.android?.versionCode != null
    ? String(Constants.expoConfig.android.versionCode)
    : '1');

export const APP_DISPLAY_NAME = 'Handball IQ';

/** e.g. Handball IQ · Beta 0.9.0 (1) */
export function getBetaVersionLabel(): string {
  return `${APP_DISPLAY_NAME} · Beta ${APP_VERSION} (${APP_BUILD})`;
}

/** Mailto target for closed-beta feedback (public, not a secret). */
export const BETA_FEEDBACK_EMAIL = 'beta@llhprojects.com';

export type BetaFeedbackCategory =
  | 'bug'
  | 'translation'
  | 'terminology'
  | 'wrong_answer'
  | 'feature';

export function buildBetaFeedbackMailto(
  category: BetaFeedbackCategory,
  note: string,
  meta?: { language?: string; position?: string; role?: string },
): string {
  const labels: Record<BetaFeedbackCategory, string> = {
    bug: 'Bug',
    translation: 'Translation issue',
    terminology: 'Wrong handball terminology',
    wrong_answer: 'Wrong answer',
    feature: 'Feature suggestion',
  };
  const subject = encodeURIComponent(`[Handball IQ Beta ${APP_VERSION}] ${labels[category]}`);
  const body = encodeURIComponent(
    [
      `Category: ${labels[category]}`,
      `App: ${getBetaVersionLabel()}`,
      `Language: ${meta?.language ?? '—'}`,
      `Position: ${meta?.position ?? '—'}`,
      `Role: ${meta?.role ?? '—'}`,
      '',
      'Details:',
      note.trim() || '(no details provided)',
    ].join('\n'),
  );
  return `mailto:${BETA_FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}
