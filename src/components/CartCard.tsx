import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const CartCard = () => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: 'https://res.cloudinary.com/priceshoes/f_auto,q_auto:best,w_750//product/1/2/1284637-1.jpg',
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>Cart Item</Text>
        <Text style={styles.description}>
          This is a description of the cart item.
        </Text>
        <Text style={styles.price}>$49.99</Text>
      </View>
      <MaterialDesignIcons
        name="delete"
        size={24}
        color="red"
        style={styles.deleteIcon}
      />
    </View>
  );
};
export default CartCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'column',
  },
  deleteIcon: {},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
});
