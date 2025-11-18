#!/bin/bash

# Cybersecurity Platform - Setup Script
# This script will help you get the platform up and running

set -e

echo "🛡️  Cybersecurity Training Platform - Setup Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
echo ""

# Check Docker
echo -e "${BLUE}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Start infrastructure services
echo -e "${BLUE}Starting infrastructure services (PostgreSQL, Redis, RabbitMQ, MinIO)...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ Infrastructure services started${NC}"
echo ""

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 5
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
echo ""

# Generate Prisma Client
echo -e "${BLUE}Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

# Run database migrations
echo -e "${BLUE}Running database migrations...${NC}"
npx prisma migrate dev --name init
echo -e "${GREEN}✓ Database migrations completed${NC}"
echo ""

# Seed database
echo -e "${BLUE}Seeding database...${NC}"
npm run prisma:seed
echo -e "${GREEN}✓ Database seeded${NC}"
echo ""

echo ""
echo -e "${GREEN}=================================================="
echo "✨ Setup completed successfully!"
echo "==================================================${NC}"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Start the Auth Service:"
echo "   npm run start:dev"
echo ""
echo "2. Access services:"
echo "   - Auth Service API: http://localhost:3001/api/v1"
echo "   - Swagger Docs: http://localhost:3001/api/docs"
echo "   - Prisma Studio: npm run prisma:studio"
echo ""
echo "3. Infrastructure services:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo "   - Prometheus: http://localhost:9090"
echo "   - Grafana: http://localhost:3333 (admin/admin)"
echo "   - Jaeger: http://localhost:16686"
echo ""
echo "4. Test credentials (after seeding):"
echo "   - Super Admin: superadmin@platform.com / Password123!"
echo "   - Tenant Admin: admin@acme.com / Password123!"
echo "   - Manager: manager@acme.com / Password123!"
echo "   - User: user1@acme.com / Password123!"
echo ""
echo "📖 For more information, see README.md"
echo ""
