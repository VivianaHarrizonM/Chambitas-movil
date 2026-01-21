import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function MyServicesScreen({ navigation }) {
  const { services, professionals } = useAppContext();

  const renderItem = ({ item }) => {
    const professional = professionals.find((p) => p.id === item.professionalId);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('ServiceInProgressFromList', { serviceId: item.id })
        }
      >
        <Text style={styles.title}>
          {professional ? professional.category : 'Servicio'} -{' '}
          {professional ? professional.name : ''}
        </Text>
        <Text style={styles.meta}>Estado: {item.status}</Text>
        <Text style={styles.metaSmall} numberOfLines={1}>
          {item.description || 'Sin descripción'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mis servicios</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Aún no has solicitado servicios. Empieza desde la pestaña "Inicio".
          </Text>
        }
      />
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 10,
  },
  title: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    color: '#9ca3af',
    fontSize: 12,
  },
  metaSmall: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 24,
  },
});
