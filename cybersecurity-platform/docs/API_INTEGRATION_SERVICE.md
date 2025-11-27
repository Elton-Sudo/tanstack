# Integration Service API

This document provides an overview of endpoints for the Integration Service, including API key management, webhooks, and external connectors.

Base path: `/api/v1` (service-level routes begin at the service's root; SVC port configured in env)

## API Keys

- `POST /apikeys` - Create a new API key (Roles: SUPER_ADMIN, TENANT_ADMIN)
  - Body: `{ name, permissions?: string[], isActive?: boolean }`
  - Example:
    ```bash
    curl -X POST http://localhost:3009/apikeys \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name":"External CI key","permissions":["read:users"]}'
    ```

- `GET /apikeys` - List API keys for the tenant (Roles: SUPER_ADMIN, TENANT_ADMIN)

- `DELETE /apikeys/:id` - Revoke API key (Roles: SUPER_ADMIN, TENANT_ADMIN)

## Webhooks

- `POST /webhooks` - Create new webhook (Roles: SUPER_ADMIN, TENANT_ADMIN)
  - Body: `{ url, events: string[], secret?: string }`

- `GET /webhooks` - List webhooks for tenant (Roles: SUPER_ADMIN, TENANT_ADMIN)

- `DELETE /webhooks/:id` - Delete a webhook (Roles: SUPER_ADMIN, TENANT_ADMIN)

- `POST /webhooks/:id/trigger` - Simulate a webhook trigger (Roles: SUPER_ADMIN, TENANT_ADMIN).

## Connectors

- `POST /connectors` - Create an external connector (e.g., HRIS, SSO) (Roles: SUPER_ADMIN, TENANT_ADMIN)
  - Body: `{ name, type: IntegrationType, config?: { ... } }`

- `GET /connectors` - List connectors for tenant (Roles: SUPER_ADMIN, TENANT_ADMIN)

- `PUT /connectors/:id` - Update connector

- `DELETE /connectors/:id` - Delete connector

## Notes

- Guards: `JwtAuthGuard` + `TenantGuard` are used to enforce authentication and tenant scoping. Role-based guards (`RolesGuard`) are used on management endpoints.
- Data is persisted in the `ApiKey`, `Webhook`, and `Integration` models in Prisma.
