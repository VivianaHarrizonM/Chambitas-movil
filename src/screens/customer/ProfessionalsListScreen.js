import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

const CATEGORY_MAP = { plomeria: 'Plomería', carpinteria: 'Carpintería', electricidad: 'Electricidad', herreria: 'Herrería' };

export default function ProfessionalsListScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { professionals } = useServices();
  const filtered = professionals.filter((p) => {
    const mapped = CATEGORY_MAP[categoryId];
    return mapped ? p.category === mapped : true;
  });
  return (
    <View style={common.screen}>
      <Text style={[common.heading, { color: COLORS.blue }]}>{categoryName}</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={common.emptyText}>No hay profesionales para esta categoría.</Text>}
        renderItem={({ item }) => (
          <View style={[common.card, styles.cardRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={common.hintText}>{item.category} • {item.rating.toFixed(1)} ★ • {item.distanceKm} km</Text>
              <Text style={common.hintText}>Desde ${item.priceFrom} MXN</Text>
            </View>
            <TouchableOpacity
              style={common.buttonPrimary}
              onPress={() => navigation.navigate('ProfsDetail', { professionalId: item.id })}
            >
              <Text style={[common.buttonPrimaryText, { fontSize: 12 }]}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: { 
    flexDirection: 'row', 
    alignItems: 'center' },
  name: { 
    color: COLORS.blue, 
    fontWeight: '600', 
    marginBottom: 4 },
});