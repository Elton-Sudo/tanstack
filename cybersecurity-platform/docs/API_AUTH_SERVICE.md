# Auth Service API Documentation

Base URL: `http://localhost:3001/api/v1`

## Table of Contents

- [Authentication](#authentication)
- [Multi-Factor Authentication (MFA)](#multi-factor-authentication-mfa)
- [Password Management](#password-management)
- [Session Management](#session-management)
- [Audit Logging](#audit-logging)
- [Single Sign-On (SSO)](#single-sign-on-sso)

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`
**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "tenant-uuid"
}
```

**Response:** `201 Created`

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

---

### Login

Authenticate user and receive JWT tokens.

**Endpoint:** `POST /auth/login`
**Auth Required:** No

**Request Body:**

```json
{
  "email": "admin@acme.com",
  "password": "Password123!",
  "tenantId": "tenant-uuid"
}
```

**Response (No MFA):** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "admin@acme.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

**Response (MFA Enabled):** `200 OK`

```json
{
  "mfaRequired": true,
  "partialToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "MFA verification required"
}
```

---

### Complete MFA Login

Verify MFA code and complete authentication.

**Endpoint:** `POST /auth/login/mfa`
**Auth Required:** No

**Request Body:**

```json
{
  "partialToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "code": "123456"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "admin@acme.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

---

### Logout

Invalidate all user sessions.

**Endpoint:** `POST /auth/logout`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

### Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /auth/refresh`
**Auth Required:** No

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User Profile

Retrieve authenticated user's profile.

**Endpoint:** `GET /auth/me`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "id": "user-uuid",
  "email": "admin@acme.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "tenantId": "tenant-uuid"
}
```

---

### Change Password

Change the current user's password.

**Endpoint:** `POST /auth/password/change`
**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

---

## Multi-Factor Authentication (MFA)

### Setup MFA

Initiate MFA setup and receive QR code.

**Endpoint:** `POST /auth/mfa/setup`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manualEntryKey": "JBSWY3DPEHPK3PXP"
}
```

**Usage:**

1. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.)
2. Or manually enter the `manualEntryKey` into the app
3. Verify the generated code using the verify endpoint

---

### Verify and Enable MFA

Verify MFA code and enable two-factor authentication.

**Endpoint:** `POST /auth/mfa/verify`
**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response:** `200 OK`

```json
{
  "message": "MFA enabled successfully",
  "backupCodes": [
    "ABCD1234",
    "EFGH5678",
    "IJKL9012",
    "MNOP3456",
    "QRST7890",
    "UVWX1234",
    "YZAB5678",
    "CDEF9012",
    "GHIJ3456",
    "KLMN7890"
  ]
}
```

⚠️ **Important:** Save these backup codes in a secure location. Each can only be used once.

---

### Disable MFA

Disable two-factor authentication.

**Endpoint:** `POST /auth/mfa/disable`
**Auth Required:** Yes (Bearer Token)

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response:** `200 OK`

```json
{
  "message": "MFA disabled successfully"
}
```

---

### Generate Backup Codes

Generate new backup codes.

**Endpoint:** `POST /auth/mfa/backup-codes`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "codes": ["ABCD1234", "EFGH5678", "..."],
  "message": "Save these codes in a secure location. Each code can only be used once."
}
```

---

### Get MFA Status

Check if MFA is enabled for the current user.

**Endpoint:** `GET /auth/mfa/status`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "mfaEnabled": true
}
```

---

## Password Management

### Forgot Password

Request a password reset email.

**Endpoint:** `POST /auth/password/forgot`
**Auth Required:** No

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

**Note:** Response is intentionally vague to prevent user enumeration attacks.

---

### Reset Password

Reset password using token from email.

**Endpoint:** `POST /auth/password/reset`
**Auth Required:** No

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset successful"
}
```

---

### Validate Password Strength

Check password strength before setting.

**Endpoint:** `POST /auth/password/validate`
**Auth Required:** No

**Request Body:**

```json
{
  "password": "Test123!"
}
```

**Response:** `200 OK`

```json
{
  "isValid": true,
  "score": 75,
  "strength": "good",
  "errors": []
}
```

**Strength Levels:**

- `weak`: score < 30
- `fair`: score 30-59
- `good`: score 60-79
- `strong`: score 80+

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not a common password

---

## Session Management

### List Active Sessions

View all active sessions for the current user.

**Endpoint:** `GET /auth/sessions`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-01-22T10:30:00Z",
      "isCurrent": true,
      "device": "Chrome Browser"
    }
  ],
  "total": 1
}
```

---

### Get Current Session

Get information about the current session.

**Endpoint:** `GET /auth/sessions/current`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "id": "session-uuid",
  "ipAddress": "192.168.1.1",
  "device": "Chrome Browser",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-22T10:30:00Z"
}
```

---

### Revoke Session

Revoke a specific session.

**Endpoint:** `DELETE /auth/sessions/:id`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "message": "Session revoked successfully"
}
```

---

### Revoke All Sessions

Revoke all sessions (except current one in some implementations).

**Endpoint:** `DELETE /auth/sessions`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "message": "All sessions revoked successfully",
  "revokedCount": 3
}
```

---

## Audit Logging

### Get Login History

View paginated login history for the current user.

**Endpoint:** `GET /auth/audit/login-history?page=1&limit=20`
**Auth Required:** Yes (Bearer Token)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "action": "login_success",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-15T10:30:00Z",
      "metadata": {
        "device": "Chrome Browser",
        "location": "San Francisco, CA"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Get Security Events

View security-related events for the current user.

**Endpoint:** `GET /auth/audit/security-events?page=1&limit=20`
**Auth Required:** Yes (Bearer Token)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "action": "mfa_enabled",
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-15T10:30:00Z",
      "metadata": {
        "method": "totp"
      }
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### Get Authorized Devices

View list of authorized devices.

**Endpoint:** `GET /auth/audit/devices`
**Auth Required:** Yes (Bearer Token)

**Response:** `200 OK`

```json
{
  "devices": [
    {
      "device": "Chrome Browser",
      "ipAddress": "192.168.1.1",
      "lastSeen": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

## Single Sign-On (SSO)

### Get SSO Configuration

Check available SSO options for a tenant.

**Endpoint:** `GET /auth/sso/config/:tenantId`
**Auth Required:** No

**Response:** `200 OK`

```json
{
  "ssoEnabled": true,
  "providers": ["google", "microsoft", "saml"],
  "message": "SSO available"
}
```

---

### Initiate OAuth Login

Start OAuth 2.0 authentication flow.

**Endpoint:** `POST /auth/sso/oauth/initiate`
**Auth Required:** No

**Request Body:**

```json
{
  "tenantId": "tenant-uuid",
  "provider": "google"
}
```

**Supported Providers:** `google`, `microsoft`, `github`

**Response:** `200 OK`

```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
  "state": "state-token",
  "provider": "google"
}
```

**Usage:**

1. Redirect user's browser to `authUrl`
2. User authenticates with OAuth provider
3. Provider redirects back to callback endpoint

---

### OAuth Callback

Handle OAuth provider callback (typically handled by redirect).

**Endpoint:** `GET /auth/sso/oauth/callback?code=...&state=...`
**Auth Required:** No

**Query Parameters:**

- `code`: Authorization code from provider
- `state`: CSRF protection state token

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

---

### Initiate SAML Login

Start SAML 2.0 authentication flow.

**Endpoint:** `POST /auth/sso/saml/initiate`
**Auth Required:** No

**Request Body:**

```json
{
  "tenantId": "tenant-uuid"
}
```

**Response:** `200 OK`

```json
{
  "samlRequest": "<samlp:AuthnRequest>...</samlp:AuthnRequest>",
  "redirectUrl": "https://idp.example.com/saml/login",
  "message": "SAML authentication initiated"
}
```

---

### SAML Callback (ACS)

Handle SAML assertion response.

**Endpoint:** `POST /auth/sso/saml/callback`
**Auth Required:** No

**Request Body:**

```json
{
  "SAMLResponse": "base64-encoded-saml-response"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

The API implements rate limiting:

- **Default Limit:** 100 requests per minute per IP
- **Auth Endpoints:** May have stricter limits (e.g., 10 login attempts per 15 minutes)
- **Headers:** Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Timestamp when limit resets

---

## Testing with cURL

### Login and Store Token

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"Password123!","tenantId":"tenant-uuid"}' \
  | jq -r '.accessToken')

# Use token in subsequent requests
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Setup MFA

```bash
# 1. Get QR code
curl -X POST http://localhost:3001/api/v1/auth/mfa/setup \
  -H "Authorization: Bearer $TOKEN"

# 2. Scan QR code with authenticator app

# 3. Verify and enable
curl -X POST http://localhost:3001/api/v1/auth/mfa/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456"}'
```

---

## Additional Resources

- **Swagger UI:** http://localhost:3001/api/docs
- **Prisma Studio:** `npm run prisma:studio`
- **Postman Collection:** Available in `/docs/postman/`
- **Development Guide:** See `DEVELOPMENT.md`
