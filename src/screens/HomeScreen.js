import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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
          placeholderTextColor="#4F4F4F"
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
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        scrollEnabled={false} 
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.id, item.name)}
          >
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.publishButton}
            onPress={() => navigation.navigate('CreateJob')}
          >
            <Text style={styles.publishButtonText}>+ Publicar chambita</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const COLORS = {
  primary: '#F4A300',
  primaryDark: '#D88900',
  blue: '#2F80ED',
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textMain,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    color: COLORS.textMain,
    fontWeight: '500',
  },
  
  publishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  publishButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});