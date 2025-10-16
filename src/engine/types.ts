// Core game types for Fanorona

export type Player = 'white' | 'black';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  player: Player;
  position: Position;
}

export interface Move {
  from: Position;
  to: Position;
  captureType?: 'approach' | 'withdrawal';
  capturedPieces?: Position[];
  isChainCapture?: boolean;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Player;
  pieces: Map<string, Piece>;
  moveHistory: Move[];
  captureChainActive: boolean;
  lastMove: Move | null;
  winner: Player | null;
  drawOffered: boolean;
}

export interface GameConfig {
  variant: 'tsivy'; // 5x9 board
  mode: 'local' | 'ai' | 'online';
  difficulty?: 'beginner' | 'intermediate' | 'master';
  timeControl?: number;
  playerNames: [string, string];
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  voninahitra: number; // ELO-like rating
  achievements: string[];
}

// Helper function to convert position to string key
export const posKey = (pos: Position): string => `${pos.row},${pos.col}`;

// Helper function to parse position key
export const parseKey = (key: string): Position => {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
};

// Helper to check position equality
export const posEqual = (a: Position, b: Position): boolean => 
  a.row === b.row && a.col === b.col;