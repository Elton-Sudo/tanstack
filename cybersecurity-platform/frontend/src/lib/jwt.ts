/**
 * JWT Token Utilities
 * Provides functions to decode and validate JWT tokens
 */

interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
}

/**
 * Decode a JWT token without verification
 * Note: This is for client-side use only. Server-side verification should be done by the backend.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Get user role from JWT token
 */
export function getRoleFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.role || null;
}

/**
 * Check if user has required role
 */
export function hasRole(token: string, requiredRole: string): boolean {
  const role = getRoleFromToken(token);
  return role === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(token: string, requiredRoles: string[]): boolean {
  const role = getRoleFromToken(token);
  return role ? requiredRoles.includes(role) : false;
}

/**
 * Admin role constants
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const;

/**
 * Check if user is admin (SUPER_ADMIN or TENANT_ADMIN)
 */
export function isAdmin(token: string): boolean {
  return hasAnyRole(token, [ROLES.SUPER_ADMIN, ROLES.TENANT_ADMIN]);
}
