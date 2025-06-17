/**
 * App color scheme
 */

const tintColorLight = '#3478F6';
const tintColorDark = '#4D8DF9';

export default {
  light: {
    primary: '#3478F6',
    secondary: '#5AC8FA',
    accent: '#FF7D54',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    text: '#000000',
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E5E5EA',
    notification: '#FF3B30',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    mapBackground: '#F2F2F7',
  },
  dark: {
    primary: '#4D8DF9',
    secondary: '#64D2FF',
    accent: '#FF9F7D',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    text: '#FFFFFF',
    background: '#121212',
    card: '#1C1C1E',
    border: '#38383A',
    notification: '#FF453A',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    mapBackground: '#1C1C1E',
  },
  opacity: {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
  },
  radius: {
    far: '#FF9500',
    medium: '#5AC8FA',
    near: '#34C759',
  },
};