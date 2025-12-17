// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef, flushNavigationQueue } from './NavigationService';
import { RootStackParamList } from './types';
import App from '../../App';
import { ProductDetailScreen } from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Your EXISTING App.tsx */}
        <Stack.Screen
          name="AppRoot"
          component={App}
          options={{ headerShown: false }}
        />

        {/* New detail screen */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Detalle del producto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
