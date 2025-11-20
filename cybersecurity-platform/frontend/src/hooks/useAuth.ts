import { authApi } from '@/lib/api/endpoints/auth';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ============================================
// Query Keys
// ============================================

export const authKeys = {
  session: ['session'] as const,
  loginHistory: ['login-history'] as const,
};

// ============================================
// Login Hook
// ============================================

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.requiresMfa) {
        // Store session ID for MFA verification
        if (data.sessionId) {
          localStorage.setItem('mfa_session_id', data.sessionId);
        }
        router.push('/auth/mfa');
        toast.success('Please enter your MFA code');
      } else {
        // Store tokens
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);

        // Update auth store
        setUser(data.user as any);

        // Cache user data
        queryClient.setQueryData(authKeys.session, data.user);

        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
}

// ============================================
// MFA Verification Hook
// ============================================

export function useVerifyMfa() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.verifyMfa,
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      // Clear MFA session ID
      localStorage.removeItem('mfa_session_id');

      // Update auth store
      setUser(data.user as any);

      // Cache user data
      queryClient.setQueryData(authKeys.session, data.user);

      toast.success('Authentication successful!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Invalid verification code');
    },
  });
}

// ============================================
// Register Hook
// ============================================

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
}

// ============================================
// Logout Hook
// ============================================

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // Clear auth store
      clearUser();

      // Clear all queries
      queryClient.clear();

      toast.success('Logged out successfully');
      router.push('/auth/login');
    },
    onError: () => {
      // Even if the API call fails, still log out locally
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      clearUser();
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

// ============================================
// Session Hook
// ============================================

export function useSession() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const user = await authApi.getSession();
      setUser(user as any);
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// Forgot Password Hook
// ============================================

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent. Check your inbox.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    },
  });
}

// ============================================
// Reset Password Hook
// ============================================

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in.');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
}

// ============================================
// Verify Email Hook
// ============================================

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Email verification failed');
    },
  });
}

// ============================================
// Resend Verification Hook
// ============================================

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    },
  });
}

// ============================================
// Change Password Hook
// ============================================

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
}

// ============================================
// MFA Setup Hook
// ============================================

export function useMfaSetup() {
  return useMutation({
    mutationFn: authApi.setupMfa,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to setup MFA');
    },
  });
}

// ============================================
// Enable MFA Hook
// ============================================

export function useEnableMfa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.enableMfa,
    onSuccess: () => {
      toast.success('MFA enabled successfully');
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enable MFA');
    },
  });
}

// ============================================
// Disable MFA Hook
// ============================================

export function useDisableMfa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.disableMfa,
    onSuccess: () => {
      toast.success('MFA disabled successfully');
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to disable MFA');
    },
  });
}

// ============================================
// Login History Hook
// ============================================

export function useLoginHistory() {
  return useQuery({
    queryKey: authKeys.loginHistory,
    queryFn: authApi.getLoginHistory,
  });
}

// ============================================
// Revoke Session Hook
// ============================================

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.revokeSession,
    onSuccess: () => {
      toast.success('Session revoked successfully');
      queryClient.invalidateQueries({ queryKey: authKeys.loginHistory });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke session');
    },
  });
}

// ============================================
// Revoke All Sessions Hook
// ============================================

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.revokeAllSessions,
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      toast.success('All sessions revoked. Please log in again.');
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke sessions');
    },
  });
}
