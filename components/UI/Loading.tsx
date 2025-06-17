import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export default function Loading({
  message,
  fullScreen = false,
  size = 'large',
}: LoadingProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={size} color={colors.primary} />
        {message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});