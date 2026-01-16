import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Política de Privacidad</Text>

      <Text style={styles.text}>
        En Chambitas respetamos tu privacidad. Esta aplicación recopila únicamente
        la información necesaria para brindar el servicio de conexión entre usuarios
        y profesionales de oficios.
      </Text>

      <Text style={styles.subtitle}>Información que recopilamos</Text>
      <Text style={styles.text}>
        • Nombre y correo electrónico proporcionados por el usuario.{"\n"}
        • Información relacionada con solicitudes de servicios.
      </Text>

      <Text style={styles.subtitle}>Uso de la información</Text>
      <Text style={styles.text}>
        La información se utiliza únicamente para el funcionamiento de la aplicación
        y no es compartida con terceros.
      </Text>

      <Text style={styles.subtitle}>Almacenamiento</Text>
      <Text style={styles.text}>
        Los datos se almacenan localmente en el dispositivo del usuario.
      </Text>

      <Text style={styles.subtitle}>Contacto</Text>
      <Text style={styles.text}>
        Para cualquier duda sobre esta política, puedes contactarnos desde la aplicación.
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
