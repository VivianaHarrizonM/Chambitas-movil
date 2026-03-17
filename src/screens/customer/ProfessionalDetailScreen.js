import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

export default function ProfessionalDetailScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals } = useServices();
  const professional = professionals.find((p) => p.id === professionalId);

  if (!professional) return <View style={common.screen}><Text style={common.errorText}>Profesional no encontrado</Text></View>;

  return (
    <View style={common.screenCentered}>
      <View style={common.avatar}>
        <Text style={common.avatarText}>{professional.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{professional.name}</Text>
      <Text style={common.hintText}>{professional.category} • {professional.rating.toFixed(1)} ★</Text>
      <Text style={common.hintText}>{professional.area}</Text>
      <Text style={common.hintText}>Desde ${professional.priceFrom} MXN</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={[common.hintText, { alignSelf: 'flex-start', marginBottom: 24 }]}>{professional.description}</Text>

      <TouchableOpacity
        style={common.buttonPrimary}
        onPress={() => navigation.navigate('CreateReq', { professionalId: professional.id })}
      >
        <Text style={common.buttonPrimaryText}>Solicitar servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={common.buttonSecondary} disabled>
        <Text style={common.buttonSecondaryText}>Enviar mensaje (próximamente)</Text>
      </TouchableOpacity>

      <Text style={common.hintText}>La función de mensajería estará disponible pronto.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { 
    color: COLORS.textMain, 
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 12 },
  sectionTitle: { 
    alignSelf: 'flex-start', 
    color: COLORS.textMain, 
    fontWeight: '600', 
    marginTop: 24, 
    marginBottom: 4 },
});