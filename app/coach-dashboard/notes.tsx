import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { NotebookPen, Trash2, UserRound } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  addCoachWorkspaceNote,
  loadCoachRosterForTeam,
  loadCoachWorkspaceNotesForTeam,
  removeCoachWorkspaceNote,
  syncCoachWorkspaceForTeam,
  type CoachRosterPlayer,
  type CoachWorkspaceNote,
} from '@/lib/coach-workspace';
import { getActiveTeam } from '@/lib/team-platform/platform';
import type { NoteType } from '@/lib/team-platform/types';
import { Colors, Radius, Spacing } from '@/lib/theme';

const NOTE_TYPES: NoteType[] = ['training', 'injury', 'mental', 'general'];

export default function CoachNotesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const coachId = user?.id ?? 'dev_coach';
  const team = getActiveTeam();
  const teamKey = team?.id ?? 'default';
  const [players, setPlayers] = useState<CoachRosterPlayer[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [noteType, setNoteType] = useState<NoteType>('general');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<CoachWorkspaceNote[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(() => {
    setPlayers(loadCoachRosterForTeam(coachId, teamKey));
    setNotes(loadCoachWorkspaceNotesForTeam(coachId, teamKey, selectedPlayerId));
  }, [coachId, teamKey, selectedPlayerId]);

  useFocusEffect(useCallback(() => {
    let active = true;
    refresh();
    (async () => {
      const error = await syncCoachWorkspaceForTeam(coachId, teamKey);
      if (!active) return;
      if (error) setMessage(t('team.workspaceSyncError'));
      refresh();
    })();
    return () => { active = false; };
  }, [coachId, teamKey, refresh, t]));

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const selectedPlayer = players.find((player) => player.id === selectedPlayerId);
    const { cloudError } = await addCoachWorkspaceNote({
      coachId,
      teamKey: selectedPlayer?.team_key ?? teamKey,
      rosterPlayerId: selectedPlayerId,
      noteType,
      content,
    });
    setContent('');
    setMessage(cloudError ? t('team.savedLocally') : t('team.noteSaved'));
    refresh();
    setSaving(false);
  };

  const handleDelete = async (noteId: string) => {
    const error = await removeCoachWorkspaceNote(coachId, noteId);
    setMessage(error ? t('team.savedLocally') : '');
    refresh();
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{t('team.coachNotes')}</Text>
            <Text style={styles.headerSub}>{t('team.coachNotesPrivate')}</Text>
          </View>
        </View>

        <Text style={styles.label}>{t('team.notesFor')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playerRow}>
          <TouchableOpacity
            style={[styles.playerChip, selectedPlayerId === null && styles.playerChipActive]}
            onPress={() => setSelectedPlayerId(null)}
          >
            <NotebookPen size={14} color={selectedPlayerId === null ? Colors.background : Colors.gold} />
            <Text style={[styles.playerChipText, selectedPlayerId === null && styles.playerChipTextActive]}>
              {t('team.generalNotes')}
            </Text>
          </TouchableOpacity>
          {players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={[styles.playerChip, selectedPlayerId === player.id && styles.playerChipActive]}
              onPress={() => setSelectedPlayerId(player.id)}
            >
              <UserRound size={14} color={selectedPlayerId === player.id ? Colors.background : Colors.gold} />
              <Text style={[styles.playerChipText, selectedPlayerId === player.id && styles.playerChipTextActive]}>
                {player.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>{t('team.noteType')}</Text>
        <View style={styles.typeRow}>
          {NOTE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, noteType === type && styles.typeActive]}
              onPress={() => setNoteType(type)}
            >
              <Text style={[styles.typeText, noteType === type && styles.typeTextActive]}>
                {t(`team.note.${type}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.textarea}
          value={content}
          onChangeText={setContent}
          placeholder={t('team.notePlaceholder')}
          placeholderTextColor={Colors.textQuaternary}
          multiline
          numberOfLines={5}
          maxLength={5000}
        />
        <Button label={t('team.saveNote')} onPress={handleSave} loading={saving} disabled={!content.trim()} />
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Text style={styles.section}>{t('team.previousNotes')}</Text>
        {notes.length === 0 ? (
          <EmptyState
            icon={<NotebookPen size={30} color={Colors.gold} />}
            title={t('team.noNotes')}
            description={t('team.noNotesSub')}
          />
        ) : (
          notes.map((note) => (
            <Card key={note.id} variant="gradient" shadow="card" style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteType}>{t(`team.note.${note.note_type}`)}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(note.id)} accessibilityLabel={t('common.delete')}>
                  <Trash2 size={16} color={Colors.textQuaternary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteContent}>{note.content}</Text>
              <Text style={styles.noteDate}>{new Date(note.created_at).toLocaleDateString()}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, marginTop: Spacing.sm },
  playerRow: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  playerChip: { minHeight: 42, paddingHorizontal: 14, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
  playerChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  playerChipText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  playerChipTextActive: { color: Colors.background },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  typeActive: { backgroundColor: Colors.goldSoft, borderColor: Colors.gold },
  typeText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },
  typeTextActive: { color: Colors.gold },
  textarea: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 15, padding: Spacing.md, minHeight: 120, textAlignVertical: 'top' },
  message: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold, textAlign: 'center' },
  section: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginTop: Spacing.md },
  noteCard: { gap: Spacing.sm },
  noteHeader: { flexDirection: 'row', alignItems: 'center' },
  noteType: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },
  deleteButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  noteContent: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  noteDate: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
});
