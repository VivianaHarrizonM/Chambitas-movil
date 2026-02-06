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
    padding: 16,
  },
  title: {
    color: COLORS.textMain,               
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.textMain,             
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    color: COLORS.textSecondary,       
    fontSize: 14,
    lineHeight: 20,
  },
});
