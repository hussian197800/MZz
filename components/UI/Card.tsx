import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  style,
  elevation = 'medium',
  padding = 'medium',
}: CardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const getElevationStyle = (): ViewStyle => {
    if (colorScheme === 'dark') {
      // Simpler elevation for dark mode
      return {
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
        borderWidth: elevation === 'none' ? 0 : 1,
        borderColor: colors.border,
      };
    }

    // Light mode with real shadows
    const elevationStyles: Record<string, ViewStyle> = {
      none: {
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
      },
      low: {
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      },
      medium: {
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      },
      high: {
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      },
    };

    return elevationStyles[elevation];
  };

  const getPaddingStyle = (): ViewStyle => {
    const paddingStyles: Record<string, ViewStyle> = {
      none: {
        padding: 0,
      },
      small: {
        padding: 8,
      },
      medium: {
        padding: 16,
      },
      large: {
        padding: 24,
      },
    };

    return paddingStyles[padding];
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: '#000000',
        },
        getElevationStyle(),
        getPaddingStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});