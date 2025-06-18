import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ThemeMode } from '../types';

type MessageType = 'error' | 'success' | 'info' | 'warning';

interface UIMessage {
  text: string;
  type: MessageType;
}

interface UIStore {
  // Theme
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Messages
  message: UIMessage | null;
  setMessage: (text: string, type?: MessageType) => void;
  clearMessage: () => void;
  
  // Contact Modal
  isContactModalOpen: boolean;
  selectedContact: any | null;
  openContactModal: (contact?: any) => void;
  closeContactModal: () => void;
  
  // Backward compatibility
  globalError: string | null;
  setGlobalError: (message: string) => void;
  clearGlobalError: () => void;
}

const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      themeMode: 'light',
      message: null,
      globalError: null, // For backward compatibility
      isContactModalOpen: false,
      selectedContact: null,
      
      // Theme actions
      toggleThemeMode: () => set((state) => ({
        themeMode: state.themeMode === 'light' ? 'dark' : 'light'
      })),
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      
      // Message actions
      setMessage: (text, type = 'error') => set({
        message: { text, type },
        globalError: type === 'error' ? text : null // For backward compatibility
      }),
      clearMessage: () => set({ message: null }),
      
      // Contact Modal actions
      openContactModal: (contact = null) => set({ 
        isContactModalOpen: true,
        selectedContact: contact 
      }),
      closeContactModal: () => set({ 
        isContactModalOpen: false,
        selectedContact: null 
      }),
      
      // Backward compatibility methods
      setGlobalError: (text) => set({ 
        globalError: text,
        message: { text, type: 'error' } 
      }),
      clearGlobalError: () => set({ 
        globalError: null,
        message: null 
      }),
    }),
    {
      name: 'ui-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist theme-related state
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);

export { useUIStore };
