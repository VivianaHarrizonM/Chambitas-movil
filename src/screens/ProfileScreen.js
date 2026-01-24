import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
          <Text style={styles.rowValue}>
            {user.phone || 'No registrado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dirección principal</Text>
          <Text style={styles.rowValue}>
            {user?.address || 'No registrada'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate('HomeTab', {
            screen: 'EditProfile',
          })
        }
      >
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeTab', {
          screen: 'PrivacyPolicy',
      })}>
        <Text style={styles.link}>Política de privacidad</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('HomeTab', {
        screen: 'Terms',
      })}>
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
    editButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  editButtonText: {
    color: '#22c55e',
    fontWeight: '600',
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
