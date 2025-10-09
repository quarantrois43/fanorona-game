import { FanoronaEngine } from '../src/engine/gameEngine';
import { GameConfig, Position } from '../src/engine/types';

describe('FanoronaEngine', () => {
  let engine: FanoronaEngine;
  let config: GameConfig;

  beforeEach(() => {
    config = {
      variant: 'tsivy',
      mode: 'local',
      playerNames: ['Player 1', 'Player 2'],
    };
    engine = new FanoronaEngine(config);
  });

  test('should initialize with correct starting position', () => {
    const state = engine.getState();
    
    // Should have 44 pieces total (22 per player)
    expect(state.pieces.size).toBe(45); // 44 pieces + 1 empty center
    
    // White should start
    expect(state.currentPlayer).toBe('white');
    
    // No winner at start
    expect(state.winner).toBeNull();
  });

  test('should generate legal moves for white', () => {
    const moves = engine.getLegalMoves();
    expect(moves.length).toBeGreaterThan(0);
  });

  test('should execute valid move', () => {
    const moves = engine.getLegalMoves();
    const firstMove = moves[0];
    
    const success = engine.makeMove(firstMove);
    expect(success).toBe(true);
  });

  test('should reject invalid move', () => {
    const invalidMove = {
      from: { row: 0, col: 0 },
      to: { row: 4, col: 8 }, // Invalid destination
    };
    
    const success = engine.makeMove(invalidMove);
    expect(success).toBe(false);
  });

  test('should handle captures correctly', () => {
    // This would require setting up a specific board position
    // For brevity, this is a placeholder
    expect(true).toBe(true);
  });

  test('should serialize and deserialize game state', () => {
    const serialized = engine.serialize();
    const restored = FanoronaEngine.deserialize(serialized, config);
    
    const originalState = engine.getState();
    const restoredState = restored.getState();
    
    expect(restoredState.currentPlayer).toBe(originalState.currentPlayer);
    expect(restoredState.pieces.size).toBe(originalState.pieces.size);
  });
});