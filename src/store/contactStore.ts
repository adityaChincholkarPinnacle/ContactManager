import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '../types/contact';

interface ContactStore {
  // Search and filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Favorites
  favouritesOnly: boolean;
  toggleFavouritesOnly: () => void;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  // View mode
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  
  // Selected contact
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  
  // Contact modal
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const useContactStore = create<ContactStore>()(
  persist(
    (set) => ({
      // Initial state
      searchQuery: '',
      favouritesOnly: false,
      currentPage: 1,
      viewMode: 'list' as const,
      selectedContact: null,
      isContactModalOpen: false,
      
      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleFavouritesOnly: () => 
        set((state) => ({ 
          favouritesOnly: !state.favouritesOnly,
          currentPage: 1 // Reset to first page when toggling favorites
        })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedContact: (contact) => set({ selectedContact: contact }),
      
      openContactModal: () => set({ isContactModalOpen: true }),
      
      closeContactModal: () => set({ 
        isContactModalOpen: false,
        selectedContact: null // Reset selected contact when closing modal
      }),
    }),
    {
      name: 'contact-storage',
      partialize: (state) => ({
        // Only persist these states
        viewMode: state.viewMode,
        favouritesOnly: state.favouritesOnly,
      })
    }
  )
);

export { useContactStore };
