import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  NativeModules,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../client';
import axios from 'axios';

const { PersonalizationModule } = NativeModules;

interface LoginScreenProps {
  onLoginSuccess: () => void;
}
export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      await AsyncStorage.setItem('token', res.data.token);
      PersonalizationModule.setUserId(res.data.userId);
      PersonalizationModule.setUserAttribute('email', email); // 👈 set email as user attribute
      onLoginSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Alert.alert('Error', err.response?.data?.message || 'Login failed');
      } else {
        Alert.alert('Error', 'Unexpected error');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/price-shoes-logo-png_seeklogo-169459.png')} // adjust path
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.signupLink}>Sign Up Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertical center
    alignItems: 'center', // horizontal center
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666',
    marginRight: 6,
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8, // 👈 rounded corners
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
