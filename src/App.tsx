import { useEffect, useMemo } from 'react';
import { Box, Container, CssBaseline, Typography, LinearProgress, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { createAppTheme } from './theme/theme';
import ContactsPage from './pages/ContactsPage';
import GlobalSnackbar from './components/GlobalSnackbar';
import ContactModal from './components/ContactModal';
import { useUIStore } from './store/uiStore';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const isFetching = useIsFetching();
  const { themeMode, setThemeMode } = useUIStore();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Update theme mode based on system preference if set to 'system'
  useEffect(() => {
    if (themeMode === 'system') {
      setThemeMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [themeMode, prefersDarkMode, setThemeMode]);

  // Create theme with current mode
  const theme = useMemo(
    () => createAppTheme(themeMode, prefersDarkMode),
    [themeMode, prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        {isFetching > 0 && (
          <LinearProgress 
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              height: 4,
            }}
          />
        )}
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              my: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1">
              Contact Manager
            </Typography>
            <ThemeToggleButton />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/contacts" replace />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </Box>
        </Container>
        <ContactModal />
        <GlobalSnackbar />
      </Router>
    </ThemeProvider>
  );
}

export default App;
