import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onPress: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, activeId, onPress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => onPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, { color: isActive ? theme.colors.primary : theme.colors.textSecondary }]}>
              {item.icon}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: isActive ? '600' : 'normal',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});