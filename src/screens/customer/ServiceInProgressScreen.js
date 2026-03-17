import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

const STATUS_LABELS = { 
  en_camino: 'En camino 🚗', 
  en_servicio: 'En servicio 🔧', 
  finalizado: 'Finalizado ✅' };

export default function ServiceInProgressScreen({ route, navigation }) {
  const { serviceId } = route?.params || {};
  const { services, professionals, updateServiceStatus } = useServices();
  const service = services.find((s) => s.id === serviceId);
  const professional = service ? professionals.find((p) => p.id === service.professionalId) : null;

  if (!service || !professional) return (
    <View style={common.screen}>
      <Text style={common.emptyText}>No hay servicios activos aún.</Text>
    </View>
  );

  const advanceStatus = () => {
    if (service.status === 'en_camino') updateServiceStatus(service.id, 'en_servicio');
    else if (service.status === 'en_servicio') updateServiceStatus(service.id, 'finalizado');
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Servicio en curso</Text>
      <View style={common.card}>
        <Text style={styles.proName}>{professional.name}</Text>
        <Text style={common.hintText}>{professional.category} • {professional.rating.toFixed(1)} ★</Text>
        <Text style={common.hintText}>{professional.area}</Text>
      </View>
      <Text style={common.label}>Estado</Text>
      <Text style={styles.statusText}>{STATUS_LABELS[service.status]}</Text>
      <Text style={common.hintText}>{service.description || 'Sin descripción'}</Text>

      <Text style={[common.label, { marginTop: 16 }]}>Acciones</Text>
      <TouchableOpacity style={common.buttonSecondary}><Text style={common.buttonSecondaryText}>Llamar al profesional</Text></TouchableOpacity>
      <TouchableOpacity style={common.buttonSecondary}><Text style={common.buttonSecondaryText}>Abrir chat</Text></TouchableOpacity>

      <View style={{ flex: 1 }} />
      {service.status !== 'finalizado' ? (
        <TouchableOpacity style={common.buttonPrimary} onPress={advanceStatus}>
          <Text style={common.buttonPrimaryText}>
            {service.status === 'en_camino' ? 'Marcar como "En servicio"' : 'Marcar como "Finalizado"'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={common.buttonPrimary} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={common.buttonPrimaryText}>Volver al inicio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  proName: { 
    color: COLORS.textMain, 
    fontSize: 16, 
    fontWeight: '600' },
  statusText: { 
    color: COLORS.primary, 
    fontWeight: '600', 
    marginBottom: 4 },
});