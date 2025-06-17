import { create } from 'zustand';
import { LocationWithTimestamp, Region, GeofenceStatus } from '../types/location';

interface LocationState {
  currentLocation: LocationWithTimestamp | null;
  mapRegion: Region | null;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  isLocationTracking: boolean;
  geofenceStatuses: GeofenceStatus[];
  
  setCurrentLocation: (location: LocationWithTimestamp) => void;
  setMapRegion: (region: Region) => void;
  setLocationPermission: (status: 'granted' | 'denied' | 'undetermined') => void;
  setIsLocationTracking: (isTracking: boolean) => void;
  updateGeofenceStatus: (status: GeofenceStatus) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  mapRegion: null,
  locationPermission: 'undetermined',
  isLocationTracking: false,
  geofenceStatuses: [],
  
  setCurrentLocation: (location) => {
    set({ currentLocation: location });
  },
  
  setMapRegion: (region) => {
    set({ mapRegion: region });
  },
  
  setLocationPermission: (status) => {
    set({ locationPermission: status });
  },
  
  setIsLocationTracking: (isTracking) => {
    set({ isLocationTracking: isTracking });
  },
  
  updateGeofenceStatus: (status) => {
    set((state) => ({
      geofenceStatuses: [
        ...state.geofenceStatuses.filter(s => s.appointmentId !== status.appointmentId),
        status
      ]
    }));
  },
}));