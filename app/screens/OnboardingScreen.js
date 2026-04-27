import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { ONBOARDING_QUESTIONS, FALLBACK_PLAN } from '../constants/exercises';
import { useAppState } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';

export default function OnboardingScreen({ navigation }) {
  const { dispatch } = useAppState();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = ONBOARDING_QUESTIONS;
  const q = questions[currentQ];

  const progress = (currentQ / questions.length) * 100;

  const micros = [
    "Let's go!", 'Got it!', 'Noted', 'Perfect', 'Sport locked in!',
    'Focus areas locked!', 'Level set!', 'Equipment noted!',
    'Time set', 'Schedule set!', 'Intensity set!',
  ];

  const isValid = () => {
    if (q.optional) return true;
    if (q.type === 'number') return !!answers[q.id];
    if (q.type === 'choice') return !!answers[q.id];
    if (q.type === 'multi') {
      const sel = answers[q.id] || [];
      return sel.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      dispatch({ type: 'SET_PROFILE', payload: answers });
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: FALLBACK_PLAN });
      navigation.navigate('Loader');
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      navigation.goBack();
    }
  };

  const pickChoice = (value) => {
    setAnswers({ ...answers, [q.id]: value });
  };

  const toggleMulti = (value) => {
    const sel = answers[q.id] || [];
    if (sel.includes(value)) {
      setAnswers({ ...answers, [q.id]: sel.filter((v) => v !== value) });
    } else {
      setAnswers({ ...answers, [q.id]: [...sel, value] });
    }
  };

  const renderQuestion = () => {
    if (q.type === 'number') {
      return (
        <View style={styles.numRow}>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            placeholder={q.placeholder}
            value={answers[q.id] ? String(answers[q.id]) : ''}
            onChangeText={(v) => setAnswers({ ...answers, [q.id]: v })}
            placeholderTextColor={Colors.gray}
          />
          <Text style={styles.numUnit}>{q.unit}</Text>
        </View>
      );
    }

    if (q.type === 'choice') {
      return (
        <View style={[styles.choices, q.twoCol && styles.twoCol]}>
          {q.options.map((opt) => (
            <TouchableOpacity
              key={String(opt.value)}
              style={[
                styles.choiceBtn,
                answers[q.id] === opt.value && styles.choiceSel,
                q.twoCol && styles.choiceTwoCol,
              ]}
              onPress={() => pickChoice(opt.value)}
            >
              <Text style={styles.choiceIcon}>{opt.icon}</Text>
              <Text style={[styles.choiceLabel, answers[q.id] === opt.value && styles.choiceLabelSel]}>
                {opt.label}
              </Text>
              <View
                style={[
                  styles.choiceCheck,
                  answers[q.id] === opt.value && styles.choiceCheckSel,
                ]}
              >
                {answers[q.id] === opt.value && (
                  <Text style={styles.checkMark}>{'\u2713'}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (q.type === 'multi') {
      const sel = answers[q.id] || [];
      return (
        <View style={styles.choices}>
          {q.options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.choiceBtn,
                sel.includes(opt.value) && styles.choiceMultiSel,
              ]}
              onPress={() => toggleMulti(opt.value)}
            >
              <Text style={styles.choiceIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.choiceLabel,
                  sel.includes(opt.value) && styles.choiceMultiLabelSel,
                ]}
              >
                {opt.label}
              </Text>
              <View
                style={[
                  styles.choiceCheck,
                  sel.includes(opt.value) && styles.choiceMultiCheckSel,
                ]}
              >
                {sel.includes(opt.value) && (
                  <Text style={styles.checkMark}>{'\u2713'}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <View style={styles.progTrack}>
          <ProgressBar progress={progress} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {currentQ === 0 && (
          <View style={styles.mascotRow}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>{q.bubble}</Text>
            </View>
            <Text style={styles.mascotEmoji}>{'\uD83E\uDD85'}</Text>
          </View>
        )}

        <Text style={styles.qTitle}>{q.question}</Text>
        <Text style={styles.qSub}>
          {q.subtitle}
          {q.optional && (
            <Text style={styles.optionalText}> (optional)</Text>
          )}
        </Text>

        {renderQuestion()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !isValid() && styles.continueBtnDisabled]}
          onPress={handleNext}
          disabled={!isValid()}
        >
          <Text
            style={[
              styles.continueBtnText,
              !isValid() && styles.continueBtnTextDisabled,
            ]}
          >
            CONTINUE
          </Text>
        </TouchableOpacity>
        {answers[q.id] && (
          <Text style={styles.microcopy}>{micros[currentQ] || ''}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grayMed,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.gray },
  progTrack: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 22 },
  bodyContent: { paddingTop: 24, paddingBottom: 140 },
  mascotRow: { alignItems: 'center', marginBottom: 24 },
  speechBubble: {
    backgroundColor: Colors.grayLight,
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 20,
    maxWidth: 260,
    marginBottom: 10,
  },
  speechText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  mascotEmoji: { fontSize: 80 },
  qTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  qSub: {
    fontSize: 14,
    color: Colors.text2,
    fontWeight: '600',
    marginBottom: 20,
  },
  optionalText: {
    color: Colors.gray,
    fontSize: 12,
  },
  numRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 10,
  },
  numInput: {
    width: 150,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    padding: 14,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  numUnit: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text2,
  },
  choices: { gap: 10 },
  twoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceBtn: {
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  choiceTwoCol: {
    width: '48%',
  },
  choiceSel: {
    borderColor: Colors.blue,
    backgroundColor: Colors.blueBg,
  },
  choiceMultiSel: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenBg,
  },
  choiceIcon: { fontSize: 20 },
  choiceLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  choiceLabelSel: {
    color: Colors.blueDark,
  },
  choiceMultiLabelSel: {
    color: Colors.greenDark,
  },
  choiceCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCheckSel: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  choiceMultiCheckSel: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  checkMark: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 34,
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderTopColor: Colors.grayMed,
  },
  continueBtn: {
    width: '100%',
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
  continueBtnDisabled: {
    backgroundColor: Colors.grayMed,
    shadowColor: '#c8c8c8',
  },
  continueBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  continueBtnTextDisabled: {
    color: Colors.gray,
  },
  microcopy: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.greenDark,
    textAlign: 'center',
    marginTop: 12,
  },
});
