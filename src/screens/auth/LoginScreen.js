import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAppContext();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    const ok = await login({ email: email.trim().toLowerCase(), password });
    setLoading(false);

    if (!ok) {
      setError('Correo o contraseña incorrectos');
      setPassword('');
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
        <Text style={styles.title}>Chambitas</Text>
        <Text style={styles.subtitle}>Hola 👋</Text>
        <Text style={styles.subtitleSmall}>
          Inicia sesión para encontrar profesionales.
        </Text>

        <Text style={common.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(v) => { setEmail(v); setError(''); }}
          placeholder="tu@correo.com"
          style={[common.input, error && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={common.label}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={(v) => { setPassword(v); setError(''); }}
          placeholder="******"
          style={[common.input, error && styles.inputError]}
          secureTextEntry
          autoCorrect={false}
          editable={!loading}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

        <TouchableOpacity
          style={[common.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={common.buttonPrimaryText}>Iniciar sesión</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={common.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title:          { fontSize: 32, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  subtitle:       { fontSize: 20, color: COLORS.primaryDark, marginBottom: 4 },
  subtitleSmall:  { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  inputError:     { borderColor: COLORS.error, borderWidth: 1.5 },
  errorMsg:       { color: COLORS.error, fontSize: 13, marginTop: 8, textAlign: 'center' },
  buttonDisabled: { opacity: 0.7 },
});