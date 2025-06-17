import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { GeofenceStatus } from '../types/location';
import { Appointment } from '../types/appointment';

// Configure notifications
export const configureNotifications = async (): Promise<boolean> => {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    // Configure how notifications appear when app is in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

// Send proximity notification based on geofence status
export const sendProximityNotification = async (
  appointment: Appointment,
  geofenceStatus: GeofenceStatus
): Promise<void> => {
  if (!appointment || !geofenceStatus) return;

  // Check if notification should be sent based on user preferences
  let shouldNotify = false;
  let message = '';

  if (geofenceStatus.level === 'inside' && appointment.notificationLevels.near) {
    shouldNotify = true;
    message = `You've arrived at "${appointment.title}"`;
  } else if (geofenceStatus.level === 'near' && appointment.notificationLevels.near) {
    shouldNotify = true;
    message = `You're approaching "${appointment.title}" (${Math.round(geofenceStatus.distance)}m away)`;
  } else if (geofenceStatus.level === 'medium' && appointment.notificationLevels.medium) {
    shouldNotify = true;
    message = `You're getting close to "${appointment.title}" (${Math.round(geofenceStatus.distance)}m away)`;
  } else if (geofenceStatus.level === 'far' && appointment.notificationLevels.far) {
    shouldNotify = true;
    message = `You're heading toward "${appointment.title}" (${Math.round(geofenceStatus.distance)}m away)`;
  }

  if (shouldNotify) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Location Reminder',
        body: message,
        data: { appointmentId: appointment.id },
      },
      trigger: null, // Send immediately
    });
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Listen for notification interaction
export const addNotificationResponseReceivedListener = (
  callback: (response: Notifications.NotificationResponse) => void
): (() => void) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(callback);
  return () => subscription.remove();
};