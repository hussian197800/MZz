import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import MapViewComponent from '@/components/Map/MapView';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function MapScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const handleAddAppointment = () => {
    router.push('/modals/create-appointment');
  };

  return (
    <View style={styles.container}>
      <MapViewComponent />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddAppointment}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    marginLeft: -28, // Half of width
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});