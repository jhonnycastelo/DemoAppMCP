import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { use, useEffect } from 'react';
import CartCard from '../components/CartCard';
import { FlatList } from 'react-native-gesture-handler';
import { useCart } from '../components/context/CartContext';
import { NativeModules } from 'react-native';

const { PersonalizationModule } = NativeModules;

const CartScreen = () => {
  const { cart, totalPrice, deleteItemFromCart } = useCart();
  useEffect(() => {
    PersonalizationModule.trackPageView('Cart');
    console.log('[VIEW CART]', cart);
    PersonalizationModule.viewCart(cart);
  }, []);

  const handleCheckout = () => {
    console.log('[CHECKOUT] Initiated with items:', cart);
    PersonalizationModule.purchaseCart(cart);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartCard item={item} onDelete={deleteItemFromCart} />
        )}
      ></FlatList>
      <View style={styles.pricingContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.CheckoutButtonContainer}
        onPress={handleCheckout}
      >
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};
export default CartScreen;

const styles = StyleSheet.create({
  container: {},
  pricingContainer: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  CheckoutButtonContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
