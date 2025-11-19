/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE || 'http://localhost:3001',
    NEXT_PUBLIC_TENANT_SERVICE: process.env.NEXT_PUBLIC_TENANT_SERVICE || 'http://localhost:3002',
    NEXT_PUBLIC_USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE || 'http://localhost:3003',
    NEXT_PUBLIC_COURSE_SERVICE: process.env.NEXT_PUBLIC_COURSE_SERVICE || 'http://localhost:3004',
    NEXT_PUBLIC_CONTENT_SERVICE: process.env.NEXT_PUBLIC_CONTENT_SERVICE || 'http://localhost:3005',
    NEXT_PUBLIC_ANALYTICS_SERVICE: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE || 'http://localhost:3006',
    NEXT_PUBLIC_REPORTING_SERVICE: process.env.NEXT_PUBLIC_REPORTING_SERVICE || 'http://localhost:3007',
    NEXT_PUBLIC_NOTIFICATION_SERVICE: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE || 'http://localhost:3008',
    NEXT_PUBLIC_INTEGRATION_SERVICE: process.env.NEXT_PUBLIC_INTEGRATION_SERVICE || 'http://localhost:3009',
  },
};

module.exports = nextConfig;
