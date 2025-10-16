export interface Theme {
    name: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      // Board colors
      boardBackground: string;
      boardLine: string;
      lightSquare: string;
      darkSquare: string;
      whitePiece: string;
      blackPiece: string;
      selectedPiece: string;
      legalMoveHint: string;
      captureHint: string;
      lastMove: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    typography: {
      h1: { fontSize: number; fontWeight: string };
      h2: { fontSize: number; fontWeight: string };
      h3: { fontSize: number; fontWeight: string };
      body: { fontSize: number; fontWeight: string };
      caption: { fontSize: number; fontWeight: string };
    };
    borderRadius: {
      sm: number;
      md: number;
      lg: number;
      full: number;
    };
  }
  
  export const lightTheme: Theme = {
    name: 'light',
    colors: {
      primary: '#2D5F8D',
      secondary: '#8B4513',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#212121',
      textSecondary: '#757575',
      border: '#E0E0E0',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      boardBackground: '#DEB887',
      boardLine: '#8B4513',
      lightSquare: '#F0E68C',
      darkSquare: '#DAA520',
      whitePiece: '#FFFFFF',
      blackPiece: '#2C2C2C',
      selectedPiece: '#4CAF50',
      legalMoveHint: '#81C784',
      captureHint: '#FF5252',
      lastMove: '#FFD54F',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 16,
      full: 9999,
    },
  };
  
  export const darkTheme: Theme = {
    name: 'dark',
    colors: {
      primary: '#4A90E2',
      secondary: '#D4A574',
      background: '#1A1A2E',
      surface: '#16213E',
      text: '#E8E8E8',
      textSecondary: '#B0B0B0',
      border: '#2C3E50',
      success: '#66BB6A',
      error: '#EF5350',
      warning: '#FFA726',
      info: '#42A5F5',
      boardBackground: '#3E2723',
      boardLine: '#D4A574',
      lightSquare: '#5D4037',
      darkSquare: '#4E342E',
      whitePiece: '#ECEFF1',
      blackPiece: '#1C1C1C',
      selectedPiece: '#66BB6A',
      legalMoveHint: '#81C784',
      captureHint: '#FF6B6B',
      lastMove: '#FFB74D',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 16,
      full: 9999,
    },
  };