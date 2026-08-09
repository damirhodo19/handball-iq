/** Stable activity keys so refresh / retry / remount cannot mint a new XP event. */

export function stableActivityId(prefix: string, parts: Array<string | number | boolean | null | undefined>): string {
  const raw = parts.map((p) => String(p ?? '')).join('|');
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${prefix}_${(h >>> 0).toString(36)}`;
}
