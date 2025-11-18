# Development Guide

## Phase 1: ✅ COMPLETED - Infrastructure Setup

### What Was Built

1. **Monorepo Structure**
   - 8 microservices scaffolded (auth, tenant, course, content, analytics, reporting, notification, integration)
   - 6 shared libraries (common, auth, database, logging, monitoring, messaging)

2. **Infrastructure Services**
   - PostgreSQL 15 (Database)
   - Redis 7 (Cache & Sessions)
   - RabbitMQ (Message Queue)
   - MinIO (S3-compatible Object Storage)
   - Prometheus (Metrics)
   - Grafana (Visualization)
   - Jaeger (Distributed Tracing)

3. **Database Schema**
   - Complete Prisma schema for all 8 services
   - 25+ models including User, Tenant, Course, Enrollment, Quiz, etc.
   - Comprehensive seed file with test data

4. **Shared Libraries**
   - `@app/common`: DTOs, decorators, filters, interceptors, pipes
   - `@app/auth`: JWT authentication, RBAC guards
   - `@app/database`: Prisma client wrapper
   - `@app/logging`: Pino logger with pretty printing
   - `@app/monitoring`: Health checks, metrics
   - `@app/messaging`: Event bus for inter-service communication

5. **Auth Service (Partial Implementation)**
   - User registration & login
   - JWT + Refresh tokens
   - Password management
   - Session management
   - RBAC with decorators
   - Account locking after failed attempts
   - Swagger documentation

### Directory Structure

```
cybersecurity-platform/
├── apps/
│   ├── auth-service/          ✅ Partial (login, register, sessions)
│   │   ├── src/
│   │   │   ├── controllers/   (auth.controller, user.controller)
│   │   │   ├── services/      (auth.service)
│   │   │   ├── dto/           (auth DTOs)
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── tenant-service/        🔜 Phase 4
│   ├── course-service/        🔜 Phase 5
│   ├── content-service/       🔜 Phase 6
│   ├── analytics-service/     🔜 Phase 7
│   ├── reporting-service/     🔜 Phase 8
│   ├── notification-service/  🔜 Phase 9
│   └── integration-service/   🔜 Phase 10
│
├── libs/
│   ├── common/                ✅ Complete
│   │   ├── dto/               (PaginationDto, etc.)
│   │   ├── decorators/        (CurrentUser, Roles, Public, etc.)
│   │   ├── filters/           (AllExceptionsFilter)
│   │   ├── interceptors/      (LoggingInterceptor, TransformInterceptor)
│   │   ├── pipes/             (ParseUuidPipe)
│   │   ├── utils/             (String utilities)
│   │   └── constants/         (Roles, Events, Queue names)
│   ├── auth/                  ✅ Complete
│   │   ├── guards/            (JwtAuthGuard, RolesGuard)
│   │   └── strategies/        (JwtStrategy)
│   ├── database/              ✅ Complete
│   │   └── database.service.ts
│   ├── logging/               ✅ Complete (Pino)
│   │   └── logger.service.ts
│   ├── monitoring/            ✅ Complete
│   │   ├── health/            (HealthController)
│   │   └── metrics/           (MetricsService)
│   └── messaging/             ✅ Complete
│       └── event-bus.service.ts
│
├── prisma/
│   ├── schema.prisma          ✅ Complete (25+ models)
│   ├── seed.ts                ✅ Complete (Test data)
│   └── migrations/            (Generated after first run)
│
├── docker-compose.yml         ✅ Complete
├── package.json               ✅ Complete
├── nest-cli.json              ✅ Complete
├── tsconfig.json              ✅ Complete
├── .env                       ✅ Complete
├── setup.sh                   ✅ Complete
├── README.md                  ✅ Complete
└── QUICKSTART.md              ✅ Complete
```

## Next Steps - Implementation Phases

### Phase 2: Auth Service - Advanced Features (Estimated: 4-6 hours)

#### MFA Implementation
- [ ] TOTP setup and verification
- [ ] Backup codes generation
- [ ] SMS OTP integration (Twilio)
- [ ] QR code generation for authenticator apps

#### SSO Integration
- [ ] SAML configuration
- [ ] OAuth 2.0 support (Azure AD, Okta)
- [ ] Identity provider metadata handling
- [ ] SSO session management

#### Enhanced Security
- [ ] Email verification flow
- [ ] Password reset with tokens
- [ ] Device fingerprinting
- [ ] Security event logging
- [ ] Suspicious activity detection

#### Endpoints to Add
```typescript
// MFA Endpoints
POST   /api/v1/auth/mfa/setup
POST   /api/v1/auth/mfa/verify
POST   /api/v1/auth/mfa/disable
POST   /api/v1/auth/mfa/backup-codes
GET    /api/v1/auth/mfa/status

// Password Management
POST   /api/v1/auth/password/forgot
POST   /api/v1/auth/password/reset
POST   /api/v1/auth/password/validate

// SSO
GET    /api/v1/auth/sso/saml/metadata
POST   /api/v1/auth/sso/saml/acs
GET    /api/v1/auth/sso/saml/login
GET    /api/v1/auth/sso/oauth/authorize
POST   /api/v1/auth/sso/oauth/callback

// Sessions
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id
DELETE /api/v1/auth/sessions/all

// Audit
GET    /api/v1/auth/audit/login-history
GET    /api/v1/auth/audit/security-events
```

### Phase 3: Tenant Service (Estimated: 3-4 hours)

#### Features
- [ ] Multi-tenant CRUD operations
- [ ] Tenant isolation middleware
- [ ] Custom branding (logo, colors, domain)
- [ ] Subscription management
- [ ] Usage tracking and limits
- [ ] Feature flags per tenant

#### Controllers
```typescript
// tenant.controller.ts
POST   /api/v1/tenants
GET    /api/v1/tenants
GET    /api/v1/tenants/:id
PUT    /api/v1/tenants/:id
DELETE /api/v1/tenants/:id
PATCH  /api/v1/tenants/:id/activate
PATCH  /api/v1/tenants/:id/suspend

// branding.controller.ts
PUT    /api/v1/tenants/:id/branding
POST   /api/v1/tenants/:id/logo
GET    /api/v1/tenants/:id/branding
PUT    /api/v1/tenants/:id/domain

// subscription.controller.ts
GET    /api/v1/tenants/:id/subscription
PUT    /api/v1/tenants/:id/subscription
GET    /api/v1/tenants/:id/usage
```

### Phase 4: Course Service (Estimated: 8-10 hours)

#### Features
- [ ] Course CRUD with modules/chapters
- [ ] SCORM 1.2 & 2004 package handling
- [ ] Quiz engine with multiple question types
- [ ] Enrollment management (bulk operations)
- [ ] Progress tracking
- [ ] Learning paths with prerequisites
- [ ] Certificate generation

#### Major Components
```typescript
// Controllers
- course.controller.ts        (20+ endpoints)
- module.controller.ts
- enrollment.controller.ts
- quiz.controller.ts
- learning-path.controller.ts
- scorm.controller.ts

// Services
- course.service.ts
- scorm.service.ts           (Package parsing)
- quiz.service.ts            (Question types, grading)
- enrollment.service.ts
- progress.service.ts
```

### Phase 5: Content Service (Estimated: 6-8 hours)

#### Features
- [ ] File upload (single & multipart)
- [ ] S3/MinIO integration
- [ ] Video transcoding (FFmpeg)
- [ ] Image optimization
- [ ] CDN integration
- [ ] Streaming support (HLS/DASH)
- [ ] SCORM package extraction

#### Technical Implementation
```typescript
// Services
- upload.service.ts          (Multer + S3)
- transcoding.service.ts     (Bull queue + FFmpeg)
- streaming.service.ts       (HLS segments)
- cdn.service.ts            (Invalidation)
```

### Phase 6: Analytics Service (Estimated: 6-8 hours)

#### Features
- [ ] Risk scoring algorithm (0-100)
- [ ] Behavioral pattern detection
- [ ] Phishing simulation tracking
- [ ] Personalized recommendations (ML-based)
- [ ] Predictive analytics
- [ ] Auto-remediation triggers

#### Risk Scoring Algorithm
```typescript
// Weighted factors
- Phishing failures: 25%
- Training completion: 20%
- Time since last training: 15%
- Quiz performance: 15%
- Security incidents: 15%
- Login anomalies: 10%
```

### Phase 7: Reporting Service (Estimated: 5-6 hours)

#### Features
- [ ] Executive dashboards
- [ ] Compliance reports (POPIA, GDPR, SOC2, ISO 27001)
- [ ] Custom report builder
- [ ] Scheduled reports (cron jobs)
- [ ] Multi-format exports (PDF, Excel, CSV)
- [ ] Email delivery

#### Libraries Needed
```typescript
- pdfkit           (PDF generation)
- exceljs          (Excel export)
- node-cron        (Scheduled reports)
- chart.js         (Visualizations)
```

### Phase 8: Notification Service (Estimated: 4-5 hours)

#### Features
- [ ] Email notifications (Nodemailer)
- [ ] SMS (Twilio)
- [ ] In-app notifications
- [ ] Push notifications (Web Push)
- [ ] Template management (Handlebars)
- [ ] Delivery tracking
- [ ] Multi-language support

#### Queue System
```typescript
// Bull queues
- email-queue
- sms-queue
- push-queue
```

### Phase 9: Integration Service (Estimated: 5-6 hours)

#### Features
- [ ] API key management
- [ ] Rate limiting (per key)
- [ ] Webhook handling
- [ ] HRIS integrations (Workday, BambooHR)
- [ ] BI tool connectors (Power BI, Tableau)
- [ ] Third-party LMS sync
- [ ] Webhook retry logic

### Phase 10: Testing & Documentation (Estimated: 8-10 hours)

#### Tasks
- [ ] Unit tests for all services (Jest)
- [ ] Integration tests
- [ ] E2E tests (Supertest)
- [ ] API documentation (Swagger)
- [ ] Postman collections
- [ ] Architecture diagrams
- [ ] Deployment guide
- [ ] User manual

### Phase 11: Deployment & DevOps (Estimated: 6-8 hours)

#### Tasks
- [ ] Docker images for each service
- [ ] Kubernetes manifests
- [ ] Helm charts
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment configs (dev, staging, prod)
- [ ] Secrets management (Vault)
- [ ] Log aggregation (ELK stack)
- [ ] Monitoring alerts

## Development Workflow

### Starting a New Service

1. **Create Service Structure**
```bash
cd apps/new-service/src
mkdir controllers services dto entities
```

2. **Create Module & Main**
```typescript
// new-service.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    LoggingModule,
    MonitoringModule,
    AuthModule,
  ],
  controllers: [NewController],
  providers: [NewService],
})
export class NewServiceModule {}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(NewServiceModule);
  // ... setup similar to auth-service
  await app.listen(3002); // Increment port
}
```

3. **Add to nest-cli.json**
```json
"new-service": {
  "type": "application",
  "root": "apps/new-service",
  "entryFile": "main",
  "sourceRoot": "apps/new-service/src"
}
```

### Testing Locally

```bash
# Terminal 1 - Start infrastructure
npm run docker:dev

# Terminal 2 - Start service
nest start new-service --watch

# Terminal 3 - Test API
curl http://localhost:3002/health
```

### Database Changes

```bash
# Modify prisma/schema.prisma

# Create migration
npx prisma migrate dev --name add_new_model

# Generate client
npx prisma generate

# Seed (if needed)
npm run prisma:seed
```

## Best Practices

### 1. Error Handling
```typescript
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Access denied');
throw new NotFoundException('Resource not found');
```

### 2. Logging
```typescript
constructor(private logger: LoggerService) {}

this.logger.log('User logged in', 'AuthService');
this.logger.error('Login failed', trace, 'AuthService');
```

### 3. Events
```typescript
constructor(private eventBus: EventBusService) {}

await this.eventBus.publish(EVENTS.USER_CREATED, { userId });
```

### 4. Authorization
```typescript
@Roles('SUPER_ADMIN', 'TENANT_ADMIN')
@Get('admin-only')
adminEndpoint() {}
```

### 5. Swagger Documentation
```typescript
@ApiTags('users')
@ApiOperation({ summary: 'Get user profile' })
@ApiResponse({ status: 200, description: 'Success' })
@ApiBearerAuth()
```

## Performance Tips

1. **Database Queries**
   - Use `select` to fetch only needed fields
   - Implement pagination for large datasets
   - Add indexes for frequently queried fields

2. **Caching**
   - Cache tenant settings in Redis
   - Cache course data for faster access
   - Implement cache invalidation strategies

3. **Queue Processing**
   - Use Bull for heavy tasks (transcoding, reports)
   - Implement retry logic with exponential backoff
   - Monitor queue health

4. **API Optimization**
   - Implement rate limiting
   - Use compression middleware
   - Enable HTTP/2

## Monitoring

### Key Metrics to Track
- Request rate per service
- Response times (p50, p95, p99)
- Error rates
- Database query performance
- Queue length
- Memory/CPU usage

### Health Checks
```bash
# Check service health
curl http://localhost:3001/health
curl http://localhost:3001/health/ready
curl http://localhost:3001/health/live
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Run `npm install`
   - Check tsconfig.json paths
   - Restart TypeScript server

2. **Database connection issues**
   - Check Docker containers: `docker ps`
   - Verify DATABASE_URL in .env
   - Run migrations: `npx prisma migrate dev`

3. **Port already in use**
   - Kill process: `lsof -ti:3001 | xargs kill`
   - Change port in service configuration

4. **Prisma Client outdated**
   - Run `npx prisma generate`

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [Pino Logger](https://github.com/pinojs/pino)

---

**Current Status: Phase 1 Complete ✅**

Ready to continue with Phase 2? Let's build the remaining services! 🚀
