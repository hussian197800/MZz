export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationWithTimestamp extends Coordinates {
  timestamp: number;
}

export interface GeofenceStatus {
  appointmentId: string;
  distance: number;
  isInside: boolean;
  level: 'far' | 'medium' | 'near' | 'inside';
}