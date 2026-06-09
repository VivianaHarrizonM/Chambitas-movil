import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const CATEGORIES = [
  'Plomería', 'Electricidad', 'Carpintería', 'Herrería',
  'Pintura', 'Limpieza', 'Jardinería', 'Otro',
];

export default function CreateJobsScreen({ navigation }) {
  const { createJob } = useAppContext();
  const [title, setTitle]           = useState('');
  const [category, setCategory]     = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice]           = useState('');
  const [area, setArea]             = useState('');
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim())       e.title       = 'El título es obligatorio';
    if (!category)           e.category    = 'Selecciona una categoría';
    if (!description.trim()) e.description = 'La descripción es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key) => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handlePublish = async () => {
    if (!validate()) return;

    setLoading(true);
    const job = await createJob({ title, category, description, price, area });
    setLoading(false);

    if (job) {
      // Limpiar formulario
      setTitle(''); setCategory(''); setDescription('');
      setPrice(''); setArea(''); setErrors({});
      navigation.navigate('MyJobsTab');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={common.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={common.heading}>Publicar chambita</Text>

        {/* Título */}
        <Text style={common.label}>Título del servicio *</Text>
        <TextInput
          style={[common.input, errors.title && styles.inputError]}
          placeholder="Ej. Reparación de fugas de agua"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={(v) => { setTitle(v); clearError('title'); }}
          editable={!loading}
        />
        {errors.title ? <Text style={styles.errorMsg}>{errors.title}</Text> : null}

        {/* Categoría */}
        <Text style={common.label}>Categoría *</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[common.chip, category === cat && common.chipSelected]}
              onPress={() => { setCategory(cat); clearError('category'); }}
              disabled={loading}
            >
              <Text style={[common.chipText, category === cat && common.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category ? <Text style={styles.errorMsg}>{errors.category}</Text> : null}

        {/* Descripción */}
        <Text style={common.label}>Descripción *</Text>
        <TextInput
          style={[common.input, common.textArea, errors.description && styles.inputError]}
          multiline
          placeholder="Describe tu servicio, experiencia y disponibilidad..."
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={(v) => { setDescription(v); clearError('description'); }}
          editable={!loading}
        />
        {errors.description ? <Text style={styles.errorMsg}>{errors.description}</Text> : null}

        {/* Precio */}
        <Text style={common.label}>Precio desde (MXN)</Text>
        <TextInput
          style={common.input}
          placeholder="Ej. 300"
          placeholderTextColor={COLORS.textSecondary}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          editable={!loading}
        />

        {/* Área */}
        <Text style={common.label}>Área de servicio</Text>
        <TextInput
          style={common.input}
          placeholder="Ej. Tuxtla Gutiérrez, Chiapas"
          placeholderTextColor={COLORS.textSecondary}
          value={area}
          onChangeText={setArea}
          editable={!loading}
        />

        {/* Botón */}
        <TouchableOpacity
          style={[common.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={common.buttonPrimaryText}>Publicar chambita</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chipsWrap:      { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  inputError:     { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg:       { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  buttonDisabled: { opacity: 0.7 },
});