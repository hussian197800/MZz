import { create } from 'zustand';
import { Appointment } from '../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  toggleAppointmentActive: (id: string) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  
  addAppointment: (appointment) => {
    set((state) => ({
      appointments: [...state.appointments, appointment]
    }));
  },
  
  updateAppointment: (id, updatedAppointment) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) => 
        appointment.id === id 
          ? { ...appointment, ...updatedAppointment } 
          : appointment
      )
    }));
  },
  
  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id)
    }));
  },
  
  toggleAppointmentActive: (id) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) => 
        appointment.id === id 
          ? { ...appointment, isActive: !appointment.isActive } 
          : appointment
      )
    }));
  },
  
  getAppointmentById: (id) => {
    return get().appointments.find((appointment) => appointment.id === id);
  },
}));