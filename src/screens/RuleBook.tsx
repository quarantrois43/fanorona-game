import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

interface RuleBookProps {
  navigation: any;
}

export const RuleBook: React.FC<RuleBookProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [expandedSection, setExpandedSection] = useState<string | null>('objective');

  const sections = [
    {
      id: 'objective',
      title: 'Objective',
      content: 'The goal is to capture all of your opponent\'s pieces or leave them with no legal moves.',
    },
    {
      id: 'board',
      title: 'The Board',
      content: 'Fanoron-tsivy is played on a 5×9 board with 45 intersection points. Each player starts with 22 pieces.',
    },
    {
      id: 'movement',
      title: 'Movement',
      content: 'Pieces move one intersection point at a time along marked lines (orthogonal or diagonal connections).',
    },
    {
      id: 'capture',
      title: 'Capturing',
      content: 'Captures occur in two ways:\n\n• Approach: Move towards a line of opponent pieces\n• Withdrawal: Move away from a line of opponent pieces\n\nAll opponent pieces in that line are captured.',
    },
    {
      id: 'chain',
      title: 'Chain Captures',
      content: 'After capturing, if you can make another capture with the same piece, you may continue. You can choose to end the chain at any time.',
    },
    {
      id: 'paika',
      title: 'Paika (Non-capturing moves)',
      content: 'If you can make a capturing move, you must. Non-capturing moves (paika) are only allowed when no captures are available.',
    },
    {
      id: 'winning',
      title: 'Winning',
      content: 'You win by:\n• Capturing all opponent pieces\n• Leaving the opponent with no legal moves',
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.mainMenu.rules}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Learn how to play Fanorona
        </Text>

        {sections.map(section => (
          <TouchableOpacity
            key={section.id}
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
            onPress={() => toggleSection(section.id)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {section.title}
              </Text>
              <Text style={[styles.expandIcon, { color: theme.colors.primary }]}>
                {expandedSection === section.id ? '−' : '+'}
              </Text>
            </View>
            
            {expandedSection === section.id && (
              <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
                {section.content}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={[styles.externalLink, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.linkTitle, { color: theme.colors.text }]}>
            Want to learn more?
          </Text>
          <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
            Visit: jeuxstrategie.free.fr/Fanorona_complet.php
          </Text>
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
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContent: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
  },
  externalLink: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});