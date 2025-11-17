import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';

import { NativeModules } from 'react-native';
import { useEffect } from 'react';

const { PersonalizationModule } = NativeModules;

const PRODUCTS = [
  { id: '1', name: 'Tenis Urbanos Price Shoes', category: 'Calzado', price: '$49.99' },
  { id: '2', name: 'Bolso Fashion Price Shoes', category: 'Accesorios', price: '$29.99' },
  { id: '3', name: 'Sandalias Comfort Price Shoes', category: 'Calzado', price: '$39.99' },
];

const HomeScreen = () => {
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

const ProductsScreen = () => {
  useEffect(() => {
    PersonalizationModule.trackPageView('Products');
  }, []);
  return(
  <View style={styles.screen}>
    <Text style={styles.title}>Productos destacados</Text>
    <FlatList
      data={PRODUCTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      )}
    />
  </View>
);
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'products'>('home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Price Shoes App</Text>
      </View>

      {/* Pantalla actual */}
      {currentPage === 'home' ? <HomeScreen /> : <ProductsScreen />}

      {/* Tabs inferiores */}
      <View style={styles.tabBar}>
        <Pressable
          style={[
            styles.tabButton,
            currentPage === 'home' && styles.tabButtonActive,
          ]}
          onPress={() => setCurrentPage('home')}
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
          onPress={() => setCurrentPage('products')}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  header: {
    padding: 16,
    backgroundColor: '#1B365D', // color azul estilo Price Shoes
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

export default App;
