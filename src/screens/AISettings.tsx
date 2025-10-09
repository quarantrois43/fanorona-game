import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from '../components/Button';

interface AISettingsProps {
  navigation: any;
}

export const AISettings: React.FC<AISettingsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'master'>('beginner');

  const difficulties = [
    {
      level: 'beginner' as const,
      title: t.aiDifficulty.beginner,
      description: 'Perfect for learning the game. The AI makes occasional mistakes.',
      depth: 2,
    },
    {
      level: 'intermediate' as const,
      title: t.aiDifficulty.intermediate,
      description: 'A challenging opponent that plays solid moves.',
      depth: 4,
    },
    {
      level: 'master' as const,
      title: t.aiDifficulty.master,
      description: 'Expert level AI with deep analysis and strategic planning.',
      depth: 6,
    },
  ];

  const handleStart = () => {
    navigation.navigate('GameSetup', { mode: 'ai', difficulty: selectedDifficulty });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.mainMenu.playVsAI}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose AI Difficulty
        </Text>

        {difficulties.map(diff => (
          <View
            key={diff.level}
            style={[
              styles.difficultyCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: selectedDifficulty === diff.level ? theme.colors.primary : 'transparent',
                borderWidth: 2,
              },
            ]}
            onTouchEnd={() => setSelectedDifficulty(diff.level)}
          >
            <Text style={[styles.difficultyTitle, { color: theme.colors.text }]}>
              {diff.title}
            </Text>
            <Text style={[styles.difficultyDescription, { color: theme.colors.textSecondary }]}>
              {diff.description}
            </Text>
            <Text style={[styles.difficultyDepth, { color: theme.colors.primary }]}>
              Search Depth: {diff.depth}
            </Text>
          </View>
        ))}

        <Button title={t.common.start} onPress={handleStart} style={styles.startButton} />
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  difficultyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  difficultyDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  difficultyDepth: {
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 24,
  },
});