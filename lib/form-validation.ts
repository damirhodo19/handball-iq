const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidPassword(value: string, minLength = 6): boolean {
  return value.length >= minLength;
}

export function isValidDateString(value: string): boolean {
  if (!value.trim()) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export function isValidInviteCode(value: string): boolean {
  return value.trim().length >= 4;
}

export function extractInviteToken(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const queryMatch = trimmed.match(/[?&]token=([^&#]+)/i);
  if (queryMatch?.[1]) {
    try {
      return decodeURIComponent(queryMatch[1]).trim();
    } catch {
      return queryMatch[1].trim();
    }
  }

  const withoutQuery = trimmed.split(/[?#]/, 1)[0];
  const segments = withoutQuery.split('/').filter(Boolean);
  return (segments.at(-1) ?? trimmed).trim();
}

export function isValidInviteToken(value: string): boolean {
  return extractInviteToken(value).length >= 8;
}
