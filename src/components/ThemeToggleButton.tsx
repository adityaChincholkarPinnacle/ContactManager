import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { useUIStore } from '../store/uiStore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggleButton: React.FC = () => {
  const theme = useTheme();
  const { themeMode, toggleThemeMode } = useUIStore();
  
  
  const nextThemeMode = themeMode === 'dark' ? 'light' : 'dark';
  
  return (
    <Tooltip 
      title={`Switch to ${nextThemeMode} mode`}
      enterDelay={300}
      arrow
    >
      <IconButton
        onClick={toggleThemeMode}
        color="inherit"
        aria-label={`Switch to ${nextThemeMode} mode`}
        sx={{
          p: 1,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(30deg)',
            backgroundColor: 'action.hover',
          },
        }}
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
