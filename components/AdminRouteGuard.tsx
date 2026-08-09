import { useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import { ShieldOff } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useTranslation } from '@/hooks/useTranslation';

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { session, isAdmin, loading } = useAdminAccess();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hbiq_admin_session');
    }
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/(auth)/login');
    }
  }, [loading, session]);

  if (loading) {
    return (
      <ScreenBackground>
        <LoadingState message={t('common.loading')} accessibilityLabel={t('common.loading')} />
      </ScreenBackground>
    );
  }

  if (!session) {
    return null;
  }

  if (!isAdmin) {
    return (
      <ScreenBackground>
        <ErrorState
          title={t('admin.accessDenied')}
          message={t('admin.accessDeniedDesc')}
          icon={<ShieldOff size={40} color={Colors.error} />}
          onGoBack={() => router.replace('/(tabs)/home')}
          goBackLabel={t('admin.return')}
        />
      </ScreenBackground>
    );
  }

  return <>{children}</>;
}
