import { Contact, CreateContactDTO, UpdateContactDTO } from '../types/contact';

const API_URL = 'http://localhost:3001/contacts';

export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};


export const fetchContactById = async (id: string): Promise<Contact> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch contact');
  return response.json();
};


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


export const toggleFavourite = async (contact: Contact): Promise<Contact> => {
  return updateContact(contact.id, { favourite: !contact.favourite });
};


export const deleteContact = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete contact');
  }
};
