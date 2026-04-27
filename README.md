# Athlete Trainer AI

A **Duolingo-style gamified fitness app** built with React Native (Expo) and Firebase. Workouts are lessons, fitness is a skill tree, AI is your form coach, and discipline is your core economy.

## Features

### Auth System
- Email/password login with Firebase Authentication
- Google login (placeholder)
- Persistent login sessions
- Auto session restore

### Workout System (Duolingo-style)
- Structured workouts: warm-up, main exercises, cooldown
- Exercises include pushups, planks, squats, situps, cardio intervals
- Each exercise has reps OR timer, AI form evaluation, and completion tracking
- Rest timer between exercises

### AI Form Detection (MediaPipe-ready)
- Simulated AI form scoring with real-time feedback
- Form score affects XP earned
- Architecture designed for camera-based AI integration (MediaPipe)
- Real-time form feedback text and score display

### Reward + Penalty Engine
- **XP System**: Base workout XP + per-exercise bonus + perfect form bonus
- **Streak System**: Daily tracking with multipliers (3d=1.2x, 7d=1.5x, 30d=2.0x)
- **Penalties**: Skip exercise = -10 to -50 XP, skip workout = -75 XP
- **Discipline System**: Currency earned through consistency, lost when skipping

### Shop System
- Streak Shield, XP Boost, Skip Token, AI Coach Upgrade, and more
- Spend discipline points on power-ups

### Progression (Skill Tree)
- Duolingo-style node path system
- 5-day workout plans with unlockable nodes
- Stars for completed days

### League System
- Leaderboard with ranked players
- League tiers (Starter, Bronze, Silver, Gold)
- Weekly rankings

## Tech Stack

- **React Native (Expo)**
- **Firebase Authentication**
- **Firestore Database**
- **React Navigation** (Stack + Bottom Tabs)
- **Modular JS architecture**
- **AI module placeholder** (MediaPipe-ready)

## Project Structure

```
/app
  /screens
    SplashScreen.js
    LoginScreen.js
    OnboardingScreen.js
    LoaderScreen.js
    HomeScreen.js
    WorkoutScreen.js
    CompleteScreen.js
    ProgressScreen.js
    PlanScreen.js
    ShopScreen.js
    LeagueScreen.js
    AICameraScreen.js
  /components
    ProgressBar.js
    XPPopup.js
  /services
    auth.js
    rewardEngine.js
    aiSystem.js
    workoutEngine.js
  /firebase
    config.js
  /context
    AppContext.js
  /constants
    colors.js
    exercises.js
App.js
```

## Setup

```bash
npm install
npx expo start
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Update `app/firebase/config.js` with your Firebase config

## User Data Model (Firestore)

```json
{
  "uid": "",
  "email": "",
  "profile": {
    "age": 0,
    "height": 0,
    "weight": 0,
    "sport": "",
    "goal": "",
    "experience": ""
  },
  "stats": {
    "xp": 0,
    "discipline": 50,
    "streak": 0,
    "level": 1
  },
  "ai": {
    "avgFormScore": 0,
    "weakAreas": []
  }
}
```

## Game Balance

- Effort is always rewarded
- Skipping is always punished
- Recovery exists but is costly (shop items)
- No XP farming exploits
- Form quality matters more than speed
