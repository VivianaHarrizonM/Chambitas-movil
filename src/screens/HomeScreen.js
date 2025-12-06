import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = [
  { id: 'plomeria', name: 'Plomería', emoji: '🛠' },
  { id: 'electricidad', name: 'Electricidad', emoji: '💡' },
  { id: 'carpinteria', name: 'Carpintería', emoji: '🪚' },
  { id: 'herreria', name: 'Herrería', emoji: '⚒' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAppContext();
  const [search, setSearch] = useState('');

  const handleCategoryPress = (categoryId, name) => {
    navigation.navigate('ProfessionalsList', { categoryId, categoryName: name });
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    // Para la demo, mandamos siempre a Plomería
    navigation.navigate('ProfessionalsList', {
      categoryId: 'plomeria',
      categoryName: `Resultados para "${search}"`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {user.name} 👋</Text>
      <Text style={styles.subtitle}>¿Qué servicio necesitas hoy?</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar plomero, carpintero..."
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Categorías populares</Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.id, item.name)}
          >
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f9fafb',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#022c22',
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: '#020617',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    color: '#e5e7eb',
    fontWeight: '500',
  },
});
