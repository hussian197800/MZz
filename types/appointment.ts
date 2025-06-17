export interface Appointment {
  id: string;
  title: string;
  notes?: string;
  date: string; // ISO string
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  radius: number; // Radius in meters
  isActive: boolean;
  color?: string;
  notificationLevels: {
    far: boolean; // Notification when far
    medium: boolean; // Notification when approaching
    near: boolean; // Notification when arriving
  };
}

export interface AppointmentFormData extends Omit<Appointment, 'id'> {}