# Testing Setup & Execution Guide

This guide explains how to set up and run tests for the Cybersecurity Training Platform frontend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before running tests, ensure you have:

1. ✅ **Backend services running**

   ```bash
   cd .. # Go to root directory
   npm run docker:dev  # Start infrastructure
   npm run start:dev   # Start all microservices
   ```

2. ✅ **Database seeded with test data**

   ```bash
   cd .. # Go to root directory
   npm run prisma:migrate
   npm run prisma:seed
   ```

3. ✅ **Frontend environment configured**
   - `.env.local` file exists with correct service URLs
   - Run setup script: `./setup-test-env.sh`

## Installation

### 1. Install Testing Dependencies

```bash
cd frontend

# Install Vitest and Testing Library (for unit/integration tests)
npm install --save-dev vitest @vitejs/plugin-react jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev msw

# Install Playwright (for E2E tests)
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Create Vitest Configuration

Create `vitest.config.ts` in the frontend directory:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Create Test Setup File

Create `src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { setupMockServer } from './utils/mock-server';

// Setup MSW server
setupMockServer();
```

### 4. Update package.json

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:setup": "./setup-test-env.sh"
  }
}
```

## Running Tests

### Verify Environment Setup

Before running tests, verify your environment:

```bash
./setup-test-env.sh
```

This script checks:

- ✅ Environment variables configured
- ✅ Dependencies installed
- ✅ Backend services running
- ✅ Database connection

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/__tests__/hooks/use-courses.test.tsx

# Run tests matching pattern
npm run test -- --grep "enrollment"
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npm run test:e2e -- e2e/auth.spec.ts

# Run tests in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Debug tests
npm run test:e2e -- --debug
```

## Test Structure

### Project Organization

```
frontend/
├── e2e/                          # E2E tests (Playwright)
│   ├── auth.spec.ts
│   ├── courses.spec.ts
│   └── dashboard.spec.ts
├── src/
│   ├── __tests__/                # Unit & integration tests
│   │   ├── hooks/
│   │   │   ├── use-auth.test.tsx
│   │   │   ├── use-courses.test.tsx
│   │   │   └── use-analytics.test.tsx
│   │   ├── components/
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── mock-server.ts    # MSW server setup
│   │   │   └── test-utils.tsx     # Custom render utilities
│   │   └── setup.ts               # Test setup
│   ├── hooks/                     # React Query hooks
│   │   ├── use-auth.ts
│   │   ├── use-courses.ts
│   │   ├── use-analytics.ts
│   │   └── use-reports.ts
│   └── ...
├── playwright.config.ts           # Playwright configuration
├── vitest.config.ts               # Vitest configuration
└── setup-test-env.sh              # Environment setup script
```

## Writing Tests

### Unit Tests (React Query Hooks)

Example: Testing a React Query hook

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCourses } from '@/hooks/use-courses';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCourses Hook', () => {
  it('should fetch courses successfully', async () => {
    const { result } = renderHook(
      () => useCourses().useGetCourses(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(2);
  });
});
```

### Component Tests

Example: Testing a page component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import CoursesPage from '@/app/(dashboard)/courses/page';

describe('CoursesPage', () => {
  it('should display course catalog', async () => {
    render(<CoursesPage />);

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('Course Catalog')).toBeInTheDocument();
    });

    // Check if courses are displayed
    expect(screen.getByText('Phishing Awareness Training')).toBeInTheDocument();
  });

  it('should filter courses by search', async () => {
    const { user } = render(<CoursesPage />);

    const searchInput = screen.getByPlaceholderText('Search courses...');
    await user.type(searchInput, 'phishing');

    await waitFor(() => {
      expect(screen.getByText('Phishing Awareness Training')).toBeInTheDocument();
      expect(screen.queryByText('Password Security')).not.toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

Example: Testing a user flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Course Enrollment Flow', () => {
  test('user can enroll in a course', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Browse courses
    await page.goto('/courses');
    await page.click('text=Phishing Awareness Training');

    // Enroll
    await page.click('button:has-text("Enroll Now")');
    await expect(page.locator('text=Enrolled')).toBeVisible();

    // Verify in My Courses
    await page.goto('/my-courses');
    await expect(page.locator('text=Phishing Awareness Training')).toBeVisible();
  });
});
```

## Test Data

### Mock Service Worker (MSW)

The mock server (`src/__tests__/utils/mock-server.ts`) provides mock API responses for testing:

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get('http://localhost:3004/api/v1/courses', () => {
    return HttpResponse.json({
      data: [
        /* mock courses */
      ],
      pagination: { total: 10, page: 1, limit: 20 },
    });
  }),
];

export const server = setupServer(...handlers);
```

### Real API Testing

For E2E tests, use real backend services with seeded test data:

```bash
# Seed database with test data
cd .. && npm run prisma:seed
```

Test users created by seed:

- **Admin**: `admin@example.com` / `password123`
- **Instructor**: `instructor@example.com` / `password123`
- **Learner**: `learner@example.com` / `password123`

## Coverage Reports

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### View Coverage Report

```bash
# Open coverage report in browser
open coverage/index.html
```

### Coverage Goals

Target coverage thresholds:

- **Statements**: > 70%
- **Branches**: > 65%
- **Functions**: > 70%
- **Lines**: > 70%

## Troubleshooting

### Backend Services Not Running

**Problem**: Tests fail because backend services are not responding.

**Solution**:

```bash
# Verify services are running
./setup-test-env.sh

# Start services if needed
cd .. && npm run docker:dev
cd .. && npm run start:dev
```

### Database Connection Issues

**Problem**: Tests fail with database connection errors.

**Solution**:

```bash
# Check database is running
docker ps | grep postgres

# Run migrations
cd .. && npm run prisma:migrate

# Seed test data
cd .. && npm run prisma:seed
```

### Port Conflicts

**Problem**: Frontend dev server can't start because port 3000 is in use.

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3010 npm run dev
```

### Mock Server Not Working

**Problem**: Unit tests fail because MSW is not intercepting requests.

**Solution**:

- Ensure `setupMockServer()` is called in test setup
- Check handler URLs match the API client configuration
- Verify MSW is imported before any API calls

### Playwright Browser Issues

**Problem**: Playwright tests fail with browser launch errors.

**Solution**:

```bash
# Reinstall browsers
npx playwright install

# Install system dependencies (Linux/CI)
npx playwright install-deps
```

### TypeScript Errors in Tests

**Problem**: TypeScript complains about test utilities or types.

**Solution**:

```bash
# Install missing types
npm install --save-dev @types/node

# Check tsconfig includes test files
# Ensure "include" has __tests__ and e2e folders
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install

      - name: Start backend services
        run: |
          npm run docker:dev
          npm run start:dev &

      - name: Run migrations
        run: npm run prisma:migrate

      - name: Run unit tests
        run: cd frontend && npm run test

      - name: Install Playwright browsers
        run: cd frontend && npx playwright install

      - name: Run E2E tests
        run: cd frontend && npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report
```

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('should update user profile', async () => {
  // Arrange
  const { user } = render(<ProfilePage />);
  const nameInput = screen.getByLabelText('Name');

  // Act
  await user.clear(nameInput);
  await user.type(nameInput, 'New Name');
  await user.click(screen.getByText('Save'));

  // Assert
  await waitFor(() => {
    expect(screen.getByText('Profile updated')).toBeInTheDocument();
  });
});
```

### 2. Use Data Attributes for Testing

```tsx
// Component
<button data-testid="enroll-button" onClick={handleEnroll}>
  Enroll Now
</button>;

// Test
await page.click('[data-testid="enroll-button"]');
```

### 3. Avoid Implementation Details

```typescript
// ❌ Bad - testing implementation
expect(component.state.isLoading).toBe(false);

// ✅ Good - testing behavior
expect(screen.getByText('Submit')).toBeEnabled();
```

### 4. Use Factories for Test Data

```typescript
const createMockCourse = (overrides = {}) => ({
  id: 'course-1',
  title: 'Test Course',
  status: 'PUBLISHED',
  ...overrides,
});

const course = createMockCourse({ title: 'Custom Course' });
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)

## Support

For testing questions or issues:

1. Check this README
2. Review test examples in `__tests__/` and `e2e/`
3. Consult the main `TESTING_PLAN.md`
4. Contact the development team
