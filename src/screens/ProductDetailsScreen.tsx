import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeModules } from 'react-native';
import { useCart } from '../components/context/CartContext';

const { PersonalizationModule } = NativeModules;

export const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { addToCart } = useCart();
  const { id, name, imageUrl, price, description, category } =
    route.params.product;
  const product = route.params.product;
  const itemPayload = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
  };

  useEffect(() => {
    const payload = {
      id,
      name,
      category,
      price: Number(price),
      imageUrl,
      description,
    };

    console.log('[VIEW ITEM]', payload);

    PersonalizationModule.trackPageView('Product Detail');

    PersonalizationModule.viewItem(payload);
  }, [id]);
  // Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(itemPayload); // <-- add the product to cart
    console.log('[CART] Added:', itemPayload);
    const numericPrice = Number(itemPayload.price.replace(/[^0-9.-]+/g, ''));

    PersonalizationModule.addToCart({
      productId: itemPayload.id,
      name: itemPayload.name,
      category: itemPayload.category,
      price: numericPrice,
      quantity: 1,
      currency: 'USD',
    });
    // Optional: show confirmation toast or navigate
    // navigation.navigate('Cart');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}></View>

      {/* Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>

        {category && <Text style={styles.category}>{category}</Text>}

        {price !== undefined && <Text style={styles.price}>${price}</Text>}
        {description && <Text style={styles.category}>{description}</Text>}
      </View>
      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={handleAddToCart}>
          <Text style={styles.ctaText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  back: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },

  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#f2f2f2',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },

  category: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B365D',
    marginTop: 12,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  cta: {
    backgroundColor: '#007bff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
