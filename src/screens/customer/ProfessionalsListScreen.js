import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';


const CATEGORY_MAP = {
  plomeria:     'Plomería',
  carpinteria:  'Carpintería',
  electricidad: 'Electricidad',
  herreria:     'Herrería',
  pintura:      'Pintura',
  limpieza:     'Limpieza',
  jardineria:   'Jardinería',
  otro:         'Otro',
};

function matchesSearch(professional, query) {
  const q = query.toLowerCase();
  return (
    professional.name.toLowerCase().includes(q) ||
    professional.category.toLowerCase().includes(q) ||
    professional.description.toLowerCase().includes(q) ||
    (professional.area && professional.area.toLowerCase().includes(q)) ||
    (professional.jobTitle && professional.jobTitle.toLowerCase().includes(q))
  );
}

export default function ProfessionalsListScreen({ route, navigation }) {
  const { categoryId, categoryName, searchText = '' } = route.params;
  const { professionals } = useServices();

  const filtered = professionals.filter((p) => {
    // Búsqueda por texto libre
    if (categoryId === 'busqueda') {
      return matchesSearch(p, searchText);
    }
    // Filtro por categoría exacta
    const mapped = CATEGORY_MAP[categoryId];
    if (mapped) return p.category === mapped;
    // 'todos' u otro: muestra todos
    return true;
  });

  return (
    <View style={common.screen}>
      <Text style={[common.heading, { color: COLORS.blue }]}>{categoryName}</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={common.emptyText}>No se encontraron profesionales.</Text>}
        renderItem={({ item }) => (
          <View style={[common.card, styles.cardRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {item.jobTitle ? <Text style={styles.jobTitle}>{item.jobTitle}</Text> : null}
              <Text style={common.hintText}>{item.category} • {item.rating.toFixed(1)} ★ • {item.distanceKm} km</Text>
              <Text style={common.hintText}>Desde ${item.priceFrom} MXN</Text>
            </View>
            <TouchableOpacity
              style={[common.buttonPrimary, { marginTop: 0, paddingHorizontal: 16, paddingVertical: 8 }]}
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
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: COLORS.blue, fontWeight: '600', marginBottom: 2 },
  jobTitle: { color: COLORS.primaryDark, fontSize: 12, fontWeight: '500', marginBottom: 2 },
});