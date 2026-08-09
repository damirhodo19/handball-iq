import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { getActiveTeam } from '@/lib/team-platform/platform';
import { localFetchMembers, localCreateNote, localFetchNotes } from '@/lib/team-platform/storage';
import type { CoachNote, NoteType, TeamMemberRecord } from '@/lib/team-platform/types';

const NOTE_TYPES: NoteType[] = ['training', 'injury', 'mental', 'general'];

export default function CoachNotesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMemberRecord | null>(null);
  const [noteType, setNoteType] = useState<NoteType>('training');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<CoachNote[]>([]);

  useFocusEffect(useCallback(() => {
    const team = getActiveTeam();
    if (team) {
      setMembers(localFetchMembers(team.id));
      if (selectedPlayer) setNotes(localFetchNotes(team.id, selectedPlayer.user_id));
    }
  }, [selectedPlayer]));

  const handleSave = () => {
    const team = getActiveTeam();
    if (!team || !selectedPlayer || !content.trim()) return;
    localCreateNote({
      team_id: team.id,
      player_id: selectedPlayer.user_id,
      coach_id: user?.id ?? 'dev_coach',
      note_type: noteType,
      content: content.trim(),
    });
    setContent('');
    setNotes(localFetchNotes(team.id, selectedPlayer.user_id));
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>{t('team.coachNotes')}</Text>
        </View>

        <Text style={styles.label}>{t('cdAssign.selectPlayer')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerScroll}>
          {members.map((m) => (
            <TouchableOpacity key={m.user_id} style={[styles.playerChip, selectedPlayer?.user_id === m.user_id && styles.playerChipActive]} onPress={() => setSelectedPlayer(m)}>
              <Text style={[styles.playerChipText, selectedPlayer?.user_id === m.user_id && styles.playerChipTextActive]}>{m.display_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedPlayer && (
          <>
            <Text style={styles.label}>{t('team.noteType')}</Text>
            <View style={styles.typeRow}>
              {NOTE_TYPES.map((nt) => (
                <TouchableOpacity key={nt} style={[styles.typeChip, noteType === nt && styles.typeActive]} onPress={() => setNoteType(nt)}>
                  <Text style={[styles.typeText, noteType === nt && styles.typeTextActive]}>{t(`team.note.${nt}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput style={styles.textarea} value={content} onChangeText={setContent} placeholder={t('team.notePlaceholder')} placeholderTextColor={Colors.textQuaternary} multiline numberOfLines={4} />
            <Button label={t('team.saveNote')} onPress={handleSave} />

            <Text style={styles.section}>{t('team.previousNotes')}</Text>
            {notes.map((n) => (
              <Card key={n.id} variant="gradient" shadow="card" style={styles.noteCard}>
                <Text style={styles.noteType}>{t(`team.note.${n.note_type}`)}</Text>
                <Text style={styles.noteContent}>{n.content}</Text>
                <Text style={styles.noteDate}>{new Date(n.created_at).toLocaleDateString()}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, marginTop: Spacing.md },
  playerScroll: { marginVertical: Spacing.sm },
  playerChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm },
  playerChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  playerChipText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  playerChipTextActive: { color: Colors.background },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  typeActive: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  typeText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },
  typeTextActive: { color: Colors.gold },
  textarea: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 15, padding: Spacing.md, minHeight: 100, textAlignVertical: 'top' },
  section: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginTop: Spacing.lg },
  noteCard: { gap: 4 },
  noteType: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  noteContent: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  noteDate: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
});
