import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import { AppProvider } from './app/context/AppContext';
import SplashScreen from './app/screens/SplashScreen';
import LoginScreen from './app/screens/LoginScreen';
import OnboardingScreen from './app/screens/OnboardingScreen';
import LoaderScreen from './app/screens/LoaderScreen';
import HomeScreen from './app/screens/HomeScreen';
import WorkoutScreen from './app/screens/WorkoutScreen';
import CompleteScreen from './app/screens/CompleteScreen';
import ProgressScreen from './app/screens/ProgressScreen';
import PlanScreen from './app/screens/PlanScreen';
import ShopScreen from './app/screens/ShopScreen';
import LeagueScreen from './app/screens/LeagueScreen';
import AICameraScreen from './app/screens/AICameraScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '\uD83C\uDFE0',
  Progress: '\uD83D\uDCCA',
  Plan: '\uD83D\uDCC5',
  Shop: '\uD83D\uDED2',
  League: '\uD83C\uDFC6',
};

function TabIcon({ name, focused }) {
  return (
    <View style={styles.tabIconWrap}>
      <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>
        {TAB_ICONS[name] || '\uD83C\uDFE0'}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#1cb0f6',
        tabBarInactiveTintColor: '#afafaf',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
        },
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: '#e5e5e5',
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="League" component={LeagueScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Splash"
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Loader" component={LoaderScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="Complete" component={CompleteScreen} />
          <Stack.Screen name="AICamera" component={AICameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 21,
  },
  tabIconInactive: {
    opacity: 0.4,
  },
});
