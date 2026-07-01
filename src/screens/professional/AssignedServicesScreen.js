import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
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

const TABS = ['Pendientes', 'Activos', 'Historial'];

function formatSchedule(item) {
  if (item.whenType === 'programado' && item.date) {
    return `${item.date}${item.time ? ' a las ' + item.time : ''}`;
  }
  return 'Lo antes posible';
}

export default function AssignedServicesScreen({ navigation }) {
  const {
    assignedServices = [],
    acceptService,
    rejectService,
    updateServiceStatus,
    refreshAssignedServices,
  } = useAppContext();

  const [activeTab, setActiveTab]   = useState('Pendientes');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingId, setLoadingId]   = useState(null);

  const pendientes = assignedServices.filter(s => s.status === 'pendiente');
  const activos    = assignedServices.filter(s => s.status === 'en_camino' || s.status === 'en_servicio');
  const historial  = assignedServices.filter(s => s.status === 'finalizado' || s.status === 'rechazado');

  const data = activeTab === 'Pendientes' ? pendientes
             : activeTab === 'Activos'    ? activos
             : historial;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAssignedServices();
    setRefreshing(false);
  };

  const handleAccept = (service) => {
    Alert.alert(
      'Aceptar solicitud',
      `¿Aceptas el servicio de ${service.clientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            setLoadingId(service.id);
            await acceptService(service.id);
            setLoadingId(null);
          },
        },
      ]
    );
  };

  const handleReject = (service) => {
    Alert.alert(
      'Rechazar solicitud',
      `¿Rechazas el servicio de ${service.clientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            setLoadingId(service.id);
            await rejectService(service.id);
            setLoadingId(null);
          },
        },
      ]
    );
  };

  const handleAdvance = (service) => {
    const nextStatus = service.status === 'en_camino' ? 'en_servicio' : 'finalizado';
    const label      = service.status === 'en_camino' ? 'en servicio' : 'finalizado';
    Alert.alert(
      'Actualizar estado',
      `¿Marcar este servicio como "${label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setLoadingId(service.id);
            await updateServiceStatus(service.id, nextStatus);
            setLoadingId(null);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pendiente;
    const isLoading    = loadingId === item.id;
    const isPending    = item.status === 'pendiente';
    const isActive     = item.status === 'en_camino' || item.status === 'en_servicio';

    return (
      <View style={styles.card}>
        {/* ── Header ── */}
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <View style={styles.clientAvatar}>
              <Text style={styles.clientAvatarText}>
                {item.clientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString('es-MX', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
            <Ionicons name={statusConfig.icon} size={11} color="#fff" style={{ marginRight: 3 }} />
            <Text style={styles.badgeText}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* ── Descripción ── */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'Sin descripción'}
        </Text>

        {/* ── Cuándo ── */}
        <View style={styles.infoRow}>
          <Ionicons
            name={item.whenType === 'programado' ? 'calendar-outline' : 'flash-outline'}
            size={13}
            color={COLORS.primaryDark}
          />
          <Text style={[styles.infoText, { color: COLORS.primaryDark, fontWeight: '500' }]}>
            {formatSchedule(item)}
          </Text>
        </View>

        {/* ── Dirección ── */}
        {item.address ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
          </View>
        ) : null}

        {/* ── Teléfono del cliente ── */}
        {item.clientPhone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{item.clientPhone}</Text>
          </View>
        ) : null}

        {/* ── Acciones pendiente ── */}
        {isPending && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.rejectButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleReject(item)}
              disabled={isLoading}
            >
              <Ionicons name="close" size={16} color={COLORS.error} />
              <Text style={styles.rejectText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.acceptButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleAccept(item)}
              disabled={isLoading}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.acceptText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Acciones activo ── */}
        {isActive && (
          <TouchableOpacity
            style={[styles.advanceButton, isLoading && styles.buttonDisabled]}
            onPress={() => handleAdvance(item)}
            disabled={isLoading}
          >
            <Text style={styles.advanceText}>
              {item.status === 'en_camino'
                ? 'Marcar como "En servicio"'
                : 'Marcar como "Finalizado"'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const emptyConfig = {
    Pendientes: { icon: '📬', title: 'Sin solicitudes pendientes', text: 'Cuando un cliente te solicite un servicio aparecerá aquí.' },
    Activos:    { icon: '🔧', title: 'Sin servicios activos',      text: 'Los servicios que aceptes aparecerán aquí.' },
    Historial:  { icon: '📋', title: 'Sin historial aún',          text: 'Aquí verás los servicios finalizados y rechazados.' },
  };

  const empty = emptyConfig[activeTab];

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis solicitudes</Text>

      {/* ── Tabs ── */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const count = tab === 'Pendientes' ? pendientes.length
                      : tab === 'Activos'    ? activos.length
                      : historial.length;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}{count > 0 ? ` ${count}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Lista ── */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{empty.icon}</Text>
            <Text style={styles.emptyTitle}>{empty.title}</Text>
            <Text style={common.emptyText}>{empty.text}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow:       { flexDirection: 'row', marginBottom: 16, borderRadius: 12, backgroundColor: COLORS.inputBg, padding: 4 },
  tab:           { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive:     { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText:       { color: COLORS.textSecondary, fontWeight: '500', fontSize: 13 },
  tabTextActive: { color: COLORS.textMain, fontWeight: '700' },
  card:          { backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 10 },
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  clientInfo:       { flexDirection: 'row', alignItems: 'center', flex: 1 },
  clientAvatar:     { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  clientAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  clientName:       { color: COLORS.textMain, fontWeight: '600', fontSize: 14 },
  cardDate:         { color: COLORS.textSecondary, fontSize: 11, marginTop: 1 },
  badge:         { flexDirection: 'row', alignItems: 'center', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:     { color: '#fff', fontSize: 11, fontWeight: '600' },
  description:   { color: COLORS.textSecondary, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText:      { color: COLORS.textSecondary, fontSize: 12, marginLeft: 5, flex: 1 },
  actionsRow:    { flexDirection: 'row', gap: 8, marginTop: 12 },
  rejectButton:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.error, gap: 4 },
  rejectText:    { color: COLORS.error, fontWeight: '600', fontSize: 13 },
  acceptButton:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#22c55e', gap: 4 },
  acceptText:    { color: '#fff', fontWeight: '600', fontSize: 13 },
  advanceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  advanceText:   { color: COLORS.primaryDark, fontWeight: '600', fontSize: 13 },
  buttonDisabled:{ opacity: 0.6 },
  emptyContainer:{ alignItems: 'center', marginTop: 48 },
  emptyIcon:     { fontSize: 40, marginBottom: 12 },
  emptyTitle:    { fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 8 },
});