import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Política de Privacidad</Text>

      <Text style={styles.text}>
        En Chambitas es una aplicación de demostración diseñada para{"\n"} 
        conectar usuarios con profesionales de distintos oficios.
      </Text>

      <Text style={styles.subtitle}>Información que recopilamos</Text>
      <Text style={styles.text}>
        Esta aplicación no recopila, almacena ni comparte información personal sensible con terceros.{"\n"}
        Los datos mostrados dentro de la app (nombre, correo, servicios) se utilizan únicamente con fines demostrativos.

      </Text>

      <Text style={styles.subtitle}>Uso de la información</Text>
      <Text style={styles.text}>
        No se recopila información de ubicación en tiempo real, datos bancarios ni información de pago. {"/n"}Si en el futuro se implementan funciones que requieran recopilación de datos, esta política será actualizada.
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
