import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { navigate } from '../navigation/NavigationService';

const { PersonalizationModule } = NativeModules;

interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price?: number;
  description: string;
  campaignId?: string; // 👈 Optional campaignId for tracking
}

interface FeaturedBannerProps {
  product: FeaturedProduct | null;
  visible: boolean;
  onClose: () => void;
}

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

const navigation = useNavigation<NavProp>();
export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  product,
  visible,
  onClose,
}) => {
  // 🔐 Guard FIRST
  if (!visible || !product) {
    return null;
  }
  const { id, name, imageUrl, price, description } = product;

  const handlePress = () => {
    PersonalizationModule.trackClickthrough(product.campaignId);
    console.log('User clicked:', name);
    onClose();
    navigation.navigate('ProductDetail', {
      product,
    });
  };

  const handleDismiss = () => {
    PersonalizationModule.trackDismissal('Featured Product');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        {/* Prevent overlay press from closing when tapping card */}
        <Pressable style={styles.popup} onPress={() => {}}>
          {/* Close icon */}
          <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Image source={{ uri: imageUrl }} style={styles.image} />

          <Text style={styles.title}>{name}</Text>
          {price !== undefined && <Text style={styles.price}>${price}</Text>}
          <Text style={styles.description}>{description}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handlePress}>
            <Text style={styles.primaryButtonText}>View Product</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  popup: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: '#555',
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
    fontWeight: 'bold',
  },
});
