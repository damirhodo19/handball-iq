import { Stack, usePathname } from 'expo-router';
import { CoachRouteGuard } from '@/components/CoachRouteGuard';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function CoachDashboardLayout() {
  const pathname = usePathname();
  const isPublic = pathname === '/coach-dashboard/login' || pathname === '/coach-dashboard/join';
  const { themeVersion } = useTheme();
  void themeVersion;

  const stack = (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="clubs" />
      <Stack.Screen name="create-team" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="join" />
      <Stack.Screen name="join-requests" />
      <Stack.Screen name="players" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="player-report" />
      <Stack.Screen name="player-hub" />
      <Stack.Screen name="team-analysis" />
      <Stack.Screen name="assign" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="leaderboards" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="notes" />
    </Stack>
  );

  if (isPublic) return stack;

  return <CoachRouteGuard>{stack}</CoachRouteGuard>;
}
