import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { COLORS, common } from '../../theme';

// Colores de avatar por inicial para diferenciar profesionales visualmente
const AVATAR_COLORS = [
  '#F4A300', '#2F80ED', '#22c55e', '#e11d48',
  '#7c3aed', '#0891b2', '#d97706', '#059669',
];

function getAvatarColor(name) {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export default function ProfessionalDetailScreen({ route, navigation }) {
  const { professionalId } = route.params;
  const { professionals } = useServices();
  const professional = professionals.find((p) => p.id === professionalId);

  if (!professional) return (
    <View style={common.screen}>
      <Text style={common.errorText}>Profesional no encontrado</Text>
    </View>
  );

  const isFromJob = professionalId.startsWith('job-');
  const avatarColor = getAvatarColor(professional.name);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar con color único por profesional */}
      <View style={[common.avatar, { backgroundColor: avatarColor }]}>
        <Text style={common.avatarText}>{professional.name.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.name}>{professional.name}</Text>

      {/* Si viene de un job publicado, muestra el título del servicio */}
      {isFromJob && professional.jobTitle ? (
        <View style={styles.jobTitleBadge}>
          <Text style={styles.jobTitleText}>{professional.jobTitle}</Text>
        </View>
      ) : null}

      <Text style={common.hintText}>{professional.category} • {professional.rating.toFixed(1)} ★</Text>
      <Text style={common.hintText}>{professional.area}</Text>
      <Text style={common.hintText}>Desde ${professional.priceFrom} MXN</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.description}>{professional.description}</Text>

      <TouchableOpacity
        style={[common.buttonPrimary, { alignSelf: 'stretch' }]}
        onPress={() => navigation.navigate('CreateReq', { professionalId: professional.id })}
      >
        <Text style={common.buttonPrimaryText}>Solicitar servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[common.buttonSecondary, { alignSelf: 'stretch', alignItems: 'center' }]} disabled>
        <Text style={common.buttonSecondaryText}>Enviar mensaje (próximamente)</Text>
      </TouchableOpacity>

      <Text style={[common.hintText, { textAlign: 'center', marginTop: 8 }]}>
        La función de mensajería estará disponible pronto.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  name: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  jobTitleBadge: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  jobTitleText: {
    color: COLORS.primaryDark,
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    color: COLORS.textMain,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 6,
  },
  description: {
    alignSelf: 'flex-start',
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
});