'use client';

interface ServiceUnavailableProps {
  service?: string;
  onRetry?: () => void;
}

export function ServiceUnavailable({ service = 'Backend', onRetry }: ServiceUnavailableProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="max-w-md rounded-lg border border-orange-200 bg-orange-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <svg
            className="h-6 w-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-orange-900">
          {service} Service Unavailable
        </h3>
        <p className="mb-4 text-sm text-orange-700">
          The backend service is not responding. Please ensure the backend services are running.
        </p>
        <div className="space-y-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              Retry
            </button>
          )}
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-orange-600 hover:text-orange-700">
              How to start backend services
            </summary>
            <div className="mt-2 space-y-2 rounded bg-white p-3 text-xs text-gray-700">
              <p className="font-semibold">From the project root directory:</p>
              <pre className="overflow-x-auto rounded bg-gray-100 p-2">
                npm run docker:dev{'\n'}
                npm run prisma:migrate{'\n'}
                npm run prisma:seed{'\n'}
                npm run start:dev
              </pre>
              <p className="text-xs text-gray-600">
                See <code>START_BACKEND.md</code> for detailed instructions.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
