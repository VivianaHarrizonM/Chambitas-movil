import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

export default function CreateRequestScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals, createServiceRequest } = useServices();
  const { user } = useAuth();
  const professional = professionals.find((p) => p.id === professionalId);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [whenType, setWhenType] = useState('asap');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  if (!professional) return (
    <View style={common.screen}><Text style={common.errorText}>Profesional no encontrado</Text></View>
  );

  const handleConfirm = () => {
    if (!description.trim()) { alert('Por favor describe lo que necesitas'); return; }
    if (!address.trim()) { alert('Ingresa tu dirección'); return; }
    const newService = createServiceRequest({
      professionalId: professional.id,
      description,
      address,
      whenType,
      date,
      time,
      customerEmail: user.email,  // <-- identifica al consumidor
    });
    if (newService) navigation.replace('ServiceProg', { serviceId: newService.id });
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Solicitar servicio con {professional.name}</Text>

      <Text style={common.label}>¿Qué necesitas?</Text>
      <TextInput style={[common.input, common.textArea]} multiline placeholder="Describe el problema..." placeholderTextColor={COLORS.textSecondary} value={description} onChangeText={setDescription} />

      <Text style={common.label}>Dirección</Text>
      <TextInput style={common.input} placeholder="Tu dirección completa" placeholderTextColor={COLORS.textSecondary} value={address} onChangeText={setAddress} />

      <Text style={common.label}>¿Cuándo lo necesitas?</Text>
      <View style={styles.chipsRow}>
        {['asap', 'programado'].map((opt) => (
          <TouchableOpacity key={opt} style={[common.chip, whenType === opt && common.chipSelected]} onPress={() => setWhenType(opt)}>
            <Text style={[common.chipText, whenType === opt && common.chipTextSelected]}>
              {opt === 'asap' ? 'Lo antes posible' : 'Programar'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {whenType === 'programado' && (
        <View style={styles.chipsRow}>
          <TextInput style={[common.input, { flex: 1, marginRight: 8 }]} placeholder="Fecha (dd/mm)" placeholderTextColor={COLORS.textSecondary} value={date} onChangeText={setDate} />
          <TextInput style={[common.input, { flex: 1 }]} placeholder="Hora (hh:mm)" placeholderTextColor={COLORS.textSecondary} value={time} onChangeText={setTime} />
        </View>
      )}

      <View style={{ flex: 1 }} />
      <TouchableOpacity style={common.buttonPrimary} onPress={handleConfirm}>
        <Text style={common.buttonPrimaryText}>Confirmar solicitud</Text>
      </TouchableOpacity>
      <Text style={common.hintText}>El profesional fue notificado y se dirigirá a tu domicilio.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', marginTop: 6 },
});