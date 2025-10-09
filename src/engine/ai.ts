import { FanoronaEngine } from './gameEngine';
import { Move, GameState, Player, Position } from './types';

/**
 * Fanorona AI using Minimax with Alpha-Beta Pruning
 * 
 * Difficulty levels:
 * - Beginner: depth 2, basic heuristic
 * - Intermediate: depth 4, improved heuristic with move ordering
 * - Master: depth 6, advanced heuristic with aggressive pruning
 */

interface AIConfig {
  depth: number;
  useTranspositionTable: boolean;
  moveOrdering: boolean;
}

interface EvaluationWeights {
  pieceValue: number;
  mobilityWeight: number;
  centerControlWeight: number;
  captureWeight: number;
}

export class FanoronaAI {
  private engine: FanoronaEngine;
  private player: Player;
  private config: AIConfig;
  private weights: EvaluationWeights;
  private transpositionTable: Map<string, { score: number; depth: number }>;
  private nodesEvaluated: number;

  constructor(engine: FanoronaEngine, player: Player, difficulty: 'beginner' | 'intermediate' | 'master') {
    this.engine = engine;
    this.player = player;
    this.transpositionTable = new Map();
    this.nodesEvaluated = 0;

    // Configure based on difficulty
    switch (difficulty) {
      case 'beginner':
        this.config = {
          depth: 2,
          useTranspositionTable: false,
          moveOrdering: false
        };
        this.weights = {
          pieceValue: 100,
          mobilityWeight: 5,
          centerControlWeight: 10,
          captureWeight: 50
        };
        break;

      case 'intermediate':
        this.config = {
          depth: 4,
          useTranspositionTable: true,
          moveOrdering: true
        };
        this.weights = {
          pieceValue: 100,
          mobilityWeight: 10,
          centerControlWeight: 15,
          captureWeight: 80
        };
        break;

      case 'master':
        this.config = {
          depth: 6,
          useTranspositionTable: true,
          moveOrdering: true
        };
        this.weights = {
          pieceValue: 100,
          mobilityWeight: 15,
          centerControlWeight: 20,
          captureWeight: 100
        };
        break;
    }
  }

  /**
   * Get best move for AI player
   */
  public getBestMove(): Move | null {
    this.nodesEvaluated = 0;
    this.transpositionTable.clear();

    const legalMoves = this.engine.getLegalMoves();
    if (legalMoves.length === 0) return null;

    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    // Order moves for better pruning
    const orderedMoves = this.config.moveOrdering 
      ? this.orderMoves(legalMoves)
      : legalMoves;

    for (const move of orderedMoves) {
      // Simulate move
      const engineCopy = this.copyEngine();
      engineCopy.makeMove(move);

      // Evaluate position
      const score = -this.minimax(engineCopy, this.config.depth - 1, -beta, -alpha, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, score);
    }

    console.log(`AI evaluated ${this.nodesEvaluated} nodes, best score: ${bestScore}`);
    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private minimax(
    engine: FanoronaEngine,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    this.nodesEvaluated++;

    // Check transposition table
    if (this.config.useTranspositionTable) {
      const key = engine.serialize();
      const entry = this.transpositionTable.get(key);
      if (entry && entry.depth >= depth) {
        return entry.score;
      }
    }

    // Terminal node or depth limit
    const state = engine.getState();
    if (depth === 0 || state.winner) {
      const score = this.evaluate(engine);
      
      if (this.config.useTranspositionTable) {
        this.transpositionTable.set(engine.serialize(), { score, depth });
      }
      
      return score;
    }

    const legalMoves = engine.getLegalMoves();
    
    // No legal moves - lose
    if (legalMoves.length === 0) {
      return isMaximizing ? -10000 : 10000;
    }

    // Order moves
    const orderedMoves = this.config.moveOrdering
      ? this.orderMoves(legalMoves)
      : legalMoves;

    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of orderedMoves) {
        const engineCopy = this.copyEngineFrom(engine);
        engineCopy.makeMove(move);
        
        const score = this.minimax(engineCopy, depth - 1, alpha, beta, false);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        
        if (beta <= alpha) break; // Beta cutoff
      }
      
      return maxScore;
    } else {
      let minScore = Infinity;
      
      for (const move of orderedMoves) {
        const engineCopy = this.copyEngineFrom(engine);
        engineCopy.makeMove(move);
        
        const score = this.minimax(engineCopy, depth - 1, alpha, beta, true);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        
        if (beta <= alpha) break; // Alpha cutoff
      }
      
      return minScore;
    }
  }

  /**
   * Evaluate board position
   * Positive score favors AI player, negative favors opponent
   */
  private evaluate(engine: FanoronaEngine): number {
    const state = engine.getState();
    
    // Terminal states
    if (state.winner === this.player) return 10000;
    if (state.winner !== null) return -10000;

    let score = 0;

    // Count pieces
    let aiPieces = 0;
    let opponentPieces = 0;
    const opponent: Player = this.player === 'white' ? 'black' : 'white';

    state.pieces.forEach(piece => {
      if (piece.player === this.player) {
        aiPieces++;
        // Bonus for center control
        score += this.weights.centerControlWeight * this.getCenterControl(piece.position);
      } else {
        opponentPieces++;
        score -= this.weights.centerControlWeight * this.getCenterControl(piece.position);
      }
    });

    // Material advantage
    score += (aiPieces - opponentPieces) * this.weights.pieceValue;

    // Mobility (number of legal moves)
    const currentPlayer = state.currentPlayer;
    if (currentPlayer === this.player) {
      const moves = engine.getLegalMoves();
      score += moves.length * this.weights.mobilityWeight;
      
      // Bonus for capturing moves
      const capturingMoves = moves.filter(m => m.capturedPieces && m.capturedPieces.length > 0);
      score += capturingMoves.length * this.weights.captureWeight;
    }

    return score;
  }

  /**
   * Calculate center control value for a position
   */
  private getCenterControl(pos: Position): number {
    // Center positions (row 2, col 3-5) are most valuable
    const rowDistance = Math.abs(pos.row - 2);
    const colDistance = Math.abs(pos.col - 4);
    return 1.0 / (1.0 + rowDistance + colDistance);
  }

  /**
   * Order moves for better alpha-beta pruning
   * Prioritize: captures > center moves > other moves
   */
  private orderMoves(moves: Move[]): Move[] {
    return moves.sort((a, b) => {
      // Captures first
      const aCaptures = a.capturedPieces?.length || 0;
      const bCaptures = b.capturedPieces?.length || 0;
      if (aCaptures !== bCaptures) return bCaptures - aCaptures;

      // Then center moves
      const aCenterValue = this.getCenterControl(a.to);
      const bCenterValue = this.getCenterControl(b.to);
      return bCenterValue - aCenterValue;
    });
  }

  /**
   * Create a deep copy of the engine for simulation
   */
  private copyEngine(): FanoronaEngine {
    const serialized = this.engine.serialize();
    return FanoronaEngine.deserialize(serialized, { 
      variant: 'tsivy',
      mode: 'ai',
      playerNames: ['Player', 'AI']
    });
  }

  /**
   * Create a copy from an existing engine instance
   */
  private copyEngineFrom(engine: FanoronaEngine): FanoronaEngine {
    const serialized = engine.serialize();
    return FanoronaEngine.deserialize(serialized, {
      variant: 'tsivy',
      mode: 'ai',
      playerNames: ['Player', 'AI']
    });
  }

  /**
   * Get statistics about last search
   */
  public getStats() {
    return {
      nodesEvaluated: this.nodesEvaluated,
      depth: this.config.depth,
      transpositionTableSize: this.transpositionTable.size
    };
  }
}