import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { MapPin, Check, Search, Navigation, XCircle } from 'lucide-react-native';
import { getCurrentLocation, getAddressFromCoordinates } from '@/utils/locationUtils';
import { AppointmentFormData } from '@/types/appointment';
import Button from '@/components/UI/Button';
import * as Location from 'expo-location';
import Card from '@/components/UI/Card';

export default function LocationPickerScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ formData: string }>();
  
  // Parse form data from params
  const formData: AppointmentFormData | null = params.formData 
    ? JSON.parse(params.formData as string) 
    : null;
  
  // Map refs and state
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: formData?.location?.latitude || 37.78825,
    longitude: formData?.location?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState(formData?.location || null);
  const [address, setAddress] = useState<string | null>(formData?.location?.address || null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Initialize map with current location
  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      
      try {
        // If we already have a selected location, use that
        if (formData?.location?.latitude && formData?.location?.longitude) {
          setSelectedLocation(formData.location);
          setRegion({
            latitude: formData.location.latitude,
            longitude: formData.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setIsLoading(false);
          return;
        }
        
        // Otherwise, try to get current location
        const location = await getCurrentLocation();
        if (location) {
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeMap();
  }, []);
  
  // Handle map press to select location
  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    
    // Get address for the selected location
    try {
      const locationAddress = await getAddressFromCoordinates(coordinate);
      setAddress(locationAddress);
      
      setSelectedLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: locationAddress || undefined,
      });
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };
  
  // Return to form with selected location
  const handleConfirmLocation = () => {
    if (!selectedLocation) return;
    
    // Update form data with selected location
    const updatedFormData: AppointmentFormData = {
      ...formData!,
      location: selectedLocation,
    };
    
    // Navigate back to previous screen with updated form data
    if (params.formData) {
      // If editing, go back to edit screen
      router.back();
      
      // Pass location back to form
      if (router.canGoBack()) {
        router.setParams({ updatedLocation: JSON.stringify(selectedLocation) });
      }
    } else {
      // If creating new appointment
      router.push({
        pathname: '/modals/create-appointment',
        params: { formData: JSON.stringify(updatedFormData) },
      });
    }
  };
  
  // Center map on current location
  const centerOnCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      const location = await getCurrentLocation();
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search for locations
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const locations = await Location.geocodeAsync(searchQuery);
      
      if (locations && locations.length > 0) {
        const firstResult = locations[0];
        
        // Update map region
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        
        // Set selected location
        setSelectedLocation({
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
          address: searchQuery,
        });
        
        setAddress(searchQuery);
      } else {
        // No results found
        alert('No locations found for this search query.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <Card style={styles.searchBarCard}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.tabIconDefault} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for a location"
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <XCircle size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          )}
        </View>
      </Card>
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loadingIndicator}
          />
        ) : (
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
                pinColor={colors.primary}
              >
                <MapPin size={36} color={colors.primary} />
              </Marker>
            )}
          </MapView>
        )}
        
        {/* Location Button */}
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
      
      {/* Bottom Sheet with Location Info */}
      <Card style={styles.bottomSheet}>
        <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>
          {selectedLocation ? 'Selected Location' : 'Select a Location'}
        </Text>
        
        {selectedLocation ? (
          <>
            <Text style={[styles.address, { color: colors.text }]}>
              {address || 'Unknown Address'}
            </Text>
            <Text style={[styles.coordinates, { color: colors.tabIconDefault }]}>
              {`${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)}`}
            </Text>
            <Button
              title="Use This Location"
              onPress={handleConfirmLocation}
              variant="primary"
              icon={<Check size={18} color="#FFFFFF" />}
              style={styles.confirmButton}
            />
          </>
        ) : (
          <Text style={[styles.instructions, { color: colors.tabIconDefault }]}>
            Tap anywhere on the map to select a location for your appointment reminder.
          </Text>
        )}
      </Card>
      
      {/* Loading overlay */}
      {isSearching && (
        <View style={[styles.loadingOverlay, { backgroundColor: `${colors.background}99` }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Searching...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarCard: {
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 8 : 16,
    padding: 0,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    height: 40,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 100,
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
  bottomSheet: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 22,
  },
  confirmButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});