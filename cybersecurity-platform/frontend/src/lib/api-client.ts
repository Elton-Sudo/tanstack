import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Service-specific clients
export const createServiceClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const authServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_AUTH_SERVICE || 'http://localhost:3001',
);
export const tenantServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_TENANT_SERVICE || 'http://localhost:3002',
);
export const userServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_USER_SERVICE || 'http://localhost:3003',
);
export const courseServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_COURSE_SERVICE || 'http://localhost:3004',
);
export const contentServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_CONTENT_SERVICE || 'http://localhost:3005',
);
export const analyticsServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_ANALYTICS_SERVICE || 'http://localhost:3006',
);
export const reportingServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_REPORTING_SERVICE || 'http://localhost:3007',
);
export const notificationServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE || 'http://localhost:3008',
);
export const integrationServiceClient = createServiceClient(
  process.env.NEXT_PUBLIC_INTEGRATION_SERVICE || 'http://localhost:3009',
);
