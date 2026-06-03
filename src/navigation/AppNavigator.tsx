// navigation/AppNavigator.tsx
import React, { use, useContext, useEffect, useState } from 'react';
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
import { useCart } from '../components/context/CartContext';
import { LoginScreen } from '../screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tabs for main app
function MainTabs() {
  const value = useCart();
  const cartCount = value.cart.length;
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
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
        name="ProductsTab"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
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
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused, color, size }) => {
            console.log('Cart items count in tab:', value.cart.length);
            return (
              <MaterialDesignIcons
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                color={color}
              />
            );
          },
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detalle del producto' }}
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
        name="Root"
        component={MainStack}
        options={{ headerTitle: '' }}
      />
    </Drawer.Navigator>
  );
}
// Stack for app navigation including detail screens
export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const decoded = jwtDecode(token) as { exp: number } | null;
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        await AsyncStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 👇 Safe: after ALL hooks are declared
  if (isLoading) {
    return null; // or loading spinner
  }

  return isAuthenticated ? (
    <MainDrawer />
  ) : (
    <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
  );
}
