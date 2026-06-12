import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

// Instanciación nativa en v4
const storage = createMMKV();

// Adaptador de MMKV para Zustand (Actualizado para v4)
const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => storage.remove(name), // Cambio crítico: en v4 ya no es delete(), es remove()
};

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; 
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (token, userData) => {
        await Keychain.setGenericPassword('token', token);
        set({ isAuthenticated: true, user: userData });
      },

      logout: async () => {
        await Keychain.resetGenericPassword();
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);