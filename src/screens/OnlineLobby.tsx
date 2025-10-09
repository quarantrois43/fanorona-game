import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from '../components/Button';

interface OnlineLobbyProps {
  navigation: any;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [searching, setSearching] = useState(false);

  const handleQuickMatch = () => {
    setSearching(true);
    // Simulate matchmaking
    setTimeout(() => {
      setSearching(false);
      navigation.navigate('Matchmaking');
    }, 2000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.mainMenu.playOnline}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Connect with players worldwide
        </Text>

        {/* Quick Match */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>⚡ Quick Match</Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            Get matched with a player of similar skill level
          </Text>
          
          {searching ? (
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.searchingText, { color: theme.colors.text }]}>
                Searching for opponent...
              </Text>
            </View>
          ) : (
            <Button title="Find Match" onPress={handleQuickMatch} style={styles.cardButton} />
          )}
        </View>

        {/* Play with Friend */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>👥 Play with Friend</Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            Share a room code to play with a specific friend
          </Text>
          <Button
            title="Create Room"
            onPress={() => console.log('Create room')}
            variant="secondary"
            style={styles.cardButton}
          />
        </View>

        {/* Tournament */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>🏆 Tournaments</Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            Compete in ranked tournaments for prizes
          </Text>
          <View style={[styles.comingSoon, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
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
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardButton: {
    marginTop: 8,
  },
  searchingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  searchingText: {
    marginTop: 12,
    fontSize: 16,
  },
  comingSoon: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});