import React, { createContext, useContext, useReducer } from 'react';
import { FALLBACK_PLAN, LEADERBOARD_DATA } from '../constants/exercises';

const initialState = {
  xp: 0,
  level: 1,
  streak: 0,
  discipline: 0,
  skipTokens: 1,
  xpBoostActive: false,
  streakShieldActive: false,
  workoutsDone: 0,
  bestStreak: 0,
  currentDay: 1,
  weekDays: [false, false, false, false, false, false, false],
  achievements: [],
  profile: {},
  plan: null,
  formScores: [],
  totalSkips: 0,
  leaderboard: LEADERBOARD_DATA,
  isLoggedIn: false,
  onboardingComplete: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };

    case 'SET_PLAN':
      return { ...state, plan: action.payload };

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboardingComplete: true,
        plan: action.payload || FALLBACK_PLAN,
      };

    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };

    case 'QUICK_START':
      return {
        ...state,
        isLoggedIn: true,
        onboardingComplete: true,
        plan: FALLBACK_PLAN,
        profile: { age: 13 },
      };

    case 'ADD_XP': {
      const newXP = state.xp + action.payload;
      let newLevel = state.level;
      while (newXP >= newLevel * 100) newLevel++;
      return { ...state, xp: newXP, level: newLevel };
    }

    case 'REMOVE_XP':
      return { ...state, xp: Math.max(0, state.xp - action.payload) };

    case 'ADD_DISCIPLINE':
      return { ...state, discipline: state.discipline + action.payload };

    case 'REMOVE_DISCIPLINE':
      return { ...state, discipline: Math.max(0, state.discipline - action.payload) };

    case 'INCREMENT_STREAK': {
      const newStreak = state.streak + 1;
      return {
        ...state,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      };
    }

    case 'COMPLETE_WORKOUT': {
      const {
        xpEarned,
        disciplineEarned,
        formScores,
        exercisesDone,
      } = action.payload;
      const newXP = state.xp + xpEarned;
      let newLevel = state.level;
      while (newXP >= newLevel * 100) newLevel++;
      const newStreak = state.streak + 1;
      const newWorkouts = state.workoutsDone + 1;
      const newDay = state.currentDay + 1;
      const td = new Date().getDay();
      const weekDays = [...state.weekDays];
      if (td > 0) weekDays[td - 1] = true;

      let achs = [...state.achievements];
      if (newWorkouts === 1 && !achs.includes('first')) achs.push('first');
      if (newStreak >= 3 && !achs.includes('s3')) achs.push('s3');
      if (newStreak >= 7 && !achs.includes('s7')) achs.push('s7');
      if (newWorkouts >= 5 && !achs.includes('c5')) achs.push('c5');
      if (newLevel >= 5 && !achs.includes('lv5')) achs.push('lv5');
      const validScores = formScores.filter((f) => !f.skipped).map((f) => f.score);
      const avgForm = validScores.length
        ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
        : 0;
      if (avgForm >= 90 && !achs.includes('perf')) achs.push('perf');
      achs = [...new Set(achs)];

      return {
        ...state,
        xp: newXP,
        level: newLevel,
        discipline: state.discipline + disciplineEarned,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        workoutsDone: newWorkouts,
        currentDay: newDay,
        weekDays,
        formScores,
        achievements: achs,
        xpBoostActive: false,
      };
    }

    case 'BUY_ITEM': {
      const { id, cost } = action.payload;
      if (state.discipline < cost) return state;
      const updates = { discipline: state.discipline - cost };
      if (id === 'xpboost') updates.xpBoostActive = true;
      if (id === 'skiptoken') updates.skipTokens = state.skipTokens + 1;
      if (id === 'streakshield') updates.streakShieldActive = true;
      if (id === 'xprecovery') updates.xp = Math.max(0, state.xp + 20);
      if (id === 'energyrefill') updates.discipline = updates.discipline + 5;
      return { ...state, ...updates };
    }

    case 'USE_SKIP_TOKEN':
      return { ...state, skipTokens: Math.max(0, state.skipTokens - 1) };

    case 'UPDATE_LEADERBOARD': {
      const lb = state.leaderboard.map((r) =>
        r.me
          ? { ...r, xp: state.xp, streak: state.streak, disc: state.discipline }
          : r
      );
      return { ...state, leaderboard: lb };
    }

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
