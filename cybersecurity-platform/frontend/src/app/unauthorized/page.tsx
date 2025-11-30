import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
              <ShieldAlert className="relative h-24 w-24 text-yellow-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-8xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
            403
          </h1>

          {/* Message */}
          <h2 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You don&apos;t have permission to access this page. This area is restricted to users
            with specific roles or permissions.
          </p>

          {/* Information Box */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-lg mx-auto">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              If you believe you should have access to this page, please contact your
              administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </span>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-8">
            Need help? Contact your administrator or{' '}
            <Link href="/support" className="text-brand-blue hover:underline">
              support team
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
