'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      console.log('Reset password for:', email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
          <svg
            className="h-8 w-8 text-brand-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">We've sent a password reset link to</p>
          <p className="font-medium">{email}</p>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="font-medium text-brand-blue hover:underline"
          >
            try again
          </button>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center space-x-2 text-sm text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">No worries, we'll send you reset instructions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-blue px-4 py-2 font-medium text-white hover:bg-brand-blue/90 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Reset password'}
        </button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center space-x-2 text-sm text-brand-blue hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to login</span>
      </Link>
    </div>
  );
}
