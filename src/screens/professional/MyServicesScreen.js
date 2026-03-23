import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useJobs } from '../../context/JobsContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, common } from '../../theme';

export default function MyServicesScreen() {
  const { jobs, deleteJob } = useJobs();
  const { user } = useAuth();

  const myJobs = jobs.filter((j) => j.authorEmail === user.email);

  const handleDelete = (job) => {
    Alert.alert(
      'Eliminar chambita',
      '¿Seguro que deseas eliminar "' + job.title + '"? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteJob(job.id) },
      ]
    );
  };

  return (
    <View style={common.screen}>
      <Text style={common.heading}>Mis chambitas publicadas</Text>
      <FlatList
        data={myJobs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={common.emptyText}>
            Aún no has publicado chambitas. Ve a la pestaña Publicar para agregar una.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[common.card, styles.cardRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title || 'Sin título'}</Text>
              <Text style={common.hintText}>{item.category || 'Sin categoría'}</Text>
              <Text style={[common.hintText, { marginTop: 2 }]} numberOfLines={2}>
                {item.description || 'Sin descripción'}
              </Text>
              {item.price ? <Text style={styles.price}>${item.price} MXN</Text> : null}
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  price: { color: COLORS.primaryDark, fontWeight: '600', marginTop: 4, fontSize: 13 },
  deleteButton: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 999, borderWidth: 1,
    borderColor: COLORS.error, marginLeft: 8,
  },
  deleteText: { color: COLORS.error, fontSize: 12 },
});