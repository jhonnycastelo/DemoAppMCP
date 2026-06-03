import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface CartItem {
  id: string;
  imageUrl?: string;
  quantity: number;
  name: string;
  category?: string;
  price: number;
}

interface CartCardProps {
  item: CartItem;
  onDelete: (productId: string) => void;
}

const CartCard = ({ item, onDelete }: CartCardProps) => {
  console.log('CartCard item:', item);
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        {/* Quantity badge */}
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{item.quantity}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.category}</Text>
        <Text style={styles.price}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <MaterialDesignIcons
        name="delete"
        size={24}
        color="red"
        style={styles.deleteIcon}
        onPress={() => onDelete(item.id)}
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
  imageWrapper: {
    position: 'relative',
  },

  quantityBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'black',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
