import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { getLeagueName } from '../services/rewardEngine';

export default function LeagueScreen() {
  const { state, dispatch } = useAppState();

  React.useEffect(() => {
    dispatch({ type: 'UPDATE_LEADERBOARD' });
  }, [state.xp, state.streak, state.discipline]);

  const league = getLeagueName(state.streak);
  const sorted = [...state.leaderboard].sort((a, b) => b.xp - a.xp);

  const getRankDisplay = (rank) => {
    if (rank === 1) return '\uD83E\uDD47';
    if (rank === 2) return '\uD83E\uDD48';
    if (rank === 3) return '\uD83E\uDD49';
    return String(rank);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`League \uD83C\uDFC6`}</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.leagueBanner}>
          <Text style={styles.leagueName}>{`\uD83C\uDFC6 ${league}`}</Text>
          <Text style={styles.leagueSub}>Weekly rankings reset Sunday</Text>
        </View>

        <View style={styles.leaderboard}>
          {sorted.map((row, i) => {
            const rank = i + 1;
            return (
              <View
                key={i}
                style={[styles.lbRow, row.me && styles.lbRowMe]}
              >
                <Text
                  style={[
                    styles.lbRank,
                    rank === 1 && styles.rankGold,
                    rank === 2 && styles.rankSilver,
                    rank === 3 && styles.rankBronze,
                  ]}
                >
                  {getRankDisplay(rank)}
                </Text>
                <Text style={styles.lbAvatar}>{row.avatar}</Text>
                <View style={styles.lbInfo}>
                  <Text style={styles.lbName}>
                    {row.name}
                    {row.me ? ' (You)' : ''}
                  </Text>
                  <Text style={styles.lbDetail}>
                    {`\uD83D\uDD25${row.streak} streak \u00B7 \uD83D\uDC8E${row.disc} discipline`}
                  </Text>
                </View>
                <Text style={styles.lbXP}>{`\u2B50${row.xp}`}</Text>
              </View>
            );
          })}
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
  leagueBanner: {
    backgroundColor: Colors.orange,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  leagueName: { fontSize: 22, fontWeight: '900', color: Colors.white, marginBottom: 2 },
  leagueSub: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  leaderboard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.grayMed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayMed,
  },
  lbRowMe: { backgroundColor: Colors.blueBg },
  lbRank: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text2,
    width: 28,
    textAlign: 'center',
  },
  rankGold: { color: Colors.yellow },
  rankSilver: { color: Colors.gray },
  rankBronze: { color: Colors.orange },
  lbAvatar: { fontSize: 22 },
  lbInfo: { flex: 1 },
  lbName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  lbDetail: { fontSize: 11, color: Colors.text2, fontWeight: '600' },
  lbXP: { fontSize: 14, fontWeight: '900', color: Colors.purple },
});
