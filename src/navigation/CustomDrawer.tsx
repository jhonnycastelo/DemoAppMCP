// navigation/CustomDrawer.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/price-shoes-logo-png_seeklogo-169459.png')} // 👈 your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Drawer items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
});
