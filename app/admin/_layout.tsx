import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

export default function AdminLayout() {
  return (
    <AdminRouteGuard>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="users" />
        <Stack.Screen name="scenarios" />
        <Stack.Screen name="editor" />
        <Stack.Screen name="statistics" />
      </Stack>
    </AdminRouteGuard>
  );
}
