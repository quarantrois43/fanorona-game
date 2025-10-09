import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SplashScreensProps {
  onComplete: () => void;
}

const splashData = [
  {
    title: 'Welcome to Fanorona',
    description: 'Experience the ancient Malagasy strategy game',
    icon: '🎮',
  },
  {
    title: 'Master the Art of Capture',
    description: 'Learn approach and withdrawal tactics',
    icon: '⚔️',
  },
  {
    title: 'Challenge Players Worldwide',
    description: 'Compete online and earn Voninahitra rating',
    icon: '🌍',
  },
];

export const SplashScreens: React.FC<SplashScreensProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < splashData.length - 1) {
      fadeAnim.setValue(0);
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const current = splashData[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.icon}>{current.icon}</Text>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {current.title}
        </Text>
        <Text style={[styles.description, theme.typography.body, { color: theme.colors.textSecondary }]}>
          {current.description}
        </Text>
      </Animated.View>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {splashData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.nextText}>{currentIndex === splashData.length - 1 ? 'Start' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});