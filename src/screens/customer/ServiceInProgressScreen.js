import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const STATUS_CONFIG = {
  pendiente:   { label: 'Pendiente',   color: '#f59e0b', icon: 'time-outline' },
  en_camino:   { label: 'En camino',   color: COLORS.blueLight, icon: 'navigate-outline' },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark, icon: 'construct-outline' },
  finalizado:  { label: 'Finalizado',  color: '#22c55e', icon: 'checkmark-circle-outline' },
  rechazado:   { label: 'Rechazado',   color: COLORS.error, icon: 'close-circle-outline' },
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

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={14} color={COLORS.textSecondary} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ServiceInProgressScreen({ route, navigation }) {
  const { serviceId } = route?.params || {};
  const { services, professionals, updateServiceStatus, rateService } = useAppContext();
  const [selectedRating, setSelectedRating] = useState(0);
  const [rated, setRated] = useState(false);

  const service      = services.find(s => s.id === serviceId);
  const professional = service
    ? professionals.find(p => p.id === service.professionalId)
    : null;

  if (!service) return (
    <View style={common.screen}>
      <Text style={common.emptyText}>Servicio no encontrado.</Text>
    </View>
  );

  const proName     = professional?.name     || service.professionalName     || 'Profesional';
  const proCategory = professional?.category || service.professionalCategory || '';
  const proRating   = professional?.rating   || service.professionalRating   || 0;
  const proArea     = professional?.area     || service.professionalArea     || '';

  const isFinished   = service.status === 'finalizado';
  const isRejected   = service.status === 'rechazado';
  const isPending    = service.status === 'pendiente';
  const isActive     = service.status === 'en_camino' || service.status === 'en_servicio';
  const alreadyRated = service.rating !== null && service.rating !== undefined;
  const statusConfig = STATUS_CONFIG[service.status] || { label: service.status, color: COLORS.textSecondary, icon: 'help-outline' };

  // Formato de cuándo
  const scheduleText = service.whenType === 'programado' && service.date
    ? `${service.date}${service.time ? ' a las ' + service.time : ''}`
    : 'Lo antes posible';

  const advanceStatus = () => {
    if (service.status === 'en_camino') updateServiceStatus(service.id, 'en_servicio');
    else if (service.status === 'en_servicio') updateServiceStatus(service.id, 'finalizado');
  };

  const handleRate = () => {
    if (selectedRating === 0) { alert('Selecciona una calificación'); return; }
    rateService(service.id, selectedRating);
    setRated(true);
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={common.heading}>Detalle del servicio</Text>

      {/* ── Card del profesional ── */}
      <View style={common.card}>
        <View style={styles.proHeader}>
          <View style={styles.proAvatar}>
            <Text style={styles.proAvatarText}>{proName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.proName}>{proName}</Text>
            {proCategory ? (
              <Text style={common.hintText}>
                {proCategory}{proRating > 0 ? ` · ${Number(proRating).toFixed(1)} ★` : ''}
              </Text>
            ) : null}
            {proArea ? <Text style={common.hintText}>{proArea}</Text> : null}
          </View>
        </View>
      </View>

      {/* ── Estado ── */}
      <Text style={common.label}>Estado</Text>
      <View style={styles.statusRow}>
        <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
          <Ionicons name={statusConfig.icon} size={13} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>{statusConfig.label}</Text>
        </View>
      </View>

      {/* ── Información del servicio ── */}
      <Text style={common.label}>Información</Text>
      <View style={styles.infoCard}>
        <InfoRow
          icon="calendar-outline"
          label="Cuándo"
          value={scheduleText}
        />
        <InfoRow
          icon="location-outline"
          label="Dirección"
          value={service.address}
        />
        <InfoRow
          icon="document-text-outline"
          label="Descripción"
          value={service.description}
        />
        <InfoRow
          icon="time-outline"
          label="Solicitado"
          value={new Date(service.createdAt).toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        />
      </View>

      {/* ── Estado pendiente ── */}
      {isPending && (
        <View style={styles.pendingBox}>
          <Ionicons name="hourglass-outline" size={20} color="#f59e0b" />
          <Text style={styles.pendingText}>
            Esperando que el profesional acepte tu solicitud.
          </Text>
        </View>
      )}

      {/* ── Estado rechazado ── */}
      {isRejected && (
        <View style={styles.rejectedBox}>
          <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
          <Text style={styles.rejectedText}>
            El profesional rechazó esta solicitud. Puedes buscar otro profesional.
          </Text>
        </View>
      )}

      {/* ── Acciones activo ── */}
      {isActive && (
        <>
          <Text style={[common.label, { marginTop: 16 }]}>Acciones</Text>
          <TouchableOpacity style={common.buttonSecondary} disabled>
            <Text style={common.buttonSecondaryText}>Llamar al profesional (próximamente)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={common.buttonSecondary} disabled>
            <Text style={common.buttonSecondaryText}>Abrir chat (próximamente)</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── Calificación ── */}
      {isFinished && (
        <View style={styles.ratingContainer}>
          {alreadyRated || rated ? (
            <View style={styles.ratedBox}>
              <Text style={styles.ratedTitle}>¡Gracias por tu calificación!</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Text key={s} style={[styles.star, s <= (service.rating || selectedRating) && styles.starActive]}>★</Text>
                ))}
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.ratingTitle}>¿Cómo estuvo el servicio?</Text>
              <StarRating value={selectedRating} onChange={setSelectedRating} />
              <TouchableOpacity
                style={[common.buttonPrimary, { backgroundColor: '#22c55e', marginTop: 8 }]}
                onPress={handleRate}
              >
                <Text style={common.buttonPrimaryText}>Enviar calificación</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ── Botón avanzar estado (solo activos) ── */}
      {isActive && (
        <TouchableOpacity style={common.buttonPrimary} onPress={advanceStatus}>
          <Text style={common.buttonPrimaryText}>
            {service.status === 'en_camino'
              ? 'Marcar como "En servicio"'
              : 'Marcar como "Finalizado"'}
          </Text>
        </TouchableOpacity>
      )}

      {/* ── Botón volver (finalizado o rechazado) ── */}
      {(isFinished || isRejected) && (
        <TouchableOpacity
          style={[common.buttonPrimary, { marginTop: 16 }]}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={common.buttonPrimaryText}>Volver al inicio</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Profesional
  proHeader:     { flexDirection: 'row', alignItems: 'center' },
  proAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  proAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 18 },
  proName:       { color: COLORS.textMain, fontSize: 16, fontWeight: '600' },

  // Estado
  statusRow: { flexDirection: 'row', marginTop: 4 },
  badge:     { flexDirection: 'row', alignItems: 'center', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Info
  infoCard:   { backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginTop: 6 },
  infoRow:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  infoLabel:  { color: COLORS.textSecondary, fontSize: 12, marginLeft: 6, marginRight: 4, minWidth: 70 },
  infoValue:  { color: COLORS.textMain, fontSize: 12, flex: 1 },

  // Pendiente
  pendingBox:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 12, padding: 12, marginTop: 16, gap: 8 },
  pendingText: { color: '#92400e', fontSize: 13, flex: 1 },

  // Rechazado
  rejectedBox:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', borderRadius: 12, padding: 12, marginTop: 16, gap: 8 },
  rejectedText: { color: '#991b1b', fontSize: 13, flex: 1 },

  // Rating
  ratingContainer: { marginTop: 24, alignItems: 'center' },
  ratingTitle:     { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 12 },
  starsRow:        { flexDirection: 'row', gap: 8 },
  star:            { fontSize: 36, color: COLORS.border },
  starActive:      { color: COLORS.primary },
  ratedBox:        { alignItems: 'center', gap: 10 },
  ratedTitle:      { fontSize: 15, fontWeight: '600', color: '#22c55e' },
});