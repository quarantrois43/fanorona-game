import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useGame } from '../context/GameContext';
import { BoardGrid } from '../components/BoardGrid';
import { Piece } from '../components/Piece';
import { MoveHintOverlay } from '../components/MoveHintOverlay';
import { GameHUD } from '../components/GameHUD';
import { Modal } from '../components/Modal';
import { Position, Move } from '../engine/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_PADDING = 20;
const CELL_SIZE = (SCREEN_WIDTH - BOARD_PADDING * 2) / 9; // 9 columns

interface GameBoardProps {
  navigation: any;
}

export const GameBoard: React.FC<GameBoardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { engine, ai, gameState, makeMove, getAIMove, config, updateStats } = useGame();

  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);

  // AI move execution
  useEffect(() => {
    if (!gameState || !engine || !config) return;

    // Check if AI should move
    if (
      config.mode === 'ai' &&
      gameState.currentPlayer === 'black' &&
      !gameState.winner &&
      !gameState.captureChainActive &&
      !isAIThinking
    ) {
      setIsAIThinking(true);
      
      // Delay for better UX
      setTimeout(() => {
        const aiMove = getAIMove();
        if (aiMove) {
          makeMove(aiMove);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setIsAIThinking(false);
      }, 800);
    }
  }, [gameState?.currentPlayer, gameState?.captureChainActive]);

  // Check for game end
  useEffect(() => {
    if (gameState?.winner) {
      setShowGameEnd(true);
      updateStats(gameState.winner);
    }
  }, [gameState?.winner]);

  const handleSquarePress = (position: Position) => {
    if (!engine || !gameState || isAIThinking) return;

    const piece = engine.getState().board[position.row][position.col];

    // If no piece selected, select this piece if it belongs to current player
    if (!selectedPiece) {
      if (piece && piece.player === gameState.currentPlayer) {
        setSelectedPiece(position);
        const moves = engine.getLegalMoves(position);
        setLegalMoves(moves);
        Haptics.selectionAsync();
      }
      return;
    }

    // If clicking same piece, deselect
    if (selectedPiece.row === position.row && selectedPiece.col === position.col) {
      setSelectedPiece(null);
      setLegalMoves([]);
      return;
    }

    // If clicking another piece of same color, select that instead
    if (piece && piece.player === gameState.currentPlayer) {
      setSelectedPiece(position);
      const moves = engine.getLegalMoves(position);
      setLegalMoves(moves);
      Haptics.selectionAsync();
      return;
    }

    // Otherwise, try to make a move
    const move = legalMoves.find(
      m => m.to.row === position.row && m.to.col === position.col
    );

    if (move) {
      const success = makeMove(move);
      if (success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // If capture chain not active, clear selection
        if (!engine.getState().captureChainActive) {
          setSelectedPiece(null);
          setLegalMoves([]);
        } else {
          // Update legal moves for continuation
          setSelectedPiece(move.to);
          setLegalMoves(engine.getLegalMoves(move.to));
        }
      }
    }
  };

  const handleEndCaptureChain = () => {
    if (engine) {
      engine.endCaptureChain();
      setSelectedPiece(null);
      setLegalMoves([]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePause = () => {
    Alert.alert(
      t.game.pause,
      'Game paused',
      [
        { text: t.common.continue, style: 'cancel' },
        { text: 'Main Menu', onPress: () => navigation.navigate('MainMenu') },
      ]
    );
  };

  const handleResign = () => {
    Alert.alert(
      t.game.resign,
      'Are you sure you want to resign?',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.yes,
          style: 'destructive',
          onPress: () => {
            if (gameState) {
              const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
              updateStats(winner);
              setShowGameEnd(true);
            }
          },
        },
      ]
    );
  };

  const handleRematch = () => {
    setShowGameEnd(false);
    setSelectedPiece(null);
    setLegalMoves([]);
    navigation.replace('GameSetup', { mode: config?.mode, difficulty: config?.difficulty });
  };

  if (!gameState || !engine) {
    return null;
  }

  // Count captured pieces
  const totalPieces = 22;
  let whiteCount = 0;
  let blackCount = 0;
  gameState.pieces.forEach(piece => {
    if (piece.player === 'white') whiteCount++;
    else blackCount++;
  });
  const whiteCaptured = totalPieces - whiteCount;
  const blackCaptured = totalPieces - blackCount;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Game HUD */}
        <GameHUD
          currentPlayer={gameState.currentPlayer}
          whiteCaptured={whiteCaptured}
          blackCaptured={blackCaptured}
          isThinking={isAIThinking}
          captureChainActive={gameState.captureChainActive}
          onEndChain={handleEndCaptureChain}
          onPause={handlePause}
          onResign={handleResign}
        />

        {/* Game Board */}
        <View style={styles.boardContainer}>
          <View style={styles.board}>
            {/* Board grid */}
            <BoardGrid rows={5} cols={9} cellSize={CELL_SIZE} />

            {/* Pieces */}
            {Array.from(gameState.pieces.values()).map((piece, index) => (
              <View
                key={index}
                style={[
                  styles.pieceContainer,
                  {
                    left: piece.position.col * CELL_SIZE - CELL_SIZE / 2,
                    top: piece.position.row * CELL_SIZE - CELL_SIZE / 2,
                  },
                ]}
              >
                <Piece
                  player={piece.player}
                  size={CELL_SIZE - 8}
                  selected={
                    selectedPiece?.row === piece.position.row &&
                    selectedPiece?.col === piece.position.col
                  }
                  onPress={() => handleSquarePress(piece.position)}
                  animated={false}
                />
              </View>
            ))}

            {/* Move hints */}
            {legalMoves.map((move, index) => (
              <MoveHintOverlay
                key={index}
                position={move.to}
                cellSize={CELL_SIZE}
                isCapture={!!move.capturedPieces && move.capturedPieces.length > 0}
                onPress={() => handleSquarePress(move.to)}
              />
            ))}

            {/* Touch overlay for empty squares */}
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 9 }).map((_, col) => (
                <View
                  key={`${row}-${col}`}
                  style={[
                    styles.touchSquare,
                    {
                      left: col * CELL_SIZE,
                      top: row * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    },
                  ]}
                  onTouchEnd={() => handleSquarePress({ row, col })}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Game End Modal */}
      {showGameEnd && gameState.winner && (
        <Modal
          visible={showGameEnd}
          title={
            gameState.winner === 'white' ? t.gameEnd.whiteWins : t.gameEnd.blackWins
          }
          onClose={() => setShowGameEnd(false)}
          actions={[
            { title: t.gameEnd.rematch, onPress: handleRematch },
            { title: t.gameEnd.mainMenu, onPress: () => navigation.navigate('MainMenu'), variant: 'secondary' },
          ]}
        >
          <View style={styles.gameEndContent}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <View style={[styles.statDot, { backgroundColor: theme.colors.whitePiece }]} />
                <View>
                  <View style={styles.statLabel}>White</View>
                  <View style={styles.statValue}>{whiteCount} pieces</View>
                </View>
              </View>
              <View style={styles.statBox}>
                <View style={[styles.statDot, { backgroundColor: theme.colors.blackPiece }]} />
                <View>
                  <View style={styles.statLabel}>Black</View>
                  <View style={styles.statValue}>{blackCount} pieces</View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: BOARD_PADDING,
  },
  boardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  board: {
    position: 'relative',
    width: 9 * CELL_SIZE,
    height: 5 * CELL_SIZE,
  },
  pieceContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  touchSquare: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  gameEndContent: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});