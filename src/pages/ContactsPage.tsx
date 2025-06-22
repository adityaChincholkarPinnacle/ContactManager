import React, { useMemo, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Contact } from '../types/contact';
import {
  Container,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fab,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Star as StarIcon, 
  StarBorder as StarBorderIcon,
  Add as AddIcon,

  Edit as EditIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/uiStore';



import { API_BASE_URL } from '../constants';

const API_URL = `${API_BASE_URL}/contacts`;


const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];


const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};

const toggleFavourite = async (contact: Contact): Promise<Contact> => {
  const response = await fetch(`${API_URL}/${contact.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favourite: !contact.favourite }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update favourite status');
  }
  
  return response.json();
};



const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ContactsPage: React.FC = () => {
  
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { setMessage } = useUIStore();
  

  const {
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,
    currentPage: page,
    setCurrentPage: setPage,
    rowsPerPage,
    setRowsPerPage,
    openContactModal
  } = useStore();
  

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 300);
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  
  
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
    setPage(0); 
  }, [debouncedSearchQuery, setSearchQuery, setPage]);
  
  
  const { 
    data: contacts = [] as Contact[], 
    isLoading, 
    isError, 
    error 
  } = useQuery<Contact[], Error>({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : 'Failed to fetch contacts', 'error');
    },
  });
  
  
  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return [];
    return contacts.filter((contact: Contact) => {
      try {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = contact.name?.toLowerCase().includes(searchLower) ?? false;
        const emailMatch = contact.email?.toLowerCase().includes(searchLower) ?? false;
        const phoneMatch = contact.phone?.includes(searchQuery) ?? false;
        const matchesSearch = nameMatch || emailMatch || phoneMatch;
        const matchesFavorites = !favoritesOnly || (contact.favourite ?? false);
        return matchesSearch && matchesFavorites;
      } catch (error) {
        console.error('Error filtering contacts:', error);
        return false;
      }
    });
  }, [contacts, searchQuery, favoritesOnly]);
  
  
  const paginatedContacts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredContacts.slice(startIndex, endIndex);
  }, [filteredContacts, page, rowsPerPage]);
  

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  
  const toggleFavoriteMutation = useMutation<Contact, Error, Contact, { previousContacts?: Contact[] }>({
    mutationFn: toggleFavourite,
    onMutate: async (updatedContact) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      
      const previousContacts = queryClient.getQueryData<Contact[]>(['contacts']) || [];
      
      queryClient.setQueryData<Contact[]>(['contacts'], (old = []) => 
        old.map(contact => 
          contact.id === updatedContact.id 
            ? { ...contact, favourite: !contact.favourite } 
            : contact
        )
      );
      
      return { previousContacts };
    },
    onError: (err, updatedContact, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
      setMessage('Failed to update contact', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  // Handle edit contact
  const handleEditContact = (contact: Contact) => {
    if (openContactModal) {
      openContactModal(contact);
    }
  };
  

  useEffect(() => {
    setPage(0);
  }, [favoritesOnly, setPage]);
  
  const handleToggleFavorite = (contact: Contact) => {
    if (!('id' in contact)) return;
    toggleFavoriteMutation.mutate(contact);
  };
  

    
  const handleAddContact = () => {
    openContactModal(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'An error occurred'}
        </Typography>
      </Box>
    );
  }

  

  
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No contacts found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddContact}
          sx={{ mt: 2 }}
        >
          Add Your First Contact
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <Paper sx={{ p: 3, mb: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
            Contacts
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <TextField
            size="small"
            placeholder="Search contacts..."
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1, color: 'text.secondary' }} />,
              sx: { minWidth: 250 }
            }}
            sx={{ mr: 2 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                color="primary"
              />
            }
            label="Favorites only"
            sx={{ whiteSpace: 'nowrap', mr: 1 }}
          />
          









        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow 
                  key={contact.id}
                  hover
                  sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.05) } }}>
      
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={contact.favourite ? 'Remove from favorites' : 'Add to favorites'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(contact)}
                          color={contact.favourite ? 'primary' : 'default'}
                          sx={{ mr: 1 }}
                          disabled={toggleFavoriteMutation.isPending}>
              
                          {contact.favourite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      {contact.name}
                    </Box>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditContact(contact)}
                      color="primary">
          
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No contacts found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={filteredContacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mt: 2 }}
        />
      </Paper>
      

      <Tooltip title="Add Contact">
        <Fab
          color="primary"
          aria-label="add contact"
          onClick={handleAddContact}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: theme.zIndex.speedDial,
            boxShadow: theme.shadows[10],
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[15],
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default ContactsPage;
