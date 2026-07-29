import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SaasSubscription } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  subscription: SaasSubscription | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, subscription?: SaasSubscription | null) => void;
  setSubscription: (subscription: SaasSubscription | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      subscription: null,
      isAuthenticated: false,

      setAuth: (token, user, subscription = null) =>
        set({
          token,
          user,
          subscription,
          isAuthenticated: true,
        }),

      setSubscription: (subscription) =>
        set({ subscription }),

      logout: () =>
        set({
          token: null,
          user: null,
          subscription: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'versagym-auth-storage',
    }
  )
);
