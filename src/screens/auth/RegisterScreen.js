import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('customer');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    await register({ name, email, password, type });
    navigation.goBack();
  };

  return (
    <View style={common.screenAuth}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput placeholder="Nombre Completo" value={name} onChangeText={setName} style={common.input} />
      <TextInput
        placeholder="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none"
        style={[common.input, { marginTop: 12 }]}
      />
      <TextInput
        placeholder="Contraseña (mín. 6 caracteres)" value={password}
        onChangeText={setPassword} secureTextEntry
        style={[common.input, { marginTop: 12 }]}
      />

      <Text style={common.label}>Tipo de cuenta</Text>
      <View style={styles.chipsRow}>
        {['customer', 'professional'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[common.chip, type === t && common.chipSelected]}
            onPress={() => setType(t)}
          >
            <Text style={[common.chipText, type === t && common.chipTextSelected]}>
              {t === 'customer' ? 'Cliente' : 'Profesional'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={common.buttonPrimary} onPress={handleRegister}>
        <Text style={common.buttonPrimaryText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={common.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { 
    color: COLORS.primary, 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 16 },
  chipsRow: { 
    flexDirection: 'row', 
    marginTop: 6, 
    marginBottom: 8 },
});