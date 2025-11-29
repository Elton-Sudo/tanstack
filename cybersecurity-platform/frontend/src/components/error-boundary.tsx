'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI and logs error information
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-brand-orangeRed-100 p-4 dark:bg-brand-orangeRed-950">
                <AlertTriangle className="h-8 w-8 text-brand-orangeRed-600 dark:text-brand-orangeRed-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                  We encountered an unexpected error. Please try again or contact support if the
                  problem persists.
                </p>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full mt-4">
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button onClick={this.handleReset} className="bg-brand-blue hover:bg-brand-blue/90">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = '/')}>
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight error fallback for smaller components
 */
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-brand-orangeRed-600 dark:text-brand-orangeRed-400" />
      <div className="space-y-2">
        <h3 className="font-semibold">Failed to load</h3>
        <p className="text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

/**
 * Hook for using error boundaries functionally
 * For manual error triggering
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return (err: Error) => setError(err);
}
