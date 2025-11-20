#!/bin/bash

# Frontend Testing Environment Setup Script
# This script verifies that all backend services are running and ready

set -e

echo "🔍 Frontend Testing Environment Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service URLs
declare -A SERVICES=(
  ["Auth Service"]="http://localhost:3001/health"
  ["Tenant Service"]="http://localhost:3002/health"
  ["User Service"]="http://localhost:3003/health"
  ["Course Service"]="http://localhost:3004/health"
  ["Content Service"]="http://localhost:3005/health"
  ["Analytics Service"]="http://localhost:3006/health"
  ["Reporting Service"]="http://localhost:3007/health"
  ["Notification Service"]="http://localhost:3008/health"
  ["Integration Service"]="http://localhost:3009/health"
)

# Check if .env.local exists
echo "📋 Step 1: Checking environment configuration..."
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
  cp .env.local.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
NEXT_PUBLIC_AUTH_SERVICE=http://localhost:3001
NEXT_PUBLIC_TENANT_SERVICE=http://localhost:3002
NEXT_PUBLIC_USER_SERVICE=http://localhost:3003
NEXT_PUBLIC_COURSE_SERVICE=http://localhost:3004
NEXT_PUBLIC_CONTENT_SERVICE=http://localhost:3005
NEXT_PUBLIC_ANALYTICS_SERVICE=http://localhost:3006
NEXT_PUBLIC_REPORTING_SERVICE=http://localhost:3007
NEXT_PUBLIC_NOTIFICATION_SERVICE=http://localhost:3008
NEXT_PUBLIC_INTEGRATION_SERVICE=http://localhost:3009
EOF
  echo -e "${GREEN}✓ .env.local created${NC}"
else
  echo -e "${GREEN}✓ .env.local exists${NC}"
fi
echo ""

# Check if node_modules exists
echo "📦 Step 2: Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Check backend services
echo "🌐 Step 3: Checking backend services..."
FAILED_SERVICES=()

for service_name in "${!SERVICES[@]}"; do
  url="${SERVICES[$service_name]}"
  printf "   Checking %-25s" "$service_name..."

  if curl -s -f -o /dev/null --max-time 3 "$url"; then
    echo -e "${GREEN}✓ Running${NC}"
  else
    echo -e "${RED}✗ Not responding${NC}"
    FAILED_SERVICES+=("$service_name")
  fi
done
echo ""

# Report results
if [ ${#FAILED_SERVICES[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All backend services are running!${NC}"
  echo ""

  # Check database
  echo "🗄️  Step 4: Checking database connection..."
  cd .. # Go to root directory
  if npx prisma db pull --force 2>/dev/null; then
    echo -e "${GREEN}✓ Database connected${NC}"
  else
    echo -e "${YELLOW}⚠️  Could not verify database connection${NC}"
  fi
  cd frontend
  echo ""

  # Summary
  echo "✅ Environment Setup Complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Ensure database is seeded: cd .. && npm run prisma:seed"
  echo "  2. Start frontend: npm run dev"
  echo "  3. Open http://localhost:3000"
  echo ""
  echo "For testing:"
  echo "  - Run unit tests: npm run test"
  echo "  - Run E2E tests: npm run test:e2e"
  echo ""

else
  echo -e "${RED}❌ Some services are not running:${NC}"
  for service in "${FAILED_SERVICES[@]}"; do
    echo -e "${RED}   - $service${NC}"
  done
  echo ""
  echo "Please start the backend services:"
  echo "  cd .. && npm run docker:dev"
  echo "  cd .. && npm run start:dev"
  echo ""
  exit 1
fi
