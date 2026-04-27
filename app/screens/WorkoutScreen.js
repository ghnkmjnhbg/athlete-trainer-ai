import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import { getDayWorkout, isTimedExercise, canSkipExercise, getExerciseDisplay } from '../services/workoutEngine';
import { getFormScore, getFormColor, getFormMessage, getFormEmoji } from '../services/aiSystem';
import { getSkipPenalty, calculateWorkoutXP, calculateDisciplineEarned, getStreakMultiplier } from '../services/rewardEngine';
import ProgressBar from '../components/ProgressBar';
import XPPopup from '../components/XPPopup';

export default function WorkoutScreen({ navigation }) {
  const { state, dispatch } = useAppState();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(12);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [formScore, setFormScore] = useState(80);
  const [formScores, setFormScores] = useState([]);
  const [doneCount, setDoneCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [popup, setPopup] = useState({ visible: false, message: '', isError: false });
  const timerRef = useRef(null);
  const restRef = useRef(null);
  const formAnimRef = useRef(null);

  const workout = getDayWorkout(state.plan, state.currentDay);
  const exercises = workout?.exercises || [];
  const currentEx = exercises[exerciseIndex];
  const total = exercises.length;
  const progress = (exerciseIndex / total) * 100;

  useEffect(() => {
    if (currentEx) {
      const score = getFormScore();
      setFormScore(score);

      if (isTimedExercise(currentEx)) {
        setExerciseTimer(currentEx.durationSec);
      }
    }
  }, [exerciseIndex]);

  useEffect(() => {
    if (currentEx && isTimedExercise(currentEx) && exerciseTimer > 0 && !isResting) {
      timerRef.current = setInterval(() => {
        setExerciseTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [exerciseTimer, isResting, exerciseIndex]);

  useEffect(() => {
    if (isResting && restTime > 0) {
      restRef.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            clearInterval(restRef.current);
            setIsResting(false);
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(restRef.current);
    }
  }, [isResting, restTime]);

  useEffect(() => {
    if (!isResting && currentEx) {
      let tick = 0;
      formAnimRef.current = setInterval(() => {
        const jitter = Math.max(50, Math.min(100, formScore + Math.round((Math.random() - 0.5) * 8)));
        setFormScore(jitter);
        tick++;
        if (tick > 20) clearInterval(formAnimRef.current);
      }, 600);
      return () => clearInterval(formAnimRef.current);
    }
  }, [exerciseIndex, isResting]);

  const showPopup = (message, isError) => {
    setPopup({ visible: true, message, isError });
  };

  const advance = () => {
    if (exerciseIndex < total - 1) {
      setIsResting(true);
      setRestTime(12);
    } else {
      finishWorkout();
    }
  };

  const handleDone = () => {
    clearInterval(timerRef.current);
    clearInterval(formAnimRef.current);
    setDoneCount((prev) => prev + 1);

    const newFormScores = [
      ...formScores,
      { name: currentEx?.name || 'Exercise', score: formScore },
    ];
    setFormScores(newFormScores);

    let xpGained = 5;
    if (formScore >= 90) xpGained = 8;
    if (formScore < 60) xpGained = 2;

    const emoji = formScore >= 90 ? 'Perfect form!' : formScore >= 75 ? 'Good form' : 'Work on form';
    showPopup(`+${xpGained} XP ${emoji}`, false);

    if (exerciseIndex < total - 1) {
      setExerciseIndex((prev) => prev + 1);
      setIsResting(true);
      setRestTime(12);
    } else {
      finishWorkoutWithScores(newFormScores, doneCount + 1, skipCount);
    }
  };

  const handleSkip = (useToken) => {
    clearInterval(timerRef.current);
    clearInterval(formAnimRef.current);

    if (!canSkipExercise(currentEx, exerciseIndex, total)) {
      showPopup('Cannot skip this key exercise!', true);
      return;
    }

    if (useToken) {
      if (state.skipTokens <= 0) {
        showPopup('No skip tokens left!', true);
        return;
      }
      dispatch({ type: 'USE_SKIP_TOKEN' });
      showPopup('Skip token used \u2014 no penalty', false);
    } else {
      const newSkipCount = skipCount + 1;
      setSkipCount(newSkipCount);
      const penalty = getSkipPenalty(newSkipCount);
      dispatch({ type: 'REMOVE_XP', payload: penalty });
      dispatch({ type: 'REMOVE_DISCIPLINE', payload: 2 });
      showPopup(`Skipped! \u2212${penalty} XP \u22122 \uD83D\uDC8E`, true);
    }

    const newFormScores = [
      ...formScores,
      { name: currentEx?.name || 'Exercise', score: 0, skipped: true },
    ];
    setFormScores(newFormScores);

    if (exerciseIndex < total - 1) {
      setExerciseIndex((prev) => prev + 1);
      setIsResting(true);
      setRestTime(12);
    } else {
      finishWorkoutWithScores(newFormScores, doneCount, skipCount + (useToken ? 0 : 1));
    }
  };

  const finishWorkout = () => {
    finishWorkoutWithScores(formScores, doneCount, skipCount);
  };

  const finishWorkoutWithScores = (scores, done, skips) => {
    const baseXP = workout?.xp || 80;
    const { xpEarned, avgForm } = calculateWorkoutXP({
      baseXP,
      streak: state.streak,
      xpBoostActive: state.xpBoostActive,
      formScores: scores,
      exercisesDone: done,
      sessionSkips: skips,
    });
    const disciplineEarned = calculateDisciplineEarned({
      sessionSkips: skips,
      streak: state.streak,
    });

    dispatch({
      type: 'COMPLETE_WORKOUT',
      payload: {
        xpEarned,
        disciplineEarned,
        formScores: scores,
        exercisesDone: done,
      },
    });

    const elapsed = Math.round((Date.now() - startTime) / 60000);

    let newBadge = null;
    if (state.workoutsDone === 0) newBadge = 'First Workout!';
    else if (state.streak === 2) newBadge = '3-Day Streak!';
    else if (state.streak === 6) newBadge = 'Week Warrior!';
    else if (avgForm >= 90) newBadge = 'Perfect Form!';

    navigation.replace('Complete', {
      xpEarned,
      streak: state.streak + 1,
      done,
      time: `${elapsed}m`,
      formScores: scores,
      skips,
      disciplineEarned,
      badge: newBadge,
    });
  };

  const skipRest = () => {
    clearInterval(restRef.current);
    setIsResting(false);
    setRestTime(12);
  };

  const exitWorkout = () => {
    Alert.alert('Exit Workout', 'Are you sure? Progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          clearInterval(timerRef.current);
          clearInterval(restRef.current);
          clearInterval(formAnimRef.current);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!currentEx) return null;

  const display = getExerciseDisplay(currentEx);
  const fColor = getFormColor(formScore);
  const fMsg = getFormMessage(formScore, currentEx);
  const fEmoji = getFormEmoji(formScore);

  if (isResting) {
    const nextEx = exercises[exerciseIndex];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={exitWorkout} style={styles.closeBtn}>
            <Text style={styles.closeText}>{'\u2715'}</Text>
          </TouchableOpacity>
          <View style={styles.progWrap}>
            <ProgressBar progress={progress} />
          </View>
          <View style={styles.discBadge}>
            <Text style={styles.discText}>{`\uD83D\uDC8E${state.discipline}`}</Text>
          </View>
        </View>
        <View style={styles.restCard}>
          <Text style={styles.restEmoji}>{'\uD83D\uDCA8'}</Text>
          <Text style={styles.restTitle}>Rest Up</Text>
          <Text style={styles.restNext}>
            Next: <Text style={{ fontWeight: '900' }}>{nextEx?.name || 'exercise'}</Text>
          </Text>
          <View style={styles.timerCircle}>
            <Text style={styles.timerNumber}>{restTime}</Text>
          </View>
          <TouchableOpacity style={styles.skipRestBtn} onPress={skipRest}>
            <Text style={styles.skipRestText}>{'Skip Rest \u2192'}</Text>
          </TouchableOpacity>
        </View>
        <XPPopup {...popup} onHide={() => setPopup({ ...popup, visible: false })} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={exitWorkout} style={styles.closeBtn}>
          <Text style={styles.closeText}>{'\u2715'}</Text>
        </TouchableOpacity>
        <View style={styles.progWrap}>
          <ProgressBar progress={progress} />
        </View>
        <View style={styles.discBadge}>
          <Text style={styles.discText}>{`\uD83D\uDC8E${state.discipline}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.exTypeTag}>{currentEx.type || 'EXERCISE'}</Text>
        <Text style={styles.exNum}>{`${exerciseIndex + 1} of ${total}`}</Text>
        <Text style={styles.exName}>{currentEx.name}</Text>

        <View style={styles.exVisual}>
          <Text style={styles.exVisualIcon}>{currentEx.icon || '\uD83D\uDCAA'}</Text>
          <View style={styles.repsBadge}>
            <Text style={styles.repsText}>{display.displayReps}</Text>
          </View>
        </View>

        {display.isTimed && (
          <View style={styles.timerWrap}>
            <View style={styles.exTimerCircle}>
              <Text
                style={[
                  styles.exTimerNum,
                  exerciseTimer <= 5 && { color: Colors.red },
                  exerciseTimer > 5 && exerciseTimer <= 10 && { color: Colors.orange },
                ]}
              >
                {exerciseTimer}
              </Text>
            </View>
            <Text style={styles.timerLabel}>
              Hold for {currentEx.durationSec} seconds
            </Text>
          </View>
        )}

        <View style={styles.formBar}>
          <View style={styles.formBarHeader}>
            <Text style={styles.formBarLabel}>{'\uD83E\uDD16'} AI Form Check</Text>
            <Text style={[styles.formScoreVal, { color: fColor }]}>
              {formScore}%
            </Text>
          </View>
          <ProgressBar progress={formScore} color={fColor} height={10} />
          <Text style={[styles.formFeedback, { color: fColor }]}>
            {fEmoji} {fMsg}
          </Text>
        </View>

        <View style={styles.exInfo}>
          <View style={styles.exInfoRow}>
            <Text style={styles.eiLabel}>Sets</Text>
            <Text style={styles.eiValue}>{display.displaySets}</Text>
          </View>
          <View style={styles.exInfoRow}>
            <Text style={styles.eiLabel}>{display.isTimed ? 'Duration' : 'Reps'}</Text>
            <Text style={styles.eiValue}>{display.displayReps}</Text>
          </View>
          <View style={[styles.exInfoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.eiLabel}>Rest</Text>
            <Text style={styles.eiValue}>{display.rest}</Text>
          </View>
        </View>

        <View style={styles.exCue}>
          <Text style={styles.cueHeader}>{'\uD83C\uDFAF'} HOW TO DO IT</Text>
          <Text style={styles.cueText}>
            {currentEx.cue || 'Perform with control and good form.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
          <Text style={styles.doneBtnText}>{'\u2705'} DONE {'\u2014'} Great Rep!</Text>
        </TouchableOpacity>
        <View style={styles.skipRow}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => handleSkip(false)}
          >
            <Text style={styles.skipBtnText}>{'\u274C'} Skip ({'\u2013'}10 XP)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipTokenBtn}
            onPress={() => handleSkip(true)}
          >
            <Text style={styles.skipTokenText}>
              {'\uD83C\uDFAB'} Use Skip Token
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <XPPopup {...popup} onHide={() => setPopup({ ...popup, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayMed,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 20, color: Colors.gray },
  progWrap: { flex: 1 },
  discBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.purpleBg,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  discText: { fontSize: 13, fontWeight: '800', color: Colors.purple },
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 200 },
  exTypeTag: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.orange,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  exNum: { fontSize: 12, color: Colors.text2, fontWeight: '700', marginBottom: 3 },
  exName: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 16, lineHeight: 29 },
  exVisual: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    position: 'relative',
  },
  exVisualIcon: { fontSize: 78 },
  repsBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.text,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  repsText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  timerWrap: { alignItems: 'center', marginBottom: 16 },
  exTimerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 9,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exTimerNum: { fontSize: 30, fontWeight: '900', color: Colors.text },
  timerLabel: { fontSize: 13, fontWeight: '700', color: Colors.text2, marginTop: 8 },
  formBar: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  formBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  formBarLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formScoreVal: { fontSize: 13, fontWeight: '900' },
  formFeedback: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  exInfo: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  exInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayMed,
  },
  eiLabel: { fontSize: 13, color: Colors.text2, fontWeight: '700' },
  eiValue: { fontSize: 14, fontWeight: '800', color: Colors.text },
  exCue: {
    backgroundColor: '#fffbec',
    borderWidth: 2,
    borderColor: Colors.yellow,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cueHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.orange,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  cueText: { fontSize: 13, fontWeight: '600', color: Colors.text, lineHeight: 20 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderTopWidth: 2,
    borderTopColor: Colors.grayMed,
    backgroundColor: Colors.white,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: Colors.green,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  doneBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  skipRow: { flexDirection: 'row', gap: 10 },
  skipBtn: {
    flex: 1,
    backgroundColor: Colors.redBg,
    borderWidth: 2.5,
    borderColor: Colors.red,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  skipBtnText: { fontSize: 13, fontWeight: '800', color: Colors.red },
  skipTokenBtn: {
    flex: 1,
    backgroundColor: Colors.purpleBg,
    borderWidth: 2.5,
    borderColor: Colors.purple,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  skipTokenText: { fontSize: 13, fontWeight: '800', color: Colors.purpleDark },
  // Rest screen
  restCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  restEmoji: { fontSize: 60, marginBottom: 14 },
  restTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, marginBottom: 5 },
  restNext: { fontSize: 14, color: Colors.text2, fontWeight: '700', marginBottom: 24 },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 9,
    borderColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerNumber: { fontSize: 32, fontWeight: '900', color: Colors.text },
  skipRestBtn: {
    backgroundColor: Colors.grayLight,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 26,
  },
  skipRestText: { fontSize: 14, fontWeight: '800', color: Colors.text2 },
});
