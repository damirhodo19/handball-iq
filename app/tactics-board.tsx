import { useMemo, useRef, useState } from 'react';
import { Animated as RNAnimated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pause, Play, RotateCcw, Shield } from 'lucide-react-native';

import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing } from '@/lib/theme';

type PlayerProps = {
  label: string;
  left: `${number}%`;
  top: `${number}%`;
  tone: 'attack' | 'defence';
  movement?: RNAnimated.ValueXY;
};

function Player({ label, left, top, tone, movement }: PlayerProps) {
  const position = movement ? { transform: movement.getTranslateTransform() } : undefined;
  return (
    <RNAnimated.View
      style={[
        styles.player,
        { left, top },
        tone === 'attack' ? styles.attacker : styles.defender,
        position,
      ]}
    >
      <Text style={[styles.playerLabel, tone === 'attack' && styles.attackerLabel]}>{label}</Text>
    </RNAnimated.View>
  );
}

export default function TacticsBoardScreen() {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const stylesMemo = useMemo(() => styles, [themeVersion]);
  const [playing, setPlaying] = useState(false);
  const centreBack = useRef(new RNAnimated.ValueXY({ x: 0, y: 0 })).current;
  const pivot = useRef(new RNAnimated.ValueXY({ x: 0, y: 0 })).current;
  const ball = useRef(new RNAnimated.ValueXY({ x: 0, y: 0 })).current;
  const animation = useRef<RNAnimated.CompositeAnimation | null>(null);

  const reset = () => {
    animation.current?.stop();
    centreBack.setValue({ x: 0, y: 0 });
    pivot.setValue({ x: 0, y: 0 });
    ball.setValue({ x: 0, y: 0 });
    setPlaying(false);
  };

  const play = () => {
    reset();
    setPlaying(true);
    animation.current = RNAnimated.sequence([
      RNAnimated.parallel([
        RNAnimated.timing(centreBack, { toValue: { x: 0, y: -46 }, duration: 900, useNativeDriver: true }),
        RNAnimated.timing(pivot, { toValue: { x: 54, y: 6 }, duration: 900, useNativeDriver: true }),
        RNAnimated.timing(ball, { toValue: { x: 0, y: -46 }, duration: 900, useNativeDriver: true }),
      ]),
      RNAnimated.parallel([
        RNAnimated.timing(centreBack, { toValue: { x: -58, y: -63 }, duration: 850, useNativeDriver: true }),
        RNAnimated.timing(pivot, { toValue: { x: 82, y: 0 }, duration: 850, useNativeDriver: true }),
        RNAnimated.timing(ball, { toValue: { x: -102, y: -24 }, duration: 850, useNativeDriver: true }),
      ]),
      RNAnimated.parallel([
        RNAnimated.timing(centreBack, { toValue: { x: -30, y: -48 }, duration: 750, useNativeDriver: true }),
        RNAnimated.timing(ball, { toValue: { x: 30, y: -104 }, duration: 750, useNativeDriver: true }),
      ]),
    ]);
    animation.current.start(() => setPlaying(false));
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={stylesMemo.scroll} showsVerticalScrollIndicator={false}>
        <View style={stylesMemo.header}>
          <BackButton />
          <View style={stylesMemo.headerCopy}>
            <Text style={stylesMemo.title}>{t('tactics.title')}</Text>
            <Text style={stylesMemo.subtitle}>{t('tactics.subtitle')}</Text>
          </View>
        </View>

        <Card variant="gradient" shadow="cardLg" style={stylesMemo.boardCard}>
          <View style={stylesMemo.boardHeader}>
            <View>
              <Text style={stylesMemo.analysisLabel}>{t('tactics.analysisMode')}</Text>
              <Text style={stylesMemo.playName}>{t('tactics.playName')}</Text>
              <Text style={stylesMemo.playMeta}>{t('tactics.playMeta')}</Text>
            </View>
            <View style={stylesMemo.systemBadge}>
              <Shield size={14} color={Colors.gold} />
              <Text style={stylesMemo.systemText}>6:0</Text>
            </View>
          </View>

          <LinearGradient
            colors={['#172033', '#0C1424', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={stylesMemo.court}
          >
            <View style={stylesMemo.courtGlowLeft} />
            <View style={stylesMemo.courtGlowRight} />
            <View style={stylesMemo.tacticalGrid} />
            <View style={stylesMemo.centerLine} />
            <View style={stylesMemo.goalArea} />
            <View style={stylesMemo.nineMeterLine} />
            <View style={stylesMemo.goal} />
            <View style={[stylesMemo.routeLine, stylesMemo.routeLineOne]} />
            <View style={[stylesMemo.routeLine, stylesMemo.routeLineTwo]} />
            <View style={[stylesMemo.routeLine, stylesMemo.routeLineThree]} />

            <Player label="1" left="13%" top="40%" tone="defence" />
            <Player label="2" left="27%" top="36%" tone="defence" />
            <Player label="3" left="42%" top="34%" tone="defence" />
            <Player label="4" left="57%" top="34%" tone="defence" />
            <Player label="5" left="72%" top="36%" tone="defence" />
            <Player label="6" left="85%" top="40%" tone="defence" />

            <Player label="LW" left="7%" top="80%" tone="attack" />
            <Player label="LB" left="23%" top="70%" tone="attack" />
            <Player label="CB" left="46%" top="75%" tone="attack" movement={centreBack} />
            <Player label="RB" left="69%" top="70%" tone="attack" />
            <Player label="RW" left="88%" top="80%" tone="attack" />
            <Player label="P" left="43%" top="48%" tone="attack" movement={pivot} />

            <RNAnimated.View style={[stylesMemo.ball, { left: '52%', top: '77%', transform: ball.getTranslateTransform() }]} />
          </LinearGradient>

          <View style={stylesMemo.legend}>
            <View style={stylesMemo.legendItem}><View style={[stylesMemo.legendDot, stylesMemo.attacker]} /><Text style={stylesMemo.legendText}>{t('tactics.attack')}</Text></View>
            <View style={stylesMemo.legendItem}><View style={[stylesMemo.legendDot, stylesMemo.defender]} /><Text style={stylesMemo.legendText}>{t('tactics.defence')}</Text></View>
            <View style={stylesMemo.legendItem}><View style={stylesMemo.ballLegend} /><Text style={stylesMemo.legendText}>{t('tactics.ball')}</Text></View>
          </View>

          <View style={stylesMemo.timeline}>
            <View style={[stylesMemo.timelineStep, stylesMemo.timelineStepActive]}><Text style={stylesMemo.timelineNumberActive}>1</Text></View>
            <View style={stylesMemo.timelineLine} />
            <View style={stylesMemo.timelineStep}><Text style={stylesMemo.timelineNumber}>2</Text></View>
            <View style={stylesMemo.timelineLine} />
            <View style={stylesMemo.timelineStep}><Text style={stylesMemo.timelineNumber}>3</Text></View>
          </View>

          <View style={stylesMemo.controls}>
            <TouchableOpacity style={stylesMemo.resetButton} onPress={reset} activeOpacity={0.8}>
              <RotateCcw size={18} color={Colors.gold} />
              <Text style={stylesMemo.resetText}>{t('tactics.reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesMemo.playButton} onPress={playing ? () => animation.current?.stop() : play} activeOpacity={0.85}>
              {playing ? <Pause size={19} color={Colors.background} /> : <Play size={19} color={Colors.background} />}
              <Text style={stylesMemo.playButtonText}>{playing ? t('tactics.pause') : t('tactics.play')}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card variant="gradient" style={stylesMemo.explanationCard}>
          <Text style={stylesMemo.explanationTitle}>{t('tactics.explanationTitle')}</Text>
          <Text style={stylesMemo.explanationText}>{t('tactics.explanation')}</Text>
        </Card>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 12, paddingBottom: Spacing.xxxl, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerCopy: { flex: 1 },
  title: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 24 },
  subtitle: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  boardCard: { gap: Spacing.md, padding: Spacing.md },
  boardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm },
  analysisLabel: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 9, letterSpacing: 1.8, marginBottom: 5 },
  playName: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 17 },
  playMeta: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  systemBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.goldSoft, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  systemText: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 12 },
  court: { width: '100%', aspectRatio: 0.75, maxHeight: 520, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(212,175,55,0.40)', alignSelf: 'center' },
  courtGlowLeft: { position: 'absolute', width: 190, height: 190, borderRadius: 95, left: -90, bottom: 30, backgroundColor: 'rgba(212,175,55,0.08)' },
  courtGlowRight: { position: 'absolute', width: 210, height: 210, borderRadius: 105, right: -110, top: 70, backgroundColor: 'rgba(37,99,235,0.09)' },
  tacticalGrid: { position: 'absolute', width: '50%', height: '100%', left: '25%', borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.035)' },
  centerLine: { position: 'absolute', left: 0, right: 0, bottom: '8%', height: 1, backgroundColor: 'rgba(255,255,255,0.22)' },
  goalArea: { position: 'absolute', width: '72%', height: '30%', top: '-12%', left: '14%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.50)', borderRadius: 140 },
  nineMeterLine: { position: 'absolute', width: '94%', height: '48%', top: '-15%', left: '3%', borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(212,175,55,0.55)', borderRadius: 180 },
  goal: { position: 'absolute', width: '30%', height: 13, top: 0, left: '35%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.80)', backgroundColor: 'rgba(255,255,255,0.08)' },
  routeLine: { position: 'absolute', height: 2, borderRadius: 1, backgroundColor: 'rgba(212,175,55,0.34)', zIndex: 1 },
  routeLineOne: { width: 96, left: '37%', top: '65%', transform: [{ rotate: '-68deg' }] },
  routeLineTwo: { width: 72, left: '45%', top: '52%', transform: [{ rotate: '7deg' }] },
  routeLineThree: { width: 78, left: '48%', top: '45%', transform: [{ rotate: '-35deg' }] },
  player: { position: 'absolute', width: 36, height: 36, marginLeft: -18, marginTop: -18, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, zIndex: 3, shadowColor: '#000000', shadowOpacity: 0.32, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  attacker: { backgroundColor: Colors.gold, borderColor: '#FFE58A' },
  defender: { backgroundColor: '#2563EB', borderColor: '#93C5FD' },
  playerLabel: { color: Colors.white, fontFamily: 'Inter-ExtraBold', fontSize: 9 },
  attackerLabel: { color: Colors.background },
  ball: { position: 'absolute', width: 15, height: 15, marginLeft: -7.5, marginTop: -7.5, borderRadius: 8, backgroundColor: '#F97316', borderWidth: 2, borderColor: '#FED7AA', zIndex: 5, shadowColor: '#F97316', shadowOpacity: 0.65, shadowRadius: 7, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  ballLegend: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#F97316' },
  legendText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 11 },
  timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  timelineStep: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  timelineStepActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  timelineNumber: { color: Colors.textTertiary, fontFamily: 'Inter-ExtraBold', fontSize: 10 },
  timelineNumberActive: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 10 },
  timelineLine: { flex: 1, maxWidth: 64, height: 1, backgroundColor: Colors.border },
  controls: { flexDirection: 'row', gap: Spacing.sm },
  resetButton: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  resetText: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 14 },
  playButton: { flex: 1.4, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: Radius.md, backgroundColor: Colors.gold },
  playButtonText: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 14 },
  explanationCard: { gap: Spacing.sm },
  explanationTitle: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 16 },
  explanationText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20 },
});
