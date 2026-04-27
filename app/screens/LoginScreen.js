import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Firebase auth placeholder - go to splash for now
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google Sign-In will be available in a future update.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.mascot}>{'\uD83E\uDD85'}</Text>
      <Text style={styles.title}>FitQuest</Text>
      <Text style={styles.subtitle}>
        {isRegister ? 'Create your account' : 'Welcome back, athlete'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btnGreen} onPress={handleSubmit}>
          <Text style={styles.btnGreenText}>
            {isRegister ? 'CREATE ACCOUNT' : 'LOG IN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogleLogin}>
          <Text style={styles.btnGoogleText}>
            {'\uD83C\uDF10'} Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchText}>
            {isRegister
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  mascot: { fontSize: 80, marginBottom: 10 },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text2,
    fontWeight: '700',
    marginBottom: 32,
  },
  form: { width: '100%', maxWidth: 370 },
  input: {
    width: '100%',
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  btnGreen: {
    width: '100%',
    backgroundColor: Colors.green,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 4,
  },
  btnGreenText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  btnGoogle: {
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.grayMed,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  btnGoogleText: {
    color: Colors.text2,
    fontSize: 16,
    fontWeight: '800',
  },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { fontSize: 14, color: Colors.blue, fontWeight: '700' },
});
