import { useCourses } from '@/hooks/use-courses';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../utils/mock-server';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCourses Hook', () => {
  it('should fetch courses successfully', async () => {
    const { result } = renderHook(() => useCourses().useGetCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].title).toBe('Phishing Awareness Training');
  });

  it('should filter courses by search term', async () => {
    const { result } = renderHook(() => useCourses().useGetCourses({ search: 'password' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].title).toContain('Password');
  });

  it('should fetch single course by ID', async () => {
    const { result } = renderHook(() => useCourses().useGetCourse('course-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe('course-1');
    expect(result.current.data?.title).toBeDefined();
  });

  it('should handle course not found', async () => {
    server.use(
      http.get('http://localhost:3004/api/v1/courses/invalid-id', () => {
        return HttpResponse.json({ message: 'Course not found' }, { status: 404 });
      }),
    );

    const { result } = renderHook(() => useCourses().useGetCourse('invalid-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should fetch user enrollments', async () => {
    const { result } = renderHook(() => useCourses().useMyEnrollments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].status).toBe('IN_PROGRESS');
  });

  it('should enroll in a course', async () => {
    const { result } = renderHook(() => useCourses().useEnrollCourse(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('course-2');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.courseId).toBe('course-2');
  });
});
