import { authServiceClient } from '@/lib/api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EnableMFAResponse,
  VerifyMFARequest,
  User,
} from '@/types/auth';
import { setToken, setRefreshToken, setUser, removeToken } from '@/lib/auth';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await authServiceClient.post<LoginResponse>('/auth/login', data);
    const { token, refreshToken, user } = response.data;

    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);

    return response.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await authServiceClient.post<LoginResponse>('/auth/register', data);
    const { token, refreshToken, user } = response.data;

    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await authServiceClient.post('/auth/logout');
    } finally {
      removeToken();
    }
  },

  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await authServiceClient.post<LoginResponse>('/auth/refresh', data);
    const { token, refreshToken } = response.data;

    setToken(token);
    setRefreshToken(refreshToken);

    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await authServiceClient.get<User>('/auth/profile');
    setUser(response.data);
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await authServiceClient.put<User>('/auth/profile', data);
    setUser(response.data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await authServiceClient.post('/auth/change-password', data);
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await authServiceClient.post('/auth/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await authServiceClient.post('/auth/reset-password', data);
  },

  async enableMFA(): Promise<EnableMFAResponse> {
    const response = await authServiceClient.post<EnableMFAResponse>('/auth/mfa/enable');
    return response.data;
  },

  async verifyMFA(data: VerifyMFARequest): Promise<void> {
    await authServiceClient.post('/auth/mfa/verify', data);
  },

  async disableMFA(data: VerifyMFARequest): Promise<void> {
    await authServiceClient.post('/auth/mfa/disable', data);
  },
};
