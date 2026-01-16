import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.meta}>{user.email}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Teléfono</Text>
          <Text style={styles.rowValue}>+52 ••• ••• ••••</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dirección principal</Text>
          <Text style={styles.rowValue}>Roma Norte, CDMX</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={styles.link}>Política de privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
        <Text style={styles.link}>Términos y condiciones</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  avatarText: {
    fontSize: 32,
    color: '#e5e7eb',
    fontWeight: '700',
  },
  name: {
    color: '#e5e7eb',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  meta: {
    color: '#9ca3af',
    marginTop: 4,
  },
  section: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    color: '#9ca3af',
  },
  rowValue: {
    color: '#e5e7eb',
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 32,
  },
  buttonText: {
    color: '#fef2f2',
    fontWeight: '600',
  },
  link: {
  color: '#22c55e',
  marginTop: 8,
},
});
