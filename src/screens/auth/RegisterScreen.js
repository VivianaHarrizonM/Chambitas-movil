import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX  = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{2,}$/;

// ── Field definido FUERA del componente para que React no lo desmonte ──
function Field({ placeholder, value, onChange, keyboard, secure, error, editable, onSubmit, returnKey }) {
  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard || 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!!secure}
        editable={editable !== false}
        onSubmitEditing={onSubmit}
        returnKeyType={returnKey || 'next'}
        style={[common.input, { marginTop: 12 }, error && styles.inputError]}
        placeholderTextColor={COLORS.textSecondary}
      />
      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
    </>
  );
}

export default function RegisterScreen({ navigation }) {
  const { register } = useAppContext();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [type, setType]         = useState('customer');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [globalError, setGlobalError] = useState('');

  const clearError = (key) => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const e = {};
    if (!name.trim())                         e.name     = 'El nombre es obligatorio';
    else if (!NAME_REGEX.test(name.trim()))   e.name     = 'Solo letras y espacios, mín. 2 caracteres';
    if (!email.trim())                        e.email    = 'El correo es obligatorio';
    else if (!EMAIL_REGEX.test(email.trim())) e.email    = 'Ingresa un correo válido';
    if (!password)                            e.password = 'La contraseña es obligatoria';
    else if (password.length < 6)             e.password = 'Mínimo 6 caracteres';
    else if (!/[0-9]/.test(password))         e.password = 'Debe contener al menos un número';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    setGlobalError('');
    if (!validate()) return;

    setLoading(true);
    const ok = await register({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      type,
    });
    setLoading(false);

    // Si ok es true el AppContext ya autenticó y redirige automáticamente.
    // Si falló, register() ya mostró el error — pero también lo capturamos aquí.
    if (!ok) {
      setGlobalError('No se pudo crear la cuenta. Intenta de nuevo.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={common.screenAuth}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear cuenta</Text>

        <Field
          placeholder="Nombre completo"
          value={name}
          onChange={(v) => { setName(v); clearError('name'); }}
          error={errors.name}
          editable={!loading}
          returnKey="next"
        />
        <Field
          placeholder="Correo electrónico"
          value={email}
          onChange={(v) => { setEmail(v); clearError('email'); }}
          keyboard="email-address"
          error={errors.email}
          editable={!loading}
          returnKey="next"
        />
        <Field
          placeholder="Contraseña (mín. 6 caracteres y un número)"
          value={password}
          onChange={(v) => { setPassword(v); clearError('password'); }}
          secure
          error={errors.password}
          editable={!loading}
          onSubmit={handleRegister}
          returnKey="done"
        />

        <Text style={common.label}>Tipo de cuenta</Text>
        <View style={styles.chipsRow}>
          {['customer', 'professional'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[common.chip, type === t && common.chipSelected]}
              onPress={() => !loading && setType(t)}
            >
              <Text style={[common.chipText, type === t && common.chipTextSelected]}>
                {t === 'customer' ? 'Cliente' : 'Profesional'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {globalError ? <Text style={styles.globalError}>{globalError}</Text> : null}

        <TouchableOpacity
          style={[common.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={common.buttonPrimaryText}>Registrarme</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={common.link}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title:         { color: COLORS.primary, fontSize: 24, fontWeight: '700', marginBottom: 8, marginTop: 32 },
  chipsRow:      { flexDirection: 'row', marginTop: 6, marginBottom: 8 },
  inputError:    { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg:      { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
  globalError:   { color: COLORS.error, fontSize: 13, marginTop: 12, textAlign: 'center' },
  buttonDisabled:{ opacity: 0.7 },
});