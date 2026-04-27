import { FALLBACK_PLAN } from '../constants/exercises';

export function generatePlan(profile) {
  return FALLBACK_PLAN;
}

export function getDayWorkout(plan, currentDay) {
  if (!plan || !plan.days) return null;
  const dayIdx = (currentDay - 1) % plan.days.length;
  return plan.days[dayIdx];
}

export function isTimedExercise(exercise) {
  return exercise.durationSec > 0;
}

export function canSkipExercise(exercise, exerciseIndex, totalExercises) {
  const isKey = exercise.type === 'BENCHMARK' || exerciseIndex === totalExercises - 1;
  return !isKey;
}

export function getExerciseDisplay(exercise) {
  const isTimed = isTimedExercise(exercise);
  return {
    isTimed,
    displayReps: isTimed ? `${exercise.durationSec}s` : exercise.reps || '10 reps',
    displaySets: exercise.sets || '3 sets',
    rest: '60\u201390 sec',
  };
}
