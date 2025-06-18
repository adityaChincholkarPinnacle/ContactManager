import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Contact, User } from '../types';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Contacts page state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  
  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  
  // Contact modal state
  selectedContact: Contact | null;
  isModalOpen: boolean;
  isCreateMode: boolean;
  
  // Auth actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  
  // Contact actions
  openContactModal: (contact: Contact | null) => void;
  closeContactModal: () => void;
  resetContactState: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  searchQuery: '',
  favoritesOnly: false,
  currentPage: 0,
  rowsPerPage: 10,
  selectedContact: null,
  isModalOpen: false,
  isCreateMode: false,
} as const;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Auth actions
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      // Search and filter
      setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 0 }),
      setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly, currentPage: 0 }),
      
      // Pagination
      setCurrentPage: (currentPage) => set({ currentPage }),
      setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, currentPage: 0 }),
      
      // Contact modal actions
      openContactModal: (contact) => set({ 
        selectedContact: contact, 
        isModalOpen: true, 
        isCreateMode: !contact 
      }),
      
      closeContactModal: () => set({ 
        isModalOpen: false,
        // Don't clear selectedContact immediately to allow for exit animations
      }),
      
      // Reset state when needed (e.g., on logout)
      resetContactState: () => set({
        searchQuery: '',
        favoritesOnly: false,
        currentPage: 0,
        selectedContact: null,
        isModalOpen: false,
        isCreateMode: false,
      }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favoritesOnly: state.favoritesOnly,
        rowsPerPage: state.rowsPerPage,
      }),
    }
  )
);
