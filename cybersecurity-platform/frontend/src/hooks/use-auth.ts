import { authService } from '@/services/auth.service';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyMFARequest,
} from '@/types/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const queryClient = useQueryClient();

  return {
    // Get current user profile
    useProfile: () => {
      return useQuery({
        queryKey: ['profile'],
        queryFn: authService.getProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      });
    },

    // Login mutation
    useLogin: () => {
      return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
      });
    },

    // Register mutation
    useRegister: () => {
      return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
      });
    },

    // Logout mutation
    useLogout: () => {
      return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
          queryClient.clear();
          // Redirect will be handled by API client interceptor
        },
      });
    },

    // Update profile mutation
    useUpdateProfile: () => {
      return useMutation({
        mutationFn: (data: Partial<User>) => authService.updateProfile(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
      });
    },

    // Change password mutation
    useChangePassword: () => {
      return useMutation({
        mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
      });
    },

    // Forgot password mutation
    useForgotPassword: () => {
      return useMutation({
        mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
      });
    },

    // Reset password mutation
    useResetPassword: () => {
      return useMutation({
        mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
      });
    },

    // Enable MFA mutation
    useEnableMFA: () => {
      return useMutation({
        mutationFn: authService.enableMFA,
      });
    },

    // Verify MFA mutation
    useVerifyMFA: () => {
      return useMutation({
        mutationFn: (data: VerifyMFARequest) => authService.verifyMFA(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
      });
    },

    // Disable MFA mutation
    useDisableMFA: () => {
      return useMutation({
        mutationFn: (data: VerifyMFARequest) => authService.disableMFA(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
      });
    },
  };
};
