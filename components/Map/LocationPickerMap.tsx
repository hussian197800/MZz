import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { Coordinates } from '@/types/location';
import { MapPin, Navigation } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { getCurrentLocation } from '@/utils/locationUtils';

interface LocationPickerMapProps {
  initialLocation?: Coordinates;
  onLocationSelect: (location: Coordinates) => void;
}

export default function LocationPickerMap({
  initialLocation,
  onLocationSelect,
}: LocationPickerMapProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const mapRef = useRef<MapView>(null);
  
  // Map state
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 37.78825,
    longitude: initialLocation?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    initialLocation || null
  );
  
  // Initialize map with initial location or current location
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setRegion({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      // Try to get current location
      getCurrentLocation().then((location) => {
        if (location) {
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      });
    }
  }, [initialLocation]);
  
  // Handle map press to select location
  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    const newLocation = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };
  
  // Center map on current location
  const centerOnCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          >
            <MapPin size={32} color={colors.primary} />
          </Marker>
        )}
      </MapView>
      
      {/* Center on current location button */}
      <TouchableOpacity
        style={[
          styles.currentLocationButton,
          { backgroundColor: colors.card }
        ]}
        onPress={centerOnCurrentLocation}
      >
        <Navigation size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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