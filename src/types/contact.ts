export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  favourite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactDTO extends Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateContactDTO extends Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface ContactFilters {
  search?: string;
  favouritesOnly?: boolean;
  page?: number;
  limit?: number;
}
