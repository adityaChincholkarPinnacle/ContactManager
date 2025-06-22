import React from 'react';
import { 
  Avatar, 
  IconButton, 
  ListItem, 
  ListItemAvatar, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  useTheme,
  alpha,
  Tooltip,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Contact } from '../types';
import { useStore } from '../store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFavourite } from '../services/contactService';
import { useUIStore } from '../store/uiStore';

interface ContactCardProps {
  contact: Contact;
  selected?: boolean;
  onClick?: () => void;
}

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1.1rem',
  fontWeight: 500,
}));

const ContactCard: React.FC<ContactCardProps> = ({ contact, selected = false, onClick }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const setGlobalError = useUIStore((s) => s.setGlobalError);
  const openContactModal = useStore((state) => state.openContactModal);

  const contactCardToggleFavouriteMutation = useMutation({
    mutationFn: (contact: Contact) => toggleFavourite({
      ...contact,
      favourite: !contact.favourite
    }),
    onMutate: async (contact: Contact) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['contacts'] });

      
      const previousContacts = queryClient.getQueryData<Contact[]>(['contacts']);

      
      if (previousContacts) {
        queryClient.setQueryData<Contact[]>(['contacts'], 
          previousContacts.map(c => 
            c.id === contact.id 
              ? { ...c, favourite: !c.favourite } 
              : c
          )
        );
      }

      return { previousContacts };
    },
    onError: (err, updatedContact, context) => {
      
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
      setGlobalError('Failed to update favourite status');
    },
    onSettled: () => {
      
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    contactCardToggleFavouriteMutation.mutate(contact);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openContactModal(contact);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <StyledListItem 
      selected={selected}
      disablePadding
      secondaryAction={
        <Tooltip 
          title={contact.favourite ? 'Remove from favorites' : 'Add to favorites'}
          arrow
          TransitionComponent={Zoom}
        >
          <IconButton
            edge="end"
            onClick={handleToggleFavourite}
            disabled={contactCardToggleFavouriteMutation.isPending}
            sx={{
              color: contact.favourite ? theme.palette.warning.main : theme.palette.action.active,
              '&:hover': {
                color: theme.palette.warning.main,
                backgroundColor: alpha(theme.palette.warning.main, 0.08)
              }
            }}
          >
            {contact.favourite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
      }
    >
      <ListItemButton 
        onClick={handleClick}
        sx={{ 
          borderRadius: 2,
          py: 1.5,
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <ListItemAvatar>
          <StyledAvatar>
            {getInitials(contact.name)}
          </StyledAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              component="div"
              fontWeight={500}
              noWrap
            >
              {contact.name}
            </Typography>
          }
          secondary={
            <Typography 
              variant="body2" 
              color="text.secondary"
              noWrap
            >
              {contact.email}
            </Typography>
          }
          sx={{ my: 0, overflow: 'hidden' }}
        />
      </ListItemButton>
    </StyledListItem>
  );
};

export default ContactCard;
