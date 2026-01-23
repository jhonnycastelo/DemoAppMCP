import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from './AppNavigator';

const Drawer = createDrawerNavigator();

export default function RootNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Main" component={AppNavigator} />
      {/* Add more drawer screens here if needed */}
    </Drawer.Navigator>
  );
}
