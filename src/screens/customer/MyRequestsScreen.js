import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

const STATUS_CONFIG = {
  pendiente:   { label: 'Pendiente',   color: '#f59e0b' },
  en_camino:   { label: 'En camino',   color: COLORS.blueLight },
  en_servicio: { label: 'En servicio', color: COLORS.primaryDark },
  finalizado:  { label: 'Finalizado',  color: '#22c55e' },
  rechazado:   { label: 'Rechazado',   color: COLORS.error },
};

const TABS = ['Activos', 'Historial'];

function formatSchedule(item) {
  if (item.whenType === 'programado' && item.date) {
    return `📅 ${item.date}${item.time ? ' · ' + item.time : ''}`;
  }
  return '⚡ Lo antes posible';
}

export default function MyRequestsScreen({ navigation }) {
  const { services, professionals, refreshServices } = useAppContext();
  const [activeTab, setActiveTab] = useState('Activos');
  const [refreshing, setRefreshing] = useState(false);

  const activos   = services.filter(s => s.status !== 'finalizado' && s.status !== 'rechazado');
  const historial = services.filter(s => s.status === 'finalizado' || s.status === 'rechazado');
  const data      = activeTab === 'Activos' ? activos : historial;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshServices();
    setRefreshing(false);
  }, [refreshServices]);

  const renderItem = ({ item }) => {
    const professional = professionals.find(p => p.id === item.professionalId);
    const proName      = professional?.name     || item.professionalName     || 'Profesional';
    const proCategory  = professional?.category || item.professionalCategory || '';
    const statusConfig = STATUS_CONFIG[item.status] || { label: item.status, color: COLORS.textSecondary };
    const isFinished   = item.status === 'finalizado' || item.status === 'rechazado';

    return (
      <TouchableOpacity
        style={[common.card, isFinished && styles.cardFinished]}
        onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
        activeOpacity={0.7}
      >
        {/* ── Header ── */}
        <View style={styles.cardHeader}>
          <Text style={[styles.proName, isFinished && styles.proNameFinished]} numberOfLines={1}>
            {proName}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
            <Text style={styles.badgeText}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* ── Categoría ── */}
        {proCategory ? <Text style={common.hintText}>{proCategory}</Text> : null}

        {/* ── Descripción ── */}
        <Text style={[common.hintText, { marginTop: 4 }]} numberOfLines={1}>
          {item.description}
        </Text>

        {/* ── Cuándo ── */}
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleText}>{formatSchedule(item)}</Text>
        </View>

        {/* ── Fecha de solicitud ── */}
        <View style={styles.dateRow}>
          <Ionicons name="time-outline" size={11} color={COLORS.textSecondary} />
          <Text style={styles.date}>
            Solicitado el {new Date(item.createdAt).toLocaleDateString('es-MX', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis servicios</Text>

      {/* ── Tabs ── */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}{tab === 'Activos' && activos.length > 0 ? `  ${activos.length}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{activeTab === 'Activos' ? '🔧' : '📋'}</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'Activos' ? 'Sin servicios activos' : 'Sin historial aún'}
            </Text>
            <Text style={common.emptyText}>
              {activeTab === 'Activos'
                ? 'Solicita un servicio desde la pestaña Inicio.'
                : 'Aquí aparecerán los servicios finalizados y rechazados.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow:        { flexDirection: 'row', marginBottom: 16, borderRadius: 12, backgroundColor: COLORS.inputBg, padding: 4 },
  tab:            { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive:      { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText:        { color: COLORS.textSecondary, fontWeight: '500', fontSize: 14 },
  tabTextActive:  { color: COLORS.textMain, fontWeight: '700' },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  proName:        { color: COLORS.textMain, fontWeight: '600', fontSize: 15, flex: 1 },
  proNameFinished:{ color: COLORS.textSecondary },
  cardFinished:   { opacity: 0.75 },
  badge:          { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 },
  badgeText:      { color: '#fff', fontSize: 11, fontWeight: '600' },
  scheduleRow:    { marginTop: 6 },
  scheduleText:   { fontSize: 12, color: COLORS.primaryDark, fontWeight: '500' },
  dateRow:        { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  date:           { color: COLORS.textSecondary, fontSize: 11 },
  empty:          { alignItems: 'center', marginTop: 40 },
  emptyIcon:      { fontSize: 40, marginBottom: 10 },
  emptyTitle:     { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 6 },
});