import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (section: string, category: string) => void;
}

const MenuDrawer: React.FC<Props> = ({
  visible,
  onClose,
  onSelectCategory,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        <Text style={styles.sectionTitle}>Dama</Text>

        <TouchableOpacity onPress={() => onSelectCategory('Dama', 'Bota')}>
          <Text style={styles.item}>Bota</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelectCategory('Dama', 'Sandalia')}>
          <Text style={styles.item}>Sandalia</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Caballero</Text>

        <TouchableOpacity onPress={() => onSelectCategory('Caballero', 'Bota')}>
          <Text style={styles.item}>Bota</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectCategory('Caballero', 'Correr')}
        >
          <Text style={styles.item}>Correr</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawer: {
    width: '70%',
    backgroundColor: '#fff',
    height: '100%',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '700',
  },
  item: {
    fontSize: 16,
    paddingVertical: 8,
  },
  closeButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#1B365D',
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default MenuDrawer;
