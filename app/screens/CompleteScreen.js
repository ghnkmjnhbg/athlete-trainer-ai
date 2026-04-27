import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { getFormColor } from '../services/aiSystem';

export default function CompleteScreen({ navigation, route }) {
  const {
    xpEarned = 80,
    streak = 1,
    done = 0,
    time = '0m',
    formScores = [],
    skips = 0,
    disciplineEarned = 10,
    badge = null,
  } = route.params || {};

  const msg =
    skips === 0
      ? `Perfect session! ${streak} day streak \uD83D\uDD25 +${disciplineEarned} \uD83D\uDC8E earned`
      : `${skips} skip${skips > 1 ? 's' : ''} \u2014 stay locked in. +${disciplineEarned} \uD83D\uDC8E`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.trophy}>{'\uD83C\uDFC6'}</Text>
      <Text style={styles.title}>Session Complete!</Text>
      <Text style={styles.msg}>{msg}</Text>

      <View style={styles.xpReward}>
        <Text style={styles.xpNum}>+{xpEarned} XP</Text>
        <Text style={styles.xpLabel}>Experience Points Earned</Text>
      </View>

      <View style={styles.compStats}>
        <View style={styles.cstat}>
          <Text style={styles.cstatIcon}>{'\uD83D\uDD25'}</Text>
          <Text style={styles.cstatVal}>{streak}</Text>
          <Text style={styles.cstatLabel}>Streak</Text>
        </View>
        <View style={styles.cstat}>
          <Text style={styles.cstatIcon}>{'\uD83D\uDCAA'}</Text>
          <Text style={styles.cstatVal}>{done}</Text>
          <Text style={styles.cstatLabel}>Done</Text>
        </View>
        <View style={styles.cstat}>
          <Text style={styles.cstatIcon}>{'\u23F1'}</Text>
          <Text style={styles.cstatVal}>{time}</Text>
          <Text style={styles.cstatLabel}>Time</Text>
        </View>
      </View>

      <View style={styles.formSummary}>
        <Text style={styles.formSumTitle}>
          {'\uD83E\uDD16'} AI Form Report
        </Text>
        {formScores.map((f, i) => (
          <View key={i} style={styles.formSumRow}>
            <Text style={styles.formSumName}>{f.name}</Text>
            {f.skipped ? (
              <Text style={[styles.formSumScore, { color: Colors.red }]}>
                {'\u274C'} Skipped
              </Text>
            ) : (
              <Text
                style={[
                  styles.formSumScore,
                  { color: getFormColor(f.score) },
                ]}
              >
                {f.score}%
              </Text>
            )}
          </View>
        ))}
        {formScores.length === 0 && (
          <Text style={styles.noData}>No data</Text>
        )}
      </View>

      {badge && (
        <View style={styles.badgeCard}>
          <Text style={styles.badgeIcon}>{'\uD83E\uDD47'}</Text>
          <View>
            <Text style={styles.badgeLabel}>BADGE UNLOCKED</Text>
            <Text style={styles.badgeName}>{badge}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        }}
      >
        <Text style={styles.continueBtnText}>CONTINUE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  trophy: { fontSize: 76, marginBottom: 6 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 5,
  },
  msg: {
    fontSize: 14,
    color: Colors.text2,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  xpReward: {
    backgroundColor: Colors.purple,
    borderRadius: 20,
    padding: 20,
    paddingHorizontal: 26,
    marginBottom: 14,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  xpNum: { fontSize: 46, fontWeight: '900', color: Colors.white },
  xpLabel: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  compStats: {
    flexDirection: 'row',
    gap: 9,
    width: '100%',
    maxWidth: 340,
    marginBottom: 14,
  },
  cstat: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cstatIcon: { fontSize: 18 },
  cstatVal: { fontSize: 20, fontWeight: '900', color: Colors.text },
  cstatLabel: { fontSize: 10, color: Colors.text2, fontWeight: '700' },
  formSummary: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  formSumTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formSumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayMed,
  },
  formSumName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  formSumScore: { fontSize: 13, fontWeight: '800' },
  noData: { fontSize: 13, color: Colors.text2, paddingVertical: 4 },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.orange,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 340,
    marginBottom: 20,
  },
  badgeIcon: { fontSize: 32 },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  badgeName: { fontSize: 15, fontWeight: '900', color: Colors.white },
  continueBtn: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.green,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  continueBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
