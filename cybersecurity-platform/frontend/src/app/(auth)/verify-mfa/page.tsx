'use client';

import { MfaVerificationForm } from '@/components/auth/MfaVerificationForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyMfaContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold">Invalid verification link</h1>
          <p className="text-muted-foreground">
            This MFA verification link is invalid or has expired. Please try logging in again.
          </p>
          <a
            href="/auth/login"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Return to login
          </a>
        </div>
      </div>
    );
  }

  return <MfaVerificationForm sessionId={sessionId} />;
}

export default function VerifyMfaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <VerifyMfaContent />
    </Suspense>
  );
}
