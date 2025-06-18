import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox, FormControlLabel, Button,
  IconButton, Snackbar, Alert, Box, Stack, DialogContentText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contact } from '../types';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/uiStore';

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{7,15}$/, 'Phone must contain 7-15 digits')
    .required('Phone is required'),
  favourite: yup.boolean(),
});

type FormValues = Omit<Contact, 'id'>;

const ContactModal: React.FC = () => {
  const queryClient = useQueryClient();
  const selectedContact = useStore((s) => s.selectedContact);
  const isCreateMode = useStore((s) => s.isCreateMode);
  const isModalOpen = useStore((s) => s.isModalOpen);
  const closeContactModal = useStore((s) => s.closeContactModal);

  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const setGlobalError = useUIStore((s) => s.setGlobalError);

  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    // @ts-ignore - yupResolver type issue
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      favourite: false,
    },
  });

  React.useEffect(() => {
    if (selectedContact) {
      reset({
        name: selectedContact.name,
        email: selectedContact.email,
        phone: selectedContact.phone,
        favourite: selectedContact.favourite,
      });
    } else if (isCreateMode) {
      reset({
        name: '',
        email: '',
        phone: '',
        favourite: false,
      });
    }
  }, [selectedContact, isCreateMode, reset]);

  // Create mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Contact) => {
      try {
        const res = await fetch(`http://localhost:3001/contacts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update contact');
        return res.json();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update contact';
        setGlobalError(errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeContactModal();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const res = await fetch('http://localhost:3001/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create contact');
        return res.json();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create contact';
        setGlobalError(errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeContactModal();
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      try {
        const res = await fetch(`http://localhost:3001/contacts/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete contact');
        return res.json();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
        setGlobalError(errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeContactModal();
    },
  });

  const onSubmit = (data: unknown) => {
    const formData = data as FormValues;
    if (isCreateMode) {
      createMutation.mutate(formData);
    } else if (selectedContact) {
      updateMutation.mutate({ ...selectedContact, ...formData });
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeContactModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {isCreateMode ? 'Add New Contact' : 'Edit Contact'}
              <IconButton edge="end" onClick={closeContactModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    type="tel"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="favourite"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} color="warning" />}
                    label="Favourite"
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            {!isCreateMode && (
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirm(true)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            )}
            <Button onClick={closeContactModal}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || createMutation.status === 'pending' || updateMutation.status === 'pending'}
            >
              {isCreateMode ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contact? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              const handleDelete = () => {
                try {
                  if (selectedContact) {
                    deleteMutation.mutate(selectedContact.id);
                  }
                } catch (error) {
                  // Error is already handled in the mutation onError
                }
              };
              handleDelete();
              setDeleteConfirm(false);
            }}
            disabled={deleteMutation.status === 'pending'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={false}
        autoHideDuration={3000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
          {' '}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactModal;
