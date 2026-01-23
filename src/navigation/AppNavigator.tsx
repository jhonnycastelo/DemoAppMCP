// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs for main app
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
    </Tab.Navigator>
  );
}

// Stack for app navigation including detail screens
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* Tabs at the root */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/* Detail screen pushed on top */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detalle del producto' }}
      />
    </Stack.Navigator>
  );
}
