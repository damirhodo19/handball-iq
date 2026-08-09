import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { Colors } from '@/lib/theme';

export default function TabsEntry() {
  const { session, profile, loading } = useAuth();
  const { isDevAuthenticated } = useDevAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (session) {
    if (!profile?.onboarded) return <Redirect href="/(auth)/onboarding" />;
    return <Redirect href="/(tabs)/home" />;
  }

  if (__DEV__ && isDevAuthenticated) return <Redirect href="/(tabs)/home" />;

  return <Redirect href="/(auth)/login" />;
}
