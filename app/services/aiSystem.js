/**
 * AI Form Detection System (MediaPipe-ready stub)
 *
 * This module provides form evaluation hooks that simulate AI-based
 * pose estimation for exercise form checking. The architecture is
 * designed to integrate with MediaPipe or similar camera-based AI
 * systems in the future.
 *
 * Output format:
 * {
 *   exercise: "pushup",
 *   reps: 10,
 *   formScore: 87,
 *   errors: ["hips too low"]
 * }
 */

export function getFormScore() {
  const base = 75 + Math.random() * 20;
  return Math.min(100, Math.round(base));
}

export function getFormColor(score) {
  if (score >= 90) return '#58cc02';
  if (score >= 75) return '#ff9600';
  if (score >= 60) return '#e0b800';
  return '#ff4b4b';
}

export function getFormMessage(score, exercise) {
  const checks = exercise.formChecks || ['form'];
  if (score >= 90) return `Perfect ${checks[0] || 'form'}!`;
  if (score >= 75) return `Good, but check: ${checks[1] || 'alignment'}`;
  if (score >= 60) return `Focus on: ${checks[0] || 'form'}`;
  return `Stop \u2014 fix: ${checks[0] || 'your form'}`;
}

export function getFormEmoji(score) {
  if (score >= 90) return '\u2705';
  if (score >= 75) return '\u26A0\uFE0F';
  if (score >= 60) return '\u26A0\uFE0F';
  return '\u274C';
}

/**
 * Evaluate exercise form (stub for camera-based AI)
 * In production, this would use MediaPipe pose estimation
 * to analyze camera feed and detect pose landmarks.
 */
export function evaluateExerciseForm(exerciseName) {
  const score = getFormScore();
  const errors = [];

  if (score < 90) {
    const possibleErrors = {
      'Push-Ups': ['hips too low', 'elbows flaring', 'incomplete lockout'],
      'Squat Jump': ['knees caving', 'not reaching depth', 'hard landing'],
      'Plank Hold': ['hips sagging', 'head dropping', 'breathing irregular'],
      'Sit-Ups': ['neck strain', 'using momentum', 'incomplete range'],
      default: ['form needs work', 'range of motion limited', 'tempo inconsistent'],
    };

    const exerciseErrors = possibleErrors[exerciseName] || possibleErrors.default;
    const numErrors = score < 60 ? 2 : 1;
    for (let i = 0; i < numErrors; i++) {
      errors.push(exerciseErrors[i % exerciseErrors.length]);
    }
  }

  return {
    exercise: exerciseName,
    formScore: score,
    errors,
    timestamp: Date.now(),
  };
}

/**
 * Placeholder for camera integration
 * MediaPipe pose estimation would be initialized here
 */
export function initCameraAI() {
  return {
    isReady: false,
    status: 'Camera AI module placeholder - MediaPipe integration pending',
    supportedExercises: [
      'pushups',
      'squats',
      'planks',
      'situps',
      'lunges',
      'burpees',
    ],
  };
}
