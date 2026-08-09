import { useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import { ShieldOff } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useCoachAccess } from '@/hooks/useCoachAccess';
import { useDevAuth } from '@/context/DevAuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export function CoachRouteGuard({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { session, isCoach, isPlayer, loading } = useCoachAccess();
  const { isDevAuthenticated } = useDevAuth();

  useEffect(() => {
    if (loading) return;
    if (!session && !isDevAuthenticated) {
      router.replace('/coach-dashboard/login');
    }
  }, [loading, session, isDevAuthenticated]);

  if (loading) {
    return (
      <ScreenBackground>
        <LoadingState message={t('common.loading')} accessibilityLabel={t('common.loading')} />
      </ScreenBackground>
    );
  }

  if (!session && !isDevAuthenticated) {
    return null;
  }

  if (isPlayer && !isDevAuthenticated) {
    return (
      <ScreenBackground>
        <ErrorState
          title={t('coachDashboard.coachesOnly')}
          message={t('coachDashboard.coachesOnlyDesc')}
          icon={<ShieldOff size={40} color={Colors.error} />}
          onGoBack={() => router.replace('/(tabs)/home')}
          goBackLabel={t('coachDashboard.returnHome')}
        />
      </ScreenBackground>
    );
  }

  if (!isCoach && !isDevAuthenticated) {
    return (
      <ScreenBackground>
        <ErrorState
          title={t('coachDashboard.noTeam')}
          message={t('coachDashboard.setupRequired')}
          icon={<ShieldOff size={40} color={Colors.gold} />}
          onGoBack={() => router.replace('/coach-dashboard/login')}
          goBackLabel={t('coachDashboard.createTeam')}
        />
      </ScreenBackground>
    );
  }

  return <>{children}</>;
}
