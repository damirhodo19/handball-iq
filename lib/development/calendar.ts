/**
 * Timezone-safe local calendar helpers for streaks, daily goals, and programs.
 * Always use the device's local calendar day — never UTC date slicing alone.
 */

export function localDateParts(date: Date = new Date()): { y: number; m: number; d: number } {
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
  };
}

export function formatLocalDate(date: Date = new Date()): string {
  const { y, m, d } = localDateParts(date);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function parseLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function todayStr(): string {
  return formatLocalDate(new Date());
}

/** Monday of the current local week as YYYY-MM-DD */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatLocalDate(d);
}

/** Monday-based day index: 0 = Mon … 6 = Sun */
export function getTodayDayIndex(date: Date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function daysBetweenLocal(a: string, b: string): number {
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function addLocalDays(isoDate: string, days: number): string {
  const d = parseLocalDate(isoDate);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
}
