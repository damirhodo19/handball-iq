import type { UserProfile } from '@/lib/storage';
import type { AppRole } from '@/lib/platform/types';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function getPositionGroupKey(position: string | null | undefined): string {
  const p = (position ?? '').toLowerCase();
  if (p.includes('goalkeeper') || p === 'gk') return 'goalkeeper';
  if (p.includes('wing')) return 'wing';
  if (p.includes('pivot')) return 'pivot';
  if (p.includes('back')) return 'back';
  return 'general';
}

export function resolveAppRole(profile: UserProfile): AppRole {
  if (profile.role === 'player_coach' || profile.role === 'coach' || profile.role === 'player' || profile.role === 'admin') {
    return profile.role;
  }
  return 'player';
}

export function getTodaysFocusKey(profile: UserProfile): string {
  const role = resolveAppRole(profile);
  if (role === 'coach') {
    const goal = profile.coachDevelopmentGoal ?? profile.developmentGoal ?? 'Tactics';
    return `home.focus.coach.${goal.replace(/\s+/g, '')}`;
  }
  const group = getPositionGroupKey(profile.position);
  const goal = profile.developmentGoal ?? 'Decision Making';
  return `home.focus.${group}.${goal.replace(/\s+/g, '')}`;
}

export function getRecommendedSessionKey(profile: UserProfile): string {
  const role = resolveAppRole(profile);
  if (role === 'coach' || role === 'player_coach' && !profile.position) {
    return 'home.rec.coach.tactical';
  }
  const group = getPositionGroupKey(profile.position);
  return `home.rec.${group}`;
}

export function getPersonalizedFocus(profile: UserProfile, t: TranslateFn): string {
  const key = getTodaysFocusKey(profile);
  const translated = t(key);
  if (translated !== key) return translated;

  const role = resolveAppRole(profile);
  if (role === 'coach') return t('home.focus.coach.default');
  const group = getPositionGroupKey(profile.position);
  return t(`home.focus.${group}.default`);
}

export function getPersonalizedRecommendation(profile: UserProfile, t: TranslateFn): {
  title: string;
  subtitle: string;
  route: string;
} {
  const role = resolveAppRole(profile);
  if (role === 'coach') {
    return {
      title: t('home.rec.coach.title'),
      subtitle: t('home.rec.coach.subtitle'),
      route: '/coach-dashboard',
    };
  }
  const group = getPositionGroupKey(profile.position);
  return {
    title: t(`home.rec.${group}.title`),
    subtitle: t(`home.rec.${group}.subtitle`),
    route: '/session',
  };
}

export function profileNeedsCompletion(profile: UserProfile): boolean {
  if (!profile.role) return true;
  if (!profile.country) return true;
  if (profile.role === 'player' || profile.role === 'player_coach') {
    if (!profile.position || !profile.dominantHand || !profile.playingLevel || !profile.developmentGoal) {
      return true;
    }
  }
  if (profile.role === 'coach' || profile.role === 'player_coach') {
    if (!profile.coachType || !profile.experienceBand || !profile.favoriteDefense || !profile.favoriteAttack) {
      return true;
    }
    if (!profile.coachDevelopmentGoal && profile.role === 'coach') return true;
  }
  return profile.onboardingVersion < 2;
}

/** Player Mode: position missing → block personalized player content. */
export function playerPositionMissing(profile: UserProfile): boolean {
  if (profile.role === 'coach') return false;
  return resolvePlayerPosition(profile) == null;
}
