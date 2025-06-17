import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useLocationStore } from '../../store/locationStore';
import { getCurrentLocation, requestLocationPermissions } from '../../utils/locationUtils';
import AppointmentMarker from './AppointmentMarker';
import GeofenceCircle from './GeofenceCircle';
import { useRouter } from 'expo-router';
import Layout from '../../constants/Layout';
import { Circle, MapIcon } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function MapViewComponent() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  
  const { appointments } = useAppointmentStore();
  const {
    currentLocation,
    mapRegion,
    setCurrentLocation,
    setMapRegion,
    locationPermission,
    setLocationPermission,
  } = useLocationStore();

  // Initialize map and location tracking
  useEffect(() => {
    const initializeMap = async () => {
      const hasPermission = await requestLocationPermissions();
      setLocationPermission(hasPermission ? 'granted' : 'denied');
      
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          
          // Set initial map region based on current location
          const initialRegion: Region = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          
          setMapRegion(initialRegion);
        }
      }
    };
    
    initializeMap();
  }, []);

  // Handle appointment marker press
  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/appointments/${appointmentId}`);
  };

  // Handle map region change
  const handleRegionChange = (region: Region) => {
    setMapRegion(region);
  };

  // Center map on current location
  const centerOnCurrentLocation = async () => {
    if (locationPermission !== 'granted') {
      const hasPermission = await requestLocationPermissions();
      setLocationPermission(hasPermission ? 'granted' : 'denied');
      
      if (!hasPermission) return;
    }
    
    const location = await getCurrentLocation();
    if (location && mapRef.current) {
      setCurrentLocation(location);
      
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={mapRegion || Layout.defaultMapRegion}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onMapReady={() => setIsMapReady(true)}
      >
        {isMapReady && appointments.map(appointment => (
          <React.Fragment key={appointment.id}>
            <AppointmentMarker
              appointment={appointment}
              onPress={() => handleAppointmentPress(appointment.id)}
            />
            <GeofenceCircle
              center={appointment.location}
              radius={appointment.radius}
              appointmentId={appointment.id}
              color={appointment.color}
              active={appointment.isActive}
            />
          </React.Fragment>
        ))}
        
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.currentLocationMarker}>
              <Circle size={12} fill={colors.primary} color={colors.primary} />
            </View>
          </Marker>
        )}
      </MapView>
      
      {/* Center on current location button */}
      <View
        style={[
          styles.currentLocationButton,
          { backgroundColor: colors.card }
        ]}
      >
        <MapIcon
          size={24}
          color={colors.primary}
          onPress={centerOnCurrentLocation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 120, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});