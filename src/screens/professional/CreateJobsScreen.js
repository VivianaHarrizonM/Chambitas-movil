import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useJobs } from '../../context/JobsContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

const CATEGORIES = ['Plomería', 'Electricidad', 'Carpintería', 'Herrería', 'Pintura', 'Limpieza', 'Jardinería', 'Otro'];

export default function CreateJobsScreen({ navigation }) {
  const { createJob } = useJobs();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');

  const handlePublish = async () => {
    if (!title.trim() || !category || !description.trim()) {
      alert('Título, categoría y descripción son obligatorios');
      return;
    }
    const job = await createJob({
      title,
      category,
      description,
      price,
      area,
      authorName: user.name,
      authorEmail: user.email, // identifica al dueño del job
    });
    if (job) {
      alert('¡Chambita publicada con éxito!');
      setTitle(''); setCategory(''); setDescription(''); setPrice(''); setArea('');
      navigation.navigate('MyJobsTab');
    }
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={common.heading}>Publicar chambita</Text>

      <Text style={common.label}>Título del servicio *</Text>
      <TextInput style={common.input} placeholder="Ej. Reparación de fugas de agua" placeholderTextColor={COLORS.textSecondary} value={title} onChangeText={setTitle} />

      <Text style={common.label}>Categoría *</Text>
      <View style={styles.chipsWrap}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat} style={[common.chip, category === cat && common.chipSelected]} onPress={() => setCategory(cat)}>
            <Text style={[common.chipText, category === cat && common.chipTextSelected]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={common.label}>Descripción *</Text>
      <TextInput style={[common.input, common.textArea]} multiline placeholder="Describe tu servicio, experiencia y disponibilidad..." placeholderTextColor={COLORS.textSecondary} value={description} onChangeText={setDescription} />

      <Text style={common.label}>Precio desde (MXN)</Text>
      <TextInput style={common.input} placeholder="Ej. 300" placeholderTextColor={COLORS.textSecondary} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={common.label}>Área de servicio</Text>
      <TextInput style={common.input} placeholder="Ej. Roma Norte, CDMX" placeholderTextColor={COLORS.textSecondary} value={area} onChangeText={setArea} />

      <TouchableOpacity style={common.buttonPrimary} onPress={handlePublish}>
        <Text style={common.buttonPrimaryText}>Publicar chambita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
});