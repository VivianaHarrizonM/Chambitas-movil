import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function CreateRequestScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals, createServiceRequest } = useAppContext();

  const professional = professionals.find((p) => p.id === professionalId);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Casa - Calle 123, Roma Norte');
  const [whenType, setWhenType] = useState('asap'); // 'asap' | 'programado'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleConfirm = () => {
    const newService = createServiceRequest({
      professionalId: professional.id,
      description,
      address,
      whenType,
      date,
      time,
    });

    navigation.replace('ServiceInProgress', { serviceId: newService.id });
  };

  if (!professional) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Profesional no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Solicitar servicio con {professional.name}
      </Text>

      <Text style={styles.label}>¿Qué necesitas?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        textAlignVertical="top"
        placeholder="Describe el problema (ej. fuga en lavabo del baño)..."
        placeholderTextColor="#6b7280"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>¿Cuándo lo necesitas?</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.chip,
            whenType === 'asap' && styles.chipSelected,
          ]}
          onPress={() => setWhenType('asap')}
        >
          <Text
            style={[
              styles.chipText,
              whenType === 'asap' && styles.chipTextSelected,
            ]}
          >
            Lo antes posible
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            whenType === 'programado' && styles.chipSelected,
          ]}
          onPress={() => setWhenType('programado')}
        >
          <Text
            style={[
              styles.chipText,
              whenType === 'programado' && styles.chipTextSelected,
            ]}
          >
            Programar
          </Text>
        </TouchableOpacity>
      </View>

      {whenType === 'programado' && (
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Fecha (dd/mm)"
            placeholderTextColor="#6b7280"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Hora (hh:mm)"
            placeholderTextColor="#6b7280"
            value={time}
            onChangeText={setTime}
          />
        </View>
      )}

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleConfirm}>
        <Text style={styles.buttonPrimaryText}>Confirmar solicitud</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>
        Para la demo, el servicio pasa directo a “En camino”.
      </Text>
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    color: '#e5e7eb',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#020617',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#f9fafb',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textArea: {
    height: 90,
  },
  row: {
    flexDirection: 'row',
    marginTop: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  chipText: {
    color: '#e5e7eb',
  },
  chipTextSelected: {
    color: '#022c22',
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPrimaryText: {
    color: '#022c22',
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
  error: {
    color: '#fecaca',
  },
});
