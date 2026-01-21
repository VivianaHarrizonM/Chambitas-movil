import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen() {
  const { login } = useAppContext();
  const [email, setEmail] = useState('viviana@example.com');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  if (!email) {
    alert('Ingresa tu correo');
    return;
  }

  await login({
    name: 'Viviana',
    email,
  });
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

      <Text style={styles.footerText}>
        Ingresa tus datos para continuar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#e5e7eb',
    marginBottom: 4,
  },
  subtitleSmall: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },
  label: {
    color: '#e5e7eb',
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
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    marginTop: 16,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
