'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const metRequirements = requirements.filter((req) => req.test(password)).length;
  const strength = (metRequirements / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-destructive';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength < 40) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className={`font-medium ${strength >= 80 ? 'text-green-600' : ''}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
            {req.test(password) ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
            )}
            <span className={req.test(password) ? 'text-green-600' : ''}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword({ token, password: data.password });
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
        {/* Theme Toggle */}
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative h-12 w-[180px]"><Image src="/images/swiiff-logo.png" alt="SWIIFF Security" fill className="object-contain" priority unoptimized /></div>
          </div>

          {/* Success Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Password reset successful</CardTitle>
              <CardDescription>
                Your password has been successfully reset. You can now sign in with your new
                password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative h-12 w-[180px]"><Image src="/images/swiiff-logo.png" alt="SWIIFF Security" fill className="object-contain" priority unoptimized /></div>
        </div>

        {/* Reset Password Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
            <CardDescription>
              Your new password must be different from previously used passwords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    {...register('password')}
                    disabled={isPending}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              <PasswordStrength password={password} />

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset password
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                  tabIndex={isPending ? -1 : 0}
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
