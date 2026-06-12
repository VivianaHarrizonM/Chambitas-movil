import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

export default function CreateRequestScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals, createServiceRequest, user } = useAppContext();
  const professional = professionals.find((p) => p.id === professionalId);

  const [description, setDescription] = useState('');
  const [address, setAddress]         = useState(user?.address || '');
  const [whenType, setWhenType]       = useState('asap');
  const [date, setDate]               = useState('');
  const [time, setTime]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});

  if (!professional) return (
    <View style={common.screen}>
      <Text style={common.errorText}>Profesional no encontrado</Text>
    </View>
  );

  const clearError = (key) => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!description.trim()) e.description = 'Describe lo que necesitas';
    if (!address.trim())     e.address     = 'Ingresa tu dirección';
    if (whenType === 'programado') {
      if (!date.trim()) e.date = 'Ingresa la fecha';
      if (!time.trim()) e.time = 'Ingresa la hora';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    setLoading(true);
    const newService = await createServiceRequest({
      professionalId: professional.id,
      description,
      address,
      whenType,
      date,
      time,
    });
    setLoading(false);

    if (newService) navigation.replace('ServiceProg', { serviceId: newService.id });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={common.screen}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Card del profesional ── */}
        <View style={styles.proCard}>
          <View style={styles.proAvatar}>
            <Text style={styles.proAvatarText}>
              {professional.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.proName}>{professional.name}</Text>
            <Text style={styles.proMeta}>
              {professional.category} · {Number(professional.rating).toFixed(1)} ★
            </Text>
            {professional.priceFrom > 0 && (
              <Text style={styles.proPrice}>Desde ${professional.priceFrom} MXN</Text>
            )}
          </View>
        </View>

        {/* ── Descripción ── */}
        <Text style={common.label}>¿Qué necesitas? *</Text>
        <TextInput
          style={[common.input, common.textArea, errors.description && styles.inputError]}
          multiline
          placeholder="Describe el problema o servicio que necesitas..."
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={(v) => { setDescription(v); clearError('description'); }}
          editable={!loading}
        />
        {errors.description ? <Text style={styles.errorMsg}>{errors.description}</Text> : null}

        {/* ── Dirección ── */}
        <Text style={common.label}>Dirección *</Text>
        <TextInput
          style={[common.input, errors.address && styles.inputError]}
          placeholder="Tu dirección completa"
          placeholderTextColor={COLORS.textSecondary}
          value={address}
          onChangeText={(v) => { setAddress(v); clearError('address'); }}
          editable={!loading}
        />
        {errors.address ? <Text style={styles.errorMsg}>{errors.address}</Text> : null}
        {user?.address && address === user.address && (
          <View style={styles.autofilledRow}>
            <Ionicons name="checkmark-circle" size={13} color="#22c55e" />
            <Text style={styles.autofilledText}>Dirección cargada de tu perfil</Text>
          </View>
        )}

        {/* ── Cuándo ── */}
        <Text style={common.label}>¿Cuándo lo necesitas?</Text>
        <View style={styles.chipsRow}>
          {['asap', 'programado'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[common.chip, whenType === opt && common.chipSelected]}
              onPress={() => { setWhenType(opt); setErrors({}); }}
              disabled={loading}
            >
              <Text style={[common.chipText, whenType === opt && common.chipTextSelected]}>
                {opt === 'asap' ? '⚡ Lo antes posible' : '📅 Programar'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Fecha y hora (si es programado) ── */}
        {whenType === 'programado' && (
          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                style={[common.input, errors.date && styles.inputError]}
                placeholder="Fecha (dd/mm/aaaa)"
                placeholderTextColor={COLORS.textSecondary}
                value={date}
                onChangeText={(v) => { setDate(v); clearError('date'); }}
                editable={!loading}
              />
              {errors.date ? <Text style={styles.errorMsg}>{errors.date}</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[common.input, errors.time && styles.inputError]}
                placeholder="Hora (hh:mm)"
                placeholderTextColor={COLORS.textSecondary}
                value={time}
                onChangeText={(v) => { setTime(v); clearError('time'); }}
                editable={!loading}
              />
              {errors.time ? <Text style={styles.errorMsg}>{errors.time}</Text> : null}
            </View>
          </View>
        )}

        {/* ── Botón ── */}
        <TouchableOpacity
          style={[common.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={common.buttonPrimaryText}>Confirmar solicitud</Text>
          }
        </TouchableOpacity>

        {/* ── Hint ── */}
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
          <Text style={[common.hintText, { marginTop: 0, marginLeft: 4, flex: 1 }]}>
            El profesional será notificado y se dirigirá a tu domicilio.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Card profesional
  proCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 16 },
  proAvatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  proAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 20 },
  proName:       { color: COLORS.textMain, fontWeight: '600', fontSize: 15 },
  proMeta:       { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  proPrice:      { color: COLORS.primaryDark, fontWeight: '600', fontSize: 12, marginTop: 2 },

  // Chips
  chipsRow: { flexDirection: 'row', marginTop: 6, gap: 8 },
  dateRow:  { flexDirection: 'row', marginTop: 8 },

  // Validación
  inputError:     { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg:       { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  buttonDisabled: { opacity: 0.7 },

  // Autocompletado
  autofilledRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 2 },
  autofilledText: { fontSize: 11, color: '#22c55e', marginLeft: 4 },

  // Hint
  hintRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
});