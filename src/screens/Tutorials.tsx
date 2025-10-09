import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from '../components/Button';

interface TutorialsProps {
  navigation: any;
}

export const Tutorials: React.FC<TutorialsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();

  const tutorials = [
    {
      id: 'basics',
      title: t.tutorials.basics,
      description: 'Learn the fundamental rules and how pieces move',
      difficulty: 'Beginner',
      duration: '5 min',
      icon: '📚',
    },
    {
      id: 'captures',
      title: t.tutorials.captures,
      description: 'Master approach and withdrawal capture techniques',
      difficulty: 'Beginner',
      duration: '10 min',
      icon: '⚔️',
    },
    {
      id: 'chains',
      title: 'Chain Captures',
      description: 'Learn how to execute devastating capture chains',
      difficulty: 'Intermediate',
      duration: '8 min',
      icon: '🔗',
    },
    {
      id: 'advanced',
      title: t.tutorials.advanced,
      description: 'Advanced tactics and strategic planning',
      difficulty: 'Advanced',
      duration: '15 min',
      icon: '🎯',
    },
    {
      id: 'practice',
      title: t.tutorials.practice,
      description: 'Solve puzzles to improve your skills',
      difficulty: 'All Levels',
      duration: 'Variable',
      icon: '🧩',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.tutorials.title}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Master Fanorona step by step
        </Text>

        {tutorials.map(tutorial => (
          <View
            key={tutorial.id}
            style={[styles.tutorialCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={styles.tutorialIcon}>{tutorial.icon}</Text>
            
            <View style={styles.tutorialInfo}>
              <Text style={[styles.tutorialTitle, { color: theme.colors.text }]}>
                {tutorial.title}
              </Text>
              <Text style={[styles.tutorialDescription, { color: theme.colors.textSecondary }]}>
                {tutorial.description}
              </Text>
              
              <View style={styles.tutorialMeta}>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.badgeText}>{tutorial.difficulty}</Text>
                </View>
                <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
                  ⏱ {tutorial.duration}
                </Text>
              </View>
            </View>

            <Button
              title="Start"
              onPress={() => {
                // Navigate to specific tutorial
                console.log(`Starting tutorial: ${tutorial.id}`);
              }}
              style={styles.startButton}
            />
          </View>
        ))}
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
  tutorialCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  tutorialIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  tutorialInfo: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  tutorialDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  tutorialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
  },
  startButton: {
    minWidth: 80,
  },
});