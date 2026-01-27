// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tabs for main app
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialDesignIcons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialDesignIcons
              name={focused ? 'shoe-print' : 'shoe-print'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialDesignIcons
              name={focused ? 'cart' : 'cart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={MainTabs} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detalle del producto' }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
    </Stack.Navigator>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={props => <CustomDrawer {...props}></CustomDrawer>}
    >
      <Drawer.Screen
        name="Home"
        component={MainStack}
        options={{ headerTitle: '' }}
      />
      <Drawer.Screen name="Products" component={ProductsScreen} />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: true, headerTitle: 'My Cart' }}
      />
    </Drawer.Navigator>
  );
}
// Stack for app navigation including detail screens
export default function AppNavigator() {
  return <MainDrawer></MainDrawer>;
}
