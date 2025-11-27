const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

/**
 * Decode JWT token to get expiration time
 */
const getTokenExpiration = (token: string): number => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return 60 * 60; // Default to 1 hour

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    if (decoded.exp) {
      // exp is in seconds, calculate max-age in seconds
      const maxAge = decoded.exp - Math.floor(Date.now() / 1000);
      return maxAge > 0 ? maxAge : 60 * 60; // Default to 1 hour if expired
    }

    return 60 * 60; // Default to 1 hour
  } catch (error) {
    console.error('Failed to decode token expiration:', error);
    return 60 * 60; // Default to 1 hour
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    // Set cookie for middleware with expiration matching JWT token
    const maxAge = getTokenExpiration(token);

    // Optional: remove debug logs in production

    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Clear cookies
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
