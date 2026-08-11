import { Fragment, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Users } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { extractInviteToken, isValidInviteCode, isValidInviteToken } from '@/lib/form-validation';
import { mapServiceError } from '@/lib/map-error';
import {
  clearPendingTeamJoin,
  rememberPendingTeamJoin,
} from '@/lib/team-platform/pending-join';
import { fetchMyTeamJoinRequests, joinTeamByCode, joinTeamByInviteToken } from '@/lib/team-platform/platform';
import type { MyTeamJoinRequest } from '@/lib/team-platform/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

export default function JoinTeamScreen() {
  const { t } = useTranslation();
  const { token: routeToken, code: routeCode } = useLocalSearchParams<{
    token?: string;
    code?: string;
  }>();
  const { user, loading: authLoading } = useAuth();
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<MyTeamJoinRequest[]>([]);

  useEffect(() => {
    if (typeof routeToken === 'string' && routeToken.trim()) {
      const parsedToken = extractInviteToken(routeToken);
      setToken(parsedToken);
      rememberPendingTeamJoin({ token: parsedToken });
      return;
    }
    if (typeof routeCode === 'string' && routeCode.trim()) {
      const normalizedCode = routeCode.trim().toUpperCase();
      setCode(normalizedCode);
      rememberPendingTeamJoin({ code: normalizedCode });
    }
  }, [routeCode, routeToken]);

  const loadRequests = useCallback(async () => {
    if (!user?.id) return;
    const result = await fetchMyTeamJoinRequests();
    if (!result.error) setRequests(result.requests);
  }, [user?.id]);

  useFocusEffect(useCallback(() => {
    loadRequests();
  }, [loadRequests]));

  const handleJoinCode = async () => {
    setError('');
    setSuccess('');
    if (!isValidInviteCode(code)) { setError(t('team.errorEmptyCode')); return; }
    if (!user?.id) {
      rememberPendingTeamJoin({ code });
      router.push('/(auth)/login');
      return;
    }
    setLoading(true);
    const { error: err, team, requestStatus } = await joinTeamByCode(code.trim(), user.id, user.email ?? t('role.player'));
    setLoading(false);
    if (err) {
      if (/invalid|expired/i.test(err)) clearPendingTeamJoin();
      setError(mapServiceError(err, t));
    } else {
      setSuccess(requestStatus === 'pending'
        ? t('team.joinRequestSent', { name: team?.name ?? '' })
        : t('team.joinSuccess', { name: team?.name ?? '' }));
    }
    if (!err) {
      clearPendingTeamJoin();
      loadRequests();
    }
  };

  const handleJoinLink = async () => {
    setError('');
    setSuccess('');
    if (!isValidInviteToken(token)) { setError(t('team.errorEmptyLink')); return; }
    const linkToken = extractInviteToken(token);
    if (!user?.id) {
      rememberPendingTeamJoin({ token: linkToken });
      router.push('/(auth)/login');
      return;
    }
    setLoading(true);
    const { error: err, team, requestStatus } = await joinTeamByInviteToken(linkToken, user.id, user.email ?? t('role.player'));
    setLoading(false);
    if (err) {
      if (/invalid|expired/i.test(err)) clearPendingTeamJoin();
      setError(mapServiceError(err, t));
    } else {
      setSuccess(requestStatus === 'pending'
        ? t('team.joinRequestSent', { name: team?.name ?? '' })
        : t('team.joinSuccess', { name: team?.name ?? '' }));
    }
    if (!err) {
      clearPendingTeamJoin();
      loadRequests();
    }
  };

  const continueToLogin = () => {
    const linkToken = extractInviteToken(token);
    rememberPendingTeamJoin({
      token: linkToken || null,
      code: linkToken ? null : code,
    });
    router.push('/(auth)/login');
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

        {authLoading ? (
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        ) : !user ? (
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>{t('team.loginToJoin')}</Text>
            <Text style={styles.authText}>{t('team.loginToJoinSub')}</Text>
            <Button label={t('team.signInToContinue')} onPress={continueToLogin} />
          </View>
        ) : (
          <Fragment>
            <Text style={styles.label}>{t('team.enterCode')}</Text>
            <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder={t('team.codePlaceholder')} placeholderTextColor={Colors.textQuaternary} autoCapitalize="characters" />
            <Button label={t('team.joinByCode')} onPress={handleJoinCode} loading={loading} />

            <Text style={styles.divider}>{t('common.or')}</Text>

            <Text style={styles.label}>{t('team.enterLink')}</Text>
            <TextInput style={styles.input} value={token} onChangeText={setToken} placeholder={t('team.linkPlaceholder')} placeholderTextColor={Colors.textQuaternary} autoCapitalize="none" />
            <Button label={t('team.joinByLink')} onPress={handleJoinLink} variant="outline" loading={loading} />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            {requests.length > 0 ? (
              <View style={styles.requestList}>
                <Text style={styles.requestTitle}>{t('team.myJoinRequests')}</Text>
                {requests.map((request) => (
                  <View key={request.request_id} style={styles.requestRow}>
                    <Text style={styles.requestTeam}>{request.team_name}</Text>
                    <Text style={[
                      styles.requestStatus,
                      request.request_status === 'approved' && { color: Colors.success },
                      request.request_status === 'rejected' && { color: Colors.error },
                    ]}>
                      {t(`team.requestStatus.${request.request_status}`)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Fragment>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  loadingText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', textAlign: 'center', paddingVertical: Spacing.xl },
  authCard: { gap: Spacing.md, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  authTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary, textAlign: 'center' },
  authText: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20, color: Colors.textSecondary, textAlign: 'center' },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  divider: { textAlign: 'center', color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', marginVertical: Spacing.sm },
  error: { color: Colors.error, fontFamily: 'Inter-Regular', textAlign: 'center' },
  success: { color: Colors.success, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
  requestList: { gap: Spacing.sm, marginTop: Spacing.md },
  requestTitle: { fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.2, color: Colors.textTertiary },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  requestTeam: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },
  requestStatus: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.warning },
});
