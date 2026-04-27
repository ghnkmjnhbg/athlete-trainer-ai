import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { getStreakMultiplier } from '../services/rewardEngine';
import { ACHIEVEMENTS } from '../constants/exercises';
import ProgressBar from '../components/ProgressBar';

export default function ProgressScreen() {
  const { state } = useAppState();
  const mult = getStreakMultiplier(state.streak);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`Your Progress \uD83D\uDCCA`}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.discMeter}>
          <View style={styles.discTop}>
            <Text style={styles.scTitle}>DISCIPLINE SCORE</Text>
            <Text style={styles.discScoreBig}>{state.discipline}</Text>
          </View>
          <ProgressBar
            progress={Math.min((state.discipline / 200) * 100, 100)}
            color={Colors.purple}
          />
        </View>

        <View style={styles.statCard}>
          <Text style={styles.scTitle}>STATS</Text>
          <View style={styles.bigGrid}>
            <View style={styles.bigCell}>
              <Text style={styles.bigVal}>{state.workoutsDone}</Text>
              <Text style={styles.bigLbl}>Workouts</Text>
            </View>
            <View style={styles.bigCell}>
              <Text style={styles.bigVal}>{state.xp}</Text>
              <Text style={styles.bigLbl}>Total XP</Text>
            </View>
            <View style={styles.bigCell}>
              <Text style={styles.bigVal}>{state.level}</Text>
              <Text style={styles.bigLbl}>Level</Text>
            </View>
            <View style={styles.bigCell}>
              <Text style={styles.bigVal}>{state.bestStreak}</Text>
              <Text style={styles.bigLbl}>Best Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.scTitle}>STREAK</Text>
          <View style={styles.streakBig}>
            <Text style={styles.streakNumBig}>{state.streak}</Text>
            <View>
              <Text style={styles.strInfoLabel}>{`\uD83D\uDD25 Day Streak`}</Text>
              <Text style={styles.strInfoSub}>{`${mult}x XP multiplier active`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.scTitle}>THIS WEEK</Text>
          <View style={styles.weekRow}>
            {dayLabels.map((label, i) => {
              const isDone = state.weekDays[i];
              const isToday = i === todayIdx;
              const isMissed = i < todayIdx && !isDone;
              return (
                <View
                  key={i}
                  style={[
                    styles.wd,
                    isDone && styles.wdDone,
                    isToday && !isDone && styles.wdToday,
                    isMissed && styles.wdMiss,
                    !isDone && !isToday && !isMissed && styles.wdUp,
                  ]}
                >
                  <Text
                    style={[
                      styles.wdText,
                      (isDone || isToday) && styles.wdTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                  {isDone && <Text style={styles.wdCheck}>{'\u2713'}</Text>}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.scTitle}>ACHIEVEMENTS</Text>
          <View style={styles.achGrid}>
            {ACHIEVEMENTS.map((a) => {
              const earned = state.achievements.includes(a.id);
              return (
                <View
                  key={a.id}
                  style={[styles.achCard, earned && styles.achEarned]}
                >
                  <Text
                    style={[styles.achIcon, !earned && styles.achIconLocked]}
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.grayLight },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayMed,
  },
  headerTitle: { fontSize: 21, fontWeight: '900', color: Colors.text },
  body: { flex: 1 },
  bodyContent: { padding: 14, paddingBottom: 100 },
  discMeter: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 11,
  },
  discTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discScoreBig: { fontSize: 28, fontWeight: '900', color: Colors.purple },
  scTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 11,
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  bigGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  bigCell: {
    width: '48%',
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  bigVal: { fontSize: 26, fontWeight: '900', color: Colors.text },
  bigLbl: { fontSize: 11, color: Colors.text2, fontWeight: '700' },
  streakBig: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  streakNumBig: { fontSize: 56, fontWeight: '900', color: Colors.orange },
  strInfoLabel: { fontSize: 15, fontWeight: '800', color: Colors.text },
  strInfoSub: { fontSize: 12, color: Colors.text2, fontWeight: '600' },
  weekRow: {
    flexDirection: 'row',
    gap: 5,
  },
  wd: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wdDone: { backgroundColor: Colors.green },
  wdToday: { backgroundColor: Colors.blue },
  wdMiss: { backgroundColor: Colors.grayLight },
  wdUp: { backgroundColor: Colors.grayLight },
  wdText: { fontSize: 10, fontWeight: '800', color: Colors.gray },
  wdTextActive: { color: Colors.white },
  wdCheck: { fontSize: 10, color: Colors.white, fontWeight: '800' },
  achGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  achCard: {
    width: '48%',
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  achEarned: { borderColor: Colors.yellow, backgroundColor: '#fffbec' },
  achIcon: { fontSize: 24 },
  achIconLocked: { opacity: 0.35 },
  achName: { fontSize: 12, fontWeight: '800', color: Colors.text },
  achDesc: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
});
