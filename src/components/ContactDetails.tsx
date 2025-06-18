import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Avatar, 
  IconButton,
  useTheme
} from '@mui/material';
import { Contact } from '../types';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { useStore } from '../store/useStore';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 96,
  height: 96,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '2rem',
  fontWeight: 500,
  marginBottom: theme.spacing(2),
}));

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box mb={3}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || '—'}
    </Typography>
  </Box>
);

interface ContactDetailsProps {
  contact: Contact | null;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact }) => {
  const theme = useTheme();
  const openContactModal = useStore((state) => state.openContactModal);

  if (!contact) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100%"
        p={3}
      >
        <Typography color="text.secondary">
          Select a contact to view details
        </Typography>
      </Box>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box p={4} height="100%" overflow="auto">
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <StyledAvatar>
          {getInitials(contact.name)}
        </StyledAvatar>
        <Box display="flex" alignItems="center" mt={1} mb={3}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            {contact.name}
          </Typography>
          <IconButton 
            onClick={() => openContactModal(contact)}
            sx={{ ml: 1, color: theme.palette.primary.main }}
            aria-label="Edit contact"
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />
      
      <Box>
        <DetailRow label="Email" value={contact.email} />
        <DetailRow label="Phone" value={contact.phone} />
        <DetailRow 
          label="Status" 
          value={contact.favourite ? 'Favorited' : 'Not in favorites'} 
        />
      </Box>
    </Box>
  );
};

export default ContactDetails;
