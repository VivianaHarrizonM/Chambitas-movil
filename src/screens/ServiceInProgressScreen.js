import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

const STATUS_LABELS = {
  en_camino: 'En camino',
  en_servicio: 'En servicio',
  finalizado: 'Finalizado',
};

export default function ServiceInProgressScreen({ route, navigation }) {
  const { serviceId } = route.params;
  const { services, professionals, updateServiceStatus } = useAppContext();

  const service = services.find((s) => s.id === serviceId);
  const professional = service
    ? professionals.find((p) => p.id === service.professionalId)
    : null;

  if (!service || !professional) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Servicio no encontrado</Text>
      </View>
    );
  }

  const advanceStatus = () => {
    if (service.status === 'en_camino') {
      updateServiceStatus(service.id, 'en_servicio');
    } else if (service.status === 'en_servicio') {
      updateServiceStatus(service.id, 'finalizado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Servicio en curso</Text>

      <View style={styles.card}>
        <Text style={styles.proName}>{professional.name}</Text>
        <Text style={styles.meta}>
          {professional.category} • {professional.rating.toFixed(1)} ★
        </Text>
        <Text style={styles.meta}>{professional.area}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <Text style={styles.statusText}>{STATUS_LABELS[service.status]}</Text>
        <Text style={styles.description}>{service.description || 'Sin descripción'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones</Text>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Llamar (dummy)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Abrir chat (dummy)</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      {service.status !== 'finalizado' ? (
        <TouchableOpacity style={styles.primaryButton} onPress={advanceStatus}>
          <Text style={styles.primaryButtonText}>
            {service.status === 'en_camino' ? 'Marcar como "En servicio"' : 'Marcar como "Finalizado"'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.finishedText}>Servicio finalizado ✅ (demo)</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
  },
  heading: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 16,
  },
  proName: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#d1d5db',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#022c22',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#e5e7eb',
  },
  finishedText: {
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    color: '#fecaca',
    padding: 16,
  },
});
