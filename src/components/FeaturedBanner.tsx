import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
const { PersonalizationModule } = NativeModules;

interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price?: number;
  description: string;
}

interface FeaturedBannerProps {
  product: FeaturedProduct;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ product }) => {
  const { id, name, imageUrl, price, description } = product;

  const handlePress = () => {
    // Track clickthrough via native module
    PersonalizationModule.trackFeaturedProductClick(id);

    // Navigate to product detail
    // (replace with your navigation)
    console.log('User clicked:', id);
  };

  const handleDismiss = () => {
    PersonalizationModule.trackFeaturedProductDismiss(id);
  };

  return (
    <View style={styles.banner}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.price}>${price}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.button}>View Product</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDismiss}>
          <Text style={styles.dismiss}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  dismiss: {
    color: '#888',
  },
});
