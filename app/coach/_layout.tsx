import { Stack } from 'expo-router';

export default function CoachLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0D' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="report" />
      <Stack.Screen name="weekly" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="type" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}
