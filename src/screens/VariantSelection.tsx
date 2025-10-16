import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';

interface VariantSelectionProps {
  navigation: any;
}

export const VariantSelection: React.FC<VariantSelectionProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const variants = [
    {
      id: 'tsivy',
      name: 'Fanoron-tsivy',
      board: '5×9',
      pieces: '22 per player',
      description: 'The standard variant with balanced gameplay',
      available: true,
    },
    {
      id: 'dimy',
      name: 'Fanoron-dimy',
      board: '5×5',
      pieces: '12 per player',
      description: 'Quick games on a smaller board',
      available: false,
    },
    {
      id: 'telo',
      name: 'Fanoron-telo',
      board: '3×3',
      pieces: '4 per player',
      description: 'Beginner-friendly mini variant',
      available: false,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          Choose Variant
        </Text>

        {variants.map(variant => (
          <View
            key={variant.id}
            style={[
              styles.variantCard,
              {
                backgroundColor: theme.colors.surface,
                opacity: variant.available ? 1 : 0.6,
              },
            ]}
          >
            <Text style={[styles.variantName, { color: theme.colors.text }]}>
              {variant.name}
            </Text>
            <Text style={[styles.variantBoard, { color: theme.colors.primary }]}>
              {variant.board} board
            </Text>
            <Text style={[styles.variantPieces, { color: theme.colors.textSecondary }]}>
              {variant.pieces}
            </Text>
            <Text style={[styles.variantDescription, { color: theme.colors.textSecondary }]}>
              {variant.description}
            </Text>

            {variant.available ? (
              <Button
                title="Select"
                onPress={() => navigation.navigate('GameSetup', { variant: variant.id })}
                style={styles.selectButton}
              />
            ) : (
              <View style={[styles.comingSoon, { backgroundColor: theme.colors.border }]}>
                <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>
                  Coming Soon
                </Text>
              </View>
            )}
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
    marginBottom: 24,
    textAlign: 'center',
  },
  variantCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  variantName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  variantBoard: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  variantPieces: {
    fontSize: 14,
    marginBottom: 12,
  },
  variantDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  selectButton: {
    marginTop: 8,
  },
  comingSoon: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});