import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX  = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{2,}$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [type, setType]       = useState('customer');
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim())               e.name = 'El nombre es obligatorio';
    else if (!NAME_REGEX.test(name.trim())) e.name = 'Solo letras y espacios, mín. 2 caracteres';

    if (!email.trim())              e.email = 'El correo es obligatorio';
    else if (!EMAIL_REGEX.test(email.trim())) e.email = 'Ingresa un correo válido (ej. correo@mail.com)';

    if (!password)                  e.password = 'La contraseña es obligatoria';
    else if (password.length < 6)   e.password = 'Mínimo 6 caracteres';
    else if (!/[0-9]/.test(password)) e.password = 'Debe contener al menos un número';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    await register({ name: name.trim(), email: email.trim().toLowerCase(), password, type });
    navigation.goBack();
  };

  const Field = ({ placeholder, value, onChange, keyboard, secure, errorKey }) => (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(v) => { onChange(v); if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: null })); }}
        keyboardType={keyboard || 'default'}
        autoCapitalize="none"
        secureTextEntry={secure}
        style={[common.input, { marginTop: 12 }, errors[errorKey] && styles.inputError]}
        placeholderTextColor={COLORS.textSecondary}
      />
      {errors[errorKey] ? <Text style={styles.errorMsg}>{errors[errorKey]}</Text> : null}
    </>
  );

  return (
    <ScrollView contentContainerStyle={common.screenAuth} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Crear cuenta</Text>

      <Field placeholder="Nombre Completo" value={name} onChange={setName} errorKey="name" />
      <Field placeholder="Correo electrónico" value={email} onChange={setEmail} keyboard="email-address" errorKey="email" />
      <Field placeholder="Contraseña (mín. 6 caracteres y un número)" value={password} onChange={setPassword} secure errorKey="password" />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { color: COLORS.primary, fontSize: 24, fontWeight: '700', marginBottom: 8, marginTop: 32 },
  chipsRow: { flexDirection: 'row', marginTop: 6, marginBottom: 8 },
  inputError: { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg: { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
});