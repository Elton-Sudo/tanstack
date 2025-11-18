# Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js >= 18.0.0
- ✅ Docker & Docker Compose
- ✅ PostgreSQL 15+ (via Docker)
- ✅ Redis 7+ (via Docker)

## Installation Steps

### 1. Clone and Setup
```bash
cd cybersecurity-platform
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies
- Start infrastructure services (PostgreSQL, Redis, RabbitMQ, MinIO)
- Generate Prisma Client
- Run database migrations
- Seed the database with test data

### 2. Start Development Server
```bash
npm run start:dev
```

### 3. Access the Application

**Auth Service:**
- API: http://localhost:3001/api/v1
- Swagger Documentation: http://localhost:3001/api/docs

**Infrastructure:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3333 (admin/admin)
- Jaeger Tracing: http://localhost:16686
- Prisma Studio: `npm run prisma:studio`

## Test the API

### 1. Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme.com",
    "password": "Password123!",
    "tenantId": "uuid-from-database"
  }'
```

### 2. Get User Profile (with token)
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Default Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@platform.com | Password123! |
| Tenant Admin | admin@acme.com | Password123! |
| Manager | manager@acme.com | Password123! |
| User | user1@acme.com | Password123! |

## Database Management

### View Data
```bash
npm run prisma:studio
```

### Run Migrations
```bash
npm run prisma:migrate
```

### Reset Database
```bash
npx prisma migrate reset
```

## Development Commands

```bash
# Start all services in watch mode
npm run start:dev

# Build all services
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format

# Stop infrastructure
npm run docker:down

# Clean up everything (including volumes)
npm run docker:clean
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3001

# Stop the process or change the port in .env
```

### Database Connection Issues
```bash
# Restart PostgreSQL container
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Clear Everything and Start Fresh
```bash
npm run docker:clean
rm -rf node_modules
rm -rf dist
npm install
./setup.sh
```

## Next Steps

1. ✅ **Phase 1 Complete** - Infrastructure is ready
2. 🔜 **Phase 2** - Implement remaining microservices
3. 🔜 **Phase 3** - Add authentication features (MFA, SSO)
4. 🔜 **Phase 4** - Implement course management
5. 🔜 **Phase 5** - Build analytics and reporting

## Project Structure

```
cybersecurity-platform/
├── apps/                      # Microservices
│   ├── auth-service/         ✅ Implemented
│   ├── tenant-service/       🔜 Next
│   ├── course-service/       🔜 Planned
│   ├── content-service/      🔜 Planned
│   ├── analytics-service/    🔜 Planned
│   ├── reporting-service/    🔜 Planned
│   ├── notification-service/ 🔜 Planned
│   └── integration-service/  🔜 Planned
├── libs/                      # Shared libraries
│   ├── common/               ✅ Complete
│   ├── auth/                 ✅ Complete
│   ├── database/             ✅ Complete
│   ├── logging/              ✅ Complete (Pino)
│   ├── monitoring/           ✅ Complete
│   └── messaging/            ✅ Complete
└── prisma/                    # Database
    ├── schema.prisma         ✅ Complete
    └── seed.ts               ✅ Complete
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (Future)                  │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │  Auth   │       │ Tenant  │       │ Course  │
   │ Service │       │ Service │       │ Service │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │Content  │       │Analytics│       │Reporting│
   │Service  │       │ Service │       │ Service │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │PostgreSQL       │  Redis  │       │RabbitMQ │
   └─────────┘       └─────────┘       └─────────┘
```

## Features Implemented

### ✅ Phase 1 - Infrastructure
- [x] NestJS monorepo setup
- [x] Docker Compose for infrastructure
- [x] PostgreSQL database
- [x] Redis cache
- [x] RabbitMQ message broker
- [x] MinIO object storage
- [x] Prisma ORM with full schema
- [x] Prometheus + Grafana monitoring
- [x] Jaeger distributed tracing
- [x] Pino logging
- [x] Health checks
- [x] Database seeding

### ✅ Shared Libraries
- [x] @app/common - DTOs, decorators, filters, interceptors
- [x] @app/auth - JWT guards, RBAC
- [x] @app/database - Prisma client
- [x] @app/logging - Pino logger
- [x] @app/monitoring - Health checks
- [x] @app/messaging - Event bus

### ✅ Auth Service (Partial)
- [x] User registration
- [x] Login/logout
- [x] JWT tokens
- [x] Refresh tokens
- [x] Password management
- [x] Session management
- [x] User profile
- [x] Role-based access control
- [x] Account locking
- [ ] MFA (TOTP, SMS) - Phase 3
- [ ] SSO (SAML, OAuth) - Phase 3

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review the documentation in `/docs`
3. Open an issue on GitHub

Happy coding! 🚀
