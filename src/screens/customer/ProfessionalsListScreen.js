import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
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

const AVATAR_COLORS = [
  '#F4A300', '#2F80ED', '#22c55e',
  '#e11d48', '#7c3aed', '#0891b2',
];

const FILTERS = [
  { id: 'rating',    label: 'Mejor calificados' },
  { id: 'price_asc', label: 'Menor precio' },
  { id: 'price_desc',label: 'Mayor precio' },
];

function getAvatarColor(name) {
  const code = name?.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function StarRating({ value }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(value) ? 'star' : 'star-outline'}
          size={12}
          color={COLORS.primary}
          style={{ marginRight: 1 }}
        />
      ))}
      <Text style={styles.ratingText}>{Number(value).toFixed(1)}</Text>
    </View>
  );
}

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
  const { professionals } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('rating');

  const filtered = useMemo(() => {
    let list = professionals.filter((p) => {
      if (categoryId === 'busqueda') return matchesSearch(p, searchText);
      const mapped = CATEGORY_MAP[categoryId];
      if (mapped) return p.category === mapped;
      return true;
    });

    if (activeFilter === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);
    if (activeFilter === 'price_asc')  list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (activeFilter === 'price_desc') list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);

    return list;
  }, [professionals, categoryId, searchText, activeFilter]);

  const renderItem = ({ item }) => {
    const avatarColor = getAvatarColor(item.name);
    return (
      <View style={styles.card}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.jobTitle ? <Text style={styles.jobTitle}>{item.jobTitle}</Text> : null}
          <Text style={styles.category}>{item.category}</Text>
          <StarRating value={item.rating} />
          <View style={styles.metaRow}>
            {item.distanceKm > 0 && (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={11} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{item.distanceKm} km</Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Ionicons name="cash-outline" size={11} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>Desde ${item.priceFrom} MXN</Text>
            </View>
          </View>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfsDetail', { professionalId: item.id })}
        >
          <Text style={styles.profileButtonText}>Ver{'\n'}perfil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={common.screen}>
      <Text style={[common.heading, { color: COLORS.blue }]}>{categoryName}</Text>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text style={[styles.filterText, activeFilter === f.id && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resultado count */}
      {filtered.length > 0 && (
        <Text style={styles.resultCount}>
          {filtered.length} profesional{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={common.emptyText}>
              No encontramos profesionales en esta categoría.{'\n'}Intenta con otra búsqueda.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Filtros
  filtersRow:       { flexGrow: 0, marginBottom: 10 },
  filterChip:       { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, backgroundColor: COLORS.inputBg },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText:       { fontSize: 13, color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white, fontWeight: '600' },

  // Contador
  resultCount: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },

  // Tarjeta
  card:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 10 },
  avatar:     { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: 20 },
  info:       { flex: 1 },
  name:       { color: COLORS.blue, fontWeight: '600', fontSize: 14, marginBottom: 1 },
  jobTitle:   { color: COLORS.primaryDark, fontSize: 11, fontWeight: '500', marginBottom: 2 },
  category:   { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },

  // Estrellas
  starsRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },

  // Meta chips
  metaRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: COLORS.textSecondary },

  // Botón
  profileButton:     { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', marginLeft: 8 },
  profileButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 12, textAlign: 'center' },

  // Empty
  emptyContainer: { alignItems: 'center', marginTop: 48 },
  emptyIcon:      { fontSize: 40, marginBottom: 12 },
  emptyTitle:     { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 8 },
});