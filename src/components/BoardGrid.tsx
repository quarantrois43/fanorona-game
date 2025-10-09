import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface BoardGridProps {
  rows: number;
  cols: number;
  cellSize: number;
}

export const BoardGrid: React.FC<BoardGridProps> = ({ rows, cols, cellSize }) => {
  const { theme } = useTheme();
  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;

  // Generate intersection points
  const intersections: Array<{ row: number; col: number; hasDiagonal: boolean }> = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      intersections.push({
        row,
        col,
        hasDiagonal: (row + col) % 2 === 0,
      });
    }
  }

  return (
    <View style={[styles.container, { width: boardWidth, height: boardHeight }]}>
      {/* Background */}
      <View
        style={[
          styles.background,
          { backgroundColor: theme.colors.boardBackground, width: boardWidth, height: boardHeight },
        ]}
      />

      {/* Grid lines */}
      <Svg width={boardWidth} height={boardHeight} style={styles.svg}>
        {/* Horizontal lines */}
        {Array.from({ length: rows }).map((_, row) => (
          <Line
            key={`h-${row}`}
            x1="0"
            y1={row * cellSize}
            x2={boardWidth}
            y2={row * cellSize}
            stroke={theme.colors.boardLine}
            strokeWidth="2"
          />
        ))}

        {/* Vertical lines */}
        {Array.from({ length: cols }).map((_, col) => (
          <Line
            key={`v-${col}`}
            x1={col * cellSize}
            y1="0"
            x2={col * cellSize}
            y2={boardHeight}
            stroke={theme.colors.boardLine}
            strokeWidth="2"
          />
        ))}

        {/* Diagonal lines */}
        {intersections.map(({ row, col, hasDiagonal }) => {
          if (!hasDiagonal) return null;
          
          const elements = [];
          
          // Diagonal down-right
          if (row < rows - 1 && col < cols - 1) {
            elements.push(
              <Line
                key={`d1-${row}-${col}`}
                x1={col * cellSize}
                y1={row * cellSize}
                x2={(col + 1) * cellSize}
                y2={(row + 1) * cellSize}
                stroke={theme.colors.boardLine}
                strokeWidth="2"
              />
            );
          }
          
          // Diagonal down-left
          if (row < rows - 1 && col > 0) {
            elements.push(
              <Line
                key={`d2-${row}-${col}`}
                x1={col * cellSize}
                y1={row * cellSize}
                x2={(col - 1) * cellSize}
                y2={(row + 1) * cellSize}
                stroke={theme.colors.boardLine}
                strokeWidth="2"
              />
            );
          }
          
          return elements;
        })}

        {/* Intersection points */}
        {intersections.map(({ row, col }) => (
          <Circle
            key={`p-${row}-${col}`}
            cx={col * cellSize}
            cy={row * cellSize}
            r="3"
            fill={theme.colors.boardLine}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
  },
  svg: {
    position: 'absolute',
  },
});