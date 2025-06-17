import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useAppointmentStore } from '@/store/appointmentStore';
import AppointmentCard from '@/components/Appointments/AppointmentCard';
import { Plus, CalendarX2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/UI/Button';

export default function AppointmentsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { appointments } = useAppointmentStore();
  const [showInactive, setShowInactive] = useState(false);
  
  const filteredAppointments = showInactive
    ? appointments
    : appointments.filter(appointment => appointment.isActive);
  
  const handleAddAppointment = () => {
    router.push('/modals/create-appointment');
  };
  
  const toggleShowInactive = () => {
    setShowInactive(!showInactive);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <CalendarX2 size={64} color={colors.tabIconDefault} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No appointments yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
        Create your first appointment to get started with location-based reminders.
      </Text>
      <Button
        title="Create Appointment"
        onPress={handleAddAppointment}
        variant="primary"
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Your Appointments
        </Text>
        
        {appointments.length > 0 && (
          <TouchableOpacity onPress={toggleShowInactive}>
            <Text style={[styles.filterText, { color: colors.primary }]}>
              {showInactive ? 'Hide Inactive' : 'Show All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {appointments.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handleAddAppointment}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    marginTop: 16,
  },
});