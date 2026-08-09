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

export function isValidInviteToken(value: string): boolean {
  const token = value.includes('/') ? value.split('/').pop() ?? '' : value;
  return token.trim().length >= 8;
}
