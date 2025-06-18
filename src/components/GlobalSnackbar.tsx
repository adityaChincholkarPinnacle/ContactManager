import React, { useEffect } from 'react';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { useUIStore } from '../store/uiStore';

type TransitionProps = Omit<SlideProps, 'direction'>;

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const GlobalSnackbar: React.FC = () => {
  const { message, clearMessage } = useUIStore();
  const [open, setOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState<Array<{ message: string; type: string }>>([]);

  useEffect(() => {
    if (message) {
      setSnackPack((prev) => [...prev, { message: message.text, type: message.type }]);
      setOpen(true);
    }
  }, [message]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    clearMessage();
    setSnackPack((prev) => prev.slice(1));
  };

  const currentMessage = snackPack[0];

  return (
    <Snackbar
      key={currentMessage?.message}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: '300px',
          boxShadow: 3,
        },
        '& .MuiAlert-root': {
          width: '100%',
          alignItems: 'center',
        },
        zIndex: 1400, // Higher than FAB (which is typically 1050-1100)
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity={currentMessage?.type as any || 'info'}
        elevation={6}
        variant="filled"
      >
        {currentMessage?.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
