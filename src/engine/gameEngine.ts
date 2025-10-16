import { GameState, GameConfig, Position, Move, Piece, Player, posKey, posEqual, parseKey } from './types';

/**
 * Fanorona Game Engine
 * Implements complete rules for Fanoron-tsivy (5x9 board)
 * 
 * Board layout (5 rows x 9 columns):
 * - 22 pieces per player (44 total)
 * - White starts at bottom, Black at top
 * - Center row has one empty space in the middle
 */

export class FanoronaEngine {
  private state: GameState;
  private config: GameConfig;

  // Board dimensions for Tsivy variant
  private readonly ROWS = 5;
  private readonly COLS = 9;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeGame();
  }

  /**
   * Initialize a new game with starting position
   */
  private initializeGame(): GameState {
    const board: (Piece | null)[][] = Array(this.ROWS).fill(null).map(() => 
      Array(this.COLS).fill(null)
    );
    const pieces = new Map<string, Piece>();

    // Place white pieces (rows 0-1 + partial row 2)
    for (let col = 0; col < this.COLS; col++) {
      // Row 0 - all white
      const pos0: Position = { row: 0, col };
      const piece0: Piece = { player: 'white', position: pos0 };
      board[0][col] = piece0;
      pieces.set(posKey(pos0), piece0);

      // Row 1 - all white
      const pos1: Position = { row: 1, col };
      const piece1: Piece = { player: 'white', position: pos1 };
      board[1][col] = piece1;
      pieces.set(posKey(pos1), piece1);

      // Row 2 - white except center (col 4)
      if (col !== 4) {
        const pos2: Position = { row: 2, col };
        const piece2: Piece = { player: 'white', position: pos2 };
        board[2][col] = piece2;
        pieces.set(posKey(pos2), piece2);
      }
    }

    // Place black pieces (rows 4-3 + partial row 2)
    for (let col = 0; col < this.COLS; col++) {
      // Row 4 - all black
      const pos4: Position = { row: 4, col };
      const piece4: Piece = { player: 'black', position: pos4 };
      board[4][col] = piece4;
      pieces.set(posKey(pos4), piece4);

      // Row 3 - all black
      const pos3: Position = { row: 3, col };
      const piece3: Piece = { player: 'black', position: pos3 };
      board[3][col] = piece3;
      pieces.set(posKey(pos3), piece3);

      // Row 2 - black only at center (col 4)
      if (col === 4) {
        const pos2: Position = { row: 2, col };
        const piece2: Piece = { player: 'black', position: pos2 };
        board[2][col] = piece2;
        pieces.set(posKey(pos2), piece2);
      }
    }

    return {
      board,
      pieces,
      currentPlayer: 'white',
      moveHistory: [],
      captureChainActive: false,
      lastMove: null,
      winner: null,
      drawOffered: false
    };
  }

  /**
   * Get all valid connections from a position
   * Includes orthogonal and diagonal moves based on board intersection points
   */
  private getConnections(pos: Position): Position[] {
    const connections: Position[] = [];
    const { row, col } = pos;

    // Orthogonal connections (always available)
    const orthogonal = [
      { row: row - 1, col }, // up
      { row: row + 1, col }, // down
      { row, col: col - 1 }, // left
      { row, col: col + 1 }  // right
    ];

    // Diagonal connections (only on certain intersections)
    const diagonal = [
      { row: row - 1, col: col - 1 }, // up-left
      { row: row - 1, col: col + 1 }, // up-right
      { row: row + 1, col: col - 1 }, // down-left
      { row: row + 1, col: col + 1 }  // down-right
    ];

    // Add orthogonal if in bounds
    orthogonal.forEach(p => {
      if (this.inBounds(p)) {
        connections.push(p);
      }
    });

    // Add diagonal only for valid intersection points
    // In Fanorona, diagonals are available at alternating positions
    if (this.hasDiagonalConnections(pos)) {
      diagonal.forEach(p => {
        if (this.inBounds(p)) {
          connections.push(p);
        }
      });
    }

    return connections;
  }

  /**
   * Check if a position has diagonal connections
   * Pattern: diagonals available when (row + col) is even
   */
  private hasDiagonalConnections(pos: Position): boolean {
    return (pos.row + pos.col) % 2 === 0;
  }

  /**
   * Check if position is within board bounds
   */
  private inBounds(pos: Position): boolean {
    return pos.row >= 0 && pos.row < this.ROWS && pos.col >= 0 && pos.col < this.COLS;
  }

  /**
   * Get piece at position
   */
  private getPieceAt(pos: Position): Piece | null {
    if (!this.inBounds(pos)) return null;
    return this.state.board[pos.row][pos.col];
  }

  /**
   * Generate all legal moves for current player
   */
  public getLegalMoves(fromPos?: Position): Move[] {
    if (this.state.winner) return [];

    // If in capture chain, only the piece that just moved can continue
    if (this.state.captureChainActive && this.state.lastMove) {
      if (fromPos && !posEqual(fromPos, this.state.lastMove.to)) {
        return [];
      }
      return this.getContinuationCaptures(this.state.lastMove.to);
    }

    // Normal move generation
    const moves: Move[] = [];
    const player = this.state.currentPlayer;

    if (fromPos) {
      const piece = this.getPieceAt(fromPos);
      if (piece && piece.player === player) {
        moves.push(...this.getMovesForPiece(fromPos));
      }
    } else {
      // Get moves for all pieces of current player
      this.state.pieces.forEach((piece, key) => {
        if (piece.player === player) {
          moves.push(...this.getMovesForPiece(piece.position));
        }
      });
    }

    return moves;
  }

  /**
   * Get all possible moves for a single piece
   */
  private getMovesForPiece(from: Position): Move[] {
    const moves: Move[] = [];
    const connections = this.getConnections(from);

    for (const to of connections) {
      const targetPiece = this.getPieceAt(to);
      
      // Can only move to empty squares
      if (targetPiece === null) {
        // Check for captures by approach
        const approachCaptures = this.getCapturesByApproach(from, to);
        if (approachCaptures.length > 0) {
          moves.push({
            from,
            to,
            captureType: 'approach',
            capturedPieces: approachCaptures,
            isChainCapture: false
          });
        }

        // Check for captures by withdrawal
        const withdrawalCaptures = this.getCapturesByWithdrawal(from, to);
        if (withdrawalCaptures.length > 0) {
          moves.push({
            from,
            to,
            captureType: 'withdrawal',
            capturedPieces: withdrawalCaptures,
            isChainCapture: false
          });
        }

        // If no captures possible, add as paika (non-capturing move)
        // Paika only allowed if no capturing moves exist
        if (approachCaptures.length === 0 && withdrawalCaptures.length === 0) {
          moves.push({
            from,
            to
          });
        }
      }
    }

    return moves;
  }

  /**
   * Get captures by approach (moving towards opponent pieces)
   */
  private getCapturesByApproach(from: Position, to: Position): Position[] {
    const captured: Position[] = [];
    const direction = {
      row: to.row - from.row,
      col: to.col - from.col
    };

    const opponent = this.state.currentPlayer === 'white' ? 'black' : 'white';
    let current = { row: to.row + direction.row, col: to.col + direction.col };

    // Continue in direction while capturing opponent pieces
    while (this.inBounds(current)) {
      const piece = this.getPieceAt(current);
      if (piece && piece.player === opponent) {
        captured.push({ ...current });
        current = { row: current.row + direction.row, col: current.col + direction.col };
      } else {
        break;
      }
    }

    return captured;
  }

  /**
   * Get captures by withdrawal (moving away from opponent pieces)
   */
  private getCapturesByWithdrawal(from: Position, to: Position): Position[] {
    const captured: Position[] = [];
    const direction = {
      row: from.row - to.row, // opposite direction
      col: from.col - to.col
    };

    const opponent = this.state.currentPlayer === 'white' ? 'black' : 'white';
    let current = { row: from.row + direction.row, col: from.col + direction.col };

    // Continue in direction while capturing opponent pieces
    while (this.inBounds(current)) {
      const piece = this.getPieceAt(current);
      if (piece && piece.player === opponent) {
        captured.push({ ...current });
        current = { row: current.row + direction.row, col: current.col + direction.col };
      } else {
        break;
      }
    }

    return captured;
  }

  /**
   * Get continuation captures (chain captures after first capture)
   */
  private getContinuationCaptures(from: Position): Move[] {
    const moves: Move[] = [];
    const connections = this.getConnections(from);

    for (const to of connections) {
      if (this.getPieceAt(to) === null) {
        const approachCaptures = this.getCapturesByApproach(from, to);
        if (approachCaptures.length > 0) {
          moves.push({
            from,
            to,
            captureType: 'approach',
            capturedPieces: approachCaptures,
            isChainCapture: true
          });
        }

        const withdrawalCaptures = this.getCapturesByWithdrawal(from, to);
        if (withdrawalCaptures.length > 0) {
          moves.push({
            from,
            to,
            captureType: 'withdrawal',
            capturedPieces: withdrawalCaptures,
            isChainCapture: true
          });
        }
      }
    }

    return moves;
  }

  /**
   * Execute a move and update game state
   */
  public makeMove(move: Move): boolean {
    // Validate move is legal
    const legalMoves = this.getLegalMoves(move.from);
    const isLegal = legalMoves.some(m => 
      posEqual(m.from, move.from) && 
      posEqual(m.to, move.to) &&
      m.captureType === move.captureType
    );

    if (!isLegal) return false;

    // Move the piece
    const piece = this.getPieceAt(move.from);
    if (!piece) return false;

    // Update board
    this.state.board[move.from.row][move.from.col] = null;
    this.state.board[move.to.row][move.to.col] = piece;

    // Update piece position
    const key = posKey(move.from);
    this.state.pieces.delete(key);
    piece.position = move.to;
    this.state.pieces.set(posKey(move.to), piece);

    // Handle captures
    if (move.capturedPieces && move.capturedPieces.length > 0) {
      for (const capturedPos of move.capturedPieces) {
        this.state.board[capturedPos.row][capturedPos.col] = null;
        this.state.pieces.delete(posKey(capturedPos));
      }

      // Check for continuation captures
      const continuations = this.getContinuationCaptures(move.to);
      if (continuations.length > 0) {
        this.state.captureChainActive = true;
      } else {
        this.state.captureChainActive = false;
        this.switchPlayer();
      }
    } else {
      // Non-capturing move (paika)
      this.state.captureChainActive = false;
      this.switchPlayer();
    }

    // Update history
    this.state.moveHistory.push(move);
    this.state.lastMove = move;

    // Check for game end
    this.checkGameEnd();

    return true;
  }

  /**
   * Switch to other player
   */
  private switchPlayer(): void {
    this.state.currentPlayer = this.state.currentPlayer === 'white' ? 'black' : 'white';
  }

  /**
   * Check if game has ended
   */
  private checkGameEnd(): void {
    // Count pieces
    let whiteCount = 0;
    let blackCount = 0;

    this.state.pieces.forEach(piece => {
      if (piece.player === 'white') whiteCount++;
      else blackCount++;
    });

    // Win by elimination
    if (whiteCount === 0) {
      this.state.winner = 'black';
      return;
    }
    if (blackCount === 0) {
      this.state.winner = 'white';
      return;
    }

    // Check if current player has no legal moves
    if (!this.state.captureChainActive) {
      const moves = this.getLegalMoves();
      if (moves.length === 0) {
        this.state.winner = this.state.currentPlayer === 'white' ? 'black' : 'white';
      }
    }
  }

  /**
   * Check if capturing moves exist for current player
   */
  public hasCapturingMoves(): boolean {
    const moves = this.getLegalMoves();
    return moves.some(m => m.capturedPieces && m.capturedPieces.length > 0);
  }

  /**
   * Get current game state (read-only)
   */
  public getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Serialize game state to JSON
   */
  public serialize(): string {
    return JSON.stringify({
      board: this.state.board,
      currentPlayer: this.state.currentPlayer,
      pieces: Array.from(this.state.pieces.entries()),
      moveHistory: this.state.moveHistory,
      captureChainActive: this.state.captureChainActive,
      lastMove: this.state.lastMove,
      winner: this.state.winner
    });
  }

  /**
   * Restore game state from serialized data
   */
  public static deserialize(data: string, config: GameConfig): FanoronaEngine {
    const parsed = JSON.parse(data);
    const engine = new FanoronaEngine(config);
    engine.state = {
      ...parsed,
      pieces: new Map(parsed.pieces)
    };
    return engine;
  }

  /**
   * End capture chain (player chooses to stop)
   */
  public endCaptureChain(): void {
    if (this.state.captureChainActive) {
      this.state.captureChainActive = false;
      this.switchPlayer();
      this.checkGameEnd();
    }
  }
}