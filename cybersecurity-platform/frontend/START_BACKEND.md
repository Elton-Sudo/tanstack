# Starting Backend Services

## Error: Backend Services Not Running

If you see the error **"Network Error"** or **"Service unavailable"**, it means the backend microservices are not running.

## Quick Start

### 1. Start Infrastructure Services (Docker)

```bash
# From the root directory
cd /Users/eltonsudo/Sandbox/PlayGround/tanstack/cybersecurity-platform

# Start PostgreSQL, Redis, RabbitMQ, etc.
npm run docker:dev
```

Wait for all services to be healthy (about 30 seconds).

### 2. Run Database Migrations

```bash
# Still in root directory
npm run prisma:migrate
```

### 3. Seed the Database

```bash
npm run prisma:seed
```

This creates test data including:

- Test users (admin, instructor, learner)
- Sample courses
- Enrollments
- Certificates

### 4. Start All Microservices

```bash
# Start all 9 microservices in development mode
npm run start:dev
```

This will start:

- Auth Service (3001)
- Tenant Service (3002)
- User Service (3003)
- Course Service (3004)
- Content Service (3005)
- Analytics Service (3006)
- Reporting Service (3007)
- Notification Service (3008)
- Integration Service (3009)

### 5. Verify Services Are Running

```bash
# Check all services
curl http://localhost:3001/health  # Auth
curl http://localhost:3004/health  # Course
curl http://localhost:3007/health  # Reporting
```

Or use the setup script:

```bash
cd frontend
./setup-test-env.sh
```

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Test Credentials

After seeding, use these credentials:

- **Admin**: `admin@example.com` / `password123`
- **Instructor**: `instructor@example.com` / `password123`
- **Learner**: `learner@example.com` / `password123`

## Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -ti:3001 -ti:3002 -ti:3003 -ti:3004 -ti:3005 -ti:3006 -ti:3007 -ti:3008 -ti:3009

# Kill processes on those ports if needed
lsof -ti:3001,3002,3003,3004,3005,3006,3007,3008,3009 | xargs kill -9

# Restart
npm run start:dev
```

### Database Issues

```bash
# Reset database
npm run prisma:reset

# Or manually
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
npm run prisma:seed
```

### Docker Issues

```bash
# Clean up docker
npm run docker:clean

# Restart
npm run docker:dev
```

## Alternative: Mock Mode (For UI Development Only)

If you only need to work on UI without backend:

```bash
# Edit frontend/.env.local
NEXT_PUBLIC_MOCK_MODE=true
```

This will use mock data instead of real API calls. **Note: This is for UI development only and won't save any data.**

## Service Architecture

```
Frontend (3000)
    ↓
┌─────────────────────────────────────┐
│     Backend Microservices           │
├─────────────────────────────────────┤
│ Auth Service        (3001)          │
│ Tenant Service      (3002)          │
│ User Service        (3003)          │
│ Course Service      (3004)          │
│ Content Service     (3005)          │
│ Analytics Service   (3006)          │
│ Reporting Service   (3007)          │
│ Notification Svc    (3008)          │
│ Integration Service (3009)          │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│     Infrastructure                  │
├─────────────────────────────────────┤
│ PostgreSQL    (5432)                │
│ Redis         (6379)                │
│ RabbitMQ      (5672/15672)          │
│ MinIO         (9000/9001)           │
└─────────────────────────────────────┘
```

## Full Start Script

Create this script in the root directory for convenience:

```bash
#!/bin/bash
# start-all.sh

echo "🚀 Starting Cybersecurity Training Platform"
echo ""

echo "1️⃣  Starting infrastructure..."
npm run docker:dev
sleep 10

echo "2️⃣  Running migrations..."
npm run prisma:migrate

echo "3️⃣  Seeding database..."
npm run prisma:seed

echo "4️⃣  Starting backend services..."
npm run start:dev &

echo "5️⃣  Waiting for services to be ready..."
sleep 20

echo "✅ Backend ready! Start frontend with:"
echo "   cd frontend && npm run dev"
```

Make it executable:

```bash
chmod +x start-all.sh
./start-all.sh
```
