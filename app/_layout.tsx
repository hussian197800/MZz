import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { configureNotifications } from '@/utils/notificationUtils';
import { getCurrentLocation, requestLocationPermissions } from '@/utils/locationUtils';
import { useLocationStore } from '@/store/locationStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const { setCurrentLocation, setLocationPermission } = useLocationStore();
  
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
  
  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Configure notifications
      await configureNotifications();
      
      // Request location permissions and get current location
      const hasPermission = await requestLocationPermissions();
      setLocationPermission(hasPermission ? 'granted' : 'denied');
      
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
        }
      }
    };
    
    initializeApp();
  }, []);
  
  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  
  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modals/create-appointment" options={{ 
          presentation: 'modal',
          title: 'New Appointment',
          headerShown: true,
        }} />
        <Stack.Screen name="modals/location-picker" options={{ 
          presentation: 'modal',
          title: 'Select Location',
          headerShown: true,
        }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}