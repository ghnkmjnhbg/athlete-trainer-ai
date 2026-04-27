export function getStreakMultiplier(streak) {
  if (streak >= 30) return 2;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}

export function getFormMultiplier(avgForm) {
  if (avgForm >= 90) return 1.2;
  if (avgForm >= 75) return 1;
  if (avgForm >= 60) return 0.8;
  return 0.5;
}

export function calculateWorkoutXP({
  baseXP,
  streak,
  xpBoostActive,
  formScores,
  exercisesDone,
  sessionSkips,
}) {
  const mult = getStreakMultiplier(streak);
  const boostMult = xpBoostActive ? 2 : 1;

  const validScores = formScores
    .filter((f) => !f.skipped)
    .map((f) => f.score);
  const avgForm =
    validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 75;
  const formMult = getFormMultiplier(avgForm);

  let xpEarned = Math.round(baseXP * mult * boostMult * formMult);
  xpEarned += exercisesDone * 5;
  if (sessionSkips === 0) xpEarned += 30;
  xpEarned = Math.max(40, xpEarned);

  return { xpEarned, avgForm };
}

export function calculateDisciplineEarned({ sessionSkips, streak }) {
  return 10 + (sessionSkips === 0 ? 10 : 0) + (streak >= 3 ? 5 : 0) + (streak >= 7 ? 10 : 0);
}

export function getSkipPenalty(sessionSkipCount) {
  if (sessionSkipCount === 1) return 10;
  if (sessionSkipCount === 2) return 25;
  return 50;
}

export function checkAchievements(state) {
  const achs = [...state.achievements];
  if (state.workoutsDone >= 1 && !achs.includes('first')) achs.push('first');
  if (state.streak >= 3 && !achs.includes('s3')) achs.push('s3');
  if (state.streak >= 7 && !achs.includes('s7')) achs.push('s7');
  if (state.workoutsDone >= 5 && !achs.includes('c5')) achs.push('c5');
  if (state.level >= 5 && !achs.includes('lv5')) achs.push('lv5');
  return achs;
}

export function getLevelFromXP(xp) {
  let level = 1;
  while (xp >= level * 100) {
    level++;
  }
  return level;
}

export function getLeagueName(streak) {
  if (streak >= 14) return 'Gold League';
  if (streak >= 7) return 'Silver League';
  if (streak >= 3) return 'Bronze League';
  return 'Starter League';
}
