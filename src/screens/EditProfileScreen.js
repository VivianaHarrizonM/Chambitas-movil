import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAppContext();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [city, setCity] = useState(user.city || '');
  const [zipCode, setZipCode] = useState(user.zipCode || '');
  const [reference, setReference] = useState(user.reference || '');

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Nombre, teléfono y dirección son obligatorios');
      return;
    }

    updateUser({
      name,
      phone,
      address,
      city,
      zipCode,
      reference,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Código postal</Text>
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Referencias</Text>
      <TextInput
        style={styles.input}
        value={reference}
        onChangeText={setReference}
        placeholder="Ej: Casa blanca con portón negro"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: COLORS.textSecondary,   
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,         
    fontWeight: '600',
    fontSize: 16,
  },
});