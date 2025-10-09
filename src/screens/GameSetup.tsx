import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { GameConfig } from '../engine/types';

interface GameSetupProps {
  navigation: any;
  route: any;
}

export const GameSetup: React.FC<GameSetupProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { startGame } = useGame();
  const mode = route.params?.mode || 'local';
  const difficulty = route.params?.difficulty;

  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState(mode === 'ai' ? 'Computer' : 'Player 2');

  const handleStartGame = () => {
    const config: GameConfig = {
      variant: 'tsivy',
      mode,
      difficulty,
      playerNames: [player1Name, player2Name],
    };

    startGame(config);
    navigation.navigate('GameBoard');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Game Setup
        </Text>

        {/* Player names */}
        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>White Player</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
            value={player1Name}
            onChangeText={setPlayer1Name}
            placeholder="Enter player 1 name"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Black Player</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
            value={player2Name}
            onChangeText={setPlayer2Name}
            placeholder="Enter player 2 name"
            placeholderTextColor={theme.colors.textSecondary}
            editable={mode !== 'ai'}
          />
        </View>

        {/* Game info */}
        <View style={[styles.infoBox, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Game Variant</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Fanoron-tsivy (5×9 board)
          </Text>
          
          {mode === 'ai' && difficulty && (
            <>
              <Text style={[styles.infoTitle, { color: theme.colors.text, marginTop: 12 }]}>
                Difficulty
              </Text>
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {t.aiDifficulty[difficulty]}
              </Text>
            </>
          )}
        </View>

        {/* Start button */}
        <Button title={t.common.start} onPress={handleStartGame} style={styles.startButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
  },
  startButton: {
    marginTop: 20,
  },
});