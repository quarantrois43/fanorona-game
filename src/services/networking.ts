import { database } from './firebase';
import { ref, set, onValue, push, update, remove, off } from 'firebase/database';
import { GameState, Move } from '../engine/types';

/**
 * Online multiplayer service using Firebase Realtime Database
 */

export interface GameRoom {
  id: string;
  hostId: string;
  guestId?: string;
  hostName: string;
  guestName?: string;
  gameState: string; // Serialized game state
  status: 'waiting' | 'active' | 'finished';
  createdAt: number;
}

export class OnlineGameService {
  private roomId: string | null = null;
  private playerId: string;
  private listeners: Map<string, () => void> = new Map();

  constructor() {
    // Generate unique player ID
    this.playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new game room
   */
  async createRoom(hostName: string): Promise<string> {
    const roomsRef = ref(database, 'rooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key!;

    const room: GameRoom = {
      id: roomId,
      hostId: this.playerId,
      hostName,
      gameState: '',
      status: 'waiting',
      createdAt: Date.now(),
    };

    await set(newRoomRef, room);
    this.roomId = roomId;
    return roomId;
  }

  /**
   * Join an existing game room
   */
  async joinRoom(roomId: string, guestName: string): Promise<boolean> {
    const roomRef = ref(database, `rooms/${roomId}`);
    
    try {
      await update(roomRef, {
        guestId: this.playerId,
        guestName,
        status: 'active',
      });
      
      this.roomId = roomId;
      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  }

  /**
   * Update game state
   */
  async updateGameState(gameState: string): Promise<void> {
    if (!this.roomId) return;
    
    const roomRef = ref(database, `rooms/${this.roomId}/gameState`);
    await set(roomRef, gameState);
  }

  /**
   * Listen for game state changes
   */
  onGameStateChange(callback: (gameState: string) => void): void {
    if (!this.roomId) return;
    
    const gameStateRef = ref(database, `rooms/${this.roomId}/gameState`);
    const unsubscribe = onValue(gameStateRef, snapshot => {
      const state = snapshot.val();
      if (state) {
        callback(state);
      }
    });

    this.listeners.set('gameState', () => off(gameStateRef));
  }

  /**
   * Listen for opponent joining
   */
  onOpponentJoined(callback: (opponentName: string) => void): void {
    if (!this.roomId) return;
    
    const roomRef = ref(database, `rooms/${this.roomId}`);
    const unsubscribe = onValue(roomRef, snapshot => {
      const room = snapshot.val() as GameRoom;
      if (room && room.guestId && room.guestName) {
        callback(room.guestName);
      }
    });

    this.listeners.set('opponent', () => off(roomRef));
  }

  /**
   * Leave the current room
   */
  async leaveRoom(): Promise<void> {
    if (!this.roomId) return;
    
    // Clean up listeners
    this.listeners.forEach(cleanup => cleanup());
    this.listeners.clear();
    
    // Remove room or update status
    const roomRef = ref(database, `rooms/${this.roomId}`);
    await remove(roomRef);
    
    this.roomId = null;
  }

  /**
   * Send a chat message
   */
  async sendChatMessage(message: string): Promise<void> {
    if (!this.roomId) return;
    
    const messagesRef = ref(database, `rooms/${this.roomId}/chat`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      playerId: this.playerId,
      message,
      timestamp: Date.now(),
    });
  }

  /**
   * Listen for chat messages
   */
  onChatMessage(callback: (message: { playerId: string; message: string; timestamp: number }) => void): void {
    if (!this.roomId) return;
    
    const messagesRef = ref(database, `rooms/${this.roomId}/chat`);
    const unsubscribe = onValue(messagesRef, snapshot => {
      const messages = snapshot.val();
      if (messages) {
        const messageArray = Object.values(messages) as any[];
        const latestMessage = messageArray[messageArray.length - 1];
        if (latestMessage) {
          callback(latestMessage);
        }
      }
    });

    this.listeners.set('chat', () => off(messagesRef));
  }

  /**
   * Get current player ID
   */
  getPlayerId(): string {
    return this.playerId;
  }

  /**
   * Check if player is host
   */
  isHost(room: GameRoom): boolean {
    return room.hostId === this.playerId;
  }
}