import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

const STATUS_CONFIG = {
  en_camino:   { label: 'En camino',   color: COLORS.blueLight },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark },
  finalizado:  { label: 'Finalizado',  color: '#22c55e' },
};

function StarRating({ value, onChange }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={[styles.star, star <= value && styles.starActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ServiceInProgressScreen({ route, navigation }) {
  const { serviceId } = route?.params || {};
  const { services, professionals, updateServiceStatus, rateService } = useServices();
  const [selectedRating, setSelectedRating] = useState(0);
  const [rated, setRated] = useState(false);

  const service      = services.find((s) => s.id === serviceId);
  const professional = service ? professionals.find((p) => p.id === service.professionalId) : null;

  if (!service || !professional) return (
    <View style={common.screen}>
      <Text style={common.emptyText}>No hay servicios activos aún.</Text>
    </View>
  );

  const isFinished    = service.status === 'finalizado';
  const alreadyRated  = service.rating !== null && service.rating !== undefined;
  const statusConfig  = STATUS_CONFIG[service.status] || { label: service.status, color: COLORS.textSecondary };

  const advanceStatus = () => {
    if (service.status === 'en_camino')   updateServiceStatus(service.id, 'en_servicio');
    else if (service.status === 'en_servicio') updateServiceStatus(service.id, 'finalizado');
  };

  const handleRate = () => {
    if (selectedRating === 0) { alert('Selecciona una calificación'); return; }
    rateService(service.id, selectedRating);
    setRated(true);
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
      <View style={styles.statusRow}>
        <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
          <Text style={styles.badgeText}>{statusConfig.label}</Text>
        </View>
      </View>

      <Text style={[common.hintText, { marginTop: 8 }]}>{service.description || 'Sin descripción'}</Text>

      
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

      
      {isFinished && (
        <View style={styles.ratingContainer}>
          {alreadyRated || rated ? (
            <View style={styles.ratedBox}>
              <Text style={styles.ratedTitle}>¡Gracias por tu calificación!</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((s) => (
                  <Text key={s} style={[styles.star, s <= (service.rating || selectedRating) && styles.starActive]}>★</Text>
                ))}
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.ratingTitle}>¿Cómo estuvo el servicio?</Text>
              <StarRating value={selectedRating} onChange={setSelectedRating} />
              <TouchableOpacity style={[common.buttonPrimary, { backgroundColor: '#22c55e', marginTop: 8 }]} onPress={handleRate}>
                <Text style={common.buttonPrimaryText}>Enviar calificación</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <View style={{ flex: 1 }} />

      {!isFinished ? (
        <TouchableOpacity style={common.buttonPrimary} onPress={advanceStatus}>
          <Text style={common.buttonPrimaryText}>
            {service.status === 'en_camino' ? 'Marcar como "En servicio"' : 'Marcar como "Finalizado"'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[common.buttonPrimary, { marginTop: 16 }]} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={common.buttonPrimaryText}>Volver al inicio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  proName:         { color: COLORS.textMain, fontSize: 16, fontWeight: '600' },
  statusRow:       { flexDirection: 'row', marginTop: 4 },
  badge:           { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText:       { color: '#fff', fontWeight: '600', fontSize: 13 },
  ratingContainer: { marginTop: 24, alignItems: 'center' },
  ratingTitle:     { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 12 },
  starsRow:        { flexDirection: 'row', gap: 8 },
  star:            { fontSize: 36, color: COLORS.border },
  starActive:      { color: COLORS.primary },
  ratedBox:        { alignItems: 'center', gap: 10 },
  ratedTitle:      { fontSize: 15, fontWeight: '600', color: '#22c55e' },
});