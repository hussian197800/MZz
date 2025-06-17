import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import AppointmentForm from '@/components/Appointments/AppointmentForm';
import { AppointmentFormData } from '@/types/appointment';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CreateAppointmentScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { addAppointment } = useAppointmentStore();
  const params = useLocalSearchParams<{ formData?: string, updatedLocation?: string }>();
  
  const [initialFormData, setInitialFormData] = useState<AppointmentFormData | null>(null);
  
  // Parse form data from params if available
  useEffect(() => {
    if (params.formData) {
      try {
        const parsedData = JSON.parse(params.formData as string);
        setInitialFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
  }, [params.formData]);
  
  // Update form data if location is updated
  useEffect(() => {
    if (params.updatedLocation && initialFormData) {
      try {
        const updatedLocation = JSON.parse(params.updatedLocation as string);
        setInitialFormData({
          ...initialFormData,
          location: updatedLocation,
        });
      } catch (error) {
        console.error('Error parsing updated location:', error);
      }
    }
  }, [params.updatedLocation]);
  
  const handleCreateAppointment = (formData: AppointmentFormData) => {
    // Generate a unique ID
    const id = Date.now().toString();
    
    // Add appointment to store
    addAppointment({
      id,
      ...formData,
    });
    
    // Navigate back to appointments screen
    router.push('/appointments');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppointmentForm 
        onSubmit={handleCreateAppointment}
        initialData={initialFormData || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});