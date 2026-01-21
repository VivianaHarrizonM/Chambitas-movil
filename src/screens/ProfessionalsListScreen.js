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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
  },
  heading: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    color: '#9ca3af',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginLeft: 8,
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 12,
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 24,
  },
});
