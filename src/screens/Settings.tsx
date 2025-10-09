import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from '../components/Button';

interface SettingsProps {
  navigation: any;
}

export const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, locale, setLocale } = useLocale();
  const [showHints, setShowHints] = React.useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'mg', name: 'Malagasy' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.typography.h1, { color: theme.colors.text }]}>
          {t.settings.title}
        </Text>

        {/* Theme */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t.settings.theme}
            </Text>
            <View style={styles.settingControl}>
              <Text style={[styles.themeLabel, { color: theme.colors.textSecondary }]}>
                {isDark ? 'Dark' : 'Light'}
              </Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t.settings.language}
          </Text>
          {languages.map(lang => (
            <Button
              key={lang.code}
              title={lang.name}
              onPress={() => setLocale(lang.code as any)}
              variant={locale === lang.code ? 'primary' : 'outline'}
              style={styles.languageButton}
            />
          ))}
        </View>

        {/* Gameplay */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Gameplay</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t.settings.showHints}
            </Text>
            <Switch value={showHints} onValueChange={setShowHints} />
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
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    marginRight: 12,
    fontSize: 14,
  },
  languageButton: {
    marginVertical: 6,
  },
});