import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useCart } from '../components/context/CartContext';
import { FeaturedBanner } from '../components/FeaturedBanner';

const { PersonalizationModule } = NativeModules;

const PRODUCTS = [
  {
    id: '1',
    name: 'Tenis Urbanos Price Shoes',
    category: 'Calzado',
    price: '$49.99',
  },
  {
    id: '2',
    name: 'Bolso Fashion Price Shoes',
    category: 'Accesorios',
    price: '$29.99',
  },
  {
    id: '3',
    name: 'Sandalias Comfort Price Shoes',
    category: 'Calzado',
    price: '$39.99',
  },
];

interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price?: number;
  description: string;
}

export default function ProductsScreen() {
  const { addToCart } = useCart();
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedProduct | null>(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    PersonalizationModule.trackPageView('Products');
    PersonalizationModule.registerCampaignHandler();

    const emitter = new NativeEventEmitter(PersonalizationModule);
    const listener = emitter.addListener('FeaturedProductCampaign', data => {
      setFeaturedProduct({
        id: data.productId,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        description: data.description,
      });
    });

    return () => listener.remove();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);

    const numericPrice = Number(product.price.replace(/[^0-9.-]+/g, ''));

    PersonalizationModule.addToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      quantity: 1,
      currency: 'USD',
    });
  };

  return (
    <View style={styles.screen}>
      <FeaturedBanner
        product={featuredProduct}
        visible={!!featuredProduct && showPopup}
        onClose={() => setShowPopup(false)}
      />

      <Text style={styles.title}>Productos destacados</Text>

      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>

            <Button
              title="Agregar al carrito"
              onPress={() => handleAddToCart(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardName: { fontSize: 16, fontWeight: '600' },
  cardCategory: { fontSize: 13, color: '#777' },
  cardPrice: { fontSize: 14, fontWeight: '700' },
});
