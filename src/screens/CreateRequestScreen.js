
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function CreateRequestScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals, createServiceRequest } = useAppContext();

  const professional = professionals.find((p) => p.id === professionalId);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Casa - Calle 123, Roma Norte');
  const [whenType, setWhenType] = useState('asap'); 
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
        El profesional fue notificado y se dirigirá a tu domicilio.
      </Text>
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
  error: '#FF6B6B',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  heading: {
    color: COLORS.textMain,       
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary, 
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,   
    color: COLORS.textMain,       
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
    borderColor: COLORS.border,   
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,    
  },
  chipText: {
    color: COLORS.textSecondary, 
  },
  chipTextSelected: {
    color: COLORS.white,          
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary, 
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPrimaryText: {
    color: COLORS.white,          
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,  
  },
  error: {
    color: COLORS.error,          
  },
});
