/**
 * Sidebar State Management Hook
 * Manages sidebar collapsed/expanded state with localStorage persistence
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

/**
 * Zustand store for sidebar state
 * Persists collapsed state to localStorage
 */
export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      mobileOpen: false,

      toggle: () => set((state) => ({ collapsed: !state.collapsed })),

      collapse: () => set({ collapsed: true }),

      expand: () => set({ collapsed: false }),

      toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),

      closeMobile: () => set({ mobileOpen: false }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ collapsed: state.collapsed }),
    },
  ),
);
