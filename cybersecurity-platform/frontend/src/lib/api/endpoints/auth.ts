import { apiClient } from '../client';

// ============================================
// Types
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    mfaEnabled: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    tenant?: {
      id: string;
      name: string;
      slug: string;
      logo?: string;
      primaryColor?: string;
      secondaryColor?: string;
      favicon?: string;
    };
  };
  requiresMfa: boolean;
  sessionId?: string; // For MFA flow
}

export interface MfaVerification {
  code: string;
  sessionId: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
  tenantName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface MfaSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

// ============================================
// Auth API Endpoints
// ============================================

export const authApi = {
  /**
   * Login with email and password
   */
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  /**
   * Verify MFA code
   */
  verifyMfa: (data: MfaVerification) => apiClient.post<LoginResponse>('/auth/mfa/verify', data),

  /**
   * Register new user
   */
  register: (data: RegisterData) => apiClient.post('/auth/register', data),

  /**
   * Logout current user
   */
  logout: () => apiClient.post('/auth/logout', {}),

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  /**
   * Request password reset email
   */
  forgotPassword: (data: ForgotPasswordData) => apiClient.post('/auth/forgot-password', data),

  /**
   * Reset password with token
   */
  resetPassword: (data: ResetPasswordData) => apiClient.post('/auth/reset-password', data),

  /**
   * Verify email with token
   */
  verifyEmail: (data: VerifyEmailData) => apiClient.post('/auth/verify-email', data),

  /**
   * Resend verification email
   */
  resendVerification: (email: string) => apiClient.post('/auth/resend-verification', { email }),

  /**
   * Get current session
   */
  getSession: () => apiClient.get<LoginResponse['user']>('/auth/session'),

  /**
   * Setup MFA (get QR code)
   */
  setupMfa: () => apiClient.post<MfaSetupResponse>('/auth/mfa/setup', {}),

  /**
   * Enable MFA with verification code
   */
  enableMfa: (code: string) => apiClient.post('/auth/mfa/enable', { code }),

  /**
   * Disable MFA with verification code
   */
  disableMfa: (code: string) => apiClient.post('/auth/mfa/disable', { code }),

  /**
   * Change password
   */
  changePassword: (data: ChangePasswordData) => apiClient.post('/auth/change-password', data),

  /**
   * Get login history
   */
  getLoginHistory: () => apiClient.get('/auth/login-history'),

  /**
   * Revoke session
   */
  revokeSession: (sessionId: string) => apiClient.delete(`/auth/sessions/${sessionId}`),

  /**
   * Revoke all sessions except current
   */
  revokeAllSessions: () => apiClient.post('/auth/revoke-all-sessions', {}),
};
