# Database Migration Instructions

## When Database is Available

Run the following commands to apply the schema changes:

```bash
# Navigate to project root
cd /Users/eltonsudo/Sandbox/PlayGround/tanstack/cybersecurity-platform

# Run migration
npx prisma migrate dev --name add_subscription_and_usage_tracking

# Regenerate Prisma client (if needed)
npx prisma generate
```

## Schema Changes

The migration includes:

### 1. SubscriptionHistory Updates
- Added `previousPlan` (nullable)
- Added `newPlan`
- Added `changeType` (UPGRADE, DOWNGRADE, RENEWAL, CANCELLATION)
- Added `changeReason`
- Added `changedAt` timestamp
- Added index on `changedAt`

### 2. New UsageEvent Table
Event-based usage tracking for granular metrics:
- `id` (UUID)
- `tenantId`
- `userId` (nullable)
- `metricType` (API_CALL, USER_LOGIN, STORAGE_UPLOAD, etc.)
- `metricValue` (Float, default 1)
- `metadata` (JSON)
- `createdAt`

Indexes on: tenantId, metricType, createdAt, userId

### 3. Tenant Model Update
- Added `usageEvents` relation to UsageEvent[]

## Verification

After migration, verify with:

```bash
# Check migration status
npx prisma migrate status

# Open Prisma Studio to inspect data
npx prisma studio
```

## Rollback (if needed)

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>
```

## Seed Data (Optional)

After migration, you may want to seed some test data:

```bash
npx prisma db seed
```

See `prisma/seed.ts` for seed data configuration.
