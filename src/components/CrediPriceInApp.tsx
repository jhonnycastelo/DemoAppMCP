import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { navigate } from '../navigation/NavigationService';

const { PersonalizationModule } = NativeModules;

interface CrediPriceInAppInformation {
  ctaURL: string;
  imageURL: string;
  campaignId?: string; // 👈 Optional campaignId for tracking
}

interface CrediPriceInAppProps {
  InApp: CrediPriceInAppInformation | null;
  visible: boolean;
  onClose: () => void;
}

export const CrediPriceInApp: React.FC<CrediPriceInAppProps> = ({
  InApp,
  visible,
  onClose,
}) => {
  // 🔐 Guard FIRST
  if (!visible || !InApp) {
    return null;
  }
  const { campaignId, ctaURL, imageURL } = InApp;

  const handlePress = () => {
    PersonalizationModule.trackClickthrough(campaignId);
    console.log('User clicked InApp with URL:', ctaURL);
    console.log('User clicked InApp with imageURL:', imageURL);
    Linking.openURL(ctaURL).catch(err =>
      console.error('Failed to open URL:', err),
    );
    onClose();
  };

  const handleDismiss = () => {
    PersonalizationModule.trackDismissal(campaignId);
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
          <TouchableOpacity onPress={handlePress}>
            <Image source={{ uri: imageURL }} style={styles.image} />
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
    maxWidth: 'auto',
    height: 'auto',
    borderRadius: 16,
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  closeText: {
    fontSize: 26,
    color: '#ffffff',
    position: 'absolute',
    top: 15,
    right: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 9 / 16, // adjust to your campaign image ratio
    resizeMode: 'contain',
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
