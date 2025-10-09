import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Position } from '../engine/types';

interface MoveHintOverlayProps {
  position: Position;
  cellSize: number;
  isCapture: boolean;
  onPress: () => void;
}

export const MoveHintOverlay: React.FC<MoveHintOverlayProps> = ({
  position,
  cellSize,
  isCapture,
  onPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const hintColor = isCapture ? theme.colors.captureHint : theme.colors.legalMoveHint;
  const hintSize = isCapture ? cellSize * 0.5 : cellSize * 0.35;

  return (
    <Animated.View
      style={[
        styles.hint,
        {
          left: position.col * cellSize + (cellSize - hintSize) / 2,
          top: position.row * cellSize + (cellSize - hintSize) / 2,
          width: hintSize,
          height: hintSize,
          borderRadius: hintSize / 2,
          backgroundColor: hintColor,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      onTouchEnd={onPress}
    />
  );
};

const styles = StyleSheet.create({
  hint: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});