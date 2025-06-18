import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { ThemeMode } from '../types';

// Extend the Theme interface to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      drawerWidth: number;
      appBarHeight: number;
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      drawerWidth?: number;
      appBarHeight?: number;
    };
  }
}

// Custom theme settings that don't change between modes
const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  custom: {
    drawerWidth: 260,
    appBarHeight: 64,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
};

// Light theme settings
const lightTheme: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
};

// Dark theme settings
const darkTheme: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          '&:hover': {
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.3)',
          },
        },
      },
    },
  },
};

/**
 * Creates a theme based on the specified mode
 * @param mode - The theme mode ('light' | 'dark' | 'system')
 * @param prefersDarkMode - Whether the system prefers dark mode (for 'system' mode)
 * @returns A configured Material-UI theme
 */
export const createAppTheme = (
  mode: ThemeMode = 'light',
  prefersDarkMode = false
): Theme => {
  const resolvedMode = mode === 'system' 
    ? prefersDarkMode ? 'dark' : 'light' 
    : mode;
    
  return createTheme(resolvedMode === 'dark' ? darkTheme : lightTheme);
};

// Export theme type for use in components
export type AppTheme = Theme;
