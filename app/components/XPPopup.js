import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';

export default function XPPopup({ message, isError, visible, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.5, duration: 300, useNativeDriver: true }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.popup,
        isError ? styles.penalty : styles.reward,
        { opacity, transform: [{ scale }] },
      ]}
    >
      <Text style={[styles.text, isError && styles.penaltyText]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 8,
    zIndex: 200,
    elevation: 10,
  },
  reward: {
    backgroundColor: Colors.yellow,
  },
  penalty: {
    backgroundColor: Colors.red,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
  },
  penaltyText: {
    color: Colors.white,
  },
});
