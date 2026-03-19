import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
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
    <View style={common.screenAuth}>
      <Text style={styles.title}>Chambitas</Text>
      <Text style={styles.subtitle}>Hola 👋</Text>
      <Text style={styles.subtitleSmall}>Inicia sesión para encontrar profesionales.</Text>

      <Text style={common.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="tu@correo.com"
        style={common.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={common.label}>Contraseña</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="******"
        style={common.input}
        secureTextEntry
      />

      <TouchableOpacity style={common.buttonPrimary} onPress={handleLogin}>
        <Text style={common.buttonPrimaryText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={common.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: COLORS.primary, 
    marginBottom: 8 },
  subtitle: {
     fontSize: 20, 
     color: COLORS.primaryDark, 
     marginBottom: 4 },
  subtitleSmall: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    marginBottom: 24 },
});