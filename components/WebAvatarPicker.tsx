import { createElement, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, Trash2 } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/lib/theme';
import { ProfileAvatar } from '@/components/ProfileAvatar';

export function WebAvatarPicker(props: { avatarUrl?: string | null; fallback?: string; uploading: boolean; chooseLabel: string; removeLabel: string; unavailableLabel: string; onChoose: (file: File) => void; onRemove: () => void }) {
  const inputRef = useRef<{ click?: () => void; value?: string } | null>(null);
  const isWeb = Platform.OS === 'web';
  return <View style={styles.wrap}>
    <ProfileAvatar uri={props.avatarUrl} fallback={props.fallback} size={84} />
    <View style={styles.actions}>
      {isWeb ? createElement('input', { ref: inputRef, type: 'file', accept: 'image/*,.heic,.heif,.jfif', style: { display: 'none' }, onChange: (event: { target?: { files?: FileList; value?: string } }) => { const file = event.target?.files?.[0]; if (file) props.onChoose(file); if (event.target) event.target.value = ''; } }) : null}
      <TouchableOpacity style={[styles.choose, (!isWeb || props.uploading) && styles.disabled]} disabled={!isWeb || props.uploading} onPress={() => inputRef.current?.click?.()}><Camera size={16} color={Colors.background} /><Text style={styles.chooseText}>{props.uploading ? '…' : props.chooseLabel}</Text></TouchableOpacity>
      {props.avatarUrl ? <TouchableOpacity style={styles.remove} disabled={props.uploading} onPress={props.onRemove}><Trash2 size={15} color={Colors.error} /><Text style={styles.removeText}>{props.removeLabel}</Text></TouchableOpacity> : null}
      {!isWeb ? <Text style={styles.unavailable}>{props.unavailableLabel}</Text> : null}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, actions: { flex: 1, gap: Spacing.sm, alignItems: 'flex-start' },
  choose: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, borderRadius: Radius.pill, backgroundColor: Colors.gold }, chooseText: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.background }, disabled: { opacity: 0.5 },
  remove: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 }, removeText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.error }, unavailable: { fontFamily: 'Inter-Regular', fontSize: 10, lineHeight: 15, color: Colors.textTertiary },
});
