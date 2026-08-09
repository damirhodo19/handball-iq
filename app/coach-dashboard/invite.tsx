import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Share } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Mail, Link, QrCode, Copy } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { getActiveTeam, createInvitation, getInviteLink, getTeamQrPayload } from '@/lib/team-platform/platform';

export default function InviteScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState(getActiveTeam());
  const [inviteLink, setInviteLink] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [message, setMessage] = useState('');

  useFocusEffect(useCallback(() => {
    const t = getActiveTeam();
    setTeam(t);
    if (t) setQrPayload(getTeamQrPayload(t));
  }, []));

  const handleEmailInvite = async () => {
    if (!team || !email.trim()) return;
    const { invitation } = await createInvitation({
      team_id: team.id,
      invited_by: user?.id ?? 'dev_coach',
      email: email.trim(),
    });
    if (invitation) {
      const link = getInviteLink(invitation.invite_token);
      setInviteLink(link);
      setMessage(t('team.inviteSent'));
    }
  };

  const handleLinkInvite = async () => {
    if (!team) return;
    const { invitation } = await createInvitation({
      team_id: team.id,
      invited_by: user?.id ?? 'dev_coach',
    });
    if (invitation) {
      const link = getInviteLink(invitation.invite_token);
      setInviteLink(link);
      await Share.share({ message: `${t('team.joinTeam')}: ${link}\n${t('team.code')}: ${team.invitation_code}` });
    }
  };

  const copyCode = () => {
    if (team?.invitation_code) {
      setMessage(`${t('team.code')}: ${team.invitation_code}`);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('team.invitePlayers')}</Text>
            <Text style={styles.headerSub}>{team?.name ?? '—'}</Text>
          </View>
        </View>

        <Card variant="gradient" shadow="card" style={styles.codeCard}>
          <Text style={styles.codeLabel}>{t('team.teamCode')}</Text>
          <Text style={styles.codeValue}>{team?.invitation_code ?? '—'}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyCode}>
            <Copy size={16} color={Colors.gold} />
            <Text style={styles.copyText}>{t('team.copyCode')}</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.section}>{t('team.inviteByEmail')}</Text>
        <View style={styles.row}>
          <Mail size={18} color={Colors.gold} />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t('coachLogin.emailPlaceholder')} placeholderTextColor={Colors.textQuaternary} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <Button label={t('team.sendInvite')} onPress={handleEmailInvite} />

        <Text style={styles.section}>{t('team.inviteByLink')}</Text>
        <Button label={t('team.generateLink')} onPress={handleLinkInvite} iconRight={<Link size={18} color={Colors.background} />} />

        <Text style={styles.section}>{t('team.inviteByQr')}</Text>
        <Card variant="gradient" shadow="card" style={styles.qrCard}>
          <QrCode size={48} color={Colors.gold} />
          <Text style={styles.qrPayload} numberOfLines={4}>{qrPayload || t('team.qrHint')}</Text>
          <Text style={styles.qrSub}>{t('team.qrScanHint')}</Text>
        </Card>

        {inviteLink ? <Text style={styles.link}>{inviteLink}</Text> : null}
        {message ? <Text style={styles.msg}>{message}</Text> : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  codeCard: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg },
  codeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1 },
  codeValue: { fontFamily: 'Inter-ExtraBold', fontSize: 32, color: Colors.gold, letterSpacing: 4 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm },
  copyText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold },
  section: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginTop: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  input: { flex: 1, backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  qrCard: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg },
  qrPayload: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, textAlign: 'center' },
  qrSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  link: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.gold },
  msg: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success, textAlign: 'center' },
});
