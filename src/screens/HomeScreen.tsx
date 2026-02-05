import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeEventEmitter } from 'react-native';
import { NativeModules } from 'react-native';
import { HomeHeroBanner } from '../components/HomeHeroBanner';
import { useFocusEffect } from '@react-navigation/native';

const { PersonalizationModule } = NativeModules;

interface HomeHeroBanner {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  onPressCta?: (url?: string) => void;
}

export default function HomeScreen() {
  const [homeHeroBanner, setHomeHeroBanner] = useState<HomeHeroBanner | null>(
    null,
  );
  useFocusEffect(
    React.useCallback(() => {
      PersonalizationModule.trackPageView('Home');
      PersonalizationModule.registerCampaignHandler('Home Hero Banner');
      const emitter = new NativeEventEmitter(PersonalizationModule);
      const listener = emitter.addListener('MCP_Campaign', event => {
        console.log('[EVENT] Home Hero Banner received:', event);
        // Handle the event as needed
        if (event.campaignName === 'Home Hero Banner') {
          // You can set state here to update the HomeHeroBanner props
          setHomeHeroBanner({
            headline: event.payload.headline,
            subheadline: event.payload.subheadline,
            ctaText: event.payload.ctaText,
            ctaUrl: event.payload.ctaUrl,
            imageUrl: event.payload.imageUrl,
          });
        } else {
          return;
        }
      });

      return () => listener.remove();
    }, []),
  );

  return (
    <View style={styles.screen}>
      <HomeHeroBanner campaign={homeHeroBanner} />
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
