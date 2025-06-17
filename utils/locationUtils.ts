import * as Location from 'expo-location';
import { LocationWithTimestamp, Coordinates, GeofenceStatus } from '../types/location';
import { Appointment } from '../types/appointment';

// Calculate distance between two coordinates in meters
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  if (!point1 || !point2) return Infinity;

  const toRad = (value: number) => (value * Math.PI) / 180;
  
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRad(point1.latitude);
  const φ2 = toRad(point2.latitude);
  const Δφ = toRad(point2.latitude - point1.latitude);
  const Δλ = toRad(point2.longitude - point1.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Check if a point is inside a geofence
export const checkGeofenceStatus = (
  currentLocation: Coordinates,
  appointment: Appointment
): GeofenceStatus => {
  if (!currentLocation || !appointment) {
    return {
      appointmentId: appointment?.id || '',
      distance: Infinity,
      isInside: false,
      level: 'far',
    };
  }

  const distance = calculateDistance(currentLocation, appointment.location);
  const isInside = distance <= appointment.radius;
  
  // Determine the proximity level
  let level: 'far' | 'medium' | 'near' | 'inside' = 'far';
  
  if (isInside) {
    level = 'inside';
  } else if (distance <= appointment.radius * 1.5) {
    level = 'near';
  } else if (distance <= appointment.radius * 3) {
    level = 'medium';
  } else {
    level = 'far';
  }

  return {
    appointmentId: appointment.id,
    distance,
    isInside,
    level,
  };
};

// Request location permissions
export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    return backgroundStatus === 'granted';
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<LocationWithTimestamp | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Format location into a readable address
export const getAddressFromCoordinates = async (
  coordinates: Coordinates
): Promise<string | null> => {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
    
    if (address) {
      const components = [
        address.name,
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country,
      ].filter(Boolean);
      
      return components.join(', ');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting address:', error);
    return null;
  }
};