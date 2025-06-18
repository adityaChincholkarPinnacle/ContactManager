// Theme
export type ThemeMode = 'light' | 'dark' | 'system';

// User and Auth
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Contacts
export type { Contact } from './contact';

// API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Values
export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  favourite: boolean;
}
