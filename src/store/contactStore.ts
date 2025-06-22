import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '../types/contact';

interface ContactStore {

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  

  favouritesOnly: boolean;
  toggleFavouritesOnly: () => void;
  

  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;

  
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  
  
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const useContactStore = create<ContactStore>()(
  persist(
    (set) => ({
      
      searchQuery: '',
      favouritesOnly: false,
      currentPage: 1,
      viewMode: 'list' as const,
      selectedContact: null,
      isContactModalOpen: false,
    
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleFavouritesOnly: () => 
        set((state) => ({ 
          favouritesOnly: !state.favouritesOnly,
          currentPage: 1 
        })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedContact: (contact) => set({ selectedContact: contact }),
      
      openContactModal: () => set({ isContactModalOpen: true }),
      
      closeContactModal: () => set({ 
        isContactModalOpen: false,
        selectedContact: null 
      }),
    }),
    {
      name: 'contact-storage',
      partialize: (state) => ({

        viewMode: state.viewMode,
        favouritesOnly: state.favouritesOnly,
      })
    }
  )
);

export { useContactStore };
