/**
 * Protected Route HOC
 * Wraps components that require authentication
 */

'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const isLoading = !isAuthenticated && !user;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=' + window.location.pathname);
    }
  }, [isAuthenticated, isLoading, router]);

  // Check role-based access
  useEffect(() => {
    if (isAuthenticated && user && requiredRole && requiredRole.length > 0) {
      const hasRequiredRole = requiredRole.includes(user.role);
      if (!hasRequiredRole) {
        // User doesn't have required role, redirect to dashboard with error
        router.push('/dashboard?error=unauthorized');
      }
    }
  }, [isAuthenticated, user, requiredRole, router]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check role if required
  if (requiredRole && requiredRole.length > 0 && user) {
    const hasRequiredRole = requiredRole.includes(user.role);
    if (!hasRequiredRole) {
      return null; // Will redirect
    }
  }

  return <>{children}</>;
}
