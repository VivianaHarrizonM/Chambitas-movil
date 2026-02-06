import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ProfessionalsListScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { professionals } = useAppContext();

  const filtered = professionals.filter((p) => {
    if (categoryId === 'plomeria') return p.category === 'Plomería';
    if (categoryId === 'carpinteria') return p.category === 'Carpintería';
    if (categoryId === 'electricidad') return p.category === 'Electricidad';
    if (categoryId === 'herreria') return p.category === 'Herrería';
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{categoryName}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.category} • {item.rating.toFixed(1)} ★ • {item.distanceKm} km
              </Text>
              <Text style={styles.meta}>Desde ${item.priceFrom} MXN</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ProfessionalDetail', { professionalId: item.id })
              }
            >
              <Text style={styles.buttonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay profesionales para esta categoría.</Text>
        }
      />
    </View>
  );
}

const COLORS = {
  primary: '#F4A300',      
  primaryDark: '#D88900',
  blue: '#022e86',        
  background: '#F5F5F5',
  inputBg: '#fabb8031',
  textMain: '#4F4F4F',
  textSecondary: '#8A8A8A',
  border: '#f1710731',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  heading: {
    color: COLORS.blue,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: COLORS.blue,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    color: COLORS.textSecondary,   
    fontSize: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginLeft: 8,
  },
  buttonText: {
    color: COLORS.white,       
    fontWeight: '600',
    fontSize: 12,
  },
  empty: {
    color: COLORS.textSecondary, 
    textAlign: 'center',
    marginTop: 24,
  },
});
