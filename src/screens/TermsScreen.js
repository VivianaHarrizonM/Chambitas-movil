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
        El uso de la aplicación Chambitas implica la aceptación de los presentes términos.
        Esta aplicación es una versión de demostración y no representa un servicio real de contratación de profesionales.
      </Text>

      <Text style={styles.subtitle}>Responsabilidad</Text>
      <Text style={styles.text}>
        Chambitas no se hace responsable por acuerdos, trabajos o servicios realizados fuera de la aplicación.
        La información mostrada es simulada y utilizada únicamente con fines educativos y de prueba.
      </Text>

      <Text style={styles.subtitle}>Modificaciones</Text>
      <Text style={styles.text}>
        El desarrollador se reserva el derecho de modificar o suspender la aplicación en cualquier momento.
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
