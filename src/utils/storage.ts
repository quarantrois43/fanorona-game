import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerStats } from '../engine/types';

/**
 * Local storage utilities for persisting game data
 */

const KEYS = {
  PLAYER_STATS: '@fanorona:player_stats',
  SETTINGS: '@fanorona:settings',
  TUTORIAL_PROGRESS: '@fanorona:tutorial_progress',
  GAME_HISTORY: '@fanorona:game_history',
};

export const storage = {
  /**
   * Save player statistics
   */
  async savePlayerStats(stats: PlayerStats): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PLAYER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save player stats:', error);
    }
  },

  /**
   * Load player statistics
   */
  async loadPlayerStats(): Promise<PlayerStats | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PLAYER_STATS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load player stats:', error);
      return null;
    }
  },

  /**
   * Save app settings
   */
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  /**
   * Load app settings
   */
  async loadSettings(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  },

  /**
   * Clear all stored data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};