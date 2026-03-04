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
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Ciudad</Text>
          <Text style={styles.rowValue}>
            {user.city || 'No registrada'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Código postal</Text>
          <Text style={styles.rowValue}>
            {user.zipCode || 'No registrado'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Referencias</Text>
          <Text style={styles.rowValue}>
            {user.reference || 'No registradas'}
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

const COLORS = {
  primary: '#F4A300',      
  primaryDark: '#D88900',
  blue: '#022e86',        
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
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDark,  
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  avatarText: {
    fontSize: 32,
    color: COLORS.white,                
    fontWeight: '700',
  },
  name: {
    color: COLORS.textMain,              
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  meta: {
    color: COLORS.textSecondary,         
    marginTop: 4,
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
    paddingVertical: 6,
  },
  rowLabel: {
    color: COLORS.textSecondary,         
  },
  rowValue: {
    color: COLORS.textMain,              
  },
  editButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.blue,             
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  editButtonText: {
    color: COLORS.blue,                  
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,    
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 32,
  },
  buttonText: {
    color: COLORS.white,                  
    fontWeight: '600',
  },
  link: {
    color: COLORS.blue,                  
    marginTop: 8,
  },
});
