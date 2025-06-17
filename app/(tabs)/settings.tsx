import React from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, Linking, TouchableOpacity, Alert, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/UI/Card';
import { MapPin, Bell, AlertTriangle, Info, ExternalLink, Smartphone } from 'lucide-react-native';
import { useLocationStore } from '@/store/locationStore';
import { requestLocationPermissions } from '@/utils/locationUtils';
import { configureNotifications } from '@/utils/notificationUtils';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { locationPermission, setLocationPermission } = useLocationStore();
  
  const handleLocationPermission = async () => {
    const hasPermission = await requestLocationPermissions();
    setLocationPermission(hasPermission ? 'granted' : 'denied');
    
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location permission to notify you when you approach your appointment locations. Please enable it in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };
  
  const handleNotificationPermission = async () => {
    const hasPermission = await configureNotifications();
    
    if (!hasPermission) {
      Alert.alert(
        'Notification Permission Required',
        'This app needs notification permission to alert you about nearby appointments. Please enable it in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };
  
  const handleOpenSystemSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Permissions</Text>
      
      <Card style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MapPin size={20} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Location Services
              </Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Required for proximity notifications
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLocationPermission}>
            <Text
              style={[
                styles.permissionStatus,
                {
                  color:
                    locationPermission === 'granted'
                      ? colors.success
                      : colors.error,
                },
              ]}
            >
              {locationPermission === 'granted' ? 'Enabled' : 'Disabled'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Allow alerts when approaching locations
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleNotificationPermission}>
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Check
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
      
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Application</Text>
      
      <Card style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Smartphone size={20} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Open System Settings
              </Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Manage all app permissions
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleOpenSystemSettings}>
            <ExternalLink size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                App Version
              </Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Location Alarm 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </Card>
      
      <Card style={[styles.infoCard, { borderColor: colors.border }]}>
        <AlertTriangle size={20} color={colors.warning} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Background location tracking is required for this app to work properly. Please ensure
          location services and notifications are enabled.
        </Text>
      </Card>
      
      {Platform.OS === 'web' && (
        <Card style={[styles.infoCard, { borderColor: colors.error }]}>
          <AlertTriangle size={20} color={colors.error} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Some features like background location tracking and push notifications may not work
            properly on web. For the best experience, please use the native app.
          </Text>
        </Card>
      )}
    </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  card: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  permissionStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});