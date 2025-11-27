import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';
import { NativeModules } from 'react-native';

import HamburgerButton from './src/components/HamburgerButton';
import MenuDrawer from './src/components/MenuDrawer';
import { CartProvider, useCart } from './src/components/context/CartContext';

const { PersonalizationModule } = NativeModules;

type Page = 'home' | 'products';

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

// ----------- Pantalla Home -----------
const HomeScreen: React.FC = () => {
  useEffect(() => {
    PersonalizationModule.trackPageView('Home');
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Price Shoes Demo</Text>
      <Text style={styles.subtitle}>Bienvenid@ ✨</Text>
      <Text style={styles.text}>
        Esta es una app de prueba construida en React Native para integrar con
        Salesforce Marketing Cloud Personalization.
      </Text>
    </View>
  );
};

// ----------- Pantalla Productos -----------
interface ProductsScreenProps {
  trackViewOnMount: boolean;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({
  trackViewOnMount,
}) => {
  const { addToCart } = useCart();
  useEffect(() => {
    // 👇 Sólo mandamos view:Products si está habilitado
    if (trackViewOnMount) {
      PersonalizationModule.trackPageView('Products');
    }
  }, [trackViewOnMount]);
  const handleAddToCart = (product: any) => {
    addToCart(product);
    const numericPrice = Number(product.price.replace(/[^0-9.-]+/g, ''));

    const payload = {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      quantity: 1,
      currency: 'USD',
    };
    PersonalizationModule.addToCart(payload);
    console.log('[DEBUG] Sent AddToCart to SDK:', payload);
  };
  return (
    <View style={styles.screen}>
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
};

// ----------- App raíz -----------
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [trackProductsOnOpen, setTrackProductsOnOpen] = useState(true);

  // Cuando seleccionas categoría desde el menú
  const handleSelectCategory = (section: string, category: string) => {
    setMenuVisible(false);

    // 🔹 Sólo View Category (en el módulo nativo NO hay trackAction)
    PersonalizationModule.trackCategoryView(section, category);

    // Abrimos productos sin disparar view:Products
    setTrackProductsOnOpen(false);
    setCurrentPage('products');
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  const goToProductsFromTab = () => {
    // Aquí sí queremos view:Products
    setTrackProductsOnOpen(true);
    setCurrentPage('products');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Price Shoes App</Text>
        <HamburgerButton onPress={() => setMenuVisible(true)} />
      </View>

      {/* Contenido */}
      {currentPage === 'home' ? (
        <HomeScreen />
      ) : (
        <ProductsScreen trackViewOnMount={trackProductsOnOpen} />
      )}

      {/* Tabs inferiores */}
      <View style={styles.tabBar}>
        <Pressable
          style={[
            styles.tabButton,
            currentPage === 'home' && styles.tabButtonActive,
          ]}
          onPress={goToHome}
        >
          <Text
            style={[
              styles.tabText,
              currentPage === 'home' && styles.tabTextActive,
            ]}
          >
            Inicio
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            currentPage === 'products' && styles.tabButtonActive,
          ]}
          onPress={goToProductsFromTab}
        >
          <Text
            style={[
              styles.tabText,
              currentPage === 'products' && styles.tabTextActive,
            ]}
          >
            Productos
          </Text>
        </Pressable>
      </View>

      {/* Menú lateral */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectCategory={handleSelectCategory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1B365D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222222',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardCategory: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    color: '#1B365D',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderTopWidth: 3,
    borderTopColor: '#1B365D',
    backgroundColor: '#eef2ff',
  },
  tabText: {
    fontSize: 14,
    color: '#555555',
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#1B365D',
  },
});

const AppWrapper = () => {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
};

export default AppWrapper;
