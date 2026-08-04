import { Stack } from 'expo-router';

export default function CoachDashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0D' } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="players" />
      <Stack.Screen name="player-report" />
      <Stack.Screen name="team-analysis" />
      <Stack.Screen name="assign" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}
