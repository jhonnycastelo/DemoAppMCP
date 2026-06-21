import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/components/context/CartContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import { NativeModules } from 'react-native';

const { PersonalizationModule } = NativeModules;

export default function AppWrapper() {
  useEffect(() => {
    const ref = database().ref('/campaignTargets');

    const listener = ref.on('value', snapshot => {
      const data = snapshot.val();

      let targets: string[] = [];

      if (Array.isArray(data)) {
        targets = data;
      } else if (data) {
        targets = Object.keys(data);
      }

      console.log('[MCP] Targets loaded:', targets);

      if (targets.length > 0) {
        PersonalizationModule.registerCampaignHandlers(targets);
      }
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
