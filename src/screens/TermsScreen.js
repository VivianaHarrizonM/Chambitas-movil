import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Términos y Condiciones</Text>

      <Text style={styles.text}>
        Al utilizar Chambitas, aceptas los presentes términos y condiciones.
      </Text>

      <Text style={styles.subtitle}>Uso de la aplicación</Text>
      <Text style={styles.text}>
        Chambitas funciona como una plataforma de contacto entre usuarios y
        profesionales de oficios. No garantizamos la calidad ni el resultado
        de los servicios ofrecidos por terceros.
      </Text>

      <Text style={styles.subtitle}>Responsabilidad</Text>
      <Text style={styles.text}>
        El usuario es responsable de verificar la información del profesional
        antes de contratar un servicio.
      </Text>

      <Text style={styles.subtitle}>Modificaciones</Text>
      <Text style={styles.text}>
        Nos reservamos el derecho de modificar estos términos en cualquier momento.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
});
