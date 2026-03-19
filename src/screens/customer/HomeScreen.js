import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS, common } from "../../theme";

const CATEGORIES = [
  { id: "plomeria",     name: "Plomería",     emoji: "🛠" },
  { id: "electricidad", name: "Electricidad", emoji: "💡" },
  { id: "carpinteria",  name: "Carpintería",  emoji: "🪚" },
  { id: "herreria",     name: "Herrería",     emoji: "⚒" },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const handleCategoryPress = (categoryId, name) =>
    navigation.navigate("ProfsList", { categoryId, categoryName: name, searchText: "" });

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;
    // Pasa el texto como parámetro separado para que ProfessionalsListScreen filtre correctamente
    navigation.navigate("ProfsList", {
      categoryId: "busqueda",
      categoryName: 'Resultados para "' + q + '"',
      searchText: q,
    });
  };

  return (
    <View style={common.screen}>
      <Text style={styles.greeting}>Hola, {user.name} 👋</Text>
      <Text style={styles.subtitle}>¿Qué servicio necesitas hoy?</Text>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar plomero, carpintero..."
          placeholderTextColor={COLORS.textSecondary}
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
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item.id, item.name)}>
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 22, fontWeight: "600", color: COLORS.textMain },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 16 },
  searchRow: { flexDirection: "row", marginBottom: 16 },
  searchInput: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.textMain, marginRight: 8 },
  searchButton: { backgroundColor: COLORS.primary, borderRadius: 999, paddingHorizontal: 16, justifyContent: "center" },
  searchButtonText: { color: COLORS.white, fontWeight: "600" },
  sectionTitle: { color: COLORS.primaryDark, fontSize: 16, fontWeight: "600", marginBottom: 8 },
  categoryCard: { backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 18, paddingHorizontal: 12, marginBottom: 12, flex: 1, marginRight: 8, alignItems: "center" },
  categoryEmoji: { fontSize: 24, marginBottom: 6 },
  categoryName: { color: COLORS.textMain, fontWeight: "500" },
});