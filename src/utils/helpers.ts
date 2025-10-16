import { Position, Move } from '../engine/types';

/**
 * Utility functions for game logic and UI
 */

export const helpers = {
  /**
   * Calculate distance between two positions
   */
  getDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt(
      Math.pow(pos2.row - pos1.row, 2) + Math.pow(pos2.col - pos1.col, 2)
    );
  },

  /**
   * Format time in MM:SS
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Generate random game room code
   */
  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  /**
   * Calculate ELO rating change
   */
  calculateEloChange(
    playerRating: number,
    opponentRating: number,
    result: 'win' | 'loss' | 'draw',
    kFactor: number = 32
  ): number {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    return Math.round(kFactor * (actualScore - expectedScore));
  },

  /**
   * Get rank name from Voninahitra rating
   */
  getRankFromRating(rating: number): string {
    if (rating < 1000) return 'Novice';
    if (rating < 1200) return 'Apprentice';
    if (rating < 1400) return 'Skilled';
    if (rating < 1600) return 'Expert';
    if (rating < 1800) return 'Master';
    if (rating < 2000) return 'Grandmaster';
    return 'Legend';
  },

  /**
   * Debounce function for performance
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Shuffle array (for random move selection in beginner AI)
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Deep clone object
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },
};