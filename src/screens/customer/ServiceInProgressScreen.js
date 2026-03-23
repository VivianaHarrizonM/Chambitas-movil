import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

const STATUS_CONFIG = {
  en_camino:   { label: 'En camino',   color: COLORS.blueLight },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark },
  finalizado:  { label: 'Finalizado',  color: '#22c55e' },
};

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

  const isFinished = service.status === 'finalizado';
  const statusConfig = STATUS_CONFIG[service.status] || { label: service.status, color: COLORS.textSecondary };

  const advanceStatus = () => {
    if (service.status === 'en_camino') updateServiceStatus(service.id, 'en_servicio');
    else if (service.status === 'en_servicio') updateServiceStatus(service.id, 'finalizado');
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Servicio en curso</Text>

      {/* Tarjeta del profesional */}
      <View style={common.card}>
        <Text style={styles.proName}>{professional.name}</Text>
        <Text style={common.hintText}>{professional.category} • {professional.rating.toFixed(1)} ★</Text>
        <Text style={common.hintText}>{professional.area}</Text>
      </View>

      {/* Estado con badge de color */}
      <Text style={common.label}>Estado</Text>
      <View style={styles.statusRow}>
        <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
          <Text style={styles.badgeText}>{statusConfig.label}</Text>
        </View>
      </View>

      <Text style={[common.hintText, { marginTop: 8 }]}>{service.description || 'Sin descripción'}</Text>

      {/* Acciones — solo visibles cuando NO está finalizado */}
      {!isFinished && (
        <>
          <Text style={[common.label, { marginTop: 16 }]}>Acciones</Text>
          <TouchableOpacity style={common.buttonSecondary}>
            <Text style={common.buttonSecondaryText}>Llamar al profesional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={common.buttonSecondary}>
            <Text style={common.buttonSecondaryText}>Abrir chat</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={{ flex: 1 }} />

      {/* Botón principal */}
      {!isFinished ? (
        <TouchableOpacity style={common.buttonPrimary} onPress={advanceStatus}>
          <Text style={common.buttonPrimaryText}>
            {service.status === 'en_camino' ? 'Marcar como "En servicio"' : 'Marcar como "Finalizado"'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedMsg}>¡Servicio completado con éxito!</Text>
          <TouchableOpacity style={common.buttonPrimary} onPress={() => navigation.navigate('HomeTab')}>
            <Text style={common.buttonPrimaryText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  proName: { color: COLORS.textMain, fontSize: 16, fontWeight: '600' },
  statusRow: { flexDirection: 'row', marginTop: 4 },
  badge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  finishedContainer: { alignItems: 'center' },
  finishedMsg: { color: '#22c55e', fontWeight: '600', fontSize: 15, marginBottom: 4 },
});