// navigation/CustomDrawer.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerItem } from '@react-navigation/drawer';

export default function CustomDrawer(props: any) {
  const { navigation } = props;

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
      <DrawerItem
        label="Home"
        onPress={() => {
          navigation.navigate('Home', {
            screen: 'Home',
            params: { screen: 'Home' },
          });
          navigation.closeDrawer();
        }}
      />

      <DrawerItem
        label="Products"
        onPress={() => {
          navigation.navigate('Home', {
            screen: 'Home',
            params: { screen: 'Products' },
          });
          navigation.closeDrawer();
        }}
      />
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
