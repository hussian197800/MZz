import React from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { Appointment } from '../../types/appointment';
import { MapPin } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface AppointmentMarkerProps {
  appointment: Appointment;
  onPress?: () => void;
}

export default function AppointmentMarker({
  appointment,
  onPress,
}: AppointmentMarkerProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  // Don't render if appointment is not active
  if (!appointment.isActive) return null;
  
  const markerColor = appointment.color || colors.primary;

  return (
    <Marker
      coordinate={appointment.location}
      onPress={onPress}
      key={appointment.id}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        <MapPin
          size={24}
          color={markerColor}
          fill={markerColor}
          fillOpacity={0.2}
        />
        <View style={[styles.labelContainer, { backgroundColor: colors.card }]}>
          <Text
            style={[styles.labelText, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {appointment.title}
          </Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
});