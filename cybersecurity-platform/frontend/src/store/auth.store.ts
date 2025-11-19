import { getUser, isAuthenticated } from '@/lib/auth';
import { User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  initialize: () => {
    const authenticated = isAuthenticated();
    const user = getUser();
    set({
      user: authenticated ? user : null,
      isAuthenticated: authenticated,
    });
  },
}));
