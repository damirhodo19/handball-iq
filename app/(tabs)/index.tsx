import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';

export default function TabsEntry() {
  const { session, profile, loading } = useAuth();
  const { isDevAuthenticated } = useDevAuth();

  if (loading && !isDevAuthenticated) return null;

  if (isDevAuthenticated) return <Redirect href="/(tabs)/home" />;

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.onboarded) return <Redirect href="/(auth)/onboarding" />;

  return <Redirect href="/(tabs)/home" />;
}
