import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { MapPin, Calendar, Clock, AlertCircle, Info } from 'lucide-react-native';
import { AppointmentFormData } from '../../types/appointment';
import RadiusSlider from './RadiusSlider';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AppointmentFormProps {
  initialData?: AppointmentFormData;
  onSubmit: (data: AppointmentFormData) => void;
  isEditing?: boolean;
}

export default function AppointmentForm({
  initialData,
  onSubmit,
  isEditing = false,
}: AppointmentFormProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ updatedLocation?: string }>();
  
  // Set default form data
  const defaultData: AppointmentFormData = {
    title: '',
    notes: '',
    date: new Date().toISOString(),
    location: {
      latitude: 0,
      longitude: 0,
    },
    radius: Layout.radiusPresets.medium,
    isActive: true,
    notificationLevels: {
      far: false,
      medium: true,
      near: true,
    },
  };
  
  // Form state
  const [formData, setFormData] = useState<AppointmentFormData>(
    initialData || defaultData
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [dateTimeValue, setDateTimeValue] = useState(
    initialData ? new Date(initialData.date) : new Date()
  );
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setDateTimeValue(new Date(initialData.date));
    }
  }, [initialData]);
  
  // Update form data if location is updated from the location picker modal
  useEffect(() => {
    if (params.updatedLocation) {
      try {
        const location = JSON.parse(params.updatedLocation as string);
        setFormData(prevData => ({
          ...prevData,
          location,
        }));
      } catch (error) {
        console.error('Error parsing updated location:', error);
      }
    }
  }, [params.updatedLocation]);
  
  // Form handlers
  const handleInputChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleNotificationLevelChange = (level: 'far' | 'medium' | 'near', value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notificationLevels: {
        ...prev.notificationLevels,
        [level]: value,
      },
    }));
  };
  
  const handleLocationSelect = () => {
    // Save current form data to return to later
    router.push({
      pathname: '/modals/location-picker',
      params: {
        formData: JSON.stringify(formData),
      },
    });
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerOpen(Platform.OS === 'ios');
    
    if (selectedDate) {
      const newDateTime = new Date(dateTimeValue);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      
      setDateTimeValue(newDateTime);
      handleInputChange('date', newDateTime.toISOString());
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerOpen(Platform.OS === 'ios');
    
    if (selectedTime) {
      const newDateTime = new Date(dateTimeValue);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      
      setDateTimeValue(newDateTime);
      handleInputChange('date', newDateTime.toISOString());
    }
  };
  
  const handleSubmit = () => {
    // Validate form data
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for your appointment');
      return;
    }
    
    if (formData.location.latitude === 0 && formData.location.longitude === 0) {
      Alert.alert('Validation Error', 'Please select a location for your appointment');
      return;
    }
    
    // Validate that at least one notification level is enabled
    const hasNotifications = Object.values(formData.notificationLevels).some(level => level);
    if (!hasNotifications) {
      Alert.alert(
        'No Notifications Enabled', 
        'You have disabled all notification levels. Do you want to continue without any notifications?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => onSubmit(formData),
          }
        ]
      );
      return;
    }
    
    onSubmit(formData);
  };
  
  const hasLocation = formData.location.latitude !== 0 || formData.location.longitude !== 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
          placeholder="Enter appointment title"
          placeholderTextColor={colors.tabIconDefault}
        />
      </View>

      {/* Notes */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          value={formData.notes}
          onChangeText={(text) => handleInputChange('notes', text)}
          placeholder="Add additional notes"
          placeholderTextColor={colors.tabIconDefault}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Date and Time */}
      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Date</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.pickerInput,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => setDatePickerOpen(true)}
          >
            <Calendar size={18} color={colors.primary} />
            <Text style={[styles.pickerText, { color: colors.text }]}>
              {formatDate(dateTimeValue)}
            </Text>
          </TouchableOpacity>
          
          {datePickerOpen && (
            <DateTimePicker
              value={dateTimeValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Time</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.pickerInput,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => setTimePickerOpen(true)}
          >
            <Clock size={18} color={colors.primary} />
            <Text style={[styles.pickerText, { color: colors.text }]}>
              {formatTime(dateTimeValue)}
            </Text>
          </TouchableOpacity>
          
          {timePickerOpen && (
            <DateTimePicker
              value={dateTimeValue}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>
      </View>

      {/* Location */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.pickerInput,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleLocationSelect}
        >
          <MapPin size={18} color={hasLocation ? colors.primary : colors.tabIconDefault} />
          <Text
            style={[
              styles.pickerText,
              {
                color: hasLocation ? colors.text : colors.tabIconDefault,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {hasLocation
              ? formData.location.address || 'Selected location'
              : 'Select location on map'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Radius Slider */}
      {hasLocation && (
        <Card style={styles.radiusCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reminder Distance
          </Text>
          
          <RadiusSlider
            value={formData.radius}
            onValueChange={(value) => handleInputChange('radius', value)}
          />
          
          <View style={styles.radiusInfo}>
            <Info size={16} color={colors.tabIconDefault} />
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              You'll receive notifications when you enter within this distance of your appointment.
            </Text>
          </View>
        </Card>
      )}

      {/* Notification Settings */}
      <Card style={styles.notificationCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notification Settings
        </Text>
        
        <View style={styles.notificationOption}>
          <View style={styles.notificationInfo}>
            <View
              style={[
                styles.notificationIndicator,
                { backgroundColor: Colors.radius.far },
              ]}
            />
            <Text style={[styles.optionText, { color: colors.text }]}>
              Far (Early Warning)
            </Text>
          </View>
          <Switch
            value={formData.notificationLevels.far}
            onValueChange={(value) =>
              handleNotificationLevelChange('far', value)
            }
            trackColor={{ false: colors.border, true: Colors.radius.far }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.notificationOption}>
          <View style={styles.notificationInfo}>
            <View
              style={[
                styles.notificationIndicator,
                { backgroundColor: Colors.radius.medium },
              ]}
            />
            <Text style={[styles.optionText, { color: colors.text }]}>
              Medium (Approaching)
            </Text>
          </View>
          <Switch
            value={formData.notificationLevels.medium}
            onValueChange={(value) =>
              handleNotificationLevelChange('medium', value)
            }
            trackColor={{ false: colors.border, true: Colors.radius.medium }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.notificationOption}>
          <View style={styles.notificationInfo}>
            <View
              style={[
                styles.notificationIndicator,
                { backgroundColor: Colors.radius.near },
              ]}
            />
            <Text style={[styles.optionText, { color: colors.text }]}>
              Near (Arriving)
            </Text>
          </View>
          <Switch
            value={formData.notificationLevels.near}
            onValueChange={(value) =>
              handleNotificationLevelChange('near', value)
            }
            trackColor={{ false: colors.border, true: Colors.radius.near }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.radiusInfo}>
          <AlertCircle size={16} color={colors.tabIconDefault} />
          <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
            Enable which notifications you want to receive as you approach your appointment location.
          </Text>
        </View>
      </Card>

      {/* Submit Button */}
      <Button
        title={isEditing ? 'Update Appointment' : 'Create Appointment'}
        onPress={handleSubmit}
        variant="primary"
        size="large"
        style={styles.submitButton}
      />
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  radiusCard: {
    marginBottom: 16,
    padding: 16,
  },
  notificationCard: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  radiusInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
  },
});