import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { PersonalizationModule } = NativeModules;

export default function HomeScreen() {
  useEffect(() => {
    PersonalizationModule.trackPageView('Home');
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Price Shoes Demo</Text>
      <Text style={styles.subtitle}>Bienvenid@ ✨</Text>
      <Text style={styles.text}>
        Esta es una app de prueba construida en React Native para integrar con
        Salesforce Marketing Cloud Personalization.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
