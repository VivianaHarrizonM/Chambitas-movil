import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, FlatList, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const CATEGORIES = [
  { id: 'plomeria',     name: 'Plomería',     emoji: '🛠' },
  { id: 'electricidad', name: 'Electricidad', emoji: '💡' },
  { id: 'carpinteria',  name: 'Carpintería',  emoji: '🪚' },
  { id: 'herreria',     name: 'Herrería',     emoji: '⚒' },
  { id: 'pintura',      name: 'Pintura',      emoji: '🎨' },
  { id: 'limpieza',     name: 'Limpieza',     emoji: '🧹' },
  { id: 'jardineria',   name: 'Jardinería',   emoji: '🌿' },
  { id: 'otro',         name: 'Otro',         emoji: '🔩' },
];

const INITIAL_COUNT = 4;

export default function HomeScreen({ navigation }) {
  const { user, services, professionals } = useAppContext();
  const [search, setSearch]           = useState('');
  const [expanded, setExpanded]       = useState(false);

  // Servicio activo más reciente
  const activeService = services.find(s => s.status !== 'finalizado');

  // Profesionales destacados (top 3 por rating)
  const featured = [...professionals]
    .filter(p => p.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const visibleCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, INITIAL_COUNT);

  const handleCategoryPress = (categoryId, name) =>
    navigation.navigate('ProfsList', { categoryId, categoryName: name, searchText: '' });

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigation.navigate('ProfsList', {
      categoryId:   'busqueda',
      categoryName: `Resultados para "${q}"`,
      searchText:   q,
    });
  };

  return (
    <ScrollView
      style={common.screen}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Saludo ── */}
      <Text style={styles.greeting}>Hola, {user?.name} 👋</Text>
      <Text style={styles.subtitle}>¿Qué servicio necesitas hoy?</Text>

      {/* ── Banner servicio activo ── */}
      {activeService && (
        <TouchableOpacity
          style={styles.activeBanner}
          onPress={() => navigation.navigate('MyServicesTab')}
          activeOpacity={0.85}
        >
          <View style={styles.activeBannerLeft}>
            <Ionicons name="construct" size={20} color={COLORS.white} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.activeBannerTitle}>Servicio en curso</Text>
              <Text style={styles.activeBannerSub} numberOfLines={1}>
                {activeService.professionalName || 'Profesional'} · {activeService.status === 'en_camino' ? 'En camino' : 'En servicio'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* ── Buscador ── */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar plomero, carpintero..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* ── Categorías ── */}
      <Text style={styles.sectionTitle}>Categorías populares</Text>
      <View style={styles.categoriesGrid}>
        {visibleCategories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.id, item.name)}
            activeOpacity={0.75}
          >
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Ver más / Ver menos ── */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded(prev => !prev)}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? 'Ver menos' : `Ver más categorías`}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={COLORS.primary}
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      {/* ── Profesionales destacados ── */}
      {featured.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Mejor calificados ⭐
          </Text>
          {featured.map((pro) => (
            <TouchableOpacity
              key={pro.id}
              style={styles.proCard}
              onPress={() => navigation.navigate('ProfsList', {
                categoryId:   pro.category.toLowerCase(),
                categoryName: pro.category,
                searchText:   '',
              })}
              activeOpacity={0.8}
            >
              <View style={styles.proAvatar}>
                <Text style={styles.proAvatarText}>
                  {pro.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.proName}>{pro.name}</Text>
                <Text style={styles.proMeta}>
                  {pro.category} · {Number(pro.rating).toFixed(1)} ★
                </Text>
              </View>
              <Text style={styles.proPrice}>Desde ${pro.priceFrom}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greeting:     { fontSize: 22, fontWeight: '600', color: COLORS.textMain },
  subtitle:     { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 16 },
  sectionTitle: { color: COLORS.primaryDark, fontSize: 16, fontWeight: '600', marginBottom: 10 },

  // Banner
  activeBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activeBannerLeft:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
  activeBannerTitle: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  activeBannerSub:   { color: COLORS.white, fontSize: 12, opacity: 0.9, marginTop: 2 },

  // Buscador
  searchRow:        { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  searchInput:      { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.textMain, marginRight: 8 },
  searchButton:     { backgroundColor: COLORS.primary, borderRadius: 999, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  // Categorías
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard:   { backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 18, paddingHorizontal: 12, marginBottom: 12, width: '48%', alignItems: 'center' },
  categoryEmoji:  { fontSize: 26, marginBottom: 6 },
  categoryName:   { color: COLORS.textMain, fontWeight: '500', fontSize: 13 },

  // Ver más
  expandButton:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, marginTop: -4 },
  expandButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  // Profesionales destacados
  proCard:       { backgroundColor: COLORS.inputBg, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  proAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  proAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 18 },
  proName:       { color: COLORS.textMain, fontWeight: '600', fontSize: 14 },
  proMeta:       { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  proPrice:      { color: COLORS.primaryDark, fontWeight: '700', fontSize: 13 },
});