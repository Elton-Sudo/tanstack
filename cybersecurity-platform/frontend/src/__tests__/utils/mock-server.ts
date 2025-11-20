import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock data
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'LEARNER',
  tenantId: 'tenant-1',
  mfaEnabled: false,
};

const mockCourses = [
  {
    id: 'course-1',
    title: 'Phishing Awareness Training',
    description: 'Learn to identify and prevent phishing attacks',
    category: 'PHISHING',
    difficulty: 'BEGINNER',
    duration: 120,
    status: 'PUBLISHED',
    thumbnail: 'https://example.com/thumbnail.jpg',
    _count: {
      enrollments: 245,
      modules: 5,
    },
  },
  {
    id: 'course-2',
    title: 'Password Security Best Practices',
    description: 'Master the art of creating and managing secure passwords',
    category: 'PASSWORD_SECURITY',
    difficulty: 'BEGINNER',
    duration: 90,
    status: 'PUBLISHED',
    _count: {
      enrollments: 189,
      modules: 4,
    },
  },
];

const mockEnrollments = [
  {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: 'course-1',
    progress: 75,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-11-15T10:00:00.000Z',
    lastAccessedAt: '2025-11-20T08:30:00.000Z',
    course: mockCourses[0],
  },
];

const mockDashboardMetrics = {
  totalUsers: 2543,
  activeUsers: 1876,
  completedCourses: 1234,
  averageRiskScore: 68,
  trainingHours: 4892,
  complianceRate: 85.5,
  trends: {
    users: 12.5,
    courses: 8.2,
    risk: -5.3,
    hours: 15.8,
  },
};

const mockRiskScore = {
  id: 'risk-1',
  userId: 'user-1',
  score: 72,
  level: 'MEDIUM',
  factors: [
    { name: 'Training Completion', score: 85, weight: 0.3 },
    { name: 'Quiz Performance', score: 78, weight: 0.3 },
    { name: 'Phishing Tests', score: 65, weight: 0.2 },
    { name: 'Policy Compliance', score: 70, weight: 0.2 },
  ],
  lastCalculated: '2025-11-20T00:00:00.000Z',
};

// API Handlers
export const handlers = [
  // Auth Service
  http.get('http://localhost:3001/api/v1/auth/profile', () => {
    return HttpResponse.json(mockUser);
  }),

  http.post('http://localhost:3001/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: mockUser,
    });
  }),

  http.post('http://localhost:3001/api/v1/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.put('http://localhost:3001/api/v1/auth/profile', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({ ...mockUser, ...body });
  }),

  http.post('http://localhost:3001/api/v1/auth/mfa/enable', () => {
    return HttpResponse.json({
      secret: 'mock-secret',
      qrCode: 'data:image/png;base64,mock-qr-code',
    });
  }),

  // Course Service
  http.get('http://localhost:3004/api/v1/courses', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let filteredCourses = mockCourses;
    if (search) {
      filteredCourses = mockCourses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return HttpResponse.json({
      data: filteredCourses,
      pagination: {
        total: filteredCourses.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    });
  }),

  http.get('http://localhost:3004/api/v1/courses/:id', ({ params }) => {
    const course = mockCourses.find((c) => c.id === params.id);
    if (!course) {
      return HttpResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    return HttpResponse.json({
      ...course,
      modules: [
        {
          id: 'module-1',
          title: 'Introduction',
          order: 1,
          chapters: [
            {
              id: 'chapter-1',
              title: 'What is Phishing?',
              order: 1,
              duration: 15,
            },
          ],
        },
      ],
    });
  }),

  http.post('http://localhost:3004/api/v1/courses/:id/enroll', ({ params }) => {
    return HttpResponse.json({
      id: 'enrollment-new',
      userId: 'user-1',
      courseId: params.id,
      progress: 0,
      status: 'IN_PROGRESS',
      enrolledAt: new Date().toISOString(),
    });
  }),

  http.get('http://localhost:3004/api/v1/enrollments/my', () => {
    return HttpResponse.json(mockEnrollments);
  }),

  http.get('http://localhost:3004/api/v1/enrollments/:id', ({ params }) => {
    const enrollment = mockEnrollments.find((e) => e.id === params.id);
    return HttpResponse.json(enrollment || mockEnrollments[0]);
  }),

  http.put('http://localhost:3004/api/v1/enrollments/:id/progress', async ({ request, params }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      ...mockEnrollments[0],
      id: params.id,
      progress: body.progress,
    });
  }),

  // Analytics/Reporting Service
  http.post('http://localhost:3007/api/v1/reports/dashboard/executive', () => {
    return HttpResponse.json(mockDashboardMetrics);
  }),

  http.get('http://localhost:3006/api/v1/risk-scores/my', () => {
    return HttpResponse.json(mockRiskScore);
  }),

  http.get('http://localhost:3006/api/v1/risk-scores', () => {
    return HttpResponse.json([mockRiskScore]);
  }),

  http.get('http://localhost:3007/api/v1/reports/compliance/:framework', ({ params }) => {
    return HttpResponse.json({
      framework: params.framework,
      completionRate: 85.5,
      requiredCourses: 10,
      completedCourses: 8,
      pendingCourses: 2,
      expiringCertificates: 1,
    });
  }),

  // Notifications Service
  http.get('http://localhost:3008/api/v1/notifications/my', () => {
    return HttpResponse.json([
      {
        id: 'notif-1',
        title: 'Course Completed',
        message: 'You have completed Phishing Awareness Training',
        type: 'SUCCESS',
        read: false,
        createdAt: '2025-11-20T10:00:00.000Z',
      },
      {
        id: 'notif-2',
        title: 'New Course Available',
        message: 'Check out the new Data Protection course',
        type: 'INFO',
        read: true,
        createdAt: '2025-11-19T15:30:00.000Z',
      },
    ]);
  }),
];

// Setup server
export const server = setupServer(...handlers);

// Start server before all tests
export const setupMockServer = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
