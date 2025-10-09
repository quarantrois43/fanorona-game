import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...style,
    backgroundColor: disabled
      ? theme.colors.border
      : variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
      ? theme.colors.secondary
      : 'transparent',
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: theme.colors.primary,
  };

  const textStyle: TextStyle = {
    ...styles.text,
    ...theme.typography.body,
    color: variant === 'outline' ? theme.colors.primary : '#FFFFFF',
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontWeight: '600',
  },
});