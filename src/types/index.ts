
export type ThemeMode = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type { Contact } from './contact';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  favourite: boolean;
}
