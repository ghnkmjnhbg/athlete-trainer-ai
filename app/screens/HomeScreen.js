import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { getStreakMultiplier } from '../services/rewardEngine';
import { getDayWorkout } from '../services/workoutEngine';
import { ACHIEVEMENTS } from '../constants/exercises';
import ProgressBar from '../components/ProgressBar';

export default function HomeScreen({ navigation }) {
  const { state } = useAppState();
  const mult = getStreakMultiplier(state.streak);
  const xpForLevel = state.level * 100;
  const xpInLevel = state.xp % xpForLevel;
  const xpProgress = (xpInLevel / xpForLevel) * 100;

  const workout = getDayWorkout(state.plan, state.currentDay);
  const exerciseCount = workout?.exercises?.length || 6;
  const estimatedXP = Math.round((workout?.xp || 80) * mult);

  const plan = state.plan;
  const days = plan?.days || [];
  const offsets = ['', 'right', '', 'left', ''];

  const renderSkillPath = () => {
    return days.map((d, i) => {
      const st =
        state.currentDay > i + 1
          ? 'done'
          : state.currentDay === i + 1
          ? 'active'
          : 'locked';
      return (
        <View key={i}>
          {i > 0 && (
            <View style={styles.pathLineWrap}>
              <View
                style={[
                  styles.pathLine,
                  state.currentDay > i && styles.pathLineDone,
                ]}
              />
            </View>
          )}
          <View
            style={[
              styles.pathRow,
              offsets[i] === 'right' && styles.pathRowRight,
              offsets[i] === 'left' && styles.pathRowLeft,
            ]}
          >
            <View style={styles.nodeWrap}>
              <TouchableOpacity
                style={[
                  styles.nodeBtn,
                  st === 'done' && styles.nodeDone,
                  st === 'active' && styles.nodeActive,
                  st === 'locked' && styles.nodeLocked,
                ]}
                onPress={() => {
                  if (st !== 'locked') navigation.navigate('Workout');
                }}
                disabled={st === 'locked'}
              >
                <Text style={styles.nodeIcon}>{d.icon || '\uD83C\uDFC3'}</Text>
                {st === 'done' && (
                  <View style={styles.nodeStars}>
                    <Text style={styles.starIcon}>{'\u2B50'}</Text>
                    <Text style={styles.starIcon}>{'\u2B50'}</Text>
                    <Text style={styles.starIcon}>{'\u2B50'}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.nodeLabel}>{d.title}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{`Keep grinding \uD83D\uDCAA`}</Text>
          <Text style={styles.name}>
            {state.profile.age
              ? `Athlete, ${state.profile.age}`
              : 'Athlete'}
          </Text>
        </View>
        <View style={styles.hdrStats}>
          <View style={[styles.hstat, styles.hstatStreak]}>
            <Text style={styles.hstatStreakText}>
              {`\uD83D\uDD25${state.streak}`}
            </Text>
          </View>
          <View style={[styles.hstat, styles.hstatDisc]}>
            <Text style={styles.hstatDiscText}>
              {`\uD83D\uDC8E${state.discipline}`}
            </Text>
          </View>
          <View style={[styles.hstat, styles.hstatXP]}>
            <Text style={styles.hstatXPText}>
              {`\u2B50${state.xp}`}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View style={styles.lvlBadge}>
              <Text style={styles.lvlText}>LVL {state.level}</Text>
            </View>
            <Text style={styles.xpInfo}>
              {xpInLevel}/{xpForLevel} XP
            </Text>
          </View>
          <ProgressBar
            progress={xpProgress}
            color={Colors.purple}
          />
        </View>

        {mult > 1 && (
          <View style={styles.streakMult}>
            <Text style={styles.streakMultText}>
              {`\uD83D\uDD25 ${mult}x XP Multiplier Active!`}
            </Text>
          </View>
        )}

        <Text style={styles.secHdr}>{"TODAY'S WORKOUT"}</Text>
        <TouchableOpacity
          style={styles.todayCard}
          onPress={() => navigation.navigate('Workout')}
        >
          <Text style={styles.todayLabel}>DAY {state.currentDay}</Text>
          <Text style={styles.todayTitle}>{workout?.title || 'Foundation Training'}</Text>
          <Text style={styles.todaySub}>{workout?.focus || 'Loading...'}</Text>
          <View style={styles.todayChips}>
            <View style={styles.todayChip}>
              <Text style={styles.chipText}>{`\u23F1 ${workout?.time || '60 min'}`}</Text>
            </View>
            <View style={styles.todayChip}>
              <Text style={styles.chipText}>{`\uD83D\uDCAA ${exerciseCount} exercises`}</Text>
            </View>
            <View style={styles.todayChip}>
              <Text style={styles.chipText}>{`\u2B50 +${estimatedXP} XP`}</Text>
            </View>
          </View>
          <View style={styles.todayPlay}>
            <Text style={styles.playIcon}>{'\u25B6'}</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.secHdr, { marginTop: 4 }]}>YOUR JOURNEY</Text>
        <View style={styles.skillPath}>
          <View style={styles.pathSectionLbl}>
            <Text style={styles.pathSectionText}>
              {plan?.planName || 'YOUR PLAN'}
            </Text>
          </View>
          {renderSkillPath()}
        </View>

        <Text style={[styles.secHdr, { marginTop: 12 }]}>ACHIEVEMENTS</Text>
        <View style={styles.achGrid}>
          {ACHIEVEMENTS.map((a) => {
            const earned = state.achievements.includes(a.id);
            return (
              <View
                key={a.id}
                style={[styles.achCard, earned && styles.achEarned]}
              >
                <Text
                  style={[
                    styles.achIcon,
                    !earned && styles.achIconLocked,
                  ]}
                >
                  {a.icon}
                </Text>
                <View>
                  <Text style={styles.achName}>{a.name}</Text>
                  <Text style={styles.achDesc}>{a.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayMed,
  },
  greeting: { fontSize: 12, color: Colors.text2, fontWeight: '700' },
  name: { fontSize: 19, fontWeight: '900', color: Colors.text },
  hdrStats: { flexDirection: 'row', gap: 6 },
  hstat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 99,
  },
  hstatStreak: { backgroundColor: Colors.orangeBg },
  hstatStreakText: { fontSize: 13, fontWeight: '800', color: Colors.orange },
  hstatDisc: { backgroundColor: Colors.purpleBg },
  hstatDiscText: { fontSize: 13, fontWeight: '800', color: Colors.purple },
  hstatXP: { backgroundColor: Colors.blueBg },
  hstatXPText: { fontSize: 13, fontWeight: '800', color: '#1db8e8' },
  body: { flex: 1 },
  bodyContent: { padding: 18, paddingBottom: 20 },
  xpCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lvlBadge: {
    backgroundColor: Colors.purple,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  lvlText: { color: Colors.white, fontSize: 12, fontWeight: '900' },
  xpInfo: { fontSize: 12, fontWeight: '700', color: Colors.text2 },
  streakMult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.orangeBg,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  streakMultText: { fontSize: 12, fontWeight: '800', color: Colors.orange },
  secHdr: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  todayCard: {
    backgroundColor: Colors.blue,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.blueDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  todayTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 3,
    marginBottom: 2,
  },
  todaySub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  todayChips: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  todayChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
  chipText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  todayPlay: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -23,
    width: 46,
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 3,
  },
  playIcon: { fontSize: 19, color: Colors.blue },
  skillPath: { alignItems: 'center', paddingVertical: 4 },
  pathSectionLbl: {
    backgroundColor: Colors.gray,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  pathSectionText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pathRow: { width: '100%', alignItems: 'center', marginVertical: 3 },
  pathRowRight: { alignItems: 'flex-end', paddingRight: 55 },
  pathRowLeft: { alignItems: 'flex-start', paddingLeft: 55 },
  pathLineWrap: { alignItems: 'center' },
  pathLine: {
    width: 4,
    height: 24,
    backgroundColor: Colors.grayMed,
  },
  pathLineDone: { backgroundColor: Colors.green },
  nodeWrap: { alignItems: 'center' },
  nodeBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: Colors.green,
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  nodeActive: {
    backgroundColor: Colors.blue,
    shadowColor: Colors.blueDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  nodeLocked: {
    backgroundColor: Colors.grayLight,
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    opacity: 0.5,
  },
  nodeIcon: { fontSize: 26 },
  nodeStars: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    gap: 1,
  },
  starIcon: { fontSize: 10 },
  nodeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.text2,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 76,
    lineHeight: 14,
  },
  achGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 8,
  },
  achCard: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2.5,
    borderColor: 'transparent',
    width: '48%',
  },
  achEarned: {
    borderColor: Colors.yellow,
    backgroundColor: '#fffbec',
  },
  achIcon: { fontSize: 24 },
  achIconLocked: { opacity: 0.35 },
  achName: { fontSize: 12, fontWeight: '800', color: Colors.text },
  achDesc: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
});
