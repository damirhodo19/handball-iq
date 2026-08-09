import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { isValidInviteCode, isValidInviteToken } from '@/lib/form-validation';
import { mapServiceError } from '@/lib/map-error';
import { joinTeamByCode, joinTeamByInviteToken } from '@/lib/team-platform/platform';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

export default function JoinTeamScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = user?.id ?? `player_${Date.now()}`;

  const handleJoinCode = async () => {
    setError('');
    setSuccess('');
    if (!isValidInviteCode(code)) { setError(t('team.errorEmptyCode')); return; }
    const { error: err, team } = await joinTeamByCode(code.trim(), userId, user?.email ?? t('role.player'));
    if (err) setError(mapServiceError(err, t));
    else setSuccess(t('team.joinSuccess', { name: team?.name ?? '' }));
  };

  const handleJoinLink = async () => {
    setError('');
    setSuccess('');
    if (!isValidInviteToken(token)) { setError(t('team.errorEmptyLink')); return; }
    const linkToken = token.includes('/') ? token.split('/').pop()! : token.trim();
    const { error: err, team } = await joinTeamByInviteToken(linkToken, userId, user?.email ?? t('role.player'));
    if (err) setError(mapServiceError(err, t));
    else setSuccess(t('team.joinSuccess', { name: team?.name ?? '' }));
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('team.joinTeam')}</Text>
            <Text style={styles.headerSub}>{t('team.joinSub')}</Text>
          </View>
          <Users size={24} color={Colors.gold} />
        </View>

        <Text style={styles.label}>{t('team.enterCode')}</Text>
        <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder={t('team.codePlaceholder')} placeholderTextColor={Colors.textQuaternary} autoCapitalize="characters" />
        <Button label={t('team.joinByCode')} onPress={handleJoinCode} />

        <Text style={styles.divider}>{t('common.or')}</Text>

        <Text style={styles.label}>{t('team.enterLink')}</Text>
        <TextInput style={styles.input} value={token} onChangeText={setToken} placeholder={t('team.linkPlaceholder')} placeholderTextColor={Colors.textQuaternary} autoCapitalize="none" />
        <Button label={t('team.joinByLink')} onPress={handleJoinLink} variant="outline" />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  divider: { textAlign: 'center', color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', marginVertical: Spacing.sm },
  error: { color: Colors.error, fontFamily: 'Inter-Regular', textAlign: 'center' },
  success: { color: Colors.success, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
});
