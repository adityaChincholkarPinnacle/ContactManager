import { Contact, CreateContactDTO, UpdateContactDTO } from '../types/contact';

const API_URL = 'http://localhost:3001/contacts';

// Fetch all contacts
export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};

// Fetch a single contact by ID
export const fetchContactById = async (id: string): Promise<Contact> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch contact');
  return response.json();
};

// Create a new contact
export const createContact = async (contactData: CreateContactDTO): Promise<Contact> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create contact');
  }
  
  return response.json();
};

// Update an existing contact
export const updateContact = async (id: string, contactData: UpdateContactDTO): Promise<Contact> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update contact');
  }
  
  return response.json();
};

// Toggle favorite status
export const toggleFavourite = async (contact: Contact): Promise<Contact> => {
  return updateContact(contact.id, { favourite: !contact.favourite });
};

// Delete a contact
export const deleteContact = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete contact');
  }
};
