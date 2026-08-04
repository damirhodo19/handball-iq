import { ReactNode } from 'react';
import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/SessionContext';

export default function SessionLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0D' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="scenario" />
        <Stack.Screen name="results" />
        <Stack.Screen name="review" />
      </Stack>
    </SessionProvider>
  );
}
