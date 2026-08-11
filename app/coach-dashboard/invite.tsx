import { useState, useCallback } from 'react';
import { Alert, View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Share, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ban, Clock3, Copy, Link, Mail, QrCode as QrCodeIcon, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/form-validation';
import {
  createInvitation,
  fetchInvitations,
  getInviteLink,
  getTeamQrPayload,
  revokeInvitation,
} from '@/lib/team-platform/platform';
import type { InviteStatus, TeamInvitation } from '@/lib/team-platform/types';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';

function visibleInviteStatus(invitation: TeamInvitation): InviteStatus {
  if (invitation.status === 'pending' && new Date(invitation.expires_at).getTime() <= Date.now()) {
    return 'expired';
  }
  return invitation.status;
}

function inviteStatusColor(status: InviteStatus): string {
  if (status === 'accepted') return Colors.success;
  if (status === 'expired') return Colors.warning;
  if (status === 'revoked') return Colors.error;
  return Colors.gold;
}

export default function InviteScreen() {
  const { t, lang } = useTranslation();
  const { user } = useAuth();
  const { team, refresh } = useTeamPlatform(user?.id, user?.email);
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);

  useFocusEffect(useCallback(() => {
    refresh();
  }, [refresh]));

  useFocusEffect(useCallback(() => {
    if (team) setQrPayload(getTeamQrPayload(team));
  }, [team]));

  const loadInvitations = useCallback(async () => {
    if (!team?.id) {
      setInvitations([]);
      return;
    }
    setInvitations(await fetchInvitations(team.id));
  }, [team?.id]);

  useFocusEffect(useCallback(() => {
    void loadInvitations();
  }, [loadInvitations]));

  const shareInvitation = async (link: string) => {
    if (!team) return;
    const shareMessage = `${t('team.joinTeam')}: ${link}\n${t('team.code')}: ${team.invitation_code}`;
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        if (navigator.share) {
          await navigator.share({ title: t('team.joinTeam'), text: shareMessage, url: link });
          setMessage(t('team.inviteReady'));
          return;
        }
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareMessage);
          setMessage(t('team.inviteCopied'));
          return;
        }
      }
      await Share.share({ message: shareMessage, url: link });
      setMessage(t('team.inviteReady'));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setMessage(t('team.inviteFailed'));
    }
  };

  const handleEmailInvite = async () => {
    if (!team) return;
    if (!isValidEmail(email)) {
      setMessage(t('auth.errorInvalidEmail'));
      return;
    }
    setBusy(true);
    setMessage('');
    const { invitation, error } = await createInvitation({
      team_id: team.id,
      invited_by: user?.id ?? 'dev_coach',
      email: email.trim(),
    });
    setBusy(false);
    if (error) {
      setMessage(t('team.inviteFailed'));
      return;
    }
    if (invitation) {
      const link = getInviteLink(invitation.invite_token);
      setInviteLink(link);
      setInvitations((current) => [invitation, ...current.filter((item) => item.id !== invitation.id)]);
      setEmail('');
      await shareInvitation(link);
    }
  };

  const handleLinkInvite = async () => {
    if (!team) return;
    setBusy(true);
    setMessage('');
    const { invitation, error } = await createInvitation({
      team_id: team.id,
      invited_by: user?.id ?? 'dev_coach',
    });
    setBusy(false);
    if (error) {
      setMessage(t('team.inviteFailed'));
      return;
    }
    if (invitation) {
      const link = getInviteLink(invitation.invite_token);
      setInviteLink(link);
      setInvitations((current) => [invitation, ...current.filter((item) => item.id !== invitation.id)]);
      await shareInvitation(link);
    }
  };

  const performRevoke = async (invitation: TeamInvitation) => {
    setRevokingId(invitation.id);
    const result = await revokeInvitation(invitation.id);
    setRevokingId(null);
    if (result.error) {
      setMessage(t('team.revokeInviteFailed'));
      return;
    }
    setInvitations((current) => current.map((item) => (
      item.id === invitation.id ? { ...item, status: 'revoked' } : item
    )));
    setMessage(t('team.inviteRevoked'));
  };

  const confirmRevoke = (invitation: TeamInvitation) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`${t('team.revokeInviteTitle')}\n\n${t('team.revokeInviteConfirm')}`)) {
        void performRevoke(invitation);
      }
      return;
    }
    Alert.alert(
      t('team.revokeInviteTitle'),
      t('team.revokeInviteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('team.revokeInvite'),
          style: 'destructive',
          onPress: () => { void performRevoke(invitation); },
        },
      ],
    );
  };

  const copyCode = async () => {
    if (team?.invitation_code) {
      try {
        if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(team.invitation_code);
          setMessage(t('team.codeCopied'));
          return;
        }
        await Share.share({ message: `${t('team.code')}: ${team.invitation_code}` });
        setMessage(t('team.codeReady'));
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setMessage(t('team.inviteFailed'));
      }
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
        <Button label={t('team.sendInvite')} onPress={handleEmailInvite} loading={busy} />

        <Text style={styles.section}>{t('team.inviteByLink')}</Text>
        <Button label={t('team.generateLink')} onPress={handleLinkInvite} loading={busy} iconRight={<Link size={18} color={Colors.background} />} />

        <Button
          label={t('team.joinRequests')}
          onPress={() => router.push('/coach-dashboard/join-requests' as never)}
          variant="outline"
        />

        <Text style={styles.section}>{t('team.inviteByQr')}</Text>
        <Card variant="gradient" shadow="card" style={styles.qrCard}>
          {qrPayload ? (
            <View style={styles.qrCanvas}>
              <QRCode
                value={qrPayload}
                size={190}
                color="#0B1220"
                backgroundColor="#FFFFFF"
                ecl="M"
              />
            </View>
          ) : (
            <QrCodeIcon size={48} color={Colors.gold} />
          )}
          <Text style={styles.qrPayload} numberOfLines={2}>{qrPayload || t('team.qrHint')}</Text>
          <Text style={styles.qrSub}>{t('team.qrScanHint')}</Text>
        </Card>

        {inviteLink ? <Text style={styles.link}>{inviteLink}</Text> : null}
        {message ? <Text style={styles.msg}>{message}</Text> : null}

        <View style={styles.invitationHeader}>
          <View style={styles.invitationHeaderCopy}>
            <Text style={styles.section}>{t('team.manageInvitations')}</Text>
            <Text style={styles.invitationSub}>{t('team.manageInvitationsSub')}</Text>
          </View>
          <Text style={styles.invitationCount}>{invitations.length}</Text>
        </View>

        {invitations.length === 0 ? (
          <View style={styles.emptyInvitations}>
            <Mail size={25} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>{t('team.noInvitations')}</Text>
            <Text style={styles.emptyText}>{t('team.noInvitationsSub')}</Text>
          </View>
        ) : invitations.map((invitation) => {
          const status = visibleInviteStatus(invitation);
          const statusColor = inviteStatusColor(status);
          const expires = new Date(invitation.expires_at).toLocaleDateString(
            lang === 'hr' ? 'hr-HR' : lang === 'de' ? 'de-DE' : 'en-US',
            { day: 'numeric', month: 'short', year: 'numeric' },
          );
          const link = getInviteLink(invitation.invite_token);
          return (
            <Card key={invitation.id} variant="gradient" style={styles.invitationCard}>
              <View style={styles.invitationTop}>
                <View style={styles.invitationIdentity}>
                  <Text style={styles.invitationEmail} numberOfLines={1}>
                    {invitation.email || t('team.publicInvitation')}
                  </Text>
                  <View style={styles.expiryRow}>
                    <Clock3 size={13} color={Colors.textTertiary} />
                    <Text style={styles.expiryText}>{t('team.inviteExpires', { date: expires })}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>{t(`team.inviteStatus.${status}`)}</Text>
                </View>
              </View>

              {status === 'pending' ? (
                <View style={styles.invitationActions}>
                  <TouchableOpacity style={styles.invitationAction} onPress={() => shareInvitation(link)}>
                    <Share2 size={15} color={Colors.gold} />
                    <Text style={styles.shareText}>{t('team.shareInviteAgain')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.invitationAction}
                    onPress={() => confirmRevoke(invitation)}
                    disabled={revokingId !== null}
                  >
                    <Ban size={15} color={Colors.error} />
                    <Text style={styles.revokeText}>
                      {revokingId === invitation.id ? t('common.loading') : t('team.revokeInvite')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </Card>
          );
        })}
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
  qrCanvas: { padding: 14, borderRadius: Radius.md, backgroundColor: '#FFFFFF' },
  qrPayload: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary, textAlign: 'center' },
  qrSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  link: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.gold },
  msg: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success, textAlign: 'center' },
  invitationHeader: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.md, marginTop: Spacing.md },
  invitationHeaderCopy: { flex: 1 },
  invitationSub: { marginTop: 5, fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 17, color: Colors.textTertiary },
  invitationCount: { minWidth: 30, paddingHorizontal: 9, paddingVertical: 5, borderRadius: Radius.pill, overflow: 'hidden', textAlign: 'center', backgroundColor: Colors.goldSoft, color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 12 },
  emptyInvitations: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.xl, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  emptyTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  emptyText: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, textAlign: 'center', color: Colors.textTertiary },
  invitationCard: { gap: Spacing.md, padding: Spacing.md },
  invitationTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  invitationIdentity: { flex: 1, minWidth: 0, gap: 6 },
  invitationEmail: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  expiryText: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: Radius.pill, borderWidth: 1 },
  statusText: { fontFamily: 'Inter-SemiBold', fontSize: 10 },
  invitationActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline },
  invitationAction: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5 },
  shareText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold },
  revokeText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.error },
});
