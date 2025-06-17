import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import Layout from '../../constants/Layout';

interface RadiusSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function RadiusSlider({
  value,
  onValueChange,
  onSlidingComplete,
  min = 50,
  max = 5000,
  step = 50,
}: RadiusSliderProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  // Format the radius for display
  const formatRadius = (radius: number): string => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)} km`;
    }
    return `${radius} m`;
  };

  // Get preset positions for the marks
  const getPresetPositions = () => {
    const presets = Object.values(Layout.radiusPresets);
    return presets.map((preset) => ({
      value: preset,
      position: ((preset - min) / (max - min)) * 100,
    }));
  };

  const presetPositions = getPresetPositions();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Reminder Radius</Text>
        <Text style={[styles.value, { color: colors.primary }]}>{formatRadius(value)}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />

        <View style={styles.marksContainer}>
          {presetPositions.map((preset, index) => (
            <View
              key={index}
              style={[
                styles.mark,
                {
                  left: `${preset.position}%`,
                  backgroundColor:
                    value >= preset.value ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.labelsContainer}>
          <Text style={[styles.rangeLabel, { color: colors.text }]}>
            {formatRadius(min)}
          </Text>
          <Text style={[styles.rangeLabel, { color: colors.text }]}>
            {formatRadius(max)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderContainer: {
    position: 'relative',
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  marksContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    height: 2,
    flexDirection: 'row',
  },
  mark: {
    position: 'absolute',
    width: 4,
    height: 8,
    borderRadius: 2,
    marginLeft: -2,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  rangeLabel: {
    fontSize: 12,
  },
});