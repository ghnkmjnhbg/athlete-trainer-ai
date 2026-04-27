import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

const STEPS = [
  { icon: '\uD83D\uDCCA', text: 'Analysing your profile...' },
  { icon: '\uD83C\uDFAF', text: 'Setting your goal path...' },
  { icon: '\uD83C\uDFCB\uFE0F', text: 'Selecting exercises...' },
  { icon: '\uD83D\uDCC5', text: 'Building weekly schedule...' },
  { icon: '\u26A1', text: 'Calibrating intensity...' },
  { icon: '\u2705', text: 'Plan ready!' },
];

export default function LoaderScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const bounce = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -12, duration: 350, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 350, useNativeDriver: true }),
      ])
    ).start();

    let step = 0;
    const interval = setInterval(() => {
      setCurrentStep(step);
      step++;
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        }, 800);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mascot, { transform: [{ translateY: bounce }] }]}>
        <Text style={styles.mascotEmoji}>{'\uD83E\uDD85'}</Text>
      </Animated.View>

      <Text style={styles.title}>{'\uD83E\uDD16'} Building your plan...</Text>
      <Text style={styles.subtitle}>
        Our AI is crafting a programme just for you
      </Text>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { opacity: 0.3 + ((currentStep + i) % 3) * 0.3 }]} />
        ))}
      </View>

      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <View
            key={i}
            style={[
              styles.step,
              { opacity: i <= currentStep ? 1 : 0 },
            ]}
          >
            <Text style={styles.stepIcon}>
              {i < currentStep ? '\u2705' : step.icon}
            </Text>
            <Text
              style={[
                styles.stepText,
                i < currentStep && styles.stepDone,
              ]}
            >
              {step.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  mascot: { marginBottom: 16 },
  mascotEmoji: { fontSize: 100 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text2,
    fontWeight: '600',
    maxWidth: 260,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  steps: {
    marginTop: 20,
    alignSelf: 'flex-start',
    maxWidth: 280,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  stepIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text2,
  },
  stepDone: {
    color: Colors.green,
  },
});
