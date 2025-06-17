import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppointmentStore } from '@/store/appointmentStore';
import AppointmentForm from '@/components/Appointments/AppointmentForm';
import { AppointmentFormData } from '@/types/appointment';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';
import { getReadableDateTime } from '@/utils/dateUtils';
import { MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react-native';

export default function AppointmentDetailsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { getAppointmentById, updateAppointment, deleteAppointment } = useAppointmentStore();
  const [appointment, setAppointment] = useState(getAppointmentById(id));
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Refresh appointment data when it changes
    setAppointment(getAppointmentById(id));
  }, [id, getAppointmentById]);
  
  // Handle if appointment not found
  if (!appointment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card style={styles.notFoundCard}>
          <AlertTriangle size={48} color={colors.warning} style={styles.notFoundIcon} />
          <Text style={[styles.notFoundTitle, { color: colors.text }]}>
            Appointment Not Found
          </Text>
          <Text style={[styles.notFoundText, { color: colors.tabIconDefault }]}>
            The appointment you're looking for doesn't exist or has been deleted.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            style={styles.notFoundButton}
          />
        </Card>
      </View>
    );
  }
  
  const handleUpdateAppointment = (formData: AppointmentFormData) => {
    updateAppointment(id, formData);
    setIsEditing(false);
  };
  
  const handleDeleteAppointment = () => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAppointment(id);
            router.replace('/appointments');
          },
        },
      ]
    );
  };
  
  const appointmentDate = new Date(appointment.date);

  // Render appointment details if not editing
  if (!isEditing) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={[styles.title, { color: colors.text }]}>
              {appointment.title}
            </Text>
            <View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor: appointment.isActive
                    ? colors.success
                    : colors.tabIconDefault,
                },
              ]}
            />
          </View>
          
          {appointment.notes && (
            <Text style={[styles.notes, { color: colors.text }]}>
              {appointment.notes}
            </Text>
          )}
          
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Calendar size={20} color={colors.tabIconDefault} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {getReadableDateTime(appointmentDate)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={20} color={colors.tabIconDefault} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {appointment.location.address || 'Custom location'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={20} color={colors.tabIconDefault} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {appointment.radius >= 1000
                  ? `${(appointment.radius / 1000).toFixed(1)} km reminder radius`
                  : `${appointment.radius} m reminder radius`}
              </Text>
            </View>
          </View>
          
          <View style={styles.notificationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Notification Levels
            </Text>
            
            <View style={styles.notificationList}>
              <View style={styles.notificationItem}>
                <View
                  style={[
                    styles.notificationDot,
                    {
                      backgroundColor: appointment.notificationLevels.far
                        ? Colors.radius.far
                        : colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.notificationText,
                    { color: colors.text },
                    !appointment.notificationLevels.far && styles.disabledText,
                  ]}
                >
                  Far (Early Warning)
                </Text>
              </View>
              
              <View style={styles.notificationItem}>
                <View
                  style={[
                    styles.notificationDot,
                    {
                      backgroundColor: appointment.notificationLevels.medium
                        ? Colors.radius.medium
                        : colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.notificationText,
                    { color: colors.text },
                    !appointment.notificationLevels.medium && styles.disabledText,
                  ]}
                >
                  Medium (Approaching)
                </Text>
              </View>
              
              <View style={styles.notificationItem}>
                <View
                  style={[
                    styles.notificationDot,
                    {
                      backgroundColor: appointment.notificationLevels.near
                        ? Colors.radius.near
                        : colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.notificationText,
                    { color: colors.text },
                    !appointment.notificationLevels.near && styles.disabledText,
                  ]}
                >
                  Near (Arriving)
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        <View style={styles.buttonGroup}>
          <Button
            title="Edit"
            onPress={() => setIsEditing(true)}
            variant="primary"
            style={styles.editButton}
          />
          <Button
            title="Delete"
            onPress={handleDeleteAppointment}
            variant="danger"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    );
  }

  // Render edit form
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppointmentForm
        initialData={appointment}
        onSubmit={handleUpdateAppointment}
        isEditing={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  detailsCard: {
    padding: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  notes: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  notificationSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  notificationList: {
    gap: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
  notFoundCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  notFoundIcon: {
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  notFoundButton: {
    minWidth: 150,
  },
});