import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ProfessionalDetailScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals } = useAppContext();

  const professional = professionals.find((p) => p.id === professionalId);

  if (!professional) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Profesional no encontrado</Text>
      </View>
    );
  }

  const handleRequest = () => {
    navigation.navigate('CreateRequest', { professionalId: professional.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {professional.name.charAt(0)}
        </Text>
      </View>
      <Text style={styles.name}>{professional.name}</Text>
      <Text style={styles.meta}>
        {professional.category} • {professional.rating.toFixed(1)} ★
      </Text>
      <Text style={styles.meta}>{professional.area}</Text>
      <Text style={styles.meta}>Desde ${professional.priceFrom} MXN</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.description}>{professional.description}</Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleRequest}>
        <Text style={styles.buttonPrimaryText}>Solicitar servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} disabled>
        <Text style={styles.buttonSecondaryText}>Enviar mensaje (próximamente)</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        La función de mensajería estará disponible en una próxima actualización.
      </Text>
    </View>
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
  error: '#FF6B6B',
  darkBg: '#1f2937',      
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,   
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDark,  
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  avatarText: {
    fontSize: 32,
    color: COLORS.white,                 
    fontWeight: '700',
  },
  name: {
    color: COLORS.textMain,              
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  meta: {
    color: COLORS.textSecondary,          
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    color: COLORS.textMain,             
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 4,
  },
  description: {
    alignSelf: 'flex-start',
    color: COLORS.textSecondary,          
    fontSize: 14,
    marginBottom: 24,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,     
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  buttonPrimaryText: {
    color: COLORS.white,                  
    fontWeight: '600',
  },
  buttonSecondary: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: COLORS.blue,            
  },
  buttonSecondaryText: {
    color: COLORS.blue,                
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: COLORS.textSecondary,          
    textAlign: 'center',
  },
  error: {
    color: COLORS.error,                 
  },
});
