import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';

export default function ProgramsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
