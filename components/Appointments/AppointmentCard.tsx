import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Appointment } from '../../types/appointment';
import Card from '../UI/Card';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { MapPin, Clock, Calendar, Edit, Toggle } from 'lucide-react-native';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { useRouter } from 'expo-router';
import { useAppointmentStore } from '../../store/appointmentStore';

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { toggleAppointmentActive } = useAppointmentStore();
  
  const handlePress = () => {
    router.push(`/appointments/${appointment.id}`);
  };
  
  const handleToggle = () => {
    toggleAppointmentActive(appointment.id);
  };
  
  const appointmentDate = new Date(appointment.date);
  const cardColor = appointment.color || colors.primary;
  const isActive = appointment.isActive;

  return (
    <Card
      style={[
        styles.card,
        { borderLeftColor: cardColor, borderLeftWidth: 4 },
        !isActive && styles.inactiveCard,
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              !isActive && styles.inactiveText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {appointment.title}
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleToggle}
              style={styles.actionButton}
            >
              <Toggle
                size={20}
                color={isActive ? colors.success : colors.tabIconDefault}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handlePress}
              style={styles.actionButton}
            >
              <Edit size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={colors.tabIconDefault} />
            <Text
              style={[
                styles.detailText,
                { color: colors.text },
                !isActive && styles.inactiveText,
              ]}
            >
              {formatDate(appointmentDate)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={16} color={colors.tabIconDefault} />
            <Text
              style={[
                styles.detailText,
                { color: colors.text },
                !isActive && styles.inactiveText,
              ]}
            >
              {formatTime(appointmentDate)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={16} color={colors.tabIconDefault} />
            <Text
              style={[
                styles.detailText,
                { color: colors.text },
                !isActive && styles.inactiveText,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {appointment.location.address || 'Custom location'}
            </Text>
          </View>
        </View>
        
        <View style={styles.notificationSettings}>
          <View
            style={[
              styles.notificationIndicator,
              {
                backgroundColor: appointment.notificationLevels.far
                  ? Colors.radius.far
                  : colors.border,
              },
            ]}
          />
          <View
            style={[
              styles.notificationIndicator,
              {
                backgroundColor: appointment.notificationLevels.medium
                  ? Colors.radius.medium
                  : colors.border,
              },
            ]}
          />
          <View
            style={[
              styles.notificationIndicator,
              {
                backgroundColor: appointment.notificationLevels.near
                  ? Colors.radius.near
                  : colors.border,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  inactiveCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  inactiveText: {
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
  },
  details: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  notificationSettings: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  notificationIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});