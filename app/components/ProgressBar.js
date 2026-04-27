import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function ProgressBar({ progress, color, height = 14 }) {
  const fillColor = color || Colors.green;
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: fillColor, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.grayMed,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 99,
  },
});
