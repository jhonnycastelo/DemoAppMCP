import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/components/context/CartContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppWrapper() {
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
