import { Stack } from 'expo-router';

export default function MatchDayLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0D' } }}>
      <Stack.Screen name="setup" />
      <Stack.Screen name="prepare" />
      <Stack.Screen name="ready" />
      <Stack.Screen name="reflection" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
