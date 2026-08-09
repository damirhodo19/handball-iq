type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function mapAuthError(raw: string | null | undefined, t: TranslateFn): string {
  if (!raw) return t('auth.errorGeneric');
  const m = raw.toLowerCase();

  if (m.includes('rate limit')) return t('auth.errorRateLimit');
  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) return t('auth.errorInvalidCredentials');
  if (m.includes('email not confirmed') || m.includes('confirm your email')) return t('auth.errorEmailNotConfirmed');
  if (m.includes('already registered') || m.includes('already been registered')) return t('auth.errorAlreadyRegistered');
  if (m.includes('password') && (m.includes('weak') || m.includes('short') || m.includes('least'))) return t('auth.errorShortPassword');
  if (m.includes('invalid email') || m.includes('unable to validate email')) return t('auth.errorInvalidEmail');
  if (m.includes('signups not allowed')) return t('auth.errorSignupsDisabled');
  if (m.includes('user not found')) return t('auth.errorUserNotFound');
  if (raw.startsWith('auth.') || raw.startsWith('error.')) return t(raw);

  return t('auth.errorGeneric');
}

export function mapServiceError(raw: string | null | undefined, t: TranslateFn): string {
  if (!raw) return t('error.unknown');
  const m = raw.toLowerCase();

  if (m.includes('row-level security') || m.includes('permission denied') || m.includes('jwt')) {
    return t('error.permissionDenied');
  }
  if (m.includes('duplicate') || m.includes('already exists') || m.includes('already a member')) {
    return t('error.alreadyExists');
  }
  if (m.includes('network') || m.includes('fetch failed') || m.includes('failed to fetch')) {
    return t('error.serverConnectFailed');
  }
  if (m.includes('invalid invitation') || m.includes('invalid code')) return t('error.invalidCode');
  if (m.includes('not found')) return t('error.notFound');
  if (raw.startsWith('error.')) return t(raw);

  return t('error.unknown');
}
