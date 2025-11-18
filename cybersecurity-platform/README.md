# 🛡️ Cybersecurity Training Platform - Microservices Architecture

Enterprise-grade cybersecurity awareness training platform built with NestJS microservices architecture.

## 🏗️ Architecture

This platform consists of 8 microservices:

1. **Auth Service** (Port 3001) - Authentication, MFA, SSO
2. **Tenant Service** (Port 3002) - Multi-tenant management, branding
3. **Course Service** (Port 3003) - Course management, SCORM, quizzes
4. **Content Service** (Port 3004) - Media management, video transcoding
5. **Analytics Service** (Port 3005) - Risk scoring, behavioral analytics
6. **Reporting Service** (Port 3006) - Compliance reports, dashboards
7. **Notification Service** (Port 3007) - Email, SMS, push notifications
8. **Integration Service** (Port 3008) - API gateway, webhooks, HRIS

### Shared Libraries
- `@app/common` - DTOs, interfaces, decorators
- `@app/auth` - JWT guards, RBAC
- `@app/database` - Prisma client
- `@app/logging` - Winston logger
- `@app/monitoring` - Health checks, metrics
- `@app/messaging` - Event bus, queues

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone repository
git clone <repo-url>
cd cybersecurity-platform

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start infrastructure services
npm run docker:dev

# Run database migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start all services in development mode
npm run start:dev
```

## 📦 Project Structure

```
cybersecurity-platform/
├── apps/                          # Microservices
│   ├── auth-service/
│   ├── tenant-service/
│   ├── course-service/
│   ├── content-service/
│   ├── analytics-service/
│   ├── reporting-service/
│   ├── notification-service/
│   └── integration-service/
├── libs/                          # Shared libraries
│   ├── common/
│   ├── auth/
│   ├── database/
│   ├── logging/
│   ├── monitoring/
│   └── messaging/
├── prisma/                        # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── monitoring/                    # Monitoring configs
│   └── prometheus.yml
├── docker-compose.yml
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev              # Start all services in watch mode
npm run start:debug            # Start with debugging

# Building
npm run build                  # Build all services

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Run migrations
npm run prisma:studio          # Open Prisma Studio
npm run prisma:seed            # Seed database

# Docker
npm run docker:dev             # Start infrastructure
npm run docker:down            # Stop infrastructure
npm run docker:clean           # Remove volumes

# Testing
npm run test                   # Run tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Generate coverage report
npm run test:e2e               # Run e2e tests

# Code Quality
npm run lint                   # Lint code
npm run format                 # Format code with Prettier
```

## 🗄️ Database

This platform uses PostgreSQL with Prisma ORM. The database includes schemas for:

- Users & Authentication
- Multi-tenant data
- Courses & Learning paths
- Enrollments & Progress tracking
- Analytics & Risk scoring
- Notifications & Audit logs

## 📊 Monitoring & Observability

- **Prometheus** - Metrics collection (http://localhost:9090)
- **Grafana** - Visualization (http://localhost:3333) [admin/admin]
- **Jaeger** - Distributed tracing (http://localhost:16686)
- **RabbitMQ Management** - Queue monitoring (http://localhost:15672) [guest/guest]

## 🔐 Security Features

- JWT authentication with refresh tokens
- Multi-factor authentication (TOTP, SMS)
- SSO/SAML integration
- Role-based access control (RBAC)
- Password policies enforcement
- Session management
- Audit logging
- Rate limiting

## 🌐 API Documentation

Once services are running, access Swagger documentation:

- Auth Service: http://localhost:3001/api/docs
- Tenant Service: http://localhost:3002/api/docs
- Course Service: http://localhost:3003/api/docs
- Content Service: http://localhost:3004/api/docs
- Analytics Service: http://localhost:3005/api/docs
- Reporting Service: http://localhost:3006/api/docs
- Notification Service: http://localhost:3007/api/docs
- Integration Service: http://localhost:3008/api/docs

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For questions and support, please contact the development team.
