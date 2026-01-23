import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../client';
import axios from 'axios';

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
      Alert.alert('Success', 'Logged in!');
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
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});
