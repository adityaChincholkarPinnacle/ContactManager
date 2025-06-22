import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Contact, User } from '../types';

interface AppState {
  
  user: User | null;
  isAuthenticated: boolean;
  
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  
  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  
  
  selectedContact: Contact | null;
  isModalOpen: boolean;
  isCreateMode: boolean;
  
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  

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
      
      
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      
      setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 0 }),
      setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly, currentPage: 0 }),
      
      setCurrentPage: (currentPage) => set({ currentPage }),
      setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, currentPage: 0 }),
      
      
      openContactModal: (contact) => set({ 
        selectedContact: contact, 
        isModalOpen: true, 
        isCreateMode: !contact 
      }),
      
      closeContactModal: () => set({ 
        isModalOpen: false,
       
      }),
      
      
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
      
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favoritesOnly: state.favoritesOnly,
        rowsPerPage: state.rowsPerPage,
      }),
    }
  )
);
