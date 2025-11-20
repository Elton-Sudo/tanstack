import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { setupMockServer } from './mock-server';

// Setup MSW server
setupMockServer();

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Renamed from cacheTime in v5
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const testQueryClient = createTestQueryClient();

  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper to wait for loading states to complete
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0));

// Helper to create mock user
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'LEARNER',
  tenantId: 'tenant-1',
  ...overrides,
});

// Helper to create mock course
export const createMockCourse = (overrides = {}) => ({
  id: 'course-1',
  title: 'Test Course',
  description: 'Test Description',
  category: 'PHISHING',
  difficulty: 'BEGINNER',
  duration: 120,
  status: 'PUBLISHED',
  ...overrides,
});

// Helper to create mock enrollment
export const createMockEnrollment = (overrides = {}) => ({
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: 'course-1',
  progress: 50,
  status: 'IN_PROGRESS',
  enrolledAt: new Date().toISOString(),
  ...overrides,
});
