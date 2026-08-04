import { Stack } from 'expo-router';

export default function MatchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0D' } }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="play" />
      <Stack.Screen name="report" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
