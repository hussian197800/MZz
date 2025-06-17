import React from 'react';
import { Circle } from 'react-native-maps';
import { Coordinates } from '../../types/location';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface GeofenceCircleProps {
  center: Coordinates;
  radius: number;
  appointmentId: string;
  color?: string;
  active?: boolean;
}

export default function GeofenceCircle({
  center,
  radius,
  appointmentId,
  color,
  active = true,
}: GeofenceCircleProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  const circleColor = color || colors.primary;
  
  // Don't render if not active
  if (!active) return null;

  return (
    <>
      {/* Main geofence circle */}
      <Circle
        center={center}
        radius={radius}
        strokeWidth={2}
        strokeColor={circleColor}
        fillColor={`${circleColor}${Math.round(Colors.opacity.low * 255).toString(16)}`}
        key={`geofence-${appointmentId}`}
      />
      
      {/* Near proximity circle */}
      <Circle
        center={center}
        radius={radius * 1.5}
        strokeWidth={1}
        strokeColor={Colors.radius.near}
        fillColor={`${Colors.radius.near}${Math.round(Colors.opacity.low * 100).toString(16)}`}
        key={`near-${appointmentId}`}
      />
      
      {/* Medium proximity circle */}
      <Circle
        center={center}
        radius={radius * 3}
        strokeWidth={1}
        strokeColor={Colors.radius.medium}
        fillColor={`${Colors.radius.medium}${Math.round(Colors.opacity.low * 50).toString(16)}`}
        key={`medium-${appointmentId}`}
      />
    </>
  );
}