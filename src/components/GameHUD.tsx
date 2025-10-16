import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Player } from '../engine/types';

interface GameHUDProps {
  currentPlayer: Player;
  whiteCaptured: number;
  blackCaptured: number;
  isThinking?: boolean;
  captureChainActive?: boolean;
  onEndChain?: () => void;
  onPause: () => void;
  onResign: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentPlayer,
  whiteCaptured,
  blackCaptured,
  isThinking,
  captureChainActive,
  onEndChain,
  onPause,
  onResign,
}) => {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Turn indicator */}
      <View style={styles.turnSection}>
        <Text style={[styles.turnText, theme.typography.h3, { color: theme.colors.text }]}>
          {isThinking
            ? t.game.thinking
            : currentPlayer === 'white'
            ? t.game.whiteTurn
            : t.game.blackTurn}
        </Text>
        
        {captureChainActive && onEndChain && (
          <View style={styles.chainSection}>
            <Text style={[styles.chainText, { color: theme.colors.warning }]}>
              {t.game.captureChain}
            </Text>
            <TouchableOpacity
              style={[styles.endChainButton, { backgroundColor: theme.colors.warning }]}
              onPress={onEndChain}
            >
              <Text style={styles.buttonText}>{t.game.endChain}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Captured pieces count */}
      <View style={styles.capturedSection}>
        <View style={styles.capturedBox}>
          <View style={[styles.capturedDot, { backgroundColor: theme.colors.whitePiece }]} />
          <Text style={[styles.capturedText, { color: theme.colors.text }]}>
            {t.game.whiteCaptured}: {whiteCaptured}
          </Text>
        </View>
        
        <View style={styles.capturedBox}>
          <View style={[styles.capturedDot, { backgroundColor: theme.colors.blackPiece }]} />
          <Text style={[styles.capturedText, { color: theme.colors.text }]}>
            {t.game.blackCaptured}: {blackCaptured}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={onPause}
        >
          <Text style={styles.buttonText}>{t.game.pause}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={onResign}
        >
          <Text style={styles.buttonText}>{t.game.resign}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  turnSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  turnText: {
    marginBottom: 8,
  },
  chainSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  chainText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  endChainButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  capturedSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  capturedBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capturedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  capturedText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});