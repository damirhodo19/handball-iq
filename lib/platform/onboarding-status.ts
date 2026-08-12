import type { Profile } from '@/types/database';

type OnboardingProfile = Pick<
  Profile,
  | 'role'
  | 'onboarded'
  | 'onboarding_version'
  | 'country'
  | 'primary_position'
  | 'position'
  | 'dominant_hand'
  | 'playing_level'
  | 'development_goal'
  | 'development_goals'
  | 'coach_type'
  | 'experience_band'
  | 'favorite_defense'
  | 'favorite_attack'
  | 'coach_development_goal'
  | 'coach_development_goals'
>;

function hasPlayerProfile(profile: OnboardingProfile): boolean {
  return Boolean(
    profile.country &&
      (profile.primary_position || profile.position) &&
      profile.dominant_hand &&
      profile.playing_level &&
      (profile.development_goals?.length || profile.development_goal),
  );
}

function hasCoachProfile(profile: OnboardingProfile): boolean {
  return Boolean(
    profile.country &&
      profile.coach_type &&
      profile.experience_band &&
      profile.favorite_defense &&
      profile.favorite_attack &&
      (profile.coach_development_goals?.length || profile.coach_development_goal),
  );
}

/**
 * A durable onboarding decision shared by every auth route.
 *
 * The explicit flags remain authoritative. The field-based fallback repairs older
 * accounts that already contain every required answer but predate those flags.
 */
export function hasCompletedOnboarding(profile: OnboardingProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.onboarded || Number(profile.onboarding_version) >= 2) return true;
  if (profile.role === 'admin') return true;
  if (profile.role === 'coach') return hasCoachProfile(profile);
  if (profile.role === 'player_coach') {
    return hasPlayerProfile(profile) && hasCoachProfile(profile);
  }
  return hasPlayerProfile(profile);
}
