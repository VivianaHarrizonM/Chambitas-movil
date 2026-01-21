import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAppContext();
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  const handleSave = () => {
    updateUser({ phone, address });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Teléfono</Text>
          <Text style={styles.rowValue}>
            {user.phone || 'No registrado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dirección principal</Text>
          <Text style={styles.rowValue}>
            {user.address || 'No registrada'}
          </Text>
        </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#020617',
  },
  title: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '600',
  },
  rowValue: {
    color: '#e5e7eb',
  },
});