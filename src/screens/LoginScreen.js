import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen({ navigation }) {

  const { login } = useAppContext();
  const [email, setEmail] = useState('viviana@example.com');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    alert('Ingresa correo y contraseña');
    return;
  }

  await login({ email, password });
  setPassword('');
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chambitas</Text>
      <Text style={styles.subtitle}>Hola 👋</Text>
      <Text style={styles.subtitleSmall}>Inicia sesión para encontrar profesionales.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="viviana@correo.com"
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
        
      </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

      <Text style={styles.footerText}>
        Ingresa tus datos para continuar.
      </Text>
      
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  subtitleSmall: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  label: {
    color: COLORS.textMain,
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
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,   
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: COLORS.blue,
    textAlign: 'center',
    marginTop: 16,
  },
  footerText: {
    marginTop: 16,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
