import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: any) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    loadCart();
  }, []);
  const addToCart = async (product: any) => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      totalSum(updatedCart);
      return;
      /*return prev.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
      );*/
    }
    //return [...prev, { ...product, quantity: 1 }];
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    return;
  };

  const totalSum = (cart: CartItem[]) => {
    const totalSum = cart.reduce(
      (amount, item) => amount + item.price * item.quantity,
      0,
    );
    console.log('Total price updated:', totalSum);
    setTotalPrice(totalSum);
  };
  const loadCart = async () => {
    const storedCart = await AsyncStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      totalSum(storedCart ? JSON.parse(storedCart) : []);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
