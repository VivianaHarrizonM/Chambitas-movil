import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { COLORS, common } from '../../theme';

export default function MyServicesScreen({ navigation }) {
  const { jobs, deleteJob, user } = useAppContext();

  const myJobs = jobs.filter(j => j.authorId === user?.id);

  const handleDelete = (job) => {
    Alert.alert(
      'Eliminar chambita',
      `¿Seguro que deseas eliminar "${job.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteJob(job.id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {/* ── Info ── */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title || 'Sin título'}
          </Text>
          <Text style={styles.category}>
            {item.category || 'Sin categoría'}
          </Text>
          <Text style={common.hintText} numberOfLines={2}>
            {item.description || 'Sin descripción'}
          </Text>
        </View>

        {/* ── Botón eliminar ── */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* ── Footer con precio y área ── */}
      <View style={styles.cardFooter}>
        {item.price ? (
          <View style={styles.footerChip}>
            <Ionicons name="cash-outline" size={12} color={COLORS.primaryDark} />
            <Text style={styles.footerChipText}>${item.price} MXN</Text>
          </View>
        ) : null}
        {item.area ? (
          <View style={styles.footerChip}>
            <Ionicons name="location-outline" size={12} color={COLORS.primaryDark} />
            <Text style={styles.footerChipText}>{item.area}</Text>
          </View>
        ) : null}
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis chambitas publicadas</Text>

      <FlatList
        data={myJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Sin chambitas publicadas</Text>
            <Text style={common.emptyText}>
              Ve a la pestaña Publicar para agregar tu primer servicio.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  category: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerChipText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginLeft: 'auto',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 8,
  },
});