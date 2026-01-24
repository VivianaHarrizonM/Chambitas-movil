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

  const handleSave = () => {
    updateUser({
      name,
      phone,
      address,
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

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: '#9ca3af',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f9fafb',
    borderWidth: 1,
    borderColor: '#374151',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 16,
  },
});