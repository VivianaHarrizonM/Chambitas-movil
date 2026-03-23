import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

const STATUS_CONFIG = {
  en_camino:   { label: 'En camino',   color: COLORS.blueLight },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark },
  finalizado:  { label: 'Finalizado',  color: '#22c55e' },
};

const TABS = ['Activos', 'Historial'];

export default function MyRequestsScreen({ navigation }) {
  const { services, professionals } = useServices();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Activos');

  const myServices = services.filter((s) => s.customerEmail === user.email);
  const activos    = myServices.filter((s) => s.status !== 'finalizado');
  const historial  = myServices.filter((s) => s.status === 'finalizado');
  const data       = activeTab === 'Activos' ? activos : historial;

  const renderItem = ({ item }) => {
    const professional = professionals.find((p) => p.id === item.professionalId);
    const statusConfig = STATUS_CONFIG[item.status] || { label: item.status, color: COLORS.textSecondary };
    const isFinished   = item.status === 'finalizado';

    return (
      <TouchableOpacity
        style={[common.card, isFinished && styles.cardFinished]}
        onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.proName, isFinished && styles.proNameFinished]}>
            {professional ? professional.name : 'Profesional'}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
            <Text style={styles.badgeText}>{statusConfig.label}</Text>
          </View>
        </View>
        <Text style={common.hintText}>{professional ? professional.category : ''}</Text>
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
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis servicios</Text>

      {/* Pestañas */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
              {tab === 'Activos' && activos.length > 0
                ? '  ' + activos.length : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{activeTab === 'Activos' ? '🔧' : '📋'}</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'Activos' ? 'Sin servicios activos' : 'Sin historial aún'}
            </Text>
            <Text style={common.emptyText}>
              {activeTab === 'Activos'
                ? 'Solicita un servicio desde la pestaña Inicio.'
                : 'Aquí aparecerán los servicios finalizados.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { color: COLORS.textSecondary, fontWeight: '500', fontSize: 14 },
  tabTextActive: { color: COLORS.textMain, fontWeight: '700' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  proName: { color: COLORS.textMain, fontWeight: '600', fontSize: 15, flex: 1 },
  proNameFinished: { color: COLORS.textSecondary },
  cardFinished: { opacity: 0.75 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  date: { color: COLORS.textSecondary, fontSize: 11, marginTop: 6 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 6 },
});