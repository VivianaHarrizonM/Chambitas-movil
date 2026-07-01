import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();

  const fields = [
    { label: 'Teléfono',      value: user?.phone     || 'No registrado' },
    { label: 'Dirección',     value: user?.address   || 'No registrada' },
    { label: 'Ciudad',        value: user?.city      || 'No registrada' },
    { label: 'Código postal', value: user?.zipCode   || 'No registrado' },
    { label: 'Referencias',   value: user?.reference || 'No registradas' },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={common.avatar}>
        <Text style={common.avatarText}>
          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={common.hintText}>{user?.email}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        {fields.map((f) => (
          <View key={f.label} style={styles.row}>
            <Text style={styles.rowLabel}>{f.label}</Text>
            <Text style={styles.rowValue}>{f.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[common.buttonOutline, { alignSelf: 'stretch', alignItems: 'center' }]}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={common.buttonOutlineText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[common.buttonPrimary, { alignSelf: 'stretch' }]}
        onPress={logout}
      >
        <Text style={common.buttonPrimaryText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={common.link}>Política de privacidad</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
        <Text style={common.link}>Términos y condiciones</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  name: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  section: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  sectionTitle: {
    color: COLORS.textMain,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',  // ← permite que el valor crezca verticalmente
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    width: 110,              // ← ancho fijo para la etiqueta
    flexShrink: 0,
  },
  rowValue: {
    color: COLORS.textMain,
    fontSize: 13,
    flex: 1,                 // ← ocupa el resto del espacio
    textAlign: 'right',
    flexWrap: 'wrap',        // ← permite que el texto haga salto de línea
  },
});