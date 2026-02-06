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

const COLORS = {
    primary: '#F4A300',      
    primaryDark: '#D88900',
    blue: '#2F80ED',        
    background: '#F5F5F5',
    inputBg: '#fabb8031',
    textMain: '#4F4F4F',
    textSecondary: '#8A8A8A',
    border: '#f1710731',
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  heading: {
    color: COLORS.textMain,   
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    color: COLORS.textMain,   
    fontSize: 12,
  },
  metaSmall: {
    color: COLORS.textSecondary, 
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    color: COLORS.textSecondary, 
    textAlign: 'center',
    marginTop: 24,
  },
});

