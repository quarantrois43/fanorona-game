import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Player } from '../engine/types';
interface PieceProps {
    player: Player;
    size: number;
    selected?: boolean;
    onPress?: () => void;
    animated?: boolean;
  }
  
  export const Piece: React.FC<PieceProps> = ({
    player,
    size,
    selected = false,
    onPress,
    animated = false,
  }) => {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
  
    useEffect(() => {
      if (selected) {
        // Pulse animation for selected piece
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        pulseAnim.setValue(1);
      }
    }, [selected]);
  
    useEffect(() => {
      if (animated) {
        // Pop-in animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    }, [animated]);
  
    const pieceColor = player === 'white' ? theme.colors.whitePiece : theme.colors.blackPiece;
    const borderColor = selected ? theme.colors.selectedPiece : theme.colors.border;
  
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.piece,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: pieceColor,
              borderColor: borderColor,
              borderWidth: selected ? 3 : 2,
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            },
          ]}
        >
          {/* Inner circle for depth effect */}
          <View
            style={[
              styles.innerCircle,
              {
                width: size * 0.7,
                height: size * 0.7,
                borderRadius: (size * 0.7) / 2,
                backgroundColor: player === 'white' ? '#F5F5F5' : '#424242',
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    piece: {
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    innerCircle: {
      opacity: 0.3,
    },
  });