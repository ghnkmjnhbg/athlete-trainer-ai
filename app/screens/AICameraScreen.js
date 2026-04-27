import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { initCameraAI } from '../services/aiSystem';

export default function AICameraScreen({ navigation }) {
  const cameraStatus = initCameraAI();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'\uD83E\uDD16'} AI Form Coach</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>{'\uD83D\uDCF7'}</Text>
          <Text style={styles.cameraTitle}>Camera AI Coming Soon</Text>
          <Text style={styles.cameraDesc}>
            Real-time pose estimation with MediaPipe will analyze your exercise form through the camera.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Supported Exercises</Text>
          {cameraStatus.supportedExercises.map((ex, i) => (
            <View key={i} style={styles.exRow}>
              <Text style={styles.exDot}>{'\u2022'}</Text>
              <Text style={styles.exText}>
                {ex.charAt(0).toUpperCase() + ex.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusText}>{cameraStatus.status}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {cameraStatus.isReady ? 'Ready' : 'Placeholder Mode'}
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>What AI Coach Will Do:</Text>
          {[
            'Evaluate posture correctness in real-time',
            'Detect weak areas automatically',
            'Count reps only if form is valid',
            'Provide instant form feedback',
            'Adjust difficulty dynamically',
            'Prevent cheating reps',
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureCheck}>{'\u2705'}</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
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
    paddingBottom: 16,
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
  headerTitle: { fontSize: 21, fontWeight: '900', color: Colors.text },
  body: { flex: 1, padding: 18 },
  cameraPlaceholder: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 60, marginBottom: 12 },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
  },
  cameraDesc: {
    fontSize: 13,
    color: Colors.text2,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Colors.blueBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.blueDark,
    marginBottom: 8,
  },
  exRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  exDot: { color: Colors.blue, fontWeight: '800' },
  exText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  statusCard: {
    backgroundColor: Colors.orangeBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.orangeDark,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statusText: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  statusBadge: {
    backgroundColor: Colors.orange,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  featureList: {
    backgroundColor: Colors.greenBg,
    borderRadius: 16,
    padding: 14,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.greenDark,
    marginBottom: 8,
  },
  featureRow: { flexDirection: 'row', gap: 8, paddingVertical: 3 },
  featureCheck: { fontSize: 12 },
  featureText: { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },
});
