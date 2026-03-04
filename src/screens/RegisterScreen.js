import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
  if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Completa todos los campos obligatorios');
      return;
    }

  await register({
      name,
      email,
      password,
    });

    navigation.goBack();
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        placeholder="Nombre Completo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}}
      />

      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      /> */}
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>
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
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textMain,  
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: COLORS.white,    
    fontWeight: '600',
  },
  link: {
    color: COLORS.blue,
    textAlign: 'center',
    marginTop: 16,
  },
});
