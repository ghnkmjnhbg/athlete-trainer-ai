import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { getStreakMultiplier } from '../services/rewardEngine';

export default function PlanScreen() {
  const { state } = useAppState();
  const plan = state.plan;
  const mult = getStreakMultiplier(state.streak);

  if (!plan) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{`Your Plan \uD83D\uDCC5`}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No plan generated yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`Your Plan \uD83D\uDCC5`}</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {plan.days.map((d, i) => {
          const isDone = state.currentDay > i + 1;
          const isToday = state.currentDay === i + 1;
          return (
            <View
              key={i}
              style={[
                styles.planDay,
                isToday && styles.planDayActive,
                isDone && styles.planDayDone,
              ]}
            >
              <View
                style={[
                  styles.pdIcon,
                  {
                    backgroundColor: isToday
                      ? Colors.blueBg
                      : isDone
                      ? Colors.greenBg
                      : Colors.grayLight,
                  },
                ]}
              >
                <Text style={styles.pdIconText}>
                  {isDone ? '\u2705' : d.icon}
                </Text>
              </View>
              <View style={styles.pdInfo}>
                <Text
                  style={[
                    styles.pdStatus,
                    {
                      color: isToday
                        ? Colors.blue
                        : isDone
                        ? Colors.greenDark
                        : Colors.gray,
                    },
                  ]}
                >
                  {isToday ? 'TODAY' : isDone ? 'DONE' : `DAY ${i + 1}`}
                </Text>
                <Text style={styles.pdName}>{d.title}</Text>
                <Text style={styles.pdSub}>{d.focus}</Text>
              </View>
              <View>
                <Text style={styles.pdXP}>
                  +{Math.round((d.xp || 80) * mult)} XP
                </Text>
              </View>
            </View>
          );
        })}
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: Colors.text2, fontWeight: '700' },
  planDay: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  planDayActive: { borderColor: Colors.blue },
  planDayDone: { borderColor: Colors.green },
  pdIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdIconText: { fontSize: 20 },
  pdInfo: { flex: 1 },
  pdStatus: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pdName: { fontSize: 14, fontWeight: '900', color: Colors.text },
  pdSub: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
  pdXP: { fontSize: 12, fontWeight: '900', color: Colors.purple },
});
