import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ThemeMode } from '../types';

type MessageType = 'error' | 'success' | 'info' | 'warning';

interface UIMessage {
  text: string;
  type: MessageType;
}

interface UIStore {
  
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  
  
  message: UIMessage | null;
  setMessage: (text: string, type?: MessageType) => void;
  clearMessage: () => void;
  
  
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

      themeMode: 'light',
      message: null,
      globalError: null, 
      isContactModalOpen: false,
      selectedContact: null,
      
      
      toggleThemeMode: () => set((state) => ({
        themeMode: state.themeMode === 'light' ? 'dark' : 'light'
      })),
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      
    
      setMessage: (text, type = 'error') => set({
        message: { text, type },
        globalError: type === 'error' ? text : null 
      }),
      clearMessage: () => set({ message: null }),
      
      
      openContactModal: (contact = null) => set({ 
        isContactModalOpen: true,
        selectedContact: contact 
      }),
      closeContactModal: () => set({ 
        isContactModalOpen: false,
        selectedContact: null 
      }),
      
      
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
      name: 'ui-storage', 
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);

export { useUIStore };
