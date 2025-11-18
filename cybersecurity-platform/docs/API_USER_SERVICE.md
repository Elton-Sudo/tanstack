# User Service API Documentation

## Overview

The User Service provides comprehensive user management capabilities for the Cybersecurity Training Platform, including user CRUD operations, invitations, role management, bulk operations, and activity tracking.

## Base URL

```
http://localhost:3003
```

## Authentication

All endpoints require a valid JWT token passed in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

The service supports the following roles with hierarchical permissions:

| Role | Description | Permissions |
|------|-------------|-------------|
| `SUPER_ADMIN` | Platform administrator | Full access to all tenants |
| `TENANT_ADMIN` | Tenant administrator | Full access within tenant |
| `MANAGER` | Department manager | Manage users in department |
| `USER` | Standard user | Read-only access to own data |
| `INSTRUCTOR` | Course instructor | Teach courses and grade assessments |

## Endpoints

### 1. Create User

Create a new user within a tenant.

**Endpoint:** `POST /users`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Request Body:**

```json
{
  "email": "john.doe@acme.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "tenant-uuid",
  "role": "USER",
  "phoneNumber": "+1-555-0123",
  "department": "Engineering",
  "position": "Software Engineer",
  "sendInvitation": true
}
```

**Response:** `201 Created`

```json
{
  "id": "user-uuid",
  "email": "john.doe@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "tenant-uuid",
  "role": "USER",
  "phoneNumber": "+1-555-0123",
  "department": "Engineering",
  "position": "Software Engineer",
  "emailVerified": false,
  "mfaEnabled": false,
  "createdAt": "2025-11-18T10:00:00.000Z",
  "updatedAt": "2025-11-18T10:00:00.000Z"
}
```

**Validation Rules:**
- Email must be valid and unique within tenant
- Password minimum 8 characters
- First/last name 2-50 characters
- Tenant must not exceed user limit

---

### 2. List Users

Get all users with pagination and filtering.

**Endpoint:** `GET /users`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| search | string | No | Search in name/email |
| role | string | No | Filter by role |
| department | string | No | Filter by department |
| emailVerified | boolean | No | Filter by email verification status |
| mfaEnabled | boolean | No | Filter by MFA status |
| tenantId | string | No | Tenant ID (SUPER_ADMIN only) |

**Example Request:**

```bash
GET /users?page=1&limit=20&search=john&role=USER&department=Engineering
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "user-uuid-1",
      "email": "john.doe@acme.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "department": "Engineering",
      "position": "Software Engineer",
      "phoneNumber": "+1-555-0123",
      "avatar": "https://example.com/avatar.jpg",
      "emailVerified": true,
      "mfaEnabled": true,
      "lastLoginAt": "2025-11-18T09:00:00.000Z",
      "createdAt": "2025-11-01T10:00:00.000Z",
      "updatedAt": "2025-11-18T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 3. Get User by ID

Retrieve a single user's details.

**Endpoint:** `GET /users/:id`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Response:** `200 OK`

```json
{
  "id": "user-uuid",
  "email": "john.doe@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "tenant-uuid",
  "role": "USER",
  "department": "Engineering",
  "position": "Software Engineer",
  "phoneNumber": "+1-555-0123",
  "avatar": "https://example.com/avatar.jpg",
  "emailVerified": true,
  "mfaEnabled": true,
  "lastLoginAt": "2025-11-18T09:00:00.000Z",
  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2025-11-18T09:00:00.000Z"
}
```

---

### 4. Update User

Update user information.

**Endpoint:** `PATCH /users/:id`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "role": "MANAGER",
  "phoneNumber": "+1-555-0123",
  "department": "Engineering",
  "position": "Senior Software Engineer",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`

```json
{
  "id": "user-uuid",
  "email": "john.doe@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MANAGER",
  "department": "Engineering",
  "position": "Senior Software Engineer",
  "phoneNumber": "+1-555-0123",
  "avatar": "https://example.com/avatar.jpg",
  "updatedAt": "2025-11-18T10:30:00.000Z"
}
```

---

### 5. Delete User

Soft delete a user (cannot delete SUPER_ADMIN).

**Endpoint:** `DELETE /users/:id`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

**Business Rules:**
- Cannot delete SUPER_ADMIN users
- Email is prefixed with `deleted_{timestamp}_` to allow recreation
- All sessions are revoked
- MFA is disabled

---

### 6. Invite User

Send an invitation to a new user.

**Endpoint:** `POST /users/invite`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Request Body:**

```json
{
  "email": "jane.doe@acme.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "USER",
  "department": "Engineering",
  "position": "Senior Engineer",
  "message": "Welcome to the team!"
}
```

**Response:** `201 Created`

```json
{
  "invitationToken": "a1b2c3d4e5f6...",
  "expiresAt": "2025-11-25T10:00:00.000Z"
}
```

**Business Logic:**
- User account is created with temporary password
- Invitation expires after 7 days
- Email verification required on first login
- Emits `USER_INVITED` event for email notification

---

### 7. Bulk Create Users

Create multiple users at once.

**Endpoint:** `POST /users/bulk`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Request Body:**

```json
{
  "users": [
    {
      "email": "user1@acme.com",
      "password": "Password123!",
      "firstName": "User",
      "lastName": "One",
      "tenantId": "tenant-uuid",
      "role": "USER",
      "department": "Engineering"
    },
    {
      "email": "user2@acme.com",
      "password": "Password123!",
      "firstName": "User",
      "lastName": "Two",
      "tenantId": "tenant-uuid",
      "role": "USER",
      "department": "Sales"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "created": 2,
  "failed": 0,
  "errors": []
}
```

**Error Response Example:**

```json
{
  "created": 1,
  "failed": 1,
  "errors": [
    {
      "email": "duplicate@acme.com",
      "error": "User with this email already exists in this tenant"
    }
  ]
}
```

---

### 8. Change User Role

Change a user's role.

**Endpoint:** `PATCH /users/:id/role`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Request Body:**

```json
{
  "role": "MANAGER",
  "reason": "Promoted to manager position"
}
```

**Response:** `200 OK`

```json
{
  "id": "user-uuid",
  "email": "john.doe@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MANAGER",
  "updatedAt": "2025-11-18T10:45:00.000Z"
}
```

**Business Rules:**
- Cannot change SUPER_ADMIN role
- Role change is logged in audit trail
- All existing sessions remain valid

---

### 9. Reset User Password

Admin-initiated password reset.

**Endpoint:** `POST /users/:id/reset-password`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Request Body:**

```json
{
  "newPassword": "NewPassword123!",
  "requirePasswordChange": true
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset successfully. User must login with new password."
}
```

**Business Logic:**
- All user sessions are revoked
- Failed login attempts counter is reset
- Account lock is removed if locked
- User can be forced to change password on next login

---

### 10. Get User Activity

Retrieve user activity history.

**Endpoint:** `GET /users/:id/activity`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`

**Response:** `200 OK`

```json
{
  "recentLogins": [
    {
      "id": "log-uuid-1",
      "userId": "user-uuid",
      "action": "login_success",
      "metadata": {
        "ip": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "location": "New York, US"
      },
      "createdAt": "2025-11-18T09:00:00.000Z"
    },
    {
      "id": "log-uuid-2",
      "userId": "user-uuid",
      "action": "login_failed",
      "metadata": {
        "ip": "192.168.1.100",
        "reason": "Invalid password"
      },
      "createdAt": "2025-11-18T08:55:00.000Z"
    }
  ],
  "totalEnrollments": 5,
  "totalQuizAttempts": 12
}
```

---

### 11. Export Users

Export all users in a tenant to CSV format.

**Endpoint:** `GET /users/export/csv`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Response:** `200 OK`

```json
[
  {
    "email": "john.doe@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "department": "Engineering",
    "position": "Software Engineer",
    "phoneNumber": "+1-555-0123",
    "emailVerified": true,
    "mfaEnabled": true,
    "lastLoginAt": "2025-11-18T09:00:00.000Z",
    "createdAt": "2025-11-01T10:00:00.000Z"
  }
]
```

---

## Event Emissions

The User Service emits the following events:

| Event | Trigger | Payload |
|-------|---------|---------|
| `USER_CREATED` | User creation | userId, email, firstName, lastName, tenantId, verificationToken |
| `USER_UPDATED` | User update | userId, tenantId, changes, updatedBy |
| `USER_DELETED` | User deletion | userId, tenantId, deletedBy |
| `USER_INVITED` | User invitation | userId, email, firstName, lastName, tenantId, invitationToken, expiresAt, invitedBy, message |

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Tenant has reached maximum user limit (10). Please upgrade subscription.",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid token or user not found",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "User does not have required role. Required: SUPER_ADMIN, TENANT_ADMIN",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User with ID 'user-uuid' not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "User with this email already exists in this tenant",
  "error": "Conflict"
}
```

---

## Rate Limiting

All endpoints are rate-limited to:
- **100 requests per minute** per IP address

Exceeded limits return `429 Too Many Requests`.

---

## cURL Examples

### Create User

```bash
curl -X POST http://localhost:3003/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@acme.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "tenantId": "tenant-uuid",
    "role": "USER",
    "sendInvitation": true
  }'
```

### List Users with Filters

```bash
curl -X GET "http://localhost:3003/users?page=1&limit=20&search=john&department=Engineering" \
  -H "Authorization: Bearer <token>"
```

### Invite User

```bash
curl -X POST http://localhost:3003/users/invite \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@acme.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "USER",
    "message": "Welcome to the team!"
  }'
```

### Change User Role

```bash
curl -X PATCH http://localhost:3003/users/{userId}/role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "MANAGER",
    "reason": "Promoted to manager"
  }'
```

### Bulk Create Users

```bash
curl -X POST http://localhost:3003/users/bulk \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "users": [
      {
        "email": "user1@acme.com",
        "password": "Password123!",
        "firstName": "User",
        "lastName": "One",
        "tenantId": "tenant-uuid"
      }
    ]
  }'
```

---

## TypeScript Client Example

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3003',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create a user
const createUser = async () => {
  const response = await apiClient.post('/users', {
    email: 'john.doe@acme.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    tenantId: 'tenant-uuid',
    role: 'USER',
    sendInvitation: true,
  });
  return response.data;
};

// List users with filters
const listUsers = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  department?: string;
}) => {
  const response = await apiClient.get('/users', { params: filters });
  return response.data;
};

// Invite user
const inviteUser = async (invitation: {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  message?: string;
}) => {
  const response = await apiClient.post('/users/invite', invitation);
  return response.data;
};

// Change user role
const changeUserRole = async (userId: string, role: string, reason?: string) => {
  const response = await apiClient.patch(`/users/${userId}/role`, { role, reason });
  return response.data;
};

// Export users
const exportUsers = async () => {
  const response = await apiClient.get('/users/export/csv');
  return response.data;
};
```

---

## Security Considerations

1. **Tenant Isolation**: Users can only access data within their tenant (except SUPER_ADMIN)
2. **Role-Based Access**: Endpoints are protected by role guards
3. **Password Security**: Passwords are hashed using bcrypt with salt rounds of 10
4. **Session Management**: Password resets revoke all existing sessions
5. **Audit Trail**: Role changes are logged in the audit log
6. **Rate Limiting**: Prevents brute-force attacks
7. **Input Validation**: All inputs are validated using class-validator

---

## Business Rules

### User Creation
- Email must be unique within tenant
- Password must meet complexity requirements (min 8 chars)
- Tenant must not exceed subscription user limit
- Verification email sent if `sendInvitation` is true

### User Invitation
- Creates user with temporary password
- Invitation expires after 7 days
- User must verify email and set password on first login

### Role Changes
- Cannot change SUPER_ADMIN role
- Role changes are logged in audit trail
- Existing sessions remain valid after role change

### User Deletion
- Cannot delete SUPER_ADMIN users
- Soft delete (email prefixed, account disabled)
- All sessions revoked
- MFA disabled

### Tenant User Limits
- Free: 10 users
- Trial: 10 users
- Starter: 50 users
- Professional: 200 users
- Enterprise: 1000 users

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3003/api/docs
```

The Swagger UI provides:
- Interactive endpoint testing
- Request/response schemas
- Authentication testing
- Example values
