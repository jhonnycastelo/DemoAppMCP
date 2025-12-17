// AppWrapper.tsx
import { CartProvider } from './src/components/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function AppWrapper() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
