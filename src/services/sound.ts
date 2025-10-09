import { Audio } from 'expo-av';

/**
 * Sound effects for game actions
 * Uses placeholder system sounds - replace with custom audio files
 */

export class SoundService {
  private static instance: SoundService;
  private sounds: Map<string, Audio.Sound> = new Map();
  private enabled = true;

  private constructor() {
    this.loadSounds();
  }

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  private async loadSounds() {
    try {
      // In production, replace with actual sound files
      const soundFiles = {
        move: require('../assets/sounds/move.mp3'),
        capture: require('../assets/sounds/capture.mp3'),
        win: require('../assets/sounds/win.mp3'),
        click: require('../assets/sounds/click.mp3'),
      };

      // Load each sound
      for (const [key, file] of Object.entries(soundFiles)) {
        const { sound } = await Audio.Sound.createAsync(file);
        this.sounds.set(key, sound);
      }
    } catch (error) {
      console.log('Failed to load sounds:', error);
    }
  }

  async play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.log('Failed to play sound:', error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async cleanup() {
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    this.sounds.clear();
  }
}

export const soundService = SoundService.getInstance();