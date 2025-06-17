import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        borderWidth: 1,
      },
      danger: {
        backgroundColor: colors.error,
        borderColor: colors.error,
      },
    };

    const disabledStyle: ViewStyle = {
      opacity: 0.5,
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(disabled ? disabledStyle : {}),
      ...style,
    };
  };

  const getTextStyles = () => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: '#FFFFFF',
      },
      secondary: {
        color: '#FFFFFF',
      },
      outline: {
        color: colors.primary,
      },
      danger: {
        color: '#FFFFFF',
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  const sizeStyles: Record<string, ViewStyle> = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 10,
    },
  };

  const textSizeStyles: Record<string, TextStyle> = {
    small: {
      fontSize: 14,
    },
    medium: {
      fontSize: 16,
    },
    large: {
      fontSize: 18,
    },
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && iconPosition === 'left' && icon}
      <Text style={getTextStyles()}>{title}</Text>
      {icon && iconPosition === 'right' && icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});