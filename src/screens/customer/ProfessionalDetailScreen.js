import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const AVATAR_COLORS = [
  '#F4A300', '#2F80ED', '#22c55e',
  '#e11d48', '#7c3aed', '#0891b2',
  '#d97706', '#059669',
];

function getAvatarColor(name) {
  const code = name?.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function StarRating({ value, size = 16 }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(value) ? 'star' : 'star-outline'}
          size={size}
          color={COLORS.primary}
          style={{ marginRight: 2 }}
        />
      ))}
      <Text style={styles.ratingNumber}>{Number(value).toFixed(1)}</Text>
    </View>
  );
}

function InfoChip({ icon, label }) {
  return (
    <View style={styles.infoChip}>
      <Ionicons name={icon} size={13} color={COLORS.primaryDark} style={{ marginRight: 5 }} />
      <Text style={styles.infoChipText}>{label}</Text>
    </View>
  );
}

export default function ProfessionalDetailScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals, services } = useAppContext();
  const professional = professionals.find((p) => p.id === professionalId);

  if (!professional) return (
    <View style={common.screen}>
      <Text style={common.errorText}>Profesional no encontrado</Text>
    </View>
  );

  const isFromJob   = String(professionalId).startsWith('job-');
  const avatarColor = getAvatarColor(professional.name);

  // Si viene de un job, usar el id real del profesional (sin prefijo job-)
  // para buscar reseñas correctamente en services
  const realId = isFromJob ? professional.id : professionalId;

  const reviews = services.filter(
    s => s.professionalId === realId &&
         s.status === 'finalizado' &&
         s.rating != null
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Avatar ── */}
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{professional.name.charAt(0).toUpperCase()}</Text>
      </View>

      {/* ── Nombre ── */}
      <Text style={styles.name}>{professional.name}</Text>

      {/* ── Badge de chambita ── */}
      {isFromJob && professional.jobTitle ? (
        <View style={styles.jobTitleBadge}>
          <Text style={styles.jobTitleText}>{professional.jobTitle}</Text>
        </View>
      ) : null}

      {/* ── Rating ── */}
      {professional.rating > 0
        ? <StarRating value={professional.rating} size={18} />
        : <Text style={styles.noRating}>Sin calificaciones aún</Text>
      }

      {/* ── Info chips ── */}
      <View style={styles.chipsRow}>
        <InfoChip icon="construct-outline" label={professional.category} />
        {professional.area ? (
          <InfoChip icon="location-outline" label={professional.area} />
        ) : null}
        {professional.priceFrom > 0 ? (
          <InfoChip icon="cash-outline" label={`Desde $${professional.priceFrom} MXN`} />
        ) : null}
      </View>

      {/* ── Descripción ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre mí</Text>
        <Text style={styles.description}>
          {professional.description?.trim()
            ? professional.description
            : 'Este profesional aún no ha agregado una descripción.'}
        </Text>
      </View>

      {/* ── Reseñas ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Reseñas {reviews.length > 0 ? `(${reviews.length})` : ''}
        </Text>
        {reviews.length > 0 ? (
          reviews.slice(0, 3).map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <StarRating value={r.rating} size={13} />
              <Text style={styles.reviewDate}>
                {new Date(r.createdAt).toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>Aún no hay reseñas para este profesional.</Text>
        )}
      </View>

      {/* ── Botones ── */}
      <TouchableOpacity
        style={[common.buttonPrimary, { alignSelf: 'stretch' }]}
        onPress={() => navigation.navigate('CreateReq', { professionalId: professional.id })}
      >
        <Text style={common.buttonPrimaryText}>Solicitar servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[common.buttonSecondary, { alignSelf: 'stretch', alignItems: 'center' }]}
        disabled
      >
        <Text style={common.buttonSecondaryText}>Enviar mensaje (próximamente)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, backgroundColor: COLORS.background, alignItems: 'center', padding: 20, paddingBottom: 40 },
  avatar:       { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  avatarText:   { fontSize: 36, color: COLORS.white, fontWeight: '700' },
  name:         { color: COLORS.textMain, fontSize: 22, fontWeight: '700', marginTop: 14, textAlign: 'center' },
  jobTitleBadge:{ backgroundColor: COLORS.inputBg, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 4, marginTop: 6, borderWidth: 1, borderColor: COLORS.border },
  jobTitleText: { color: COLORS.primaryDark, fontWeight: '600', fontSize: 13 },
  starsRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingNumber: { fontSize: 14, color: COLORS.textSecondary, marginLeft: 6 },
  noRating:     { fontSize: 13, color: COLORS.textSecondary, marginTop: 10 },
  chipsRow:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 14 },
  infoChip:     { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border },
  infoChipText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  section:      { alignSelf: 'stretch', marginTop: 24 },
  sectionTitle: { color: COLORS.textMain, fontWeight: '700', fontSize: 15, marginBottom: 8 },
  description:  { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
  reviewCard:   { backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 8 },
  reviewDate:   { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  noReviews:    { color: COLORS.textSecondary, fontSize: 13 },
});