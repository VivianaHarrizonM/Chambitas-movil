import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { common } from '../../theme';

const FIELDS = [
  { key: 'name', label: 'Nombre *', keyboardType: 'default', placeholder: '' },
  { key: 'phone', label: 'Teléfono *', keyboardType: 'phone-pad', placeholder: '' },
  { key: 'address', label: 'Dirección *', keyboardType: 'default', placeholder: '' },
  { key: 'city', label: 'Ciudad', keyboardType: 'default', placeholder: '' },
  { key: 'zipCode', label: 'Código postal', keyboardType: 'numeric', placeholder: '' },
  { key: 'reference', label: 'Referencias', keyboardType: 'default', placeholder: 'Ej. Casa blanca con portón negro' },
];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '', phone: user.phone || '', address: user.address || '',
    city: user.city || '', zipCode: user.zipCode || '', reference: user.reference || '',
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      alert('Nombre, teléfono y dirección son obligatorios');
      return;
    }
    updateUser(form);
    navigation.goBack();
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Editar perfil</Text>
      {FIELDS.map((f) => (
        <React.Fragment key={f.key}>
          <Text style={common.label}>{f.label}</Text>
          <TextInput
            style={common.input}
            value={form[f.key]}
            onChangeText={(val) => setForm((prev) => ({ ...prev, [f.key]: val }))}
            keyboardType={f.keyboardType}
            placeholder={f.placeholder}
            placeholderTextColor="#8A8A8A"
          />
        </React.Fragment>
      ))}
      <TouchableOpacity style={common.buttonPrimary} onPress={handleSave}>
        <Text style={common.buttonPrimaryText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 22, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 8 },
});