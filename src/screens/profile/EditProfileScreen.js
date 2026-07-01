import React, { useState } from 'react';
import {
  Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const FIELDS = [
  { key: 'name',      label: 'Nombre *',       keyboardType: 'default',   placeholder: 'Tu nombre completo' },
  { key: 'phone',     label: 'Teléfono *',      keyboardType: 'phone-pad', placeholder: 'Ej. 9611234567' },
  { key: 'address',   label: 'Dirección *',     keyboardType: 'default',   placeholder: 'Tu dirección completa' },
  { key: 'city',      label: 'Ciudad',          keyboardType: 'default',   placeholder: 'Ej. Tuxtla Gutiérrez' },
  { key: 'zipCode',   label: 'Código postal',   keyboardType: 'numeric',   placeholder: 'Ej. 29000' },
  { key: 'reference', label: 'Referencias',     keyboardType: 'default',   placeholder: 'Ej. Frente a Comex' },
];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAppContext();

  const [form, setForm] = useState({
    name:      user?.name      || '',
    phone:     user?.phone     || '',
    address:   user?.address   || '',
    city:      user?.city      || '',
    zipCode:   user?.zipCode   || '',
    reference: user?.reference || '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'El nombre es obligatorio';
    if (!form.phone.trim())   e.phone   = 'El teléfono es obligatorio';
    if (!form.address.trim()) e.address = 'La dirección es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key) => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await updateUser(form);
    setLoading(false);
    navigation.goBack();
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
        <Text style={styles.title}>Editar perfil</Text>

        {FIELDS.map((f) => (
          <React.Fragment key={f.key}>
            <Text style={common.label}>{f.label}</Text>
            <TextInput
              style={[common.input, errors[f.key] && styles.inputError]}
              value={form[f.key]}
              onChangeText={(val) => {
                setForm(prev => ({ ...prev, [f.key]: val }));
                clearError(f.key);
              }}
              keyboardType={f.keyboardType}
              placeholder={f.placeholder}
              placeholderTextColor={COLORS.textSecondary}
              editable={!loading}
            />
            {errors[f.key] ? (
              <Text style={styles.errorMsg}>{errors[f.key]}</Text>
            ) : null}
          </React.Fragment>
        ))}

        <TouchableOpacity
          style={[common.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={common.buttonPrimaryText}>Guardar cambios</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title:          { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 8, color: COLORS.textMain },
  inputError:     { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg:       { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  buttonDisabled: { opacity: 0.7 },
});