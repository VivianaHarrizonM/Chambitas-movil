import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

const STATUS_LABELS = {
  en_camino:   { label: 'En camino',  color: COLORS.blueLight },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark },
  finalizado:  { label: 'Finalizado', color: '#22c55e' },
};

export default function MyRequestsScreen({ navigation }) {
  const { services, professionals } = useServices();
  const { user } = useAuth();

  // Solo servicios de este consumidor
  const myServices = services.filter((s) => s.customerEmail === user.email);

  if (myServices.length === 0) {
    return (
      <View style={[common.screen, styles.empty]}>
        <Text style={styles.emptyIcon}>🔧</Text>
        <Text style={styles.emptyTitle}>Sin servicios aún</Text>
        <Text style={common.emptyText}>
          Solicita un servicio desde la pestaña Inicio y aparecerá aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis servicios</Text>
      <FlatList
        data={myServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const professional = professionals.find((p) => p.id === item.professionalId);
          const statusInfo = STATUS_LABELS[item.status] || { label: item.status, color: COLORS.textSecondary };
          return (
            <TouchableOpacity
              style={common.card}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.proName}>
                  {professional ? professional.name : 'Profesional'}
                </Text>
                <View style={[styles.badge, { backgroundColor: statusInfo.color }]}>
                  <Text style={styles.badgeText}>{statusInfo.label}</Text>
                </View>
              </View>
              <Text style={common.hintText}>
                {professional ? professional.category : ''}
              </Text>
              <Text style={[common.hintText, { marginTop: 4 }]} numberOfLines={1}>
                {item.description}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textMain, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  proName: { color: COLORS.textMain, fontWeight: '600', fontSize: 15, flex: 1 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  date: { color: COLORS.textSecondary, fontSize: 11, marginTop: 6 },
});