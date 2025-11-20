import { getUser, isAuthenticated, removeToken } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { LoginRequest, User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  login: async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    set({
      user: response.user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await authService.logout();
    removeToken();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
