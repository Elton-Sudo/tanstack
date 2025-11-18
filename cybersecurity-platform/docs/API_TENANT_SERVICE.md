# Tenant Service API Documentation

Base URL: `http://localhost:3002/api/v1`

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Tenant Management](#tenant-management)
- [Subscription Management](#subscription-management)
- [Tenant Statistics](#tenant-statistics)
- [Error Responses](#error-responses)

---

## Overview

The Tenant Service manages multi-tenant functionality including:

- Tenant CRUD operations
- Subscription plan management
- Tenant suspension and activation
- Usage statistics and limits
- Tenant isolation enforcement

### Subscription Plans

| Plan         | Max Users | Storage | Features                                        |
| ------------ | --------- | ------- | ----------------------------------------------- |
| FREE         | 5         | 100MB   | Basic features                                  |
| TRIAL        | 10        | 500MB   | 14-day trial, all features                      |
| STARTER      | 50        | 5GB     | Full features                                   |
| PROFESSIONAL | 200       | 50GB    | Advanced features, priority support             |
| ENTERPRISE   | 10,000    | 500GB   | White-label, dedicated support, custom features |

### Tenant Status

- `ACTIVE` - Tenant is fully operational
- `TRIAL` - Tenant in trial period (14 days)
- `SUSPENDED` - Tenant temporarily suspended (admin action)
- `EXPIRED` - Subscription has expired

---

## Authentication

All endpoints require JWT Bearer token authentication.

**Header:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Required Roles:**

- `SUPER_ADMIN` - Full access to all tenants
- `ADMIN` - Access to own tenant only

---

## Tenant Management

### Create Tenant

Create a new tenant organization.

**Endpoint:** `POST /tenants`
**Auth Required:** Yes (SUPER_ADMIN only)

**Request Body:**

```json
{
  "name": "Acme Corporation",
  "slug": "acme",
  "description": "Leading cybersecurity training provider",
  "website": "https://acme.com",
  "contactEmail": "contact@acme.com",
  "contactPhone": "+1-555-0123",
  "subscriptionPlan": "TRIAL",
  "maxUsers": 10,
  "settings": {
    "timezone": "America/New_York",
    "language": "en",
    "theme": "corporate"
  }
}
```

**Response:** `201 Created`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "slug": "acme",
  "description": "Leading cybersecurity training provider",
  "website": "https://acme.com",
  "contactEmail": "contact@acme.com",
  "contactPhone": "+1-555-0123",
  "status": "TRIAL",
  "subscriptionPlan": "TRIAL",
  "maxUsers": 10,
  "subscriptionStartDate": "2024-01-15T10:00:00Z",
  "subscriptionEndDate": "2024-01-29T10:00:00Z",
  "settings": {
    "timezone": "America/New_York",
    "language": "en",
    "theme": "corporate"
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### List All Tenants

Retrieve paginated list of tenants.

**Endpoint:** `GET /tenants?page=1&limit=20&status=ACTIVE`
**Auth Required:** Yes (SUPER_ADMIN only)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (ACTIVE, TRIAL, SUSPENDED, EXPIRED)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "tenant-uuid",
      "name": "Acme Corporation",
      "slug": "acme",
      "status": "ACTIVE",
      "subscriptionPlan": "PROFESSIONAL",
      "maxUsers": 200,
      "contactEmail": "contact@acme.com",
      "website": "https://acme.com",
      "createdAt": "2024-01-15T10:00:00Z",
      "subscriptionEndDate": "2025-01-15T10:00:00Z",
      "userCount": 45,
      "courseCount": 12
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### Get Tenant by ID

Retrieve detailed tenant information.

**Endpoint:** `GET /tenants/:id`
**Auth Required:** Yes (SUPER_ADMIN or ADMIN of tenant)

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "slug": "acme",
  "description": "Leading cybersecurity training provider",
  "website": "https://acme.com",
  "contactEmail": "contact@acme.com",
  "contactPhone": "+1-555-0123",
  "status": "ACTIVE",
  "subscriptionPlan": "PROFESSIONAL",
  "maxUsers": 200,
  "subscriptionStartDate": "2024-01-15T10:00:00Z",
  "subscriptionEndDate": "2025-01-15T10:00:00Z",
  "settings": {
    "timezone": "America/New_York",
    "language": "en",
    "theme": "corporate",
    "enableSso": true,
    "enableMfa": true
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z",
  "_count": {
    "users": 45,
    "courses": 12,
    "enrollments": 234
  }
}
```

---

### Get Tenant by Slug

Retrieve tenant by unique slug identifier.

**Endpoint:** `GET /tenants/slug/:slug`
**Auth Required:** Yes (SUPER_ADMIN only)

**Example:** `GET /tenants/slug/acme`

**Response:** `200 OK` (same structure as Get by ID)

---

### Update Tenant

Update tenant information.

**Endpoint:** `PUT /tenants/:id`
**Auth Required:** Yes (SUPER_ADMIN or ADMIN of tenant)

**Request Body:**

```json
{
  "name": "Acme Corporation Inc.",
  "description": "Updated description",
  "website": "https://acme-corp.com",
  "contactEmail": "info@acme-corp.com",
  "contactPhone": "+1-555-0456"
}
```

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation Inc.",
  "description": "Updated description",
  "website": "https://acme-corp.com",
  "contactEmail": "info@acme-corp.com",
  "contactPhone": "+1-555-0456",
  "updatedAt": "2024-01-25T14:20:00Z"
}
```

---

### Update Tenant Settings

Update tenant-specific settings.

**Endpoint:** `PATCH /tenants/:id/settings`
**Auth Required:** Yes (SUPER_ADMIN or ADMIN of tenant)

**Request Body:**

```json
{
  "settings": {
    "timezone": "America/Los_Angeles",
    "language": "es",
    "theme": "modern",
    "enableSso": true,
    "enableMfa": true,
    "passwordPolicy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSymbols": true,
      "expiryDays": 90
    },
    "sessionTimeout": 3600,
    "allowedDomains": ["acme.com", "acme-corp.com"]
  }
}
```

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "settings": {
    "timezone": "America/Los_Angeles",
    "language": "es",
    "theme": "modern",
    "enableSso": true,
    "enableMfa": true,
    "passwordPolicy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSymbols": true,
      "expiryDays": 90
    },
    "sessionTimeout": 3600,
    "allowedDomains": ["acme.com", "acme-corp.com"]
  },
  "updatedAt": "2024-01-25T14:25:00Z"
}
```

---

## Subscription Management

### Update Subscription Plan

Change tenant's subscription plan.

**Endpoint:** `PATCH /tenants/:id/subscription`
**Auth Required:** Yes (SUPER_ADMIN or ADMIN of tenant)

**Request Body:**

```json
{
  "plan": "ENTERPRISE",
  "maxUsers": 500,
  "autoRenew": true
}
```

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "subscriptionPlan": "ENTERPRISE",
  "maxUsers": 500,
  "subscriptionStartDate": "2024-01-25T14:30:00Z",
  "subscriptionEndDate": "2025-01-25T14:30:00Z",
  "status": "ACTIVE",
  "updatedAt": "2024-01-25T14:30:00Z"
}
```

**Validation Rules:**

- Cannot downgrade if current user count exceeds new plan limit
- Trial plans automatically set 14-day expiration
- Paid plans set 1-year expiration
- Plan hierarchy: FREE < TRIAL < STARTER < PROFESSIONAL < ENTERPRISE

---

### Suspend Tenant

Temporarily suspend tenant access.

**Endpoint:** `PATCH /tenants/:id/suspend`
**Auth Required:** Yes (SUPER_ADMIN only)

**Request Body:**

```json
{
  "reason": "Payment overdue"
}
```

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "status": "SUSPENDED",
  "updatedAt": "2024-01-25T15:00:00Z"
}
```

**Effects:**

- All tenant users are blocked from login
- API access is denied
- Scheduled jobs are paused
- Data remains intact

---

### Activate Tenant

Reactivate a suspended tenant.

**Endpoint:** `PATCH /tenants/:id/activate`
**Auth Required:** Yes (SUPER_ADMIN only)

**Response:** `200 OK`

```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation",
  "status": "ACTIVE",
  "updatedAt": "2024-01-26T09:00:00Z"
}
```

---

### Delete Tenant

Permanently delete tenant (must have no users).

**Endpoint:** `DELETE /tenants/:id`
**Auth Required:** Yes (SUPER_ADMIN only)

**Response:** `204 No Content`

**Requirements:**

- Tenant must have 0 users
- All user data must be removed first
- Cannot be undone

**Error Response (if users exist):**

```json
{
  "statusCode": 400,
  "message": "Cannot delete tenant with 45 users. Remove all users first.",
  "error": "Bad Request"
}
```

---

## Tenant Statistics

### Get Tenant Stats

Retrieve usage statistics for a tenant.

**Endpoint:** `GET /tenants/:id/stats`
**Auth Required:** Yes (SUPER_ADMIN or ADMIN of tenant)

**Response:** `200 OK`

```json
{
  "totalUsers": 45,
  "activeUsers": 38,
  "totalCourses": 12,
  "totalEnrollments": 234,
  "storageUsed": 12584960,
  "storageLimit": 52428800
}
```

**Field Descriptions:**

- `totalUsers` - Total number of users in tenant
- `activeUsers` - Users who have logged in at least once
- `totalCourses` - Number of courses created by tenant
- `totalEnrollments` - Total course enrollments
- `storageUsed` - Storage consumed in bytes
- `storageLimit` - Storage limit based on plan in bytes

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Cannot downgrade: Current user count (45) exceeds plan limit (10)",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
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

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Tenant with ID 'tenant-uuid' not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Tenant with slug 'acme' already exists",
  "error": "Conflict"
}
```

---

## Testing with cURL

### Create Tenant

```bash
curl -X POST http://localhost:3002/api/v1/tenants \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Corp",
    "slug": "testcorp",
    "contactEmail": "admin@testcorp.com",
    "subscriptionPlan": "STARTER",
    "maxUsers": 50
  }'
```

### List Tenants

```bash
curl -X GET "http://localhost:3002/api/v1/tenants?page=1&limit=10&status=ACTIVE" \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN"
```

### Update Subscription

```bash
curl -X PATCH http://localhost:3002/api/v1/tenants/tenant-uuid/subscription \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "PROFESSIONAL",
    "maxUsers": 200
  }'
```

### Get Tenant Stats

```bash
curl -X GET http://localhost:3002/api/v1/tenants/tenant-uuid/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Automated Tasks

### Subscription Expiration Check

- **Schedule:** Daily at 2:00 AM
- **Action:** Marks expired subscriptions as `EXPIRED`
- **Notifications:** Emits `subscription.expired` event

### Upcoming Expiration Alerts

- **Schedule:** Every hour
- **Action:** Checks subscriptions expiring within 7 days
- **Notifications:** Emits events for notification service

---

## Events Emitted

The Tenant Service emits the following events for other services:

| Event                  | Payload                                   | Description                |
| ---------------------- | ----------------------------------------- | -------------------------- |
| `tenant.created`       | `{tenantId, tenantName, slug}`            | New tenant created         |
| `tenant.updated`       | `{tenantId, tenantName, changes}`         | Tenant information updated |
| `tenant.suspended`     | `{tenantId, reason}`                      | Tenant suspended           |
| `tenant.activated`     | `{tenantId}`                              | Tenant reactivated         |
| `tenant.deleted`       | `{tenantId}`                              | Tenant permanently deleted |
| `subscription.updated` | `{tenantId, oldPlan, newPlan, autoRenew}` | Subscription plan changed  |
| `subscription.expired` | `{tenantId, tenantName}`                  | Subscription has expired   |

---

## Integration Examples

### React/TypeScript Client

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api/v1',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Get current tenant info
const getTenant = async (tenantId: string) => {
  const response = await api.get(`/tenants/${tenantId}`);
  return response.data;
};

// Update tenant settings
const updateSettings = async (tenantId: string, settings: any) => {
  const response = await api.patch(`/tenants/${tenantId}/settings`, {
    settings,
  });
  return response.data;
};

// Get tenant statistics
const getTenantStats = async (tenantId: string) => {
  const response = await api.get(`/tenants/${tenantId}/stats`);
  return response.data;
};
```

---

## Additional Resources

- **Swagger UI:** http://localhost:3002/api/docs
- **Prisma Studio:** `npm run prisma:studio`
- **Service Health:** http://localhost:3002/health
- **Metrics:** http://localhost:3002/metrics
