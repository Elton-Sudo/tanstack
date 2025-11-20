'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/auth.store';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

function LoginContent() {
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  // Show session expired message if redirected from middleware
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.error('Your session has expired. Please login again.');
    }
    if (searchParams.get('error') === 'unauthorized') {
      toast.error('You do not have permission to access that page.');
    }
  }, [searchParams]);

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      await login(data.email, data.password);

      toast.success('Welcome back!');

      // Small delay to ensure cookie is set before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to the intended page or dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';

      // Use window.location.href for a full page reload to ensure cookie is set
      // This prevents race condition where middleware checks cookie before it's set
      window.location.href = redirectTo;
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to login. Please check your credentials.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} isPending={loading} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
