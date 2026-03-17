import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const fields = [
    { label: 'Teléfono', value: user.phone || 'No registrado' },
    { label: 'Dirección', value: user.address || 'No registrada' },
    { label: 'Ciudad', value: user.city || 'No registrada' },
    { label: 'Código postal', value: user.zipCode || 'No registrado' },
    { label: 'Referencias', value: user.reference || 'No registradas' },
  ];

  return (
    <View style={common.screenCentered}>
      <View style={common.avatar}>
        <Text style={common.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={common.hintText}>{user.email}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        {fields.map((f) => (
          <View key={f.label} style={common.row}>
            <Text style={common.rowLabel}>{f.label}</Text>
            <Text style={common.rowValue}>{f.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={common.buttonOutline} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={common.buttonOutlineText}>Editar perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={common.buttonPrimary} onPress={logout}>
        <Text style={common.buttonPrimaryText}>Cerrar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={common.link}>Política de privacidad</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
        <Text style={common.link}>Términos y condiciones</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { 
    color: COLORS.textMain, 
    fontSize: 20, fontWeight: '600', 
    marginTop: 12 },
  section: { 
    alignSelf: 'stretch', 
    marginTop: 24 },
  sectionTitle: { 
    color: COLORS.textMain, 
    fontWeight: '600', 
    marginBottom: 8 },
});