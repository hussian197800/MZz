import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function AppointmentsLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Appointments',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Appointment Details',
        }}
      />
    </Stack>
  );
}