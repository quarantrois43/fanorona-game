import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FanoronaEngine } from '../engine/gameEngine';
import { FanoronaAI } from '../engine/ai';
import { GameConfig, Move, GameState, PlayerStats } from '../engine/types';

interface GameContextType {
  engine: FanoronaEngine | null;
  ai: FanoronaAI | null;
  config: GameConfig | null;
  gameState: GameState | null;
  playerStats: PlayerStats;
  startGame: (config: GameConfig) => void;
  makeMove: (move: Move) => boolean;
  getAIMove: () => Move | null;
  resetGame: () => void;
  updateStats: (winner: 'white' | 'black' | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialStats: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  voninahitra: 1200,
  achievements: [],
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<FanoronaEngine | null>(null);
  const [ai, setAI] = useState<FanoronaAI | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialStats);

  const startGame = (newConfig: GameConfig) => {
    const newEngine = new FanoronaEngine(newConfig);
    setEngine(newEngine);
    setConfig(newConfig);
    setGameState(newEngine.getState());

    if (newConfig.mode === 'ai' && newConfig.difficulty) {
      const newAI = new FanoronaAI(newEngine, 'black', newConfig.difficulty);
      setAI(newAI);
    } else {
      setAI(null);
    }
  };

  const makeMove = (move: Move): boolean => {
    if (!engine) return false;
    const success = engine.makeMove(move);
    if (success) {
      setGameState({ ...engine.getState() });
    }
    return success;
  };

  const getAIMove = (): Move | null => {
    if (!ai || !engine) return null;
    return ai.getBestMove();
  };

  const resetGame = () => {
    if (config) {
      startGame(config);
    }
  };

  const updateStats = (winner: 'white' | 'black' | null) => {
    setPlayerStats(prev => {
      const newStats = { ...prev };
      newStats.gamesPlayed++;
      
      if (winner === 'white') {
        newStats.wins++;
        newStats.voninahitra += 20;
      } else if (winner === 'black') {
        newStats.losses++;
        newStats.voninahitra = Math.max(0, newStats.voninahitra - 15);
      } else {
        newStats.draws++;
        newStats.voninahitra += 5;
      }
      
      return newStats;
    });
  };

  return (
    <GameContext.Provider value={{
      engine,
      ai,
      config,
      gameState,
      playerStats,
      startGame,
      makeMove,
      getAIMove,
      resetGame,
      updateStats,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};