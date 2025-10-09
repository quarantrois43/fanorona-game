import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useGame } from '../context/GameContext';

interface ProfileProps {
  navigation: any;
}

export const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { playerStats } = useGame();

  const winRate =
    playerStats.gamesPlayed > 0
      ? ((playerStats.wins / playerStats.gamesPlayed) * 100).toFixed(1)
      : '0.0';

  const achievements = [
    { id: 'first_win', title: 'First Victory', unlocked: playerStats.wins > 0 },
    { id: 'win_10', title: 'Veteran', unlocked: playerStats.wins >= 10 },
    { id: 'rating_1500', title: 'Expert', unlocked: playerStats.voninahitra >= 1500 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.profile.title}
        </Text>

        {/* Voninahitra Rating */}
        <View style={[styles.ratingCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.ratingLabel}>{t.profile.voninahitra}</Text>
          <Text style={styles.ratingValue}>{playerStats.voninahitra}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {playerStats.gamesPlayed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {t.profile.gamesPlayed}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {playerStats.wins}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {t.profile.wins}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {playerStats.losses}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {t.profile.losses}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {winRate}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {t.profile.winRate}
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t.profile.achievements}
          </Text>
          {achievements.map(ach => (
            <View key={ach.id} style={styles.achievementRow}>
              <Text style={[styles.achievementIcon, { opacity: ach.unlocked ? 1 : 0.3 }]}>
                {ach.unlocked ? '🏆' : '🔒'}
              </Text>
              <Text
                style={[
                  styles.achievementTitle,
                  { color: theme.colors.text, opacity: ach.unlocked ? 1 : 0.5 },
                ]}
              >
                {ach.title}
              </Text>
            </View>
          ))}
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
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  ratingValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
  },
});