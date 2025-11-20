# Tech Stack Configuration Guide

## Complete Technology Stack

### Core Framework & Language

- **Next.js**: 14+ (App Router)
- **TypeScript**: 5.0+ (strict mode)
- **React**: 18+

### Styling & UI

- **Tailwind CSS**: 3.4+
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **tailwindcss-animate**: Animations

### State Management

- **Zustand**: 4.4+ (lightweight state)
- **Redux Toolkit**: 2.0+ (complex state - optional)

### Data Fetching & Caching

- **TanStack Query (React Query)**: 5.0+
- **Axios**: 1.6+

### Forms & Validation

- **React Hook Form**: 7.48+
- **Zod**: 3.22+
- **@hookform/resolvers**: 3.3+

### Rich Media

- **Tiptap** or **Lexical**: Rich text editor
- **Video.js** or **Plyr**: Video player
- **react-dropzone**: File uploads
- **QRCode.react**: QR code generation (MFA)

### Charts & Visualizations

- **Recharts**: 2.10+ (recommended)
- **Chart.js** + **react-chartjs-2**: Alternative

### Tables

- **TanStack Table**: 8.10+

### Date & Time

- **date-fns**: 3.0+

### Notifications

- **sonner**: Toast notifications (recommended)
- **react-hot-toast**: Alternative

### Testing

- **Vitest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **@axe-core/react**: Accessibility tests

### Development Tools

- **ESLint**: 8.54+
- **Prettier**: 3.1+
- **TypeScript ESLint**: Parser & plugin

### Real-time Communication

- **Socket.io-client**: WebSocket
- **Server-Sent Events (SSE)**: Alternative

### PWA & Offline

- **next-pwa**: Progressive Web App support

### Internationalization

- **next-intl**: i18n support

---

## Installation Commands

### 1. Initialize Project (if not already done)

```bash
cd /Users/eltonsudo/Sandbox/PlayGround/tanstack/cybersecurity-platform/frontend
# Already initialized, skip this step
```

### 2. Install Core Dependencies

```bash
# State Management & Data Fetching
npm install zustand@4.4.7
npm install @tanstack/react-query@5.13.4 @tanstack/react-query-devtools@5.13.4

# API Client
npm install axios@1.6.2

# Forms & Validation
npm install react-hook-form@7.48.2 zod@3.22.4 @hookform/resolvers@3.3.2

# Notifications
npm install sonner@1.2.3

# Icons
npm install lucide-react@0.294.0

# Date Utilities
npm install date-fns@3.0.0

# Utility Functions
npm install clsx@2.0.0 tailwind-merge@2.1.0
```

### 3. Install shadcn/ui

```bash
# Initialize shadcn/ui (if not done)
npx shadcn-ui@latest init

# Install all necessary components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add table
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
npx shadcn-ui@latest add calendar
```

### 4. Install Rich Media Libraries

```bash
# Rich Text Editor (choose one)
npm install @tiptap/react@2.1.13 @tiptap/starter-kit@2.1.13
# OR
npm install lexical@0.12.5 @lexical/react@0.12.5

# Video Player (choose one)
npm install video.js@8.6.1 @types/video.js
# OR
npm install plyr-react@5.3.0

# File Upload
npm install react-dropzone@14.2.3

# QR Code (for MFA)
npm install qrcode.react@3.1.0
```

### 5. Install Charts & Tables

```bash
# Charts (choose one)
npm install recharts@2.10.3
# OR
npm install chart.js@4.4.1 react-chartjs-2@5.2.0

# Tables
npm install @tanstack/react-table@8.10.7
```

### 6. Install Real-time Communication

```bash
# WebSocket
npm install socket.io-client@4.6.0
```

### 7. Install PWA Support

```bash
npm install next-pwa@5.6.0
npm install -D webpack@5.89.0
```

### 8. Install Internationalization

```bash
npm install next-intl@3.4.4
```

### 9. Install Development Dependencies

```bash
# Testing
npm install -D vitest@1.0.4
npm install -D @testing-library/react@14.1.2 @testing-library/jest-dom@6.1.5
npm install -D @playwright/test@1.40.1
npm install -D @axe-core/react@4.8.2

# TypeScript Types
npm install -D @types/node@20.10.5
npm install -D @types/react@18.2.45
npm install -D @types/react-dom@18.2.18

# Linting & Formatting
npm install -D eslint@8.56.0
npm install -D eslint-config-prettier@9.1.0
npm install -D prettier@3.1.1
npm install -D @typescript-eslint/eslint-plugin@6.15.0
npm install -D @typescript-eslint/parser@6.15.0

# Tailwind
npm install -D tailwindcss@3.4.0
npm install -D autoprefixer@10.4.16
npm install -D postcss@8.4.32
npm install -D tailwindcss-animate@1.0.7
```

---

## Configuration Files

### 1. package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3010",
    "build": "next build",
    "start": "next start -p 3010",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 2. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 4. .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 5. .prettierignore

```
node_modules
.next
out
build
dist
coverage
*.lock
package-lock.json
yarn.lock
pnpm-lock.yaml
```

### 6. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      // Add your CDN domains here
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  // PWA Configuration
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

module.exports = nextConfig;
```

### 7. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 8. postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 9. .env.local

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_COURSE_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_CONTENT_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_ANALYTICS_SERVICE_URL=http://localhost:3005
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:3006
NEXT_PUBLIC_REPORTING_SERVICE_URL=http://localhost:3007
NEXT_PUBLIC_INTEGRATION_SERVICE_URL=http://localhost:3008
NEXT_PUBLIC_TENANT_SERVICE_URL=http://localhost:3009

# App Configuration
NEXT_PUBLIC_APP_NAME=CyberSecurity Training Platform
NEXT_PUBLIC_APP_URL=http://localhost:3010
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_MFA=true
NEXT_PUBLIC_ENABLE_SSO=false
NEXT_PUBLIC_ENABLE_GAMIFICATION=true
NEXT_PUBLIC_ENABLE_PWA=false

# Session Configuration
SESSION_SECRET=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_MAX_VIDEO_SIZE=524288000

# CDN Configuration (optional)
NEXT_PUBLIC_CDN_URL=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

### 10. .env.example

```bash
# Copy this file to .env.local and fill in the values

# API Configuration
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AUTH_SERVICE_URL=
NEXT_PUBLIC_USER_SERVICE_URL=
NEXT_PUBLIC_COURSE_SERVICE_URL=

# App Configuration
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_URL=

# Session Configuration
SESSION_SECRET=

# Feature Flags
NEXT_PUBLIC_ENABLE_MFA=true
NEXT_PUBLIC_ENABLE_SSO=false
```

### 11. vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 12. playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3010',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3010',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 13. .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage
/playwright-report
/test-results

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea
*.swp
*.swo
```

---

## Folder Structure

```
frontend/
├── public/
│   ├── images/
│   │   └── logo.png
│   ├── fonts/
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   └── mfa/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── courses/
│   │   │   ├── users/
│   │   │   ├── tenants/
│   │   │   ├── reports/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── shared/          # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── auth/            # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── MfaVerification.tsx
│   │   │   └── PasswordStrength.tsx
│   │   └── features/        # Feature-specific components
│   │       ├── courses/
│   │       ├── users/
│   │       └── tenants/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints/
│   │   │       ├── auth.ts
│   │   │       ├── users.ts
│   │   │       ├── courses.ts
│   │   │       └── tenants.ts
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   └── tokens.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   └── validations/
│   │       ├── auth.ts
│   │       ├── course.ts
│   │       └── user.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useCourses.ts
│   │   └── useDebounce.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── course.ts
│   │   └── api.ts
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   └── config.ts
│   ├── __tests__/
│   │   ├── setup.ts
│   │   └── utils/
│   └── middleware.ts
├── e2e/
│   ├── auth.spec.ts
│   ├── courses.spec.ts
│   └── dashboard.spec.ts
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Quick Start Commands

### 1. Install All Dependencies

```bash
cd /Users/eltonsudo/Sandbox/PlayGround/tanstack/cybersecurity-platform/frontend
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## Component Library Setup

### shadcn/ui Initialization

```bash
npx shadcn-ui@latest init
```

Configuration options:

- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: tailwind.config.js
- Components directory: src/components/ui
- Utils directory: src/lib/utils

---

## Optional Enhancements

### 1. Storybook (Component Documentation)

```bash
npx storybook@latest init
```

### 2. Bundle Analyzer

```bash
npm install -D @next/bundle-analyzer
```

### 3. Performance Monitoring

```bash
npm install @sentry/nextjs
```

### 4. Analytics

```bash
npm install @vercel/analytics
```

---

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check `tsconfig.json` paths configuration
   - Ensure `@/*` alias is set correctly

2. **Tailwind styles not applying**
   - Verify `content` paths in `tailwind.config.js`
   - Check `globals.css` imports Tailwind directives

3. **React Query not caching**
   - Ensure `QueryClientProvider` wraps your app
   - Check `staleTime` configuration

4. **CORS errors**
   - Configure backend CORS settings
   - Check `withCredentials` in Axios config

5. **Environment variables not loading**
   - Prefix client-side variables with `NEXT_PUBLIC_`
   - Restart dev server after changes

---

## Performance Best Practices

1. **Code Splitting**
   - Use dynamic imports for large components
   - Implement route-based code splitting

2. **Image Optimization**
   - Use Next.js `<Image>` component
   - Specify width and height
   - Use appropriate formats (WebP, AVIF)

3. **Lazy Loading**
   - Lazy load below-the-fold content
   - Implement virtual scrolling for long lists

4. **Caching Strategies**
   - Configure React Query `staleTime` and `cacheTime`
   - Use SWR for frequently changing data

5. **Bundle Optimization**
   - Analyze bundle with `@next/bundle-analyzer`
   - Tree-shake unused code
   - Use production builds

---

**Last Updated**: November 20, 2025
