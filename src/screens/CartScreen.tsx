import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import CartCard from '../components/CartCard';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Cart Screen</Text>
      <CartCard></CartCard>
      <View style={styles.pricingContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalPrice}>$250.00</Text>
      </View>
      <TouchableOpacity style={styles.CheckoutButtonContainer}>
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
