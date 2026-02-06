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
const COLORS = {
    primary: '#F4A300',      
    primaryDark: '#D88900',
    blue: '#2F80ED',        
    background: '#F5F5F5',
    inputBg: '#fabb8031',
    textMain: '#4F4F4F',
    textSecondary: '#8A8A8A',
    border: '#f1710731',
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
