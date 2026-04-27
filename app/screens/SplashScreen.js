import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';

export default function SplashScreen({ navigation }) {
  const { dispatch } = useAppState();

  const handleGetStarted = () => {
    navigation.navigate('Onboarding');
  };

  const handleQuickStart = () => {
    dispatch({ type: 'QUICK_START' });
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrap}>
        <Text style={styles.mascot}>{'\uD83E\uDD85'}</Text>
      </View>
      <Text style={styles.title}>FitQuest</Text>
      <Text style={styles.tagline}>Train like an athlete. Level up every day.</Text>

      <View style={styles.pills}>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>{'\uD83D\uDD25'}</Text>
          <Text style={styles.pillText}>Streaks</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>{'\uD83D\uDC8E'}</Text>
          <Text style={styles.pillText}>Discipline</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>{'\uD83C\uDFC6'}</Text>
          <Text style={styles.pillText}>Leagues</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>{'\uD83E\uDD16'}</Text>
          <Text style={styles.pillText}>AI Coach</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnGreen} onPress={handleGetStarted}>
        <Text style={styles.btnGreenText}>GET STARTED</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnOutline} onPress={handleQuickStart}>
        <Text style={styles.btnOutlineText}>I ALREADY HAVE AN ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  mascotWrap: {
    marginBottom: 20,
  },
  mascot: {
    fontSize: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: -1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: Colors.text2,
    fontWeight: '700',
    marginBottom: 40,
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 44,
  },
  pill: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
    flex: 1,
    maxWidth: 90,
  },
  pillIcon: {
    fontSize: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text2,
  },
  btnGreen: {
    width: '100%',
    maxWidth: 370,
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
  btnGreenText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  btnOutline: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  btnOutlineText: {
    color: Colors.text2,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
