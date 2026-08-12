import { Image, StyleSheet, Text, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { Colors } from '@/lib/theme';

export function ProfileAvatar({ uri, size = 48, fallback }: { uri?: string | null; size?: number; fallback?: string }) {
  const frame = { width: size, height: size, borderRadius: Math.round(size * 0.34) };
  if (uri) return <Image source={{ uri }} style={[styles.frame, frame]} resizeMode="cover" />;
  return <View style={[styles.frame, frame]}>{fallback ? <Text style={[styles.letter, { fontSize: size * 0.42 }]}>{fallback[0]?.toUpperCase()}</Text> : <UserRound size={size * 0.48} color={Colors.gold} />}</View>;
}

const styles = StyleSheet.create({
  frame: { backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  letter: { fontFamily: 'Inter-ExtraBold', color: Colors.gold },
});
