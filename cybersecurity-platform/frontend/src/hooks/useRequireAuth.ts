/**
 * useRequireAuth Hook
 * Custom hook to ensure user is authenticated
 * Redirects to login if not authenticated
 */

'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseRequireAuthOptions {
  requiredRole?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requiredRole, redirectTo = '/login', onUnauthorized } = options;
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      const loginUrl = `${redirectTo}?redirect=${window.location.pathname}`;
      router.push(loginUrl);
      return;
    }

    // Check role-based access
    if (requiredRole && requiredRole.length > 0 && user) {
      const hasRequiredRole = requiredRole.includes(user.role);
      if (!hasRequiredRole) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Default: redirect to dashboard with error
          router.push('/dashboard?error=unauthorized');
        }
      }
    }
  }, [isAuthenticated, user, requiredRole, redirectTo, router, onUnauthorized]);

  return {
    user,
    isAuthenticated,
    isLoading: !isAuthenticated && !user,
  };
}
