import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useCart } from '../components/context/CartContext';
import { FeaturedBanner } from '../components/FeaturedBanner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const { PersonalizationModule } = NativeModules;

const PRODUCTS = [
  {
    id: '994709',
    name: 'Tenis Skate Crisis MX',
    category: 'CABALLERO',
    price: 1199.0,
    imageUrl:
      'https://res.cloudinary.com/priceshoes/f_auto,q_auto:best,w_750//product/9/9/994709-1.jpg',
  },
  {
    id: '2833467',
    name: 'Accesorio Bolsa Holly Land GH44',
    category: 'DAMA',
    price: 374.0,
    imageUrl:
      'https://res.cloudinary.com/priceshoes/f_auto,q_auto:best,w_750//product/8/3/833467-1.jpg',
  },
  {
    id: '991658',
    name: 'Sandalia Casual Destalonada',
    category: 'Calzado',
    price: 39.99,
    imageUrl:
      'https://res.cloudinary.com/priceshoes/f_auto,q_auto:best,w_750//product/9/9/991658-5.jpg',
  },
];

interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price?: Double;
  description: string;
}

export default function ProductsScreen() {
  const { addToCart } = useCart();
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedProduct | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

  const navigation = useNavigation<NavProp>();

  useFocusEffect(
    React.useCallback(() => {
      setShowPopup(true);
      PersonalizationModule.trackPageView('Products');
      PersonalizationModule.registerCampaignHandler('Featured Product');
      const emitter = new NativeEventEmitter(PersonalizationModule);
      const listener = emitter.addListener('MCP_Campaign', event => {
        console.log('[EVENT] Featured Product received:', event);
        if (event.campaignName === 'Featured Product') {
          setFeaturedProduct({
            id: event.payload.productId,
            name: event.payload.name,
            price: event.payload.price,
            imageUrl: event.payload.imageUrl,
            description: event.payload.description,
          });
        } else {
          return;
        }
      });

      return () => listener.remove();
    }, []),
  );
  const handleAddToCart = (product: any) => {
    addToCart(product);

    const payload = {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: 1,
      currency: 'USD',
    };

    PersonalizationModule.addToCart(payload);
    console.log('[DEBUG] Sent AddToCart to SDK:', payload);
  };

  const onPress = (product: any) => {
    console.log('Product pressed');
    navigation.navigate('ProductDetail', { product });
  };
  return (
    <View style={styles.screen}>
      <FeaturedBanner
        product={featuredProduct}
        visible={!!featuredProduct && showPopup}
        onClose={() => setShowPopup(false)}
      />

      <Text style={styles.title}>Productos</Text>

      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>

            <Button
              title="Agregar al carrito"
              onPress={() => handleAddToCart(item)}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardName: { fontSize: 16, fontWeight: '600' },
  cardCategory: { fontSize: 13, color: '#777' },
  cardPrice: { fontSize: 14, fontWeight: '700' },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
